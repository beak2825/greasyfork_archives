// ==UserScript==
// @name         ar5iv tex copy
// @namespace    http://tampermonkey.net/
// @version      2023-12-25
// @description  Click on any equation in ar5iv to copy the tex code to clipboard
// @author       joelsleeba
// @match        https://ar5iv.labs.arxiv.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @license      GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/483099/ar5iv%20tex%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/483099/ar5iv%20tex%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleBlockEquationClick(event) {
  event.stopPropagation();
  const equation = event.target.closest(".ltx_equation")

  if (equation) {
    const mathElements = equation.querySelectorAll("math");
    const altTexts = Array.from(mathElements).map(element => {
      const altText = element.getAttribute("alttext");
      return altText.replace(/\\displaystyle/g, ""); // Remove '\displaystyle'
    });
    const joinedAltText = altTexts.join(" ");
    console.log(joinedAltText);

    // Do something with the joined alt text here, e.g., display it in an alert:
    navigator.clipboard.writeText(joinedAltText)
    .then(() => {
      // Copying succeeded
      console.log("Alt text copied to clipboard");
    })
    .catch(err => {
      // Copying failed, handle the error
      console.error("Failed to copy alt text:", err);
    });
  } else {
    console.log("Clicked element is not within an .ltx_equation");
  }
}

function handleInlineEquationClick(event) {
  event.stopPropagation();
  const equation = event.target.closest("math")

  if (equation) {
    const altText = equation.getAttribute("alttext");
    console.log(altText);

    // Do something with the joined alt text here, e.g., display it in an alert:
    navigator.clipboard.writeText(altText)
    .then(() => {
      // Copying succeeded
      console.log("Alt text copied to clipboard");
    })
    .catch(err => {
      // Copying failed, handle the error
      console.error("Failed to copy alt text:", err);
    });
  } else {
    console.log("Clicked element is not within an .ltx_equation");
  }
}

// Attach the event listener to all descendants of .ltx_equationgroup
document.querySelectorAll(".ltx_equation *").forEach(element => {
  element.addEventListener("click", handleBlockEquationClick);
});

// // Attach the event listener to all descendants of .ltx_Math which are not themselves descendants of .ltx_equation
document.querySelectorAll(".ltx_Math[display='inline']:not(.ltx_equationgroup *) *").forEach(element => {
  element.addEventListener("click", handleInlineEquationClick);
});

})();