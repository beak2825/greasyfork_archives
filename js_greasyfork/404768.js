// ==UserScript==
// @name         Simkl Search Click
// @namespace    https://www.imdb.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://simkl.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404768/Simkl%20Search%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/404768/Simkl%20Search%20Click.meta.js
// ==/UserScript==

(function () {
'use strict';
var refreshIntervalId = setInterval(function(){
    if(window.history.length <= 2)
        if(document.getElementsByClassName("tr")[1]) {
document.getElementsByClassName("tr")[1].click()
        }
   /* if(document.getElementsByClassName('simkltvsearchnoresults')[0].textContent === "No results") {
      window.location.href = document.getElementsByClassName('simkltvsearchfieldsinput')[0].getAttribute('data-search');
    // window.history.back();
            clearInterval(refreshIntervalId);
    } */
clearInterval(refreshIntervalId);
}, 1000);
})();



