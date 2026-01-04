// ==UserScript==
// @name         Mediaworks - Origo, Life, SuliLife, ThatsLife, UniLife - kép letöltés a galériából
// @namespace    mediaworkskepletoltes2
// @version      0.2
// @description  Egyszerű képletöltés a Mediaworks címben felsorolt lapjainak galériájából.
// @author       Skyfighteer
// @include      https://www.origo.hu/foto/galeria/*
// @include      https://www.life.hu/*/galeria/*
// @include      https://sulilife.unilife.hu/*/galeria/*
// @include      https://thatslife.hu/*/galeria/*
// @include      https://unilife.hu/*/galeria/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438937/Mediaworks%20-%20Origo%2C%20Life%2C%20SuliLife%2C%20ThatsLife%2C%20UniLife%20-%20k%C3%A9p%20let%C3%B6lt%C3%A9s%20a%20gal%C3%A9ri%C3%A1b%C3%B3l.user.js
// @updateURL https://update.greasyfork.org/scripts/438937/Mediaworks%20-%20Origo%2C%20Life%2C%20SuliLife%2C%20ThatsLife%2C%20UniLife%20-%20k%C3%A9p%20let%C3%B6lt%C3%A9s%20a%20gal%C3%A9ri%C3%A1b%C3%B3l.meta.js
// ==/UserScript==

// first time
function waitForImage(onload, callback){
    let check = setInterval(function(){
        if (document.querySelector('div.swiper-slide-active')) {
            clearInterval(check);
            callback();
        }
    }, 100);
}

waitForImage('', function(){
console.log('The first image is displayed.');
main();
})


function main() {
//first time
iconchange();
// every time the image changes
const parent = document.querySelector('.swiper-container');
const parentobserver = new MutationObserver(function() {
    if (document.querySelector('.swiper-wrapper[style*="300ms"]')) { // prevent executing twice
        console.log('A new image is displayed.');
        iconchange();
    }
});
parentobserver.observe(parent, { attributes: true, subtree: true, attributeFilter: ['style'] });

// change pinterest share icon href to image link
function iconchange() {
    let regex = /https:\/\/cdn\..+/
    let source = document.querySelector('div.swiper-slide-active').firstElementChild.firstElementChild.currentSrc;
    let link = source.match(regex)[0];
    let pinterest = document.querySelector('div.swiper-slide-active').lastElementChild.firstElementChild.firstElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild;
    pinterest.setAttribute('href', link);
    console.log('The pinterest link has been changed.')
}

}