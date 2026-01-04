// ==UserScript==
// @name         T3 Chat Collapsible Answers
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Adds collapse/expand buttons to T3 Chat answers. Generated with Gemini 2.0 Flash model.
// @author       Dimava (Original idea), T3 Chat (Gemini 2.0 Flash)
// @license      MIT
// @match        https://t3.chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526126/T3%20Chat%20Collapsible%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/526126/T3%20Chat%20Collapsible%20Answers.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Dimava, T3 Chat, and [Your Name/Handle]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  "use strict";

  // Call cleanup if it exists on the window
  if (window.t3ChatCollapseCleanup) {
    window.t3ChatCollapseCleanup();
  }

  const COLLAPSE_BUTTON_CLASS = "t3-chat-collapse-button";
  const COLLAPSED_CONTAINER_CLASS = "t3-chat-collapsed";

  // Cleanup function to remove added elements and event listeners
  function cleanup() {
    const collapseButtons = document.querySelectorAll(
      `.${COLLAPSE_BUTTON_CLASS}`
    );
    collapseButtons.forEach((button) => {
      button.removeEventListener("click", toggleCollapse);
      button.remove();
    });

    const collapsedElements = document.querySelectorAll(
      `.${COLLAPSED_CONTAINER_CLASS}`
    );
    collapsedElements.forEach((element) => {
      element.classList.remove(COLLAPSED_CONTAINER_CLASS);
    });

    // Remove added styles
    const addedStyles = document.querySelectorAll(".t3-chat-added-style");
    addedStyles.forEach((style) => style.remove());
  }

  function toggleCollapse(event) {
    const button = event.target;
    const messageDiv = button.closest(".flex"); // Find the parent message div
    const messageContainer = messageDiv.closest("div[data-message-id]");

    if (messageContainer) {
      messageContainer.classList.toggle(COLLAPSED_CONTAINER_CLASS);
      button.textContent = messageContainer.classList.contains(
        COLLAPSED_CONTAINER_CLASS
      )
        ? "Expand"
        : "Collapse";
    }
  }

  function addCollapseButtons() {
    const messageDivs = document.querySelectorAll(".flex.justify-start");

    messageDivs.forEach((messageDiv) => {
      // Check if a collapse button already exists for this message
      if (messageDiv.querySelector(`.${COLLAPSE_BUTTON_CLASS}`)) {
        return; // Skip if the button already exists
      }

      const messageContainer = messageDiv.closest("div[data-message-id]");

      if (!messageContainer) {
        return;
      }

      const contentDiv = messageDiv.querySelector(".prose");

      if (contentDiv) {
        const collapseButton = document.createElement("button");
        collapseButton.textContent = "Collapse";
        collapseButton.classList.add(COLLAPSE_BUTTON_CLASS);

        collapseButton.addEventListener("click", toggleCollapse);
        messageDiv.appendChild(collapseButton);
      }
    });
  }

  // Style to hide the content and remove margins
  const style = document.createElement("style");
  style.classList.add("t3-chat-added-style"); // Add class for easy removal
  style.textContent = `
        div[data-message-id] {
           position: relative;
        }
  
        .${COLLAPSED_CONTAINER_CLASS} .prose {
            display: none;
        }

        .${COLLAPSED_CONTAINER_CLASS} {
            margin-top: 0px !important;
        }

        .${COLLAPSED_CONTAINER_CLASS} + div[data-message-id] {
            margin-top: 0px !important;
        }

        .${COLLAPSE_BUTTON_CLASS} {
            position: absolute;
            top: 0; bottom: 0; left: calc(100% + 10px);
            margin-top: 10px;
            margin-bottom: 5px;
            margin-left: 10px;
            margin-right: 0;
            padding: 5px 10px;
            border: 1px solid #666;
            border-radius: 5px;
            background: #333;
            color: white;
            cursor: pointer;
            display: block;
        }
        .${COLLAPSED_CONTAINER_CLASS} > .${COLLAPSE_BUTTON_CLASS} {
            position: relative;
            left: 93px;
        }
    `;
  document.head.appendChild(style);

  // Mutation observer to dynamically add buttons to new messages
  const observer = new MutationObserver(() => {
    addCollapseButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Attach cleanup function to window, so you can call it from the console
  window.t3ChatCollapseCleanup = () => {
    cleanup();
    observer.disconnect();
    style.remove();
    delete window.t3ChatCollapseCleanup;
  };

  // Initial add buttons
  addCollapseButtons();
})();
