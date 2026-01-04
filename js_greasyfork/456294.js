// ==UserScript==
// @name         LeBonCode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Améliore l'UX sur LebonCoin (affiche les téls, masque les annonces vendus et en cours d'achat)
// @author       Yohann Nizon
// @match        https://www.leboncoin.fr/*
// @icon         https://www.leboncoin.fr/_next/static/media/favicon-16.fe104e12.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456294/LeBonCode.user.js
// @updateURL https://update.greasyfork.org/scripts/456294/LeBonCode.meta.js
// ==/UserScript==

let showPhone = true;
let showVendu = true;
let showAchat = true;

window.setInterval(function() {
    const phoneButtons = document.querySelectorAll('button[title="voir le numéro"]');

    if (phoneButtons && showPhone) {
        const delay = Math.floor(2000 + Math.random() * 1000); // Random delay between 2 et 3 seconds
        setTimeout(() => phoneButtons.forEach(button => button.click()), delay);
    }

    let nbRemove = 0;
    let mosaic = document.querySelectorAll('div[data-test-id=listing-mosaic]');
    if (mosaic.length == 1){
        for (const div of mosaic[0].childNodes) {
            if (div.innerText.indexOf('Vendu') > -1 && showVendu) {
                nbRemove++;
                div.style.display = 'none';
            }
            if (div.innerText.indexOf('Achat en cours') > -1 && showAchat) {
                nbRemove++;
                div.style.display = 'none';
            }
        }
    } else {
        let divs = document.getElementsByTagName('div');
        for (let div of divs) {
            if (div.className.indexOf('styles_adCard') > -1){
                if (div.innerText.indexOf('Vendu') > -1 && showVendu) {
                    nbRemove++;
                    div.style.display = 'none';
                }
                if (div.innerText.indexOf('Achat en cours') > -1 && showAchat) {
                    nbRemove++;
                    div.style.display = 'none';
                }
            }
        }
    }
    console.log(nbRemove + " annonce(s) supprimée(s)");
}, 1000);