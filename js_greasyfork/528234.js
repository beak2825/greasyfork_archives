// ==UserScript==
// @name         waitForElement
// @namespace    Violentmonkey Scripts
// @version      3.0
// @description  Waits for an element using the MutationObserver API
// @author       maanimis
// @grant        none
// ==/UserScript==

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const ELEMENT = document.querySelector(selector);
    if (ELEMENT) {
      return resolve(ELEMENT);
    }
    console.log("[not found] selector: %s\nwaiting...", selector);
    const observer = new MutationObserver(() => {
      const ELEMENT = document.querySelector(selector);
      if (ELEMENT) {
        console.log("element found!!");
        resolve(ELEMENT);
        observer.disconnect();
      }
    });
    if (timeout && timeout >= 0) {
      setTimeout(() => {
        console.log("timeout reached, element not found: %s", selector);
        resolve(null); // Resolve with null if timeout is reached
        observer.disconnect(); // Disconnect the observer if the timeout occurs
      }, timeout);
    }
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
