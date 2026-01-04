// ==UserScript==
// @name         eMentor megoldó
// @namespace    https://mogery.me/
// @version      1.0
// @description  eMentor megoldó, szöveges/szám válaszokhoz.
// @author       mogery
// @match        *://www.ementor.hu/kviz/*
// @icon         http://www.ementor.hu/sites/all/themes/ementor/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450803/eMentor%20megold%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/450803/eMentor%20megold%C3%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, t);
        });
    }

    async function testSesh() {
        while (document.getElementById("feladat").style.visibility === 'visible') {
            document.getElementById("tipp").value = window.mo;
            await wait(100);
            document.querySelector("input[value=OK]").click();
            await wait(100);
        }

        setTimeout(testSesh, 1000);
    }

    testSesh();
})();