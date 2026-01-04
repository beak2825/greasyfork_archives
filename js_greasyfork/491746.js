// ==UserScript==
// @name         Full Height GitHub PR Status List
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  removes the max height of the merge status list in Github PRs to display all the checks without scrolling.
// @author       Othman Shareef (othmanosx@gmail.com)
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491746/Full%20Height%20GitHub%20PR%20Status%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/491746/Full%20Height%20GitHub%20PR%20Status%20List.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const elementSelector = '[aria-label="Checks"] [class^="MergeBoxExpandable-module__expandableContent"]';

  const timers = new Map();

  const waitForSelector = (selector = '', options = { timeout: 1000 }) => {
    return new Promise((resolve, reject) => {
      // Create a key from the selector and the optional id
      const key = selector;

      // Clear the existing timer for the key (if any)
      const existingTimer = timers.get(key);
      if (existingTimer) {
        clearInterval(existingTimer);
      }

      const startTime = Date.now();
      const timer = setInterval(() => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            clearInterval(timer);
            timers.delete(key);
            resolve(element);
          } else if (Date.now() - startTime >= options.timeout) {
            clearInterval(timer);
            timers.delete(key);
            reject(new Error('Timeout ' + key));
          }
        } catch (error) {
          clearInterval(timer);
          timers.delete(key);
          reject(new Error('Invalid selector: ' + selector));
        }
      }, 100);

      // Store the new timer
      timers.set(key, timer);
    });
  };

  const removeMaxHeight = async () => {
    try {
      await waitForSelector(elementSelector);
      const checksList = document.querySelector(elementSelector);
      checksList.style.maxHeight = 'none';
      checksList.parentElement.style.maxHeight = 'none';

    } catch (error) {
      console.error(error);
    }
  };

  const observer = new MutationObserver(removeMaxHeight);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
