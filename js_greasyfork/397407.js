// ==UserScript==
// @name         ancapchan for 2ch
// @name:ru      Анкапователь
// @namespace    po
// @version      2020.10.23.1
// @author       Атлант Рыночекпорешаев
// @description  Анкапчует врагов Абу(либералов, русофобов, антикоммунистов и котлетки).
// @homepageURL  https://pastebin.com/raw/LZ6FzmY0
// @include      https://2ch.hk/po/*
// @include      https://2ch.pm/po/*

// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397407/ancapchan%20for%202ch.user.js
// @updateURL https://update.greasyfork.org/scripts/397407/ancapchan%20for%202ch.meta.js
// ==/UserScript==

// Инструкция: качаем firefox и расширение https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
// Для хрома https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// Для оперы https://addons.opera.com/ru/extensions/details/tampermonkey-beta/
// Жмем New user script и кидаем туда всю эту пасту, может работать в паре с куклоскриптом. Не забываем нажать на вкл.


// клики по двачую ставятся в случайном интервале между этими двумя значениями
var minClickDelay = 19000;     // минимальная задержка между кликами, мс
var maxClickDelay = 30000;     // максимальная задержка между кликами, мс

var iconsArray = [
    "Либерализм",
    "Либертарианство",
    "Анкап",
];

// слова для лайков
var likeRegexArray = [
    /пидора(шк|х)/im,
    /ватник/im,
    /пыня/im,
    /хуйло/im,
    /ботокс/im,
    /залуп/im,
    /подзалупн/im,
    /плешивы/im,
    /грязноштан/im,
    /пынеход/im,
    /госкап/im,
    /этатист/im,
    /гомосолдат/im,
    /вытиран/im,
    /членин/im,
    /сралин/im,
    /комибляд/im,
    /комипидор/im,
    /комигниль/im,
    /колумнист/im,
    /красножоп/im,
    /комуняк/im,
    /гулаг/im,
    /расклева/im,
    /комиглист/im,
    /котлетк(и|ок)/im,
    /стилан[\-\s]+3000/im,
    /стирай штаны/im,
    /рашка/im,
    /п(о|а)рашка/im,
    /вестник (дури|фури)/im,
    /совок/im,
    /туалетн.{2,3} бумаг/im,
    /анкапователь/im,
];

function noNull(val, nullValue) {
    if (val == null || val == undefined) {
        return nullValue;
    } else {
        return val;
    }
}

function filterBySage(post) {
    return noNull(post.querySelector('.post__anon'), {innerText: ''}).innerText.indexOf('Heaven') != -1;
}

function filterByRegex(post) {
    var toCheck = [
        post.querySelector('.post__title'),
        post.querySelector('.post__message'),
        post.querySelector('.post__message_op'),
    ]
    .filter(function(post) { return post })
    .map(function(post) { return post.innerHTML })
    .map(function(html) {
        return html
            .replace(/<su[bp]><su[bp]><su[bp]><su[bp]><su[bp]>.*?<\/su[bp]><\/su[bp]><\/su[bp]><\/su[bp]><\/su[bp]>(?!<\/su[bp]>)/g, "")
            .replace(/<(?:a href=(?!"(?:irc|mailto):).*?<\/a|span class="[suo](?:poiler)?"|\/?(?:em|strong|su[bp]))>/g, "")
            .replace(/<(?:a href=(?!"(?:irc|mailto):).*?<\/a|span class="[suo](?:poiler)?"|\/?(?:em|span|strong|su[bp]))>/g, "");
    })
    .filter(function(post) { return post.length > 0 });

    for(var regex of likeRegexArray) {
        var check = toCheck.filter(function(item) {
            return regex.test(item);
        }).length > 0;
        if (check) {
            return true;
        }
    }
    return false;
}
function makeIterator(array) {
    var i = 0;
    if (array[i]) {
        return function() {
            return array[i++];
        };
    } else {
        return function() { return false };
    }
}

function scheduleCall(nextElm, callback) {
    var elm = nextElm();
    if (elm) {
        callback(elm);
        setTimeout(function() {
            scheduleCall(nextElm, callback);
        }, 1000 + minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
    }
}

function disableFullscreenClose(fn) {
    var me = this;
    return function() {
        if (MExpandMedia && MExpandMedia.close) {
            var fullScreenClose = MExpandMedia.close;
            MExpandMedia.close = function() {};
            fn.apply(me, arguments);
            MExpandMedia.close = fullScreenClose;
        } else {
            fn.apply(me, arguments);
        }
    };
}

var elmClick = disableFullscreenClose(function(elm) {
    elm.click();
});

function dislikePosts(posts) {
    scheduleCall(
        makeIterator(posts.map(function(item) {
            return item.querySelector('.post__rate_type_dislike');
        })
                     .filter(function(item) {
            return !item.classList.contains('post__rate_disliked');
        })),
        elmClick
    );
}

function likePosts(posts) {
    scheduleCall(
        makeIterator(posts.map(function(item) {
            return item.querySelector('.post__rate_type_like');
        })
                     .filter(function(item) {
            return !item.classList.contains('post__rate_liked');
        })),
        elmClick
    );
}

function watchOnNewPosts(newPostsCallback) {
    var targetNode = document.body;
    if (targetNode) {
        var config = { childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    var posts = Array.prototype.filter.call(mutation.addedNodes, function(node) {
                        return node instanceof Element && node.classList.contains('thread__post')
                    });

                    if (posts.length > 0) {
                        newPostsCallback(posts);
                    }
                }

            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

function makeFilterByIcons(icons) {
    return function (post) {
        var img = post.querySelector('.post__icon img');
        return img && img.title && icons.indexOf(img.title) != -1;
    };
}

function filterNotLikedOrDisliked(post) {
    return post.querySelector('.post__rate_liked') == null && post.querySelector('.post__rate_disliked') == null;
}

function fnOr() {
    var args = Array.from(arguments);
    return function(item) {
        return args.some(function(fn) {
            return fn(item);
        });
    };
}

var posts = document.querySelectorAll(".thread__post");
var opPosts = document.querySelectorAll(".thread__oppost");
var allPosts = Array.from(new Set([...posts, ...opPosts]));

var likesFilter = fnOr(makeFilterByIcons(iconsArray), filterByRegex);
var postsToLike = allPosts.filter(likesFilter).filter(filterNotLikedOrDisliked);
likePosts(postsToLike);

var dislickesFilter = fnOr(filterBySage, makeFilterByIcons(['Коммунизм', 'Социализм', 'Соцдем']));
dislikePosts(allPosts.filter(dislickesFilter).filter(filterNotLikedOrDisliked));

watchOnNewPosts(function(posts) {
    setTimeout(function() {
        likePosts(posts.filter(likesFilter));
        dislikePosts(posts.filter(dislickesFilter));
    }, 0);
});