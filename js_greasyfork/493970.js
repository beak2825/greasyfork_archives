// ==UserScript==
// @name         Calculator English version
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  just a calculator to do division
// @author       LongName
// @match        https://agma.io
// @match        https://www.youtube.com
// @match        https://www.roblox.com/home
// @match        https://www.chess.com
// @match        https://github.com
// @match        https://adblockplus.org
// @icon         https://cdn-icons-png.flaticon.com/512/4374/4374752.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493970/Calculator%20English%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/493970/Calculator%20English%20version.meta.js
// ==/UserScript==

   (function() {
       'use strict';
// you can actually add websites right at the top by adding following // @match        https://exemple.com/.fr/.io

// this program calculates the quotient of 2 integers entered by the user

   let dividend;
   let divider;
   let quotient = 1;

   console.log(dividend);

   dividend = Number.parseInt(prompt("seize the entire dividend", "0"));
   divider = Number.parseInt(prompt("seize the entire divider ", "1"));
   quotient = dividend / divider;

   alert("the quotient is "+quotient+".");

   console.log(`the quotient is ${quotient}.`);

})();