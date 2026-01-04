// ==UserScript==
// @name         Gats.io - Chat scroller
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  chat scroller for gats.io with continuous scrolling
// @author       nitrogem35
// @match        https://gats.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427578/Gatsio%20-%20Chat%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/427578/Gatsio%20-%20Chat%20scroller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let chatLoop;
    let maxLength;
    let scrollText = '';
    let scrollSpeed = 200;
    let currentIndex = 0;

    function startChatLoop() {
        chatLoop = true;
        loopFunc();
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
            <br>nitrogem35's chat scroller (Improved)</br>
            <br>Text to Scroll: ${scrollText}</br>
            <br>Save text (from chatbox) [\\]</br>
            <br>Start/Stop Scroll: [']</br>
            <br>Scroll Speed (Higher=slower): ${scrollSpeed}ms [.] (+) / [,] (-) </br>
            <br>Hide overlay: [;]</br>
        </div>`;
        div.innerHTML = html;
    }

    createHTML();

    document.addEventListener('keydown', function(key) {
        if (key.keyCode == 222) {
            chatLoop = !chatLoop;
            if (chatLoop) startChatLoop();
        }
        if (key.keyCode == 220) {
            scrollText = document.getElementById("chatbox").value + '   ';
            createHTML();
        }
        if (key.keyCode == 190) {
            scrollSpeed += 5;
            createHTML();
        }
        if (key.keyCode == 188) {
            scrollSpeed = Math.max(0, scrollSpeed - 5);
            createHTML();
        }
        if (key.keyCode == 186) {
            div.innerHTML = div.innerHTML ? '' : createHTML();
        }
    });
})();