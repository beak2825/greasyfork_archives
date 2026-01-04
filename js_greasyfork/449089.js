// ==UserScript==
// @name         GitHub Label Keyboard Shortcuts
// @namespace    https://intuitiveexplanations.com/
// @version      2.0.1
// @description  Add keyboard shortcuts for adding and removing labels on GitHub
// @author       Radon Rosborough
// @match        https://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449089/GitHub%20Label%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/449089/GitHub%20Label%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const tryUntilSuccess = (fn, totalTimeout, delay) => {
    return new Promise((resolve, reject) => {
      try {
        fn();
      } catch (err) {
        if (totalTimeout <= 0) {
          reject(err);
        } else {
          setTimeout(
            () =>
              tryUntilSuccess(fn, totalTimeout - delay, delay)
                .then(resolve)
                .catch(reject),
            delay,
          );
        }
        return;
      }
      resolve();
    });
  };

  const setLabelsMenuVisibility = (desiredState) => {
    if (document.getElementById("labels-select-menu").open !== desiredState) {
      document
        .getElementById("labels-select-menu")
        .querySelector("summary")
        .click();
    }
  };

  const setLabelPresence = (label, desiredState) => {
    const elt = document.querySelector(
      "form[aria-label='Apply labels'] label[data-prio-filter-value='waiting on response']",
    );
    if (elt.getAttribute("aria-checked") !== "" + desiredState) {
      elt.click();
    }
  };

  const shortcuts = [
    {
      matcher: (event) => {
        return (
          event.key === ";" && event.altKey && !event.ctrlKey && !event.metaKey
        );
      },
      label: "waiting on response",
      desiredState: true,
    },
    {
      matcher: (event) => {
        return (
          event.key === ":" && event.altKey && !event.ctrlKey && !event.metaKey
        );
      },
      label: "waiting on response",
      desiredState: false,
    },
  ];

  document.addEventListener("keydown", (event) => {
    for (const shortcut of shortcuts) {
      if (shortcut.matcher(event)) {
        setLabelsMenuVisibility(true);
        tryUntilSuccess(
          () => setLabelPresence(shortcut.label, shortcut.desiredState),
          1000,
          10,
        ).then(() => {
          setLabelsMenuVisibility(false);
          window.scrollTo(0, document.body.scrollHeight);
        });
        break;
      }
    }
  });
})();
