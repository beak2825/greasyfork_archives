// ==UserScript==
// @name         Voxiom.io Fake Gems
// @namespace    http://tampermonkey.net/
// @license MIT 
// @version      0.13
// @description  Change the gems in your account for Youtube purposes
// @author       You
// @match        https://voxiom.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480912/Voxiomio%20Fake%20Gems.user.js
// @updateURL https://update.greasyfork.org/scripts/480912/Voxiomio%20Fake%20Gems.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let inp = prompt('How many gems do you want?');
    var x = document.getElementById("myDIV");
    x.querySelector(".sc-ihINtW lfRlMR").innerHTML = "inp";
})();