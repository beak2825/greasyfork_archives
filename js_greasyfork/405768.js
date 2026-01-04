// ==UserScript==
// @name         One-Tap Script for Diep.io
// @version      1
// @description  One tap script for the game diep.io, shoots from your front barrel
// @author       diep.io#7444 (496382143753093120)
// @match        https://diep.io/
// @grant        none
// @namespace https://greasyfork.org/users/467236
// @downloadURL https://update.greasyfork.org/scripts/405768/One-Tap%20Script%20for%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/405768/One-Tap%20Script%20for%20Diepio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var realSend = window.WebSocket.prototype.send;
    const URLRegex = /^wss?:\/\/[a-z0-9]{4}\.s\.m28n\.net\/$/g; // wss://XXXX.s.m28n.net
    var gameWS;
    var doTap = false; // One-Tap enabled
    const delay = 2; // How many 01 packets to wait before tapping, increase if you have high ping
    var shouldTap = 0; // Keep track of when to click

    window.WebSocket.prototype.send = function(data)
    {
        if (data instanceof Int8Array && this.url.match(URLRegex)) // The other websockets (for checking latency) uses ArrayBuffer, we want only the diep.io game's websocket
        {
            gameWS = this;

            if (data[0] === 1 && doTap === true)
            {
                data[1] &= 0b11111110; // Incase the player is already clicking
                data[1] ^= (shouldTap === delay ? 1 : 0); // Toggle holding or releasing

                shouldTap += 1;
                if (shouldTap > delay) shouldTap = 0;
            }
        }

        return realSend.call(this, data);
    }

    document.addEventListener('keydown', function(event)
    {
        if (!document.getElementById("textInput").disabled) return; // Disable keybinds while we are typing into the textbox where you enter the name to spawn in with
        if (event.repeat) return event.cancelBubble = true; // Holding down the key does not spam the toggle and notification
        var keyCode = event.keyCode || event.which;
        switch (keyCode)
        {
            case 84: // T
            {
                doTap = !doTap;
                if (!doTap) shouldTap = 0;

                var timer = new DataView(new ArrayBuffer(4));
                timer.setFloat32(0, 5000);
                var notification = [3].concat(Array.from((new TextEncoder()).encode("One-Tap: " + (doTap ? "ON" : "OFF")))).concat([0, 255, 0, 0, 0]).concat(Array.from(new Uint8Array(timer.buffer)).reverse()).concat(Array.from((new TextEncoder()).encode("onetap_toggle"))).concat(0);
                gameWS.onmessage.call(gameWS, {data: notification});

                break;
            }
        }
    });
})();