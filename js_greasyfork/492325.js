// ==UserScript==
// @name         linux.do nonmembers only
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决非会员浏览 linux.do 出现的 bug
// @author       You
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492325/linuxdo%20nonmembers%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/492325/linuxdo%20nonmembers%20only.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    // document.querySelector("body").classList.remove("topic-in-gated-category");
    // document.querySelector("#ember35").remove();
    GM_addStyle (`
        .topic-in-gated-category,
        .post-stream {
            max-height: none !important;
            height: auto !important;
            overflow: auto !important;
        }
        .ember-view.topic-in-gated-category,
        .topic-in-gated-category .container.posts::before,
        .topic-in-gated-category .container.posts::after{
            display: none !important;;
        }
    `);
})();