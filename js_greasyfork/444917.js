// ==UserScript==
// @name         Youtube shorts redirector
// @version      1.1
// @description  redirects youtube shorts to the actual video page
// @author       blazor67
// @match        *.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/323925
// @downloadURL https://update.greasyfork.org/scripts/444917/Youtube%20shorts%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/444917/Youtube%20shorts%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vid = document.querySelector("#watch7-content > meta:nth-child(6)").getAttribute("content");
    window.location.href="https://youtube.com/v/"+vid;
})();