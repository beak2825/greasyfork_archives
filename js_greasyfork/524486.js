// ==UserScript==
// @name         PGO
// @namespace    http://tampermonkey.net/
// @version      1.69
// @description  Autograb PGO on xat.com
// @author       Tiro
// @match        https://xat.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524486/PGO.user.js
// @updateURL https://update.greasyfork.org/scripts/524486/PGO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nativeWebSocket = window.WebSocket;
    const textDecoder = new TextDecoder('utf-8');
    const textEncoder = new TextEncoder('utf-8');
    let currentWebSocket = null;

    window.WebSocket = function(url, protocols) {
        const ws = new nativeWebSocket(url, protocols);
        currentWebSocket = ws;

        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const message = textDecoder.decode(new Uint8Array(event.data));
                parsePGOMessage(message);
            } else if (typeof event.data === 'string') {
                parsePGOMessage(event.data);
            }
        });

        const originalSend = ws.send;
        ws.send = function(data) {
            console.log('Sending:', data);
            originalSend.call(ws, data);
        };

        return ws;
    };

    const languagePatterns = {
        "english": /(?:\[LURE\]\s+)?A wild ([\w\s-]+) has appeared! It will run away in (\d+) seconds\. Use [”"!]+pgo catch[”"!]+ to catch it before it runs! \(Chance to catch: (\d+)%\)/,
        "portuguese": /(?:\[LURE\]\s+)?Um ([\w\s]+) selvagem apareceu! Ele fugirá em (\d+) segundos\. Use ”!pgo catch” para pegá-lo antes que ele corra! \(Chance de pegar: (\d+)%\)/,
        "spanish": /(?:\[LURE\]\s+)?¡Ha aparecido un ([\w-]+) salvaje! Se escapará en (\d+) segundos. ¡Utiliza ”!pgo catch” para atraparlo antes de que corra! \(Posibilidad de atrapar: (\d+)%\)/,
        "romanian": /(?:\[LURE\]\s+)?A apărut un ([\w\s]+) sălbatic! Va fugi în (\d+) secunde. Utilizați „!pgo catch” pentru a-l prinde înainte de a rula! \(Șanse de a prinde: (\d+)%\)/,
        "spanish": /(?:\[LURE\]\s+)?¡Ha aparecido un ([\w-]+) salvaje! Se escapará en (\d+) segundos. ¡Utiliza ”[-!]pgo catch” para atraparlo antes de que corra! \(Posibilidad de atrapar: (\d+)%\)/
    };

    function parsePGOMessage(message) {
        Object.entries(languagePatterns).forEach(([language, pattern]) => {
            const match = message.match(pattern);
            if (match) {
                const lurePrefix = message.includes("[LURE]") ? "[LURE] " : "";
                console.log(`${lurePrefix}Detected a wild ${match[1]}! It will run away in ${match[2]} seconds. Chance to catch: ${match[3]}% in ${language}.`);
                const userMatch = message.match(/u="(\d+)"/);
                if (userMatch) {
                    sendCatchPacket(userMatch[1]);
                }
                return;
            }
        });
    }

    function sendCatchPacket(userId) {
        const catchPacket = `<p u="${userId}" t="!pgo catch" s="2" d="${userId}" />`;
        if (currentWebSocket) {
            const encodedPacket = textEncoder.encode(catchPacket);
            currentWebSocket.send(encodedPacket);
            console.log('Catch packet sent:', catchPacket);
        } else {
            console.log('No WebSocket connection available.');
        }
    }

    // Keep-alive
    function startKeepAlive() {
        setInterval(() => {
            const keepAlivePacket = `<c u="1" t="/KEEPALIVE" />`;
            if (currentWebSocket) {
                const encodedPacket = textEncoder.encode(keepAlivePacket);
                currentWebSocket.send(encodedPacket);
                console.log('Keep-alive packet sent.');
            }
        }, 180000);
    }

    window.addEventListener('load', startKeepAlive);
})();
