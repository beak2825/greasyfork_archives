// ==UserScript==
// @name         Neodice Remove Particles
// @namespace    http://neodice.ga/
// @version      0.1
// @description  Removes particles from the Neodice.ga background
// @author       smeagol
// @match        http://neodice.ga/
// @grant        none
// @copyright   2015+, smeagol
// @require     http://code.jquery.com/jquery-latest.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/12687/Neodice%20Remove%20Particles.user.js
// @updateURL https://update.greasyfork.org/scripts/12687/Neodice%20Remove%20Particles.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('.particles-js-canvas-el').css('display', 'none');
});
