// ==UserScript==
// @name         Index adblocker blocker blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks adblocker blockers on index.hu's sites
// @author       magyarb
// @match        totalcar.hu/*
// @match        divany.hu/*
// @match        totalbike.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421595/Index%20adblocker%20blocker%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/421595/Index%20adblocker%20blocker%20blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function remove() {
        console.log('removing');
        try {
            document.querySelector('img[src*="adblock"]').offsetParent.remove();
            document.body.setAttribute('style', 'overflow: scroll');
        }
        catch (ex) {
            setTimeout(remove, 200)
        }
    }
    
    window.addEventListener('load', (event) => {
        remove();
    });
}
)();