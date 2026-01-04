// ==UserScript==
// @name         "Copy Tracklist Markup" with MPA
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds multiple primary artists unlike the original function + button accessible to Contributors
// @author       thousandeyes
// @match        https://genius.com/albums/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526499/%22Copy%20Tracklist%20Markup%22%20with%20MPA.user.js
// @updateURL https://update.greasyfork.org/scripts/526499/%22Copy%20Tracklist%20Markup%22%20with%20MPA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTracklist() {
        const artistLinks = document.querySelectorAll('a.header_with_cover_art-primary_info-primary_artist');
        const albumTitle = document.querySelector('h1.header_with_cover_art-primary_info-title');
        const tracks = document.querySelectorAll('album-tracklist-row .chart_row-content');

        if (!artistLinks.length || !albumTitle || tracks.length === 0) {
            console.log('');
            return;
        }

        let artistNames = Array.from(artistLinks).map(link => `[${link.textContent.trim()}](${link.href})`);
        let formattedArtists = artistNames.length > 2
            ? artistNames.slice(0, -1).join(', ') + ' & ' + artistNames[artistNames.length - 1]
            : artistNames.join(' & ');

        const albumName = albumTitle.textContent.trim();
        const albumUrl = window.location.href;

        let tracklistText = `<b>${formattedArtists} - [*${albumName}*](${albumUrl}) Lyrics and Tracklist</b>\n\n`;

        tracks.forEach((trackElement, index) => {
            const trackLink = trackElement.querySelector('a');
            if (!trackLink) return;

            let rawTitle = trackLink.textContent.trim().replace(/\s*Lyrics$/, '');
            const trackUrl = trackLink.href;

            let title = rawTitle;
            let featuredText = "";

            const ftPattern = /[\(\s](ft\.?|feat\.?|Ft\.?)[\s\.](.+?)[\)]?$/i;
            const ftMatch = title.match(ftPattern);
            if (ftMatch) {
                featuredText = ftMatch[2].trim();
                title = title.replace(ftPattern, '').trim();
            }

            let primaryArtists = [];
            const byPattern = /(.+?)\s+by\s+(.+)/i;
            const match = title.match(byPattern);
            if (match) {
                title = match[1].trim();
                primaryArtists = match[2]
                    .split(/,\s*|\s*&\s*/)
                    .map(artist => `[${artist}](${getArtistUrl(artist)})`);
            }

            let trackText = `${index + 1}. `;
            if (primaryArtists.length > 0) {
                const joinedPrimary = primaryArtists.length > 2
                    ? primaryArtists.slice(0, -1).join(', ') + ' & ' + primaryArtists[primaryArtists.length - 1]
                    : primaryArtists.join(' & ');
                trackText += joinedPrimary + ' - ';
            }
            trackText += `[${title}](${trackUrl})`;

            let featuredArtistsText = "";
            const featuredArtists = trackElement.querySelectorAll('.featured_artists a');
            if (featuredArtists.length > 0) {
                featuredArtistsText = Array.from(featuredArtists).map(artist => {
                    const name = artist.textContent.trim();
                    return `[${name}](${artist.href})`;
                }).join(', ');
            } else if (featuredText) {
                featuredArtistsText = featuredText;
            }

            if (featuredArtistsText) {
                trackText += ` ft. ${featuredArtistsText}`;
            }

            tracklistText += `${trackText}\n`;
        });

        navigator.clipboard.writeText(tracklistText)
            .then(() => {
                const button = document.querySelector('.custom-copy-button');
                button.textContent = 'Copied to clipboard';
                setTimeout(() => {
                    button.textContent = 'Copy Tracklist Markup';
                }, 2000);
            })
            .catch(err => console.log('Error: ' + err));
    }

    function getArtistUrl(artistName) {
        return `https://genius.com/artists/${encodeURIComponent(artistName.trim().replace(/\s+/g, '-'))}`;
    }

    function createCopyButton() {
        const button = document.createElement('div');
        button.className = 'square_button u-bottom_margin custom-copy-button';
        button.textContent = 'Copy Tracklist Markup';
        button.style.cursor = 'pointer';
        button.addEventListener('click', getTracklist);

        const moreButton = document.querySelector('div.square_button.drop-target');
        if (moreButton) {
            moreButton.parentNode.insertBefore(button, moreButton.nextSibling);
        }
    }

    window.addEventListener('load', createCopyButton);
})();
