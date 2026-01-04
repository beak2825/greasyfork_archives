// ==UserScript==
// @name         Disable the "For you" timeline
// @namespace    https://typeling1578.dev
// @version      1.0.1
// @description  Disable that annoying "For you" timeline!
// @author       typeling1578
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/486329/Disable%20the%20%22For%20you%22%20timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/486329/Disable%20the%20%22For%20you%22%20timeline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function (mutations) {
        if (location.pathname !== "/home") return;

        const navigations = document.querySelectorAll(
            `[data-testid="primaryColumn"] [role="navigation"] [role="presentation"] [role="tab"][href="/home"],
            [data-testid="TopNavBar"] [role="navigation"] [role="presentation"] [role="tab"][href="/home"]` // mobile layout
        );
        if (navigations.length === 0) return;

        const recommended_tab = navigations[0];
        const follows_tab = navigations[1];

        recommended_tab.style.display = "none";

        if (recommended_tab.getAttribute("aria-selected") === "true") {
            follows_tab.click();
        }
    });
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
    });
})();
