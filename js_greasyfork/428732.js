// ==UserScript==
// @name         Steamgifts, Simplify list style
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  oo
// @author       You
// @match        https://www.steamgifts.com/*
// @icon         https://www.google.com/s2/favicons?domain=steamgifts.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/428732/Steamgifts%2C%20Simplify%20list%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/428732/Steamgifts%2C%20Simplify%20list%20style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement("style");
    style.innerHTML =`
.giveaway__row-outer-wrap {
    padding: 0;
}
.giveaway__row-outer-wrap + div:not(.giveaway__row-outer-wrap) {
    display: none !important;
}
.giveaway__row-inner-wrap {
    display: flex;
}
.giveaway__summary {
    display: flex;
    order: 2;
    margin-left: 16px;
}
.giveaway__heading,
.giveaway__columns,
.giveaway__links {
    display: inline-flex;
    order: 2;
    z-index: 1;
}
.giveaway__columns {
    margin-left: auto;
}
.giveaway__columns > * {
    display: inline-block;
}
.giveaway__columns > * {
    border: 0;
    box-shadow: none;
    line-height: unset;
    border: none !important;
    box-shadow: none !important;
    background: none !important;
}
.giveaway__columns > *:nth-child(2) {
    display: none;
}
giveaway__links {
    height: unset;
}
.giveaway__links > *:last-child {
    display: none;
}
.giveaway_image_thumbnail,
.giveaway_image_thumbnail_missing {
    height: 32px;
    width: 82px;
    order: 1;
}

.giveaway__summary {
    position: relative;
}
.giveaway__summary:after {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: green;
    height: 8px;
    width: calc(min(100%, var(--happy)));
    content: "";
    z-index: 0;
    opacity: 0.2;
}
    `;
    document.body.appendChild(style);

    window.addEventListener("load", function () {
        document.querySelectorAll(".giveaway__row-outer-wrap").forEach((element) => {
            var value = parseInt(element.querySelector(".giveaway__links a[href$='/entries']").innerText.replace(",", "").replace("entries", "")), m;
            const amount = element.querySelector(".giveaway__heading__thin");

            if (amount && (m = amount.innerText.match(/(\d+) Copies/))) {
                value /= parseFloat(m[1]);
            }
            element.style.setProperty("--happy", (10000.0 / value) + "%");
        });
    });
})();