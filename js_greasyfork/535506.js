// ==UserScript==
// @name         MangaMonk Sticky Bar Unsticker And Better Last Uppdates by Sapioit
// @namespace    http://tampermonkey.net/
// @version      v1.3.0.1--2025-05May-10Sat
// @copyright    since 2025, sapioitgmail.com (https://openuserjs.org/users/sapioitgmail.com)
// @description  MangaMonk Sticky Bar Unsticker And Better Last Uppdates by Sapioit!
// @author       Sapioit
// @license      GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @match        https://mangamonk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangamonk.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/535506/MangaMonk%20Sticky%20Bar%20Unsticker%20And%20Better%20Last%20Uppdates%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/535506/MangaMonk%20Sticky%20Bar%20Unsticker%20And%20Better%20Last%20Uppdates%20by%20Sapioit.meta.js
// ==/UserScript==
// @updateURL    https://openuserjs.org/meta/sapioitgmail.com/MangaMonk_Sticky_Bar_Unsticker_And_Better_Last_Uppdates_by_Sapioit.meta.js
// @downloadURL  https://greasyfork.org/scripts/535506-mangamonk-sticky-bar-unsticker-and-better-last-uppdates-by-sapioit/code/MangaMonk%20Sticky%20Bar%20Unsticker%20And%20Better%20Last%20Uppdates%20by%20Sapioit.user.js

(function() {
  'use strict';

  // CSS class name to toggle margin
  const marginClass = 'custom-section-margin';

  // Function to toggle margin style
  function toggleMarginStyle() {
    const isMarginApplied = GM_getValue('marginApplied', false);

    if (!isMarginApplied) {
      // Apply margin
      GM_addStyle(`.${marginClass} { margin: 0 10%; }`);
      document.querySelectorAll('.section .section-body').forEach(el => el.classList.add(marginClass));
      GM_setValue('marginApplied', true);
      console.log('Margin applied: 0 10%; to .section .section-body');
    } else {
      // Remove margin
      document.querySelectorAll('.section .section-body').forEach(el => el.classList.remove(marginClass));
      GM_setValue('marginApplied', false);
      console.log('Margin removed: set to margin: 0; on .section .section-body');
    }
  }

  // Register the context menu command
  GM_registerMenuCommand('Toggle Margin on .section .section-body', toggleMarginStyle);

  // Adds Styles to the affected pages.
  GM_addStyle('.viewer-header.scroll-down, .viewer-header.scroll-up { position: absolute; animation: none; } )');
  //GM_addStyle('.book-detailed-item .thumb { width: 100% !important; display: block !important; height: 600px !important; } )');
  GM_addStyle('.book-detailed-item .thumb { width: 100% !important; display: block !important; } )');
  //GM_addStyle('.book-detailed-item .thumb { height: 600px !important; } )');
  GM_addStyle('.book-detailed-item .thumb img { height: 100% !important; image-rendering: pixelated !important; display: block !important; } )');
  GM_addStyle('.book-detailed-item { display: inline !important; } )');
  GM_addStyle('.book-item { width: 25%; } )');
  GM_addStyle('.container { max-width: none !important; } )');


  // Example:  (This is VERY generic and likely needs to be adapted)
  document.removeEventListener('keydown', function(event) {
    if (event.key === 'a' || event.key === 'd') {
      event.preventDefault(); // Stop default action
      event.stopPropagation(); // Stop propagation
      return false; // Stop further handling
    }
  }, true); // Use capture phase to ensure removal


  document.addEventListener('keydown', function(event) {
    if (event.key === 'a' || event.key === 'd' || event.key === 'A' || event.key === 'D') {
      event.preventDefault(); // Stop default action
      event.stopPropagation(); // Stop propagation
      return false; // Stop further handling
    }
  }, true);


  // Function to preload the image and then resize the element
  function preloadAndResizeImage(element, img) {
    console.log('Preloading image:', img.src);

    const preloadImg = new Image();
    preloadImg.src = img.src;

    preloadImg.onload = function() {
      console.log('Image loaded:', { src: preloadImg.src, naturalWidth: preloadImg.naturalWidth, naturalHeight: preloadImg.naturalHeight });

      const elementWidth = element.clientWidth;
      const aspectRatio = preloadImg.naturalHeight / preloadImg.naturalWidth;
      element.style.height = elementWidth * aspectRatio + 'px';

      console.log('Resized element:', element);
    };

    preloadImg.onerror = function() {
      console.error('Failed to load image:', preloadImg.src);
    };

    // Remove the lazy class from the img element
    img.classList.remove('lazy');
  }

  // Function to observe and handle images
  function observeImages() {
    let elements = document.querySelectorAll('.book-detailed-item .thumb');
    elements.forEach(function(element) {
      let img = element.querySelector('a img');
      if (img) {
        console.log('Observing image:', img.src);
        preloadAndResizeImage(element, img);
        new MutationObserver(() => preloadAndResizeImage(element, img)).observe(img, {
          attributes: true,
          attributeFilter: ['src']
        });
      }
    });
  }

  // Run the function initially
  observeImages();

  // Optionally, observe for new elements added dynamically
  const observer = new MutationObserver(observeImages);
  observer.observe(document.body, { childList: true, subtree: true });

  // Remove the debugger statement if present
  const scriptBlocks = document.querySelectorAll('script');
  scriptBlocks.forEach(script => {
    if (script.innerHTML.includes('debugger')) {
      script.innerHTML = script.innerHTML.replace(/debugger;/g, '');
    }
    if (script.innerHTML.includes('console.clear')) {
      script.innerHTML = script.innerHTML.replace(/console.clear;/g, '');
    }
  });

})();

