// ==UserScript==
// @name         HEG Kwack Button
// @version      2024-11-09
// @description  A button to heg kwack
// @license      MIT
// @author       Clyoth [3477744]
// @match        https://www.torn.com/*
// @icon         https://play-lh.googleusercontent.com/BkaIDbibtUpGcziVQsgCya-eC7oxTUHL5G8m8v3XW3S11_-GZEItaxzeXxhKmoAiX8x6
// @grant        none
// @namespace Clyoth
// @downloadURL https://update.greasyfork.org/scripts/516113/HEG%20Kwack%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/516113/HEG%20Kwack%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // To make sure that all divs are loaded and no error occurs
    window.addEventListener('load', () => {
        const targetDiv = document.querySelector('.areas___ElnyB .toggle-block___oKpdF .toggle-content___BJ9Q9');
        //Equip HEG button
        const eqHegImage = document.createElement('img');
        const eqHegDiv = document.createElement('div');
        eqHegImage.src = "https://i.imgur.com/evUXBUT.png";
        eqHegImage.width = 15
        const eqHEG = document.createElement('button');
        eqHEG.innerText = 'Equip HEG';
        eqHegDiv.onclick = () => window.location.replace("https://www.torn.com/item.php")
        eqHegDiv.classList.add("pill");
        eqHegDiv.style.paddingTop = '0';
        eqHegDiv.style.paddingBottom = '0';
        eqHEG.style.color = "#dddddd";
        eqHEG.style.fontSize = "12px";
        eqHEG.style.paddingLeft = "10px";
        eqHEG.classList.add("linkName___FoKha");
        eqHegDiv.appendChild(eqHegImage);
        eqHegDiv.appendChild(eqHEG);
        targetDiv.appendChild(eqHegDiv);
        //HEG KWACK button

        const hegKwackImage = document.createElement('img');
        const hegKwackDiv = document.createElement('div');
        hegKwackImage.src = "https://i.imgur.com/LxEYf5t.png";
        hegKwackImage.width = 15
        const hegKwack = document.createElement('button');
        hegKwack.innerText = 'HEG Kwack';
        hegKwackDiv.onclick = () => window.location.replace("https://www.torn.com/loader.php?sid=attack&user2ID=2190604")
        hegKwackDiv.classList.add("pill");
        hegKwackDiv.style.paddingTop = '0';
        hegKwackDiv.style.paddingBottom = '0';
        hegKwack.style.color = "#dddddd";
        hegKwack.style.fontSize = "12px";
        hegKwack.style.paddingLeft = "10px";
        hegKwack.classList.add("linkName___FoKha");
        hegKwackDiv.appendChild(hegKwackImage);
        hegKwackDiv.appendChild(hegKwack);
        targetDiv.appendChild(hegKwackDiv);
    });
})();