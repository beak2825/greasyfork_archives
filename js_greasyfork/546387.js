// ==UserScript==
// @name         YouTube - SmartSponsorBlock
// @description  Automatically skip sponsor segments in YouTube videos using SponsorBlock API
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @supportURL   https://github.com/5tratz/Tampermonkey-Scripts/issues
// @version      0.0.8
// @author       5tratz
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.sponsor.ajay.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546387/YouTube%20-%20SmartSponsorBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/546387/YouTube%20-%20SmartSponsorBlock.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ================= CONFIG ================= */

    const SB_API = 'https://api.sponsor.ajay.app/api/skipSegments';

    // Only skip true sponsor segments
    const SKIP_CATEGORIES = ['sponsor'];

    // Small buffer to avoid skipping into another segment
    const SKIP_PADDING = 0.35;

    /* ================= STATE ================= */

    const segmentCache = new Map(); // videoId -> segments[]
    let currentVideoId = null;
    let currentVideoEl = null;

    /* ================= UTILS ================= */

    const log = (...args) => console.debug('[SmartSponsorBlock]', ...args);

    function getVideoId() {
        try {
            const url = new URL(location.href);

            // Normal videos
            if (url.searchParams.get('v')) {
                return url.searchParams.get('v');
            }

            // Shorts
            const shorts = location.pathname.match(/\/shorts\/([^/?#]+)/);
            if (shorts) {
                return shorts[1];
            }

            // Fallback
            const meta = document.querySelector('meta[itemprop="videoId"]');
            if (meta) {
                return meta.content;
            }
        } catch {}
        return null;
    }

    function getVideoElement() {
        return document.querySelector('video');
    }

    /* ================= SPONSORBLOCK ================= */

    function fetchSegments(videoId, callback) {
        if (segmentCache.has(videoId)) {
            callback(segmentCache.get(videoId));
            return;
        }

        const url =
            `${SB_API}?videoID=${encodeURIComponent(videoId)}` +
            `&categories=${encodeURIComponent(JSON.stringify(SKIP_CATEGORIES))}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { Accept: 'application/json' },
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    const segments = Array.isArray(data)
                        ? data
                              .map(d => ({
                                  start: d.segment[0],
                                  end: d.segment[1],
                                  category: d.category
                              }))
                              .filter(s => s.end > s.start)
                              .sort((a, b) => a.start - b.start)
                        : [];

                    // Merge overlaps
                    const merged = [];
                    for (const s of segments) {
                        const last = merged[merged.length - 1];
                        if (!last || s.start > last.end) {
                            merged.push({ ...s });
                        } else {
                            last.end = Math.max(last.end, s.end);
                        }
                    }

                    segmentCache.set(videoId, merged);
                    callback(merged);
                } catch (e) {
                    log('Failed to parse SponsorBlock response', e);
                    callback([]);
                }
            },
            onerror: () => callback([]),
            ontimeout: () => callback([])
        });
    }

    /* ================= SKIP LOGIC ================= */

    function attachSkipper(videoId) {
        const video = getVideoElement();
        if (!video || !videoId) return;

        // Same element & same video → nothing to do
        if (video === currentVideoEl && videoId === currentVideoId) return;

        currentVideoEl = video;
        currentVideoId = videoId;

        fetchSegments(videoId, segments => {
            if (!segments.length) return;

            let nextIndex = 0;

            const skipIfNeeded = () => {
                const t = video.currentTime;

                while (nextIndex < segments.length) {
                    const seg = segments[nextIndex];
                    if (t >= seg.start && t < seg.end) {
                        video.currentTime = +(seg.end + SKIP_PADDING).toFixed(2);
                        log(`Skipped sponsor: ${seg.start} → ${seg.end}`);
                        nextIndex++;
                    } else if (t < seg.start) {
                        break;
                    } else {
                        nextIndex++;
                    }
                }
            };

            const onSeeking = () => {
                nextIndex = segments.findIndex(s => video.currentTime < s.end);
                if (nextIndex === -1) nextIndex = segments.length;

                const inside = segments.find(
                    s => video.currentTime >= s.start && video.currentTime < s.end
                );

                if (inside) {
                    video.currentTime = +(inside.end + SKIP_PADDING).toFixed(2);
                    log('Seeked into sponsor, skipped');
                    nextIndex = segments.indexOf(inside) + 1;
                }
            };

            video.addEventListener('timeupdate', skipIfNeeded);
            video.addEventListener('seeking', onSeeking);

            // Cleanup if YouTube replaces the video element
            const watcher = setInterval(() => {
                if (!document.contains(video) || getVideoElement() !== video) {
                    video.removeEventListener('timeupdate', skipIfNeeded);
                    video.removeEventListener('seeking', onSeeking);
                    clearInterval(watcher);
                    currentVideoEl = null;
                    currentVideoId = null;
                }
            }, 1500);
        });
    }

    /* ================= PAGE OBSERVER ================= */

    function handleNavigation() {
        setTimeout(() => {
            const videoId = getVideoId();
            if (videoId) attachSkipper(videoId);
        }, 500); // allow player to initialize
    }

    function observePage() {
        document.addEventListener('yt-navigate-finish', handleNavigation);
        document.addEventListener('yt-page-data-updated', handleNavigation);

        // Fallback (YouTube sometimes misses events)
        setInterval(handleNavigation, 3000);
    }

    observePage();
})();