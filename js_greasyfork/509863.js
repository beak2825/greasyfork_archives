// ==UserScript==
// @name         V2EX Login State Toggle
// @version      1.0
// @description  尽可能避免增加账号的活跃度
// @match        *://*.v2ex.com/*
// @author       Wanten
// @copyright    2024 Wanten
// @license      MIT
// @supportURL   https://github.com/WantenMN/v2ex-userscripts/issues
// @icon         https://v2ex.com/favicon.ico
// @homepageURL  https://github.com/WantenMN/v2ex-userscripts
// @namespace    https://greasyfork.org/en/scripts/509863
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509863/V2EX%20Login%20State%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/509863/V2EX%20Login%20State%20Toggle.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Create floating button
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "7px";
  button.style.borderRadius = "25px";
  button.style.cursor = "pointer";

  // Function to get value of A2 cookie
  function getA2CookieValue() {
    const matches = document.cookie.match(/(?:^|; )A2=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  // Function to check if A2 cookie exists
  function hasA2Cookie() {
    return !!getA2CookieValue();
  }

  // Function to remove A2 cookie
  function removeA2Cookie() {
    document.cookie =
      "A2=; domain=.v2ex.com; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Function to set A2 cookie (restoring value from localStorage)
  function setA2Cookie(value) {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    document.cookie = `A2=${value}; domain=.v2ex.com; expires=${expirationDate.toUTCString()}; path=/;`;
  }

  // Function to update button color
  function updateButtonColor() {
    if (hasA2Cookie()) {
      button.style.backgroundColor = "green";
      button.style.border = "2px solid darkgreen";
    } else {
      button.style.backgroundColor = "yellow";
      button.style.border = "2px solid darkorange";
    }
  }

  // Initialize button color
  updateButtonColor();

  // Add click event listener
  button.addEventListener("click", () => {
    if (hasA2Cookie()) {
      // If A2 cookie exists, save its value to localStorage and remove the cookie
      const a2Value = getA2CookieValue();
      localStorage.setItem("A2", a2Value);
      removeA2Cookie();
    } else {
      // If A2 cookie doesn't exist, check localStorage
      const storedA2Value = localStorage.getItem("A2");
      if (storedA2Value) {
        // If found in localStorage, restore the cookie and remove it from localStorage
        setA2Cookie(storedA2Value);
        localStorage.removeItem("A2");
      } else {
        // If not found in localStorage, do nothing
        return;
      }
    }
    // Refresh the page
    window.location.reload();
  });

  // Add button to page
  document.body.appendChild(button);
})();
