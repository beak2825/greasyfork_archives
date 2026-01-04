// ==UserScript==
// @name         MooMoo.io Script Unpatcher (Any Hack) (All patches, fixes packets)
// @namespace    http://tampermonkey.net/
// @version      99999999
// @description  Rewrites packets to most recent version (e.g. 33 -> f)
// @author       JavedPension
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537126/MooMooio%20Script%20Unpatcher%20%28Any%20Hack%29%20%28All%20patches%2C%20fixes%20packets%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537126/MooMooio%20Script%20Unpatcher%20%28Any%20Hack%29%20%28All%20patches%2C%20fixes%20packets%29.meta.js
// ==/UserScript==

/* How to use

Copy and paste the code below to the end of your hack.
This technically will auto-fix all hacks after the first update in 2021.

If you do not have msgpack locally referencable, include the `// @require` line in your mod metadata as done above.

*/

const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});