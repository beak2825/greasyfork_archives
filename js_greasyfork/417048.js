// ==UserScript==
// @name        FlightRising Scrying Helper 2020-11-29
// @description Adds Scrying Workshop related quality-of-life tweaks
// @include     https://www1.flightrising.com/scrying/predict*
// @version     2020.11.29
// @grant       none
// @namespace   original by https://greasyfork.org/users/172627 updated by https://greasyfork.org/en/users/710253-powi-denis
// @downloadURL https://update.greasyfork.org/scripts/417048/FlightRising%20Scrying%20Helper%202020-11-29.user.js
// @updateURL https://update.greasyfork.org/scripts/417048/FlightRising%20Scrying%20Helper%202020-11-29.meta.js
// ==/UserScript==
/* jshint esversion:6 */

// auto updating scrying when drop downs are changed

(function(){
const updateBtn = document.getElementById('scry-button');
// all drop down menus are contained in the .scrying-options container, and the events bubble up
document.querySelector('.scry-options').addEventListener('change', e => {
  if(e.target.matches('select')) {
    updateBtn.click();
  }
});})();