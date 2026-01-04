// ==UserScript==
// @name         Pet Pic Replacer B
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Basic pet pic replacer proof of concept. This one assuming you are replacing with images of another on site colour set of images.
// @author       Twiggies
// @match        *://www.grundos.cafe/*
// @exclude     *://www.grundos.cafe/rainbowpool/neopetcolours/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478477/Pet%20Pic%20Replacer%20B.user.js
// @updateURL https://update.greasyfork.org/scripts/478477/Pet%20Pic%20Replacer%20B.meta.js
// ==/UserScript==
//Species colour image code. Extract from the end of an image url of theirs, after the last slash.
//For example, 'https://grundoscafe.b-cdn.net/pets/circle/kau_rainbow_alt1.gif' you would get 'kau_rainbow_alt1.gif'
const ogCode = 'kau_rainbow_alt1.gif';

//Image URLs of the one that it will be replacing with.
//For example, 'https://grundoscafe.b-cdn.net/pets/circle/kau_royalgirl.gif' you would get 'kau_royalgirl.gif'
const newCode = 'kau_royalgirl.gif';

//Url building arrays.
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

    for (let i = 0; i < urlBuild.length; i++) {
        replaceImage(urlBase+urlBuild[i]+ogCode, urlBase+urlBuild[i]+newCode);
    }

})();