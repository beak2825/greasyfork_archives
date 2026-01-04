// ==UserScript==
// @name         kbin comment reorder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  moves kbin comment submit form to the top of the page
// @author       raltsm4k
// @match        https://kbin.social/*
// @icon         https://codeberg.org/Kbin/kbin-core/raw/branch/develop/public/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468426/kbin%20comment%20reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/468426/kbin%20comment%20reorder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var container = document.querySelector("#content");
    var comment_form = document.querySelector("#content > div#comment-add");
    var comments_block = document.querySelector("#content > div#comments");

    container.insertBefore(comment_form, comments_block);
})();