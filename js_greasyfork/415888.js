// ==UserScript==
// @name         Show favorite subtitles
// @namespace    PTP
// @version      1
// @description  Display favorite language subtitles on torrent row if available
// @include      http*://*passthepopcorn.me/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415888/Show%20favorite%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/415888/Show%20favorite%20subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language settings:
    const myLanguage = 'French'; // Tip: hover your flag to get the correct language text string
    const flags = true; // false to show language shortcodes (EN, FR, SP); true to show flags instead
    const showEnglish = true;

    // Function to create an image element for the flag
    function createFlagImage(src, alt, title) {
        const img = document.createElement('img');
        img.style.maxHeight = '10px';
        img.style.maxWidth = '20px';
        img.style.verticalAlign = 'middle';
        img.src = src;
        img.alt = alt;
        img.title = title;
        return img;
    }

    // Get all torrent rows
    const rows = document.querySelectorAll('#torrent-table > tbody > tr.group_torrent_header');

    rows.forEach(row => {
        const nextRow = row.nextElementSibling;
        let subs = "";

        // Check for English subtitles
        if (nextRow.querySelector('img[alt="English"]') && showEnglish) {
            const engFlag = createFlagImage('static/common/flags/usa.gif', 'English', 'English');
            subs += ` | ` + engFlag.outerHTML;
        }

        // Check for the preferred language subtitles
        const langCode = myLanguage.substring(0, 2).toUpperCase();
        const langSub = nextRow.querySelector(`img[alt="${myLanguage}"]`);
        if (langSub) {
            const langFlag = createFlagImage(langSub.src.replace("https://passthepopcorn.me/", ""), myLanguage, myLanguage);
            subs += ` | ` + langFlag.outerHTML;
        }

        // Append subtitles info to the torrent link
        const torrentLink = row.querySelector("a.torrent-info-link");
        if (torrentLink) {
            torrentLink.innerHTML += subs;
        }
    });
})();
