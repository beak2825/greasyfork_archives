// ==UserScript==
// @name         Rebrickable Dark Mode
// @namespace    https://fairburn.dev/
// @version      1.3.2
// @description  Enable dark mode on rebrickable.com regardless of your account plan.
// @author       Garrett Fairburn
// @license      Apache-2.0
// @match        https://rebrickable.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rebrickable.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475309/Rebrickable%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/475309/Rebrickable%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Call callback on the child element of parent that passes predicate.
  // If no children pass predicate, attach a MutationObserver to parent
  // that waits until an added child passes predicate and call callback
  // on it.
  function callOnceChildExists(parent, predicate, callback) {
    // First check if the target child element already exists.
    for (const child of parent.childNodes.values()) {
      if (child.nodeType === Node.ELEMENT_NODE && predicate(child)) {
        // If it does, call callback on it and return early.
        callback(child);
        return;
      }
    }

    // If the target child element doesn't already exist, attach a
    // MutationObserver that waits for it to be added.
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        for (const child of mutation.addedNodes) {
          if (child.nodeType === Node.ELEMENT_NODE && predicate(child)) {
            callback(child);

            // Observer has served its purpose, so disconnect it.
            observer.disconnect();
            return;
          }
        }
      }
    }).observe(parent, {
      // Only interested in modifications to immediate child list,
      // not attributes or sub-children.
      childList: true,
    });
  }

  // Body element may or may not already exist at this point,
  // so use callOnceChildExists.
  callOnceChildExists(
    // Target element is the body element of the root HTML element.
    document.documentElement,
    (child) => child.tagName === 'BODY',

    // Callback function to enable dark mode on a given body element.
    (body) => {
      // Apply dark mode CSS to body.
      body.classList.add('dark-mode');

      // Wrapper element inside body may or may not already exist at this
      // point, so use callOnceChildExists.
      callOnceChildExists(
        // Target element is the child of body with id "wrapper".
        body,
        (child) => child.id === 'wrapper',

        // Callback function to update state of dark mode toggle switch for
        // consistency if it exists.
        (wrapper) => {
          const checkbox = wrapper.querySelector('.js-toggle-dark-mode input');
          if (checkbox !== null) {
            checkbox.checked = true;
          }
        },
      );
    },
  );
})();
