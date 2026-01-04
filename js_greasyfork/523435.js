// ==UserScript==
// @name         NovelAI Super Generate
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Demonstrates page transformation with temporary hiding
// @author       You
// @match        https://novelai.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523435/NovelAI%20Super%20Generate.user.js
// @updateURL https://update.greasyfork.org/scripts/523435/NovelAI%20Super%20Generate.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isProcessing = false;

  // Add new functions at the start
  function createSettingsButton() {
    const button = document.createElement("button");
    button.textContent = "⚙️";
    button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 5px 10px;
            border-radius: 5px;
            background: #2b2d42;
            color: white;
            border: 1px solid #666;
            cursor: pointer;
        `;

    const dialog = createSettingsDialog();
    button.addEventListener("click", () => (dialog.style.display = "flex"));
    document.body.appendChild(button);
  }

  function createSettingsDialog() {
    const dialog = document.createElement("div");
    dialog.id = "nai-settings-dialog";
    dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        `;

    const content = document.createElement("div");
    content.style.cssText = `
            background: #2b2d42;
            padding: 20px;
            border-radius: 10px;
            min-width: 300px;
        `;

    const textbox = document.createElement("textarea");
    textbox.style.cssText = `
            width: 100%;
            min-height: 100px;
            margin: 10px 0;
            background: #1a1b2e;
            color: white;
            border: 1px solid #666;
            padding: 8px;
        `;
    textbox.value = GM_getValue("naiTransformText", "");
    textbox.addEventListener("input", () => {
      GM_setValue("naiTransformText", textbox.value);
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.cssText = `
            padding: 5px 15px;
            background: #444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
    closeButton.addEventListener(
      "click",
      () => (dialog.style.display = "none")
    );

    content.appendChild(document.createTextNode("Transform Text:"));
    content.appendChild(textbox);
    content.appendChild(closeButton);
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    return dialog;
  }

  // Function to wait for an element to appear
  function waitForElement(selector) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  function waitForElementByText(text, elementType = "button") {
    return new Promise((resolve) => {
      const checkForElement = () => {
        const elements = document.getElementsByTagName(elementType);
        for (const element of elements) {
          if (element.textContent.includes(text)) {
            return element;
          }
        }
        return null;
      };

      const element = checkForElement();
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver((mutations) => {
        const element = checkForElement();
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  // Main function to handle the button transformation
  let newButtons = [];

  async function transformButton() {
    newButtons = [];
    // Wait for the original button to appear
    const originalButton = await waitForElementByText("Generate 1 Image");

    const buttons = Array.from(document.querySelectorAll("button")).filter(
      (button) => button.textContent.includes("Generate 1 Image")
    );

    buttons.forEach((button) => {
      button.style.display = "none";

      // Create new button
      const newButton = document.createElement("button");
      newButton.textContent = "Custom Generate";
      // Copy the original button's classes to maintain styling
      newButton.className = originalButton.className;
      newButton.style.width = "100%";
      newButtons.push(newButton);
    });

    // Create overlay element (hidden by default)
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #13152c;
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        `;
    document.body.appendChild(overlay);

    // Add click handler
    newButtons.forEach((newButton) => {
      newButton.addEventListener("click", () => {
        // Prevent multiple clicks while processing
        if (isProcessing) return;

        if (!originalButton.disabled) {
          isProcessing = true;
          newButton.disabled = true;
          newButton.style.opacity = "0.5";
          newButton.textContent = "Processing...";

          // Find and clone the current image
          const originalImage = document.querySelector("img[src]");
          if (originalImage) {
            const rect = originalImage.getBoundingClientRect();
            const clonedImage = originalImage.cloneNode(true);
            clonedImage.style.cssText = `
                        position: fixed;
                        width: ${rect.width}px;
                        height: ${rect.height}px;
                        top: ${rect.top}px;
                        left: ${rect.left}px;
                    `;
            overlay.appendChild(clonedImage);
          }

          overlay.style.display = "flex";

          // Create an observer to watch for the disabled attribute
          const observer = new MutationObserver((mutations) => {
            if (!originalButton.disabled) {
              const specificButton = document.querySelector(
                "#__next > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:last-child > button"
              );
              specificButton.click();

              Promise.all([
                waitForElement(
                  "#__next > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(1) > div:nth-child(2) > div > button:last-child"
                ),
                waitForElement(
                  "#__next > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > div > div"
                ),
              ]).then(async ([specificButton2, specificTextbox]) => {
                specificButton2.click();

                const text = GM_getValue("naiTransformText", "");

                // Directly set the text content
                specificTextbox.innerHTML = text;
                specificTextbox.dispatchEvent(
                  new Event("input", { bubbles: true })
                );

                const transformButton = await waitForElementByText("Transform");

                // Wait for button to be enabled before proceeding
                while (transformButton.disabled) {
                  await new Promise((resolve) => setTimeout(resolve, 100));
                }

                // Set up observer before clicking
                const transformPromise = new Promise((resolve) => {
                  const transformObserver = new MutationObserver(
                    (mutations) => {
                      if (!transformButton.disabled) {
                        transformObserver.disconnect();

                        // Reset processing state
                        isProcessing = false;

                        // Find all buttons and click the second one
                        const buttons = document.querySelectorAll("button");
                        if (buttons.length >= 2) {
                          buttons[1].click();
                          // Hide the overlay
                          overlay.style.display = "none";
                          // Remove the old elements
                          overlay.remove();
                          newButton.remove();
                          // Restart the process
                          setTimeout(initializeScript, 100);
                        }
                      }
                    }
                  );

                  transformObserver.observe(transformButton, {
                    attributes: true,
                    attributeFilter: ["disabled"],
                  });
                });

                // Click after observer is set up and button is enabled
                transformButton.click();
                await transformPromise;
              });

              observer.disconnect();
            }
          });

          observer.observe(originalButton, {
            attributes: true,
            attributeFilter: ["disabled"],
          });

          originalButton.click();
        } else {
          originalButton.click();
        }
      });
    });

    // Insert the new button before the original
    buttons.forEach((button) => {
      button.parentNode.insertBefore(newButtons[0], button);
    });
  }

  // Add event listener for enter key
  document.addEventListener(
    "keydown",
    (event) => {
      console.log("Keydown event target:", event.target);
      if (event.key === "Enter") {
        event.stopPropagation();
        event.preventDefault();

        // Close settings dialog if open
        const dialog = document.getElementById("nai-settings-dialog");
        if (dialog && dialog.style.display === "flex") {
          dialog.style.display = "none";
          return;
        }

        if (newButtons.length > 0) {
          newButtons[0].click();
        }
      }
    },
    true
  );

  // Wrap the main initialization in a function
  function initializeScript() {
    if (!document.getElementById("nai-settings-dialog")) {
      createSettingsButton();
    }
    transformButton();
  }

  // Initial start of the script
  initializeScript();
})();
