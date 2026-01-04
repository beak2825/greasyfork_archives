// ==UserScript==
// @name         répare les gif  de jeuxvideo.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remplace les emojis GIFs (1 à 200) sur jeuxvideo.com par ceux hébergés sur onche.org
// @author       issoudu55
// @match        *://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509080/r%C3%A9pare%20les%20gif%20%20de%20jeuxvideocom.user.js
// @updateURL https://update.greasyfork.org/scripts/509080/r%C3%A9pare%20les%20gif%20%20de%20jeuxvideocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour remplacer les GIFs
    function replaceGifs() {
        // Sélectionne toutes les images sur la page
        const gifs = document.querySelectorAll('img');

        gifs.forEach(gif => {
            // Vérifie si l'URL de l'image correspond à un emoji entre 1.gif et 200.gif
            let match = gif.src.match(/https:\/\/image\.jeuxvideo\.com\/smileys_img\/(\d+)\.gif/);
            
            if (match) {
                let emojiNumber = parseInt(match[1]);

                // Si le numéro est compris entre 1 et 200, on remplace l'image
                if (emojiNumber >= 1 && emojiNumber <= 200) {
                    // Nouvelle URL sur onche.org
                    let newSrc = `https://onche.org/img/smileys/jvc/${emojiNumber}.gif`;
                    gif.src = newSrc;
                    console.log(`GIF ${emojiNumber} remplacé par : `, newSrc);
                }
            }
        });
    }

    // Applique la fonction au chargement initial de la page
    window.addEventListener('load', replaceGifs);

    // Surveille les changements dynamiques de contenu pour remplacer les GIFs
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            replaceGifs();
        });
    });

    // Observe les changements dans le DOM (comme les forums avec du contenu chargé dynamiquement)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
