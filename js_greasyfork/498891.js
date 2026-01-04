// ==UserScript==
// @name         MyAnimeList: Increase the Font-Size for Reviews to 15 px
// @namespace    plennhar-myanimelist-increase-review-font-size-to-15-px
// @version      1.0
// @description  Increases the font-size for MyAnimeList reviews to 15 px (from the default 11 px), so they're more pleasant to read.
// @author       Plennhar
// @match        https://myanimelist.net/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498891/MyAnimeList%3A%20Increase%20the%20Font-Size%20for%20Reviews%20to%2015%20px.user.js
// @updateURL https://update.greasyfork.org/scripts/498891/MyAnimeList%3A%20Increase%20the%20Font-Size%20for%20Reviews%20to%2015%20px.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2024 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function() {
    'use strict';

    function changeFontSize() {
        let elements = document.querySelectorAll('.review-element');
        elements.forEach(function(element) {
            element.style.fontSize = '15px';
        });
    }

    window.addEventListener('load', changeFontSize);

    const observer = new MutationObserver(changeFontSize);
    observer.observe(document.body, { childList: true, subtree: true });
})();