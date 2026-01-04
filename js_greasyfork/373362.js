// ==UserScript==
// @name        Pinterest - Remove Unwanted Pins (custom)
// @namespace   valacar.pinterest.remove-picked-for-you-custom
// @author      valacar
// @version     0.8.2.custom
// @description Remove unwanted pins on Pinterest, like "Promoted", "Sponsored", "Picked for you"
// @include     https://*.pinterest.tld/*
// @exclude     /^https://(help|blog|about|buisness|developers|engineering|careers|policy|offsite)\.pinterest/
// @grant       none
// @run-at      document-start
// @noframes
// @license     MIT
// @compatible  firefox Firefox
// @compatible  chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/373362/Pinterest%20-%20Remove%20Unwanted%20Pins%20%28custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373362/Pinterest%20-%20Remove%20Unwanted%20Pins%20%28custom%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const DEBUGGING = 0;

  // allow debugging keys without logging messages
  const ENABLE_KEYS = 0; // r = reveal (unhide), s = search (find and hide)

  // Note: the following are actually regular expressions. Letter case is ignored (case insensitive),
  // and they only apply to the description and pin title.
  const badWords = [
    "\bspiders?\b", // Match spider or spiders, but not something like spiderman.
                    // \b matches word boundaries, ?s means optional 's' character

    "spiderling", // Plain words work too, but be careful since a match will occur if
                  // it's part of another word. Example: "cat" would also match "location"

    "tarantula",
    "orb weaver",
  ]

  const badStoryType = [
    "real_time_boards", // ideas for you
    "BUBBLE_TRAY_CAROUSEL", // ideas you might love
    "PINART_INTEREST", // topics for you
    "single_column_recommended_board",
    "recommended_searches" // searches to try
  ];

  const badWordFilter = new RegExp(badWords.join("|"), "i");
  const badStoryTypeSet = new Set(badStoryType);

  const hidePinClass = "unwanted";

  let cachedHandler;
  let cachedGrid;

  /* ---------------------------- */

  function appendStyle(cssString)
  {
    const parent = document.head || document.documentElement;
    if (parent) {
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.textContent = cssString;
      parent.appendChild(style);
    }
  }

  appendStyle(`.${hidePinClass} { visibility: hidden !important; }`);

  const debugLog = DEBUGGING ? console.log.bind(console, "[unwanted]") : function() {};

  function isPromotedPin(data, pin)
  {
    let result = (data.is_promoted && data.is_promoted === true)
      || data.promoter
      || pin.dataset.testId === "oneTapPromotedPin";
    if (result) debugLog("--- removed PROMOTED pin:", data.domain);
    return result;
  }

  function isIdeaPin(data)
  {
    let result = data.type
      && data.type === "story"
      && badStoryTypeSet.has(data.story_type);
    if (result) {
      debugLog("--- removed IDEAS/TOPIC for you pin", data.story_type);
    }
    return result;
  }

  function isCommercePin(data)
  {
    let result = (data.shopping_flags && data.shopping_flags.length > 0)
      || data.buyable_product;
    if (result) {
      debugLog("--- removed COMMERCE pin:",
        data.domain,
        data.buyable_product ? "(buyable)" : "");
    }
    return result;
  }

  function containsBadString(data)
  {
    let found;
    if (data.description) {
      found = badWordFilter.test(data.description);
      if (found) {
        debugLog("--- removed BAD WORD pin:",
          data.description);
        return true;
      }
    }
    if (data.grid_title) {
      found = badWordFilter.test(data.grid_title);
      if (found) {
        debugLog("--- removed BAD WORD pin:",
          data.grid_title);
        return true;
      }
    }
    return false;
  }

  function getEventHandler(pin)
  {
    return Object.keys(pin).find(
      prop => prop.startsWith("__reactEventHandlers")
    );
  }

  function isBadPin(pin)
  {
    let handler = cachedHandler || getEventHandler(pin);
    if (!handler) {
      return false;
    }
    cachedHandler = handler; // cache React handler
    let data;
    let wrapper = pin.querySelector(".pinWrapper");
    if (wrapper) {
      // FIXME: children and other properties could be null
      data = wrapper[handler].children[1].props.pin;
    } else {
      // FIXME: children and other properties could be null
      data = pin[handler].children.props.data;
    }
    if (data && (isCommercePin(data) || isPromotedPin(data, pin) || isIdeaPin(data) || containsBadString(data) )) {
      return true;
    }
  }

  function modifyBadPin(pin)
  {
    if (isBadPin(pin)) {
      pin.classList.add(hidePinClass);
    }
  }

  function processPins(pins)
  {
    debugLog("::: Processing", pins.length, "pins");
    for (let i = 0, len = pins.length; i < len; ++i) {
      modifyBadPin(pins[i]);
    }
  }

  function findGrid()
  {
    if (cachedGrid && cachedGrid.isConnected) {
      return cachedGrid;
    }
    const gridItems = document.querySelectorAll("[data-grid-item]");
    if (!gridItems.length) {
      debugLog("!!! Can't find data-grid-item");
      return null;
    }
    const gridItemParent = gridItems[0].parentNode;
    if (gridItemParent) {
      debugLog("### Found grid:", gridItemParent);
      cachedGrid = gridItemParent;
      processPins(gridItems);
      return gridItemParent;
    }
  }

  function searchAndDestroy()
  {
    debugLog(">>> searching and destroying");
    const grid = findGrid();
    if (grid) {
      const gridItems = grid.querySelectorAll("[data-grid-item]");
      for (let i = 0, len = gridItems.length; i < len; ++i) {
        modifyBadPin(gridItems[i]);
      }
    }
  }

  function mutationCallback(mutations)
  {
    findGrid();
    for (let mutation of mutations) {
      for (let i = 0, len = mutation.addedNodes.length; i < len; ++i) {
        let added = mutation.addedNodes[i];
        if (added.nodeType === Node.ELEMENT_NODE) {
          if (added.hasAttribute("data-grid-item")) {
            modifyBadPin(added);
          }
        }
      }
    }
  }

  // Simplify creating a Mutation Observer (from document root)
  function createObserver(target, callbackFunction, rules)
  {
    let targetElement;
    if (typeof target === "string") {
      targetElement = document.querySelector(target);
    } else {
      // XXX: assume it's an element for now
      targetElement = target;
      debugLog(targetElement);
    }
    if (targetElement) {
      const observer = new MutationObserver(callbackFunction);
      observer.observe(targetElement, rules);
      debugLog("::: Observer for %s created", target);
    } else {
      debugLog("::: %s not found while creating observer", target);
    }
  }

  if (DEBUGGING || ENABLE_KEYS) {
    window.addEventListener("keydown",
      function(event) {
        if (event.defaultPrevented ||
            /(input|textarea)/i.test(document.activeElement.nodeName) ||
            document.activeElement.matches('[role="textarea"]'))
        {
          return;
        }
        switch (event.key) {
          case "s": // find grid and hide unwanted pins
            searchAndDestroy();
            debugLog(
              "%cSearch and destroy!",
              "color: #fff; background: #600; font-weight: bold; display: block;"
            );
            break;
          case "r": // temporary restore hidden pins
            document
              .querySelectorAll(`.${hidePinClass}`)
              .forEach(pin => {
                pin.classList.remove(hidePinClass);
              });
            break;
          default:
            return;
        }
        event.preventDefault();
      },
      true
    );
  }

  window.addEventListener("load", () => {
    createObserver(".mainContainer", mutationCallback, {
      childList: true,
      subtree: true
    });
    searchAndDestroy();
  });

  window.addEventListener("DOMContentLoaded", () => {
    searchAndDestroy();
  });

})();
