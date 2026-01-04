// ==UserScript==
// @name         Soulgen AI Blur Remover
// @namespace    soulgen-ai-blur-remover
// @version      1.3
// @description  Remove blur paywall for images in Soulgen AI
// @match        https://www.soulgen.ai/*
// @match        https://www.soulgen.net/*
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/465758/Soulgen%20AI%20Blur%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465758/Soulgen%20AI%20Blur%20Remover.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create a floating button to trigger the delete code
  var button = document.createElement('button');
  button.innerText = 'Remove Blur';
  button.className = "flex-1 xl:min-w-[128px] relative ml-2 xl:ml-4 btn h-10 min-h-[40px] bg-colorful rounded-full px-4 tracking-[0.4px] whitespace-nowrap";
  button.style.position = 'fixed';
  button.style.right = '20px';
  button.style.bottom = '20px';
  button.style.zIndex = '9999';
  document.body.appendChild(button);

  // Create a floating button to trigger the delete code
  var button2 = document.createElement('button');
  button2.innerText = 'Download';
  button2.className = "flex-1 xl:min-w-[128px] relative ml-2 xl:ml-4 btn h-10 min-h-[40px] bg-colorful rounded-full px-4 tracking-[0.4px] whitespace-nowrap";
  button2.style.position = 'fixed';
  button2.style.right = '20px';
  button2.style.bottom = '70px';
  button2.style.zIndex = '9999';
  document.body.appendChild(button2);

  // Add a click event listener to the button
  button.addEventListener('click', function() {
    deleteElements();
  });

  // Add a click event listener to the button
  button2.addEventListener('click', function() {
    download();
  });

  // Function to delete elements with classes that end with "backdrop-filter" or "abs-center"
  function deleteElements() {
    document.querySelectorAll('[class$="backdrop-filter"]').forEach(function(element) {
      element.remove();
    });

    document.querySelectorAll('[class$="modal-close"]').forEach(function(element) {
      element.remove();
    });

    document.querySelectorAll('.abs-center').forEach(function(element) {
      element.remove();
    });
  }

  function download() {
        const images = document.querySelectorAll('img[alt="soulgen ai"]');
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'soulgen-ai-image-' + i + '.' + img.src.split('.').pop();
            link.click();
        }
  }
})();