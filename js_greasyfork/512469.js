// ==UserScript==
// @name         Declutter Pinterest
// @namespace    August4067
// @version      1.2.1
// @description  Removes intrusive Pinterest shopping promotions, ads, and clutter, and makes the website more user-friendly
// @license      MIT
// @match        https://www.pinterest.com/*
// @match        https://*.pinterest.com/*
// @match        https://*.pinterest.co.uk/*
// @match        https://*.pinterest.fr/*
// @match        https://*.pinterest.de/*
// @match        https://*.pinterest.ca/*
// @match        https://*.pinterest.jp/*
// @match        https://*.pinterest.it/*
// @match        https://*.pinterest.au/*
// @icon         https://www.pinterest.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @sandbox      Javascript
// @downloadURL https://update.greasyfork.org/scripts/512469/Declutter%20Pinterest.user.js
// @updateURL https://update.greasyfork.org/scripts/512469/Declutter%20Pinterest.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/

// Pulled from: https://gist.github.com/raw/2625891/waitForKeyElements.js
function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */,
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector,
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

// We will set the Pinterest page title to this, to remove
// the flashing title notifications like Pinterest (2)
const ORIGINAL_TITLE = "Pinterest";

const SETTINGS_CONFIG = {
  removeShoppablePins: {
    displayName: "Remove shoppable pins",
    default: true,
  },
};

class Setting {
  constructor(name, config) {
    this.name = name;
    this.displayName = config.displayName;
    this.default = config.default;
  }

  currentValue() {
    return GM_getValue(this.name, this.default);
  }

  toggleSetting() {
    GM_setValue(this.name, !this.currentValue());
  }
}

// Create settings object by mapping config to Setting instances
const SETTINGS = Object.fromEntries(
  Object.entries(SETTINGS_CONFIG).map(([name, config]) => [
    name,
    new Setting(name, config),
  ]),
);

// MENU SETTINGS
function toggleMenuSetting(settingName) {
  var setting = SETTINGS[settingName];
  setting.toggleSetting();
  updateSettingsMenu();
  console.debug(`Setting ${settingName} set to: ${setting.currentValue()}}`);
  location.reload();
}

function updateSettingsMenu() {
  for (const [setting_name, setting] of Object.entries(SETTINGS)) {
    GM_registerMenuCommand(
      `${setting.displayName}: ${setting.currentValue() ? "Enabled" : "Disabled"}`,
      () => {
        toggleMenuSetting(setting_name);
      },
    );
  }
}

// HELPER FUNCTIONS
function waitAndRemove(selector, removeFunction) {
  if (removeFunction == undefined) {
    removeFunction = (elem) => collapseElement(elem);
  }

  waitForKeyElements(selector, function (node) {
    if (node && node.length > 0) {
      removeFunction(node[0]);
    }
  });
}

/**
 * Collapse an element to zero dimensions while keeping it in the DOM
 * This prevents layout gaps while preserving DOM structure for JavaScript
 * Also configures parent grid container to automatically fill gaps
 * @param {HTMLElement} element - The DOM element to collapse
 */
function collapseElement(element) {
  if (element) {
    element.style.setProperty("height", "0", "important");
    element.style.setProperty("width", "0", "important");
    element.style.setProperty("margin", "0", "important");
    element.style.setProperty("padding", "0", "important");
    element.style.setProperty("border", "none", "important");
    element.style.setProperty("overflow", "hidden", "important");
    element.style.setProperty("opacity", "0", "important");
    element.style.setProperty("min-height", "0", "important");
    element.style.setProperty("min-width", "0", "important");

    // Configure parent grid container to auto-fill gaps left by collapsed elements
    const listContainer = element.closest('div[role="list"]');
    if (listContainer && !listContainer.dataset.gridFixed) {
      // Only apply once per container
      listContainer.style.setProperty("grid-auto-flow", "dense", "important");
      listContainer.dataset.gridFixed = "true";
    }
  }
}

function isFeaturedBoard(pin) {
  if (
    pin.textContent.trim().toLowerCase().startsWith("explore featured boards")
  ) {
    return true;
  } else if (
    pin.textContent.trim().toLowerCase().startsWith("still window shopping")
  ) {
    return true;
  }
  return false;
}

function isShoppingCard(pin) {
  if (
    pin
      .querySelector("h2#comments-heading")
      ?.textContent.toLowerCase()
      .startsWith("shop")
  ) {
    return true;
  } else if (
    pin
      .querySelector("a")
      ?.getAttribute("aria-label")
      ?.toLowerCase()
      .startsWith("shop")
  ) {
    return true;
  } else if (
    // TODO - refine this condition
    pin.querySelector("h2")?.textContent.trim().toLowerCase().startsWith("shop")
  ) {
    return true;
  }
  return false;
}

function isShoppablePin(pin) {
  return pin.querySelector('[aria-label="Shoppable Pin indicator"]') != null;
}

function isSponsoredPin(pin) {
  return pin.querySelector('div[title="Sponsored"]') != null;
}

// FUNCTIONS THAT REMOVE
function removeClutterPins(pins) {
  const filters = [isShoppingCard, isFeaturedBoard, isSponsoredPin];

  // Only add the shoppable pins filter if the setting is enabled
  if (SETTINGS.removeShoppablePins.currentValue()) {
    filters.push(isShoppablePin);
  }

  pins.forEach((pin) => {
    if (filters.some((test) => test(pin))) {
      collapseElement(pin);
    }
  });
}

// In the #SuggestionsMenu
function removePopularOnPinterestSearchSuggestions() {
  waitAndRemove('div[data-test-id="search-story-suggestions-container"]');
}

function setupSearchSuggestionsRemovalForPopularSuggestions() {
  waitAndRemove("#searchBoxContainer", (node) => {
    const observer = new MutationObserver(() => {
      removePopularOnPinterestSearchSuggestions();
    });
    observer.observe(node, { childList: true, subtree: true });
  });
}

// FUNCTION THAT SETUP OBSERVERS
function setupPinFiltering() {
  waitAndRemove('div[role="list"]', (node) => {
    var pinListMutationObserver = new MutationObserver(
      (mutations, observer) => {
        removeClutterPins(node.querySelectorAll('div[role="listitem"]'));
      },
    );
    pinListMutationObserver.observe(node, {
      childList: true,
      subtree: true,
    });
  });
}

function setupShopButtonRemovalFromBoardTools() {
  waitAndRemove('div[data-test-id="board-tools"] div[data-test-id="Shop"]');
}

function removeDownloadUpsellPopover() {
  waitAndRemove('div[data-test-id="post-download-upsell-popover"]');
}

function removeExploreTabNotificationsIcon() {
  // --- Remove notification icon from Explore tab in the top nav (old behavior)
  var exploreTab = document.querySelector('div[data-test-id="today-tab"]');
  if (exploreTab) {
    var notificationsIcon = exploreTab.querySelector(
      'div[aria-label="Notifications"]',
    );
    collapseElement(notificationsIcon);
  }

  // --- Remove notification badge from Explore tab in the sidebar (new behavior)
  // Find the Explore tab link in the sidebar
  var exploreTabLink = document.querySelector('a[data-test-id="today-tab"]');
  if (exploreTabLink) {
    // The parent of the link is the icon container, its parent is the sidebar item
    var iconContainer = exploreTabLink.closest('div[class*="XiG"]');
    var sidebarItem = iconContainer?.parentElement?.parentElement;
    if (sidebarItem) {
      // The notification badge is a sibling div with class "MIw" and pointer-events: none
      var notificationBadge = sidebarItem.parentElement?.querySelector(
        '.MIw[style*="pointer-events: none"]',
      );
      if (notificationBadge) {
        collapseElement(notificationBadge);
      }
    }
  }
}

function setupSidebarObserverForExploreNotifications() {
  // Find the sidebar navigation container (adjust selector if needed)
  const sidebarNav =
    document.querySelector('nav[id="VerticalNavContent"]') ||
    document.querySelector('div[role="navigation"]');
  if (!sidebarNav) {
    // Try again later if sidebar not yet loaded
    setTimeout(setupSidebarObserverForExploreNotifications, 500);
    return;
  }
  // Remove any existing badge immediately
  removeExploreTabNotificationsIcon();

  // Set up observer
  const observer = new MutationObserver(() => {
    removeExploreTabNotificationsIcon();
  });
  observer.observe(sidebarNav, { childList: true, subtree: true });
}

function removeShopByBanners() {
  waitForKeyElements('div[data-test-id="sf-header-heading"]', function (node) {
    var shopByBannerAtTopOfBoard = node[0].closest(
      'div[class="PKX zI7 iyn Hsu"]',
    );
    collapseElement(shopByBannerAtTopOfBoard);

    var baseBoardPinGrid = node[0].closest(
      'div[data-test-id="base-board-pin-grid"]',
    );
    if (baseBoardPinGrid) {
      var shopByBannerAtBottomOfBoard = node[0].closest(
        'div[class="gcw zI7 iyn Hsu"]',
      );
      collapseElement(shopByBannerAtBottomOfBoard);

      // Handle "More products" banner (text-based detection for resilience)
      var moreProductsBannerAtBottomOfBoard = node[0].querySelector("h2");
      if (
        moreProductsBannerAtBottomOfBoard &&
        moreProductsBannerAtBottomOfBoard.innerText
          ?.trim()
          .toLowerCase()
          .startsWith("more products")
      ) {
        // Traverse up from the h2 to find the direct child of base-board-pin-grid
        // This ensures we hide only the "More products inspired by this board" section
        var moreProductsContainer = node[0];
        var maxIterations = 20; // Safety limit to prevent infinite loops
        var iterations = 0;

        while (
          moreProductsContainer &&
          moreProductsContainer.parentElement !== baseBoardPinGrid &&
          iterations < maxIterations
        ) {
          moreProductsContainer = moreProductsContainer.parentElement;
          iterations++;
        }

        // Only collapse if we successfully found the container
        if (
          moreProductsContainer &&
          moreProductsContainer.parentElement === baseBoardPinGrid
        ) {
          collapseElement(moreProductsContainer);
        }
      }
    }

    if (node[0]?.innerText.trim().toLowerCase().startsWith("shop products")) {
      collapseElement(node[0].closest('div[class*="gcw zI7"]'));
    }
    var shopByBannerAtTopOfSearch = node[0].closest('div[role="listitem"]');
    collapseElement(shopByBannerAtTopOfSearch);
  });
}

function main() {
  "use strict";

  updateSettingsMenu();

  setupPinFiltering();
  setupShopButtonRemovalFromBoardTools();
  setupSidebarObserverForExploreNotifications();
  setupSearchSuggestionsRemovalForPopularSuggestions();

  removeShopByBanners();
  removeDownloadUpsellPopover();
}

main();

let lastUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    console.debug(
      `Detected new page, currentURL=${currentUrl}, previousURL=${lastUrl}`,
    );
    lastUrl = currentUrl;
    main();
  }
}, 750);
