// ==UserScript==
// @name         Rule34 to MPV Playlist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate MPV-compatible playlist from Rule34 search results
// @author       you
// @match        https://rule34.xxx/index.php?page=post&s=list&tags=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/538065/Rule34%20to%20MPV%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/538065/Rule34%20to%20MPV%20Playlist.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Get all post links on the search page
    const thumbs = Array.from(document.querySelectorAll('span.thumb a[href*="s=view"]'));
    const postUrls = thumbs.map(a => a.href);

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const mediaUrls = [];

    for (let i = 0; i < postUrls.length; i++) {
        const postUrl = postUrls[i];
        console.log(`Fetching: ${postUrl}`);
        try {
            const response = await fetch(postUrl);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');

            // Check for <video> tag
            const video = doc.querySelector('video > source');
            if (video && video.src) {
                mediaUrls.push(video.src.startsWith('//') ? 'https:' + video.src : video.src);
            }

            // Add small delay between fetches
            await delay(500);
        } catch (err) {
            console.error('Error fetching', postUrl, err);
        }
    }

    if (mediaUrls.length) {
        const playlistText = mediaUrls.join('\n');
        GM_setClipboard(playlistText);
        alert(`✅ Copied ${mediaUrls.length} media URLs to clipboard.\nPaste into a .m3u file and open with MPV.`);
        console.log(playlistText);
    } else {
        alert('❌ No media URLs found.');
    }
})();
