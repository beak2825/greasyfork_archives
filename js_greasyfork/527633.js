// ==UserScript==
// @name           V2EX Pro Improvement
// @description    为 V2EX 添加自动签到、新标签页打开、替换站内搜索、提醒所有人、楼中楼、自动解析图片链接等功能
// @icon           https://i.loli.net/2020/03/13/DMA2TbVNUwyoFcQ.jpg
// @author         Jack Li
// @include        https://*.v2ex.com/*
// @include        https://v2ex.com/*
// @version        1.1.0
// @license        MIT
// @grant          GM_addStyle
// @namespace      https://greasyfork.org/en/users/142069-jackqt
// @homepageURL    https://greasyfork.org/en/users/142069-jackqt
// @downloadURL https://update.greasyfork.org/scripts/527633/V2EX%20Pro%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/527633/V2EX%20Pro%20Improvement.meta.js
// ==/UserScript==

// 自动签到 代码来自 caoyue@v2ex
(function(){
    var load, execute, loadAndExecute;
    load = function(a, b, c) {
        var d;
        d = document.createElement("script"),
        d.setAttribute("src", a),
        b != null && d.addEventListener("load", b),
        c != null && d.addEventListener("error", c),
        document.body.appendChild(d);
        return d;
    }, execute = function(a) {
        var b, c;
        typeof a == "function" ?
            b = "(" + a + ")();" :
            b = a,

        c = document.createElement("script"),
        c.textContent = b,
        document.body.appendChild(c);
        return c;
    }, loadAndExecute = function(a, b) {
        return load(a, function() {
            return execute(b);
        });
    };

    loadAndExecute("//code.jquery.com/jquery-2.2.4.min.js", function() {
        if (!$("a[href='/signup']").length &&
            !$("a[href='/signin']").length &&
            document.body.innerHTML.indexOf(";<\/span> 创建新回复 <\/div>") == -1 ) {
            var uid=$.find('a[href^="/member/"]')[0].innerHTML;// 用户名
            var dateinfo=new Date().getUTCDate();// 获得 GMT 时间今天几号
            var SigninInfo=uid + ":" + dateinfo + "";
            var daily = $('input[id="search"]');
            if (daily.length && localStorage.SigninInfo != SigninInfo ) {
                $.ajax({url:"/"});
                daily.val("正在检测每日签到状态...");
                $.ajax({
                    url: "/mission/daily",
                    success: function(data) {
                        var awards = $(data).find('input[value^="领取"]');
                        if (awards.length) {
                            //daily.val ("正在" + awards.attr ("value") + "...");
                            daily.val("正在领取今日的登录奖励......");
                            $.ajax({
                                url: awards.attr('onclick').match(/(?=\/).+?(?=\')/),
                                success: function(data) {
                                    daily.val("正在提交...");
                                    var days=data.split("已连续登")[1].split(" ")[1];
                                    if ( $('a[href="/mission/daily"]').length==1 ) {
                                        $('a[href="/mission/daily"]').parent().parent().fadeOut(3000);
                                    }
                                    $.ajax({
                                        url: "/balance",
                                        success: function(data) {
                                            function p(s) {return s < 10 ? '0' + s: s;} // 自动补 0
                                            var date2="" + new Date().getUTCFullYear() + p(new Date().getUTCMonth()+1) +p(new Date().getUTCDate());
                                            if (data.indexOf(date2+"的每日登录奖励")!="-1") {
                                                daily.val( "已连续领取" + days + "天，本次领到" + data.split("每日登录")[2].split(" ")[1] + "铜币" );
                                                localStorage.SigninInfo = SigninInfo;
                                            } else {
                                                daily.val( "自动领取遇到意外，你可以试试手动领。" );
                                            }
                                        }
                                    });
                                },
                                error: function() {
                                    daily.val("网络异常 :(");
                                }
                            });
                        }else{
                            if (data.indexOf("已领取") != -1) {
                                daily.val("今日奖励领取过了");
                                localStorage.SigninInfo = SigninInfo;
                            } else {
                                daily.val("无法辩识领奖按钮 :(");
                            }
                        }
                    },
                    error: function() {
                        daily.val("请手动领取今日的登录奖励！");
                    }
                });
            } else {
                //console.log("");
            }
        }
    });
})();


// 图片链接自动转换成图片 代码来自 caoyue@v2ex
(function (){
    var links = document.links;
    for (var i=0;i<links.length;i++){
        var link = links[i];
        if (/^http.*\.(?:jpg|jpeg|jpe|bmp|png|gif)/i.test(link.href)
            && !/<img\s/i.test(link.innerHTML) && link.href.indexOf("v2ex.com/tag")==-1){
            link.innerHTML = "<img title='" + link.href + "' src='" + link.href + "' />";
        }
    }
})();

// 无头像模式
 (function() {
    'use strict';

    GM_addStyle(`#comment_container > .cell[id] > table tbody > tr > td:first-child { width: 0 !important; display: none; }`);

    const comments_container = document.querySelector('#Main > div:nth-child(4):has(div[id])')
    if (comments_container) {
        comments_container.id = "comment_container"
    }
})();

//V2EX 帖子盖楼显示
 (function() {
    function parse_comments_no(comment_string) {
        if (!comment_string) {
            return 0;
        }
        const regexp = /#\d+\S?/i;
        let matches = comment_string.match(regexp);
        if (matches && matches.length > 0) {
            return parseInt(matches[0].replace('#', '').replace(' ', ''));
        }

        return 0;
    }

    function parse_reply_username(comment_string) {
        if (!comment_string) {
            return undefined;
        }

        const regexp = /@<a\shref="\/member\/.*">([a-zA-Z0-9_]+)<\/a>/gi;
        let matches = comment_string.match(regexp);
        console.log(`[D] parse_reply_username.matches: ${matches}`)
        if (matches && matches.length > 0) {
            return />(.*)</.exec(matches[0])[1];
        }

        return undefined;
    }

    function parse_username(comment_string) {
        if (!comment_string) {
            return undefined;
        }

        let matches = /(.*)\s<font.*font>/.exec(comment_string);
        if (matches && matches.length > 0) {
            return matches[1]
        }
        return undefined;
    }

    // 楼层序号
     var comment_no = $('div.cell > table > tbody > tr > td:nth-child(3) > div.fr > span').get().map(i => i.innerHTML);
    // 回复内容
     var comment_strings = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content').get().map(i => i.innerHTML);
    var comment_username_list = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a').get().map(i => i.innerHTML);

    var comment_content_nodes = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content');
    var comments = $('#Main > div:nth-child(4) > div[id].cell');

    var comment_user_nodes = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a');
    var post_author_username = $('#Main > div:nth-child(2) > div.header > small > a')[0]?.innerHTML;
    var loginUser = $('#Rightbar > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(3) > span > a')
    loginUser = loginUser.length ? loginUser[0].innerHTML :null ;

    let i = 1;
    while(i < comments.length) {
        let comments_logic_no = parse_comments_no(comment_strings[i]);
        if (comments_logic_no > 0) {
            comment_content_nodes[comments_logic_no - 1].append(comments[i]);
            i++;
            continue;
        }

        let reply_user = parse_reply_username(comment_strings[i]);
        if (reply_user) {
            for (let j = i - 1; j >= 0; j--) {
                if (comment_username_list[j] === reply_user) {
                    comment_content_nodes[j].append(comments[i]);
                    break;
                }
            }
        }

        i++;
    }
})();
