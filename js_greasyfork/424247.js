// ==UserScript==
// @name        Copy URL Buttons in Google Search Results
// @namespace   https://wpdevdesign.com/
// @match       *://*.google.*/search?*
// @grant       none
// @version     1.0.1
// @author      Abdelouahed Errouaguy & Sridhar Katakam
// @description Makes copying links from google search results faster by adding 1-click copy buttons next to the results
// @downloadURL https://update.greasyfork.org/scripts/424247/Copy%20URL%20Buttons%20in%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/424247/Copy%20URL%20Buttons%20in%20Google%20Search%20Results.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  'use strict';
  
  // Function to copy the passed string to clipboard.
  function copyToClipboard(event) {
    let helper = document.createElement('input');

    document.body.appendChild(helper);
    helper.value = this.value;
    helper.select();
    document.execCommand('copy');
    this.textContent = "Copied ✓";
    helper.remove();
  
    event.preventDefault();
    event.stopPropagation();
  }

  document.querySelectorAll('.wsn-google-focused-link > a, .yuRUbf > div a').forEach(el => {
    let href = el.href;
    let button = document.createElement("button");
    button.textContent = "Copy URL";
    button.value = href;
    button.style.cssText = "cursor: pointer; margin-left: 10px; border-radius: 12px; padding: 4px 12px; border: 1px solid #ccc; font-size: 12px; position: absolute;";
    button.addEventListener("click", copyToClipboard);
    
    el.querySelector("h3").appendChild(button);
  });
})();