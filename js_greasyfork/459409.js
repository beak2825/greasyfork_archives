// ==UserScript==
// @name         MooMoo.io Freecam
// @version      1.0.2
// @description  lets you move around freely
// @author       Nuro
// @grant        none
// @match        *://*.moomoo.io/*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js
// @namespace    https://greasyfork.org/users/761829
// @supportURL   https://discord.gg/NMS3YR9Q5R
// @homepage     https://github.com/MooMooForge
// @downloadURL https://update.greasyfork.org/scripts/459409/MooMooio%20Freecam.user.js
// @updateURL https://update.greasyfork.org/scripts/459409/MooMooio%20Freecam.meta.js
// ==/UserScript==
/*

Usage:

Command: type "/toggleFreecam" into chat and the freecam should be toggled. You can then move around freely and fast.

Support us on social media (follow and leave a star)

GitHub: https://moomooforge.github.io/MooMoo.js/
Author: https://github.com/NuroC
YouTube: https://www.youtube.com/@nuro9607
Discord: https://discord.gg/NMS3YR9Q5R

*/

Array.prototype.chunk = function(size) {
    const chunks = [];
    for (let i = 0; i < this.length; i += size) {
        chunks.push(this.slice(i, i + size));
    }
    return chunks;
};

Array.prototype.unchunk = function() {
    return [].concat(...this);
};

const MooMoo = (function MooMooJS() {})[69]

const { msgpack, PacketInterceptor, CommandManager } = MooMoo;

let FREECAM_TOGGLE = false;
let FAKE_X = 0;
let FAKE_Y = 0;

const keyMap = { w: 0, s: 1, a: 2, d: 3 };
const WALKING = [0, 0, 0, 0];

const updateWalking = (value) => (key) => {
    if (keyMap[key] !== undefined && document.activeElement == document.body) {
        WALKING[keyMap[key]] = value;
    }
};

const updateFakePosition = ({ angle, speed }) => {
    FAKE_X += Math.cos(angle) * speed;
    FAKE_Y += Math.sin(angle) * speed;
};

document.addEventListener("keydown", (event) => updateWalking(1)(event.key));
document.addEventListener("keyup", (event) => updateWalking(0)(event.key));

MooMoo.addEventListener("renderTick", function() {
    const [a, b, c, d] = WALKING;
    const x = d - c;
    const y = b - a;

    const { myPlayer } = MooMoo;

    if (FREECAM_TOGGLE) {
        if (!x && !y) return;

        let angle = Math.atan2(y, x);
        updateFakePosition({ angle, speed: 15});
    } else {
        FAKE_X = myPlayer.x
        FAKE_Y = myPlayer.y
    }
});


CommandManager.registerCommand("toggleFreecam", (Command, args) => {
    FREECAM_TOGGLE = !FREECAM_TOGGLE;
    Command.reply("Freecam Active: " + FREECAM_TOGGLE);
})

document.addEventListener("keydown", event => {
    if (event.key == "j") {
        FREECAM_TOGGLE = !FREECAM_TOGGLE;
    }
})

PacketInterceptor.addCallback("server", packet => {
    let decoded = msgpack.decode(new Uint8Array(packet));
    let [packetid, [...data]] = decoded;
    if (FREECAM_TOGGLE) {
        switch(packetid) {
            case "33": {
                let playerData = data[0].chunk(13)
                let index = 0;
                playerData.forEach(player => {
                    let sid = player[index++];
                    if(sid == MooMoo.myPlayer.sid) {
                        player[index++] = FAKE_X;
                        player[index++] = FAKE_Y;
                    }
                })
                data = [playerData.unchunk()]
                packet = msgpack.encode([packetid, data])
                break;
            }
        }
    }
    return packet;
})

PacketInterceptor.addCallback("client", packet => {
    let decoded = msgpack.decode(new Uint8Array(packet));
    let [packetid, [...data]] = decoded;
    if(packetid == "33" && FREECAM_TOGGLE) {
        throw "";
    }
    return packet;
})
