// ==UserScript==
// @name        Prevent javascript:void(0) tabs
// @namespace   lwkjef
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      lwkjef
// @description Prevents middle-click, ctrl-click, or shift-click on javascript links from opening blank javascript:void(0) tabs.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510800/Prevent%20javascript%3Avoid%280%29%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/510800/Prevent%20javascript%3Avoid%280%29%20tabs.meta.js
// ==/UserScript==

document.addEventListener('auxclick', function (e) {
    if (e.target.matches('a[href^="javascript:"]') && e.button === 1) {
        e.preventDefault();
    }
});

document.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="javascript:"]') && (e.ctrlKey || e.shiftKey)) {
        e.preventDefault();
    }
});
