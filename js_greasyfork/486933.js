// ==UserScript==
// @name         Character Voice
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try to take over the world with Character.AI by adding voice functionality!
// @author       You
// @match        https://beta.character.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486933/Character%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/486933/Character%20Voice.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let lastText = "";
    let generatingContent = false;
    let audioObj = new Audio();

    let generatePlayButton = (dom, text) => {
        console.log(dom.getElementsByClassName('ai-voice-playback'));

        if (dom.getElementsByClassName('ai-voice-playback').length === 0) {
            let btn = document.createElement('button');
            btn.innerHTML = 'Play';
            btn.classList.add('ai-voice-playback');
            dom.appendChild(btn);
            
            btn.onclick = () => {
                document.getElementById("user-input").placeholder = "Waiting for generating voice...";
                document.getElementById("user-input").disabled = true;
                audioObj = new Audio(`http://192.168.1.12:9880/?text=${encodeURIComponent(text)}&text_language=en`);
                audioObj.addEventListener("canplaythrough", (event) => {
                    document.getElementById("user-input").placeholder = "Playing...";
                    audioObj.play();
                });
                audioObj.addEventListener("ended", (event) => {
                    document.getElementById("user-input").placeholder = "Type a message";
                    document.getElementById("user-input").disabled = false;
                });
            };
        }
    };

    audioObj.addEventListener("ended", (event) => {
        document.getElementById("user-input").placeholder = "Type a message";
        document.getElementById("user-input").disabled = false;
    });

    setInterval(() => {
        let a = document.getElementsByClassName("swiper swiper-initialized swiper-horizontal swiper-pointer-events message-slider swiper-backface-hidden");
        for (let i = 0; i < a.length; i++) {
            generatePlayButton(a[i].getElementsByTagName('p')[0].parentNode, a[i].getElementsByTagName('p')[0].innerText);
        }
    }, 100); // Interval set to 100 milliseconds
})();
