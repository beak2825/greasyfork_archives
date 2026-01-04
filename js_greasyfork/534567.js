// ==UserScript==
// @name         AagMaal Streamtape Inline Resolver (Safe Buttons with Play & Download)
// @namespace    
// @version      1.4
// @description  Add 'Resolve & Play' buttons with Play & Download options after resolving Streamtape link
// @match        https://aagmaal.boo/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534567/AagMaal%20Streamtape%20Inline%20Resolver%20%28Safe%20Buttons%20with%20Play%20%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534567/AagMaal%20Streamtape%20Inline%20Resolver%20%28Safe%20Buttons%20with%20Play%20%20Download%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STREAMTAPE_HOSTS = [
        'streamtape.com', 'strtape.cloud', 'streamtape.net', 'streamta.pe', 'streamtape.site',
        'strcloud.link', 'strcloud.club', 'strtpe.link', 'streamtape.cc', 'scloud.online',
        'stape.fun', 'streamadblockplus.com', 'shavetape.cash', 'streamtape.to', 'streamta.site',
        'streamadblocker.xyz', 'tapewithadblock.org', 'adblocktape.wiki', 'antiadtape.com',
        'streamtape.xyz', 'tapeblocker.com', 'streamnoads.com', 'tapeadvertisement.com',
        'tapeadsenjoyer.com', 'watchadsontape.com'
    ];

    function isStreamtapeLink(href) {
        return STREAMTAPE_HOSTS.some(host => href.includes(host));
    }

    function resolveStreamtape(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Referer': new URL(url).origin + '/'
                },
                onload: function (response) {
                    const html = response.responseText;
                    const matches = html.match(/ById\('.+?=\s*(["']\/\/[^;<]+)/);
                    if (!matches) return resolve(null);

                    let src_url = '';
                    const parts = matches[1].replace(/'/g, '"').split('+');
                    for (const part of parts) {
                        const p1Match = part.match(/"([^"]*)/);
                        if (!p1Match) continue;
                        let p1 = p1Match[1];
                        let p2 = 0;
                        if (part.includes('substring')) {
                            const subst = part.match(/substring\((\d+)/g);
                            if (subst) {
                                for (const sub of subst) {
                                    p2 += parseInt(sub.replace('substring(', ''), 10);
                                }
                            }
                        }
                        src_url += p1.substring(p2);
                    }

                    src_url += '&stream=1';
                    const finalUrl = src_url.startsWith('//') ? 'https:' + src_url : src_url;

                    GM_xmlhttpRequest({
                        method: 'HEAD',
                        url: finalUrl,
                        headers: {
                            'User-Agent': navigator.userAgent,
                            'Referer': url
                        },
                        onload: function (redirectResponse) {
                            const redirectUrl = redirectResponse.finalUrl || finalUrl;
                            resolve(redirectUrl);
                        },
                        onerror: () => resolve(finalUrl)
                    });
                },
                onerror: () => resolve(null)
            });
        });
    }

    function fetchVideoPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: { 'User-Agent': navigator.userAgent },
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    resolve(doc);
                },
                onerror: () => reject(new Error('Page fetch failed'))
            });
        });
    }

    function playInModal(url) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.8)';
        modal.style.zIndex = '10001';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        const closeModalBtn = document.createElement('button');
        closeModalBtn.textContent = 'Close';
        styleButton(closeModalBtn, '#f44336');
        closeModalBtn.style.position = 'absolute';
        closeModalBtn.style.top = '20px';
        closeModalBtn.style.right = '20px';
        closeModalBtn.onclick = () => document.body.removeChild(modal);

        const player = document.createElement('video');
        player.controls = true;
        player.autoplay = true;
        player.style.maxWidth = '90%';
        player.style.maxHeight = '80%';
        player.src = url;

        modal.appendChild(closeModalBtn);
        modal.appendChild(player);
        document.body.appendChild(modal);
    }

    function downloadVideo(url, title) {
        const a = document.createElement('a');
        a.href = url;
        a.download = title || 'download.mp4'; // Use title if available, otherwise 'download.mp4'
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function styleButton(btn, bg, size = 'normal') {
        btn.style.padding = size === 'small' ? '2px 8px' : '4px 10px';
        btn.style.fontSize = size === 'small' ? '11px' : '13px';
        btn.style.background = bg;
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.marginTop = '8px';
        btn.style.display = 'inline-block';
    }

    function addSafeResolveButtons() {
        const articles = document.querySelectorAll('article[data-video-uid]');

        for (const article of articles) {
            const existing = article.querySelector('.inline-resolve-btn');
            if (existing) continue;

            const anchor = article.querySelector('a[href]');
            if (!anchor) continue;

            const videoUrl = anchor.href;
            const title = article.querySelector('.entry-header')?.textContent.trim() || 'Untitled';

            // Create button wrapper separate from <a>
            const btn = document.createElement('button');
            btn.className = 'inline-resolve-btn';
            btn.textContent = '▶ Resolve & Play';
            styleButton(btn, '#9c27b0');

            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                btn.disabled = true;
                btn.textContent = '⏳ Resolving...';

                try {
                    const doc = await fetchVideoPage(videoUrl);
                    const links = doc.querySelectorAll('a[href]');
                    for (const link of links) {
                        const href = link.href;
                        if (isStreamtapeLink(href)) {
                            const directUrl = await resolveStreamtape(href);
                            if (!directUrl) throw new Error('Resolution failed');

                            // Remove previous button and add new buttons (Play & Download)
                            article.removeChild(btn);

                            const playBtn = document.createElement('button');
                            playBtn.textContent = '▶ Play';
                            styleButton(playBtn, '#4caf50');
                            playBtn.onclick = () => playInModal(directUrl);
                            article.appendChild(playBtn);

                            const downloadBtn = document.createElement('button');
                            downloadBtn.textContent = '📥 Download';
                            styleButton(downloadBtn, '#1976d2');
                            downloadBtn.onclick = () => downloadVideo(directUrl, title);
                            article.appendChild(downloadBtn);

                            return;
                        }
                    }
                    alert('No Streamtape link found.');
                } catch (err) {
                    alert('Error: ' + err.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = '▶ Resolve & Play';
                }
            });

            // Insert the button after the <a> element
            anchor.parentElement.appendChild(btn);
        }
    }

    function init() {
        addSafeResolveButtons();

        // Optional: observe DOM in case videos are dynamically added
        const observer = new MutationObserver(() => addSafeResolveButtons());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
