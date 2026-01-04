// ==UserScript==
// @name         TryGalaxy Everywhere
// @namespace    github.com/hmjz100
// @version      0.1
// @homepageURL  https://viayoo.com/
// @author       Hmjz100
// @description  修改网页信息以实现在任何浏览器都能尝试Galaxy设备
// @run-at       document-start
// @match        *.trygalaxy.com/*
// @match        *://trygalaxy.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489158/TryGalaxy%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/489158/TryGalaxy%20Everywhere.meta.js
// ==/UserScript==
(function() {
    // 判断是否该执行
    const key = encodeURIComponent('TryGalaxyEverywhere:执行判断');
    if (window[key]) {
        return;
    };
    window[key] = true;

    // 开始执行代码
    Object.defineProperty(window.navigator, 'standalone', {
        get: function() {
            return true;
        }
    });
    Object.defineProperty(window.navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 mobile/15E148 Safari/604.1';
        }
    });

})();