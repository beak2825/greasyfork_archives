// ==UserScript==
// @name         苹果日报订阅破解脚本
// @namespace    gqqnbig.me
// @version      0.2.1
// @description  在苹果日报网站，允许不订阅阅读新闻。
// @author       gqqnbig
// @match        https://tw.appledaily.com/new/realtime/*
// @match        https://tw.entertainment.appledaily.com/realtime/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/386216/%E8%8B%B9%E6%9E%9C%E6%97%A5%E6%8A%A5%E8%AE%A2%E9%98%85%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/386216/%E8%8B%B9%E6%9E%9C%E6%97%A5%E6%8A%A5%E8%AE%A2%E9%98%85%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hookRemove() {
        if (typeof(jQuery)!="undefined") {
            (function ($)
             {
                $.fn.trueRemove = $.fn.remove;

                $.fn.remove = function ()
                {

                    //var ret = oldRemove.apply(this, arguments);

                    return this;
                };
            })(jQuery);
            clearInterval(handle);

            $(() => {
                $(".ndPaywall").trueRemove();
                $(".ndArticle_margin").show().css("visibility","visible");
            });
        }
    }

    let handle = setInterval(hookRemove, 10);
})();