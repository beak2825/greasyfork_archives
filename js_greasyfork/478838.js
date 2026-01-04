// ==UserScript==
// @name         Darigan Draik Replacer - Green and Cyan
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Heemi's Edits, Twiggies' Code.
// @author       Twiggies, Heemi
// @match        *://www.grundos.cafe/*
// @exclude      *://www.grundos.cafe/rainbowpool/neopetcolours/*
// @exclude      *://www.grundos.cafe/userlookup/*
// @exclude      *://www.grundos.cafe/petlookup/*
// @icon         https://i.imgur.com/HT0GB02.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478838/Darigan%20Draik%20Replacer%20-%20Green%20and%20Cyan.user.js
// @updateURL https://update.greasyfork.org/scripts/478838/Darigan%20Draik%20Replacer%20-%20Green%20and%20Cyan.meta.js
// ==/UserScript==

//Heemi's Darigan Draik Edit, originally designed for Herran. Original Script by Twiggies.

//Species colour image code. Extract from the end of an image url of theirs, after the last slash.
//For example, 'https://grundoscafe.b-cdn.net/pets/circle/kau_rainbow_alt1.gif' you would get 'kau_rainbow_alt1.gif'
const ogCode = 'draik_darigan.gif';

//Image URLs of the one that it will be replacing with. Note the names to figure out which expression they're replacing
const circle = 'https://i.imgur.com/idW0nyt.png';
const happy = 'https://i.imgur.com/HT0GB02.png';
const sad = 'https://i.imgur.com/b5eRz1X.png';
const angry = 'https://i.imgur.com/f3KbsWo.png';
const beaten = 'https://i.imgur.com/tQx4cQJ.png';
const closeAttack = 'https://i.imgur.com/0ee3337.png';
const defended = 'https://i.imgur.com/9TuAlCa.png';
const hit = 'https://i.imgur.com/t0vMxcx.png';
const rangedAttack = 'https://i.imgur.com/7T3knsJ.png';

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