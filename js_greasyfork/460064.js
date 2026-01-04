// ==UserScript==
// @name         Better Kemono Galleries
// @namespace    https://sleazyfork.org/en/users/1027300-ntf
// @version      1.51
// @description  Load original resolution, toggle fitted zoom views, remove photos. Use a plug-in for batch download, can't do cross-origin image downloads with JS alone.
// @author       ntf
// @match        *://kemono.su/*/user/*/post/*
// @match        *://coomer.su/*/user/*/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/460064/Better%20Kemono%20Galleries.user.js
// @updateURL https://update.greasyfork.org/scripts/460064/Better%20Kemono%20Galleries.meta.js
// ==/UserScript==

const WIDTH = '【FILL WIDTH】';
const HEIGHT = '【FILL HEIGHT】';
const FULL = '【FULL】';
const RM = '【REMOVE】';

function Height() {
    document.querySelectorAll('.post__image').forEach(img => height(img));
}

function height(img) {
    img.style.maxHeight = '100vh';
    img.style.maxWidth = '100%';
}

function Width() {
    document.querySelectorAll('.post__image').forEach(img => width(img));
}

function width(img) {
    img.style.maxHeight = '100%';
    img.style.maxWidth = '100%';
}

function Full() {
    document.querySelectorAll('.post__image').forEach(img => full(img));
}

function full(img) {
    img.style.maxHeight = 'none';
    img.style.maxWidth = 'none';
}

function newToggle(name, action) {
    const toggle = document.createElement('a');
    toggle.text = name;
    toggle.addEventListener('click', action);
    toggle.style.cursor = 'pointer';
    return toggle;
}

function resizer(evt) {
    const name = evt.currentTarget.text;
    const img = evt.currentTarget.parentNode.nextSibling.lastElementChild;
    if (name === WIDTH) width(img);
    else if (name === HEIGHT) height(img);
    else if (name === FULL) full(img);
}

function removeImg(evt) {
    evt.currentTarget.parentNode.nextSibling.remove();
    evt.currentTarget.parentNode.remove();
}

(function() {
    'use strict';

    document.querySelectorAll('a.fileThumb.image-link img').forEach(img => (img.className = 'post__image'));

    let A = document.querySelectorAll('a.fileThumb.image-link');
    let IMG = document.querySelectorAll('.post__image');
    for (let i = 0; i < A.length; i++) {
        IMG[i].setAttribute('src', A[i].getAttribute('href'));
        IMG[i].test = i;
        A[i].outerHTML = A[i].innerHTML;
    }

    let DIV = document.querySelectorAll('.post__thumbnail');
    let parentDiv = DIV[0].parentNode;
    for (let i = 0; i < DIV.length; i++) {
        let newDiv = document.createElement('div');
        newDiv.append(newToggle(WIDTH, resizer), newToggle(HEIGHT, resizer), newToggle(FULL, resizer), newToggle(RM, removeImg));
        parentDiv.insertBefore(newDiv, DIV[i]);
    }

    Height();

    document.querySelector('.post__actions').append(newToggle(WIDTH, Width), newToggle(HEIGHT, Height), newToggle(FULL, Full));

})();