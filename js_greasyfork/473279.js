// ==UserScript==
// @name         Tumblr De-Notifier
// @namespace    http://circlejourney.net/
// @version      0.3
// @license      MIT
// @description  Remove Tumblr the unread dashboard post counter.
// @author       Circlejourney
// @match        *://*.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473279/Tumblr%20De-Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/473279/Tumblr%20De-Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function() {
        window.tumblr.getCssMap().then( (cssMap) => {
            const { navItem, notificationBadge } = cssMap;
            const newStyle = document.createElement("style");
            newStyle.innerHTML = `.${navItem}[title='Home'] .${notificationBadge} { display: none !important; }`;
            document.head.appendChild(newStyle);
        });
        console.log("Tumblr De-Notifier initialised.")
    });
})();