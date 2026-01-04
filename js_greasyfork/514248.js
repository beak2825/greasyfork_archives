// ==UserScript==
// @name        WaitCheck
// @description Shows the current queue size on Waitwhile.
// @match       https://waitwhile.com/*
// @namespace   mr06cpp
// @version     1.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/514248/WaitCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/514248/WaitCheck.meta.js
// ==/UserScript==

(function () {
  const locationData = window.__NEXT_DATA__?.props?.ssrLocationData;

  if (!locationData) {
    return;
  }

  // TODO: API
  const getLocationData = () => locationData;

  const getWaitingText = (data) => {
    let waitingText = `${data.numWaitingGuests} Waiting`;

    if (data.numWaitingGuests) {
      const groupsN = data.numWaiting > 1 ? "Groups" : "Group";
      waitingText += ` (${data.numWaiting} ${groupsN})`;
    }

    return waitingText;
  };

  const injectButton = (button) => {
    if (button.hasMagic) {
      return;
    }

    const data = getLocationData();
    const waitingText = getWaitingText(data);

    const span = document.createElement("span");
    span.innerHTML = waitingText;
    span.style.cssText = "width: 100%; color: #ccc; font-size: 0.8em; margin-top: 0.5em;";

    button.hasMagic = true;
    button.style.flexWrap = "wrap";
    button.append(span);
  };

  const injectContainer = (container) => {
    if (!container.querySelector) {
      return;
    }

    const joinButton = container.querySelector("button[kind=primary]");
    if (joinButton) {
      injectButton(joinButton);
    }
  };

  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach(injectContainer);
    });
  });

  injectContainer(document);
  observer.observe(document, { childList: true, subtree: true });
})();