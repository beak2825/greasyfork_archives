// ==UserScript==
// @name         Mass Calculation Script
// @namespace    Mass Calculation Script
// @version      0.3.0
// @description  Automatically do mass calculations
// @author       Sami
// @license      MIT
// @match        https://goodcalculators.com/big-number-calculator/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417317/Mass%20Calculation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/417317/Mass%20Calculation%20Script.meta.js
// ==/UserScript==

(function() {
  'use strict';

   window.setTimeout(function() {
       var inputA = document.querySelector('#Aval');
       var inputB = document.querySelector('#Bval');

       

       var startedAt = Date.now();
       var counter = 0;
       var result = 2;
       while (Date.now() - startedAt < 1000) {
           inputA.value = result;
           inputB.value = 2;

           // fnAdd(), fnSub(), fnMul(), fnPow() ...
           fnMul();

           result = document.querySelector('.resultBlock .notes p').innerText;

           if (result) {
               counter++;
           }
       }
       alert('Number of calculations done in 1 second: ' + counter);
   }, 2000);


   console.log('Mass calculator script initiated');

})();