// ==UserScript==
// @name        Facebook cleaner
// @namespace   facebookcleaner
// @description Hides feed
// @include     https://www.facebook.com*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14089/Facebook%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/14089/Facebook%20cleaner.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('._5pcb { opacity: 0; height: 1px; overflow: hidden }');
addGlobalStyle('._4b0l, #pagelet_group_mall ._5pcb { opacity: 1; height: auto; }');