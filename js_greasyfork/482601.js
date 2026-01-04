// ==UserScript==
// @name         Down Now Checker
// @namespace    lundeen-bryan
// @version      1.0.0
// @description  Tampermonkey menu will show check down now for any site you are trying to reach
// @author       lundeen-bryan
// @match        *://*/*
// @icon         https://downforeveryoneorjustme.com/favicon.ico
// @grant        GM_registerMenuCommand
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/482601/Down%20Now%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/482601/Down%20Now%20Checker.meta.js
// ==/UserScript==

// Register menu command
GM_registerMenuCommand("Check if Site is Down", getDomainName);

// Store the value of the hostname
function getDomainName() {
  const userInput = prompt(
    "Please enter the hostname to check: (e.g., www.example.com"
  );
  if (userInput) {
    // Process the user input (e.g., validate, clean, etc.)
    const cleanedDomain = userInput.trim().toLowerCase();
    var redirect = "https://downforeveryoneorjustme.com/" + cleanedDomain;
    window.location = redirect;
  } else {
    alert("No input provided");
  }
};
