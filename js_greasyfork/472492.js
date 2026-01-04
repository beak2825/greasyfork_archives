// ==UserScript==
// @name         Widen and Add Padding Claude
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Widen and add padding to specified elements
// @author       Serif789
// @license      MIT
// @match        https://claude.ai/chat*
// @icon         https://www.google.com/s2/favicons?domain=claude.ai
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472492/Widen%20and%20Add%20Padding%20Claude.user.js
// @updateURL https://update.greasyfork.org/scripts/472492/Widen%20and%20Add%20Padding%20Claude.meta.js
// ==/UserScript==

(function() {
  let contentWidth = 1000;
  let minWidth = 1370;
  let paddingOnRight = 1450;

  function applyStyles() {
    let divElements = document.querySelectorAll('div');
    for (let element of divElements) {
      if (element.classList.contains('ReactMarkdown') || element.classList.contains('max-w-[calc(100vw-2rem)]')) {
        element.style.width = contentWidth + 'px';
        element.style.minWidth = minWidth + 'px';
        element.style.margin = '0 auto'; // Center the element horizontally
      }
      if (element.classList.contains('items-end')) {
        element.style.opacity = '0';
        element.style.transform = 'none';
      }
      if (element.classList.contains('col-start-3')) {
        // Calculate the desired right position (100px from the right)
        let desiredRight = window.innerWidth - 100;
        element.style.position = 'relative';
        element.style.right = `calc(100% - ${desiredRight}px)`;
      }
      if (element.classList.contains('gap-y-3')) {
        element.style.paddingLeft = '50px';
      }
    }

    let paddingRightElement = document.querySelector('div.w-screen.inset-0.overflow-y-auto.h-screen');
    if (paddingRightElement) {
      paddingRightElement.style.paddingRight = paddingOnRight + 'px';
    }

    let widthZeroElements = document.querySelectorAll('.w-8');
    widthZeroElements.forEach((element) => {
      element.style.width = '30px'; // Fixed missing 'px' here
    });

    // Find and style the button
    let buttonElement = document.querySelector('button.p-4');
    if (buttonElement) {
      buttonElement.style.visibility = 'hidden';
    }
  }

  // Apply styles when the page is fully loaded
  window.addEventListener('load', applyStyles);

  // Observe changes to the DOM and reapply styles when necessary
  const observer = new MutationObserver((mutationsList, observer) => {
    applyStyles();
  });
  observer.observe(document.body, { subtree: true, childList: true });

  // Add CSS style to remove scroll bar
  GM_addStyle(`
    body {
      overflow: hidden !important;
    }
    ::-webkit-scrollbar {
      width: 0 !important;
    }
  `);
})();
