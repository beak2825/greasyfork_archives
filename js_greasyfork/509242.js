// ==UserScript==
// @name         Netflix Bypass the "Activate extra member to watch now"
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bypass the "Activate extra member to watch now"
// @author       CodePer
// @match        *://*.netflix.com/*
// @icon         https://www.netflix.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509242/Netflix%20Bypass%20the%20%22Activate%20extra%20member%20to%20watch%20now%22.user.js
// @updateURL https://update.greasyfork.org/scripts/509242/Netflix%20Bypass%20the%20%22Activate%20extra%20member%20to%20watch%20now%22.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
// Function to execute when the element is found
function runWhenModalAppears() {
  const modal = document.querySelector('.nf-modal.uma-modal.two-section-uma');
  if (modal) {
    console.log('Modal appeared! Hiding modal to avoid focus-trap errors...');
 
    // Set focus back to a valid element to prevent focus-trap error
    const body = document.querySelector('body');
    if (body) {
      body.focus(); // Move focus to body or any other element
    }
 
      document.querySelectorAll('.nf-modal.uma-modal.two-section-uma').forEach(function(element) {
        console.log('Removing modal element:', element);
        element.remove(); // Safely remove the modal
      });
  }
}
 
// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(function(mutationsList, observer) {
  // Check if the modal appears on the page
  if (document.querySelector('.nf-modal.uma-modal.two-section-uma')) {
    runWhenModalAppears();
    observer.disconnect(); // Stop observing after the element is found
  }
});
 
// Start observing the entire document for child list changes (subtree)
observer.observe(document.body, { childList: true, subtree: true });
 
window.onpopstate = function(event) {
    // Function to execute when the element is found
function runWhenModalAppears() {
  const modal = document.querySelector('.nf-modal.uma-modal.two-section-uma');
  if (modal) {
    console.log('Modal appeared! Hiding modal to avoid focus-trap errors...');
 
    // Set focus back to a valid element to prevent focus-trap error
    const body = document.querySelector('body');
    if (body) {
      body.focus(); // Move focus to body or any other element
    }
 
      document.querySelectorAll('.nf-modal.uma-modal.two-section-uma').forEach(function(element) {
        console.log('Removing modal element:', element);
        element.remove(); // Safely remove the modal
      });
  }
}
 
// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(function(mutationsList, observer) {
  // Check if the modal appears on the page
  if (document.querySelector('.nf-modal.uma-modal.two-section-uma')) {
    runWhenModalAppears();
    observer.disconnect(); // Stop observing after the element is found
  }
});
 
// Start observing the entire document for child list changes (subtree)
observer.observe(document.body, { childList: true, subtree: true });
};
 
 
 
})();