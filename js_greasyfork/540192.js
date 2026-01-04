// ==UserScript==
// @name         Speak Selected Text (Alt+R)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Speaks selected text when Alt+R is pressed
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540192/Speak%20Selected%20Text%20%28Alt%2BR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540192/Speak%20Selected%20Text%20%28Alt%2BR%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function beep() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    function speak(text) {
        if (!('speechSynthesis' in window)) {
            alert("Your browser doesn't support speech synthesis.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
    }

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key.toLowerCase() === 'r') {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                console.log("Speaking text:", selectedText);
                beep();
                speak(selectedText);
            } else {
                alert("Please select some text first.");
            }
        }
    });

    console.log("✅ Speak Selected Text userscript is running (press Alt+R).");
})();
