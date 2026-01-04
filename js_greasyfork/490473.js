// ==UserScript==
// @name         1337x - Hide IGG Games torrents
// @namespace    http://tampermonkey.net/
// @version      2024.04.29
// @description  Hide IGG Games torrents from 1337x entirely
// @author       itsmebucky
// @license     MIT
// @include     /^https:\/\/(www\.)?1337x\.(to|st|ws|eu|se|is|gd|unblocked\.dk)((?!\/torrent)).*$/
// @icon         https://i.ibb.co/fkZ3Dgg/i96x96.webp
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/490473/1337x%20-%20Hide%20IGG%20Games%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/490473/1337x%20-%20Hide%20IGG%20Games%20torrents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allTables = document.querySelectorAll('.table-list-wrap .vip'); // for pages with multiple tables e.g. https://1337x.to/home/

    allTables.forEach(
        (uploaderCell) => {
            if(uploaderCell.textContent === "IGGGAMESCOM"){
                uploaderCell.parentNode.hidden = true;
            }
        }
    );
})();