// ==UserScript==
// @name         中国电信四川公司网络信息安全能量自动收集
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在四川电信网络信息安全能量知识库页面上,等待10秒后自动点击"收集网络安全能量"按钮,并在页面跳转后继续执行
// @author       Jay Kwok
// @match        *://anquanri.sctel.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497575/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E5%9B%9B%E5%B7%9D%E5%85%AC%E5%8F%B8%E7%BD%91%E7%BB%9C%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E8%83%BD%E9%87%8F%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/497575/%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1%E5%9B%9B%E5%B7%9D%E5%85%AC%E5%8F%B8%E7%BD%91%E7%BB%9C%E4%BF%A1%E6%81%AF%E5%AE%89%E5%85%A8%E8%83%BD%E9%87%8F%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

/* eslint-env jquery */

(function() {
    'use strict';

    function autoClickAfterDelay() {
        const btnText = "收集网络安全能量";
        const btnSelector = ".sj .btz";

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const btn = $(btnSelector + ":not([disabled])");
                const alertInfo = $(".sj .alert_info").text().trim();

                if (btn.length > 0 && alertInfo === btnText) {
                    btn.click();
                    console.log("Button clicked!");
                    observer.disconnect();
                }
            });
        });

        function initObserver() {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["disabled", "class"]
            });
        }

        initObserver();

        document.addEventListener("turbolinks:load", function() {
            initObserver();
        });
    }

    $(document).ready(function() {
        autoClickAfterDelay();
    });

})();