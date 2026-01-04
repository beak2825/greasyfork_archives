// ==UserScript==
// @name         Befreunde Zom Popup
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Zeigt ein nerviges Popup an, das den Nutzer auffordert, Zom als Freund hinzuzufügen, oder gratuliert, falls er bereits geaddet ist.
// @author       Asriel
// @license      MIT
// @match        https://anime.academy/chat*
// @match        https://anime.academy/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527097/Befreunde%20Zom%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/527097/Befreunde%20Zom%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Set the target date in YYYY-MM-DD format
    const targetDate = "2025-04-01";
    // Get the current date in the same format
    const currentDate = new Date().toISOString().split('T')[0];

    // If today is not the target date, exit the script
    if (currentDate !== targetDate) {
        return;
    }
    function playOpenSound() {
        const audio = new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3');
        audio.play();
    }

    function playCloseSound() {
        const audio = new Audio('https://www.myinstants.com/media/sounds/metal-pipe.mp3');
        audio.play();
    }

    function playCongratsSound() {
        const audio = new Audio('https://www.myinstants.com/media/sounds/airhorn.mp3');
        audio.play();
    }

    function checkFriendStatus() {
        const chatters = document.querySelectorAll(".chatterlist-row");
        for (let chatter of chatters) {
            let usernameElement = chatter.querySelector(".ng-binding.isFriend");
            if (usernameElement && usernameElement.textContent.trim().toLowerCase() === 'zom') {
                console.log('Zom ist bereits Freund. Zeige Gratulations-Popup.');
                showCongratsPopup();
                return true;
            }
        }
        return false;
    }

    function showPopup() {
        if (checkFriendStatus()) return;

        playOpenSound();

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#1e1e1e';
        popup.style.color = '#f0f0f0';
        popup.style.padding = '20px';
        popup.style.border = '2px solid red';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.textAlign = 'center';
        popup.style.fontSize = '18px';
        popup.style.fontWeight = 'bold';
        popup.style.boxShadow = '0 0 10px red';
        popup.style.animation = 'blink 0.5s infinite alternate';

        const message = document.createElement('p');
        message.innerText = '⚠️ BEFREUNDE SOFORT ZOM! ⚠️\nKlicke auf den Link unten!';
        popup.appendChild(message);

        const link = document.createElement('a');
        link.href = 'https://anime.academy/profile/Tsukune';
        link.innerText = 'Zom als Freund hinzufügen';
        link.target = '_blank';
        link.style.color = '#00ff00';
        link.style.display = 'block';
        link.style.margin = '10px 0';
        link.style.textDecoration = 'none';
        link.style.fontWeight = 'bold';
        link.style.fontSize = '20px';
        popup.appendChild(link);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Nein, aber es wird dich weiter nerven!';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '3px';
        closeButton.style.fontSize = '16px';
        closeButton.addEventListener('click', () => {
            popup.remove();
            playCloseSound();
            setTimeout(showPopup, 5000);
        });
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }

    function showCongratsPopup() {
        playCongratsSound();

        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'purple';
        popup.style.color = 'yellow';
        popup.style.padding = '30px';
        popup.style.border = '5px solid pink';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '10000';
        popup.style.textAlign = 'center';
        popup.style.fontSize = '22px';
        popup.style.fontWeight = 'bold';
        popup.style.boxShadow = '0 0 20px pink';
        popup.style.animation = 'blink 0.3s infinite alternate';

        const message = document.createElement('p');
        message.innerText = '🎉🎊 OMG OMG OMG!!! 🎊🎉\nDu hast ZOM als FREUND!!! 💖🔥💥🎆🎇🥳💯💦😂😂😂';
        popup.appendChild(message);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'OMG YASSSS 🎈🔥';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '15px 30px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = 'pink';
        closeButton.style.color = 'black';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '5px';
        closeButton.style.fontSize = '20px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', () => {
            popup.remove();
        });
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }

    showPopup();
})();
