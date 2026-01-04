// ==UserScript==
// @name        EzcapeChat 80% Width
// @namespace   BaskinBros Scripts
// @version     1.3
// @author      thebranmaster
// @description Sets chat width to 80%
// @license MIT
// @match       *://*.ezcapechat.com/rooms/*/swf
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/421187/EzcapeChat%2080%25%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/421187/EzcapeChat%2080%25%20Width.meta.js
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

addGlobalStyle('#swf_chat_normal{width:80% !important}');