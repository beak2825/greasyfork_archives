// ==UserScript==
// @name         Aether Slide
// @namespace    http://tampermonkey.net/
// @version      2025-03-24.1
// @description  try to take over the world!
// @author       You
// @match        https://dpaiext.ntuh.gov.tw/dpai/slide/virtual-slide-box/*
// @icon         https://dpaiext.ntuh.gov.tw/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530718/Aether%20Slide.user.js
// @updateURL https://update.greasyfork.org/scripts/530718/Aether%20Slide.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Script using the CSSStyleSheet API to add blurring effect
(function() {
  // Check if the browser supports constructable stylesheets
  if ('CSSStyleSheet' in window && 'replace' in CSSStyleSheet.prototype) {
    // Create a new stylesheet
    const stylesheet = new CSSStyleSheet();

    // Define the CSS rules
    const cssRules = `
      /* Blur the elements by default */
      div.ag-body-viewport div[comp-id] > div[comp-id],
      .ag-header-row > *
      {


      display: none;
&:nth-child(1), &:nth-child(2), &:nth-child(5){
display: block;

}

&:nth-child(2){width: 240px !important;}
&:nth-child(5){width: 320px !important;}

}

      div.ag-body-viewport div[comp-id] > div[comp-id] {

&:nth-child(5){

        filter: blur(5px);
        transition: filter 0.3s ease;

        /* Show clearly on hover */
      &:hover {
        filter: blur(0);
      }
      }
      }

      
    `;

    // Replace the contents of the stylesheet with our rules
    stylesheet.replace(cssRules)
      .then(() => {
        // Add the stylesheet to the document
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
        console.log('Blur stylesheet has been added using CSSStyleSheet API');
      })
      .catch(err => {
        console.error('Error applying stylesheet:', err);
      });
  } else {
    // Fallback for browsers that don't support constructable stylesheets
    const style = document.createElement('style');
    style.textContent = `
      div.ag-body-viewport div[comp-id] > div[comp-id]:nth-child(5) {
        filter: blur(5px);
        transition: filter 0.3s ease;
      }

      div.ag-body-viewport div[comp-id] > div[comp-id]:nth-child(5):hover {
        filter: blur(0);
      }
    `;
    document.head.appendChild(style);
    console.log('Blur stylesheet has been added using fallback method');
  }
})();
    // Your code here...
})();