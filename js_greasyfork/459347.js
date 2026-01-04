// ==UserScript==
// @name         LB cast
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Click on the plaintext Telegram link to make it clickable
// @match        https://letterboxd.com/*
// @icon         https://www.google.com/s2/favicons?domain=letterboxd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459347/LB%20cast.user.js
// @updateURL https://update.greasyfork.org/scripts/459347/LB%20cast.meta.js
// ==/UserScript==

(function () {
    'use strict';
     const cast = document.querySelector(".cast-list")?.children[0]?.children;
     for (let i = 0; i < cast?.length; i++) {
         let e = cast[i];
         if (e?.title) {
            console.log(e);
            e.innerHTML = `${e.innerHTML} (${e.title})`;
            console.log(e.innerHTML);
         }
     }

})();