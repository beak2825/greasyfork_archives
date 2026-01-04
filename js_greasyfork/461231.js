// ==UserScript==
// @name         Hentai Image Dark Mode
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  Makes the webapges on hentai-img.com dark themed. Very rushed, just needed something basic in the moment.
// @author       You
// @match        *://*.hentai-img.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-img.com
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/461231/Hentai%20Image%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/461231/Hentai%20Image%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        document.querySelectorAll(".image-list-item").forEach(o => o.style.backgroundColor = "#111111");
        document.body.style.backgroundColor = "#111111";
        const keys = "outline main_contents right left center_left left_sidebar center".split(" ");
        for (const key of keys) {
            const element = document.getElementById(key);
            if (element == null) break;
            element.style.backgroundColor = "#111111";
            element.style.color = "#FFFFFF";
        }
    }, 100);
})();