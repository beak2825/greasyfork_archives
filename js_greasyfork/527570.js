// ==UserScript==
// @name         Gitlab Releases
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Fade out non-free sections in GitLab releases
// @author       myklosbotond
// @license MIT
// @match        https://about.gitlab.com/releases/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527570/Gitlab%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/527570/Gitlab%20Releases.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.GM-faded-feature {
    opacity: 0.4;
}
    `);

    [
        ...document.querySelectorAll("#top-feature"),
        ...document.querySelectorAll("#primary-features .release-row"),
        ...document.querySelectorAll(".secondary-column-feature"),
    ].forEach((section) => {
        const freeSelfHostedBadge = section.querySelector(".badge-container .bottom-row a[data-ga-name=free] > div");
        const fadeFeature = !freeSelfHostedBadge.classList.contains("available");

        if (fadeFeature) {
            section.classList.add("GM-faded-feature");
        }
    });
})();