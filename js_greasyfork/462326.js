// ==UserScript==
// @name         Reviewable.io - add line numbers
// @namespace    https://bengr.dev/
// @version      0.1
// @description  Add line numbers to reviewable.io
// @author       Ben Grynhaus (me@bengr.dev)
// @match        https://reviewable.io/reviews/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reviewable.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462326/Reviewableio%20-%20add%20line%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/462326/Reviewableio%20-%20add%20line%20numbers.meta.js
// ==/UserScript==

(function () {
    "use strict";

    GM_addStyle(`
 div[data-line-number]:not([data-line-number="0"]):before {
  content: attr(data-line-number);
  position: absolute;
  color: #444;
  padding: 1px 3px 3px;
  font-size: x-small;
  display: block;
  width: 20px;
  text-align: right;
}`);

    GM_addStyle(`
div[data-line-number]:not([data-line-number="0"]) div.hljs {
  margin-left: 26px;
}
`);
})();

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