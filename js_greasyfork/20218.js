// ==UserScript==
// @name         Poloniex ShillBreaker
// @namespace    https://poloniex.com/*
// @version      0.5
// @description  Poloniex ShillsAreRekt
// @author       You
// @match        https://poloniex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20218/Poloniex%20ShillBreaker.user.js
// @updateURL https://update.greasyfork.org/scripts/20218/Poloniex%20ShillBreaker.meta.js
// ==/UserScript==
function step(timestamp) {

$('.reputation.r00').closest('tr').hide();
                  
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);