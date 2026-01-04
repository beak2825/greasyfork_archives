// ==UserScript==
// @name         Grundo's Cafe - Go tombolWoke (or) Go tomBlroke
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Justice for the tombola man on grundos.cafe (GC)
// @author       Tombola Man
// @license MIT
// @match        https://grundos.cafe/island/
// @match        https://grundos.cafe/island/tombola/
// @match        https://grundos.cafe/island/tombola/play/
// @match        https://www.grundos.cafe/island/
// @match        https://www.grundos.cafe/island/tombola/
// @match        https://www.grundos.cafe/island/tombola/play/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463377/Grundo%27s%20Cafe%20-%20Go%20tombolWoke%20%28or%29%20Go%20tomBlroke.user.js
// @updateURL https://update.greasyfork.org/scripts/463377/Grundo%27s%20Cafe%20-%20Go%20tombolWoke%20%28or%29%20Go%20tomBlroke.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fakeTombolaMap = document.querySelector('img[src="https://grundoscafe.b-cdn.net/explore/mysteryisland.gif"]');
    const fakeTombolaMan = document.querySelector('img[src="https://grundoscafe.b-cdn.net/misc/tombolaman.gif"]');
    const fakeTombolaBanner = document.querySelector('img[src="https://grundoscafe.b-cdn.net/misc/banners/island/tombola.gif"]');
    if(fakeTombolaMap) fakeTombolaMap.src='https://images.neopets.com/maps/island/mysteryisland_2004_02.gif';
    if(fakeTombolaMan) fakeTombolaMan.src='https://images.neopets.com/island/tombolaman.gif';
    if(fakeTombolaBanner) fakeTombolaBanner.src='https://images.neopets.com/headers/island/tombola.gif';

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(el => {
      if (el.textContent.trim().toLowerCase() === 'tombola') {
          el.textContent = 'Tiki Tack Tombola';
      }
    });
})();