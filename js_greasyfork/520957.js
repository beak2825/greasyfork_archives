// ==UserScript==
// @name         Declutter LinkedIn
// @namespace    August4067
// @version      0.2.0-alpha
// @description  Remove the feed, LinkedIn Premium upsells, news, and other clutter from LinkedIn
// @license      MIT
// @match        https://www.linkedin.com/*
// @icon         https://www.linkedin.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/520957/Declutter%20LinkedIn.user.js
// @updateURL https://update.greasyfork.org/scripts/520957/Declutter%20LinkedIn.meta.js
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
      }, 100);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

// SETTINGS
const SETTING_REMOVE_FEED = "removeFeed";
const SETTING_REMOVE_NEWS = "removeNews";

class Setting {
  constructor(settingName, settingDisplayName, settingDefault) {
    this.settingName = settingName;
    this.settingDisplayName = settingDisplayName;
    this.settingDefault = settingDefault;
  }

  currentValue() {
    return GM_getValue(this.settingName, this.settingDefault);
  }

  toggleSetting() {
    var current = this.currentValue();
    GM_setValue(this.settingName, !current);
  }
}

class SettingRemoveFeed extends Setting {
  constructor() {
    super(SETTING_REMOVE_FEED, "Remove feed", true);
  }
}

class SettingRemoveNews extends Setting {
  constructor() {
    super(SETTING_REMOVE_NEWS, "Remove news", true);
  }
}

const SETTINGS = {
  [SETTING_REMOVE_FEED]: new SettingRemoveFeed(),
  [SETTING_REMOVE_NEWS]: new SettingRemoveNews(),
};

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
      `${setting.settingDisplayName}: ${setting.currentValue() ? "Enabled" : "Disabled"}`,
      () => {
        toggleMenuSetting(setting_name);
      },
    );
  }
}

function waitAndRemove(selector, func) {
  if (func === undefined) {
    func = (node) => {
      node.style.display = "none";
    };
  }
  waitForKeyElements(selector, function (nodes) {
    if (nodes && nodes.length > 0 && nodes[0]) {
      func(nodes[0]);
    }
  });
}

function removeNotificationBadgeFromHomeIcon() {
  waitAndRemove(
    'li[class^="global-nav__primary-item"] span[class^="notification-badge"]',
  );
  waitAndRemove(
    'a[data-view-name="navigation-homepage"] span[class$="_1ptbkx61f4"]',
  );
}

function removeProfilePrompts() {
  waitAndRemove("#promo", (node) => node.parentElement.remove());
  waitAndRemove("#guidance", (node) => node.parentElement.remove());
  waitAndRemove("#resources", (node) => node.parentElement.remove());
}

function removeNewsFromRightSidebar() {
  if (!SETTINGS[SETTING_REMOVE_NEWS].currentValue()) {
    return;
  }

  waitAndRemove('aside[aria-label="LinkedIn News"]');
}

function removeUpsellLinks() {
  waitAndRemove(".premium-upsell-link--extra-long");
  waitAndRemove(".premium-upsell-link");
  waitAndRemove(
    'span[class="global-nav__secondary-premium-cta-text"]',
    (node) => node.parentElement.parentElement.parentElement.remove(),
  );
  waitAndRemove(
    'span[class="feed-identity-module__premium-cta-text"]',
    (node) => node.closest('div[class^="artdeco-card"]')?.remove(),
  );

  // Remove upsell section on mynetwork page
  waitAndRemove(
    'div[data-view-name="premium-upsell-card"]',
    (node) => (node.closest("section").style.display = "none"),
  );

  // Remove "try premium for $0" navbar menu item
  waitAndRemove(
    'a[data-view-name="premium-nav-upsell-text"]',
    (node) => (node.closest("li").style.display = "none"),
  );

  // Remove "try 1 month of premium for $0" in profile dropdown
  waitAndRemove('div[data-view-name="nav-me-my-premium"]', (node) =>
    node.parentElement.remove(),
  );

  // Remove premium upsell on contact info edit card
  waitAndRemove('h3[class$="card-upsell-v2__headline"]', (node) =>
    node.parentElement?.parentElement?.parentElement?.remove(),
  );
}

function removeRightSidebarOnProfile() {
  waitAndRemove(".scaffold-layout__aside");
}

function removeForBusinessDropDown() {
  document.querySelector('span[title="For Business"]')?.closest("li")?.remove();
}

function removeProfileEnhanceCTAs() {
  // Remove enhance button from top of profile
  waitForKeyElements(
    'button[class^="pvs-profile-actions__custom-action"]',
    function (nodes) {
      var customActionButtons = document.querySelectorAll(
        'button[class^="pvs-profile-actions__custom-action"]',
      );
      customActionButtons.forEach((button) => {
        if (
          button.innerText &&
          button.innerText.trim().toLowerCase() === "enhance profile"
        ) {
          button.remove();
        }
      });
    },
  );

  // Premium upsell with "enhance with AI" buttons on edit experience page
  waitForKeyElements(
    'svg[data-test-icon="premium-signal-ai-small"]',
    function (nodes) {
      var aiIcons = document.querySelectorAll(
        'svg[data-test-icon="premium-signal-ai-small"]',
      );
      aiIcons.forEach((icon) => {
        icon.closest("button").remove();
      });
    },
  );

  // Premium upsell with "enhance with AI" suggestion on edit about modal
  waitAndRemove('div[class^="ai-suggestions-bar"]');
}

function removeFeed() {
  if (!SETTINGS[SETTING_REMOVE_FEED].currentValue()) {
    return;
  }

  waitAndRemove('main[aria-label="Main Feed"]', (node) => {
    node.querySelector('div[class="relative"]')?.remove();
    var buttons = node.querySelectorAll("button");
    if (buttons.length > 0) {
      buttons[buttons.length - 1].remove();
    }
  });
}

function removeUpsellsFromEditIntroModal() {
  waitAndRemove('div[class$="pe-profile-top-card-form__upsell-wrapper"]');
}

function removeUpsellsFromOtherProfiles() {
  waitAndRemove('button[class="pv-top-card__premium-feature-banner"]');
}

function removeUpsellsFromSearchResults() {
  waitAndRemove('button[id="searchFilter_upsellFilter"]', (node) =>
    node.closest('li[class="search-reusables__primary-filter"]')?.remove(),
  );
}

function removeUpsellsFromSearchAppearances() {
  waitAndRemove(
    'div[class="member-analytics-addon-insight-v2  member-analytics-addon-insight-v2--bg-default"]',
  );
}

function removeSuggestedSearches() {
  waitAndRemove('ul[aria-label="Search suggestions"]');
  waitAndRemove(
    'h2[class="search-typeahead-v2__section-header pt3 pb2 t-black ph4 t-14 search-typeahead-v2__section-header--top-divide t-bold"]',
  );
}

// Shows up when you are on the /notifications page
function removeTurnNotificationsBackOnRequestBanner() {
  waitAndRemove('div[class="nt-setting-banner__container"]', (node) =>
    node.closest("article").remove(),
  );
}

function removeUpsellLinksFromJobsSearch() {
  // Remove the upsell from the job posting
  waitAndRemove(
    'a[class="ember-view job-details-how-you-fit__upsell-link"]',
    (node) => node.closest("div").remove(),
  );

  // Remove the upsell from the all filters sidebar on the right
  waitAndRemove('li[class="search-reusables__secondary-filters-upsell"]');
}

(function () {
  "use strict";

  updateSettingsMenu();

  removeNotificationBadgeFromHomeIcon();
  removeNewsFromRightSidebar();
  removeRightSidebarOnProfile();
  removeProfilePrompts();
  removeForBusinessDropDown();
  removeFeed();
  removeProfileEnhanceCTAs();
  removeUpsellLinks();
  removeUpsellLinksFromJobsSearch();
  removeUpsellsFromEditIntroModal();
  removeUpsellsFromOtherProfiles();
  removeUpsellsFromSearchResults();
  removeUpsellsFromSearchAppearances();
  removeSuggestedSearches();
  removeTurnNotificationsBackOnRequestBanner();
})();
