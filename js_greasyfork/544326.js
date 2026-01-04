// ==UserScript==
// @name         YT Floating Utils
// @namespace    your.namespace
// @version      1.0
// @description  Shared utility functions for YouTube floating player/scripts
// @author       you
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function restorePlayerLayoutOrDefault(playerBox) {
        let key = localStorage.getItem('yt_last_layout_key');
        let layout;
        if (key && localStorage.getItem(key)) {
            layout = JSON.parse(localStorage.getItem(key));
        }
        if (!layout && localStorage.getItem('yt_layout_1')) {
            key = 'yt_layout_1';
            layout = JSON.parse(localStorage.getItem('yt_layout_1'));
        }
        if (!layout) {
            layout = { top: 120, left: 140, width: 480, height: 272 };
        }
        playerBox.style.top = layout.top + 'px';
        playerBox.style.left = layout.left + 'px';
        playerBox.style.width = layout.width + 'px';
        playerBox.style.height = layout.height + 'px';
    }

    function getVideoIdFromIframeSrc(src) {
        try {
            const url = new URL(src);
            const match = url.pathname.match(/\/embed\/([^/?]+)/);
            return match?.[1] || null;
        } catch { return null; }
    }

    function extractVideoIdFromUrl(href) {
        try {
            const url = new URL(href, location.origin);
            if (url.pathname.startsWith('/watch')) {
                return url.searchParams.get('v');
            } else if (url.pathname.startsWith('/shorts/')) {
                return url.pathname.split('/shorts/')[1];
            }
        } catch (err) {}
        return null;
    }

    function getNextLayoutNumber() {
        const usedNums = Object.keys(localStorage)
            .filter(k => k.startsWith('yt_layout_'))
            .map(k => parseInt(k.replace('yt_layout_', ''), 10))
            .sort((a, b) => a - b);
        for (let i = 1; i <= 5; i++) {
            if (!usedNums.includes(i)) return i;
        }
        let next = 1;
        while (usedNums.includes(next)) next++;
        return next;
    }

    function saveLayout(box, STORAGE_KEY, layoutInitialized) {
        const rect = box.getBoundingClientRect();
        if (!layoutInitialized) return;
        if (rect.width < 100 || rect.height < 100) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            bottom: null,
            right: null
        }));
    }

    function applySavedLayout(box, STORAGE_KEY, layoutInitialized) {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const validWidth = saved.width && saved.width > 100;
        const validHeight = saved.height && saved.height > 100;
        if (!validWidth || !validHeight) {
            box.style.width = '320px';
            box.style.height = '180px';
            box.style.top = '';
            box.style.left = '';
            box.style.right = '';
            box.style.bottom = '100px';
            layoutInitialized = true;
            return;
        }
        box.style.top = '';
        box.style.left = '';
        box.style.right = '';
        box.style.bottom = '';
        box.style.width = saved.width + 'px';
        box.style.height = saved.height + 'px';
        if (typeof saved.top === 'number') box.style.top = saved.top + 'px';
        else box.style.bottom = '100px';
        if (typeof saved.left === 'number') box.style.left = saved.left + 'px';
        else box.style.right = '30px';
        layoutInitialized = true;
    }

    function saveWatchLaterPanelState(panel) {
        localStorage.setItem('watchLaterPanelPos', JSON.stringify({
            top: panel.style.top,
            left: panel.style.left,
            width: panel.style.width,
            height: panel.style.height
        }));
    }

    function restoreWatchLaterPanelState(panel) {
        const state = JSON.parse(localStorage.getItem('watchLaterPanelPos') || '{}');
        if (state.top) panel.style.top = state.top;
        if (state.left) panel.style.left = state.left;
        if (state.width) panel.style.width = state.width;
        if (state.height) panel.style.height = state.height;
    }

    function extractWatchLaterVideos() {
        const items = document.querySelectorAll('ytd-playlist-video-renderer');
        return Array.from(items).map(el => {
            const titleEl = el.querySelector('#video-title');
            const href = titleEl?.href || '#';
            const title = titleEl?.textContent.trim() || 'Untitled';
            const imgEl = el.querySelector('.yt-core-image img') || el.querySelector('img');
            let thumb = '';
            if (imgEl) {
                if (imgEl.src && !imgEl.src.startsWith('data:')) thumb = imgEl.src;
                else if (imgEl.dataset.src) thumb = imgEl.dataset.src;
                else if (imgEl.getAttribute('data-thumb')) thumb = imgEl.getAttribute('data-thumb');
            }
            return { title, href, thumb };
        });
    }

    function showVolumeAtCursor(volumePercent, x, y, minimal = false) {
        if (!window.volumeIndicator) return;
        window.volumeIndicator.textContent = minimal
            ? `${volumePercent}`
            : (volumePercent === "0" ? '🔇 0%' : `🔊 ${volumePercent}%`);
        window.volumeIndicator.style.top = `${y - 2}px`;
        window.volumeIndicator.style.left = `${x + 20}px`;
        window.volumeIndicator.style.opacity = '1';
        window.volumeIndicator.style.background = 'transparent';
        window.volumeIndicator.style.padding = '0';
        window.volumeIndicator.style.fontSize = '32px';
        window.volumeIndicator.style.fontWeight = '900';
        window.volumeIndicator.style.color = 'white';
        window.volumeIndicator.style.textShadow = '1px 1px 2px black';
        clearTimeout(window.volumeIndicator._hideTimeout);
        window.volumeIndicator._hideTimeout = setTimeout(() => {
            window.volumeIndicator.style.opacity = '0';
        }, 800);
    }

    function showToast(msg) {
        if (!window.toast) return;
        window.toast.textContent = msg;
        window.toast.style.opacity = '1';
        window.toast.style.transform = 'translateX(-50%) scale(1.2)';
        window.toast.style.transition = 'opacity 0.4s ease, transform 0.2s ease';
        setTimeout(() => {
            window.toast.style.opacity = '0';
            window.toast.style.transform = 'translateX(-50%) scale(1)';
        }, 800);
    }

    function attachContextMenu(btn, layoutKey) {
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const existing = JSON.parse(localStorage.getItem(layoutKey));
            if (!existing) return;
            const menu = document.getElementById('customLayoutMenu');
            if (!menu) return;
            menu.innerHTML = '';
            const rename = document.createElement('div');
            rename.textContent = '✏️ Rename';
            rename.style.cssText = 'padding:6px 12px;cursor:pointer;';
            rename.onclick = () => {
                const newLabel = prompt('Enter new button label:', btn.textContent);
                if (newLabel) {
                    btn.textContent = newLabel;
                    showToast(`✅ Renamed to ${newLabel}`);
                }
                menu.style.display = 'none';
            };
            const edit = document.createElement('div');
            edit.textContent = 'Edit Position & Size';
            edit.style.cssText = 'padding:6px 12px;cursor:pointer;';
            edit.onclick = () => {
                const newTop = prompt('Top:', existing.top);
                const newLeft = prompt('Left:', existing.left);
                const newWidth = prompt('Width:', existing.width);
                const newHeight = prompt('Height:', existing.height);
                if ([newTop, newLeft, newWidth, newHeight].every(val => !isNaN(val))) {
                    const updated = {
                        top: parseInt(newTop),
                        left: parseInt(newLeft),
                        width: parseInt(newWidth),
                        height: parseInt(newHeight)
                    };
                    localStorage.setItem(layoutKey, JSON.stringify(updated));
                    showToast('✅ Layout updated');
                } else {
                    showToast('❌ Invalid input');
                }
                menu.style.display = 'none';
            };
            const del = document.createElement('div');
            del.textContent = '🗑 Delete';
            del.style.cssText = 'padding:6px 12px;color:red;cursor:pointer;';
            del.onclick = () => {
                if (confirm('Delete this layout?')) {
                    localStorage.removeItem(layoutKey);
                    btn.parentNode?.removeChild(btn);
                    showToast('🗑 Layout deleted');
                }
                menu.style.display = 'none';
            };
            [rename, edit, del].forEach(item => {
                item.addEventListener('mouseover', () => {
                    item.style.background = '#f0f0f0';
                });
                item.addEventListener('mouseout', () => {
                    item.style.background = 'white';
                });
                menu.appendChild(item);
            });
            menu.style.top = e.clientY + 'px';
            menu.style.left = e.clientX + 'px';
            menu.style.display = 'block';
        });
    }

    function setPanelVisibility(isVisible, panelId, commentBtn, comKey, btnOn, btnOff) {
        const panel = document.getElementById(panelId);
        if (!panel) {
            showToast('❌ Floating Comments Panel not found!');
            return false;
        }
        panel.style.display = isVisible ? 'block' : 'none';
        commentBtn.textContent = isVisible ? btnOn : btnOff;
        commentBtn.title = `Toggle Floating Comments Panel (${isVisible ? 'ON' : 'OFF'})`;
        localStorage.setItem(comKey, isVisible ? 'on' : 'off');
        return true;
    }

    function getYouTubeMainVolume() {
        const slider = document.querySelector('.ytp-volume-panel .ytp-volume-slider-handle');
        const val = slider?.getAttribute('aria-valuenow');
        return val ? parseInt(val) : null;
    }

    function getIframeCurrentTime(iframe, cb) {
        const handler = (e) => {
            if (e.origin.includes('youtube')) {
                try {
                    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
                    if (data.event === 'infoDelivery' && typeof data.info === 'number') {
                        window.removeEventListener('message', handler);
                        cb(data.info);
                    }
                } catch (err) {}
            }
        };
        window.addEventListener('message', handler);
        iframe.contentWindow?.postMessage(JSON.stringify({
            event: "command",
            func: "getCurrentTime",
            args: []
        }), "*");
    }

    async function fetchVideoTitle(videoId) {
        const html = await fetch(`https://corsproxy.io/?https://www.youtube.com/watch?v=${videoId}`).then(r => r.text());
        let m = html.match(/<title>(.*?)<\/title>/i);
        return m ? m[1].replace(' - YouTube', '').trim() : videoId;
    }

    async function fetchChannelNameByVideoId(videoId) {
        const html = await fetch(`https://corsproxy.io/?https://www.youtube.com/watch?v=${videoId}`).then(r => r.text());
        let m = html.match(/"ownerChannelName":"(.*?)"/);
        if (!m) m = html.match(/<link itemprop="name" content="([^"]+)"\/?>/);
        if (!m) {
            m = html.match(/<a[^>]*href="\/@(.*?)"[^>]*>([^<]+)<\/a>/);
            if (m && m[2]) return m[2].trim();
        }
        return m ? m[1].trim() : '';
    }

    async function fetchCommentsHTML(videoId) {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const resp = await fetch(url);
        const text = await resp.text();
        const ytInitialDataMatch = text.match(/var ytInitialData = (.*?);<\/script>/s);
        const ytInitialData = ytInitialDataMatch ? JSON.parse(ytInitialDataMatch[1]) : null;
        const threads = [];
        if (ytInitialData) {
            let section = ytInitialData.contents
                ?.twoColumnWatchNextResults
                ?.results
                ?.results
                ?.contents
                ?.find(x => x.itemSectionRenderer && x.itemSectionRenderer.sectionIdentifier === "comment-item-section");
            let items = section?.itemSectionRenderer?.contents || [];
            for (const t of items) {
                if (t.commentThreadRenderer) {
                    threads.push(t.commentThreadRenderer);
                }
            }
        }
        return threads;
    }

    async function updateCommentsPanelForVideo(videoId) {
        const panel = document.getElementById('yt-main-comments-float-panel');
        if (!panel) return;
        panel.innerHTML = '<div style="padding:12px;font-size:14px;">Loading comments...</div>';
        let threads = [];
        try {
            threads = await fetchCommentsHTML(videoId);
        } catch (e) {
            panel.innerHTML = '<div style="padding:12px;font-size:14px;">Failed to load comments.</div>';
            return;
        }
        if (!threads.length) {
            panel.innerHTML = '<div style="padding:12px;font-size:14px;">No comments found (may be disabled, restricted, or private).</div>';
            return;
        }
        panel.innerHTML = '';
        threads.forEach(thread => {
            const c = thread.commentRenderer || thread.commentThreadRenderer?.comment?.commentRenderer;
            if (!c) return;
            const author = c.authorText?.simpleText || '';
            const content = c.contentText?.runs?.map(r => r.text).join('') || '';
            const commentDiv = document.createElement('div');
            commentDiv.style = 'margin-bottom:12px; padding:6px 0; border-bottom:1px solid #eee;';
            commentDiv.innerHTML = `<b>${author}</b><br>${content}`;
            panel.appendChild(commentDiv);
        });
    }

    function isArabic(text) {
        return /[\u0600-\u06FF]/.test(text);
    }

    async function getVideoTitleById(videoId) {
        let url = `https://www.youtube.com/watch?v=${videoId}`;
        let html = await fetch(url).then(r => r.text());
        let m = html.match(/<title>([^<]+)<\/title>/);
        return m ? m[1].replace(' - YouTube', '').trim() : videoId;
    }

    window.YTFloatingUtils = {
        restorePlayerLayoutOrDefault,
        getVideoIdFromIframeSrc,
        extractVideoIdFromUrl,
        getNextLayoutNumber,
        saveLayout,
        applySavedLayout,
        saveWatchLaterPanelState,
        restoreWatchLaterPanelState,
        extractWatchLaterVideos,
        showVolumeAtCursor,
        showToast,
        attachContextMenu,
        setPanelVisibility,
        getYouTubeMainVolume,
        getIframeCurrentTime,
        fetchVideoTitle,
        fetchChannelNameByVideoId,
        updateCommentsPanelForVideo,
        isArabic,
        getVideoTitleById
    };

})();
