// ==UserScript==
// @name        探测黑名单Plus手机 - colg.cn
// @namespace   Violentmonkey Scripts
// @match       https://bbs.colg.cn/thread*
// @match       https://bbs.colg.cn/forum*
// @grant       none
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @version     1.4
// @author      -
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description 2020/11/27 下午10:18:36
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441489/%E6%8E%A2%E6%B5%8B%E9%BB%91%E5%90%8D%E5%8D%95Plus%E6%89%8B%E6%9C%BA%20-%20colgcn.user.js
// @updateURL https://update.greasyfork.org/scripts/441489/%E6%8E%A2%E6%B5%8B%E9%BB%91%E5%90%8D%E5%8D%95Plus%E6%89%8B%E6%9C%BA%20-%20colgcn.meta.js
// ==/UserScript==
(function () {
    'use strict';
    jQuery.noConflict();
    (function ($) {
        window.addEventListener('load', function () { //等缓存完了再运行
            var matchs = window.location.href.indexOf("forum.php") > -1; //true是手机浏览器,false是pc浏览器
            var selfuid = "";
            if (matchs) { //手机浏览器
                selfuid = /uid=\d+/.exec(jQuery(" body > div.footer > div:nth-child(1) > a:nth-child(1)").attr("href"))[0].slice(4, );
                checkthreadMobile();
                checkformMobile();
                jQuery("#callUpContainer").hide(); //屏蔽掉唤起APP
            } else { //pc浏览器
                selfuid = /uid=\d+/.exec(jQuery("#um > p > strong > a:first").attr("href"))[0].slice(4, );
                checkthread();
                checkform();
            }

            function uidCheckBlack(checkeduid, checkedname) {
                let defer = jQuery.Deferred();
                let res = "";
                GM_xmlhttpRequest({ //获取列表
                    method: "GET",
                    url: "https://bbs.colg.cn/home.php?mod=spacecp&ac=friend&op=add&uid=" + checkeduid,
                    responseType: 'document',
                    headers: { //'Cookie''Host''Referer''Origin''User-Agent'
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
                    },
                    onload: function (response) {
                        if (jQuery(response.response).find("#return_").length == 0) {
                            //当已经是好友的时候,返回friend
                            if (jQuery(response.response).find("#messagetext p:first").text().indexOf("好友") != -1) {
                                console.log("发现好友:" + checkedname + " ,uid是: " + checkeduid);
                                res = "friend";
                                defer.resolve(res);
                            } else if (jQuery(response.response).find("#messagetext p:first").text().indexOf("隐私设置") != -1) {
                                console.log("拉黑了你的是: " + checkedname + " ,uid是: " + checkeduid);
                                res = "black";
                                defer.resolve(res);
                            } else {
                                console.log("已经检测:" + checkedname + " ,uid是: " + checkeduid);
                                res = "others";
                                defer.resolve(res);
                            }
                        } else {
                            console.log("已经检测:" + checkedname + " ,uid是: " + checkeduid);
                            res = "others";
                            defer.resolve(res);
                        };

                    }
                });
                return defer.promise();
            }

            function userNameTouid(usernames) {
                let tt = GM_getValue(usernames, "-1");
                if (tt !== "-1") {
                    return tt;
                } else {
                    let defer = jQuery.Deferred();
                    GM_xmlhttpRequest({ //获取列表
                        method: "GET",
                        url: "https://bbs.colg.cn/home.php?mod=space&username=" + usernames,
                        responseType: 'document',
                        headers: { //'Cookie''Host''Referer''Origin''User-Agent'
                            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
                        },
                        onload: function (response) {
                            if (jQuery(response.response).find("#spacename").text().indexOf("个人空间") != -1) { //找到用户空间
                                let useruid = /uid=\d+/.exec(jQuery(response.response).find("#spaceinfoshow > span > a:nth-child(4)[href]").attr("href"))[0].slice(4, );
                                console.log("发现:" + usernames + "个人uid: " + useruid);
                                GM_setValue(usernames, useruid);
                                defer.resolve(useruid);
                            } else { //没有找到用户
                                console.log("已经检测:" + usernames + " ,没有找到用户");
                                defer.resolve("-1");
                            };
                        }
                    });
                    return defer.promise();
                }
            }

            function checkthread() {
                let $threadList = jQuery("div.authi > a.xw1[target='_blank'][href]");
                if ($threadList.length > 0) {
                    $threadList.each(function () {
                        //找到uid
                        let uid = /uid=\d+/.exec(jQuery(this).attr("href"))[0].slice(4, );
                        if (uid === selfuid) return;
                        let intext = jQuery(this).text();
                        let $thisobj = jQuery(this);
                        jQuery.when(uidCheckBlack(uid, intext)).done(function (data) {
                            if (data == "black") {
                                $thisobj.addClass("red");
                                $thisobj.css("color", "#FF0000");
                                $thisobj.text(intext + "(拉黑)");
                            } else if (data == "friend") {
                                $thisobj.css("color", "#FFCC00");
                                $thisobj.text(intext + "(好友)");
                            } else {
                                $thisobj.css("color", "#009900");
                            }
                        });
                    });
                };
            }

            function checkthreadMobile() {
                let $threadList = jQuery("ul.authi  b>a[class][href][onclick]");
                if ($threadList.length > 0) {
                    $threadList.each(function () {
                        //找到uid
                        let uid = /uid=\d+/.exec(jQuery(this).attr("href"))[0].slice(4, );
                        if (uid === selfuid) return;
                        let intext = jQuery(this).text();
                        let $thisobj = jQuery(this);
                        jQuery.when(uidCheckBlack(uid, intext)).done(function (data) {
                            if (data == "black") {
                                $thisobj.addClass("red");
                                $thisobj.css("color", "#FF0000");
                                $thisobj.text(intext + "(拉黑)");
                            } else if (data == "friend") {
                                $thisobj.css("color", "#FFCC00");
                                $thisobj.text(intext + "(好友)");
                            } else {
                                $thisobj.css("color", "#009900");
                            }
                        });
                    });
                };
            }

            function checkformMobile() {
                //列表遍历
                let $fromList = jQuery("div.threadlist span.by");
                var myusername = jQuery("body > div.footer > div:nth-child(1) > a:nth-child(1)").text();
                if ($fromList.length > 0) {
                    $fromList.each(function () {
                        let tempusername = jQuery(this).text();
                        if (myusername === tempusername) return;
                        let $thisobj = jQuery(this);
                        jQuery.when(userNameTouid(tempusername)).done(function (data) {
                            jQuery.when(uidCheckBlack(data, tempusername)).done(function (data) {
                                if (data == "black") {
                                    $thisobj.addClass("red");
                                    $thisobj.css("color", "#FF0000");
                                    $thisobj.text(tempusername + "(拉黑)");
                                } else if (data == "friend") {
                                    $thisobj.css("color", "#FFCC00");
                                    $thisobj.text(tempusername + "(好友)");
                                } else {
                                    $thisobj.css("color", "#009900");
                                }
                            });
                        })

                    });
                };

            }

            function checkform() {
                //列表遍历
                let $fromList = jQuery("#threadlisttableid td.by > cite > a[c='1'][mid][href]");
                if ($fromList.length > 0) {
                    $fromList.each(function () {
                        //找到uid
                        let uid = /uid=\d+/.exec(jQuery(this).attr("href"))[0].slice(4, );
                        if (uid === selfuid) return;
                        let intext = jQuery(this).text();
                        let $thisobj = jQuery(this);
                        jQuery.when(uidCheckBlack(uid, intext)).done(function (data) {
                            if (data == "black") {
                                $thisobj.addClass("red");
                                $thisobj.css("color", "#FF0000");
                                $thisobj.text(intext + "(拉黑)");
                            } else if (data == "friend") {
                                $thisobj.css("color", "#FFCC00");
                                $thisobj.text(intext + "(好友)");
                            } else {
                                $thisobj.css("color", "#009900");
                            }
                        });
                    });
                };

            }
        }, false);

    })(jQuery);
})();
