// ==UserScript==
// @name         Bloxd UI Hide/Show Modified
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Bloxd Feature
// @author       Blueify, Gnosis
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @license      GNU GPLv3
// @ Modified from https://greasyfork.org/scripts/478682-bloxd-ui-hide-show
// @downloadURL https://update.greasyfork.org/scripts/485933/Bloxd%20UI%20HideShow%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/485933/Bloxd%20UI%20HideShow%20Modified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wholeAppWrapper = document.querySelector(".WholeAppWrapper");
    document.addEventListener('keyup', (event) => {
        if (event.key === '`') {
            if (wholeAppWrapper.style.visibility === 'hidden') {
                wholeAppWrapper.style.visibility = 'visible';
            } else {
                wholeAppWrapper.style.visibility = 'hidden';
            }
        }
    });

})();