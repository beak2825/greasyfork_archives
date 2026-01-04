// ==UserScript==
// @name         V2EX Domain Switcher
// @version      1.1
// @description  尽可能避免增加账号的活跃度 (已弃用)
// @match        *://*.v2ex.com/*
// @match        *://*.v2ex.co/*
// @author       Wanten
// @copyright    2024 Wanten
// @license      MIT
// @supportURL   https://github.com/WantenMN/v2ex-userscripts/issues
// @icon         https://v2ex.com/favicon.ico
// @homepageURL  https://github.com/WantenMN/v2ex-userscripts
// @namespace    https://greasyfork.org/en/scripts/509836
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509836/V2EX%20Domain%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/509836/V2EX%20Domain%20Switcher.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Create floating button
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "7px";
  button.style.border = "black 2px solid";
  button.style.borderRadius = "25px";
  button.style.cursor = "pointer";

  // Function to get clean domain (without www)
  function getCleanDomain(domain) {
    return domain.replace(/^www\./, "");
  }

  // Set button color and border based on current clean domain
  const currentCleanDomain = getCleanDomain(window.location.hostname);
  if (currentCleanDomain === "v2ex.com") {
    button.style.backgroundColor = "green";
    button.style.border = "2px solid darkgreen"; // Border color for green
  } else if (currentCleanDomain === "global.v2ex.co") {
    button.style.backgroundColor = "yellow";
    button.style.border = "2px solid darkorange"; // Border color for yellow
  }

  // Add click event listener
  button.addEventListener("click", () => {
    const newDomain =
      currentCleanDomain === "v2ex.com" ? "global.v2ex.co" : "v2ex.com";
    const newUrl = new URL(window.location.href);
    newUrl.hostname = newDomain;
    window.location.href = newUrl.toString();
  });

  // Add button to page
  document.body.appendChild(button);
})();
