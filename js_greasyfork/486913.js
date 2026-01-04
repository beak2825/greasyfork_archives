// ==UserScript==
// @name         Bloxd UI Hide/Show
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A Bloxd Feature
// @author       ITS_COURRUPTEDYT
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486913/Bloxd%20UI%20HideShow.user.js
// @updateURL https://update.greasyfork.org/scripts/486913/Bloxd%20UI%20HideShow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wholeAppWrapper = document.querySelector(".WholeAppWrapper");
    document.addEventListener('keydown', function(event) {
        if (event.key === 'I') {
            if (wholeAppWrapper.style.visibility === 'hidden') {
                wholeAppWrapper.style.visibility = 'visible';
            } else {
                wholeAppWrapper.style.visibility = 'hidden';
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'i') {
            if (wholeAppWrapper.style.visibility === 'hidden') {
                wholeAppWrapper.style.visibility = 'visible';
            } else {
                wholeAppWrapper.style.visibility = 'hidden';
            }
        }
    });

})();