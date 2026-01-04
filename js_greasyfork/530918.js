// ==UserScript==
// @name         Evoworld.io Autohit
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Script that automatically uses your skill when near food or a player. Meant for use when reaper. Press h to enable/disable autohit and j to enable/disable slight delay (just in case you are against a flicker)
// @author       You
// @match        *://evoworld.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530918/Evoworldio%20Autohit.user.js
// @updateURL https://update.greasyfork.org/scripts/530918/Evoworldio%20Autohit.meta.js
// ==/UserScript==

let autoHitEnabled = true;
let useDelay = false;

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h') {
        autoHitEnabled = !autoHitEnabled;
        console.log(`[AutoHit] ${autoHitEnabled ? 'ENABLED' : 'DISABLED'}`);
    }

    if (e.key.toLowerCase() === 'j') {
        useDelay = !useDelay;
        console.log(`[AutoHit Delay] ${useDelay ? 'ON' : 'OFF'}`);
    }
});

function triggerHit() {
    const down = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        which: 32,
        bubbles: true
    });

    const up = new KeyboardEvent('keyup', {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        which: 32,
        bubbles: true
    });

    document.dispatchEvent(down);
    document.dispatchEvent(up);
}

function triggerHitWithDelay() {
    setTimeout(triggerHit, 60);
}

function drawPlayerHitboxes() {
    if (!autoHitEnabled) return;

    const ctx = game.dynamicContext;
    const me = game.me;
    if (!ctx || !me) return;

    const shrink = 40;
    let hitTriggered = false;

    const meLeft   = me.position.x;
    const meRight  = me.position.x + me.width;
    const meTop    = me.position.y;
    const meBottom = me.position.y + me.height;

    Object.values(game.gameObjects).forEach(obj => {
        const isPlayerOrFood =
            obj.type === objectType.PLAYER ||
            obj.type === objectType.FOOD;

        if (isPlayerOrFood && game.isVisible(game.camera, obj)) {
            const isSelf = obj === me;

            const objLeft = obj.position.x + shrink / 2;
            const objRight = obj.position.x + obj.width - shrink / 2;
            const objTop = obj.position.y + shrink / 2;
            const objBottom = obj.position.y + obj.height - shrink / 2;

            const touching =
                meRight >= objLeft &&
                meLeft <= objRight &&
                meBottom >= objTop &&
                meTop <= objBottom;

            if (touching && !isSelf && !hitTriggered) {
                if (useDelay) {
                    triggerHitWithDelay();
                } else {
                    triggerHit();
                }
                hitTriggered = true;
            }

            const center = game.getRenderPosition(
                obj.position.x + obj.width / 2,
                obj.position.y + obj.height / 2
            );

            const boxW = obj.width - shrink;
            const boxH = obj.height - shrink;
            const topLeftX = center.x - boxW / 2;
            const topLeftY = center.y - boxH / 2;

            ctx.save();
            ctx.strokeStyle = isSelf
                ? 'aqua'
                : obj.type === objectType.PLAYER
                ? 'lime'
                : 'orange';
            ctx.lineWidth = 2;
            ctx.strokeRect(topLeftX, topLeftY, boxW, boxH);
            ctx.restore();
        }
    });
}

const originalBeforeDraw = game.beforeDrawAllObjects;
game.beforeDrawAllObjects = function () {
    if (typeof originalBeforeDraw === 'function') {
        originalBeforeDraw.apply(this, arguments);
    }
    drawPlayerHitboxes();
};
