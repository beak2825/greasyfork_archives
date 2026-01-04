// ==UserScript==
// @name        Slack: Org Protocol Capture
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/client/*
// @grant       none
// @version     1.1
// @author      srijan
// @supportURL  https://github.com/srijan/slack_org_protocol_capture
// @description Add a button to send a slack message to org-protocol
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521908/Slack%3A%20Org%20Protocol%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/521908/Slack%3A%20Org%20Protocol%20Capture.meta.js
// ==/UserScript==


var observing = false;

// Function to open URIs in either a web browser or in Slack Desktop.
function crossPlatformOpen(uri) {
    // If we're in an electron environment, use open();
    if (isDesktop && isDesktop()) {
        console.log("[SLACK-ORG-PROTOCOL] Detected Slack desktop, opening with open");
        open(uri);
    } else if (location && typeof location.href != 'undefined') {
        console.log("[SLACK-ORG-PROTOCOL] Opening with location.href");
        location.href = uri;
    } else if (window && typeof window.open != 'undefined') {
        console.log("[SLACK-ORG-PROTOCOL] Opening with window.open");
        window.open(uri, '_blank');
    } else {
        alert("[SLACK-ORG-PROTOCOL] Cannot find a suitable API to open a URI (" + uri + "). This is a bug.");
    }
};

// Function to create and insert the button
function insertButton() {
  // Check if the button already exists to avoid duplicates
  if (isButtonPresent()) {
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
    "custom-org-capture-button"
  );

  // Set the SVG content inside the button
  newButton.innerHTML = `
    <svg height="18" width="18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 58 58" xml:space="preserve">
      <g>
        <path fill="currentColor" d="M36.293,12.121c0.391,0.391,1.023,0.391,1.414,0s0.391-1.023,0-1.414l-7.999-7.999c-0.001-0.001-0.001-0.001-0.002-0.002
          L29,2l-0.706,0.706c-0.001,0.001-0.001,0.001-0.002,0.002l-7.999,7.999c-0.391,0.391-0.391,1.023,0,1.414s1.023,0.391,1.414,0
          L28,5.828v27.586c0,0.552,0.447,1,1,1s1-0.448,1-1V5.828L36.293,12.121z"/>
        <path fill="currentColor" d="M57.981,32.676L57.53,32h-0.009l-3.583-5.381l-2.421-3.628l0.004-0.002L47.535,17H36v2h10.465l8.679,13H39v7H19v-7H2.856
          l8.679-13H22v-2H10.465L0.431,32.031l-0.014,0.001L0,32.655v0.206v0.396v19.359C0,54.482,1.519,56,3.385,56h51.23
          C56.481,56,58,54.482,58,52.616V33.239v-0.429l-0.014-0.036L57.981,32.676z"/>
      </g>
    </svg>`;

  // Set the onClick behavior
  newButton.onclick = async () => {

    const [sender, message, link] = getCurrentMessageDetails();
    console.debug(sender);
    console.debug(message);
    console.debug(link);
    const captureURI = createCaptureURI(sender, message, link);
    console.debug(captureURI);

    crossPlatformOpen(captureURI);

    // TODO: Set fillColor to #1c97cc
    for (let path of event.target.getElementsByTagName('path')) {
      path.setAttribute('fill', '#1c97cc');
    }
  };

  // Find the "start_thread" button
  const laterButton = document.querySelector(
    'button[data-qa="later"]'
  );

  // Insert the new button before the "start_thread" button
  if (laterButton) {
    laterButton.parentNode.insertBefore(newButton, laterButton);
    console.debug("btn added");
  }
}

function createCaptureURI(sender, message, link) {
  // new style
  const encoded_url = encodeURIComponent(link);
  const escaped_title = escapeIt(link);
  const escaped_message = escapeIt(sender + ": " + message);
  return "org-protocol://capture?url=" + encoded_url + "&title=" + escaped_title + "&body=" + escaped_message;
}

// From https://github.com/sprig/org-capture-extension/blob/3911377933619a24562730dc8b353424f8809d9e/capture.js#L87
function replace_all(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}
function escapeIt(text) {
  return replace_all(
    replace_all(
      replace_all(
        encodeURIComponent(text), "[(]", escape("(")),
      "[)]", escape(")")),
    "[']" ,escape("'"));
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
          messageActionsContainer && !isButtonPresent()
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
  observing = true;

  observeDisconnection(targetNode, observer);
}

function getMessageActionsContainer() {
  return document.querySelector(
    "div.c-message_actions__container.c-message__actions>div.c-message_actions__group"
  );
}

function getCurrentMessageDetails() {
  const sender = document.querySelector(
    'div.c-message_kit__hover--hovered span[data-qa$="-sender"]'
  ).innerText;
  const message = document.querySelector(
    'div.c-message_kit__hover--hovered div.p-rich_text_section'
  ).innerText;
  const link = document.querySelector(
    'div.c-message_kit__hover--hovered a.c-timestamp'
  ).href;
  return [sender, message, link];
}

// Find the slack workspace element and add a hover event listener to start observing
async function init() {
  const slackWorkspace = await getElement("div.p-client_workspace__layout");

  if (slackWorkspace) {
    observeMutations(slackWorkspace);
  } else {
    console.error("couldnt find element");
  }
}
init();

function isButtonPresent() {
  return document.querySelector("button.custom-org-capture-button");
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

    // Set a timeout to reject the promise if the element isn't found within 30 seconds
    const timeoutId = setTimeout(() => {
      observer.disconnect(); // Ensure to disconnect the observer to prevent memory leaks
      resolve(null); // Resolve with null instead of rejecting to indicate the timeout without throwing an error
    }, 30000); // 30 seconds

    // Ensure that if the element is found and the observer is disconnected, we also clear the timeout
    observer.takeRecords().forEach((record) => {
      clearTimeout(timeoutId);
    });
  });
}

// Function to observe the targetNode getting deleted.
// Have to observe the body node and check if targetNode still exists in the body
function observeDisconnection(targetNode, targetObserver) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (observing) {
          if (!document.body.contains(targetNode)) {
            observer.takeRecords();
            observer.disconnect();
            targetObserver.takeRecords();
            targetObserver.disconnect();
            observing = false;
            init();
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}
