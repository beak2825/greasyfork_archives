// ==UserScript==
// @name        Slack: Quick Edit Button
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/client/*
// @grant       none
// @version     1.1
// @author      GorvGoyl
// @supportURL  https://github.com/gorvGoyl/
// @description Add quick edit button to hover toolbar
// @description 7/9/2024, 9:54:40 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500127/Slack%3A%20Quick%20Edit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/500127/Slack%3A%20Quick%20Edit%20Button.meta.js
// ==/UserScript==

var sender = "";

// Function to create and insert the button
function insertButton() {
  // Check if the button already exists to avoid duplicates
  if (isEditPresent()) {
    console.debug("btn already present so skipping");
    return;
  }

  // Create the new button element
  const newButton = document.createElement("button");

  // Set the button classes
  newButton.classList.add(
    "c-button-unstyled",
    "c-icon_button",
    "c-icon_button--size_small",
    "c-message_actions__button",
    "c-icon_button--default",
    "custom-edit-button"
  );

  // Set the SVG content inside the button
  newButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"/>
  </svg>
  `;

  // Set the onClick behavior
  newButton.onclick = async () => {
    // Find and click the "more_message_actions" button
    const moreActionsButton = document.querySelector(
      'button[data-qa="more_message_actions"]'
    );
    if (moreActionsButton) {
      moreActionsButton.click();

      const editMessageButton = await getElement(
        'button[data-qa="edit_message"]'
      );
      if (editMessageButton) {
        editMessageButton.click();
       setTimeout(() => {
        getMessageActionsContainer()?.remove();
       }, 400);
      }
    }
  };

  // Find the "start_thread" button
  const startThreadButton = document.querySelector(
    'button[data-qa="start_thread"]'
  );

  // Insert the new button before the "start_thread" button
  if (startThreadButton) {
    startThreadButton.parentNode.insertBefore(newButton, startThreadButton);
    console.debug("btn added");
  }
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Function to observe mutations with debounce
function observeMutations(targetNode) {
  // console.debug("observeMutations");
  const debouncedInsertButton = debounce(insertButton, 50); // 200ms debounce

  // Create a mutation observer
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        const messageActionsContainer = getMessageActionsContainer();
        if (
          messageActionsContainer &&
          isSender(messageActionsContainer) &&
          !isEditPresent()
        ) {
          debouncedInsertButton();
        }
      }
    }
  });

  // Configure the observer to watch for changes in the subtree
  observer.observe(targetNode, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function getMessageActionsContainer() {
  return document.querySelector(
    "div.c-message_actions__container.c-message__actions>div.c-message_actions__group"
  );
}

// Find the slack kit list element and add a hover event listener to start observing
async function init() {
  const slackKitList = await getElement("div.p-workspace__primary_view_body");

  if (slackKitList) {
    observeMutations(slackKitList);
  } else {
    console.error("couldnt find element");
  }
}
init();
function isSender(messageActionsContainer) {
  if (!sender) {
    sender = document
      .querySelector('[data-qa="user-button"]')
      ?.getAttribute("aria-label")
      ?.replace("User: ", "");
  }
  if (!sender) {
    return;
  }

  const kitactions = messageActionsContainer?.closest(
    "div.c-message_kit__actions"
  );

  if (!kitactions) {
    return false;
  }

  // if it's the first row
  let name = kitactions
    ?.querySelector('button[data-qa="message_sender_name"]')
    ?.innerText?.trim();

  // if it's the 2nd row
  if (!name) {
    name = kitactions
      ?.querySelector("div.c-message_kit__gutter__right>span.offscreen")
      ?.innerText?.trim();
  }

  return name == sender;
}

function isEditPresent() {
  return document.querySelector("button.custom-edit-button");
}

// helper menthod: get element whenever it becomes available
function getElement(selector) {
  return new Promise((resolve, reject) => {
    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // Create a MutationObserver to listen for changes in the DOM
    const observer = new MutationObserver((mutations, observer) => {
      // Check for the element again within each mutation
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect(); // Stop observing
        resolve(element);
      }
    });

    // Start observing the document body for child list changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Set a timeout to reject the promise if the element isn't found within 10 seconds
    const timeoutId = setTimeout(() => {
      observer.disconnect(); // Ensure to disconnect the observer to prevent memory leaks
      resolve(null); // Resolve with null instead of rejecting to indicate the timeout without throwing an error
    }, 10000); // 10 seconds

    // Ensure that if the element is found and the observer is disconnected, we also clear the timeout
    observer.takeRecords().forEach((record) => {
      clearTimeout(timeoutId);
    });
  });
}
