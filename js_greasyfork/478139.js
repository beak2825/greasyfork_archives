// ==UserScript==
// @name         酒入论坛自动刷新
// @namespace    http://your.namespace.com
// @version      1.0
// @description  自动浏览论坛首页、帮助和个人资料,目的为了挂在线时长,功能很简单,由ChatGPT编写.
// @author       Your Name
// @match        https://www.jr08.xyz/forum.php
// @match        https://www.jr08.xyz/misc.php?mod=faq
// @match        https://www.jr08.xyz/space-uid-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478139/%E9%85%92%E5%85%A5%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478139/%E9%85%92%E5%85%A5%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function navigateToUrl(url) {
        window.location.href = url;
    }

    function simulateClickAndWait(url, minDelay, maxDelay) {
        setTimeout(function() {
            navigateToUrl(url);
        }, getRandomInt(minDelay, maxDelay) * 1000);
    }

    if (window.location.href === 'https://www.jr08.xyz/forum.php') {
        // 论坛首页
        simulateClickAndWait('https://www.jr08.xyz/misc.php?mod=faq', 5, 30); // 帮助页面
    } else if (window.location.href === 'https://www.jr08.xyz/misc.php?mod=faq') {
        // 帮助页面
        simulateClickAndWait('https://www.jr08.xyz/space-uid-6188.html', 5, 30); // 个人资料
    } else if (window.location.href.startsWith('https://www.jr08.xyz/space-uid-')) {
        // 个人资料页面
        simulateClickAndWait('https://www.jr08.xyz/forum.php', 5, 30); // 论坛首页
    }
})();
