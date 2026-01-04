// ==UserScript==
// @name         Auto Loop Race and Garage
// @namespace    https://singdevelopmentsblog.wordpress.com
// @version      0.1
// @description  Sing Developments has created this script for you to use for personal use. 
// @author       Sing Developments
// @match        https://www.nitrotype.com/*
// @match        https://www.nitrotype.com/
// @icon         https://singdevelopmentsblog.files.wordpress.com/2022/11/nitrotype-logo.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464505/Auto%20Loop%20Race%20and%20Garage.user.js
// @updateURL https://update.greasyfork.org/scripts/464505/Auto%20Loop%20Race%20and%20Garage.meta.js
// ==/UserScript==

function loopScript() {
  // do something
  setTimeout(function() {
    window.location.href = "https://nitrotype.com/garage";
  }, 1800000);

  setTimeout(function() {
    window.location.href = "https://nitrotype.race";
  }, 1800000);

  // call itself again
  setTimeout(loopScript, 3600000); // no loop wait time
}

// start the loop
loopScript();