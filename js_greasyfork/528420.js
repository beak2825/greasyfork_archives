// ==UserScript==
// @name         MCIO Custom Packets & Console
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a draggable window to send custom packets with notification balloons.
// @author       Earth1283
// @match        *://mine-craft.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528420/MCIO%20Custom%20Packets%20%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/528420/MCIO%20Custom%20Packets%20%20Console.meta.js
// ==/UserScript==

// For the "CONSOLE" option
// You can run `GAME.events.emit('gamePlay')` to join a game.

(function() {
    'use strict';

    // --- Styling ---
    GM_addStyle(`
        #packetSenderWindow {
            position: fixed;
            top: 50px;
            left: 50px;
            background-color: #282c34;
            border: 1px solid #61dafb;
            padding: 15px;
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 350px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            color: #fff;
        }

        #packetSenderWindow .header {
            background-color: #3d4351;
            padding: 10px;
            margin-bottom: 10px;
            cursor: move;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }

        #packetSenderWindow textarea,
        #packetSenderWindow select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid #666;
            background-color: #333;
            color: #eee;
            border-radius: 4px;
        }

        #packetSenderWindow button {
            padding: 10px 15px;
            background-color: #61dafb;
            color: #282c34;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        #packetSenderWindow button:hover {
            background-color: #4fa3d1;
        }

        #packetSenderWindow select {
            appearance: none;
            background-image: linear-gradient(45deg, transparent 50%, #eee 50%),
                              linear-gradient(135deg, #eee 50%, transparent 50%);
            background-position: calc(100% - 15px) calc(1em + 2px),
                                 calc(100% - 10px) calc(1em + 2px);
            background-size: 5px 5px, 5px 5px;
            background-repeat: no-repeat;
            padding-right: 30px;
        }

        .packet-balloon {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #333;
            color: #eee;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            z-index: 1001;
            transition: opacity 0.3s ease;
            cursor: pointer;
        }

        .packet-balloon.success {
            background-color: #4CAF50;
            color: white;
        }

        .packet-balloon.error {
            background-color: #f44336;
            color: white;
        }
    `);

    // --- Create Window ---
    const windowDiv = document.createElement('div');
    windowDiv.id = 'packetSenderWindow';
    windowDiv.innerHTML = `
        <div class="header">Packet Sender</div>
        <select id="packetMethod">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="CONSOLE">CONSOLE</option>
        </select>
        <textarea id="packetData" placeholder="Packet Data (JSON, etc.) or Console Command"></textarea>
        <button id="sendPacketButton">Send Packet/Command</button>
    `;
    document.body.appendChild(windowDiv);

    // --- Drag Functionality ---
    let isDragging = false;
    let offsetX, offsetY;

    const header = windowDiv.querySelector('.header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowDiv.offsetLeft;
        offsetY = e.clientY - windowDiv.offsetTop;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
        });
    });

    function drag(e) {
        if (!isDragging) return;
        windowDiv.style.left = (e.clientX - offsetX) + 'px';
        windowDiv.style.top = (e.clientY - offsetY) + 'px';
    }

    // --- Send Packet/Command Functionality ---
    const sendButton = document.getElementById('sendPacketButton');
    sendButton.addEventListener('click', () => {
        const method = document.getElementById('packetMethod').value;
        const data = document.getElementById('packetData').value;
        const url = window.location.href; // Use current page URL

        if (method === 'CONSOLE') {
            try {
                const script = document.createElement('script');
                script.textContent = data;
                document.head.appendChild(script);
                script.remove(); // Clean up the injected script
                createBalloon('✅ Console command executed!', 'success');
            } catch (error) {
                console.error('Console command error:', error);
                createBalloon('❌ Console command failed.', 'error');
            }
        } else {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                onload: (response) => {
                    console.log('Packet Response:', response);
                    createBalloon('🚀 Packet sent!', 'success');
                },
                onerror: (error) => {
                    console.error('Packet Error:', error);
                    createBalloon('🚨 Packet send failed.', 'error');
                }
            });
        }
    });

    // --- Balloon Functionality ---
    function createBalloon(message, type) {
        const balloon = document.createElement('div');
        balloon.classList.add('packet-balloon', type);
        balloon.textContent = message;
        document.body.appendChild(balloon);

        let timeoutId = setTimeout(() => {
            balloon.style.opacity = '0';
            setTimeout(() => balloon.remove(), 300);
        }, 5000);

        balloon.addEventListener('mouseover', () => clearTimeout(timeoutId));
        balloon.addEventListener('mouseout', () => {
            timeoutId = setTimeout(() => {
                balloon.style.opacity = '0';
                setTimeout(() => balloon.remove(), 300);
            }, 5000);
        });

        balloon.addEventListener('click', () => {
            clearTimeout(timeoutId);
            balloon.style.opacity = '0';
            setTimeout(() => balloon.remove(), 300);
        });
    }
})();