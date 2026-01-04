// ==UserScript==
// @name         Gats.io - Chat scroller - PsychoNurse
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Chat scroller with preset text options (1-9 keys) and start/stop functionality (Enter key to stop, 1-9 to start) for gats.io, with right-click to toggle scroll
// @author       nitrogem35, Modified by Psychonurse
// @match        https://gats.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519641/Gatsio%20-%20Chat%20scroller%20-%20PsychoNurse.user.js
// @updateURL https://update.greasyfork.org/scripts/519641/Gatsio%20-%20Chat%20scroller%20-%20PsychoNurse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let chatLoop;
    let maxLength;
    let scrollText = '';
    let scrollSpeed = 200;  // Initial scroll speed (in ms)
    let currentIndex = 0;

    // Preset messages corresponding to keys 1-9
    const presetMessages = [
        "PsychoNurse  ",       // 1
        "@Eldiablahermosa on Discord! &lt;3  ", // 2
        "&lt;3  ",           // 3
        ". . . ",         // 4
        "Find this script on Greasyfork! (Chat scroller - PsychoNurse)   ",              // 5
        "Im solo    ",    // 6
        "1v1   ",             // 7
        "GG  ",             // 8
        "Afk   "               // 9
    ];

    function startChatLoop() {
        chatLoop = true;
        loopFunc();
    }

    function stopChatLoop() {
        chatLoop = false;
    }

    function loopFunc() {
        if (!chatLoop) return;

        let s = scrollText;
        let e = currentIndex % 12 === 0 ? 1 : 0;

        if (s.length < 28) {
            maxLength = s.length;
        } else {
            maxLength = 28;
        }

        let displayText = s.substring(currentIndex, currentIndex + maxLength);
        if (displayText.length < maxLength) {
            displayText += s.substring(0, maxLength - displayText.length);
        }

        let z = displayText.split('');
        let numRandom = Math.round(Math.random() * 2);

        for (let j = 0; j < numRandom; j++) {
            z.push(" ");
        }

        z = z.join("");
        //encode commas (,) as tilde (~) because gats client does that
        z = z.replaceAll(",", "~");
        Connection.list[0].socket.send(`c,${z}`);

        currentIndex = (currentIndex + 1) % s.length;

        setTimeout(loopFunc, scrollSpeed);
    }

    document.getElementById("chatbox").setAttribute("maxlength", 1000);
    var div = document.createElement("div");
    document.body.appendChild(div);

    function createHTML() {
        let html = `
        <style>
            .main {
                pointer-events: none; position: fixed; z-index:999; top: 150px; left: 10px;
                font-family: 'arial';
                color: black;
                font-size: 20px;
            }
        </style>
        <div class="main" id="scrollerGUI">
            <br>nitrogem35's chat scroller (Psycho Version)</br>
            <br>Text to Scroll: ${scrollText}</br>
            <br>Save text (from chatbox) [\]</br>
            <br>Start/Stop Scroll: [']</br>
            <br>Scroll Speed (Higher=slower): ${scrollSpeed}ms [.] (+) / [,] (-)</br>
            <br>Hide overlay: [;]</br>
        </div>`;
        div.innerHTML = html;
    }

    createHTML();

    // Handle keydown events
    document.addEventListener('keydown', function(key) {
        if (key.keyCode == 222) { // [']
            chatLoop = !chatLoop;
            if (chatLoop) startChatLoop();
            else stopChatLoop();
        }
        if (key.keyCode == 220) { // [\]
            scrollText = document.getElementById("chatbox").value + '   ';
            createHTML();
        }
        if (key.keyCode == 190) { // [.]
            scrollSpeed += 5; // Increase speed (slower)
            createHTML();
        }
        if (key.keyCode == 188) { // [,]
            scrollSpeed = Math.max(0, scrollSpeed - 5); // Decrease speed (faster)
            createHTML();
        }
        if (key.keyCode == 186) { // [;]
            div.innerHTML = div.innerHTML ? '' : createHTML();
        }

        // Handle number keys for preset messages (1-9)
        if (key.keyCode >= 49 && key.keyCode <= 57) { // 1-9
            const index = key.keyCode - 49; // 1 => 0, 2 => 1, etc.
            scrollText = presetMessages[index];  // Update the scrollText to the selected preset
            startChatLoop();  // Start the scroll when a number key is pressed
            createHTML();  // Update the overlay with new text to scroll
        }

        // Stop the scroll when Enter key is pressed
        if (key.keyCode == 13) { // [Enter]
            stopChatLoop();
        }
    });

    // Right-click event to toggle start/stop of scroll
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();  // Prevent the default right-click menu
        chatLoop = !chatLoop;  // Toggle the chat loop state
        if (chatLoop) {
            startChatLoop();
        } else {
            stopChatLoop();
        }
    });

    // WebSocket communication (Assuming WebSocket is connected to Chrome)
    const ws = new WebSocket('wss://echo.websocket.events'); // Replace with your WebSocket URL

    ws.onopen = () => console.log('WebSocket connected');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    // Receive speech text from WebSocket
    ws.onmessage = function(event) {
        console.log('Received from WebSocket:', event.data);  // Log the received message
        scrollText = event.data;  // Update scrollText with speech data
        if (!chatLoop) {
            startChatLoop();  // Start scrolling
        }
    };
})();