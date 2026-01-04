// ==UserScript==
// @name         talk.lol no moe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove catbox.moe posts
// @author       You
// @match        https://www.talk.lol/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473531/talklol%20no%20moe.user.js
// @updateURL https://update.greasyfork.org/scripts/473531/talklol%20no%20moe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    Object.entries(document.querySelectorAll(".post-title a.de")).reduce(function(res, item){
        if(item[1].innerText.indexOf("catbox.moe") > 0 || item[1].innerText.indexOf("gab.com") > 0) {
            let post = item[1].parentNode.parentNode.parentNode;
            let score = post.previousElementSibling;
            post.parentNode.removeChild(score);
            post.parentNode.removeChild(post);
        }
        return res;
    }, true);
})();