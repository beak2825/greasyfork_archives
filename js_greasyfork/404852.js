// ==UserScript==
// @name         拍蚊神器
// @version      0.0.2
// @description  自动反对
// @author       jasony
// @include      *://*.zhihu.com/*
// @run-at       document-body
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @namespace https://greasyfork.org/users/151462
// @downloadURL https://update.greasyfork.org/scripts/404852/%E6%8B%8D%E8%9A%8A%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/404852/%E6%8B%8D%E8%9A%8A%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var state = {
        userInfo: null,
        trickers: GM_getValue('trickers') ? JSON.parse(GM_getValue('trickers')) : []
    };
    $.ajaxSetup({
        contentType: 'application/json',
        dataType: 'json'
    });
    function throttle(fn, wait) {
        wait = wait || 0;
        var timerId, lastTime = 0;

        function throttled() {
            var args = arguments;
            var currentTime = new Date();
            if (currentTime >= lastTime + wait) {
                fn.apply(this, args);
                lastTime = currentTime;
            } else {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function() {
                    fn.apply(this, args);
                }, wait);
            }
        }
        return throttled;
    }
    function getUserInfo(cb) {
        $.get('https://www.zhihu.com/api/v4/me').done(function(info) {
            state.userInfo = info;
            cb && cb(info);
        }).fail(function() {
            state.userInfo = null
            cb && cb(false);
        });
    }
    function postVoterAnswer(id, type, cb) {
        type = type == null ? 'up' : type;
        $.post('https://www.zhihu.com/api/v4/answers/' + id + '/voters', JSON.stringify({ type: type })).done(function(info) {
            cb && cb(true);
        }).fail(function(err) {
            cb && cb(false);
        });
    }
    function postVoterArticle(id, voting, cb) {
        $.post('https://www.zhihu.com/api/v4/articles/' + id + '/voters', JSON.stringify({ voting: voting })).done(function(info) {
            cb && cb(true);
        }).fail(function(err) {
            cb && cb(false);
        });
    }
    function getAnswers(url_token, cb) {
        var answers = [];
        $.ajax('https://www.zhihu.com/people/' + url_token + '/answers', { dataType: 'html' }).done(function(htmlStr) {
            var initialData = htmlStr && /<script\s+id="js-initialData".*?>(.*?)<\/script>/.exec(htmlStr) && RegExp.$1 && JSON.parse(RegExp.$1);
            var answersObj = initialData && initialData.initialState && initialData.initialState.entities && initialData.initialState.entities.answers ? initialData.initialState.entities.answers : {};
            if (!$.isEmptyObject(answersObj)) {
                for (var k in answersObj) {
                    answers.push(answersObj[k.toString()]);
                }
            }
            cb && cb(null, answers);
        }).fail(function(err) {
            cb && cb(err);
        });
    }
    function getPosts(url_token, cb) {
        var posts = [];
        $.ajax('https://www.zhihu.com/people/' + url_token + '/posts', { dataType: 'html' }).done(function(htmlStr) {
            var initialData = htmlStr && /<script\s+id="js-initialData".*?>(.*?)<\/script>/.exec(htmlStr) && RegExp.$1 && JSON.parse(RegExp.$1);
            var articlesObj = initialData && initialData.initialState && initialData.initialState.entities && initialData.initialState.entities.articles ? initialData.initialState.entities.articles : {};
            if (!$.isEmptyObject(articlesObj)) {
                for (var k in articlesObj) {
                    posts.push(articlesObj[k.toString()]);
                }
            }
            cb && cb(null, posts);
        }).fail(function(err) {
            cb && cb(err);
        });
    }
    var tGetPosts = throttle(getPosts, 3000);
    var tGetAnswers = throttle(getAnswers, 3000);
    var tPostVoterAnswer = throttle(postVoterAnswer, 3000);
    var tPostVoterPost = throttle(postVoterArticle, 3000);
    function batchVote(cb) {
        state.trickers.forEach(function(url_token) {
            function doPosts(cb) {
                tGetPosts(url_token, function(err, posts) {
                    if (!err && posts && posts.length) {
                        posts.forEach(function(post, index) {
                            if (post.voting !== -1) {
                                tPostVoterPost(post.id, -1);
                            } else {
                                console.log(post.title, '已经反对过了，跳过');
                            }
                            if (index === posts.length - 1) {
                                cb && cb();
                            }
                        });
                    } else {
                        cb && cb();
                    }
                });
            }
            function doAnswers(cb) {
                tGetAnswers(url_token, function(err, answers) {
                    if (!err && answers && answers.length) {
                        answers.forEach(function(answer, index) {
                            if (answer.relationship && answer.relationship.voting !== -1) {
                                tPostVoterAnswer(answer.id, 'down');
                            } else {
                                console.log(answer.excerpt, '已经反对过了，跳过');
                            }
                            if (index === answers.length - 1) {
                                cb && cb();
                            }
                        });
                    } else {
                        cb && cb();
                    }
                });
            }
            doPosts(function() {
                doAnswers(function() {
                    cb && cb();
                });
            });
        });
    }
    var MarkTrickerButton = {
        init: function() {
            this.url_token = document.location.pathname.split('/')[2];
            if (!this.url_token) return;
            this.initEvent();
            this.render();
        },
        initEvent: function() {
            var that = this;
            var url_token = this.url_token;
            $('.MemberButtonGroup').on('click', '.MarkTrickerButton--unmark', function() {
                state.trickers.push(url_token);
                GM_setValue('trickers', JSON.stringify(state.trickers));
                that.render();
                batchVote();
            });
            $('.MemberButtonGroup').on('click', '.MarkTrickerButton--marked', function() {
                var foundIndex = state.trickers.findIndex(function(tricker) { return tricker === url_token; });
                if (foundIndex > -1) {
                    state.trickers.splice(foundIndex, 1);
                    GM_setValue('trickers', JSON.stringify(state.trickers));
                    that.render();
                }
            });
        },
        render: function() {
            var url_token = this.url_token;
            if (!$('.MemberButtonGroup .MarkTrickerButton').length) {
                $('.MemberButtonGroup').append('<button class="Button MarkTrickerButton MarkTrickerButton--unmark">标记骗子</button>');
                $('.MemberButtonGroup').append('<button class="Button Button--primary Button--red MarkTrickerButton MarkTrickerButton--marked"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Ban" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>已标记骗子</button>');
            }
            var foundUrlToken = state.trickers.find(function(tricker){ return tricker === url_token; });
            $('.MarkTrickerButton').hide();
            if (foundUrlToken) {
                $('.MarkTrickerButton--marked').show();
            } else {
                $('.MarkTrickerButton--unmark').show();
            }
        }
    };

    $(function() {
        MarkTrickerButton.init();
        batchVote();
    });
})();