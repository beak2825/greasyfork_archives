// ==UserScript==
// @name         Cue the Trump
// @version      0.4.1
// @namespace    https://greasyfork.org/en/users/113783-klattering
// @description  Show "Trumpable" Tag for torrents that have a 100% log and no cue sheet.
// @author       klattering
// @match        https://redacted.ch/*
// @downloadURL https://update.greasyfork.org/scripts/403117/Cue%20the%20Trump.user.js
// @updateURL https://update.greasyfork.org/scripts/403117/Cue%20the%20Trump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isTorrentSearch = ( window.location.pathname === '/torrents.php' && ! window.location.search.includes( '?id=' ) || window.location.pathname === '/artist.php' );
    const isSingleReleasePage = window.location.search.includes( '?id=' );

    if ( isTorrentSearch ) {

        const torrentRows = document.querySelectorAll( 'tr.group_torrent' );

        torrentRows.forEach( torrentRow => {
            const torrentLink = torrentRow.querySelector( '[href^="torrents.php?id="]' );

            const torrentText = ( torrentLink) ? torrentLink.innerText : null;

            // Includes a 100% log, but not a cue.
            if ( torrentLink && torrentText && torrentText.includes( 'Log (100%)' ) && ! torrentText.includes( 'Cue' ) ) {
                if ( torrentText.includes( 'Scene' ) ) {
                    torrentLink.innerHTML = 'FLAC / Lossless / Log (100%) / Scene / <strong class="torrent_label tooltip tl_notice">Trumpable</strong>';
                } else {
                    torrentLink.innerHTML = 'FLAC / Lossless / Log (100%) / <strong class="torrent_label tooltip tl_notice">Trumpable</strong>';
                }
            }
        });
    }

    if ( isSingleReleasePage ) {
        const torrentRows = document.querySelectorAll( 'tr.torrent_row' );

        torrentRows.forEach( torrentRow => {
            const torrentLink = torrentRow.querySelector( '[href="#"]' );
            const torrentText = torrentLink.innerText;

            // Includes a 100% log, but not a cue.
            if ( torrentText.includes( 'Log (100%)' ) && ! torrentText.includes( 'Cue' ) ) {
                if ( torrentText.includes( 'Scene' ) ) {
                    torrentLink.innerHTML = 'FLAC / Lossless / Log (100%) / Scene / <strong class="torrent_label tooltip tl_notice">Trumpable</strong>';
                } else {
                    torrentLink.innerHTML = 'FLAC / Lossless / Log (100%) / <strong class="torrent_label tooltip tl_notice">Trumpable</strong>';
                }

                // Add the blockquote explaining why it's trumpable.
                const trumpableQuote = document.createElement( 'blockquote' );
                const meta = torrentRow.nextElementSibling.querySelector( '.no_overflow' );
                trumpableQuote.innerHTML = '<b>Trumpable For:</b><br><br>100% Log With No Cue Sheet (<a href="https://redacted.ch/rules.php?p=upload#r2.2.10.7">2.2.10.7</a>)';
                meta.appendChild( trumpableQuote );

            }
        });
    }
})();