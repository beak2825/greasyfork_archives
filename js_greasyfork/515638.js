// ==UserScript==
// @icon            https://cloud.pocketbook.digital/reader_new/static/media/logo.74f9be12.svg
// @name            PocketBook - Grayscale Online Reader
// @version         1.0
// @author          R4wwd0G
// @description     Set grayscale effect to the actual page to avoid wrong colors in some pages in PDF reading.
// @include			https://cloud.pocketbook.digital/reader_new/*
// @namespace https://greasyfork.org/users/700468
// @downloadURL https://update.greasyfork.org/scripts/515638/PocketBook%20-%20Grayscale%20Online%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/515638/PocketBook%20-%20Grayscale%20Online%20Reader.meta.js
// ==/UserScript==



function applyGrayscale() {
    document.querySelectorAll('.page-img').forEach(img => {
        img.style.filter = 'grayscale(1)';
    });
}


applyGrayscale();


const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('page-img')) {
                    node.style.filter = 'grayscale(1)';
                }
            });
        }
    });
});


observer.observe(document.querySelector('#Reader__content'), { childList: true, subtree: true });
