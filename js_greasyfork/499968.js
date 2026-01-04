// ==UserScript==
// @name         PhotoPea AddBlock Perfect Pixel
// @namespace    http://tampermonkey.net/
// @version      2024-07-08
// @description  Add block version july 2024
// @author       Z-x
// @match        https://www.photopea.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499968/PhotoPea%20AddBlock%20Perfect%20Pixel.user.js
// @updateURL https://update.greasyfork.org/scripts/499968/PhotoPea%20AddBlock%20Perfect%20Pixel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour appliquer les styles souhaités
    function applyStyles() {
        var mainSection = document.querySelector('.flexrow.app').childNodes;
        var mainpart = mainSection[0];
        var addpart = mainSection[1];

        if (addpart && addpart.style.display !== 'none') {
            addpart.style.display = 'none';
            mainpart.style.width = '100%';
            document.querySelector('.panelblock.mainblock').style.width = '100%';
            document.querySelector('.panelhead').style.maxWidth = 'none';

            var bodyElements = document.querySelectorAll('.body');
            if (bodyElements.length > 1 && bodyElements[1].style.width !== '100%') {
                bodyElements[1].style.width = '100%';
                bodyElements[1].style.overflow = 'visible';
            }

            document.querySelector('.sbar.toolbar').style.overflow = 'visible';

            // Appliquez cette largeur au deuxième élément canvas
            var canvases = document.querySelectorAll('canvas');
            if (canvases.length > 1 && canvases[1].width !== 800) {
                canvases[1].width = 800;
                canvases[1].style.width = '800px';
            }

            console.log('Styles applied.');
        }
    }

    // Utiliser setInterval pour s'assurer que les styles sont appliqués périodiquement
    var addremover = setInterval(() => {
        applyStyles();
    }, 100);

    // Créer un MutationObserver pour surveiller les changements dans le DOM
    var targetNode = document.querySelector('.flexrow.app');
    if (targetNode) {
        var config = { attributes: true, childList: true, subtree: true };
        var callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    applyStyles();
                }
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Ajouter un event listener pour réappliquer les styles lorsque l'utilisateur interagit avec la page
    document.addEventListener('mousemove', applyStyles);
    document.addEventListener('click', applyStyles);
    document.addEventListener('scroll', applyStyles);

    // Stopper l'intervalle après un certain temps pour éviter une utilisation excessive des ressources
    setTimeout(() => {
        clearInterval(addremover);
        console.log('Interval cleared.');
    }, 10000);

})();
