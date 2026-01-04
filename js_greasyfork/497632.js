// ==UserScript==
// @name         Surviv.IO Aimbot, ESP & X-Ray
// @namespace    https://greasyfork.org/en/users/662330-zertalious
// @version      0.0.4
// @description  Aimbot and ESP for surviv.io. Locks the aim to the nearest player and shows lines between nearby players. Removes ceilings from buildings and let's you see inside them too.
// @author       Zertalious (Zert)
// @match        *://suroi.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @icon         https://www.google.com/s2/favicons?domain=surviv.io
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/497632/SurvivIO%20Aimbot%2C%20ESP%20%20X-Ray.user.js
// @updateURL https://update.greasyfork.org/scripts/497632/SurvivIO%20Aimbot%2C%20ESP%20%20X-Ray.meta.js
// ==/UserScript==

let espEnabled = true;
let aimbotEnabled = true;
let xrayEnabled = true;

Object.defineProperty(Object.prototype, 'textureCacheIds', {
    set(value) {
        this._textureCacheIds = value;
        if (Array.isArray(value)) {
            const scope = this;
            value.push = new Proxy(value.push, {
                apply(target, thisArgs, args) {
                    if (args[0].indexOf('ceiling') > -1) {
                        Object.defineProperty(scope, 'valid', {
                            set(value) {
                                this._valid = value;
                            },
                            get() {
                                return xrayEnabled ? false : this._valid;
                            }
                        });
                    }
                    return Reflect.apply(...arguments);
                }
            });
        }
    },
    get() {
        return this._textureCacheIds;
    }
});

const params = {
    get() {
        console.log('getting ctx', this);
        return null;
    }
};

Object.defineProperty(window, 'WebGLRenderingContext', params);
Object.defineProperty(window, 'WebGL2RenderingContext', params);

let ctx;

HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
    apply(target, thisArgs, args) {
        const result = Reflect.apply(...arguments);
        if (thisArgs.parentNode) {
            ctx = result;
        }
        return result;
    }
});

const players = [];

let radius;
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', function (event) {
    if (event.dispatchedByMe !== true) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
});

window.addEventListener('keyup', function (event) {
    switch (String.fromCharCode(event.keyCode)) {
        case 'N':
            espEnabled = !espEnabled;
            break;
        case 'B':
            aimbotEnabled = !aimbotEnabled;
            break;
        case 'H':
            xrayEnabled = !xrayEnabled;
            break;
    }
});

const Context2D = CanvasRenderingContext2D.prototype;

Context2D.drawImage = new Proxy(Context2D.drawImage, {
    apply(target, thisArgs, args) {
        if (aimbotEnabled && args[0].src && args[0].src.indexOf('loadout') > -1 && args[8] === 142) {
            const { a, b, e, f } = thisArgs.getTransform();
            radius = Math.hypot(a, b) * args[8] + 10;
            const centerX = thisArgs.canvas.width / 2;
            const centerY = thisArgs.canvas.height / 2;
            if (e !== centerX && f !== centerY) {
                players.push({ x: e, y: f });
            }
        }
        return Reflect.apply(...arguments);
    }
});

window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, thisArgs, args) {
        args[0] = new Proxy(args[0], {
            apply(target, thisArgs, args) {
                players.length = 0;
                Reflect.apply(...arguments);
                ctx.fillStyle = '#fff';
                const array = [
                    ['[B] Aimbot', aimbotEnabled],
                    ['[N] ESP', espEnabled],
                    ['[H] X-Ray', xrayEnabled]
                ];
                const fontSize = 20;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.font = 'bolder ' + fontSize + 'px monospace';
                for (let i = 0; i < array.length; i++) {
                    const [text, status] = array[i];
                    ctx.globalAlpha = status ? 1 : 0.5;
                    ctx.fillText(text + ': ' + (status ? 'ON' : 'OFF'), ctx.canvas.width / 2, 10 + i * fontSize);
                }
                ctx.globalAlpha = 1;
                if (players.length === 0) {
                    return;
                }
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                if (espEnabled) {
                    const centerX = ctx.canvas.width / 2;
                    const centerY = ctx.canvas.height / 2;
                    ctx.beginPath();
                    for (let i = 0; i < players.length; i++) {
                        const player = players[i];
                        ctx.moveTo(centerX, centerY);
                        ctx.lineTo(player.x, player.y);
                    }
                    ctx.stroke();
                }
                if (aimbotEnabled) {
                    let minDistance = Infinity;
                    let targetPlayer;
                    for (let i = 0; i < players.length; i++) {
                        const player = players[i];
                        const distance = Math.hypot(player.x - mouseX, player.y - mouseY);
                        if (distance < minDistance) {
                            minDistance = distance;
                            targetPlayer = player;
                        }
                    }
                    ctx.beginPath();
                    ctx.arc(targetPlayer.x, targetPlayer.y, radius, 0, Math.PI * 2);
                    ctx.stroke();
                    window.dispatchEvent(new MouseEvent('mousemove', {
                        clientX: targetPlayer.x,
                        clientY: targetPlayer.y,
                        dispatchedByMe: true
                    }));
                }
            }
        });
        return Reflect.apply(...arguments);
    }
});
