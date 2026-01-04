// ==UserScript==
// @name         PlantNet Paste Image
// @namespace    vinz3210.gg
// @version      1.0
// @license      MIT
// @author       vinz3210
// @description  Inject code to handle paste event for PlantNet
// @match        https://identify.plantnet.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526090/PlantNet%20Paste%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/526090/PlantNet%20Paste%20Image.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('paste', async e => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const blob = items[i].getAsFile(); // Get the pasted image as a Blob
        if (blob) {
          const file = new File([blob], "pasted_image.png", { type: blob.type }); // Create a File object
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          document.getElementById("file").files = dataTransfer.files;
          // Optionally, trigger a change event if needed
          const event = new Event('change', { bubbles: true });
          document.getElementById("file").dispatchEvent(event);
          break; // Stop after the first image is pasted (if you only want to handle one)
        }
      }
    }
  });
})();