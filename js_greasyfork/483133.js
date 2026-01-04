// ==UserScript==
// @name         Stackexchange TeX copy
// @namespace    http://tampermonkey.net/
// @version      2023-12-26
// @description  Copy TeX code from stackexchange sites by clicking on equations
// @author       joelsleeba
// @match        https://math.stackexchange.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @license      AGPL v3
// @downloadURL https://update.greasyfork.org/scripts/483133/Stackexchange%20TeX%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/483133/Stackexchange%20TeX%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function handleEquationClick(event) {
  event.stopPropagation();
  const equation = event.target.closest(".math-container")

  if (equation) {
    // Wikipedia nicely packs a single <math> element inside each .mwe-math-element classes
    const mathScript = equation.querySelector("script[type='math/tex']");
    const tex = mathScript.innerText
    console.log(tex);

    // Do something with the joined alt text here, e.g., display it in an alert:
    navigator.clipboard.writeText(tex)
    .then(() => {
      // Copying succeeded
      console.log("TeX copied to clipboard");
    })
    .catch(err => {
      // Copying failed, handle the error
      console.error("Failed to copy TeX :", err);
    });
  } else {
    console.log("Clicked element is not within an .mwe-math-element");
  }
}

// // Attach the event listener to all descendants of .ltx_Math which are not themselves descendants of .ltx_equation
document.querySelectorAll(".math-container *").forEach(element => {
  element.addEventListener("click", handleEquationClick);
});

})();