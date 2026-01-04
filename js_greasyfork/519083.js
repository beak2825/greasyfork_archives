// ==UserScript==
// @name            B站首页插件提示屏蔽
// @name:en         Bilibili Extension Alert Block
// @namespace       http://tampermonkey.net/
// @version         0.15
// @description     屏蔽B站首页的浏览器插件提示条
// @description:en  Hide the extension alert on the main page of bilibili.com
// @author          Hikara
// @license         MIT
// @match           https://www.bilibili.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/519083/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/519083/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements
    function hideElements() {
            // remove the extension tip
            const elements = document.querySelectorAll('.adblock-tips').forEach(el => el.remove());
    }

    // Run the function after the page loads
    window.addEventListener('load', hideElements);
})();