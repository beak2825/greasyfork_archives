// ==UserScript==
// @name         Pet Pic Replacer A
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Basic pet pic replacer proof of concept. Was done quickly at 4 am.
// @author       Twiggies
// @match        *://www.grundos.cafe/*
// @exclude     *://www.grundos.cafe/rainbowpool/neopetcolours/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478476/Pet%20Pic%20Replacer%20A.user.js
// @updateURL https://update.greasyfork.org/scripts/478476/Pet%20Pic%20Replacer%20A.meta.js
// ==/UserScript==

//Species colour image code. Extract from the end of an image url of theirs, after the last slash.
//For example, 'https://grundoscafe.b-cdn.net/pets/circle/kau_rainbow_alt1.gif' you would get 'kau_rainbow_alt1'
const ogCode = 'kau_rainbow_alt1.gif';

//Image URLs of the one that it will be replacing with. Note the names to figure out which expression they're replacing
const circle = 'https://grundoscafe.b-cdn.net/pets/circle/kau_royalgirl.gif';
const happy = 'https://grundoscafe.b-cdn.net/pets/happy/kau_royalgirl.gif';
const sad = 'https://grundoscafe.b-cdn.net/pets/sad/kau_royalgirl.gif';
const angry = 'https://grundoscafe.b-cdn.net/pets/angry/kau_royalgirl.gif';
const beaten = 'https://grundoscafe.b-cdn.net/pets/beaten/kau_royalgirl.gif';
const closeAttack = 'https://grundoscafe.b-cdn.net/pets/closeattack/kau_royalgirl.gif';
const defended = 'https://grundoscafe.b-cdn.net/pets/defended/kau_royalgirl.gif';
const hit = 'https://grundoscafe.b-cdn.net/pets/hit/kau_royalgirl.gif';
const rangedAttack = 'https://grundoscafe.b-cdn.net/pets/rangedattack/kau_royalgirl.gif';

//OG image url building base
const urlBase = 'https://grundoscafe.b-cdn.net/pets/'
const urlBuild = ['circle/', 'happy/', 'sad/','angry/','beaten/','closeattack/','defended/','hit/','rangedattack/']

function replaceImage(og, newImg) {
    const imgList = document.querySelectorAll(`img[src="${og}"]`);
    if (imgList) {
        for (let i = 0; i < imgList.length; i++) {
            imgList[i].src = newImg
        }
    }
}

(function() {
    'use strict';

    replaceImage(urlBase + 'circle/' + ogCode, circle);
    replaceImage(urlBase + 'happy/' + ogCode, happy);
    replaceImage(urlBase + 'sad/' + ogCode, sad);
    replaceImage(urlBase + 'angry/' + ogCode, angry);
    replaceImage(urlBase + 'beaten/' + ogCode, beaten);
    replaceImage(urlBase + 'closeattack/' + ogCode, closeAttack);
    replaceImage(urlBase + 'defended/' + ogCode, defended);
    replaceImage(urlBase + 'hit/' + ogCode, hit);
    replaceImage(urlBase + 'rangedattack/' + ogCode, rangedAttack);

})();