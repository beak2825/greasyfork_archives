// ==UserScript==
// @name         起点任务
// @namespace    https://github.com/sunrishe/Tampermonkey/tree/master/QiDianAutoMission
// @version      1.1
// @description  起点中文网自动挂机、领取在线经验、完成每日任务的油猴脚本
// @author       Sunrishe
// @match        https://my.qidian.com/level*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      qidian.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370807/%E8%B5%B7%E7%82%B9%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/370807/%E8%B5%B7%E7%82%B9%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    var params = {
        // 书评区编号
        forumId: "22305390000123802",
        // 男频书籍ID
        boyBookId: "3439785",
        // 女频书籍ID
        girlBookId: "1010964303",
    };

    // 登录识别码
    var r = /\b(?:_csrfToken=)(\w+)\b/.exec(document.cookie);
    var _csrfToken = r != null ? r[1] : "";

    var T = {
        ajax: function (url, method, data, success) {
            data._csrfToken = _csrfToken;
            var options = {
                url: url,
                method: method.toUpperCase(),
                data: $.param(data),
                headers: {
                    "Cookie": document.cookie
                },
                onload: function (res) {
                    console.log(res.status)
                    console.log(res.responseText)
                    if (res.status != 200 || typeof success != 'function') {
                        return;
                    }
                    var content = res.responseText;
                    try {
                        success(JSON.parse(content));
                    } catch (e) {
                        success(content);
                    }
                }
            };
            if (options.method == "GET") {
                options.url += (options.url.indexOf("?") == -1 ? "?" : "&") + options.data;
                delete options.data;
            } else if (options.method == "POST") {
                options.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
            }
            console.log(options)
            GM_xmlhttpRequest(options);
        },
        open: function (url) {
            var id = 'qidian_' + new Date().getTime();
            $('<iframe id="' + id + '" name="' + id + '" src="' + url + '"></iframe>')
                .appendTo($("body"))
                .hide()
                .load(function () {
                    $(this).remove();
                });
        }
    };

    var tasks = {
        // 登录
        denglu: function () {
            T.open("https://my.qidian.com/");
        },
        // 拜访书友
        baifang: function () {
            T.ajax("https://my.qidian.com/ajax/follow/myFollow", "get", {
                pageIndex: 1,
                pageSize: 20
            }, function (r) {
                var data = r.data.listInfo;
                for (var i = 0; i < 5; i++) {
                    T.open("https:" + data[i].linkUrl + "?targetTab=0");
                }
            });
        },
        // 发帖
        fatie: function () {
            T.ajax("https://my.qidian.com/ajax/bookReview/myTopics", "get", {
                pageIndex: 1,
                pageSize: 20
            }, function (r) {
                var info = r.data.listInfo;
                if (info.length == 0 || info[0].lastReplyTime.indexOf('今天') == -1) {
                    T.ajax("https://forum.qidian.com/ajax/my/BookForum/publishTopic", "post", {
                        forumId: params.forumId,
                        topicId: "",
                        content: "每日一贴，希望书越写越好"
                    });
                }
            });
        },
        // 投票
        toupiao: function () {
            var vote = function (bookId) {
                T.ajax("https://book.qidian.com/ajax/book/GetUserRecomTicket", "get", {
                    bookId: bookId,
                    userLevel: 0
                }, function (r) {
                    var cnt = r.data.enableCnt || 0;
                    if (cnt == 0) {
                        return;
                    }
                    T.ajax("https://book.qidian.com/ajax/book/VoteRecomTicket", "post", {
                        bookId: bookId,
                        cnt: cnt,
                        enableCnt: cnt
                    });
                });
            };

            vote(params.boyBookId);
            vote(params.girlBookId);
        },
        // 领取活跃度
        huoyuedu: function () {
            T.ajax("https://my.qidian.com/ajax/userActivity/mission", "get", {}, function (r) {
                var data = r.data.bagList;
                for (var i in data) {
                    var bag = data[i];
                    if (bag.status === 1) {
                        T.ajax("https://my.qidian.com/ajax/userActivity/take", "post", {
                            bagId: bag.bagId,
                        });
                    }
                }
            });
        },
        // 领取旧经验值
        lingjiujingyan: function () {
            T.ajax("https://my.qidian.com/ajax/score/GetOld", "get", {}, function (r) {
                var data = r.data || {};
                var totalOldScore = data.totalOldScore || 0,
                    totalGetScore = data.totalGetScore || 0;
                if (totalOldScore > totalGetScore) {
                    T.ajax("https://my.qidian.com/ajax/score/ExchangeOld", "post", {});
                }
            });
        }
    };

    // 自动领取在线经验值，每5s判断
    var auto = setInterval(function () {
        if ($('.elGetExp').length > 0) {
            $('.elGetExp')[0].click();
        } else {
            if ($('.elIsCurrent').length === 0) {
                clearInterval(auto);
            }
        }
    }, 5 * 1000);

    // 延迟执行任务，2分钟后执行
    setTimeout(function () {
        for (var i in tasks) {
            tasks[i]();
        }
    }, 2 * 60 * 1000);

    // 定时刷新页面，1小时刷新一次页面
    setInterval(function () {
        window.location.reload();
    }, 1 * 60 * 60 * 1000);
})(jQuery);
