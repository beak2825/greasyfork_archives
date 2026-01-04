// ==UserScript==
// @name         Auto Navigate Manga Pages
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Navigue automatiquement à travers les pages du manga jusqu'à la dernière page lorsque le bouton est cliqué et télécharge les images directement sur le PC
// @author       Viatana35
// @license      MIT
// @match        https://niyaniya.moe/reader/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522241/Auto%20Navigate%20Manga%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/522241/Auto%20Navigate%20Manga%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPage = 1;
    let maxPageReached = false;
    let navigationStarted = localStorage.getItem('navigationStarted') === 'true';

    // Function to check if image is loaded
    async function checkImageLoaded() {
        const imgElement = document.querySelector('img.m-auto');
        if (imgElement) {
            if (imgElement.complete && imgElement.naturalHeight !== 0 && imgElement.src.startsWith('blob:')) {
                console.log('L\'image principale est chargée.');
                await downloadImage(imgElement.src);
                if (navigationStarted) {
                    navigateToNextPage();
                }
            } else {
                imgElement.addEventListener('load', async function() {
                    console.log('L\'image principale est chargée.');
                    await downloadImage(imgElement.src);
                    if (navigationStarted) {
                        navigateToNextPage();
                    }
                });
            }
        } else {
            // If image not yet present, retry after a short delay
            setTimeout(checkImageLoaded, 100);
        }
    }

    // Function to download the image
    async function downloadImage(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        const pageNumber = parseInt(urlParts[urlParts.length - 1], 10);
        link.download = `image_${pageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // Fonction pour naviguer à la page suivante
    function navigateToNextPage() {
        if (maxPageReached) return;

        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        const pageNumber = parseInt(urlParts[urlParts.length - 1], 10);

        // Récupérer le numéro de la page précédente depuis localStorage
        const previousPage = parseInt(localStorage.getItem('previousPage'), 10) || 1;

        // Si la page actuelle est la même que la page précédente, nous avons atteint la dernière page
        if (pageNumber === previousPage && previousPage !== 1) {
            maxPageReached = true;
            console.log('Maximum page reached:', previousPage);
            localStorage.setItem('navigationStarted', 'false');
            return;
        }

        // Mettre à jour le numéro de la page précédente dans localStorage
        localStorage.setItem('previousPage', pageNumber);

        // Passer à la page suivante
        currentPage = pageNumber + 1;
        urlParts[urlParts.length - 1] = currentPage;
        const newUrl = urlParts.join('/');
        window.location.href = newUrl;
    }

    // Fonction pour ajouter le bouton à la page
    function addButton() {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.textContent = 'Démarrer la navigation automatique';

        button.addEventListener('click', function() {
            localStorage.setItem('navigationStarted', 'true');
            navigationStarted = true;
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split('/');
            const pageNumber = urlParts[urlParts.length - 1];

            if (pageNumber !== '1') {
                urlParts[urlParts.length - 1] = '1';
                const newUrl = urlParts.join('/');
                window.location.href = newUrl;
            } else {
                checkImageLoaded();
            }
        });

        document.body.appendChild(button);
    }

    // Appeler la fonction pour ajouter le bouton à la page
    addButton();

    console.log(navigationStarted);
    // Vérifier si la navigation a déjà commencé
    if (navigationStarted) {
        checkImageLoaded();
    }
})();
