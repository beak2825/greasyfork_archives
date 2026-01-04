// ==UserScript==
// @name         GC Faerie Bori Tail Shading
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Updates the art for the 'Circle' faerie bori art to one that adds shading to the tail fluff.
// @author       Twiggies
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478575/GC%20Faerie%20Bori%20Tail%20Shading.user.js
// @updateURL https://update.greasyfork.org/scripts/478575/GC%20Faerie%20Bori%20Tail%20Shading.meta.js
// ==/UserScript==


const boriPics = document.querySelectorAll('img[src="https://grundoscafe.b-cdn.net/pets/circle/bori_faerie.gif"]')

for (let i = 0; i < boriPics.length; i++) {
    boriPics[i].src = "https://i.imgur.com/fF4iJ1l.png"
}
