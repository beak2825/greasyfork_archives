// ==UserScript==
// @name         UE Marketplace No-Redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script removes the annoying "Redirect to external site" notification screen that occurs when clicking on external links in the UE marketplace.
// @author       auqust
// @match        https://www.unrealengine.com/marketplace/en-US/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unrealengine.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461425/UE%20Marketplace%20No-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/461425/UE%20Marketplace%20No-Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll("a[href*='https://redirect.epicgames.com/?redirectTo=']");

    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href && href.indexOf("https://redirect.epicgames.com/?redirectTo=") !== -1) {
            links[i].setAttribute("href", href.replace("https://redirect.epicgames.com/?redirectTo=", ""));
        }
    }
})();