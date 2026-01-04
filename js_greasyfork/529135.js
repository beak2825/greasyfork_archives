// ==UserScript==
// @name         Gartic.io Auto Draw and Skip
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Çizim ve Skip butonlarına otomatik tıklar
// @author       Ryzex
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529135/Garticio%20Auto%20Draw%20and%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/529135/Garticio%20Auto%20Draw%20and%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function otomatikCizimButonu() {
        let cizimButon = document.querySelector(".btYellowBig.ic-drawG"); 
        if (cizimButon) {
            cizimButon.click();
            console.log("Çizim butonuna tıklandı!");
        } else {
            console.log("Çizim butonu bulunamadı.");
        }
    }

    function otomatikSkipButonu() {
        let skipButon = document.querySelector(".skip"); 
        if (skipButon) {
            skipButon.click();
            console.log("Skip butonuna tıklandı!");
        } else {
            console.log("Skip butonu bulunamadı.");
        }
    }

    setInterval(() => {
        otomatikCizimButonu(); 
        otomatikSkipButonu(); 
    }, 1000); 
})();