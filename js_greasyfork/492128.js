// ==UserScript==
// @name         AutoContinue
// @namespace    https://selfboot.cn
// @version      0.1
// @description  Automatically clicks the 'Continue generating' button on ChatGPT after it appears and waits for 1 second.
// @author       selfboot
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/492128/AutoContinue.user.js
// @updateURL https://update.greasyfork.org/scripts/492128/AutoContinue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
      // Find the button of 'Continue generating'
      [...document.querySelectorAll("button.btn")].forEach((btn) => {
        if (btn.innerText.includes("Continue generating")) {
          console.log("Found the button of 'Continue generating'");
          setTimeout(() => {
            console.log("Clicked it to continue generating after 1 second");
            btn.click();
          }, 1000);
        }
      });
    });

    // Start observing the dom change of the form
    observer.observe(document.forms[0], {
      attributes: false,
      childList: true,
      subtree: true,
    });
})();
