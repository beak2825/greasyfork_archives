// ==UserScript==
// @name        New script - poocoin.app
// @namespace   Violentmonkey Scripts
// @match       https://poocoin.app/
// @grant       none
// @version     1.0
// @author      Carlos Wagner
// @description 11/18/2021, 12:56:53 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435701/New%20script%20-%20poocoinapp.user.js
// @updateURL https://update.greasyfork.org/scripts/435701/New%20script%20-%20poocoinapp.meta.js
// ==/UserScript==


var b;
setInterval(() => {
  if (b) {
    b.click();
    setTimeout(() => {
      var value = document.querySelector('span.text-success:nth-child(1)');
      document.title = value.innerHTML;
    }, 10000)  
  } else { 
    b = document.querySelector('.btn-secondary')
  }
}, 15000)