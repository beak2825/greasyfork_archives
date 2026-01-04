// ==UserScript==
// @name         SoftArchive URLs Fix
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      2.1
// @run-at       document-end
// @description  Clean up SoftArchive links by removing anonymizers, decoding hidden URLs, and fixing figure images.
// @author       JRem
// @match        https://softarchive.is/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=softarchive.is
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531070/SoftArchive%20URLs%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/531070/SoftArchive%20URLs%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Function to clean up specific links
  function cleanLinks() {
    document.querySelectorAll('a').forEach(link => {
      let url = link.href;

      // Handle anonymz.com links
      if (/https?:\/\/(www\.)?anonymz\.com\/\?/i.test(url)) {
        url = url.replace(/https?:\/\/(www\.)?anonymz\.com\/\?/i, '');
        link.href = url;
        link.textContent = url;
        link.removeAttribute('class');
        link.removeAttribute('rel');
      }

      // Handle /confirm/url/ Base64-encoded links
      if (url.includes('/confirm/url/')) {
        let base64Part = url.split('/confirm/url/')[1].replace(/\/$/, ''); // Remove trailing slash
        try {
          let decodedUrl = decodeURIComponent(decodeURIComponent(atob(base64Part))); // Double decode
          link.href = decodedUrl;
          link.textContent = decodedUrl;
          link.removeAttribute('class');
          link.removeAttribute('rel');
        } catch (e) {
          console.warn('Failed to decode URL:', url);
        }
      }
    });
  }

  // Function to remove <a> but keep <img> inside <figure>
function unwrapFigureImages() {
  // Unwrap <a> wrapping <figure>
  document.querySelectorAll('a > figure').forEach(figure => {
    const anchor = figure.parentElement;
    if (anchor && anchor.tagName.toLowerCase() === 'a') {
      anchor.replaceWith(figure);
    }
  });

  // Remove <a> inside <figure> but keep all its children
  document.querySelectorAll('figure a').forEach(anchor => {
    // Replace <a> with all its child nodes
    const parent = anchor.parentNode;
    // Clone all children to insert before
    Array.from(anchor.childNodes).forEach(child => {
      parent.insertBefore(child, anchor);
    });
    // Remove the <a> itself
    anchor.remove();
  });
}

  // Run on page load
  cleanLinks();
  unwrapFigureImages();
})();
