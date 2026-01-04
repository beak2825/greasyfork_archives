// ==UserScript==
// @name        Show SL Marketplace Keywords
// @namespace   Violentmonkey Scripts
// @match       https://marketplace.secondlife.com/p/*
// @grant       none
// @version     1.0
// @author      verifiedyote
// @description Show SL Marketplace keywords in product page sidebar
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/547158/Show%20SL%20Marketplace%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/547158/Show%20SL%20Marketplace%20Keywords.meta.js
// ==/UserScript==

(function() {
    'use strict';
let selector = document.querySelector(".update-block");
let keywerd = document.querySelector('meta[name="keywords"]').content;

  selector.outerHTML += "<p class='update-block'><span>Keywords:</span> " + keywerd + "</p>";

    document.head.append(Object.assign(document.createElement("style"), {
    type: "text/css",
    textContent: 'p.update-block {min-width: 0; word-break: break-all;}'
}))
})();