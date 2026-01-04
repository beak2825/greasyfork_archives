// ==UserScript==
// @name         Back to old reddit!
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Redirects to old reddit when appropriate
// @author       Vellithe
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468767/Back%20to%20old%20reddit%21.user.js
// @updateURL https://update.greasyfork.org/scripts/468767/Back%20to%20old%20reddit%21.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let href = location.href;
    if (href.indexOf("//") != 0) {
        href = href.replace(/(?<!https:)\/\//, "/");
    }

    if (href.toLowerCase().indexOf("/gallery") != -1 || href.toLowerCase().indexOf("/poll") != -1) {
        // gallery and poll do not work in old reddit
    } else if (href.indexOf("www.reddit.com") != -1) {
        href = href.replace("www.reddit.com", "old.reddit.com");
    } else if (href.indexOf("https://reddit.com") == 0) {
        href = href.replace("https://reddit.com", "https://old.reddit.com");
    }

    if (href !== location.href) {
        location.href = href;
    }
})();