// ==UserScript==
// @name         Jinteki.net cards in french 1.8b
// @namespace    http://tampermonkey.net/
// @version      1.8c
// @description  Replace cards from jinteki.net by external source to make possible to have cards in another language
// @author       Michael Muguet, Sylvain Charlot
// @match        https://*.jinteki.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496613/Jintekinet%20cards%20in%20french%2018b.user.js
// @updateURL https://update.greasyfork.org/scripts/496613/Jintekinet%20cards%20in%20french%2018b.meta.js
// ==/UserScript==



    console.log('Jinteki.net cards in french 1.8 script is running.');

    // Fonction pour vérifier l'existence des images
    function imageExists(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }

    // Fonction pour remplacer les sources des images
    function replaceImageSources(img) {
        const fileName = img.src.split('/').pop().replace(/\.(png|jpg)$/, '.jpg');
        console.log(fileName)
        const newSrc = `https://nsg.muguet.online/MD/${fileName}`;
        imageExists(newSrc, exists => {
            if (exists) {
                console.log(`Replacing image source: ${img.src}`);
                img.src = newSrc;
                console.log(`New image source: ${img.src}`);
            } else {
                console.log(`Replacement image not found for: ${img.src}`);
            }
        });
    }

    // Fonction pour observer les changements dans le DOM
    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG' && node.src.includes("jinteki.net/img/cards/")) {
                        console.log(`Found new image in mutation observer: ${node.src}`);
                        replaceImageSources(node);
                    }
                    // Vérifier également les images à l'intérieur des nouveaux nœuds ajoutés
                    if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(img => {
                            if (img.src.includes("jinteki.net/img/cards/")) {
                                console.log(`Found nested image in mutation observer: ${img.src}`);
                                replaceImageSources(img);
                            }
                        });
                    }
                });
            });
        });

        // Configurer l'observation sur le corps du document
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Fonction pour intercepter les requêtes d'images
    function interceptImageRequests() {
        const originalImage = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            set: function(value) {
                if (value.includes("jinteki.net/img/cards/")) {
                    const fileName = value.split('/').pop().replace(/\.(png|jpg)$/, '.jpg');
                    const newSrc = `https://nsg.muguet.online/MD/${fileName}`;
                    imageExists(newSrc, exists => {
                        if (exists) {
                            console.log(`Intercepted and replacing image source: ${value}`);
                            originalImage.set.call(this, newSrc);
                        } else {
                            console.log(`Replacement image not found for: ${value}`);
                            originalImage.set.call(this, value);
                        }
                    });
                } else {
                    originalImage.set.call(this, value);
                }
            }
        });
    }
function traitement(){
        // Attendre cinq secondes supplémentaires pour s'assurer que tout est bien chargé
        console.log('Jinteki.net cards in french 1.8 script is loading.');
            interceptImageRequests(); // Intercepter les requêtes d'images dès le chargement
            const images = document.querySelectorAll('img');
            console.log(`Initial run - Found ${images.length} images.`);
            images.forEach(img => {
                if (img.src.includes("jinteki.net/img/cards/")) {
                    console.log(`Initial run - Found image: ${img.src}`);
                    replaceImageSources(img);
                }
            });
            // Observer les changements dans le DOM
            observeDOM();
         console.log('end load Jinteki.net cards in french 1.8');
    }

    // Attendre que le contenu de la page soit chargé
    window.addEventListener('load', traitement());



