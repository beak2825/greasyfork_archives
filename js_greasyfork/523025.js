// ==UserScript==
// @name         Amazon Link Bereiniger mit Sound
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Bereinigt Amazon-URLs
// @author       Sky95
// @icon         https://www.amazon.de/favicon.ico
// @match        https://www.amazon.de/*
// @match        https://www.amazon.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/523025/Amazon%20Link%20Bereiniger%20mit%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/523025/Amazon%20Link%20Bereiniger%20mit%20Sound.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function spieleSound() {
        const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_63c49c13c8.mp3?filename=button-pressed-38129.mp3');
        audio.volume = 0.1;
        audio.play();
    }

    function erstelleSchwebendesBild(bereinigterLink) {
        const schwebendesBild = document.createElement('img');
        schwebendesBild.src = 'https://styles.redditmedia.com/t5_mslz2/styles/communityIcon_65b7k17tg4n11.png';
        schwebendesBild.style.position = 'fixed';
        schwebendesBild.style.bottom = '10px';
        schwebendesBild.style.left = '10px';
        schwebendesBild.style.zIndex = '9999';
        schwebendesBild.style.cursor = 'pointer';
        schwebendesBild.style.transition = 'transform 0.1s, filter 0.1s';
        
        schwebendesBild.addEventListener('click', () => {
            GM_setClipboard(bereinigterLink, 'text');
            spieleSound();
            animiereBild(schwebendesBild);
        });
        
        document.body.appendChild(schwebendesBild);
    }

    function animiereBild(bild) {
        bild.style.transform = 'scale(0.7)';
        setTimeout(() => {
            bild.style.transform = 'scale(1)';
            bild.style.filter = 'sepia(100%) hue-rotate(305deg) saturate(7500%) brightness(90%) blur(0.5px)';
        }, 100);
    }

    function hauptProgramm() {
        if (!window.location.href.includes("/dp/") && !window.location.href.includes("/gp/product/")) return;

        const treffer = window.location.href.match(/\/(dp|gp\/product)\/([A-Za-z0-9]{10})/);
        if (!treffer || treffer.length < 3) return;

        const asin = treffer[2];
        const domain = window.location.href.includes("amazon.de") ? "de" : "com";
        const bereinigterLink = `https://www.amazon.${domain}/dp/${asin}/ref=1?psc=1`;

        history.replaceState({}, document.title, bereinigterLink);
        erstelleSchwebendesBild(bereinigterLink);
    }

    hauptProgramm();
})();