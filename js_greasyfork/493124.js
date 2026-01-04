// ==UserScript==
// @name         Empornium Collage Snatched, FreeLeech, and Bookmarked Warning
// @namespace    http://tampermonkey.net/
// @version      2024-04-21
// @description  Adds non-intrusive overlays using ::after pseudo-elements to torrents marked as 'snatched', with 'Unlimited Freeleech', or bookmarked.
// @author       papaxsmurf
// @match        https://www.empornium.is/collage/*
// @match        https://www.empornium.sx/collage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493124/Empornium%20Collage%20Snatched%2C%20FreeLeech%2C%20and%20Bookmarked%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/493124/Empornium%20Collage%20Snatched%2C%20FreeLeech%2C%20and%20Bookmarked%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addOverlayStyles() {
        GM_addStyle(`
            .torrent__cover.red-overlay::after, .torrent__cover.green-overlay::after, .torrent__cover.blue-overlay::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none; // Important to allow clicks to pass through to elements below
                background-color: transparent; // Initially transparent
            }
            .torrent__cover.red-overlay::after {
                background-color: rgba(255, 0, 0, 0.4);
            }
            .torrent__cover.green-overlay::after {
                background-color: rgba(255, 255, 0, 0.20);
            }
            .torrent__cover.blue-overlay::after {
                background-color: rgba(0, 0, 255, 0.4);
            }
        `);
    }

    function addOverlays() {
        const torrents = document.querySelectorAll('.torrent_grid__torrent');
        torrents.forEach(torrentGrid => {
            const snatchedIcons = torrentGrid.querySelectorAll('.icon_container i.snatched');
            const leechingSpans = torrentGrid.querySelectorAll('span.icon[title="Unlimited Freeleech"]');
            const bookmarkedIcons = torrentGrid.querySelectorAll('i[title="You have this torrent bookmarked"]');
            const torrentCover = torrentGrid.querySelector('.torrent__cover');

            if (snatchedIcons.length > 0) {
                torrentCover.classList.add('red-overlay');
            }
            if (leechingSpans.length > 0 && !torrentGrid.querySelector('.red-overlay')) {
                torrentCover.classList.add('green-overlay');
            }
            if (bookmarkedIcons.length > 0 && !torrentGrid.querySelector('.red-overlay') && !torrentGrid.querySelector('.green-overlay')) {
                torrentCover.classList.add('blue-overlay');
            }
        });
    }

    window.addEventListener('load', function() {
        addOverlayStyles();
        setTimeout(addOverlays, 5000);
    });

    const observer = new MutationObserver(function() {
        addOverlays();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
