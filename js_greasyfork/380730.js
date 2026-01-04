// ==UserScript==
// @name         Brick Hill Coloured Bits & Bucks
// @include      https://www.brick-hill.com/*
// @version      0.1
// @author       a very epic gamer who i shall not name, distributed by prevent
// @description  adds colour to the bits and bucks icons
// @namespace https://greasyfork.org/users/285466
// @downloadURL https://update.greasyfork.org/scripts/380730/Brick%20Hill%20Coloured%20Bits%20%20Bucks.user.js
// @updateURL https://update.greasyfork.org/scripts/380730/Brick%20Hill%20Coloured%20Bits%20%20Bucks.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    let bucks = document.getElementsByClassName('bucks-icon img-white')[0];
    bucks.classList.remove("img-white");

    let bits = document.getElementsByClassName('bits-icon img-white')[0];
    bits.classList.remove("img-white");
}, false);