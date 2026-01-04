// ==UserScript==
// @name         Tuxun Fun button transparent Changer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Apply a blur effect to the background of specific elements on Tuxun Fun and make all card-top-right elements' background transparent
// @author       lemures
// @match        https://tuxun.fun/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483759/Tuxun%20Fun%20button%20transparent%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/483759/Tuxun%20Fun%20button%20transparent%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

const waitForElements = () => {
    var elements = document.querySelectorAll('.container .grid_main .card[data-v-366c24ce]');

    if (elements.length > 0) {

        elements.forEach(function(element) {
            element.style.backdropFilter = 'blur(30px)';
            element.style.backgroundColor = 'transparent';
        });

        var cardTopRightElements = document.querySelectorAll('#tuxun .card-top-right');
        cardTopRightElements.forEach(function(element) {
            element.style.backgroundColor = 'transparent';
        });

        var cardtoprightbeta = document.querySelectorAll('#tuxun .card-top-right-beta');
        cardtoprightbeta.forEach(function(element) {
            element.style.backgroundColor = 'transparent';
        });

        var describe = document.querySelectorAll('#tuxun .describe');
        describe.forEach(function(element) {
        element.style.color = '#f9c62b';
        element.style.opacity = '0.3';
        });

       elements.forEach(function(element) {
       element.style.backdropFilter = 'none';
       element.style.backgroundColor = 'rgba(150, 114, 110, 0.7)';
});


    }
};

setInterval(waitForElements, 1);

})();