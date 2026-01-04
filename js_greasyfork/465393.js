// ==UserScript==
// @name         YouTube Real Link
// @version      0.1
// @description  Replace the "https://www.youtube.com/redirect?..." links by the direct link on YouTube
// @author       Zixyj
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @namespace https://greasyfork.org/users/1071917
// @downloadURL https://update.greasyfork.org/scripts/465393/YouTube%20Real%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/465393/YouTube%20Real%20Link.meta.js
// ==/UserScript==

function findLink(link) {
    return decodeURIComponent(link.match(/q\=([^&]+)/)[1]);
}

(function() {
    'use strict';

    window.onload = () => {
        setInterval(() => {
            let links = document.querySelectorAll("a");

            for (const link of links) {
                if (link.href.startsWith("https://www.youtube.com/redirect?")) {
                    let l = findLink(link.href);

                    if (l.startsWith("http://") || l.startsWith("https://")) {
                        link.href = l;
                    }
                }
            }
        }, 2000);
    };
})();