// ==UserScript==
// @name        Pay My Way
// @description Adds the "Pay My Way" button to all booking pages
// @match       https://*.hyatt.com/shop/rooms/*
// @namespace   mr06cpp
// @version     1.2
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/519374/Pay%20My%20Way.user.js
// @updateURL https://update.greasyfork.org/scripts/519374/Pay%20My%20Way.meta.js
// ==/UserScript==

(function () {
  const getWindow = () => {
    try {
      return unsafeWindow;
    } catch (e) {
      if (e.name == "ReferenceError") {
        return window;
      }
      throw e;
    }
  };

  const loggedIn = getWindow().STORE.loggedInStatus === "LOGGED-IN";

  const getReactComponent = (element) => {
    let reactInternal = null;
    for (const key of Object.keys(element)) {
      if (key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber")) {
        reactInternal = element[key];
      }
    }

    if (!reactInternal) {
      throw new Error("Failed to find React internal");
    }

    return reactInternal.return;
  };

  const getPmwUrl = (roomType, ratePlan) => {
    const regex = new RegExp("^/shop/rooms/([^/]+)$");
    const urlObj = new URL(window.location.href);
    const matches = urlObj.pathname.match(regex);

    if (!matches) {
      throw new Error("Not a Select Room page");
    }

    const spiritCode = matches[1];
    urlObj.pathname = `/shop/itinerize/${spiritCode}/${ratePlan}/${roomType}`;
    return urlObj.toString();
  };

  const getRatePlanCodeFromRateSelector = (rateSelector) => {
    const regex = new RegExp("([A-Z0-9]+)-(name|rateValue)");
    const ariaLabel = rateSelector.attributes["aria-labelledby"]?.value;
    return ariaLabel.match(regex)?.[1];
  };

  const injectRateSelector = (rateSelector, roomType, ratePlan) => {
    const label = rateSelector.querySelector(".radio_input_name__wrapper");

    const button = document.createElement("button");
    button.innerText = "PMW";
    button.style = "color: #000; margin-left: 10px;";
    button.onclick = () => {
      const pmwUrl = getPmwUrl(roomType, ratePlan);
      console.log(`PMW roomType=${roomType} ratePlan=${ratePlan} url=${pmwUrl}`);
      window.open(pmwUrl, "_blank").focus();
    };

    if (!loggedIn) {
      button.disabled = true;
      button.innerText = "PMW (Log in first)";
    }

    if (label) {
      label.append(` (${ratePlan})`);
      label.append(button);
    } else {
      rateSelector.append(button);
    }
  };

  const injectRoomRatesFrameContainer = (frameContainer) => {
    const component = getReactComponent(frameContainer);
    if (!component) {
      throw new Error("Failed to find component");
    }

    const roomType = component.key;
    const rateSelectors = frameContainer.querySelectorAll(".room_rates_modal__rate_selector");
    for (const rateSelector of rateSelectors) {
      const ratePlan = getRatePlanCodeFromRateSelector(rateSelector);
      console.log(`Found roomType=${roomType} ratePlan=${ratePlan}`);
      injectRateSelector(rateSelector, roomType, ratePlan);
    }

    const headers = frameContainer.querySelectorAll("h2");
    for (const header of headers) {
      header.append(` (${roomType})`);
    }
  };

  const injectContainer = (container) => {
    if (!container.querySelector) {
      return;
    }

    const frameContainers = container.querySelectorAll(".room-rates-frame-container");
    for (const frameContainer of frameContainers) {
      injectRoomRatesFrameContainer(frameContainer);
    }
  };

  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((container) => {
        try {
          injectContainer(container);
        } catch (e) {
          console.warn("PMW", e);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();