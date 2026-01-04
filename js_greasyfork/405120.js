// ==UserScript==
// @name         Domino Tracker Notification
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Get notified when the pizza tracker updates!
// @author       Therrom
// @include      /https://.*\.dominos\.[\w]+/.*/
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/405120/Domino%20Tracker%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/405120/Domino%20Tracker%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {checkTracker();}, 1000);
})();

let currentText = undefined;
let utter = undefined;

function checkTracker() {
    const tempText = document.querySelector("div p[role=status]")?.innerHTML
    if (tempText) {
        if (tempText != currentText) {
            currentText = tempText;
            GM_notification({title: 'Tracker Update', text: currentText, timeout: 1000});
            speak(currentText);
        }
    }
}

function speak(text) {
    if(window.speechSynthesis.getVoices().length == 0) {
        window.speechSynthesis.addEventListener('voiceschanged', function() {
            speak(text);
        });
    } else {
        if (utter === undefined) {
            detectVoice();
        }
        utter.text = text;
        window.speechSynthesis.speak(utter);
    }
}

function detectVoice() {
    let available_voices = window.speechSynthesis.getVoices();

    let voice = undefined;
    let defaultVoice = undefined;
    let language = window.navigator.userLanguage || window.navigator.language;

    for (let i=0; i<available_voices.length; i++) {
        if(available_voices[i].default) {
            defaultVoice = available_voices[i];
        }
        if (available_voices[i].lang == language) {
            voice = available_voices[i];
            break;
        }
    }

    if (voice === undefined) {
        voice = defaultVoice;
    }
    if (voice === undefined) {
        voice = available_voices[0]
    }

    utter = new SpeechSynthesisUtterance();
    utter.rate = 1;
    utter.pitch = 0.5;
    utter.voice = voice;
}