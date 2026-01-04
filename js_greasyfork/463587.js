// ==UserScript==
// @name         獲取Bilibili動態訂閱
// @version      0.0.1
// @description  一鍵複製訂閱
// @match        https://www.bilibili.com/*
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://www.example.com/
// @downloadURL https://update.greasyfork.org/scripts/463587/%E7%8D%B2%E5%8F%96Bilibili%E5%8B%95%E6%85%8B%E8%A8%82%E9%96%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/463587/%E7%8D%B2%E5%8F%96Bilibili%E5%8B%95%E6%85%8B%E8%A8%82%E9%96%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function get_link() {
        var div_name = document.querySelector('.name');
        if (div_name) {
            // Get the link inside the div
            var link = div_name.querySelector('a');
            var rss_link_fix = "https://rsshub.app/bilibili/user/dynamic/";

            if (link) {
                // Get the href of the link
                var href = link.href;

                // 分割網址並且取得最後一個值
                var lastValue = href.split('/').pop();
                var rss_link = rss_link_fix + lastValue;

                // Show the last value in an alert
                return rss_link;
            }
        }
    }

    var current_rss_link = get_link();


    function click_to_copy_url() {
        var div_name = document.querySelector('.name');
        if (div_name) {
            // Get the first link inside the div
            var link = div_name.querySelector('a');

            if (link) {
                // Set the new href value
                link.setAttribute('href', current_rss_link);

                // Add a click event listener to the link
                link.addEventListener('click', function (event) {
                    // Prevent the default link behavior
                    event.preventDefault();
                    GM_setClipboard(current_rss_link);

                    // Copy the new href value to the clipboard
                    navigator.clipboard.writeText(newHref);
                });
            }
        }
    }

    click_to_copy_url();
})();
