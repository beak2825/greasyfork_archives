// ==UserScript==
// @name         TruckMovers Search Spam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate retrying TruckMovers Billboard
// @author       You
// @match        https://truckmovers.com/x/ra/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=truckmovers.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453735/TruckMovers%20Search%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/453735/TruckMovers%20Search%20Spam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const intervalID = setInterval(() => {
        const searchButton = findAndSetSearch();
        if (searchButton) {
            clearInterval(intervalID);
            console.log('found search button, clearing interval', intervalID);
            const currOnclick = searchButton.onclick;
            searchButton.onclick = (e) => {
                console.log('hijacking search click');
                currOnclick(e);
                setTimeout(() => {
                    const backButton = findBackButton();
                    const noMatchNode = findNoMatchNode();
                    console.log({ backButton, noMatchNode });
                    if (noMatchNode) {
                        backButton.click();
                        setTimeout(() => {
                            searchButton.click();
                        }, 5000);
                    } else {
                        console.log('found! clearing ');
                        const audio = new Audio('https://cdn.videvo.net/videvo_files/audio/premium/audio0041/watermarked/Bell-Alert-Musical-Bell-Chimes-Computer-Message-Alert_COMM-0093_preview.mp3');
                        audio.play();
                    }

                }, 5000);
            };
        }
    }, 1500);


})();

function getRelevantBodyDiv() {
    const relevantBodyDiv = document.getElementsByClassName('x-body-el x-navigationview-body-el x-container-body-el x-component-body-el x-layout-card x-navigationview-ra-driver-body-el x-container-ra-driver-body-el x-component-ra-driver-body-el');
    return relevantBodyDiv;
}

function findAndSetSearch() {
    const form = document.getElementsByTagName('form');
    if (form.length !== 3) return;
    const searchButton = walkDOM(form[2], (node) => node.innerHTML === 'Search');
    const searchButtonDiv = searchButton.parentElement.parentElement.parentElement;
    return searchButtonDiv;
}

function findBackButton() {
    const relevantBodyDiv = getRelevantBodyDiv();
    const billboard = walkDOM(relevantBodyDiv[0], (node) => node.innerHTML === 'Billboard');
    const backButtonDiv = billboard.parentElement.parentElement.parentElement.parentElement.firstChild;
    return backButtonDiv;
}

function findNoMatchNode() {
    const relevantBodyDiv = getRelevantBodyDiv();
    const noMatchNode = walkDOM(relevantBodyDiv[0], (node) => node.innerHTML && node.innerHTML.startsWith('No available loads match your search'));
    if (noMatchNode && noMatchNode.parentElement.classList.contains('x-hidden')) return undefined;
    return noMatchNode;
}

function walkDOM(node, cbTruthy) {
    if (cbTruthy(node)) {
        return node;
    }
    node = node.firstChild;
    while(node) {
        const found = walkDOM(node, cbTruthy);
        if (found) return found;
        node = node.nextSibling;
    }
}