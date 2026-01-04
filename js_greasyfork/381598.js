// ==UserScript==
// @name         Discord Giphy Destroyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://discordapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381598/Discord%20Giphy%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/381598/Discord%20Giphy%20Destroyer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {

        // Handles giphy's from giphybot
        const gifys = document.querySelectorAll('video');
        gifys.forEach(giphy => {
            const container = giphy.parentElement.parentElement;
            if (!container.classList.contains('dietCoke') && !container.parentElement.classList.contains('scroller-2FKFPG')) {
                const button = createButton();
                button.addEventListener('click', event => {
                    if (event.target.innerText === '+') {
                        setDisplay(container, true);
                        event.target.innerText = '-';
                    } else {
                        setDisplay(container, false);
                        event.target.innerText = '+';
                    }
                });

                container.parentElement.appendChild(button);
                container.style.display = "none";
                container.classList.add('dietCoke');
            }

        });

        // Handles pasted gifs from users and odin bot, exludes other types of images
        const imgs = document.querySelectorAll('.scroller-2FKFPG img');
        imgs.forEach(img => {
            if(!img.classList.contains('dietCoke')){
                if (isImgGif(img)) {
                    const container = img.parentElement.parentElement;

                    const button = createButton();
                    button.addEventListener('click', event => {
                        if (event.target.innerText === '+') {
                            setDisplay(container, true);
                            event.target.innerText = '-';
                        } else {
                            setDisplay(container, false);
                            event.target.innerText = '+';
                        }
                    });

                    container.parentElement.appendChild(button);
                    container.style.display = "none";
                    container.classList.add('dietCoke');
                }
                img.classList.add('dietCoke');
            }
        });

    }, 300);
})();

function setDisplay(element, show) {
    if (show) {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

function createButton(){
    const button = document.createElement('button');
    button.innerText = '+';
    button.style = "background: purple; border: none; color: white; font-weight: bold;";
    return button;
}

function isImgGif(element) {
    const url = element.parentElement.getAttribute("href");
    if (url) {
        return url.split('.').slice(-1)[0] === 'gif';
    }
    return false;
}