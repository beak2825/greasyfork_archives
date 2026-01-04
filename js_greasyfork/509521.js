// ==UserScript==
// @name         infinte craft recipe cheat
// @namespace    http://greasyfork.org
// @version      1.1
// @description  Overlay a search bar for infinibrowser.wiki to find item recipes quickly
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509521/infinte%20craft%20recipe%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/509521/infinte%20craft%20recipe%20cheat.meta.js
// ==/UserScript==

// Create and append the overlay element
const overlay = document.createElement('div');
overlay.id = 'infinibrowser-overlay';
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background-color: white;
  border-right: 2px solid #333;
  z-index: 9999;
  display: none;
`;
document.body.appendChild(overlay);

// Create and append the iframe
const iframe = document.createElement('iframe');
iframe.style.cssText = `
  width: 100%;
  height: 100%;
  border: none;
`;
overlay.appendChild(iframe);

// Function to show the overlay
function showOverlay(searchTerm) {
  iframe.src = `https://infinibrowser.wiki/item/${encodeURIComponent(searchTerm)}`;
  overlay.style.display = 'block';
}

// Function to hide the overlay
function hideOverlay() {
  overlay.style.display = 'none';
}

// Event listener for 'a' key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'a' || event.key === 'A') {
    const searchTerm = prompt('Enter a search term:');
    if (searchTerm) {
      showOverlay(searchTerm);
    }
  }
});

// Event listener for Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    hideOverlay();
  }
});
