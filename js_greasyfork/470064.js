// ==UserScript==
// @name         Zelenka Speedrun Animate to PNG
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Spons Gif to Image
// @author       el9in
// @license      el9in
// @match        https://zelenkaspeedrun.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenkaspeedrun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470064/Zelenka%20Speedrun%20Animate%20to%20PNG.user.js
// @updateURL https://update.greasyfork.org/scripts/470064/Zelenka%20Speedrun%20Animate%20to%20PNG.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const spons = document.querySelector(".main__sponsor");
    const advertisementElement = spons.querySelector('.block__sponsor_advertisement');
    const imageElement = advertisementElement.querySelector('.advertisement__img');
    imageElement.src = 'https://i.imgur.com/d4MlJZH.jpeg';

    const sponsorHeaderAll = document.querySelectorAll('.sponsor__header_img');
    for(let sponsElement of sponsorHeaderAll) {
        const imgElement = sponsElement.querySelector('img[alt="Аватарка"]');
        const newImgElement = document.createElement('img');
        newImgElement.src = 'https://zelenkaspeedrun.com/assets/images/avatar_lolz.png';
        imgElement.parentNode.replaceChild(newImgElement, imgElement);
    }
})();