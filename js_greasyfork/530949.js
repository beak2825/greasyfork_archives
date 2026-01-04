// ==UserScript==
// @name MonkeyType Mobile AutoTyper
// @author ByfronFucker
// @description A Bot that automatically types for you in MonkeyType (Mobile Only)
// @icon https://th.bing.com/th/id/R.c8397fb766c4397fea8a8b499c15a453?rik=aROX42RoH7HhXw&pid=ImgRaw&r=0
// @version 1.1
// @match *://monkeytype.com/*
// @run-at document-idle
// @grant none
// @license MIT
// @namespace https://greasyfork.org/en/users/1380005-real-aquzr
// @downloadURL https://update.greasyfork.org/scripts/530949/MonkeyType%20Mobile%20AutoTyper.user.js
// @updateURL https://update.greasyfork.org/scripts/530949/MonkeyType%20Mobile%20AutoTyper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Better mobile detection
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Exit if not mobile
    if (!isMobile()) return;

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        const log = console.log;
        let isTyping = false;
        let typingInterval;

        function canType() {
            const typingTest = document.getElementById("typingTest");
            return typingTest && !typingTest.classList.contains("hidden");
        }

        function getNextCharacter() {
            const currentWord = document.querySelector(".word.active");
            if (!currentWord) return " ";
            
            for (const letter of currentWord.children) {
                if (!letter.classList.contains("correct") && !letter.classList.contains("incorrect")) {
                    return letter.textContent;
                }
            }
            return " "; // Space between words
        }

        function pressKey(key) {
            const wordsInput = document.getElementById("wordsInput");
            if (!wordsInput) return;

            // Focus the input first (important for mobile)
            wordsInput.focus();
            
            // Create and dispatch events
            const inputEvent = new InputEvent('input', {
                data: key,
                bubbles: true,
                cancelable: true
            });
            
            const keydownEvent = new KeyboardEvent('keydown', {
                key: key,
                bubbles: true,
                cancelable: true
            });
            
            const keyupEvent = new KeyboardEvent('keyup', {
                key: key,
                bubbles: true,
                cancelable: true
            });

            wordsInput.value += key;
            wordsInput.dispatchEvent(inputEvent);
            wordsInput.dispatchEvent(keydownEvent);
            wordsInput.dispatchEvent(keyupEvent);
        }

        function typeCharacter() {
            if (!canType() || !isTyping) {
                clearInterval(typingInterval);
                return;
            }

            const nextChar = getNextCharacter();
            if (nextChar) {
                pressKey(nextChar);
            }
        }

        // Create mobile-friendly UI
        const gui = document.createElement('div');
        gui.style.position = 'fixed';
        gui.style.bottom = '20px';
        gui.style.right = '20px';
        gui.style.zIndex = '9999';
        gui.style.display = 'flex';
        gui.style.flexDirection = 'column';
        gui.style.gap = '10px';
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Typing';
        startButton.style.padding = '10px 15px';
        startButton.style.background = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.fontSize = '16px';

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Typing';
        stopButton.style.padding = '10px 15px';
        stopButton.style.background = '#f44336';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.fontSize = '16px';
        stopButton.style.display = 'none';

        gui.appendChild(startButton);
        gui.appendChild(stopButton);
        document.body.appendChild(gui);

        startButton.addEventListener('click', function() {
            if (canType()) {
                isTyping = true;
                log('STARTED TYPING');
                startButton.style.display = 'none';
                stopButton.style.display = 'block';
                // Use interval instead of timeout recursion for better control
                typingInterval = setInterval(typeCharacter, 50); // 50ms delay between characters
            } else {
                alert('Please start a test first!');
            }
        });

        stopButton.addEventListener('click', function() {
            isTyping = false;
            log('STOPPED TYPING');
            startButton.style.display = 'block';
            stopButton.style.display = 'none';
            clearInterval(typingInterval);
        });

        // Make the UI draggable on mobile
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        gui.onmousedown = dragMouseDown;
        gui.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.type === 'touchmove') {
                pos1 = pos3 - e.touches[0].clientX;
                pos2 = pos4 - e.touches[0].clientY;
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            gui.style.top = (gui.offsetTop - pos2) + "px";
            gui.style.left = (gui.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.ontouchmove = null;
        }
    });
})();