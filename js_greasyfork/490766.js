// ==UserScript==
// @name         删除页面中的圆角(Remove rounded corners from the page)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove border radius from all elements on the page
// @author       雷明闪(melonTMD)
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490766/%E5%88%A0%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%9C%86%E8%A7%92%28Remove%20rounded%20corners%20from%20the%20page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490766/%E5%88%A0%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E5%9C%86%E8%A7%92%28Remove%20rounded%20corners%20from%20the%20page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBorderRadius() {
        document.querySelectorAll('*').forEach(function(element) {
            element.style.borderRadius = '0';
        });
    }

    // Remove border radius when the page loads
    removeBorderRadius();

    // Remove border radius when new content is added to the page
    const observer = new MutationObserver(removeBorderRadius);
    observer.observe(document.body, { childList: true, subtree: true });
})();