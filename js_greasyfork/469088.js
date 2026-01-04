// ==UserScript==
// @name         Aprove Request Github
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Script for aprove automatic requests in github
// @author       Singularity Chris
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469088/Aprove%20Request%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/469088/Aprove%20Request%20Github.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {

        // Shorcut Ctrl + a
        if (event.ctrlKey && event.key === 'a') {

             //setTimeout(function() {
                // Guardar boton aprove
                //const aproveButton = document.querySelector('a.btn.btn-primary.btn-sm.ml-2');
                 //console.log('aproveButton');
                //aproveButton.click();

             //}, 1250); // 1250 es el tiempo en milisegundos (1.0 segundos)

            setTimeout(function() {
                // Guardar boton aprove
                const reviewButton = document.querySelector('.js-review-changes');
                reviewButton.click();
            }, 500); // 1250 es el tiempo en milisegundos (0.5 segundos)

            setTimeout(function() {
            const radioInput = document.querySelector('input[name="pull_request_review[event]"][value="approve"]');
                  radioInput.click();
            }, 1000); // 1000 es el tiempo en milisegundos (1.0 segundos)

           setTimeout(function() {
               const spanElements = document.querySelectorAll('span.Button-label');
               for(let i = 0; i <= spanElements.length; i++) {
                   if(spanElements[i].innerHTML == 'Submit review') {
                    spanElements[i].click();
                   }
               }
            }, 1500); // 1500 es el tiempo en milisegundos (1.5 segundos)


          } // If event click ctrl + l
    });
    // Your code here...
})();