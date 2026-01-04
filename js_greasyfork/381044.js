// ==UserScript==
// @name         钉钉网页版全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       阿轮
// @match        https://im.dingtalk.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381044/%E9%92%89%E9%92%89%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/381044/%E9%92%89%E9%92%89%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==


function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


GM_addStyle(
`#layout-main {
width: 100%;
flex: 1;
}`
);
GM_addStyle(
    `#body {
height: 100%}`);

(function() {
    'use strict';
    // Your code here...
})();