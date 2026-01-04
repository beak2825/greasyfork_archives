// ==UserScript==
// @name         Criticker Sidebar Expander
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Expands the sidebar on film / game pages on Criticker.com to reveal the IMDb link
// @author       Alsweider
// @match        https://www.criticker.com/film/*
// @match        https://www.criticker.com/tv/*
// @match        https://games.criticker.com/game/*
// @icon         https://www.criticker.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530038/Criticker%20Sidebar%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/530038/Criticker%20Sidebar%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickMoreOptions() {
        let moreButton = document.querySelector('#tip_sidebar_action_more a');
        if (moreButton) {
            moreButton.click();
        }
    }

    // Direkt beim Laden der Seite ausführen
    clickMoreOptions();

})();