// ==UserScript==
// @name         Blur Reddit Username
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blurs your reddit username in the top right corner for privacy
// @author       Frank01
// @match        https://www.reddit.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452119/Blur%20Reddit%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/452119/Blur%20Reddit%20Username.meta.js
// ==/UserScript==

addGlobalStyle('#blurredtext { filter: blur(3px); }');
let element = document.getElementById("email-collection-tooltip-id").children[1].children[0];
element.setAttribute("id","blurredtext");


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}


(function() {
    'use strict';
})();