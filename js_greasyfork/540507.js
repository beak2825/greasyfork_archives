// ==UserScript==
// @name         Monkey Kick Embedder
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Puts Marks Kick stream on his Twitch page
// @author       igloolik
// @match        https://www.twitch.tv/*
// @grant        GM_xmlhttpRequest
// @connect      kick.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540507/Monkey%20Kick%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/540507/Monkey%20Kick%20Embedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config & state
    const cfg = {
        channel: 'catlover271',
        kickChannel: 'imnotbannedontw',
        intervals: {check: 1000, url: 1000}, // removed live interval, not needed
    };

    let S = {
        player: null, orig: null, kick: false,
        intv: {}, btnAdded: false, lastUrl: '',
        isTarget: false, curTwitch: '',
    };

    // HTML templates & styles
    const h = {
        s: { // Status indicators
            live: `<span class="k-live" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f00;margin-right:8px;"></span>`,
            off: `<span class="k-off" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#888;margin-right:8px;"></span>`,
            err: `<span class="k-err" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#fc0;margin-right:8px;"></span>`
        },
        i: { // Icons
            k: `<span style="font-size:18px;font-weight:bold;text-align:center;display:inline-block;width:100%;">K</span>`,
            t: `<span style="display:flex;align-items:center;justify-content:center;width:100%;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"/></svg></span>`,
            dn: `<span class="k-arrow" style="margin-left:5px;width:14px;text-align:center;">&#9660;</span>`,
            up: `<span class="k-arrow" style="margin-left:5px;width:14px;text-align:center;">&#9650;</span>`,
            sf: `<svg width="20" height="20" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFD700" /></svg>`,
            se: `<svg width="20" height="20" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="none" stroke="#FFD700" stroke-width="1.5" /></svg>`,
            tr: `<svg width="18" height="18" viewBox="0 0 24 24" style="margin-left:8px;cursor:pointer;vertical-align:middle;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#ff6b6b"/></svg>`
        },
        c: { // CSS
            btn: {
                base: `position:absolute;top:10px;z-index:9999;color:white;border:none;border-radius:4px;padding:6px 10px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;height:30px;`,
                main: `background:#00b800;right:25%;min-width:125px;white-space:nowrap;`,
                min: `background:#00b800;right:calc(25% + 45px);width:40px;transition:width 0.5s ease;`,
                exp: `background:#00b800;right:calc(25% + 45px);width:auto;transition:width 0.5s ease;`,
                twitch: `background:#772ce8;right:25%;width:40px;`
            }
        }
    };

    // Initialize script
    function init() {
        S.lastUrl = location.href;
        S.intv.url = setInterval(checkUrl, cfg.intervals.url);
        window.addEventListener('popstate', checkUrl);
    }

    // Check if URL changed and we're on target channel
    function checkUrl() {
        const url = location.href;
        const changed = url !== S.lastUrl;
        const match = location.pathname.match(/^\/([^\/]+)/);
        const ch = match ? match[1].toLowerCase() : '';
        const onTarget = ch === cfg.channel.toLowerCase();
        if (!changed && !S.isTarget && onTarget) {
            S.curTwitch = ch;
            S.isTarget = true;
            if (!S.intv.check) S.intv.check = setInterval(findPlayer, cfg.intervals.check);
            return;
        }
        if (!changed) return;
        S.lastUrl = url;
        if (S.kick && ch !== S.curTwitch && ch) {
            if (S.player && S.orig) {
                S.player.innerHTML = S.orig;
                S.kick = false;
            }
        }
        S.curTwitch = ch;
        if (onTarget && !S.isTarget) {
            S.isTarget = true;
            if (!S.intv.check) S.intv.check = setInterval(findPlayer, cfg.intervals.check);
        } else if (!onTarget && S.isTarget) {
            S.isTarget = false;
            if (S.intv.check) {
                clearInterval(S.intv.check);
                S.intv.check = null;
            }
            S.player = null;
            S.btnAdded = false;
        }
    }

    // Find Twitch player
    function findPlayer() {
        if (!S.isTarget) return;
        const selectors = [
            '.video-player__container', '.video-player', '.player-overlay',
            '.video-ref', '.channel-root .persistent-player',
            '.channel-info-content .persistent-player', '.persistent-player',
            '.stream-player', '[data-a-target="video-player"]', '.player',
            '.video-player__container div[data-a-target="player-overlay"]'
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                clearInterval(S.intv.check);
                S.intv.check = null;
                S.player = el;
                S.player.style.position = 'relative';
                S.player.style.overflow = 'hidden';
                if (!S.btnAdded) {
                    if (cfg.channel.toLowerCase() === 'catlover271' && S.curTwitch === 'catlover271') {
                        S.orig = S.player.innerHTML;
                        embedKick(cfg.kickChannel);
                        S.btnAdded = true;
                    }
                }
                break;
            }
        }
    }

    // Embed Kick player
    function embedKick(channelName) {
        S.curKick = channelName;
        if (!S.orig) {
            S.orig = S.player.innerHTML;
        }
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.innerHTML = `
            <iframe
                id="kick-iframe"
                height="100%"
                width="100%"
                scrolling="no"
                style="border:none;"
                src="https://player.kick.com/${channelName}">
            </iframe>
        `;
        S.player.innerHTML = '';
        S.player.appendChild(container);
        S.kick = true;
    }

    // Start the script
    init();
})();