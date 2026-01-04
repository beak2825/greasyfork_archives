// ==UserScript==
// @name         Remove Instagram Sign Up
// @namespace    Violentmonkey Scripts
// @match        *://*.instagram.com/*
// @grant        none
// @version      1.1
// @description  Hide instagram's singup pop up and layover
// @author       kesto
// @downloadURL https://update.greasyfork.org/scripts/399929/Remove%20Instagram%20Sign%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/399929/Remove%20Instagram%20Sign%20Up.meta.js
// ==/UserScript==
const hideFooterBanner = () => {
    console.log('be forgotten')
    const banner = document.getElementsByClassName('N9d2H');
    banner[0].setAttribute('style', 'display: none;');
}

const hideInstaLightbox = () => {
    console.log('boom boom!')
    const lightbox = document.getElementsByClassName('g6RW6');
    const loginText = document.getElementsByClassName('_7UhW9');
    const layover = document.getElementsByClassName('RnEpo');
    const elements = [lightbox, loginText, layover];
    if (lightbox.length) {
        elements.forEach(el => el[0].setAttribute('style', 'display: none;'));
        document.body.style.overflow = 'scroll';
    }
    loop();
}

const loop = () => {
    window.setInterval(() => {
        hideInstaLightbox();
    }, 2000);
}


window.setTimeout(() =>{
    hideFooterBanner();
    loop();
}, 1000);