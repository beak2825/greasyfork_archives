// ==UserScript==
// @name        miped hide spam messages + a.aliexpress.ru
// @description miped hide spam messages
// @namespace   miped
// @version     1.7.3
// @include     *miped.ru*
// @include     *mipped.com*
// @grant       unsafeWindow
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/402959/miped%20hide%20spam%20messages%20%2B%20aaliexpressru.user.js
// @updateURL https://update.greasyfork.org/scripts/402959/miped%20hide%20spam%20messages%20%2B%20aaliexpressru.meta.js
// ==/UserScript==
(function() {
'use strict';
var
/********************************************************/
/* все что выше не менять */
/********************************************************/
// https://miped.ru/f/threads/obsuzhdenie-kuponov-aliexpress-maj.104662/unread
// https://mipped.com/f/threads/obsuzhdenie-kuponov-aliexpress-maj.104662/unread


minimum_likes_for_show_post = 3, // скрыть сообщение, если у пользователя менее N лайков
max_messages_count_for_hide = 20, // скрыть сообщение, если у пользователя менее N сообщений
max_messages_count_for_image = 5000, // скрыть картинки, если у пользователя менее N сообщений
new__a_aliexpress_ru = 'a.aliexpress.com', // новый адрес вместо a.aliexpress.ru
new__aliexpress_ru = 'ru.aliexpress.com', // новый адрес вместо aliexpress.ru

// 1 - включено
// 0 - выключено
hide_all_newbee_messages = 1, // скрывать все сообщения (не только с ссылками), если у пользователя 0 репы и кол-во сообщений меньше, чем указано в max_messages_count_for_hide
hide_all_newbee_images = 1, // скрывать все картинки, если у пользователя 0 репы и кол-во сообщений меньше, чем указано в max_messages_count_for_hide
short_links = 1, // удаляет все после знака ?
hide_by_spam_list = 1, // скрывать сообщение, если оно содержит слово из spam_list
enable_minimum_likes_for_show_post = 0, // вкл\выкл сокрытие сообщений, если у поста (сообщения) менее minimum_likes_for_show_post лайков

// список спам-слов, все слова или предложения должны быть разделены знаком "|". все сообщения которые будут содержать данное слово\предложение будут скрываться
spam_list = "коронавирус|короновирус|covid".trim().split("|"),


image_src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaWQ9Ikljb24iIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGUvPjxwb2x5bGluZSBwb2ludHM9IjM1IDQ1IDQzIDQ1IDQ2IDQ1IDU3IDQ1IDUxLjUgMzUgNDYgMjUgNDAuNSAzNSAzOC44MyAzOC4wNCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzRkNGQ0ZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjJweCIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iMTgiIHI9IjQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM0ZDRkNGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoycHgiLz48cmVjdCBoZWlnaHQ9IjQ4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojNGQ0ZDRkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4IiB3aWR0aD0iNjIiIHg9IjEiIHk9IjgiLz48cG9seWdvbiBwb2ludHM9IjI1IDE1IDM0IDMwIDQzIDQ1IDI1IDQ1IDcgNDUgMTYgMzAgMjUgMTUiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM0ZDRkNGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoycHgiLz48cG9seWxpbmUgcG9pbnRzPSI1IDE1IDUgMTIgOCAxMiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzRkNGQ0ZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjJweCIvPjxwb2x5bGluZSBwb2ludHM9IjUgNDkgNSA1MiA4IDUyIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojNGQ0ZDRkO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4Ii8+PHBvbHlsaW5lIHBvaW50cz0iNTkgMTUgNTkgMTIgNTYgMTIiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM0ZDRkNGQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoycHgiLz48cG9seWxpbmUgcG9pbnRzPSI1OSA0OSA1OSA1MiA1NiA1MiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzRkNGQ0ZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjJweCIvPjwvc3ZnPg=='; // картинка - заглушка


/********************************************************/
/* все что ниже не менять */
/********************************************************/

var spam_messages_count = 0; // счетчик кол-ва спам сообщений
var spam_images = []; // спам картинки

addLoadEvent(function() {
    enable_minimum_likes_for_show_post = parseInt(ls('enable_minimum_likes_for_show_post'));
    var post_els = qsa('.message--post'),
        posts = [];

    for (var i = post_els.length - 1; i >= 0; i--) {
        posts.push(parsePost(post_els[i]));
    }

    // var externalLink = qsa('.externalLink');
    // for (var i = externalLink.length - 1; i >= 0; i--) {
    //     var message = parents(externalLink[i], 'message');
    //     var messages_count = parseInt(message.querySelector('.concealed').innerText.replace(/[^\d]+/, ''));

    //     if (messages_count < max_messages_count_for_hide) {
    //         message.classList.add('this_is_spam_message');
    //         spam_messages_count++;

    //     } else {
    //         var href = externalLink[i].getAttribute('href');

    //         if (href.indexOf('a.aliexpress.ru') > 0 && new__a_aliexpress_ru != '') {
    //             var new_href = href.replace('a.aliexpress.ru', new__a_aliexpress_ru);
    //             externalLink[i].innerHTML = new_href
    //             externalLink[i].setAttribute('href', new_href);

    //         } else if (href.indexOf('aliexpress.ru') > 0 && new__aliexpress_ru != '') {
    //             var new_href = href.replace('aliexpress.ru', new__aliexpress_ru);
    //             externalLink[i].innerHTML = new_href
    //             externalLink[i].setAttribute('href', new_href);

    //         } else if (short_links && href.indexOf('aliexpress') && href.indexOf('?') > 0) {
    //             var new_href = href.split('?')[0];
    //             if (externalLink[i].innerHTML == href) {
    //                 externalLink[i].innerHTML = new_href;
    //             }

    //             externalLink[i].setAttribute('href', new_href);
    //         }
    //     }
    // }

    if (hide_all_newbee_images) {
        var old_src;
        for (var i = posts.length - 1; i >= 0; i--) {
            // console.log(max_messages_count_for_image > posts[i]['extra']['msg_count'], max_messages_count_for_image, posts[i]['extra']['msg_count'], posts[i]['name']);
            if (max_messages_count_for_image > posts[i]['extra']['msg_count'] /*&& posts[i]['extra']['repa'] == 0*/) {
                posts[i]['post']['imgs'] = posts[i]['message'].querySelectorAll('img');
                // posts[i]['post']['imgs'] = posts[i]['post']['imgs'].concat(posts[i]['message'].querySelectorAll('div[data-src]'));

                // console.log(posts[i]['name'], posts[i]['post']['imgs']);

                for (var t = posts[i]['post']['imgs'].length - 1; t >= 0; t--) {
                    if (posts[i]['post']['imgs'][t] != null) {
                        old_src = posts[i]['post']['imgs'][t].getAttribute('src');
                        if (old_src == null) {
                            old_src = posts[i]['post']['imgs'][t].getAttribute('data-src');
                        }
                        // console.log(old_src);
                        if (
                            (
                                old_src.indexOf('cdn.miped.ru/f/data/attachments/180/') == -1 &&
                                old_src.indexOf('cdn.mipped.com/f/attachments/180/') == -1
                            )
                            && (
                                   old_src.indexOf('/f/proxy.php') > -1 
                                || old_src.indexOf('/f/attachments') > -1
                            )
                        ) {
                            posts[i]['post']['imgs'][t].setAttribute('src', image_src);
                            posts[i]['post']['imgs'][t].setAttribute('data-src', image_src);
                            posts[i]['post']['imgs'][t].setAttribute('old-src', old_src);
                            posts[i]['post']['imgs'][t].classList.add('this_is_spam_image');
                            spam_images.push(posts[i]['post']['imgs'][t]);
                        }
                    }
                }
            }
        }
    }

    handle_posts();

    if (hide_by_spam_list && (
        location.href.indexOf('miped.ru/f/threads') > -1 ||
        location.href.indexOf('mipped.com/f/threads') > -1
    )) {
        for (var i = posts.length - 1; i >= 0; i--) {
            if (isConainSpamWord(posts[i]['message'].innerText)) {
                var message = parents(posts[i]['message'], 'message');
                message.classList.add('this_is_spam_message');
                spam_messages_count++;
            }
        }
    }

    if (spam_images.length > 0) {
        setTimeout(function() {
            var old_src = '';
            var spam_images = qsa('.this_is_spam_image');
            for (var i = spam_images.length - 1; i >= 0; i--) {
                spam_images[i].onclick = function() {
                    old_src = this.getAttribute('old-src');
                    this.setAttribute('src',  old_src);
                    this.classList.remove('this_is_spam_image');
                }
            }
        }, 1e3);
    }

    if (spam_messages_count > 0) {
        setTimeout(function() {
            var spam_messages = qsa('.this_is_spam_message');
            for (var i = spam_messages.length - 1; i >= 0; i--) {
                spam_messages[i].onclick = function() {
                    this.classList.remove('this_is_spam_message');
                }
            }
        }, 1e3);
    }

    document.body.innerHTML += '<div class="enable_minimum_likes_for_show_post"></div>';
    setTimeout(function() {
        var enable_minimum_likes_for_show_post_el = document.querySelector('.enable_minimum_likes_for_show_post');
        enable_minimum_likes_for_show_post_el.addEventListener('click', function() {
            if (enable_minimum_likes_for_show_post == 1) {
                enable_minimum_likes_for_show_post = 0;
                document.querySelector('.enable_minimum_likes_for_show_post').classList.add('disabled');

                var this_is_likes_filter_message_els = qsa('.this_is_likes_filter_message');
                for (var i = this_is_likes_filter_message_els.length - 1; i >= 0; i--) {
                    this_is_likes_filter_message_els[i].classList.remove('this_is_likes_filter_message');
                }
            } else {
                enable_minimum_likes_for_show_post = 1;
                document.querySelector('.enable_minimum_likes_for_show_post').classList.remove('disabled');
                handle_posts();
            }

            ls('enable_minimum_likes_for_show_post', enable_minimum_likes_for_show_post);
        });
        if (enable_minimum_likes_for_show_post != 1) {
            enable_minimum_likes_for_show_post_el.classList.add('disabled');
        }
    }, 1e2);

    var styles = '<style> .this_is_spam_message {}\
.enable_minimum_likes_for_show_post{\
    position: fixed;\
    background: url("https://mipped.com/f/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png.pagespeed.ce.RIGPvjxbbo.png") no-repeat 0 0 / 32px;\
    width: 32px;\
    height: 32px;\
    left: 5px;\
    bottom: 5px;\
}\
.enable_minimum_likes_for_show_post.disabled{\
    filter: grayscale(1);\
}\
.this_is_likes_filter_message, .this_is_spam_message {\
    height: 30px;\
    overflow: hidden;\
    position: relative;\
    cursor: pointer;\
}\
.this_is_likes_filter_message>*, .this_is_spam_message>* {\
    display: none;\
}\
.this_is_likes_filter_message::before, .this_is_spam_message::before {\
    content: "This is spam message";\
    width: 100%;\
    height: 100%;\
    position: absolute;\
    left: 0;\
    top: 0;\
    text-align: center;\
    color: red;\
    background: rgba(255, 255, 255, .1);\
    z-index: 1;\
    line-height: 2;\
    -webkit-transition: ease 200ms;\
    -o-transition: ease 200ms;\
    transition: ease 200ms;\
    font-size: 14px;\
}\
.this_is_likes_filter_message::before{\
    content: "This is filtered message";\
    color: green;\
}\
.this_is_likes_filter_message:hover::before, .this_is_spam_message:hover::before {\
    background: rgb(250, 250, 250);\
    color: rgb(73, 147, 197);\
}\
.this_is_spam_image {\
    width: 80px;\
    cursor: pointer;\
    opacity: 0.3;\
    -webkit-transition: ease 300ms;\
    -o-transition: ease 300ms;\
    transition: ease 300ms;\
}\
.this_is_spam_image:hover {\
    opacity: 1;\
}\</style>';
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerText = styles;
    document.body.appendChild(css);
});

function handle_posts(posts) {
    spam_messages_count = 0;

    var post_els = qsa('.message--post'),
        posts = [];
    for (var i = post_els.length - 1; i >= 0; i--) {
        posts.push(parsePost(post_els[i]));
    }

    if (
        (hide_all_newbee_messages || hide_all_newbee_images || enable_minimum_likes_for_show_post && minimum_likes_for_show_post > 0) 
        && (location.href.indexOf('miped.ru/f/threads') > -1 || location.href.indexOf('mipped.com/f/threads') > -1)
    ) {
        if (hide_all_newbee_messages || minimum_likes_for_show_post > 0) {
            for (var i = posts.length - 1; i >= 0; i--) {
                if (max_messages_count_for_hide > posts[i]['extra']['msg_count'] && posts[i]['extra']['repa'] == 0) {

                    posts[i]['post'].classList.add('this_is_spam_message');
                    spam_messages_count++;
                }
                if (enable_minimum_likes_for_show_post && minimum_likes_for_show_post > posts[i]['post_likes'].length) {
                    posts[i]['post'].classList.add('this_is_likes_filter_message');
                    spam_messages_count++;
                }
            }
        }
    }
}

function isConainSpamWord(text) {
    for (var i = spam_list.length - 1; i >= 0; i--) {
        if (text.indexOf(spam_list[i]) > -1) {
            return true;
        }
    }
    return false;
}

function qsa(e) {
    try {
        return document.querySelectorAll(e);
    } catch (t) {
        console.log(t);
        return null;
    }
}

function parents(e, sel) {
    var a = e.parentNode;
    if (a.classList.contains(sel)) {
        return a;
    } else {
        return parents(a, sel);
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function parsePost(post) {
    return {
        'name': post.querySelector('a.username').innerText,
        'extra': parseExtra(post),
        'post': post,
        'message': post.querySelector('.message-cell--main'),
        'post_likes': post.querySelectorAll('.reactionsBar bdi'),
    };
}


function parseExtra(post) {
    var linked = {
                'дней': 'rega',
                'репу': 'repa',
                'розы': 'promo',
                'сооб': 'msg_count',
                'лайк': 'like_count'
            },
        extras = post.querySelectorAll('.message-userExtras dl'),
        r = {},
        parsed = [];

    for (var i = extras.length - 1; i >= 0; i--) {
        if (extras[i].innerText.indexOf("\n") > -1) {
            parsed = extras[i].innerText.toLowerCase().split("\n");
            for (var l in linked) {
                if (parsed[0].indexOf(l) > -1) {
                    if (linked[l] == 'rega') {
                        parsed[1] = datetotime('d m Y', parsed[1]);
                    } else {
                        parsed[1] = parsed[1].replace(/[^\d]+/, '');
                    }
                    r[ linked[l] ] = parseInt(parsed[1]);
                    break;
                }
            }
        }
    }

    r.repa = 0; // fix
    return r;
}

/**
 * Дату в timestamp
 * 
 * @param  string   template 
 * @param  string   date 
 * @return string
 */
function datetotime(template, date){
    var d = date.split( template[1] );
    template = template.split( template[1] );
    var month = 'январь,февраль,март,апрель,май майский,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь';
    var m = d[ template.indexOf('m') ];

    if (month.indexOf( m ) > -1) {
        month = month.split(',');
        m = getFromArr(m, month);
    }

    var newDate = m
            + "/" + d[ template.indexOf('d') ]
            + "/" + d[ template.indexOf('Y') ];
    return (new Date(newDate).getTime());

    function getFromArr(text, arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i].indexOf(text) > -1) {
                return i + 1;
            }
        }
    }
}

/**
 * Функция работы с LocalStorage
 *
 * @param name
 * @param text
 * @returns {*}
 */
function ls(name, text){
    try {
        if (typeof name == 'undefined') {
            console.log('ls()');
            localStorage.clear();
            sessionStorage.clear();

        } else if (typeof text != 'undefined') {
            localStorage[name] = (typeof text == 'object' ? JSON.stringify(text) : text);
            console.log('ls(' + name + ', ' + text + ')');
        } else try {
            r = (typeof localStorage[name] != 'undefined' ? 
                        (
                            localStorage[name].indexOf('{') == 0 ? 
                                JSON.parse(localStorage[name]) : 
                                localStorage[name]
                        ) :
                        ''
                    );
            console.log('ls(' + name + ') = ' + r);
            return r;
        } catch (e) {
            return (typeof localStorage[name] != 'undefined' ? localStorage[name] : '');
        }

    } catch(e) {console.log(e);}
}

})();