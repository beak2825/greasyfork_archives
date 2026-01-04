// ==UserScript==
// @name         Mediaworks Megyei Hírlapok - kép letöltés a galériából
// @namespace    mediaworkskepletoltes
// @version      0.4
// @description  Egyszerű képletöltés a Mediaworks online megyei hírlapjainak galériájából.
// @author       Skyfighteer
// @include      https://www.szon.hu/galeria/*
// @include      https://www.bama.hu/galeria/*
// @include      https://www.baon.hu/galeria/*
// @include      https://www.beol.hu/galeria/*
// @include      https://www.boon.hu/galeria/*
// @include      https://www.duol.hu/galeria/*
// @include      https://www.feol.hu/galeria/*
// @include      https://www.haon.hu/galeria/*
// @include      https://www.heol.hu/galeria/*
// @include      https://www.nool.hu/galeria/*
// @include      https://www.teol.hu/galeria/*
// @include      https://www.vaol.hu/galeria/*
// @include      https://www.veol.hu/galeria/*
// @include      https://www.zaol.hu/galeria/*
// @include      https://www.kemma.hu/galeria/*
// @include      https://www.sonline.hu/galeria/*
// @include      https://www.szoljon.hu/galeria/*
// @include      https://www.kisalfold.hu/galeria/*
// @include      https://www.delmagyar.hu/galeria/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438630/Mediaworks%20Megyei%20H%C3%ADrlapok%20-%20k%C3%A9p%20let%C3%B6lt%C3%A9s%20a%20gal%C3%A9ri%C3%A1b%C3%B3l.user.js
// @updateURL https://update.greasyfork.org/scripts/438630/Mediaworks%20Megyei%20H%C3%ADrlapok%20-%20k%C3%A9p%20let%C3%B6lt%C3%A9s%20a%20gal%C3%A9ri%C3%A1b%C3%B3l.meta.js
// ==/UserScript==

// Wait for the first image to load... all the other ones can be accessed with same selector..
function waitForImage(onload, callback){
    let check = setInterval(function(){
        if (document.querySelectorAll('[style^="background-image:"]')[0]) {
            clearInterval(check);
            callback();
        }
    }, 100);
}

// when the displayed image loads
waitForImage('', function(){
console.log('image loaded');
main();
})

function main() {
// REMOVING INVISIBLE LIKE BUTTON START //
downremover();

function downremover() {
console.log('waiting for like');
function waitForDown(onload, callback){
    let check = setInterval(function(){
        if (document.querySelector('[data-action="like"]')) {
            clearInterval(check);
            callback();
        }
    }, 100);
}
// when like button appeared
waitForDown('', function(){
document.querySelector('[data-action="like"]').remove();
console.log('like removed');
downremover();
// REMOVING INVISIBLE LIKE BUTTON END//

// GETTING LINK, CHANGING EMAIL TO LINK START //
let url = document.querySelectorAll('[style^="background-image:"]')[0].getAttribute('style');
let regex = /(https:\/\/[a-z]+)(.+)(.png)/;
let link = url.match(regex)[0];
document.querySelector('.email').setAttribute('target', '_blank'); // new page
document.querySelector('.email').setAttribute('href', link); // link csere
Array.from(document.querySelectorAll('a')).find(el => el.textContent === 'Elküldöm emailben').textContent = "Megnyitás új lapon"; // text content
console.log('Link set.');
// GETTING LINK, CHANGING EMAIL TO LINK END //

})
}
}