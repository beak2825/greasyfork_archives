// ==UserScript==
// @name         Garmin Connect Dark Mode
// @namespace    https://github.com/patrickstigler/Tampermonkey
// @version      1.0
// @description  Applies a dark theme to connect.garmin.com for improved readability
// @author       Patrick Stigler
// @license      MIT License
// @match        https://connect.garmin.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533359/Garmin%20Connect%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/533359/Garmin%20Connect%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
:root {
    --inverted-background: #1a1a1a;
    --inverted-background2: #f2f2f2;
    --primary-text: #f2f2f2;
    --primary-text2: #1a1a1a;
    --header-text: #1a1a1a;
    --border: #5971c6f0;
    --scrollbar-thumb: #30acfd;
    --scrollbar-background: #f2f2f2;
}

.connect-container {
    filter: invert(1) hue-rotate(180deg);
}

.main-nav,
.leaflet-zoom-animated,
html img,
#activityYouTubePlaceholder > div,
.modal-backdrop,
.modal:not(.modal.fullscreen.fullscreen, .modal-wide.metrics-edit-modal.in),
.edit-carousel-content .edit-image-div,
.Notification_notification__189UW,
.connect-map-view .leaflet-container,
.marTopXS > iframe {
    -webkit-filter: invert(1) hue-rotate(180deg) !important;
    filter: invert(1) hue-rotate(180deg) !important;
}

h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
    color: var(--header-text);
    font-weight: 600;
}

th.weekly-totals.weekly-totals-header,
td.weekly-totals.weekly-totals-data,
#defaultActivityOptionsGroup > div.row-fluid.page-top > div.span8.page-intro > div > h3 > div > div > button > i,
.modal-body > select {
    filter: invert(1) hue-rotate(180deg);
    background-color: var(--inverted-background) !important;
    color: var(--primary-text) !important;
}

.video-container {
    opacity: 10%;
}
.video-container:hover {
    opacity: 100% !important;
}

.in.fade.modal-backdrop {
    display: table !important;
}

[class*='modal']:not(#pageContainer > div > div.modal.hide.fade.modal-wide.metrics-edit-modal.in > div.modal-header > h3,
#pageContainer > div > div > div.row-fluid.list-items.flexItemAutoHeight > ul > li:nth-child(n) > div > div.pull-left.activity-name-type.title-col > div.activity-name-edit.inline-edit.inline-edit-text-field > button,
#activityIntroViewPlaceholder > div.page-header-content > h3 > div > div > button,
.inline-edit-trigger,
.modal.fade.in,
.modal-header h3,
.fade,
:not(.help-icon)) {
    filter: invert(1) hue-rotate(180deg);
    border-color: var(--border);
    background-color: var(--inverted-background2) !important;
    color: var(--primary-text2) !important;
}

.photo-carousel {
    background-color: var(--inverted-background2) !important;
}

.photo-carousel-modal .close {
    color: var(--primary-text2) !important;
}

.photo-carousel-modal .photo {
    filter: unset !important;
    cursor: initial;
}

.photo-carousel-modal .slides {
    margin-bottom: 35px;
    background: var(--inverted-background);
}

.btn-small {
    z-index: 9999;
}

.react-global-modal .Dialog_dialogFooter__W9xGT > a {
    background-color: var(--inverted-background2) !important;
    color: var(--primary-text2);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-thumb {
    border: 3px solid var(--scrollbar-background);
    border-radius: 6px;
    background-color: var(--scrollbar-thumb);
}

body {
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
    `;
    GM_addStyle(css);
})();
