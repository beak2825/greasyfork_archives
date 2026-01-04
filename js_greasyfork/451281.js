// ==UserScript==
// @name         NH Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script adds NH quick code button to Argus Decision Tree.
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://argus.aka.amazon.com/
// @icon         https://img.icons8.com/color/48/000000/double-right--v1.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451281/NH%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/451281/NH%20Button.meta.js
// ==/UserScript==

 'use strict';

 window.addEventListener('load', () => {

 var divCheckingInterval = setInterval(function(){

    if(document.querySelector("#dtQuickCodesUp")){

        if(document.querySelector("#nhbtn") === null){

         document.querySelector('.dt-summary-subheader').innerHTML += '<button id="nhbtn" class="md-raised md-hue-2 md-button md-dg-theme layout-align-center-center layout-row" style="margin: 0 auto; margin-bottom: 10px;"> Classify as NH </button>';

         document.getElementById("nhbtn").onclick = function() {myFunction()};

         function myFunction() {

         document.querySelector('.submit-product-card-classification').click();

         setTimeout(function(){
         document.querySelector('.dt-dg-answer-selectWorkflow-battery').click();
         }, 200);

         setTimeout(function(){
         document.getElementById('dt-list-select-300-ni-mh').click();
         }, 400);

       }
      }
     }
});


})();