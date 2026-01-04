// ==UserScript==
// @name         Nyaa Torrents Table Full Width
// @namespace    http://tampermonkey.net/
// @version      2025-03-14
// @description  Expand Nyaa.si torrents table to full display width
// @author       yisonPylkita
// @match        https://nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529793/Nyaa%20Torrents%20Table%20Full%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/529793/Nyaa%20Torrents%20Table%20Full%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the container wrapping the torrent table (topbar also has .container class)
    const torrentContainer = document.querySelector('.container:has(table.torrent-list)');

    if (torrentContainer) {
        // Expand the container to full width
        torrentContainer.style.width = '100%';
        torrentContainer.style.maxWidth = 'none';
        torrentContainer.style.margin = '0 auto';
    }

    // Ensure the table inside also spans full width
    const torrentTable = document.querySelector('table.torrent-list');
    if (torrentTable) {
        torrentTable.style.width = '100%';
    }
})();
