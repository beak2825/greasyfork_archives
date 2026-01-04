// ==UserScript==
// @name         Show Eligible Bonus [[xXx MITY DEV xXx]]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to show Eligible Bonus before 1 thousand satoshis. Support me by registering with my ref code: https://freebitco.in/?r=10071414 .
// @author       MiTyDEV
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470491/Show%20Eligible%20Bonus%20%5B%5BxXx%20MITY%20DEV%20xXx%5D%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/470491/Show%20Eligible%20Bonus%20%5B%5BxXx%20MITY%20DEV%20xXx%5D%5D.meta.js
// ==/UserScript==

//Support me by registering with my ref code: https://freebitco.in/?r=10071414 .
$(document).ready(function(){
  $("#bonus_eligible_msg").css("display", "block");
});