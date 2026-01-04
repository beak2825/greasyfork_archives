// ==UserScript==
// @name        YouTube /embed/ forwarder
// @description Forwards YouTube links to the youtube.com/embed/* page, so there's just the video in your window and nothing else.
// @namespace   https://greasyfork.org/en/users/1148791-vuccala
// @author      Vuccala
// @icon        https://archive.org/download/yt_icon/yt.png
// @match       *://*.youtube.com/*
// @match       *://*.youtu.be/*
// @run-at      document-start
// @version     0.8
// @grant       none
// @license     whatever
// @downloadURL https://update.greasyfork.org/scripts/473082/YouTube%20embed%20forwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/473082/YouTube%20embed%20forwarder.meta.js
// ==/UserScript==

(function () {
    const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';

    // Regex catches watch, embed, v/, shorts/, and ?list=
    const ID_REGEX = /(?:[?&]v=|\/(?:embed\/|v\/|shorts\/))([^&?/]+)|(?:[?&]list=)([^&?/]+)/g;

    function parseYouTubeUrl(url) {
        const parsed = new URL(url);
        const params = parsed.searchParams;

        let videoId = null;
        let playlistId = null;

        // Handle youtu.be short links
        if (parsed.hostname === 'youtu.be' && parsed.pathname.length > 1) {
            videoId = parsed.pathname.slice(1);
        }

        let match;
        while ((match = ID_REGEX.exec(url)) !== null) {
            if (match[1]) videoId = match[1];
            if (match[2]) playlistId = match[2];
        }

        // Extract playlist index
        const index = params.has('index') ? parseInt(params.get('index'), 10) : null;

        // Extract start time (from t= or start=)
        let start = null;
        if (params.has('t')) {
            start = parseTime(params.get('t'));
        } else if (params.has('start')) {
            start = parseInt(params.get('start'), 10) || null;
        }

        if (!videoId) return null;

        return playlistId
            ? { type: 'playlist', videoId, playlistId, index, start }
            : { type: 'video', videoId, index, start };
    }

    function parseTime(t) {
        // t can be like "90", "1m30s", "2h3m5s"
        const timeRegex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/;
        const match = timeRegex.exec(t);
        if (!match) return null;

        const hours = parseInt(match[1] || 0, 10);
        const minutes = parseInt(match[2] || 0, 10);
        const seconds = parseInt(match[3] || 0, 10);

        return hours * 3600 + minutes * 60 + seconds;
    }

    function createSpoofPage(embedUrl) {
        const html = `
            <html>
                <head>
                    <meta http-equiv="refresh" content="0; url='${embedUrl}'" />
                    <meta name="referrer" content="origin" />
                </head>
                <body>
                    <p>Redirecting to YouTube embed...</p>
                </body>
            </html>
        `;
        const blob = new Blob([html], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }

    const currentUrl = window.location.href;
    const ids = parseYouTubeUrl(currentUrl);
    if (!ids) return;

    let embedUrl;

    if (ids.type === 'playlist') {
        if (ids.index > 200) {
            // Fallback: YouTube embed player won’t load >200, so just load the video
            embedUrl = `${EMBED_BASE}${ids.videoId}?autoplay=1&list=${ids.playlistId}`;
        } else {
            // Preserve playlist and index when possible
            embedUrl = `${EMBED_BASE}${ids.videoId}?list=${ids.playlistId}&autoplay=1`;
            if (ids.index) embedUrl += `&index=${ids.index}`;
        }
    } else {
        // Normal video
        embedUrl = `${EMBED_BASE}${ids.videoId}?autoplay=1`;
    }

    // Add timestamp if available
    if (ids.start) {
        embedUrl += `&start=${ids.start}`;
    }

    if (embedUrl && embedUrl !== currentUrl) {
        const spoofPage = createSpoofPage(embedUrl);
        window.location.href = spoofPage;
    }
})();