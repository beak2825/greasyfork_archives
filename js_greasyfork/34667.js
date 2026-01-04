// ==UserScript==
// @name        Tabun Filters
// @author      Your mom
// @namespace   com.sunset-shimmer.tabun
// @description Ignores for blogs and comments
// @require     https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js
// @include     http://tabun.everypony.ru/*
// @include     https://tabun.everypony.ru/*
// @version     1.15
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/34667/Tabun%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/34667/Tabun%20Filters.meta.js
// ==/UserScript==


if (document.location.pathname === '/filters/' ||
    document.location.pathname === '/filters') {
    document.title = 'Фильтры / Табун - место, где пасутся брони';
}

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = { childList: true, characterData: false, attributes: false, subtree: true };


var blockedAuthors = GM_getValue("blockedAuthors", {});
var blockedBlogs = GM_getValue("blockedBlogs", []);

var articles = [];
var streamArticles = [];

/* Utils */
function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function (a, b) {
        return b.value - a.value;
    });
    return arr;
}

function Post(id) {
    var self = this;
    this.id = id;

    var i, l = Post.posts.length;
    for (i = 0; i < l; i += 1) {
        if (Post.posts[i].id === this.id) {
            return Post.posts[i];
        }
    }
    Post.posts.push(this);

    return this;
}

Post.posts = [];

Post.prototype.init = function () {

};


/* Material view base class */
function Material() { }
Material.prototype.init = function (el) {
    var self = this;
    this.el = el;
    this.$el = $(el);
    // this.$el.css({'opacity':'0'});
    this.id = this.getId();
    this.model = new Post(this.id);

    this.meta = this.getMeta();
};
Material.prototype.getId = function () { };
Material.prototype.refresh = function (data) {
    var data = data || { postId: this.id };
    if (data.postId == this.id) {
        if (!this.checkblock()) {
            this.render();
        }
    }
};
Material.prototype.checkblock = function () {

    if (blockedBlogs.indexOf(this.meta.blog) !== -1) {
        this.$el.hide();
        return true;
    }

    return false;
}
Material.prototype.render = function () { };
Material.prototype.getMeta = function () { };

/* Article view - material implementation #1 */
Article.prototype = new Material();
Article.prototype.constructor = Article;

function Article(el) {
    this.init(el);
    this.editMode = false;
}
Article.prototype.getId = function () {
    try {
        var id = this.$el.find(".topic-tags").attr('class').split(' ').pop().split('-').pop();
        return parseInt(id);
    } catch (err) {
        return 0;
    }
};
Article.prototype.getMeta = function () {
    try {
        return {
            'blog': this.$el.find(".topic-blog").attr('href').split('/').slice(-2)[0],
            'author': this.$el.find("a[rel^=author]").text(),
            'title': this.$el.find(".topic-title").text(),
            'time': this.$el.find("time").attr('datetime')
        };
    } catch (err) {
        return {};
    }
};

Article.prototype.render = function () {
    var self = this;
};

/* streamArticle view - material implementation #2 */
StreamArticle.prototype = new Material();
StreamArticle.prototype.constructor = StreamArticle;

function StreamArticle(el) {
    this.init(el);
}
StreamArticle.prototype.getId = function () {
    var id = this.$el.find("a.stream-topic").attr('href').split('/').pop().split('.')[0];
    return parseInt(id);
};
StreamArticle.prototype.getMeta = function () {
    return {
        'blog': this.$el.find(".stream-blog").attr('href').split('/').slice(-2)[0]
    };
};

StreamArticle.prototype.render = function () { };


$(document).on("post:loaded", function (data) {
    var i, l = articles.length;
    for (i = 0; i < l; i += 1) {
        articles[i].refresh(data);
    }

    var i, l = streamArticles.length;
    for (i = 0; i < l; i += 1) {
        streamArticles[i].refresh(data);
    }
});

function mutationHandler(mutationRecords) {
    var i, l = mutationRecords.length;
    for (i = 0; i < l; i += 1) {
        if (mutationRecords[i].addedNodes.length > 0) {
            updateSteamArticles();
        }
    }
}


function updateArticles() {
    if (blockedBlogs.length > 0) {
        $("article.topic").each(function (index) {
            var article = new Article(this);
            articles.push(article);
            article.refresh();
        });
    }


}

function updateSteamArticles() {
    streamArticles = [];

    if (blockedBlogs.length > 0) {
        $(".js-block-stream-content > ul > li").each(function (index) {
            var streamArticle = new StreamArticle(this);
            streamArticles.push(streamArticle);
            streamArticle.refresh();
        });
    }

}


function filterComments() {
    $(".comment").each(function () {
        if (this.className.indexOf('is-filtered') === -1) {

            var author = $(this).find(".comment-author").text().trim();
            var id = $(this).data('id');

            switch (blockedAuthors[author]) {
                case 2:
                    var $wrap = $(this);
                    var $aShow = $('<a href="#show_comment">[показать]</a>');
                    var $aVote = $('<a href="#show_comment">[наказать]</a>');

                    var $path = $('<div title="' + author + '" class="comment-content"><div class="text"><em>комментарий скрыт </em></div></div>');
                    $path.children().append($aShow);
                    $path.children().append($('<span>&nbsp;</span>'));
                    $path.children().append($aVote);

                    $aShow.click(function () {
                        $wrap.children().show();
                        $path.hide();
                    });

                    $aVote.click(function () {
                        ls.vote.vote(id, this, -1, 'comment');
                    });

                    $wrap.children().hide();
                    $wrap.append($path);

                    break;

                case 1:
                    var $wrap = $(this);
                    $wrap.find('.text img').each(function () {

                        var $img = $(this);
                        var $emo = $('<span>☺</span>');
                        $emo.css({
                            'cursor': 'pointer'
                        });
                        $emo.click(function () {
                            $img.show();
                            $emo.hide();
                        });
                        $img.after($emo);
                        $img.hide();
                    });



                default:
                    break;
            }

            this.className += ' is-filtered';
        }



    });
}

function addBlogFiltersControls($root) {
    var $table = $root.find(".table-blogs");
    $table.find('.cell-join').each(function () {
        $join = $(this);
        if (this.tagName.toUpperCase() == 'TH') {
            $join.parent().find('.cell-info').remove();
            if ($join.parent().find('.cell-filter').length === 0) {
                $join.after($('<th class="cell-filter">Фильтровать</th>'));
            }
        } else {
            var blogName = $join.parent().find(".blog-name").attr('href').split('/').slice(-2)[0];
            var checked = (blockedBlogs.indexOf(blogName) !== -1) ? "checked" : "";
            var $checkbox = $('<input type="checkbox" ' + checked + ' />');

            $join.parent().find('.cell-filter').remove();
            $join.after($('<td class="cell-filter"></td>').append($checkbox));


            $checkbox.click(function () {
                var checked = this.checked;
                if (checked) {
                    blockedBlogs.push(blogName);
                    GM_setValue("blockedBlogs", blockedBlogs);

                } else {
                    var i, l = blockedBlogs.length;
                    for (i = 0; i < l; i += 1) {
                        if (blockedBlogs[i] === blogName) {
                            blockedBlogs.splice(i, 1);
                        }
                    }
                    GM_setValue("blockedBlogs", blockedBlogs);
                }
            });

        }
    });
}

function main() {
    $('iframe').each(function () {
        this.src = this.src.replace("autoplay=1", "autoplay=0");
    });

    updateArticles();

    updateSteamArticles();

    $(".block-type-pseudomenu > ul").append("<li><a href='/filters/'>Фильтры</a></li>");

    var $brokenDrawer = $($(".block-type-pseudomenu > ul").find("li")[1]);
    if ($brokenDrawer.text() == 'Рисование') {
        $brokenDrawer.hide();
    }

    $(".block-type-stream").each(function () {
        myObserver.observe(this, obsConfig);
    });

    filterComments();

    if ($("#comments")[0]) {
        var commentsObserver = new MutationObserver(function (mutationRecords) {
            var i, l = mutationRecords.length;
            for (i = 0; i < l; i += 1) {
                if (mutationRecords[i].addedNodes.length > 0) {
                    if (mutationRecords[i].addedNodes[0].className &&
                        mutationRecords[i].addedNodes[0].className.indexOf('comment-wrapper') !== -1) {
                        filterComments();
                    }
                }
            }
        });
        commentsObserver.observe($("#comments")[0], obsConfig);
    }


    if (document.location.pathname.split('/')[1] === 'profile') {
        setStyles();

        var userName = $(".user-login").text().trim();

        var ignoreType = blockedAuthors[userName];

        var $wrap = $('#profile_actions');

        $wrap.append($('<br>'));

        var $liIgnore = $('<li class="user-filter">');
        $wrap.append($liIgnore);

        var $radioIgnore1 = $('<label><input type="radio" name="user-filter" value="0" ' + (!!ignoreType ? "" : "checked") + '>&nbsp;Показывать всё</label>');
        $radioIgnore1.appendTo($liIgnore);
        $radioIgnore1.click(function () {
            blockedAuthors[userName] = undefined;
            delete blockedAuthors[userName];
            GM_setValue("blockedAuthors", blockedAuthors);
        });

        var $radioIgnore2 = $('<label><input type="radio" name="user-filter" value="1" ' + (ignoreType === 1 ? "checked" : "") + '>&nbsp;Скрывать картинки в комментариях</label>');
        $radioIgnore2.appendTo($liIgnore);
        $radioIgnore2.click(function () {
            blockedAuthors[userName] = 1;
            GM_setValue("blockedAuthors", blockedAuthors);
        });

        var $radioIgnore3 = $('<label><input type="radio" name="user-filter" value="2" ' + (ignoreType === 2 ? "checked" : "") + '>&nbsp;Скрывать комментарии</label>');
        $radioIgnore3.appendTo($liIgnore);
        $radioIgnore3.click(function () {
            blockedAuthors[userName] = 2;
            GM_setValue("blockedAuthors", blockedAuthors);
        });

    }

    if (document.location.pathname.split('/')[1] === 'blogs') {
        setStyles();

        addBlogFiltersControls($("#blogs-list-original"));

        var blogsObserver = new MutationObserver(function (mutationRecords) {
            var i, l = mutationRecords.length;
            for (i = 0; i < l; i += 1) {
                if (mutationRecords[i].addedNodes.length > 0) {
                    if (mutationRecords[i].addedNodes[0].nodeName.toUpperCase() === 'TABLE') {
                        if (mutationRecords[i].addedNodes[0].className.indexOf('table-blogs') !== -1) {
                            addBlogFiltersControls($("#blogs-list-search"));
                            $("#blogs-list-search").click(function () {
                                addBlogFiltersControls($("#blogs-list-original"));
                            });
                        }
                    }
                }
            }
        });

        blogsObserver.observe($("#blogs-list-search")[0], obsConfig);
    }


    if (document.location.pathname === '/filters/' ||
        document.location.pathname === '/filters') {
        document.title = 'Фильтры / Табун - место, где пасутся брони';

        $("#content").empty();
        renderSettings();

        setStyles();
    }
}

function setStyles() {
    $("head").append("<style>\
      h3 {\
        font-size: 15px !important;\
        margin-bottom: 10px !important;\
        font-family: Verdana,sans-serif !important;\
      }\
      .actions:hover {\
        color: grey;\
      }\
      .cell-filter {\
        text-align: center !important;\
      }\
      .user-filter > label {\
        color: #727a90 !important;\
        display: block !important;\
      }\
      .dooms-day {\
        color: darkred;\
        margin: 20px;\
      }\
  </style>");
}

$(document).ready(function () {
    main();
});


function renderSettings() {
    var settings = '<div><h3>Настройки фильтра</h3></div>';
    var $settings = $(settings);

    var doomsDay = new Date(2016, 6, 24);
    var today = new Date();

    var until = Math.floor((doomsDay - today) / (1000*60*60*24))

    if (until >= 0) {
        var $disclaimer = $('<div class="dooms-day">Вы используете финальную версию скрипта фильтров Табуна.<br>' +
        'В этой версии отключена поддержка фильтров по своим тегам и оставлены только игноры комментариев и блогов.<br>' +
        'Код скрипта распространяется под <a href="http://www.wtfpl.net/txt/copying/">WTFPL</a> и будет доступен для скачивания в течение ' + until + ' дней.</div>');

        $settings.append($disclaimer);
    } else {
        var $disclaimer = $('<div class="dooms-day">Поддержка скрипта фильтров Табуна прекращена.</div>');

        $settings.append($disclaimer);
    }

    // Blogs
    var i, l = blockedBlogs.length;
    if (l > 0) {
        var $blockedBlogs = $('<ul><h4>Заблокированные блоги:</h4></ul>');
        for (i = 0; i < l; i += 1) {
            var blog = blockedBlogs[i];
            var $li = $('<li><a href="/blog/' + blog + '">' + blog + '</a></li>');
            $li.appendTo($blockedBlogs);

            var $del = $("<span class='actions'>&nbsp;[x]</span>");
            $del.css({
                'cursor': 'pointer'
            });
            $del.click(function () {
                var b = $(this).prev().text().trim();
                var i, l = blockedBlogs.length;
                for (i = 0; i < l; i += 1) {
                    if (blockedBlogs[i] === b) {
                        blockedBlogs.splice(i, 1);
                    }
                }

                GM_setValue("blockedBlogs", blockedBlogs);
                $(this).parent().remove();
            });

            $li.append($del);
        }
        $blockedBlogs.appendTo($settings);
        $settings.append('<br>');
    }

    // Authors
    var $blockedAuthors = $('<ul><h4>Заблокированные авторы:</h4></ul>');
    $blockedAuthors.hide();
    for (var author in blockedAuthors) {
        if (blockedAuthors.hasOwnProperty(author)) {
            $blockedAuthors.show();

            var $li = $('<li><a href="/profile/' + author + '/" class="ls-user">' + author + '</a></li>');
            $li.appendTo($blockedAuthors);

            var $del = $("<span class='actions'>&nbsp;[x]</span>");
            $del.css({
                'cursor': 'pointer'
            });
            $del.click(function () {
                var userName = $(this).prev().text().trim();
                blockedAuthors[userName] = undefined;
                delete blockedAuthors[userName];
                GM_setValue("blockedAuthors", blockedAuthors);

                $(this).parent().remove();
            });

            $li.append($del);

        }
    }
    $blockedAuthors.appendTo($settings);
    $settings.append('<br>');




    $("<br>").appendTo($settings);
    $("<br>").appendTo($settings);
    $("#content").append($settings);
}
