// ==UserScript==
// @name        Direct Link/NO href hijack 
// @namespace   Violentmonkey Scripts
// @include     *example.com*
// @grant       none
// @version     1.0
// @author      -
// @description Basically this script prevents the same site from managing the URL redirection whenever you click on link. It basically extracts href/http link and sends it direct to the URLbar. Keep in mind that this most-likely brake some pages, so use just when you just it was appropriate.
// @downloadURL https://update.greasyfork.org/scripts/447834/Direct%20LinkNO%20href%20hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/447834/Direct%20LinkNO%20href%20hijack.meta.js
// ==/UserScript==
// Create event listener for all link clicks

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
          e.preventDefault(); 
    // Retrieve href and store in targetUrl variable
    let targetUrl = e.target.href;
    // Output value of targetUrl to console
    window.open("" + targetUrl,"_self");

  });
});