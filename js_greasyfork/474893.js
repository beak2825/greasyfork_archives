// ==UserScript==
// @name         Open Links in New Tab
// @name:zh-CN   在新标签页中打开
// @namespace    Hypnos
// @version      1.011
// @description  Open links in new tab when clicked
// @description:zh-cn 点击网页链接时在新标签页中打开
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/474893/Open%20Links%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/474893/Open%20Links%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        var target = event.target;
        if (target.tagName === 'A') {
            target.setAttribute('target', '_blank');
        }
    });
})();