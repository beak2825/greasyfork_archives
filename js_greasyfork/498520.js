// ==UserScript==
// @name         Jinteki.net cards in french 1.9.5
// @namespace    http://tampermonkey.net/
// @version      1.9.5
// @description  Replace cards from jinteki.net by external source to make possible to have cards in another language
// @author       Michael Muguet, Sylvain Charlot
// @match        https://*.jinteki.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498520/Jintekinet%20cards%20in%20french%20195.user.js
// @updateURL https://update.greasyfork.org/scripts/498520/Jintekinet%20cards%20in%20french%20195.meta.js
// ==/UserScript==

console.log('Jinteki.net cards in french 1.9.5 script is running.');

const validUrlCache = new Map();

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
    return null;
}

// Fonction pour remplacer les sources des images
function replaceImageWithNewElement(img) {
    const newSrc = buildNewSrc(img.src);
    if (!newSrc) return;

    imageExists(newSrc, exists => {
        if (exists) {
            img.src = newSrc;
            img.classList.add('replaced-image'); // Marquer l'image comme remplacée
        }
    });
}

// Fonction pour observer les changements dans le DOM
function observeDOM() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG' && node.src.includes("jinteki.net/img/cards/")) {
                    replaceImageWithNewElement(node);
                } else if (node.querySelectorAll) {
                    const imgs = node.querySelectorAll('img');
                    imgs.forEach(img => {
                        if (img.src.includes("jinteki.net/img/cards/")) {
                            replaceImageWithNewElement(img);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Fonction pour intercepter les requêtes d'images
function interceptImageRequests() {
    const originalImage = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set: function(value) {
            if (!this.classList.contains('replaced-image')) {
                const newSrc = buildNewSrc(value);
                if (!newSrc) {
                    originalImage.set.call(this, value);
                    return;
                }
                imageExists(newSrc, exists => {
                    if (exists) {
                        originalImage.set.call(this, newSrc);
                        this.classList.add('replaced-image');
                    } else {
                        originalImage.set.call(this, value);
                    }
                });
            } else {
                originalImage.set.call(this, value);
            }
        }
    });
}

// Fonction principale pour lancer le traitement
function traitement() {
    interceptImageRequests();
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src.includes("jinteki.net/img/cards/")) {
            replaceImageWithNewElement(img);
        }
    });
    observeDOM();
}

traitement();
