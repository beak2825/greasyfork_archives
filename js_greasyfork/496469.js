// ==UserScript==
// @name         Jinteki.net cards in french 1.9.6
// @namespace    http://tampermonkey.net/
// @version      1.9.6
// @description  Replace cards from jinteki.net by external source to make possible to have cards in another language
// @author       Michael Muguet, Sylvain Charlot
// @match        https://*.jinteki.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496469/Jintekinet%20cards%20in%20french%20196.user.js
// @updateURL https://update.greasyfork.org/scripts/496469/Jintekinet%20cards%20in%20french%20196.meta.js
// ==/UserScript==

console.log('Jinteki.net cards in french 1.9.6 script is running.');

const validUrlCache = new Map();
const mouseOverCache = new Map();

// Fonction pour vérifier l'existence des images
function imageExists(url, callback) {
    if (validUrlCache.has(url)) {
        callback(validUrlCache.get(url));
        return;
    }
    const img = new Image();
    img.onload = () => {
        validUrlCache.set(url, true);
        callback(true);
    };
    img.onerror = () => {
        validUrlCache.set(url, false);
        callback(false);
    };
    img.src = url;
}

// Fonction pour construire la nouvelle source d'image
function buildNewSrc(src) {
    const fileName = src.split('/').pop().replace(/\.(png|jpg)$/, '');
    if (src.includes("jinteki.net/img/cards/en/default/stock/")) {
        return `https://nsg.muguet.online/jinteki/default/${fileName}.jpg`;
    } else if (src.includes("jinteki.net/img/cards/en/high/stock/")) {
        return `https://nsg.muguet.online/jinteki/high/${fileName}.png`;
    } else if (src.includes("jinteki.net/img/cards/overrides/")) {
        const regex = /overrides\/([^/]+)\/en\/([^/]+)\/stock\//;
        const match = src.match(regex);
        if (match) {
            return `https://nsg.muguet.online/jinteki/${match[2]}/${fileName}.${match[2] === 'default' ? 'jpg' : 'png'}`;
        }
    }
    console.log(`Image source does not match known sources: ${src}`);
    return null;
}

// Fonction pour remplacer les sources des images
function replaceImageWithNewElement(img) {
    const newSrc = buildNewSrc(img.src);
    if (!newSrc) return;

    imageExists(newSrc, exists => {
        if (exists) {
            console.log(`Replacing image element: ${img.src}`);
            const newImg = document.createElement('img');
            newImg.src = newSrc;
            newImg.className = img.className;
            newImg.alt = img.alt;
            newImg.dataset.replaced = "true";
            img.parentNode.replaceChild(newImg, img);
            console.log(`New image element: ${newImg.src}`);
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
                    replaceImageWithNewElement(node);
                }
                // Vérifier également les images à l'intérieur des nouveaux nœuds ajoutés
                if (node.querySelectorAll) {
                    const imgs = node.querySelectorAll('img');
                    imgs.forEach(img => {
                        if (img.src.includes("jinteki.net/img/cards/")) {
                            console.log(`Found nested image in mutation observer: ${img.src}`);
                            replaceImageWithNewElement(img);
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
            if (!this.dataset.replaced) { // Vérifier si l'image a déjà été remplacée
                const newSrc = buildNewSrc(value);
                if (!newSrc) {
                    originalImage.set.call(this, value);
                    return;
                }

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

// Fonction pour gérer les événements de survol
function handleHoverEvent() {
    const cards = document.querySelectorAll('.card-element-class'); // Remplacez par la classe appropriée
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('img'); // Sélectionnez l'image agrandie
            if (img && img.src.includes("jinteki.net/img/cards/")) {
                console.log(`Hover detected - Found image: ${img.src}`);
                replaceImageWithNewElement(img);
            }
        });
    });
}

// Fonction principale pour lancer le traitement
function traitement() {
    console.log('Jinteki.net cards in french script is loading.');
    interceptImageRequests(); // Intercepter les requêtes d'images dès le chargement
    const images = document.querySelectorAll('img');
    console.log(`Initial run - Found ${images.length} images.`);
    images.forEach(img => {
        if (img.src.includes("jinteki.net/img/cards/")) {
            console.log(`Initial run - Found image: ${img.src}`);
            replaceImageWithNewElement(img);
        }
    });
    // Observer les changements dans le DOM
    observeDOM();
    // Gérer les événements de survol
    handleHoverEvent();
    console.log('End load Jinteki.net cards in french script.');
}

// Attendre que le contenu de la page soit chargé
traitement();
