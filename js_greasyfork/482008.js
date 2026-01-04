// ==UserScript==
// @name        Magnet2Torrent
// @match        *://*/*
// @grant       none
// @version     1.0
// @author      SH3LL
// @description Magnet to Torrent converter using itorrents.org
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/482008/Magnet2Torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/482008/Magnet2Torrent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract HASH from magnet link
    function getHashFromMagnetLink(magnetLink) {
        var match = magnetLink.match(/magnet:\?xt=urn:btih:([a-fA-F0-9]+)/);
        return match ? match[1] : null;
    }

    // Click Action
    function handleButtonClick(hash) {
        var torrentLink = 'https://itorrents.org/torrent/' + hash + '.torrent';
        window.open(torrentLink, '_blank');
    }

    // Scrape al magnets in the page
    var magnetLinks = document.querySelectorAll('a[href^="magnet:"]');

    // Loop for all magnets
    magnetLinks.forEach(function(link) {
        // GET HASH
        var hash = getHashFromMagnetLink(link.href);

        // CREATE THE BUTTON
        if (hash) {
            var button = document.createElement('button');
            button.innerHTML = '📥️';
            button.style.marginLeft = '5px';
            button.style.marginRight = '5px';
            button.addEventListener('click', function() {
                handleButtonClick(hash);
            });


            link.parentNode.insertBefore(button, link);
        }
    });
})();