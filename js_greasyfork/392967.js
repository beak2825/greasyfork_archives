// ==UserScript==
// @name         BetterPhotopea
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Addless Photopea only for you!
// @author       You
// @match        https://www.photopea.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392967/BetterPhotopea.user.js
// @updateURL https://update.greasyfork.org/scripts/392967/BetterPhotopea.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var addremover = setInterval(() => {
        var mainSection = document.querySelector('.flexrow.photopea').childNodes;
        var mainpart = mainSection[0];
        var addpart = mainSection[1];
        if (addpart) {
            addpart.style.display = 'none';
            mainpart.style.width = '100%';
            document.querySelector('.panelblock.mainblock').style.width = '100%';
            document.querySelector('.sbar.toolbar').style.overflow = 'visible';
            console.log('Job done, script quit.')
            clearInterval(addremover);
        }
    }, 100);
})();