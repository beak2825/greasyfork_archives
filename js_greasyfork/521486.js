// ==UserScript==
// @name         Anti YT paid promotions
// @namespace    http://tampermonkey.net/
// @version      2024-12-21
// @description  Removes the annoying "Includes paid promotions" popup when hovering over a video.
// @author       404
// @match        https://www.youtube.com/*
// @icon         https://media.istockphoto.com/id/157030584/vector/thumb-up-emoticon.jpg?s=612x612&w=0&k=20&c=GGl4NM_6_BzvJxLSl7uCDF4Vlo_zHGZVmmqOBIewgKg=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521486/Anti%20YT%20paid%20promotions.user.js
// @updateURL https://update.greasyfork.org/scripts/521486/Anti%20YT%20paid%20promotions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// Create a new MutationObserver
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // Check if the mutation is an addition of a new node
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Check if the added node has the class name "ytmPaidContentOverlayHost"
      const paidContentOverlayHost = Array.from(mutation.addedNodes).find(node => node.classList && node.classList.contains('ytmPaidContentOverlayHost'));
      if (paidContentOverlayHost) {
        // Remove the element
        paidContentOverlayHost.remove();
      }
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Continuously check if the element is present in the body
setInterval(function() {
  const paidContentOverlayHost = document.body.getElementsByClassName("ytmPaidContentOverlayHost");
  if (paidContentOverlayHost.length > 0) {
    // Remove the element
    paidContentOverlayHost[0].remove();
  }
}, 100);


})();