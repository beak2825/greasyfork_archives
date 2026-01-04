// ==UserScript==
// @name         Rutracker Movies Highlighter
// @namespace    https://rutracker.org/forum/tracker.php?type=movies
// @version      2024-06-27
// @license      MIT
// @description  Highlights too small or too large torrents for movies
// @author       Rualark
// @match        *://rutracker.org/forum/tracker.php?type=movies*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499079/Rutracker%20Movies%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/499079/Rutracker%20Movies%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function humanReadableToBytes(size) {
        let units = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024,
            'TB': 1024 * 1024 * 1024 * 1024
        };
        let match = size.match(/([\d.]+)\s*(B|KB|MB|GB|TB)/i);
        if (match) {
            let value = parseFloat(match[1]);
            let unit = match[2].toUpperCase();
            return value * (units[unit] || 1);
        }
        return 0;
    }

    document.querySelectorAll('.tor-size').forEach(element => {
        let aTag = element.querySelector('a');
        if (aTag) {
            let sizeText = aTag.textContent.trim();
            let mb = humanReadableToBytes(sizeText) / 1024 / 1024;
            if (mb < 600 || mb > 4000) {
                element.style.backgroundColor = '#ffcccc';
            }
        }
    });

})();
