// ==UserScript==
// @name         PGG Odświeżacz
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       kapsel
// @license      MIT
// @match        https://sklep.pgg.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pgg.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449231/PGG%20Od%C5%9Bwie%C5%BCacz.user.js
// @updateURL https://update.greasyfork.org/scripts/449231/PGG%20Od%C5%9Bwie%C5%BCacz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = ()=>{
        if(document.querySelector('body > div.container > div.div1 > div > h1').innerText === 'Przepraszamy!'){
            setTimeout(()=>{
                location.reload();
            }, 20000);
        }
    }
})();