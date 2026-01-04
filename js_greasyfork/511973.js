// ==UserScript==
// @name         Téléchargment des photos : "Mes enfants"
// @namespace    http://tampermonkey.net/
// @version      2025-04-14
// @description  Ajoute un bouton pour télécharger l'ensemble des photos de la section "Mes enfants". Le bouton télécharge les photos de la page courante dans un ZIP. Il faut effectuer l'action pour chaque page.
// @author       You
// @match        https://www.toutemonannee.com/journal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toutemonannee.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511973/T%C3%A9l%C3%A9chargment%20des%20photos%20%3A%20%22Mes%20enfants%22.user.js
// @updateURL https://update.greasyfork.org/scripts/511973/T%C3%A9l%C3%A9chargment%20des%20photos%20%3A%20%22Mes%20enfants%22.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Fonction pour activer le loader sur le bouton
    function showLoader(button) {
        button.disabled = true; // Désactiver le bouton pendant le téléchargement
        button.innerHTML = '<span class="loader"></span> Preparing...'; // Changer le texte avec l'animation de chargement
    }

    // Fonction pour désactiver le loader sur le bouton
    function hideLoader(button) {
        button.disabled = false; // Réactiver le bouton
        button.innerHTML = 'Download as ZIP'; // Restaurer le texte initial
    }

    // Fonction qui récupère et télécharge toutes les images dans un fichier .zip
    function downloadAllImagesAsZip(button) {
        // Réinitialiser l'objet JSZip pour chaque nouvelle demande de téléchargement
        const zip = new JSZip();

        // Activer le loader
        showLoader(button);

        // Sélecteur des images
        const images = document.querySelectorAll('img.border-radius-xs.cursor-zoomin');

        // Créer une liste de promesses pour gérer chaque téléchargement d'image
        const promises = Array.from(images).map((img) => {
            // Remplacer '/thumbs/' par '/hd/' dans l'URL de l'image
            const hdUrl = img.src.replace('/thumbs/', '/hd/');

            // Extraire le nom de fichier original de l'URL et ignorer les paramètres après le ".jpg"
            const filename = hdUrl.split('/').pop().split('?')[0];

            // Utiliser fetch pour récupérer l'image en tant que Blob
            return fetch(hdUrl)
                .then(response => response.blob())
                .then(blob => {
                // Ajouter l'image au fichier zip avec son nom original (sans les paramètres)
                zip.file(filename, blob);
            })
                .catch(err => console.error('Erreur lors du téléchargement : ', err));
        });

        // Attendre que toutes les promesses soient résolues avant de générer le fichier .zip
        Promise.all(promises).then(() => {
            // Récupérer le numéro de la page à partir de la balise 'li.reactor-pagination__item.reactor-pagination__item--active'
            const pageElement = document.querySelector('ul.me.m-t-sm.p-t-sm li.I.hr');
            const pageNumber = pageElement ? pageElement.textContent.trim() : 'unknown';

            // Nommer le fichier zip avec le numéro de page
            const zipFilename = `image_page_${pageNumber}.zip`;

            zip.generateAsync({ type: 'blob' }).then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = zipFilename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Désactiver le loader une fois que le téléchargement est prêt
                hideLoader(button);
            });
        });
    }

    let gbutton = undefined;
    function destroyDownloadButton() {
        if (gbutton) {
            document.body.removeChild(gbutton);
            gbutton = undefined;
        }
    }

    // Fonction pour créer un bouton flottant avec animation de chargement
    function createDownloadButton() {
        destroyDownloadButton();
        const button = document.createElement('button');
        // Récupérer le numéro de la page à partir de la balise 'li.reactor-pagination__item.reactor-pagination__item--active'
        // ul.me.m-t-sm.p-t-sm li.I.hr
        const pageElement = document.querySelector('ul.me.m-t-sm.p-t-sm li.I.hr');
        const pageNumber = pageElement ? pageElement.textContent.trim() : null;
        if (pageNumber === null) {
            return;
        }
        gbutton = button;
        lastPageNumber = parseInt(pageNumber);

        // Mettre à jour le texte du bouton avec le numéro de page
        button.innerText = `Download page ${pageNumber} as ZIP`;

        // Appliquer des styles pour que le bouton soit flottant à droite
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.bottom = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#28a745';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '2147483641';

        // Ajouter un événement 'click' pour déclencher le téléchargement des images en fichier .zip
        button.addEventListener('click', function() {
            downloadAllImagesAsZip(button);
        });

        // Ajouter le bouton au body
        document.body.appendChild(button);
    }

    let lastUrl_tested = null;
    let lastPageNumber = null;

    // Fonction à exécuter quand l'URL correspond au pattern désiré
    function handleUrlChange() {
        const currentUrl = window.location.href;
        console.log('handleUrlChange = ',currentUrl);
        if (/https:\/\/www\.toutemonannee\.com\/journal\/.*\/my-children/.test(currentUrl)) {
            const pageElement = document.querySelector('ul.me.m-t-sm.p-t-sm li.I.hr');
            const currentPageNumber = pageElement ? parseInt(pageElement.textContent.trim()) : null;
            if (currentUrl !== lastUrl_tested || lastPageNumber !== currentPageNumber) {
                lastUrl_tested = currentUrl;
                console.log('handleUrlChange = ',currentUrl);

                console.log('URL correspond, exécution du script...');
                createDownloadButton();
            }
        }
        else {
            if (currentUrl !== lastUrl_tested) {
                lastUrl_tested = currentUrl;
            }
            destroyDownloadButton();
        }
    }

    // Surveiller les changements dans l'historique
    function observeUrlChanges() {
        // Ajouter une vérification périodique au cas où l'URL change d'une autre manière
        setInterval(() => {
            handleUrlChange();
        }, 200);  // Vérifie toutes les secondes si l'URL a changé
    }

    // Appeler l'observateur après que la page soit chargée
    observeUrlChanges();

    // Créer le bouton lorsque la page est chargée
    //createDownloadButton();
})();