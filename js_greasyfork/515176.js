// ==UserScript==
// @name         Full Date format for Youtube (Enhanced - 2025 Fix + Persistent Toggle)
// @version      2.1.3
// @description  Show full upload dates in DD/MM/YYYY HH:MMam/pm format with smart queuing, retry, dynamic updates, UI toggle, and persistent ON/OFF state.
// @author       Ignacio Albiol
// @namespace    https://greasyfork.org/en/users/1304094
// @match        https://www.youtube.com/*
// @iconURL      https://seekvectors.com/files/download/youtube-icon-yellow-01.jpg
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515176/Full%20Date%20format%20for%20Youtube%20%28Enhanced%20-%202025%20Fix%20%2B%20Persistent%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515176/Full%20Date%20format%20for%20Youtube%20%28Enhanced%20-%202025%20Fix%20%2B%20Persistent%20Toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uploadDateCache = new Map();
    const processedVideos = new Map();
    const videoQueue = [];
    const apiRequestCache = new Map();

    let isEnabled = localStorage.getItem('ytDateEnabled') !== 'false'; // default true

    const RETRY_LIMIT = 3;
    const RETRY_DELAY = 1000;
    const MAX_CONCURRENT = 3;
    let currentRequests = 0;

    const DEBUG = false;
    const EXPIRY_MS = 10 * 60 * 1000;

    function debug(...args) {
        if (DEBUG) console.log('[YT Date Format]', ...args);
    }

    function formatDate(iso) {
        const date = new Date(iso);
        if (isNaN(date)) return '';
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        let h = date.getHours();
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12 || 12;
        return `${d}/${m}/${y} ${h}:${mm}${ampm}`;
    }

    function extractVideoId(url) {
        try {
            const u = new URL(url, 'https://www.youtube.com');
            if (u.pathname.includes('/shorts/')) return u.pathname.split('/')[2];
            if (u.pathname.includes('/clip/')) return u.pathname.split('/')[2];
            const id = u.searchParams.get('v');
            if (id) return id;
            const match = u.pathname.match(/\/([a-zA-Z0-9_-]{11})(?:[/?#]|$)/);
            return match?.[1] || '';
        } catch {
            return '';
        }
    }

    async function fetchUploadDate(videoId, attempt = 0) {
        if (uploadDateCache.has(videoId)) return uploadDateCache.get(videoId);
        if (apiRequestCache.has(videoId)) return apiRequestCache.get(videoId);

        const fetchPromise = new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    context: { client: { clientName: 'WEB', clientVersion: '2.20240620.01.00' } },
                    videoId
                }),
                onload: function (res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const d = data?.microformat?.playerMicroformatRenderer;
                        const raw = d?.publishDate || d?.uploadDate || d?.liveBroadcastDetails?.startTimestamp;
                        if (raw) {
                            uploadDateCache.set(videoId, raw);
                            resolve(raw);
                        } else {
                            throw new Error("No date found");
                        }
                    } catch (e) {
                        if (attempt < RETRY_LIMIT) {
                            debug(`Retry ${attempt + 1} for ${videoId}`);
                            setTimeout(() => {
                                resolve(fetchUploadDate(videoId, attempt + 1));
                            }, RETRY_DELAY * (attempt + 1));
                        } else {
                            console.error('[YT Date Format] Fetch failed:', e);
                            resolve(null);
                        }
                    } finally {
                        apiRequestCache.delete(videoId);
                    }
                },
                onerror: function (err) {
                    console.error('[YT Date Format] GM_xmlhttpRequest error:', err);
                    resolve(null);
                }
            });
        });

        apiRequestCache.set(videoId, fetchPromise);
        return fetchPromise;
    }

    async function processQueue() {
        if (currentRequests >= MAX_CONCURRENT || !isEnabled) return;

        const task = videoQueue.shift();
        if (!task) return;

        currentRequests++;
        const { el, linkSelector, metaSelector } = task;

        try {
            const meta = el.querySelector(metaSelector) || el.querySelector('ytd-video-meta-block');
            if (!meta) return;

            let holder = null;
            const match = [...meta.querySelectorAll('span, yt-formatted-string')]
                .find(s => / views?|^\d[\d.,]*\s|hour|minute|day|just now|ago/i.test(s.textContent));

            if (match && match.nextElementSibling) {
                holder = match.nextElementSibling;
            } else if (match) {
                holder = document.createElement('span');
                holder.style.marginLeft = '4px';
                match.after(holder);
            }

            if (!holder) return;

            const link = el.querySelector(linkSelector);
            if (!link || !link.href) return;

            const videoId = extractVideoId(link.href);
            if (!videoId || processedVideos.has(videoId)) return;

            processedVideos.set(videoId, Date.now());

            const uploadDate = await fetchUploadDate(videoId);
            if (uploadDate) {
                holder.textContent = formatDate(uploadDate);
            }
        } catch (err) {
            console.error('[YT Date Format] Error in queue item:', err);
        } finally {
            currentRequests--;
            processQueue();
        }
    }

    function enqueue(el, linkSelector, metaSelector) {
        if (!isEnabled) return;
        videoQueue.push({ el, linkSelector, metaSelector });
        processQueue();
    }

    function cleanOld() {
        const now = Date.now();
        for (const [id, ts] of processedVideos.entries()) {
            if (now - ts > EXPIRY_MS) processedVideos.delete(id);
        }
    }

    function observeVideos() {
        const selectors = [
            {
                container: 'ytd-video-renderer, ytd-rich-grid-media, ytd-grid-video-renderer, ytd-compact-video-renderer',
                link: 'a#thumbnail, h3 a',
                meta: '#metadata-line, ytd-video-meta-block'
            },
            {
                container: 'ytd-channel-video-player-renderer',
                link: 'a, yt-formatted-string > a',
                meta: '#metadata-line'
            }
        ];

        const observer = new MutationObserver(() => {
            for (const { container, link, meta } of selectors) {
                document.querySelectorAll(container).forEach(el => enqueue(el, link, meta));
            }
            cleanOld();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            selectors.forEach(({ container, link, meta }) => {
                document.querySelectorAll(container).forEach(el => enqueue(el, link, meta));
            });
        }, 500);
    }

    function injectToggleUI() {
        const btn = document.createElement('button');
        btn.id = 'yt-date-toggle-btn';
        btn.textContent = isEnabled ? '📅 Date ON' : '📅 Date OFF';

        btn.style.cssText = `
      min-width: 120px;
      padding: 6px 12px;
      margin-left: 10px;
      border-radius: 16px;
      background-color: #ffcc00;
      color: #000;
      font-weight: 600;
      border: 2px solid #000;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: background-color 0.3s ease;
      z-index: 9999;
    `;

        btn.onmouseenter = () => { btn.style.backgroundColor = '#ffe066'; };
        btn.onmouseleave = () => { btn.style.backgroundColor = '#ffcc00'; };

        btn.onclick = () => {
            isEnabled = !isEnabled;
            localStorage.setItem('ytDateEnabled', isEnabled);
            btn.textContent = isEnabled ? '📅 Date ON' : '📅 Date OFF';
        };

        const checkInterval = setInterval(() => {
            const startBar = document.querySelector('#start');
            if (startBar && !document.querySelector('#yt-date-toggle-btn')) {
                startBar.appendChild(btn);
                clearInterval(checkInterval);
            }
        }, 500);
    }

    function hideDefaultDateCSS() {
        const style = document.createElement('style');
        style.textContent = `
      #info > span:nth-child(3),
      #info > span:nth-child(4) {
        display: none !important;
      }
    `;
        document.head.appendChild(style);
    }

    function init() {
        hideDefaultDateCSS();
        observeVideos();
        injectToggleUI();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
