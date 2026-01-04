// ==UserScript==
// @name        AutoHeal(CAVEGAME.IO)
// @namespace   Violentmonkey Scripts
// @match       https://cavegame.io/*
// @grant       none
// @version     1.0
// @author      Drik
// @description If this causes lag or your PvP isn't great because of it — learn to play on your own
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533742/AutoHeal%28CAVEGAMEIO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533742/AutoHeal%28CAVEGAMEIO%29.meta.js
// ==/UserScript==


(function () {
    let autoHeal = false;
    let isHealing = false;
    let wsList = [];

    const _send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        if (!wsList.includes(this)) wsList.push(this);
        _send.call(this, data);
    };

    const getRealHP = () => {
        const objs = window.Phaser?.Display?.Canvas?.CanvasPool?.pool?.[1]
            ?.parent?.game?.events?._events?.destroy?.[5]
            ?.context?.events?._events?.gameout?.[0]
            ?.context?._events?.pointerdown?.context
            ?.sys?.scale?._events?.resize?.[1]
            ?.context?.scene?.sys?.events?._events?.start?.[3]
            ?.context?.manager?.keys?.MiniMap
            ?.sys?.settings?.data?.objs || {};
        for (let key in objs) {
            const obj = objs[key];
            if (obj && typeof obj.health === 'number') return obj.health;
        }
        return 100;
    };

    const ui = document.createElement('div');
    ui.textContent = 'AutoHeal: OFF';
    ui.style.position = 'fixed';
    ui.style.top = '10px';
    ui.style.left = '10px';
    ui.style.padding = '6px 12px';
    ui.style.background = 'rgba(0,0,0,0.7)';
    ui.style.color = '#f00';
    ui.style.fontFamily = 'monospace';
    ui.style.fontSize = '14px';
    ui.style.borderRadius = '6px';
    ui.style.zIndex = '9999';
    document.body.appendChild(ui);

    function updateUI() {
        ui.textContent = 'AutoHeal: ' + (autoHeal ? 'ON' : 'OFF');
        ui.style.color = autoHeal ? '#0f0' : '#f00';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F4') {
            autoHeal = !autoHeal;
            updateUI();
        }
    });

    setInterval(() => {
        if (!autoHeal || isHealing) return;

        const hp = getRealHP();
        if (hp >= 73) return;

        const soup = document.querySelector('.inv-drag img[src="/asset/scaled/stew.png"]');
        if (!soup) return;

        isHealing = true;
        soup.click();

        const press = new Uint8Array([14, 1]);
        const release = new Uint8Array([14, 0]);

        wsList.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) ws.send(press);
        });

        setTimeout(() => {
            wsList.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) ws.send(release);
            });
            isHealing = false;
        }, 550);
    }, 20);
})();
