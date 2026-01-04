// ==UserScript==
// @name         super haxx
// @namespace    http://tampermonkey.net/
// @version      1
// @author       iogamesplayer / dutch man
// @description  become the sigma you were ment to be
// @match        *://*.drednot.io/*
// @grant        none.
// @license      MIT
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @downloadURL https://update.greasyfork.org/scripts/546514/super%20haxx.user.js
// @updateURL https://update.greasyfork.org/scripts/546514/super%20haxx.meta.js
// ==/UserScript==

// # USE AT YOUR OWN RISK - YOU MIGHT GET BANNED!
// - Red dot = that block was CERTAINLY shot - there is someone there
// - Yellow dot =  that block was either destroyed or regenerated
// - Green dot = only trust in mission zones

(() => {
    'use strict';
    const MINIMAP_SIZE = 150;
    const DOT_RADIUS = 3;
    const DOT_DURATION = 5000;
    const dots = [];
    const SETTINGS = {
        cheat: true
    };

    function loadSettings() {
        try {
            const settingsCookie = document.cookie.split('; ')
            .find(row => row.startsWith('pants='));
            if (settingsCookie) {
                const settingsJSON = decodeURIComponent(settingsCookie.split('=')[1]);
                Object.assign(SETTINGS, JSON.parse(settingsJSON));
            }
        } catch (e) {
            console.error('lse', e);
        }
    }

    function saveSettings() {
        try {
            const settingsJSON = JSON.stringify(SETTINGS);
            document.cookie = `pants=${encodeURIComponent(settingsJSON)}; path=/; max-age=${60*60*24*365}`;
        } catch (e) {
            console.error('sse', e);
        }
    }

    function createSettingsUI() {
        if (document.getElementById('pants')) return;
        const settingsPanel = document.querySelector('#new-ui-left section');
        if (!settingsPanel) return;
        const container = document.createElement('div');
        container.id = 'pants';
        container.style.border = '1px solid #fff';
        container.style.padding = '10px';
        container.style.margin = '10px 0';
        container.style.borderRadius = '0px';
        container.style.background = '#19232d';
        container.style.color = 'white';
        container.innerHTML = `
        <h3 style="margin: 0 0 8px; font-size: 1.1em;">Settings</h3>
        <div>
        <label style="display: flex; align-items: center; gap: 6px;">
        <input type="checkbox" id="hack" ${SETTINGS.cheat ? 'checked' : ''} />
        Enable
        </label>
        </div>
        `;
        container.querySelector('#hack').addEventListener('change', e => {
            SETTINGS.cheat = e.target.checked;
            saveSettings();
            updateVisibility();
        });
        settingsPanel.parentNode.insertBefore(container, settingsPanel.nextSibling);
    }

    function updateVisibility() {
        if (overlay) {
            overlay.style.display = SETTINGS.cheat ? 'block' : 'none';
        }
    }

    const overlay = document.createElement('canvas');
    overlay.width = MINIMAP_SIZE;
    overlay.height = MINIMAP_SIZE;
    overlay.style.position = 'fixed';
    overlay.style.bottom = '100px';
    overlay.style.right = '22px';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = 99999;
    document.body.appendChild(overlay);

    const ctx = overlay.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const scaleFactor = 4;
    const offscreen = document.createElement('canvas');
    offscreen.width = MINIMAP_SIZE * scaleFactor;
    offscreen.height = MINIMAP_SIZE * scaleFactor;
    const offCtx = offscreen.getContext('2d');
    offCtx.imageSmoothingEnabled = false;

    function drawDots() {
        if (!SETTINGS.cheat) return;
        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        const now = Date.now();
        const cellSize = (MINIMAP_SIZE * scaleFactor) / 5;
        for (let i = dots.length - 1; i >= 0; i--) {
            const dot = dots[i];
            if (dot.expires && now > dot.expires) {
                dots.splice(i, 1);
                continue;
            }
            const x = dot.col * cellSize;
            const y = (5 - dot.row) * cellSize;
            offCtx.fillStyle = dot.color || 'red';
            offCtx.strokeStyle = 'black';
            offCtx.lineWidth = DOT_RADIUS * 3;
            offCtx.beginPath();
            offCtx.moveTo(x, y - DOT_RADIUS * scaleFactor);
            offCtx.lineTo(x + DOT_RADIUS * scaleFactor, y);
            offCtx.lineTo(x, y + DOT_RADIUS * scaleFactor);
            offCtx.lineTo(x - DOT_RADIUS * scaleFactor, y);
            offCtx.closePath();
            offCtx.stroke();
            offCtx.fill();
        }
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        ctx.drawImage(offscreen, 0, 0, overlay.width, overlay.height);
    }

    setInterval(drawDots, 100);

    window.addMinimapDot = function(row, col, color = 'red') {
        if (!SETTINGS.cheat) return;
        const expires = Date.now() + DOT_DURATION;
        dots.push({ row, col, color, expires });
    };

    let wsRef = null;

    function interceptWebSockets() {
        const RealWS = window.WebSocket;
        window.WebSocket = function (url, proto) {
            const ws = new RealWS(url, proto);
            wsRef = ws;
            ws.addEventListener('message', e => {
                try {
                    const data = e.data;
                    if (data instanceof Blob) {
                        data.arrayBuffer().then(buf => handleMessage(new Uint8Array(buf)));
                    } else if (data instanceof ArrayBuffer) {
                        handleMessage(new Uint8Array(data));
                    }
                } catch (err) {
                    console.warn('wse:', err);
                }
            });
            return ws;
        };
        window.WebSocket.prototype = RealWS.prototype;
    }

    function handleMessage(data) {
        try {
            const packet = msgpack.decode(data);
            if (packet.type === 15 && typeof packet.x === 'number' && typeof packet.y === 'number' && 'world' in packet) {
                if (!SETTINGS.cheat || packet.m === 9 || packet.m === 10) return;
                const worldID = packet.world;
                let WORLD_SIZE = (worldID === 0 || worldID === 4 || worldID === 11 || worldID === 7) ? 200 : 450;
                let color = (packet.m != 10 && packet.m != 9 && packet.d === 255) ? 'yellow' : 'red';
                if (worldID > 100) {
                    WORLD_SIZE = 150;
                    color = 'green';
                }
                const TILE_SIZE = WORLD_SIZE / 5;
                const col = packet.x / TILE_SIZE;
                const row = packet.y / TILE_SIZE;
                const expires = Date.now() + DOT_DURATION;
                dots.push({ row, col, color: color, expires });
            }
        } catch (err) {
            if (!err.message.includes('BUFFER_SHORTAGE')) {
                console.warn('Decode error:', err);
            }
        }
    }

    interceptWebSockets();

    loadSettings();
    updateVisibility();

    const uiObserver = new MutationObserver(() => {
        createSettingsUI();
    });

    window.addEventListener('load', () => {
        createSettingsUI();
        const uiLeft = document.querySelector('#new-ui-left');
        if (uiLeft) {
            uiObserver.observe(uiLeft, {
                childList: true,
                subtree: true
            });
        }
    });
})();