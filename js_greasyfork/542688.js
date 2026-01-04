// ==UserScript==
// @name        yt css
// @description a
// @match       https://*.youtube.com/*
// @run-at      document-end
// @version 0.0.1.20251228153150
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542688/yt%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/542688/yt%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
    ytd-mini-guide-renderer, grid-shelf-view-model, ytd-shelf-renderer, ytm-paid-content-overlay-renderer, .ytSearchboxComponentSuggestionsContainer, div#related, div#chip-bar, .ytp-info-panel-preview, .ytp-pause-overlay-container, .ytp-fullscreen-grid {
    display: none !important;
    }

ytd-video-renderer:has(> div > ytd-thumbnail > a[href^="/shorts/"]), ytd-rich-section-renderer:has(> div#content > ytd-rich-shelf-renderer[is-shorts]), ytd-rich-section-renderer:has(> div#content > ytd-chips-shelf-with-video-shelf-renderer), div#header:has(> ytd-feed-filter-chip-bar-renderer > div#chips-wrapper) {
display: none !important;
}

div#frosted-glass {
    height: revert !important;
}

div#masthead-container {
    background-color: black !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();