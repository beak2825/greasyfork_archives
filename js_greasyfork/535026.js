// ==UserScript==
// @name         Pixel sites real online
// @namespace    https://pixels.fun
// @version      1.8
// @license      MIT
// @description  Real online, allows canvas online
// @author       small bee
// @match        *://*.fun/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535026/Pixel%20sites%20real%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/535026/Pixel%20sites%20real%20online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastSum = 0;
    let textNode = null;
    let observer = null;

    async function updateOnlineCount() {
        try {
            const res = await fetch('/api/shards', { credentials: 'same-origin' });
            if (!res.ok) return;
            const data = await res.json();
            let sum = 0;
            data.forEach(item => {
                if (Array.isArray(item) && item[1]) {
                    Object.entries(item[1]).forEach(([k, v]) => {
                        if (k !== 'total' && typeof v === 'number') sum += v;
                    });
                }
            });

            const span = document.querySelector('.onlinebox span[title="Total Online Users"]');
            if (!span) return;

            if (!textNode) {
                textNode = Array.from(span.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                if (!textNode) {
                    textNode = document.createTextNode('');
                    span.insertBefore(textNode, span.firstChild);
                }
            }

            lastSum = sum;
            textNode.textContent = lastSum;
        } catch (err) {
            console.error('updateOnlineCount error', err);
        }
    }

    function observeTextNode() {
        if (observer) observer.disconnect();
        if (!textNode) return;

        observer = new MutationObserver(mutations => {
            const span = textNode.parentNode;
            if (span.getAttribute('title') !== 'Total Online Users') return;

            for (const m of mutations) {
                if (m.type === 'characterData' && m.target === textNode) {
                    if (m.target.nodeValue !== String(lastSum)) {
                        console.warn('Blocked external change to online count:', m.target.nodeValue);
                        m.target.nodeValue = String(lastSum);
                    }
                }
            }
        });

        observer.observe(textNode, { characterData: true });
    }

    async function showCanvasOnline() {
        const div = document.querySelector('.onlinebox');
        if (!div) return;

        div.addEventListener('click', async () => {
            const span = div.querySelector('span[title="Total Online Users"]');
            if (!span || span.querySelectorAll('svg').length < 2) return;

            const hash = window.location.hash;
            const match = /^#([a-z0-9])/i.exec(hash);
            if (!match) return;
            const letter = match[1];

            try {
                const meRes = await fetch('/api/me', { credentials: 'same-origin' });
                if (!meRes.ok) return;
                const me = await meRes.json();
                const canvases = me.canvases || {};

                let canvasId = null;
                for (const [id, info] of Object.entries(canvases)) {
                    if (info.ident === letter) {
                        canvasId = id;
                        break;
                    }
                }
                if (canvasId === null) return;

                const shardsRes = await fetch('/api/shards', { credentials: 'same-origin' });
                if (!shardsRes.ok) return;
                const shards = await shardsRes.json();

                let onlineCount = null;
                for (const item of shards) {
                    if (Array.isArray(item) && item[1] && item[1][canvasId] != null) {
                        onlineCount = item[1][canvasId];
                        break;
                    }
                }
                if (onlineCount == null) return;

                span.setAttribute('title', 'Online Users on Canvas');

                if (!textNode) {
                    textNode = Array.from(span.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                    if (!textNode) {
                        textNode = document.createTextNode('');
                        span.insertBefore(textNode, span.firstChild);
                    }
                }

                lastSum = onlineCount;
                textNode.textContent = lastSum;

                observeTextNode();
            } catch (err) {
                console.error('showCanvasOnline error', err);
            }
        });
    }

    updateOnlineCount().then(observeTextNode);
    setInterval(updateOnlineCount, 15000);
    showCanvasOnline();

})();
