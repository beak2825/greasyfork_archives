// ==UserScript==
// @name         Steam Community - Remove blocked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple userscript to remove all posts and threads by blocked users on steam.
// @author       You
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @run-at document-end
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/478743/Steam%20Community%20-%20Remove%20blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/478743/Steam%20Community%20-%20Remove%20blocked.meta.js
// ==/UserScript==

(function() {
    'use strict';

    [...document.querySelectorAll(".forum_topic_name.op_hidden")].forEach(ele => {
        ele.parentElement.parentElement.removeChild(ele.parentElement);
    });

    [...document.querySelectorAll(".commentthread_deleted_comment")].forEach(ele => {
        ele.parentElement.removeChild(ele);
    });
})();