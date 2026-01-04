// ==UserScript==
// @name         HacPai防黄图哥聊天室插件
// @namespace    https://github.com/AdlerED
// @version      1.0.3
var version = "1.0.3";
// @description  https://hacpai.com/cr 日防夜防，黄图哥难防
// @author       Adler
// @connect      hacpai.com/cr
// @include      https://hacpai.com/cr*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @note         20-04-30 1.0.3 修复插件功能
// @note         19-07-04 1.0.1 只屏蔽黄图哥的图片，不屏蔽文字了
// @note         19-07-04 1.0.0 初版发布，黄图哥受死吧
// @downloadURL https://update.greasyfork.org/scripts/391016/HacPai%E9%98%B2%E9%BB%84%E5%9B%BE%E5%93%A5%E8%81%8A%E5%A4%A9%E5%AE%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/391016/HacPai%E9%98%B2%E9%BB%84%E5%9B%BE%E5%93%A5%E8%81%8A%E5%A4%A9%E5%AE%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    var blackList = [ "@2501224066", "@Sunnnner" ];
    setInterval(function() {
        $(".chats__item").each(function(index,domEle) {
            var username = $(domEle).find(".chatAt").text();
            console.log(username);
            if ($.inArray(username, blackList) != -1) {
                var htgHtml = $(domEle).find(".vditor-reset").html();
                if (htgHtml.indexOf("img") != -1) {
                    $(domEle).find(".vditor-reset").html("<h3>已屏蔽</h3>");
                }
            }
        });
    }, 1000);
})();