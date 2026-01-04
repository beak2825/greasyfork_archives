// ==UserScript==
// @name         MSP Aisha - Grungy Green
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Heemi's Edit, Twiggies' Code.
// @author       Twiggies, Heemi
// @match        *://www.grundos.cafe/*
// @exclude      *://www.grundos.cafe/rainbowpool/neopetcolours/*
// @exclude      *://www.grundos.cafe/userlookup/*
// @exclude      *://www.grundos.cafe/petlookup/*
// @icon         https://i.imgur.com/WZFibzE.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479016/MSP%20Aisha%20-%20Grungy%20Green.user.js
// @updateURL https://update.greasyfork.org/scripts/479016/MSP%20Aisha%20-%20Grungy%20Green.meta.js
// ==/UserScript==

//Species colour image code. Extract from the end of an image url of theirs, after the last slash.
//For example, 'https://grundoscafe.b-cdn.net/pets/circle/kau_rainbow_alt1.gif' you would get 'kau_rainbow_alt1'
const ogCode = 'aisha_msp.gif';

//Image URLs of the one that it will be replacing with. Note the names to figure out which expression they're replacing
const circle = 'https://i.imgur.com/lqJVTbo.png';
const happy = 'https://i.imgur.com/WZFibzE.png';
const sad = 'https://i.imgur.com/3Fh70Wj.png';
const angry = 'https://i.imgur.com/radpulg.png';
const beaten = 'https://i.imgur.com/bXXm4PZ.png';
const closeAttack = 'https://i.imgur.com/Zf9vCy6.png';
const defended = 'https://i.imgur.com/DAsvNhR.png';
const hit = 'https://i.imgur.com/gNP2O2k.png';
const rangedAttack = 'https://i.imgur.com/J8ShvWB.png';

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