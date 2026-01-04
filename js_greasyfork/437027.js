// ==UserScript==
// @name        探测黑名单Plus - colg.cn
// @namespace   Violentmonkey Scripts
// @match       https://bbs.colg.cn/thread*
// @match       https://bbs.colg.cn/forum*
// @grant       none
// @version     1.3
// @author      -
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description 2020/11/27 下午10:18:36
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437027/%E6%8E%A2%E6%B5%8B%E9%BB%91%E5%90%8D%E5%8D%95Plus%20-%20colgcn.user.js
// @updateURL https://update.greasyfork.org/scripts/437027/%E6%8E%A2%E6%B5%8B%E9%BB%91%E5%90%8D%E5%8D%95Plus%20-%20colgcn.meta.js
// ==/UserScript==
(function () {
    'use strict';
    jQuery.noConflict();
    (function ($) {
        window.addEventListener('load', function () { //等缓存完了再运行
          function uidCheckBlack(checkeduid, checkedname) {
            let defer = jQuery.Deferred();
            let res = "";
            jQuery.ajax({
                type: "get",
                url: "https://bbs.colg.cn/home.php?mod=spacecp&ac=friend&op=add&uid=" + checkeduid,
                dataType: "html",
                async: true, //默认为true，即默认为异步请求，否则为同步请求
                success: function (data) {
                    if (jQuery(data).find("#return_").length == 0) {
                        //当已经是好友的时候,返回friend
                        if (jQuery(data).find("#messagetext p:first").text().indexOf("好友") != -1) {
                            console.log("发现好友:" + checkedname + " ,uid是: " + checkeduid);
                            res = "friend";
                            defer.resolve(res);
                        } else if (jQuery(data).find("#messagetext p:first").text().indexOf("隐私设置") != -1) {
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

                },
                error: function (data) {
                    console.log(data);
                }
            });
            return defer.promise();
        }
        var selfuid = /uid=\d+/.exec(jQuery("#um > p > strong > a:first").attr("href"))[0].slice(4, );

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
        checkthread();
        checkform();
        }, false);
    })(jQuery);
})();
