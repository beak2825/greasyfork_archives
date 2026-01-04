// ==UserScript==
// @name         Slack Allow HTTP OAuth urls
// @description  A simple script that lets you bypass the slack restriction of only allowing https oauth urls
// @license      MIT
// @namespace    https://tangled.sh/@dunkirk.sh/bunplayground/slack-http-allowed
// @version      0.1
// @description
// @author       Kieran Klukas
// @match        https://api.slack.com/apps/*/oauth*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540060/Slack%20Allow%20HTTP%20OAuth%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/540060/Slack%20Allow%20HTTP%20OAuth%20urls.meta.js
// ==/UserScript==

(() => {
  // Track HTTP inputs to avoid redundant processing
  const httpInputs = new Set();

  // Add CSS to style the editor table layout
  function addCustomStyles() {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .p-url_table_editor__actions {
        width: 176px !important;
      }
      .p-url_table_editor__fields {
        width: calc(100% - 176px) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function watchForHTTPEntries() {
    const urlInputs = document.querySelectorAll(
      "[data-url-table-editor-input]",
    );

    // Add event listeners to each input field that doesn't already have one
    for (const input of urlInputs) {
      if (input.hasHttpListener) continue;

      input.hasHttpListener = true;
      input.addEventListener("input", function () {
        const row = this.closest("[data-row]");
        if (!row) return;

        const saveButton = row.querySelector(
          '[data-js-url-editor="save-create"]',
        );
        if (!saveButton) return;

        // Check if input contains http:// (non-https URL)
        if (this.value.trim().startsWith("http://")) {
          // Make the button sassy and green
          saveButton.classList.remove("disabled");
          saveButton.removeAttribute("disabled");
          saveButton.textContent = "add 😈";

          // Add to tracking set
          httpInputs.add(this);
        } else {
          // Reset to default state if not http://
          saveButton.textContent = "Add";

          // Remove from tracking set
          httpInputs.delete(this);

          // Only re-disable if empty (assuming that's the original logic)
          if (!this.value.trim()) {
            saveButton.classList.add("disabled");
            saveButton.setAttribute("disabled", "");
          }
        }
      });
    }
  }

  // Function to specifically fix HTTP buttons that might have been disabled
  function fixHttpButtons() {
    // Only process inputs we know have HTTP URLs
    for (const input of httpInputs) {
      if (!input.value.trim().startsWith("http://")) {
        httpInputs.delete(input);
        continue;
      }

      const row = input.closest("[data-row]");
      if (!row) {
        httpInputs.delete(input);
        continue;
      }

      const saveButton = row.querySelector(
        '[data-js-url-editor="save-create"]',
      );
      if (!saveButton) {
        httpInputs.delete(input);
        continue;
      }

      // Force the button to stay enabled
      saveButton.classList.remove("disabled");
      saveButton.removeAttribute("disabled");
      saveButton.textContent = "add 😈";
    }
  }

  // Watch for attribute changes on buttons to detect when they're disabled again
  function watchButtonAttributes() {
    const buttonObserver = new window.MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "disabled" ||
            mutation.attributeName === "class")
        ) {
          const button = mutation.target;
          const row = button.closest("[data-row]");
          if (!row) continue;

          const input = row.querySelector("[data-url-table-editor-input]");
          if (!input || !input.value.trim().startsWith("http://")) continue;

          // This is an HTTP input with a button that was just disabled
          // Re-enable it immediately
          if (
            button.classList.contains("disabled") ||
            button.hasAttribute("disabled")
          ) {
            button.classList.remove("disabled");
            button.removeAttribute("disabled");
            button.textContent = "add 😈";
          }
        }
      }
    });

    // Observe all save buttons for attribute changes
    const saveButtons = document.querySelectorAll(
      '[data-js-url-editor="save-create"]',
    );
    for (const button of saveButtons) {
      buttonObserver.observe(button, { attributes: true });
    }

    return buttonObserver;
  }

  // Run the CSS additions immediately
  addCustomStyles();

  // Run the function immediately
  watchForHTTPEntries();
  fixHttpButtons();
  const buttonObserver = watchButtonAttributes();

  // Then run it again after a delay to ensure DOM is fully loaded
  setTimeout(() => {
    watchForHTTPEntries();
    fixHttpButtons();
  }, 1000);

  // Run the button fix less frequently to reduce browser lag
  setInterval(fixHttpButtons, 1000);

  // Observer for new inputs
  const inputObserver = new window.MutationObserver((mutations) => {
    // Throttle the observer callback
    if (inputObserver.isProcessing) return;
    inputObserver.isProcessing = true;

    setTimeout(() => {
      let hasNewInputs = false;
      let hasNewButtons = false;

      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          hasNewInputs = true;

          // Check if any new save buttons were added
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
              // Node.ELEMENT_NODE is 1
              const newButtons = node.querySelectorAll
                ? node.querySelectorAll('[data-js-url-editor="save-create"]')
                : [];
              if (newButtons.length > 0) hasNewButtons = true;
            }
          }
        }
      }

      if (hasNewInputs) {
        watchForHTTPEntries();
      }

      if (hasNewButtons) {
        // Observe any new buttons
        const newSaveButtons = document.querySelectorAll(
          '[data-js-url-editor="save-create"]',
        );
        for (const button of newSaveButtons) {
          if (!button.hasAttributeObserver) {
            buttonObserver.observe(button, { attributes: true });
            button.hasAttributeObserver = true;
          }
        }
      }

      fixHttpButtons();
      inputObserver.isProcessing = false;
    }, 200);
  });

  // Start observing the document with fewer things to watch
  inputObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
