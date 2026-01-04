// ==UserScript==
// @name         DigDig.IO DefaultDIOH
// @namespace    https://tampermonkey.net/
// @version      0.0.9
// @description  A simple bot that farms in digdig.io
// @author       DefaultPi
// @match        *://digdig.io/*
// @icon         https://www.google.com/s2/favicons?domain=digdig.io
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533864/DigDigIO%20DefaultDIOH.user.js
// @updateURL https://update.greasyfork.org/scripts/533864/DigDigIO%20DefaultDIOH.meta.js
// ==/UserScript==

let goldCount = 0;
let timeRan = 0;
let lastTime = 0;

const chunkSize = 64;
const goldPositions = [];

let isDead = false;
let isRunning = false;
let scriptActive = true;  // Initial state of the script

let health = 0;
let border = null;
const chunks = [];
let serverIndex = 0;
const servers = [];
const modes = ['ffa', 'teams', 'maze'];
let angle = Math.random() * Math.PI * 2;

init();

async function init() {
    // Fetch available servers for each mode
    for (let i = 0; i < modes.length; i++) {
        const response = await fetch('https://api.n.m28.io/endpoint/digdig-' + modes[i] + '/findEach');
        const json = await response.json();
        for (let key in json.servers) {
            servers.push(json.servers[key].id);
        }
    }

    // Add event listener to toggle script on/off with the 'Y' key
    window.addEventListener('keydown', function (event) {
        if (event.key === 'y' || event.key === 'Y') {
            toggleScript();
        }
    });

    isRunning = true;
}

// Modify the requestAnimationFrame behavior based on script state
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, thisArgs, args) {
        if (scriptActive && isRunning === true) {
            args[0] = new Proxy(args[0], {
                apply(target, thisArgs, args) {
                    isDead = false;
                    healthX.length = 0;
                    health = 0;
                    border = null;
                    goldPositions.length = 0;

                    Reflect.apply(...arguments);

                    const now = Date.now();
                    if (isRunning && lastTime > 0) {
                        timeRan += now - lastTime;
                    }
                    lastTime = now;

                    if (isDead === true || health <= 0) {
                        pressEnter();
                        return;
                    }

                    setAttack(true);

                    if (goldPositions.length > 0) {
                        let target;
                        if (border !== null) {
                            const [bx, by, br] = border;
                            for (let i = 0; i < goldPositions.length; i++) {
                                const [x, y] = goldPositions[i];
                                if (Math.hypot(x - bx, y - by) < br) {
                                    mouseMove(x, y);
                                    return;
                                }
                            }
                        } else {
                            mouseMove(goldPositions[0][0], goldPositions[0][1]);
                            return;
                        }
                    }

                    mouseMove(
                        (Math.cos(angle) * 0.5 + 0.5) * window.innerWidth,
                        (Math.sin(angle) * 0.5 + 0.5) * window.innerHeight
                    );

                    if (health <= 0.05) {
                        angle = Math.random() * Math.PI * 2;
                        serverIndex = (serverIndex + 1) % servers.length;
                        cp6.forceServerID(servers[serverIndex]);

                        while (chunks.length > 0) {
                            chunks.shift().golds.length = 0;
                        }
                    }
                }
            });
        }

        return Reflect.apply(...arguments);
    }
});

// Overriding other parts to integrate with the script state toggle
const Context = CanvasRenderingContext2D.prototype;

Context.arc = new Proxy(Context.arc, {
    apply(target, ctx, [x, y, r]) {
        Reflect.apply(...arguments);

        if (scriptActive && ctx.fillStyle === '#222222' && x !== 0 && y !== 0) {
            border = [x, y, r];
            ctx.save();
            ctx.translate(window.innerWidth / 2, 10);
            ctx.font = 'bolder 30px Ubuntu';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const a = goldCount + ' gold found';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000';
            ctx.strokeText(a, 0, 0);
            ctx.fillStyle = '#fff';
            ctx.fillText(a, 0, 0);

            const seconds = timeRan / 1000;
            const mins = Math.floor(seconds / 60);
            const b = 'in ' + (mins > 0 ? mins + 'm ' : '') + (seconds % 60).toFixed(1) + 's';

            ctx.font = 'bolder 18px Ubuntu';
            ctx.strokeText(b, 0, 32);
            ctx.fillText(b, 0, 32);
            ctx.restore();
        }
    }
});

// Continue with the rest of the code for other functions as you had before...

// Function to send a key event (simulate pressing keys)
function keyEvent(type, keyCode) {
    window.dispatchEvent(new KeyboardEvent(type, { keyCode }));
}

// Function to simulate mouse movement
function mouseMove(clientX, clientY) {
    window.Module.canvas.dispatchEvent(
        new MouseEvent('mousemove', {
            clientX,
            clientY
        })
    );
}

// Function to simulate pressing Enter (to respawn when dead)
function pressEnter() {
    keyEvent('keydown', 13);
    keyEvent('keyup', 13);
}

// Function to simulate attacking (space bar)
function setAttack(bool) {
    keyEvent(bool !== false ? 'keydown' : 'keyup', 32);
}