// ==UserScript==
// @name         Random Video For Youtube
// @name:fr      Video Aléatoire Pour Youtube
// @name:en      Random Video For Youtube Video
// @namespace    http://tampermonkey.net/
// @author        TrouveMe
// @version      0.3.1
// @contributionURL https://www.paypal.com/donate/?cmd=_donations&business=boiskarine59960@gmail.com&item_name=Greasy+Fork+donation
// @description     Play Random Video in Youtube
// @description:fr  Lance Video Aléatoire sur Youtube
// @description:en  Play Random Video in Youtube Video
// @match        https://www.youtube.com/*
// @match        https://www.youtu.be/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499306/Video%20Al%C3%A9atoire%20Pour%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/499306/Video%20Al%C3%A9atoire%20Pour%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clickRandomNthItem(selector) {
        let items = document.querySelectorAll(selector);
        let randomIndex = getRandomInt(0, items.length - 1);
        if (items[randomIndex]) {
            items[randomIndex].click();
        }
    }

    function createButton() {
        const button = document.createElement('button');
        //button.innerText = "Lancer musique aléatoire";
        const imgbtn = new Image(32, 32)
        imgbtn.src = "https://www.svgrepo.com/show/458362/sort-random.svg"
        imgbtn.alt = "Picture For Random Button / Image Pour le Bouton Aléatoire"
        button.appendChild(imgbtn)
        button.style.position = 'fixed';
        button.style.top = '90%';
        button.style.right = '1.5%';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#1DB954';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('mouseover', () => { button.style.backgroundColor = '#1a8a41'})
        button.addEventListener('mouseout', () => { button.style.backgroundColor = '#1DB954'})
        button.addEventListener('mousedown', () => { button.style.backgroundColor = '#166e35'})
        button.addEventListener('mouseup', () => { button.style.backgroundColor = '#1DB954'})



        button.addEventListener('click', function() {
            clickRandomNthItem('a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');
            button.style.top = '85%';

        });
        document.body.appendChild(button);
    }

    // Attendre que la page soit entièrement chargée avant de créer le bouton
    window.addEventListener('load', createButton);

})();