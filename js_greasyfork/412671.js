// ==UserScript==
// @name         Twitter新标签看大图+自动无留言转推
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412671/Twitter%E6%96%B0%E6%A0%87%E7%AD%BE%E7%9C%8B%E5%A4%A7%E5%9B%BE%2B%E8%87%AA%E5%8A%A8%E6%97%A0%E7%95%99%E8%A8%80%E8%BD%AC%E6%8E%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/412671/Twitter%E6%96%B0%E6%A0%87%E7%AD%BE%E7%9C%8B%E5%A4%A7%E5%9B%BE%2B%E8%87%AA%E5%8A%A8%E6%97%A0%E7%95%99%E8%A8%80%E8%BD%AC%E6%8E%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    jQuery.noConflict();
    (function ($) {
        //.....

        //全局事件监听click，如果有click，就检查url
        window.addEventListener("click", urlcheck);
        //全局监听，如果有scroll，就检查转推
        window.addEventListener("scroll", _checkRetweet);

        //检查url的函数是不是包含'/photo/'，包含了就清除所有绑定的事件并且绑定我们自己的click事件，如果不包含就返回
        function urlcheck() {
            let currentUrl = document.location.href;
            if (currentUrl.includes("/photo/")) {
                setTimeout(bangclick, 150);
                //console.log("检查url，确认包含/photo/");
            } else {
                //console.log("检查url不包含photo，成功");
                //$("#layers > div.css-1dbjc4n img[src]").unbind();
                //console.log("不包含photo取消了所有图片的绑定事件成功");
                return;
            };
            if ($("div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d[role=menu] div[role=menuitem]").length == 1) {
                //console.log("检查1个转推菜单成功");
                setTimeout(_clickRetweet, 50);
            };
        };

        function bangclick() {
            //console.log("bangclick()运行成功，哈哈哈哈成功");
            $("#layers > div.css-1dbjc4n img[src]").unbind();
            //console.log("包含photo取消了所有图片的绑定事件成功");
            $("#layers > div.css-1dbjc4n img[src]").on('click', function (e) {
                window.open(e.target.getAttribute("src"), "_blank");
                urlcheck();
                //console.log(e.target.getAttribute("src"));
            })
        };
        //scroll检测函数，每次转动都先取消转推的所有事件，再重新绑上_clickRetweet
        function _checkRetweet() {
            $("article  div.css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-156q2ks.r-1mdbhws > div:nth-child(2) > div").unbind();
            $("article  div.css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-156q2ks.r-1mdbhws > div:nth-child(2) > div").on("click", _clickRetweet);
        };
        //点击一下后，再50毫秒后先检测转推数量==1，点击
        function _clickRetweet() {
            setTimeout(function () {
                if ($("div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d[role=menu] div[role=menuitem]").length == 1) {
                    $("div.css-1dbjc4n.r-14lw9ot.r-1f0042m.r-1upvrn0.r-1ekmkwe.r-1udh08x.r-u8s1d[role=menu] div[role=menuitem]").click();
                }
            }, 50);
        };
    })(jQuery);
    // Your code here...
})();