// ==UserScript==
// @name         ChatGPT avatar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Updates the ChatGPT avatar to one of your likening.
// @author       u/Douglas12dsd
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461555/ChatGPT%20avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/461555/ChatGPT%20avatar.meta.js
// ==/UserScript==
 
// Paste the image url here, between apostrophes:
const avatarURL = 'https://cdn.myanimelist.net/images/characters/5/486674.jpg';
 
// If you don't know what you are doing, don't change anything below here.
const selector = "div[style='background-color:#10A37F']";
const selectorAfterNewMessage = "div[style='background-color: rgb(16, 163, 127);']";
const INTERVAL_DELAY = 500;
 
(function() {
    'use strict';
 
    updateAvatar(selector, avatarURL);
 
    setInterval(() => {
        updateAvatar(selectorAfterNewMessage, avatarURL);
    }, INTERVAL_DELAY);
})();
 
function updateAvatar(currentSelector, url){
    const elements = document.querySelectorAll(currentSelector);
    for (let i = 0; i < elements.length; i++) {
        const divElement = elements[i];
        // Remove the SVG element from the div
        divElement.removeChild(divElement.firstChild);
 
        divElement.style.backgroundImage = `url('${url}')`;
        divElement.style.backgroundSize = 'cover';
        divElement.style.height = '4rem';
        divElement.style.width = '4rem';
    }
}