// ==UserScript==
// @name         DaddyLiveHD Alphabetical Sorting
// @namespace    https://greasyfork.org/users/1033981
// @version      1.4
// @description  Alphabetically sorts the channels in the channel grid
// @license      AGPL-3.0
// @author       Edwin Zarco
// @match        https://*.dlhd.click/*
// @downloadURL https://update.greasyfork.org/scripts/460880/DaddyLiveHD%20Alphabetical%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/460880/DaddyLiveHD%20Alphabetical%20Sorting.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sort_channels_alphabetically()
    {
        const grid_container = document.querySelector('.grid-container');

        if (!grid_container)
            return;

        const grid_items = Array.from(
            grid_container.querySelectorAll('.grid-item')
        );

        grid_items.sort(function (a, b) {
            return a.textContent.localeCompare(b.textContent);
        });

        for (let i = 0; i < grid_items.length; i++)
            grid_container.appendChild(grid_items[i]);
    }

    sort_channels_alphabetically();
})();