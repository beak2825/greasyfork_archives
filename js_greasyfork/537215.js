// ==UserScript==
// @name         ClipboardUrler Pro (with M3U8 Quality Parsing)
// @namespace    http://your.namespace
// @version      3.5
// @description  Detect multiple video URLs, including M3U8 resolutions, and copy to clipboard
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537215/ClipboardUrler%20Pro%20%28with%20M3U8%20Quality%20Parsing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537215/ClipboardUrler%20Pro%20%28with%20M3U8%20Quality%20Parsing%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const videoExtensions = /\.(mp4|webm|mkv|avi|mov|m3u8|ts|flv|f4v|3gp|3g2|ogv|rm|rmvb|asf|wmv|m4v|vob|mpeg|mpg|m2ts|mts)(\?|#|$)/i;

    const fetchedManifests = new Set();
    const foundURLs = new Set();

    function isValidVideoURL(url) {
        return url && !url.startsWith('blob:') && /^https?:\/\//.test(url) && videoExtensions.test(url);
    }

    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: '99999',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.95)',
        padding: '6px',
        borderRadius: '8px',
        boxShadow: '0 0 6px rgba(0,0,0,0.4)',
        fontSize: '12px',
        fontFamily: 'sans-serif'
    });

    const select = document.createElement('select');
    Object.assign(select.style, {
        fontSize: '12px',
        padding: '4px',
        maxWidth: '280px'
    });

    const btn = document.createElement('button');
    btn.textContent = '📋 Copy';
    Object.assign(btn.style, {
        fontSize: '13px',
        padding: '4px 10px',
        cursor: 'pointer',
        borderRadius: '4px',
        border: 'none',
        background: '#333',
        color: '#fff'
    });

    const tooltip = document.createElement('div');
    tooltip.textContent = 'Copied!';
    Object.assign(tooltip.style, {
        position: 'fixed',
        bottom: '40px',
        left: '10px',
        padding: '4px 8px',
        background: '#333',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '12px',
        opacity: '0',
        transition: 'opacity 0.3s',
        zIndex: '99999',
        pointerEvents: 'none'
    });

    wrapper.appendChild(select);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);
    document.body.appendChild(tooltip);
    wrapper.style.display = 'none';

    btn.onclick = () => {
        const url = select.value;
        if (url) {
            navigator.clipboard.writeText(url).then(() => {
                tooltip.style.opacity = '1';
                setTimeout(() => (tooltip.style.opacity = '0'), 1000);
            });
        }
    };

    function addURL(url, label = '') {
        if (foundURLs.has(url)) return;
        foundURLs.add(url);
        const option = document.createElement('option');
        option.value = url;
        option.textContent = label || (url.length > 60 ? url.slice(0, 60) + '...' : url);
        select.appendChild(option);
    }

    async function parseM3U8(masterUrl) {
        if (fetchedManifests.has(masterUrl)) return;
        fetchedManifests.add(masterUrl);

        try {
            const res = await fetch(masterUrl);
            const text = await res.text();
            const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf('/') + 1);

            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.startsWith('#EXT-X-STREAM-INF')) {
                    const nextLine = lines[i + 1];
                    const matchRes = line.match(/RESOLUTION=(\d+x\d+)/);
                    const matchBw = line.match(/BANDWIDTH=(\d+)/);
                    let label = 'M3U8 Stream';
                    if (matchRes) label = matchRes[1];
                    else if (matchBw) label = `${(parseInt(matchBw[1]) / 1000).toFixed(0)}kbps`;

                    const finalURL = nextLine.startsWith('http') ? nextLine : baseUrl + nextLine;
                    addURL(finalURL, label);
                }
            }
        } catch (e) {
            console.warn('Failed to parse M3U8:', e);
        }
    }

    function detectAllVideoURLs() {
        const candidates = new Set();

        document.querySelectorAll('video, a[href], iframe').forEach(el => {
            let src = el.currentSrc || el.src || el.href || '';
            if (!src || typeof src !== 'string') return;

            if (el.tagName === 'IFRAME') {
                if (src.includes('youtube.com/embed/')) {
                    const id = src.split('/').pop().split('?')[0];
                    candidates.add(`https://www.youtube.com/watch?v=${id}`);
                } else if (src.includes('player.vimeo.com/video/')) {
                    const id = src.split('/').pop().split('?')[0];
                    candidates.add(`https://vimeo.com/${id}`);
                } else if (isValidVideoURL(src)) {
                    candidates.add(src);
                }
            } else if (isValidVideoURL(src)) {
                candidates.add(src);
            }
        });

        if (candidates.size > 0) {
            wrapper.style.display = 'flex';
            candidates.forEach(url => {
                addURL(url);

                if (url.endsWith('.m3u8')) {
                    parseM3U8(url);
                }
            });
        } else {
            wrapper.style.display = 'none';
        }
    }

    setInterval(detectAllVideoURLs, 4000); // check every few seconds
})();