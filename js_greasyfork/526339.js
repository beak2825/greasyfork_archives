// ==UserScript==
// @name         Highlight Text
// @namespace    ccn0
// @version      2
// @description  Select text, right click, and Highlight Text
// @author       CCN0
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGpJREFUOI1jYCAR/P5k9h+Zz0iuZla+U4wkGYBuM8wQogzAphkGCBqATzNBFxDSjNcFxGjGaQCxmrEaQIpmBgYGBiYsiojWjNUAbIbg0owN/EfG+LwDA3CTYYqhthNtIyOyZnIA1jCgKwAAIzA0C4OErZ8AAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/526339/Highlight%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/526339/Highlight%20Text.meta.js
// ==/UserScript==

(function() {
    var range = window.getSelection().getRangeAt(0);
    var highlight = document.createElement("span");
    highlight.style.backgroundColor = "#ff0";
    highlight.style.color = "#000";
    highlight.appendChild(range.extractContents());
    range.insertNode(highlight);
})();