// ==UserScript==
// @name         Nitro Type winner.
// @namespace   https://www.youtube.com/watch?v=X5Kby6s86dE&t=6s
// @version      1.0
// @description Nitro
// @match      https://www.nitrotype.com/race/*
// @downloadURL https://update.greasyfork.org/scripts/410968/Nitro%20Type%20winner.user.js
// @updateURL https://update.greasyfork.org/scripts/410968/Nitro%20Type%20winner.meta.js
// ==/UserScript==





var checkExist = setInterval(function() {
   if (document.querySelectorAll(".dash-copy").length) {
      clearInterval(checkExist);
  setTimeout(function(){
  window.location.reload()
}, 1000)

   }
}, 100); //