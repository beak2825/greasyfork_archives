// ==UserScript==
// @name         🐭️ MouseHunt Utils
// @author       bradp
// @version      1.11.0
// @description  MouseHunt Utils is a library of functions that can be used to make other MouseHunt userscripts easily.
// @license      MIT
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// ==/UserScript==

/* eslint-disable no-unused-vars */

/**
 * Add styles to the page.
 *
 * @author bradp
 * @since 1.0.0
 *
 * @example <caption>Basic usage</caption>
 * addStyles(`.my-class {
 *   color: red;
 * }`);
 *
 * @example <caption>With an identifier</caption>
 * addStyles(`.my-class {
 * display: none;
 * }`, 'my-identifier');
 *
 * @example <caption>With an identifier, but will only add the styles once</caption>
 * addStyles(`.my-other-class {
 * color: blue;
 * }`, 'my-identifier', true);
 *
 * @param {string}  styles     The styles to add.
 * @param {string}  identifier The identifier to use for the style element.
 * @param {boolean} once       Only add the styles once for the identifier.
 *
 * @return {Element} The style element.
 */
const addStyles = (styles, identifier = 'mh-utils-custom-styles', once = false) => {
  identifier = `mh-utils-${identifier}`;

  // Check to see if the existing element exists.
  const existingStyles = document.getElementById(identifier);

  // If so, append our new styles to the existing element.
  if (existingStyles) {
    if (once) {
      return existingStyles;
    }

    existingStyles.innerHTML += styles;
    return existingStyles;
  }

  // Otherwise, create a new element and append it to the head.
  const style = document.createElement('style');
  style.id = identifier;
  style.innerHTML = styles;
  document.head.appendChild(style);

  return style;
};

/**
 * Do something when ajax requests are completed.
 *
 * @author bradp
 * @since 1.0.0
 *
 * @example <caption>Basic usage</caption>
 * onRequest((response) => {
 *  console.log(response);
 * }, 'managers/ajax/turns/activeturn.php');
 *
 * @example <caption>Basic usage, but skip the success check</caption>
 * onRequest((response) => {
 * console.log(response);
 * }, 'managers/ajax/turns/activeturn.php', true);
 *
 * @example <caption>Basic usage, running for all ajax requests</caption>
 * onRequest((response) => {
 * console.log(response);
 * });
 *
 * @param {Function} callback    The callback to call when an ajax request is completed.
 * @param {string}   url         The url to match. If not provided, all ajax requests will be matched.
 * @param {boolean}  skipSuccess Skip the success check.
 */
const onRequest = (callback, url = null, skipSuccess = false) => {
  const req = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
      if (this.responseText) {
        let response = {};
        try {
          response = JSON.parse(this.responseText);
        } catch (e) {
          return;
        }

        if (response.success || skipSuccess) {
          if (! url) {
            callback(response);
            return;
          }

          if (this.responseURL.indexOf(url) !== -1) {
            callback(response);
          }
        }
      }
    });
    req.apply(this, arguments);
  };
};

const onAjaxRequest = onRequest;

/**
 * Run the callbacks depending on visibility.
 *
 * @author bradp
 * @since 1.0.0
 *
 * @ignore
 *
 * @param {Object} settings   Settings object.
 * @param {Node}   parentNode The parent node.
 * @param {Object} callbacks  The callbacks to run.
 *
 * @return {Object} The settings.
 */
const runCallbacks = (settings, parentNode, callbacks) => {
  // Loop through the keys on our settings object.
  Object.keys(settings).forEach((key) => {
    // If the parentNode that's passed in contains the selector for the key.
    if (parentNode && parentNode.classList && parentNode.classList.contains(settings[key].selector)) {
      // Set as visible.
      settings[key].isVisible = true;

      // If there is a show callback, run it.
      if (callbacks[key] && callbacks[key].show) {
        callbacks[key].show();
      }
    } else if (settings[key].isVisible) {
      // Mark as not visible.
      settings[key].isVisible = false;

      // If there is a hide callback, run it.
      if (callbacks[key] && callbacks[key].hide) {
        callbacks[key].hide();
      }
    }
  });

  return settings;
};

/**
 * Do something when the overlay is shown or hidden.
 *
 * @param {Object}   callbacks
 * @param {Function} callbacks.show   The callback to call when the overlay is shown.
 * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
 * @param {Function} callbacks.change The callback to call when the overlay is changed.
 */
const onOverlayChange = (callbacks) => {
  // Track the different overlay states.
  let overlayData = {
    map: {
      isVisible: false,
      selector: 'treasureMapPopup'
    },
    item: {
      isVisible: false,
      selector: 'itemViewPopup'
    },
    mouse: {
      isVisible: false,
      selector: 'mouseViewPopup'
    },
    image: {
      isVisible: false,
      selector: 'largerImage'
    },
    convertible: {
      isVisible: false,
      selector: 'convertibleOpenViewPopup'
    },
    adventureBook: {
      isVisible: false,
      selector: 'adventureBookPopup'
    },
    marketplace: {
      isVisible: false,
      selector: 'marketplaceViewPopup'
    },
    gifts: {
      isVisible: false,
      selector: 'giftSelectorViewPopup'
    },
    support: {
      isVisible: false,
      selector: 'supportPageContactUsForm'
    },
    premiumShop: {
      isVisible: false,
      selector: 'MHCheckout'
    }
  };

  // Observe the overlayPopup element for changes.
  const observer = new MutationObserver(() => {
    if (callbacks.change) {
      callbacks.change();
    }

    // Grab the overlayPopup element and make sure it has classes on it.
    const overlayType = document.getElementById('overlayPopup');
    if (overlayType && overlayType.classList.length <= 0) {
      return;
    }

    // Grab the overlayBg and check if it is visible or not.
    const overlayBg = document.getElementById('overlayBg');
    if (overlayBg && overlayBg.classList.length > 0) {
      // If there's a show callback, run it.
      if (callbacks.show) {
        callbacks.show();
      }
    } else if (callbacks.hide) {
      // If there's a hide callback, run it.
      callbacks.hide();
    }

    // Run all the specific callbacks.
    overlayData = runCallbacks(overlayData, overlayType, callbacks);
  });

  // Observe the overlayPopup element for changes.
  const observeTarget = document.getElementById('overlayPopup');
  if (observeTarget) {
    observer.observe(observeTarget, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
};

/**
 * TODO: update this docblock.
 *
 * @param {*} callback
 */
const onOverlayClose = (callback) => {
  eventRegistry.addEventListener('js_dialog_hide', callback);
};

/**
 * TODO: update this docblock.
 */
const getDialogMapping = () => {
  return {
    treasureMapPopup: 'map',
    itemViewPopup: 'item',
    mouseViewPopup: 'mouse',
    largerImage: 'image',
    convertibleOpenViewPopup: 'convertible',
    adventureBookPopup: 'adventureBook',
    marketplaceViewPopup: 'marketplace',
    giftSelectorViewPopup: 'gifts',
    supportPageContactUsForm: 'support',
    MHCheckout: 'premiumShop',
  };
};

/**
 * TODO: update this docblock.
 *
 * @param {*} callback
 * @param {*} overlay
 * @param {*} once
 */
const onDialogShow = (callback, overlay = null, once = false) => {
  eventRegistry.addEventListener('js_dialog_show', () => {
    if (! activejsDialog) {
      return;
    }

    // Get all the tokens and check the content.
    const tokens = activejsDialog.getAllTokens();

    // Make sure we have the 'content' key.
    // For item and mouse views, the entire event fires twice, once while loading and
    // once when the content is loaded. We only want to run this once, so we check if
    // the content is empty in a weird way.
    if (
      ! tokens ||
      ! tokens['{*content*}'] ||
      ! tokens['{*content*}'].value ||
      tokens['{*content*}'].value === '' ||
      tokens['{*content*}'].value.indexOf('data-item-type=""') > -1 || // Item view.
      tokens['{*content*}'].value.indexOf('data-mouse-id=""') > -1 // Mouse view.
    ) {
      return;
    }

    // Grab the attributes of the dialog to determine the type.
    const atts = activejsDialog.getAttributes();
    const dialogType = atts.className
      .replace('jsDialogFixed', '')
      .replace('wide', '')
      .replace('default', '')
      .replaceAll('  ', ' ')
      .replaceAll(' ', '.')
      .trim();

    // Make sure this only ran once within the last 100ms for the same overlay.
    if (window.mhutils?.lastDialog?.overlay === dialogType && (Date.now() - window.mhutils.lastDialog.timestamp) < 250) {
      return;
    }

    const lastDialog = {
      overlay: dialogType,
      timestamp: Date.now(),
    };

    window.mhutils = window.mhutils ? { ...window.mhutils, ...lastDialog } : lastDialog;

    if (! overlay && 'function' === typeof callback) {
      return callback();
    }

    const dialogMapping = getDialogMapping();

    if ('function' === typeof callback && (overlay === dialogType || overlay === dialogMapping[dialogType])) {
      return callback();
    }
  }, null, once);
};

/**
 * TODO: update this docblock.
 *
 * @param {*} callback
 * @param {*} overlay
 * @param {*} once
 */
const onDialogHide = (callback, overlay = null, once = false) => {
  eventRegistry.addEventListener('js_dialog_hide', () => {
    const dialogType = window?.mhutils?.lastDialog?.overlay || null;
    window.mhutils.lastDialog = {};

    if (! overlay) {
      return callback();
    }

    const dialogMapping = getDialogMapping();
    if (overlay === dialogType || overlay === dialogMapping[dialogType]) {
      return callback();
    }
  }, null, once);
};

/**
 * Do something when the page or tab changes.
 *
 * @param {Object}   callbacks
 * @param {Function} callbacks.show   The callback to call when the page is navigated to.
 * @param {Function} callbacks.hide   The callback to call when the page is navigated away from.
 * @param {Function} callbacks.change The callback to call when the page is changed.
 */
const onPageChange = (callbacks) => {
  // Track our page tab states.
  let tabData = {
    blueprint: { isVisible: null, selector: 'showBlueprint' },
    tem: { isVisible: false, selector: 'showTrapEffectiveness' },
    trap: { isVisible: false, selector: 'editTrap' },
    camp: { isVisible: false, selector: 'PageCamp' },
    travel: { isVisible: false, selector: 'PageTravel' },
    inventory: { isVisible: false, selector: 'PageInventory' },
    shop: { isVisible: false, selector: 'PageShops' },
    mice: { isVisible: false, selector: 'PageAdversaries' },
    friends: { isVisible: false, selector: 'PageFriends' },
    sendSupplies: { isVisible: false, selector: 'PageSupplyTransfer' },
    team: { isVisible: false, selector: 'PageTeam' },
    tournament: { isVisible: false, selector: 'PageTournament' },
    news: { isVisible: false, selector: 'PageNews' },
    scoreboards: { isVisible: false, selector: 'PageScoreboards' },
    discord: { isVisible: false, selector: 'PageJoinDiscord' },
    preferences: { isVisible: false, selector: 'PagePreferences' },
    profile: { isVisible: false, selector: 'HunterProfile' },
  };

  // Observe the mousehuntContainer element for changes.
  const observer = new MutationObserver(() => {
    // If there's a change callback, run it.
    if (callbacks.change) {
      callbacks.change();
    }

    // Grab the container element and make sure it has classes on it.
    const mhContainer = document.getElementById('mousehuntContainer');
    if (mhContainer && mhContainer.classList.length > 0) {
      // Run the callbacks.
      tabData = runCallbacks(tabData, mhContainer, callbacks);
    }
  });

  // Observe the mousehuntContainer element for changes.
  const observeTarget = document.getElementById('mousehuntContainer');
  if (observeTarget) {
    observer.observe(observeTarget, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
};

/**
 * Do something when the trap tab is changed.
 *
 * @param {Object} callbacks
 */
const onTrapChange = (callbacks) => {
  // Track our trap states.
  let trapData = {
    bait: {
      isVisible: false,
      selector: 'bait'
    },
    base: {
      isVisible: false,
      selector: 'base'
    },
    weapon: {
      isVisible: false,
      selector: 'weapon'
    },
    charm: {
      isVisible: false,
      selector: 'trinket'
    },
    skin: {
      isVisible: false,
      selector: 'skin'
    }
  };

  // Observe the trapTabContainer element for changes.
  const observer = new MutationObserver(() => {
    // Fire the change callback.
    if (callbacks.change) {
      callbacks.change();
    }

    // If we're not viewing a blueprint tab, bail.
    const mhContainer = document.getElementById('mousehuntContainer');
    if (mhContainer.classList.length <= 0 || ! mhContainer.classList.contains('showBlueprint')) {
      return;
    }

    // If we don't have the container, bail.
    const trapContainerParent = document.querySelector('.campPage-trap-blueprintContainer');
    if (! trapContainerParent || ! trapContainerParent.children || ! trapContainerParent.children.length > 0) {
      return;
    }

    // If we're not in the itembrowser, bail.
    const trapContainer = trapContainerParent.children[0];
    if (! trapContainer || trapContainer.classList.length <= 0 || ! trapContainer.classList.contains('campPage-trap-itemBrowser')) {
      return;
    }

    // Run the callbacks.
    trapData = runCallbacks(trapData, trapContainer, callbacks);
  });

  // Grab the campPage-trap-blueprintContainer element and make sure it has children on it.
  const observeTargetParent = document.querySelector('.campPage-trap-blueprintContainer');
  if (! observeTargetParent || ! observeTargetParent.children || ! observeTargetParent.children.length > 0) {
    return;
  }

  // Observe the first child of the campPage-trap-blueprintContainer element for changes.
  const observeTarget = observeTargetParent.children[0];
  if (observeTarget) {
    observer.observe(observeTarget, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
};

/**
 * Add something to the event registry.
 *
 * @param {string}   event    The event name.
 * @param {Function} callback The callback to run when the event is fired.
 * @param {boolean}  remove   Whether or not to remove the event listener after it's fired.
 */
const onEvent = (event, callback, remove = false) => {
  eventRegistry.addEventListener(event, callback, null, remove);
};

/**
 * Do something when the user travels to a location.
 *
 * @param {string} location                  The location traveled to.
 * @param {Object} options                   The options
 * @param {string} options.shouldAddReminder Whether or not to add a reminder.
 * @param {string} options.title             The title of the reminder.
 * @param {string} options.text              The text of the reminder.
 * @param {string} options.button            The button text of the reminder.
 * @param {string} options.action            The action to take when the button is clicked.
 * @param {string} options.callback          The callback to run when the user is at the location.
 */
const onTravel = (location, options) => {
  eventRegistry.addEventListener('travel_complete', () => onTravelCallback(location, options));
};

/**
 * Do something when the user travels to a location.
 * This is a callback for the onTravel function.
 *
 * @param {string} location                  The location traveled to.
 * @param {Object} options                   The options
 * @param {string} options.shouldAddReminder Whether or not to add a reminder.
 * @param {string} options.title             The title of the reminder.
 * @param {string} options.text              The text of the reminder.
 * @param {string} options.button            The button text of the reminder.
 * @param {string} options.action            The action to take when the button is clicked.
 * @param {string} options.callback          The callback to run when the user is at the location.
 */
const onTravelCallback = (location, options) => {
  if (location && location !== getCurrentLocation()) {
    return;
  }

  if (options?.shouldAddReminder) {
    showHornMessage({
      title: options.title || '',
      text: options.text || '',
      button: options.button || 'Dismiss',
      action: options.action || null,
    });
  }

  if (options.callback) {
    options.callback();
  }
};

/**
 * TODO: update this docblock.
 *
 * @param {string} targetPage         The target page.
 * @param {string} targetTab          The target tab.
 * @param {string} targetSubtab       The target subtab.
 * @param {string} forceCurrentPage   The current page.
 * @param {string} forceCurrentTab    The current tab.
 * @param {string} forceCurrentSubtab The current subtab.
 */
const matchesCurrentPage = (targetPage = null, targetTab = null, targetSubtab = null, forceCurrentPage = null, forceCurrentTab = null, forceCurrentSubtab = null) => {
  if (! targetPage) {
    return false;
  }

  // Only targetPage is being checked.
  const currentPage = forceCurrentPage || getCurrentPage();
  if (! targetTab) {
    return currentPage === targetPage;
  }

  // Only targetTab is being checked.
  const currentTab = forceCurrentTab || getCurrentTab();
  if (! targetSubtab) {
    return currentPage === targetPage && currentTab === targetTab;
  }

  // Only targetSubtab is being checked.
  const currentSubtab = forceCurrentSubtab || getCurrentSubtab();
  if (currentSubtab === currentTab) {
    return currentPage === targetPage && currentTab === targetTab;
  }

  return currentPage === targetPage && currentTab === targetTab && currentSubtab === targetSubtab;
};

/*
  onNavigation(() => console.log('mouse stats by location'),
    {
      page: 'adversaries',
      tab: 'your_stats',
      subtab: 'location'
    }
  );

  onNavigation(() => console.log('friend request page'),
    {
      page:'friends',
      tab: 'requests'
    }
  );

  onNavigation(() => console.log('hunter profile, but not when refreshing the page'),
    {
      page: 'hunterprofile',
      onLoad: true
    }
  );
  */

/**
 * TODO: update this docblock
 *
 * @param {Function} callback       The callback to run when the user navigates to the page.
 * @param {Object}   options        The options
 * @param {string}   options.page   The page to watch for.
 * @param {string}   options.tab    The tab to watch for.
 * @param {string}   options.subtab The subtab to watch for.
 * @param {boolean}  options.onLoad Whether or not to run the callback on load.
 */
const onNavigation = (callback, options = {}) => {
  const defaults = {
    page: false,
    tab: false,
    subtab: false,
    onLoad: true,
  };

  // merge the defaults with the options
  const { page, tab, subtab, onLoad } = Object.assign(defaults, options);

  // If we don't pass in a page, then we want to run the callback on every page.
  let bypassMatch = false;
  if (! page) {
    bypassMatch = true;
  }

  // We do this once on load in case we are starting on the page we want to watch for.
  if (onLoad) {
    if (bypassMatch || matchesCurrentPage(page, tab, subtab)) {
      callback();
    }
  }

  eventRegistry.addEventListener('set_page', (e) => {
    const tabs = e?.data?.tabs || {};

    const currentTab = Object.keys(tabs).find((key) => tabs[key].is_active_tab);
    const forceCurrentTab = currentTab?.type;

    if (! subtab) {
      if (matchesCurrentPage(page, tab, false, getCurrentPage(), forceCurrentTab)) {
        callback();
      }

      return;
    }

    if (currentTab?.subtabs && currentTab?.subtabs.length > 0) {
      const forceSubtab = currentTab.subtabs.find((searchTab) => searchTab.is_active_subtab).subtab_type;

      if (matchesCurrentPage(page, tab, subtab, getCurrentPage(), forceCurrentTab, forceSubtab)) {
        callback();
      }
    }
  });

  eventRegistry.addEventListener('set_tab', (e) => {
    const forceCurrentTab = e.page_arguments.tab;
    const forceCurrentSubtab = e.page_arguments.sub_tab;

    if (matchesCurrentPage(page, tab, subtab, getCurrentPage(), forceCurrentTab, forceCurrentSubtab)) {
      callback();
    }
  });
};

const onNavigate = onNavigation;

/**
 * Get the current page slug.
 *
 * @return {string} The page slug.
 */
const getCurrentPage = () => {
  return hg.utils.PageUtil.getCurrentPage().toLowerCase(); // eslint-disable-line no-undef
};

/**
 * Get the current page tab, defaulting to the current page if no tab is found.
 *
 * @return {string} The page tab.
 */
const getCurrentTab = () => {
  const tab = hg.utils.PageUtil.getCurrentPageTab().toLowerCase(); // eslint-disable-line no-undef
  if (tab.length <= 0) {
    return getCurrentPage();
  }

  return tab;
};

/**
 * Get the current page sub tab, defaulting to the current tab if no sub tab is found.
 *
 * @return {string} The page tab.
 */
const getCurrentSubtab = () => {
  const subtab = hg.utils.PageUtil.getCurrentPageSubTab();
  if (! subtab || subtab.length <= 0) {
    return getCurrentTab();
  }

  return subtab.toLowerCase();
};

// Backwards compatibility.
const getCurrentSubTab = getCurrentSubtab;

/**
 * Check if the overlay is visible.
 *
 * @return {boolean} True if the overlay is visible, false otherwise.
 */
const isOverlayVisible = () => {
  return activejsDialog && activejsDialog.isVisible();
};

/**
 * Get the current overlay.
 *
 * @return {string} The current overlay.
 */
const getCurrentOverlay = () => {
  const overlay = document.getElementById('overlayPopup');
  if (overlay && overlay.classList.length <= 0) {
    return null;
  }

  let overlayType = overlay.classList.value;
  overlayType = overlayType.replace('jsDialogFixed', '');
  overlayType = overlayType.replace('default', '');
  overlayType = overlayType.replace('wide', '');
  overlayType = overlayType.replace('ajax', '');
  overlayType = overlayType.replace('overlay', '');

  // Replace some overlay types with more readable names.
  overlayType = overlayType.replace('treasureMapPopup', 'map');
  overlayType = overlayType.replace('itemViewPopup', 'item');
  overlayType = overlayType.replace('mouseViewPopup', 'mouse');
  overlayType = overlayType.replace('largerImage', 'image');
  overlayType = overlayType.replace('convertibleOpenViewPopup', 'convertible');
  overlayType = overlayType.replace('adventureBookPopup', 'adventureBook');
  overlayType = overlayType.replace('marketplaceViewPopup', 'marketplace');
  overlayType = overlayType.replace('giftSelectorViewPopup', 'gifts');
  overlayType = overlayType.replace('supportPageContactUsForm', 'support');
  overlayType = overlayType.replace('MHCheckout', 'premiumShop');

  return overlayType.trim();
};

/**
 * Get the current location.
 *
 * @return {string} The current location.
 */
const getCurrentLocation = () => {
  const location = user?.environment_type || '';
  return location.toLowerCase();
};

/**
 * Check if the user is logged in.
 *
 * @return {boolean} True if the user is logged in, false otherwise.
 */
const isLoggedIn = () => {
  return user.length > 0 && 'login' !== getCurrentPage();
};

/**
 * Get the saved settings.
 *
 * @param {string}  key          The key to get.
 * @param {boolean} defaultValue The default value.
 * @param {string}  identifier   The identifier for the settings.
 *
 * @return {Object} The saved settings.
 */
const getSetting = (key = null, defaultValue = null, identifier = 'mh-utils-settings') => {
  // Grab the local storage data.
  const settings = JSON.parse(localStorage.getItem(identifier)) || {};

  // If we didn't get a key passed in, we want all the settings.
  if (! key) {
    return settings;
  }

  // If the setting doesn't exist, return the default value.
  if (Object.prototype.hasOwnProperty.call(settings, key)) {
    return settings[key];
  }

  return defaultValue;
};

/**
 * Save a setting.
 *
 * @param {string}  key        The setting key.
 * @param {boolean} value      The setting value.
 * @param {string}  identifier The identifier for the settings.
 */
const saveSetting = (key, value, identifier = 'mh-utils-settings') => {
  // Grab all the settings, set the new one, and save them.
  const settings = getSetting(null, {}, identifier);
  settings[key] = value;

  localStorage.setItem(identifier, JSON.stringify(settings));
};

/**
 * Save a setting and toggle the class in the settings UI.
 *
 * @ignore
 *
 * @param {Node}    node  The setting node to animate.
 * @param {string}  key   The setting key.
 * @param {boolean} value The setting value.
 */
const saveSettingAndToggleClass = (node, key, value, identifier = 'mh-utils-settings') => {
  node.parentNode.parentNode.classList.add('busy');

  // Toggle the state of the checkbox.
  node.classList.toggle('active');

  // Save the setting.
  saveSetting(key, value, identifier);

  // Add the completed class & remove it in a second.
  node.parentNode.parentNode.classList.remove('busy');
  node.parentNode.parentNode.classList.add('completed');
  setTimeout(() => {
    node.parentNode.parentNode.classList.remove('completed');
  }, 1000);

  addSettingRefreshReminder();
};

/**
 * Make the settings tab.
 *
 * @param {string} identifier The identifier for the settings.
 * @param {string} name       The name of the settings tab.
 */
const addSettingsTab = (identifier = 'userscript-settings', name = 'Userscript Settings') => {
  addSettingsTabOnce(identifier, name);
  onPageChange({ preferences: { show: () => addSettingsTabOnce(identifier, name) } });

  return identifier;
};

/**
 * Make the settings tab once.
 *
 * @ignore
 *
 * @param {string} identifier The identifier for the settings.
 * @param {string} name       The name of the settings tab.
 */
const addSettingsTabOnce = (identifier = 'userscript-settings', name = 'Userscript Settings') => {
  if ('preferences' !== getCurrentPage()) {
    return;
  }

  const existingSettings = document.querySelector(`#${identifier}`);
  if (existingSettings) {
    return;
  }

  const tabsContainer = document.querySelector('.mousehuntHud-page-tabHeader-container');
  if (! tabsContainer) {
    return;
  }

  const tabsContentContainer = document.querySelector('.mousehuntHud-page-tabContentContainer');
  if (! tabsContentContainer) {
    return;
  }

  // make sure the identifier is unique and safe to use as a class.
  identifier = identifier.replace(/[^a-z0-9-_]/gi, '');

  const settingsTab = document.createElement('a');
  settingsTab.id = identifier;
  settingsTab.href = '#';
  settingsTab.classList.add('mousehuntHud-page-tabHeader', identifier);
  settingsTab.setAttribute('data-tab', identifier);
  settingsTab.setAttribute('onclick', 'hg.utils.PageUtil.onclickPageTabHandler(this); return false;');

  const settingsTabText = document.createElement('span');
  settingsTabText.innerText = name;

  settingsTab.appendChild(settingsTabText);
  tabsContainer.appendChild(settingsTab);

  const settingsTabContent = document.createElement('div');
  settingsTabContent.classList.add('mousehuntHud-page-tabContent', 'game_settings', identifier);
  settingsTabContent.setAttribute('data-tab', identifier);

  tabsContentContainer.appendChild(settingsTabContent);

  if (identifier === getCurrentTab()) {
    const tab = document.getElementById(identifier);
    if (tab) {
      tab.click();
    }
  }
};

/**
 * Add a setting to the preferences page, both on page load and when the page changes.
 *
 * @param {string}  name         The setting name.
 * @param {string}  key          The setting key.
 * @param {boolean} defaultValue The default value.
 * @param {string}  description  The setting description.
 * @param {Object}  section      The section settings.
 * @param {string}  tab          The tab to add the settings to.
 * @param {Object}  settings     The settings for the settings.
 */
const addSetting = (name, key, defaultValue = true, description = '', section = {}, tab = 'userscript-settings', settings = null) => {
  onPageChange({ preferences: { show: () => addSettingOnce(name, key, defaultValue, description, section, tab, settings) } });
  addSettingOnce(name, key, defaultValue, description, section, tab, settings);

  addSettingRefreshReminder();
  onPageChange({ preferences: { show: addSettingRefreshReminder } });
};

/**
 * Add a setting to the preferences page.
 *
 * @ignore
 *
 * @param {string}  name            The setting name.
 * @param {string}  key             The setting key.
 * @param {boolean} defaultValue    The default value.
 * @param {string}  description     The setting description.
 * @param {Object}  section         The section settings.
 * @param {string}  tab             The tab to add the settings to.
 * @param {Object}  settingSettings The settings for the settings.
 */
const addSettingOnce = (name, key, defaultValue = true, description = '', section = {}, tab = 'userscript-settings', settingSettings = null) => {
  // Make sure we have the container for our settings.
  const container = document.querySelector(`.mousehuntHud-page-tabContent.${tab}`);
  if (! container) {
    return;
  }

  section = {
    id: section.id || 'settings',
    name: section.name || 'Userscript Settings',
    description: section.description || '',
  };

  let tabId = 'mh-utils-settings';
  if (tab !== 'userscript-settings') {
    tabId = tab;
  }

  section.id = `${tabId}-${section.id.replace(/[^a-z0-9-_]/gi, '')}`;

  // If we don't have our custom settings section, then create it.
  let sectionExists = document.querySelector(`#${section.id}`);
  if (! sectionExists) {
    // Make the element, add the ID and class.
    const title = document.createElement('div');
    title.id = section.id;
    title.classList.add('PagePreferences__title');

    // Set the title of our section.
    const titleText = document.createElement('h3');
    titleText.classList.add('PagePreferences__titleText');
    titleText.textContent = section.name;

    // Append the title.
    title.appendChild(titleText);

    // Add a separator.
    const seperator = document.createElement('div');
    seperator.classList.add('PagePreferences__separator');

    // Append the separator.
    title.appendChild(seperator);

    // Append it.
    container.appendChild(title);

    sectionExists = document.querySelector(`#${section.id}`);

    if (section.description) {
      const settingSubHeader = makeElement('h4', ['settings-subheader', 'mh-utils-settings-subheader'], section.description);
      sectionExists.insertBefore(settingSubHeader, seperator);

      addStyles(`.mh-utils-settings-subheader {
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 10px;
        color: #848484;
      }`, 'mh-utils-settings-subheader', true);
    }
  }

  // If we already have a setting visible for our key, bail.
  const settingExists = document.getElementById(`${section.id}-${key}`);
  if (settingExists) {
    return;
  }

  // Create the markup for the setting row.
  const settings = document.createElement('div');
  settings.classList.add('PagePreferences__settingsList');
  settings.id = `${section.id}-${key}`;

  const settingRow = document.createElement('div');
  settingRow.classList.add('PagePreferences__setting');

  const settingRowLabel = document.createElement('div');
  settingRowLabel.classList.add('PagePreferences__settingLabel');

  const settingName = document.createElement('div');
  settingName.classList.add('PagePreferences__settingName');
  settingName.innerHTML = name;

  const defaultSettingText = document.createElement('div');
  defaultSettingText.classList.add('PagePreferences__settingDefault');

  if (settingSettings && (settingSettings.type === 'select' || settingSettings.type === 'multi-select')) {
    addStyles(`.PagePreferences .mousehuntHud-page-tabContent.game_settings.userscript-settings .settingRow .settingRow-action-inputContainer.select.busy:before,
    .PagePreferences .mousehuntHud-page-tabContent.game_settings.userscript-settings .settingRow .settingRow-action-inputContainer.select.completed:before,
    .PagePreferences .mousehuntHud-page-tabContent.game_settings.better-mh-settings .settingRow .settingRow-action-inputContainer.select.busy:before,
    .PagePreferences .mousehuntHud-page-tabContent.game_settings.better-mh-settings .settingRow .settingRow-action-inputContainer.select.completed:before {
      left: unset;
      right: -25px;
      top: 30px;
    }

    .PagePreferences .mousehuntHud-page-tabContent.game_settings .settingRow .name {
      height: unset;
      min-height: 20px;
    }

    .PagePreferences__settingAction.inputDropdownWrapper.busy:before,
    .PagePreferences__settingAction.inputDropdownWrapper.completed:before {
      left: unset;
      right: -40px;
    }

    .inputBoxContainer.multiSelect {
      max-width: 400px;
    }`, 'mh-utils-settings-select', true);

    defaultSettingText.textContent = defaultValue.map((item) => item.name).join(', ');
  } else {
    defaultSettingText.textContent = defaultValue ? 'Enabled' : 'Disabled';
  }

  defaultSettingText.textContent = `Default setting: ${defaultSettingText.textContent}`;

  const settingDescription = makeElement('div', 'PagePreferences__settingDescription');
  settingDescription.innerHTML = description;

  settingRowLabel.appendChild(settingName);
  settingRowLabel.appendChild(defaultSettingText);
  settingRowLabel.appendChild(settingDescription);

  const settingRowAction = makeElement('div', 'PagePreferences__settingAction');
  const settingRowInput = makeElement('div', 'settingRow-action-inputContainer');

  if (settingSettings && (settingSettings.type === 'select' || settingSettings.type === 'multi-select')) {
    // Create the dropdown.
    const settingRowInputDropdown = document.createElement('div');
    settingRowInputDropdown.classList.add('inputBoxContainer');

    if (settingSettings.type === 'multi-select') {
      settingRowInputDropdown.classList.add('multiSelect');
      settingRowInput.classList.add('multiSelect', 'select');
    }

    const amount = settingSettings.type === 'multi-select' ? settingSettings.number : 1;

    const makeOption = (option, foundSelected, currentSetting, dValue, i) => {
      const settingRowInputDropdownSelectOption = document.createElement('option');
      settingRowInputDropdownSelectOption.value = option.value;
      settingRowInputDropdownSelectOption.textContent = option.name;

      if (currentSetting && currentSetting === option.value) {
        settingRowInputDropdownSelectOption.selected = true;
        foundSelected = true;
      } else if (! foundSelected && dValue && dValue[i] && dValue[i].value === option.value) {
        settingRowInputDropdownSelectOption.selected = true;
        foundSelected = true;
      }

      return {
        settingRowInputDropdownSelectOption,
        foundSelected
      };
    };

    // make a multi-select dropdown.
    for (let i = 0; i < amount; i++) {
      const settingRowInputDropdownSelect = document.createElement('select');
      settingRowInputDropdownSelect.classList.add('inputBox');

      if (settingSettings.type === 'multi-select') {
        settingRowInputDropdownSelect.classList.add('multiSelect');
      }

      const currentSetting = getSetting(`${key}-${i}`, null, tab);
      let foundSelected = false;

      settingSettings.options.forEach((option) => {
        // If the value is 'optgroup', then we want to make an optgroup and use the options inside of it.
        if (option.value === 'group') {
          const settingRowInputDropdownSelectOptgroup = document.createElement('optgroup');
          settingRowInputDropdownSelectOptgroup.label = option.name;

          option.options.forEach((optgroupOption) => {
            const result = makeOption(optgroupOption, foundSelected, currentSetting, defaultValue, i);
            foundSelected = result.foundSelected;
            settingRowInputDropdownSelectOptgroup.appendChild(result.settingRowInputDropdownSelectOption);
          });

          settingRowInputDropdownSelect.appendChild(settingRowInputDropdownSelectOptgroup);
        } else {
          const result = makeOption(option, foundSelected, currentSetting, defaultValue, i);
          foundSelected = result.foundSelected;
          settingRowInputDropdownSelect.appendChild(result.settingRowInputDropdownSelectOption);
        }
      });

      settingRowInputDropdown.appendChild(settingRowInputDropdownSelect);

      // Event listener for when the setting is clicked.
      settingRowInputDropdownSelect.onchange = (event) => {
        const parent = settingRowInputDropdownSelect.parentNode.parentNode.parentNode;
        parent.classList.add('inputDropdownWrapper');
        parent.classList.add('busy');

        // save the setting.
        saveSetting(`${key}-${i}`, event.target.value, tab);

        parent.classList.remove('busy');
        parent.classList.add('completed');
        setTimeout(() => {
          parent.classList.remove('completed');
        }, 1000);
      };

      settingRowInput.appendChild(settingRowInputDropdown);
      settingRowAction.appendChild(settingRowInput);
    }
  } else if (settingSettings && settingSettings.type === 'input') {
    addStyles(`.settingRow-action-inputContainer.inputText {
      display: flex;
      align-items: stretch;
      gap: 5px;
    }`, 'mh-utils-settings-input', true);

    const settingRowInputText = makeElement('input', 'inputBox');
    settingRowInputText.value = getSetting(key, defaultValue, tab);

    const inputSaveButton = makeElement('button', ['mousehuntActionButton', 'tiny', 'inputSaveButton']);
    makeElement('span', '', 'Save', inputSaveButton);

    // Event listener for when the setting is clicked.
    inputSaveButton.addEventListener('click', (event) => {
      const parent = event.target.parentNode.parentNode;
      parent.classList.add('inputDropdownWrapper');
      parent.classList.add('busy');

      // save the setting.
      saveSetting(key, settingRowInputText.value, tab);

      parent.classList.remove('busy');
      parent.classList.add('completed');
      setTimeout(() => {
        parent.classList.remove('completed');
      }, 1000);
    });

    settingRowInput.classList.add('inputText');

    settingRowInput.appendChild(settingRowInputText);
    settingRowInput.appendChild(inputSaveButton);
    settingRowAction.appendChild(settingRowInput);
  } else if (settingSettings && settingSettings.type === 'textarea') {
    addStyles(`.settingRow-action-inputContainer.textarea {
      display: flex;
      align-items: flex-end;
      gap: 5px;
    }

    .PagePreferences__setting.textarea {
      display: grid;
      grid-template-columns: 350px 1fr;
    }

    .textarea .inputBox {
      width: 100%;
      min-height: 45px;
    }

    .textarea .PagePreferences__settingAction {
        margin-bottom: 0;
    }`, 'mh-utils-settings-textarea', true);

    settingRow.classList.add('textarea');

    const settingRowInputText = makeElement('textarea', 'inputBox');
    settingRowInputText.value = getSetting(key, defaultValue, tab);

    const inputSaveButton = makeElement('button', ['mousehuntActionButton', 'tiny', 'inputSaveButton']);
    makeElement('span', '', 'Save', inputSaveButton);

    // Event listener for when the setting is clicked.
    inputSaveButton.addEventListener('click', (event) => {
      const parent = event.target.parentNode.parentNode;
      parent.classList.add('inputDropdownWrapper');
      parent.classList.add('busy');

      // save the setting.
      saveSetting(key, settingRowInputText.value, tab);

      parent.classList.remove('busy');
      parent.classList.add('completed');
      setTimeout(() => {
        parent.classList.remove('completed');
      }, 1000);
    });

    settingRowInput.classList.add('textarea');

    settingRowInput.appendChild(settingRowInputText);
    settingRowInput.appendChild(inputSaveButton);
    settingRowAction.appendChild(settingRowInput);
  } else {
    const settingRowInputCheckbox = document.createElement('div');
    settingRowInputCheckbox.classList.add('mousehuntSettingSlider');

    // Depending on the current state of the setting, add the active class.
    const currentSetting = getSetting(key, null, tab);
    let isActive = false;
    if (currentSetting) {
      settingRowInputCheckbox.classList.add('active');
      isActive = true;
    } else if (null === currentSetting && defaultValue) {
      settingRowInputCheckbox.classList.add('active');
      isActive = true;
    }

    // Event listener for when the setting is clicked.
    settingRowInputCheckbox.onclick = (event) => {
      saveSettingAndToggleClass(event.target, key, ! isActive, tab);
    };

    // Add the input to the settings row.
    settingRowInput.appendChild(settingRowInputCheckbox);
    settingRowAction.appendChild(settingRowInput);
  }

  // Add the label and action to the settings row.
  settingRow.appendChild(settingRowLabel);
  settingRow.appendChild(settingRowAction);

  // Add the settings row to the settings container.
  settings.appendChild(settingRow);
  sectionExists.appendChild(settings);
};

/**
 * Add a refresh reminder to the settings page.
 *
 * @ignore
 */
const addSettingRefreshReminder = () => {
  const existing = document.querySelector('.mh-utils-settings-refresh-message');
  if (existing) {
    return;
  }

  addStyles(`.mh-utils-settings-refresh-message {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    padding: 1em;
    font-size: 1.5em;
    text-align: center;
    background-color: #d6f2d6;
    border-top: 1px solid #6cc36c;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;
  }

  .mh-utils-settings-refresh-message-hidden {
    opacity: 0;
  }`, 'mh-utils-settings-refresh-message', true);

  const settingsToggles = document.querySelectorAll('.mousehuntSettingSlider');
  if (! settingsToggles) {
    return;
  }

  settingsToggles.forEach((toggle) => {
    if (toggle.getAttribute('data-has-refresh-reminder')) {
      return;
    }

    toggle.setAttribute('data-has-refresh-reminder', true);

    toggle.addEventListener('click', () => {
      const refreshMessage = document.querySelector('.mh-utils-settings-refresh-message');
      if (refreshMessage) {
        refreshMessage.classList.remove('mh-utils-settings-refresh-message-hidden');
      }

      setTimeout(() => {
        if (refreshMessage) {
          refreshMessage.classList.add('mh-utils-settings-refresh-message-hidden');
        }
      }, 5000);
    });
  });

  const existingRefreshMessage = document.querySelector('.mh-utils-settings-refresh-message');
  if (! existingRefreshMessage) {
    const body = document.querySelector('body');
    if (body) {
      makeElement('div', ['mh-utils-settings-refresh-message', 'mh-utils-settings-refresh-message-hidden'], 'Refresh the page to apply your changes.', body);
    }
  }
};

/**
 * POST a request to the server and return the response.
 *
 * @async
 * @param {string} url      The url to post to, not including the base url.
 * @param {Object} formData The form data to post.
 *
 * @return {Promise} The response.
 */
const doRequest = async (url, formData = {}) => {
  // If we don't have the needed params, bail.
  if ('undefined' === typeof lastReadJournalEntryId || 'undefined' === typeof user) {
    return;
  }

  // If our needed params are empty, bail.
  if (! lastReadJournalEntryId || ! user || ! user.unique_hash) { // eslint-disable-line no-undef
    return;
  }

  // Build the form for the request.
  const form = new FormData();
  form.append('sn', 'Hitgrab');
  form.append('hg_is_ajax', 1);
  form.append('last_read_journal_entry_id', lastReadJournalEntryId ? lastReadJournalEntryId : 0); // eslint-disable-line no-undef
  form.append('uh', user.unique_hash ? user.unique_hash : ''); // eslint-disable-line no-undef

  // Add in the passed in form data.
  for (const key in formData) {
    form.append(key, formData[key]);
  }

  // Convert the form to a URL encoded string for the body.
  const requestBody = new URLSearchParams(form).toString();

  // Send the request.
  const response = await fetch(
    callbackurl ? callbackurl + url : 'https://www.mousehuntgame.com/' + url, // eslint-disable-line no-undef
    {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  // Wait for the response and return it.
  const data = await response.json();
  return data;
};

/**
 * Check if the legacy HUD is enabled.
 *
 * @return {boolean} Whether the legacy HUD is enabled.
 */
const isLegacyHUD = () => {
  return hg.utils.PageUtil.isLegacy();
};

/**
 * Check if an item is in the inventory.
 *
 * @async
 *
 * @param {string} item The item to check for.
 *
 * @return {boolean} Whether the item is in the inventory.
 */
const userHasItem = async (item) => {
  const hasItem = await getUserItems([item]);
  return hasItem.length > 0;
};

/**
 * Check if an item is in the inventory.
 *
 * @async
 *
 * @param {Array} items The item to check for.
 *
 * @return {Array} The item data.
 */
const getUserItems = async (items) => {
  return new Promise((resolve) => {
    hg.utils.UserInventory.getItems(items, (resp) => {
      resolve(resp);
    });
  });
};

/**
 * Get the user's setup details.
 *
 * @return {Object} The user's setup details.
 */
const getUserSetupDetails = () => {
  const userObj = user; // eslint-disable-line no-undef
  const setup = {
    type: userObj.trap_power_type_name,
    stats: {
      power: userObj.trap_power,
      powerBonus: userObj.trap_power_bonus,
      luck: userObj.trap_luck,
      attractionBonus: userObj.trap_attraction_bonus,
      cheeseEfect: userObj.trap_cheese_effect,
    },
    bait: {
      id: parseInt(userObj.bait_item_id),
      name: userObj.bait_name,
      quantity: parseInt(userObj.bait_quantity),
      power: 0,
      powerBonus: 0,
      luck: 0,
      attractionBonus: 0,
    },
    base: {
      id: parseInt(userObj.base_item_id),
      name: userObj.base_name,
      power: 0,
      powerBonus: 0,
      luck: 0,
      attractionBonus: 0,
    },
    charm: {
      id: parseInt(userObj.trinket_item_id),
      name: userObj.trinket_name,
      quantity: parseInt(userObj.trinket_quantity),
      power: 0,
      powerBonus: 0,
      luck: 0,
      attractionBonus: 0,
    },
    weapon: {
      id: parseInt(userObj.weapon_item_id),
      name: userObj.weapon_name,
      power: 0,
      powerBonus: 0,
      luck: 0,
      attractionBonus: 0,
    },
    aura: {
      lgs: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      lightning: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      chrome: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      slayer: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      festive: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      luckycodex: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
      riftstalker: {
        active: false,
        power: 0,
        powerBonus: 0,
        luck: 0,
      },
    },
    location: {
      name: userObj.environment_name,
      id: userObj.environment_id,
      slug: userObj.environment_type,
    },
  };

  if ('camp' !== getCurrentPage()) {
    return setup;
  }

  const calculations = document.querySelectorAll('.campPage-trap-trapStat');
  if (! calculations) {
    return setup;
  }

  calculations.forEach((calculation) => {
    if (calculation.classList.length <= 1) {
      return;
    }

    const type = calculation.classList[1];
    const math = calculation.querySelectorAll('.math .campPage-trap-trapStat-mathRow');
    if (! math) {
      return;
    }

    math.forEach((row) => {
      if (row.classList.contains('label')) {
        return;
      }

      let value = row.querySelector('.campPage-trap-trapStat-mathRow-value');
      let name = row.querySelector('.campPage-trap-trapStat-mathRow-name');

      if (! value || ! name || ! name.innerText) {
        return;
      }

      name = name.innerText;
      value = value.innerText || '0';

      let tempType = type;
      let isBonus = false;
      if (value.includes('%')) {
        tempType = type + 'Bonus';
        isBonus = true;
      }

      // Because attraction_bonus is silly.
      tempType = tempType.replace('_bonusBonus', 'Bonus');

      value = value.replace('%', '');
      value = value.replace(',', '');
      value = parseInt(value * 100) / 100;

      if (tempType === 'attractionBonus') {
        value = value / 100;
      }

      // Check if the name matches either setup.weapon.name, setup.base.name, setup.charm.name, setup.bait.name and if so, update the setup object with the value
      if (setup.weapon.name === name) {
        setup.weapon[tempType] = value;
      } else if (setup.base.name === name) {
        setup.base[tempType] = value;
      } else if (setup.charm.name === name) {
        setup.charm[tempType] = value;
      } else if (setup.bait.name === name) {
        setup.bait[tempType] = value;
      } else if ('Your trap has no cheese effect bonus.' === name) {
        setup.cheeseEffect = 'No Effect';
      } else {
        let auraType = name.replace(' Aura', '');
        if (! auraType) {
          return;
        }

        auraType = auraType.toLowerCase();
        auraType = auraType.replaceAll(' ', '_');
        // remove any non alphanumeric characters
        auraType = auraType.replace(/[^a-z0-9_]/gi, '');
        auraType = auraType.replace('golden_luck_boost', 'lgs');
        auraType = auraType.replace('2023_lucky_codex', 'luckycodex');
        auraType = auraType.replace('_set_bonus_2_pieces', '');
        auraType = auraType.replace('_set_bonus_3_pieces', '');

        if (! setup.aura[auraType]) {
          setup.aura[auraType] = {
            active: true,
            type: auraType,
            power: 0,
            powerBonus: 0,
            luck: 0,
          };
        } else {
          setup.aura[auraType].active = true;
          setup.aura[auraType].type = auraType;
        }

        value = parseInt(value);

        if (isBonus) {
          value = value / 100;
        }

        setup.aura[auraType][tempType] = value;
      }
    });
  });

  return setup;
};

/**
 *  Add a submenu item to a menu.
 *
 * @param {Object}   options          The options for the submenu item.
 * @param {string}   options.menu     The menu to add the submenu item to.
 * @param {string}   options.label    The label for the submenu item.
 * @param {string}   options.icon     The icon for the submenu item.
 * @param {string}   options.href     The href for the submenu item.
 * @param {string}   options.class    The class for the submenu item.
 * @param {Function} options.callback The callback for the submenu item.
 * @param {boolean}  options.external Whether the submenu item is external or not.
 */
const addSubmenuItem = (options) => {
  // Default to sensible values.
  const settings = Object.assign({}, {
    menu: 'kingdom',
    label: '',
    icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/special.png',
    href: '',
    class: '',
    callback: null,
    external: false,
  }, options);

  // Grab the menu item we want to add the submenu to.
  const menuTarget = document.querySelector(`.mousehuntHud-menu .${settings.menu}`);
  if (! menuTarget) {
    return;
  }

  // If the menu already has a submenu, just add the item to it.
  if (! menuTarget.classList.contains('hasChildren')) {
    menuTarget.classList.add('hasChildren');
  }

  let hasSubmenu = true;
  let submenu = menuTarget.querySelector('ul');
  if (! submenu) {
    hasSubmenu = false;
    submenu = document.createElement('ul');
  }

  // Create the item.
  const item = document.createElement('li');
  item.classList.add('custom-submenu-item');
  const cleanLabel = settings.label.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const exists = document.querySelector(`#custom-submenu-item-${cleanLabel}`);
  if (exists) {
    return;
  }

  item.id = `custom-submenu-item-${cleanLabel}`;
  if (settings.class) {
    item.classList.add(settings.class);
  }

  // Create the link.
  const link = document.createElement('a');
  link.href = settings.href || '#';

  if (settings.callback) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      settings.callback();
    });
  }

  // Create the icon.
  const icon = document.createElement('div');
  icon.classList.add('icon');
  icon.style = `background-image: url(${settings.icon});`;

  // Create the label.
  const name = document.createElement('div');
  name.classList.add('name');
  name.innerText = settings.label;

  // Add the icon and label to the link.
  link.appendChild(icon);
  link.appendChild(name);

  // If it's an external link, also add the icon for it.
  if (settings.external) {
    const externalLinkIcon = document.createElement('div');
    externalLinkIcon.classList.add('external_icon');
    link.appendChild(externalLinkIcon);

    // Set the target to _blank so it opens in a new tab.
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  // Add the link to the item.
  item.appendChild(link);

  // Add the item to the submenu.
  submenu.appendChild(item);

  if (! hasSubmenu) {
    menuTarget.appendChild(submenu);
  }
};

/**
 * Add the mouse.rip link to the kingdom menu.
 *
 * @ignore
 */
const addMouseripLink = () => {
  addSubmenuItem({
    menu: 'kingdom',
    label: 'mouse.rip',
    icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
    href: 'https://mouse.rip',
    external: true,
  });
};

/**
 * Add an item to the top 'Hunters Online' menu.
 *
 * @param {Object}   options          The options for the menu item.
 * @param {string}   options.label    The label for the menu item.
 * @param {string}   options.href     The href for the menu item.
 * @param {string}   options.class    The class for the menu item.
 * @param {Function} options.callback The callback for the menu item.
 * @param {boolean}  options.external Whether the link is external or not.
 */
const addItemToGameInfoBar = (options) => {
  const settings = Object.assign({}, {
    label: '',
    href: '',
    class: '',
    callback: null,
    external: false,
  }, options);

  const safeLabel = settings.label.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const exists = document.querySelector(`#mh-custom-topmenu-${safeLabel}`);
  if (exists) {
    return;
  }

  addStyles(`.mousehuntHud-gameInfo .mousehuntHud-menu {
    position: relative;
    top: unset;
    left: unset;
    display: inline;
    width: unset;
    height: unset;
    padding-top: unset;
    padding-left: unset;
    background: unset;
  }
  `, 'mh-custom-topmenu', true);

  const menu = document.querySelector('.mousehuntHud-gameInfo');
  if (! menu) {
    return;
  }

  const item = document.createElement('a');
  item.id = `mh-custom-topmenu-${safeLabel}`;
  item.classList.add('mousehuntHud-gameInfo-item');
  item.classList.add('mousehuntHud-custom-menu-item');

  item.href = settings.href || '#';

  const name = document.createElement('div');
  name.classList.add('name');

  if (settings.label) {
    name.innerText = settings.label;
  }

  item.appendChild(name);

  if (settings.class) {
    item.classList.add(settings.class);
  }

  if (settings.href) {
    item.href = settings.href;
  }

  if (settings.callback) {
    item.addEventListener('click', settings.callback);
  }

  if (settings.external) {
    const externalLinkIconWrapper = document.createElement('div');
    externalLinkIconWrapper.classList.add('mousehuntHud-menu');

    const externalLinkIcon = document.createElement('div');
    externalLinkIcon.classList.add('external_icon');

    externalLinkIconWrapper.appendChild(externalLinkIcon);
    item.appendChild(externalLinkIconWrapper);
  }

  menu.insertBefore(item, menu.firstChild);
};

/**
 * Build a popup.
 *
 * Templates:
 *   ajax: no close button in lower right, 'prefix' instead of title. 'suffix' for close button area.
 *   default: {*title*} {*content*}
 *   error: in red, with error icon{*title*} {*content*}
 *   largerImage: full width image {*title*} {*image*}
 *   largerImageWithClass: smaller than larger image, with caption {*title*} {*image*} {*imageCaption*} {*imageClass*} (goes on the img tag)
 *   loading: Just says loading
 *   multipleItems: {*title*} {*content*} {*items*}
 *   singleItemLeft: {*title*} {*content*} {*items*}
 *   singleItemRight: {*title*} {*content*} {*items*}
 *
 * @param {Object}  options                The popup options.
 * @param {string}  options.title          The title of the popup.
 * @param {string}  options.content        The content of the popup.
 * @param {boolean} options.hasCloseButton Whether or not the popup has a close button.
 * @param {string}  options.template       The template to use for the popup.
 * @param {boolean} options.show           Whether or not to show the popup.
 * @param {string}  options.className      The class name to add to the popup.
 */
const createPopup = (options) => {
  // If we don't have jsDialog, bail.
  if ('undefined' === typeof jsDialog || ! jsDialog) { // eslint-disable-line no-undef
    return;
  }

  // Default to sensible values.
  const settings = Object.assign({}, {
    title: '',
    content: '',
    hasCloseButton: true,
    template: 'default',
    show: true,
    className: '',
  }, options);

  // Initiate the popup.
  const popup = new jsDialog(); // eslint-disable-line no-undef
  popup.setIsModal(! settings.hasCloseButton);

  // Set the template & add in the content.
  popup.setTemplate(settings.template);
  popup.addToken('{*title*}', settings.title);
  popup.addToken('{*content*}', settings.content);

  popup.setAttributes({
    className: settings.className,
  });

  // If we want to show the popup, show it.
  if (settings.show) {
    popup.show();
  }

  return popup;
};

/**
 * Create a popup with an image.
 *
 * @param {Object}  options       Popup options.
 * @param {string}  options.title The title of the popup.
 * @param {string}  options.image The image to show in the popup.
 * @param {boolean} options.show  Whether or not to show the popup.
 */
const createImagePopup = (options) => {
  // Default to sensible values.
  const settings = Object.assign({}, {
    title: '',
    image: '',
    show: true,
  }, options);

  // Create the popup.
  const popup = createPopup({
    title: settings.title,
    template: 'largerImage',
    show: false,
  });

  // Add the image to the popup.
  popup.addToken('{*image*}', settings.image);

  // If we want to show the popup, show it.
  if (settings.show) {
    popup.show();
  }

  return popup;
};

/**
 * Show a map-popup.
 *
 * @param {Object}  options            The popup options.
 * @param {string}  options.title      The title of the popup.
 * @param {string}  options.content    The content of the popup.
 * @param {string}  options.closeClass The class to add to the close button.
 * @param {string}  options.closeText  The text to add to the close button.
 * @param {boolean} options.show       Whether or not to show the popup.
 */
const createMapPopup = (options) => {
  // Check to make sure we can call the hg views.
  if (! (hg && hg.views && hg.views.TreasureMapDialogView)) { // eslint-disable-line no-undef
    return;
  }

  // Default to sensible values.
  const settings = Object.assign({}, {
    title: '',
    content: '',
    closeClass: 'acknowledge',
    closeText: 'ok',
    show: true,
  }, options);

  // Initiate the popup.
  const dialog = new hg.views.TreasureMapDialogView(); // eslint-disable-line no-undef

  // Set all the content and options.
  dialog.setTitle(options.title);
  dialog.setContent(options.content);
  dialog.setCssClass(options.closeClass);
  dialog.setContinueAction(options.closeText);

  // If we want to show & we can show, show it.
  if (settings.show && hg.controllers && hg.controllers.TreasureMapDialogController) { // eslint-disable-line no-undef
    hg.controllers.TreasureMapController.show(); // eslint-disable-line no-undef
    hg.controllers.TreasureMapController.showDialog(dialog); // eslint-disable-line no-undef
  }

  return dialog;
};

/**
 * Create a welcome popup.
 *
 * @param {Object} options                 The popup options.
 * @param {string} options.id              The ID of the popup.
 * @param {string} options.title           The title of the popup.
 * @param {string} options.content         The content of the popup.
 * @param {Array}  options.columns         The columns of the popup.
 * @param {string} options.columns.title   The title of the column.
 * @param {string} options.columns.content The content of the column.
 */
const createWelcomePopup = (options = {}) => {
  if (! (options && options.id && options.title && options.content)) {
    return;
  }

  if (! isLoggedIn()) {
    return;
  }

  const hasSeenWelcome = getSetting('has-seen-welcome', false, options.id);
  if (hasSeenWelcome) {
    return;
  }

  addStyles(`#overlayPopup.mh-welcome .jsDialog.top,
  #overlayPopup.mh-welcome .jsDialog.bottom,
  #overlayPopup.mh-welcome .jsDialog.background {
    padding: 0;
    margin: 0;
    background: none;
  }

  #overlayPopup.mh-welcome .jsDialogContainer .prefix,
  #overlayPopup.mh-welcome .jsDialogContainer .content {
    padding: 0;
  }

  #overlayPopup.mh-welcome #jsDialogClose,
  #overlayPopup.mh-welcome .jsDialogContainer .suffix {
    display: none;
  }

  #overlayPopup.mh-welcome .jsDialogContainer {
    padding: 0 20px;
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_border.png);
    background-repeat: repeat-y;
    background-size: 100%;
  }

  #overlayPopup.mh-welcome .jsDialogContainer::before {
    position: absolute;
    top: -80px;
    right: 0;
    left: 0;
    height: 100px;
    content: '';
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_header.png);
    background-repeat: no-repeat;
    background-size: 100%;
  }

  #overlayPopup.mh-welcome .jsDialogContainer::after {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    height: 126px;
    content: '';
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_footer.png);
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .mh-welcome .mh-title {
    position: relative;
    top: -90px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 412px;
    height: 90px;
    margin: 20px auto 0;
    font-family: Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    color: #7d3b0a;
    text-align: center;
    text-shadow: 1px 1px 1px #e9d5a2;
    background: url(https://www.mousehuntgame.com/images/ui/larry_gifts/ribbon.png?asset_cache_version=2) no-repeat;
  }

  .mh-welcome .mh-inner-wrapper {
    display: flex;
    padding: 5px 10px 25px;
    margin-top: -90px;
  }

  .mh-welcome .text {
    margin-left: 30px;
    line-height: 18px;
    text-align: left;
  }

  .mh-welcome .text p {
    font-size: 13px;
    line-height: 19px;
  }

  .mh-welcome .mh-inner-title {
    padding: 10px 0;
    font-size: 1.5em;
    font-weight: 700;
  }

  .mh-welcome .mh-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mh-welcome .mh-button {
    padding: 10px 50px;
    font-size: 1.5em;
    color: #000;
    background: linear-gradient(to bottom, #fff600, #f4e830);
    border: 1px solid #000;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px #d6d13b inset;
  }

  .mh-welcome .mh-intro-text {
    margin: 2em 1em;
    font-size: 15px;
    line-height: 25px;
  }

  .mh-welcome-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2em;
    margin: 1em;
    -ms-grid-columns: 1fr 2em 1fr;
  }

  .mh-welcome-column h2 {
    margin-bottom: 1em;
    font-size: 16px;
    color: #7d3b0a;
    border-bottom: 1px solid #cba36d;
  }

  .mh-welcome-column ul {
    margin-left: 3em;
    list-style: disc;
  }
  `, 'mh-welcome', true);

  const markup = `<div class="mh-welcome">
    <h1 class="mh-title">${options.title}</h1>
    <div class="mh-inner-wrapper">
      <div class="text">
        <div class="mh-intro-text">
          ${options.content}
          </div>
        <div class="mh-welcome-columns">
          ${options.columns.map((column) => `<div class="mh-welcome-column">
            <h2>${column.title}</h2>
            ${column.content}
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="mh-button-wrapper">
      <a href="#" id="mh-welcome-${options.id}-continue" class="mh-button">Continue</a>
    </div>
  </div>`;

  // Initiate the popup.
  const welcomePopup = createPopup({
    hasCloseButton: false,
    template: 'ajax',
    content: markup,
    show: false,
  });

  // Set more of our tokens.
  welcomePopup.addToken('{*prefix*}', '');
  welcomePopup.addToken('{*suffix*}', '');

  // Set the attribute and show the popup.
  welcomePopup.setAttributes({ className: `mh-welcome mh-welcome-popup-${options.id}` });

  // If we want to show the popup, show it.
  welcomePopup.show();

  // Add the event listener to the continue button.
  const continueButton = document.getElementById(`mh-welcome-${options.id}-continue`);
  continueButton.addEventListener('click', () => {
    saveSetting('has-seen-welcome', true, options.id);
    welcomePopup.hide();
  });
};

/**
 * Create a popup with the larry's office style.
 *
 * @param {string} content Content to display in the popup.
 * @param {Array}  classes Classes to add to the popup.
 */
const createLarryPopup = (content, classes = []) => {
  const message = {
    content: { body: content },
    css_class: ['larryOffice', ...classes].join(' '),
    show_overlay: true,
    is_modal: true
  };

  hg.views.MessengerView.addMessage(message);
  hg.views.MessengerView.go();
};

/**
 * Add a popup similar to the larry's gift popup.
 *
 * createPaperPopup({
 *   title: 'Whoa! A popup!',
 *   content: {
 *     title: 'This is the title of the content',
 *     text: 'This is some text for the content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quid ergo hoc loco intellegit honestum? Dicimus aliquem hilare vivere; Cui Tubuli nomen odio non est? Duo Reges: constructio interrete. Sed venio ad inconstantiae crimen, ne saepius dicas me aberrare; Aliena dixit in physicis nec ea ipsa, quae tibi probarentur;',
 *     image: 'https://api.mouse.rip/hunter/trap/8209591.png',
 *   },
 *   button: {
 *     text: 'A button',
 *     href: '#',
 *   },
 *   show: true,
 * });
 *
 * @param {Object}  options               The popup options.
 * @param {string}  options.title         The title of the popup.
 * @param {Object}  options.content       The content of the popup.
 * @param {string}  options.content.title The title of the popup.
 * @param {string}  options.content.text  The text of the popup.
 * @param {string}  options.content.image The image of the popup.
 * @param {Array}   options.button        The button of the popup.
 * @param {string}  options.button.text   The text of the button.
 * @param {string}  options.button.href   The url of the button.
 * @param {boolean} options.show          Whether to show the popup or not.
 */
const createPaperPopup = (options) => {
  // If we don't have jsDialog, bail.
  if ('undefined' === typeof jsDialog || ! jsDialog) { // eslint-disable-line no-undef
    return;
  }

  // Add the styles for our popup.
  addStyles(`#overlayPopup.mh-paper-popup-dialog-wrapper .jsDialog.top,
  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialog.bottom,
  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialog.background {
    padding: 0;
    margin: 0;
    background: none;
  }

  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer .prefix,
  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer .content {
    padding: 0;
  }

  #overlayPopup.mh-paper-popup-dialog-wrapper #jsDialogClose,
  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer .suffix {
    display: none;
  }

  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer {
    padding: 0 20px;
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_border.png);
    background-repeat: repeat-y;
    background-size: 100%;
  }

  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer::before {
    position: absolute;
    top: -80px;
    right: 0;
    left: 0;
    height: 100px;
    content: '';
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_header.png);
    background-repeat: no-repeat;
    background-size: 100%;
  }

  #overlayPopup.mh-paper-popup-dialog-wrapper .jsDialogContainer::after {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    height: 126px;
    content: '';
    background-image: url(https://www.mousehuntgame.com/images/ui/newsposts/np_footer.png);
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .mh-paper-popup-dialog-wrapper .mh-title {
    position: relative;
    top: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 412px;
    height: 99px;
    margin: 20px auto 0;
    font-family: Georgia, serif;
    font-size: 34px;
    font-weight: 700;
    color: #7d3b0a;
    text-align: center;
    text-shadow: 1px 1px 1px #e9d5a2;
    background: url(https://www.mousehuntgame.com/images/ui/larry_gifts/ribbon.png?asset_cache_version=2) no-repeat;
  }

  .mh-paper-popup-dialog-wrapper .mh-inner-wrapper {
    display: flex;
    padding: 5px 10px 25px;
  }

  .mh-paper-popup-dialog-wrapper .mh-inner-image-wrapper {
    position: relative;
    padding: 10px;
    margin: 0 auto 10px;
    background: #f7e3af;
    border-radius: 10px;
    box-shadow: 0 3px 10px #bd7d3c;
  }

  .mh-paper-popup-dialog-wrapper .mh-inner-image {
    width: 200px;
    height: 200px;
    background-color: #f5edd7;
    border-radius: 5px;
    box-shadow: 0 0 100px #6c340b inset;
  }

  .mh-paper-popup-dialog-wrapper .mh-inner-text {
    margin-left: 30px;
    line-height: 18px;
    text-align: left;
  }

  .mh-paper-popup-dialog-wrapper .mh-inner-title {
    padding: 10px 0;
    font-size: 1.5em;
    font-weight: 700;
  }

  .mh-paper-popup-dialog-wrapper .mh-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mh-paper-popup-dialog-wrapper .mh-button {
    padding: 10px 50px;
    font-size: 1.5em;
    color: #000;
    background: linear-gradient(to bottom, #fff600, #f4e830);
    border: 1px solid #000;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px #d6d13b inset;
  }
  `);

  // Default to sensible values.
  const settings = Object.assign({}, {
    title: '',
    content: {
      title: '',
      text: '',
      image: '',
    },
    button: {
      text: '',
      href: '',
    },
    show: true,
    className: '',
  }, options);

  // Build the markup with our content.
  const markup = `<div class="mh-paper-popup-wrapper">
    <div class="mh-title">${settings.title}</div>
    <div class="mh-inner-wrapper">
      <div class="mh-inner-image-wrapper">
        <img class="mh-inner-image" src="${settings.content.image}" />
      </div>
      <div class="mh-inner-text">
        <div class="mh-inner-title">${settings.content.title}</div>
        <p>${settings.content.text}</p>
      </div>
    </div>
    <div class="mh-button-wrapper">
      <a href="${settings.button.href}" class="mh-button">${settings.button.text}</a>
    </div>
  </div>`;

  // Initiate the popup.
  const popup = createPopup({
    hasCloseButton: false,
    template: 'ajax',
    content: markup,
    show: false,
  });

  // Set more of our tokens.
  popup.addToken('{*prefix*}', '');
  popup.addToken('{*suffix*}', '');

  // Set the attribute and show the popup.
  popup.setAttributes({ className: `mh-paper-popup-dialog-wrapper ${settings.className}` });

  // If we want to show the popup, show it.
  if (settings.show) {
    popup.show();
  }

  return popup;
};

/**
 * Show a message in the horn dialog.
 *
 * Type can be one of these: bait_empty unknown_error bait_disarmed recent_turn recent_linked_turn puzzle
 *
 * @param {Object}   options           Options for the message.
 * @param {string}   options.title     Title of the message. Keep it under 50 characters.
 * @param {string}   options.text      Text of the message. Keep it under 90 characters.
 * @param {string}   options.button    Text of the button.
 * @param {Function} options.action    Callback for the button.
 * @param {number}   options.dismiss   Time to dismiss the message.
 * @param {string}   options.type      Type of the message.
 * @param {string}   options.classname Classname of the message.
 */
const showHornMessage = (options) => {
  const huntersHornView = document.querySelector('.huntersHornView__messageContainer');
  if (! huntersHornView) {
    return;
  }

  const settings = {
    title: options.title || 'Hunters Horn',
    text: options.text || 'This is a message from the Hunters Horn',
    button: options.button || 'OK',
    action: options.action || (() => { }),
    dismiss: options.dismiss || null,
    type: options.type || 'recent_linked_turn',
    classname: options.classname || '',
    image: options.image || null,
    imageLink: options.imageLink || null,
    imageCallback: options.imageCallback || null,
  };

  // do the other effects
  const backdrop = document.querySelector('.huntersHornView__backdrop');
  if (backdrop) {
    backdrop.classList.add('huntersHornView__backdrop--active');
  }

  const gameInfo = document.querySelector('.mousehuntHud-gameInfo');
  if (gameInfo) {
    gameInfo.classList.add('blur');
  }

  const messageWrapper = makeElement('div', ['huntersHornView__message huntersHornView__message--active', settings.classname]);
  const message = makeElement('div', ['huntersHornMessageView', `huntersHornMessageView--${settings.type}`]);
  makeElement('div', 'huntersHornMessageView__title', settings.title, message);
  const content = makeElement('div', 'huntersHornMessageView__content');
  if (settings.image) {
    const imgWrapper = makeElement('div', 'huntersHornMessageView__friend');
    const img = makeElement('a', 'huntersHornMessageView__friendProfilePic');
    if (settings.imageLink) {
      img.href = settings.imageLink;
    } else if (settings.imageCallback) {
      img.addEventListener('click', settings.imageCallback);
    } else {
      img.href = '#';
    }

    img.style.backgroundImage = `url(${settings.image})`;

    imgWrapper.appendChild(img);
    content.appendChild(imgWrapper);
  }
  makeElement('div', 'huntersHornMessageView__text', settings.text, content);
  const buttonSpacer = makeElement('div', 'huntersHornMessageView__buttonSpacer');
  const button = makeElement('button', 'huntersHornMessageView__action');
  const buttonLabel = makeElement('div', 'huntersHornMessageView__actionLabel');
  makeElement('span', 'huntersHornMessageView__actionText', settings.button, buttonLabel);

  button.appendChild(buttonLabel);

  button.addEventListener('click', () => {
    if (settings.action) {
      settings.action();
    }

    messageWrapper.innerHTML = '';
    backdrop.classList.remove('huntersHornView__backdrop--active');
    gameInfo.classList.remove('blur');
  });

  buttonSpacer.appendChild(button);
  content.appendChild(buttonSpacer);

  message.appendChild(content);

  if (settings.dismiss) {
    const countdown = makeElement('button', ['huntersHornMessageView__countdown']);
    makeElement('div', 'huntersHornMessageView__countdownButtonImage', '', countdown);

    const svgMarkup = `<svg class="huntersHornMessageView__countdownSVG">
        <circle r="46%" cx="50%" cy="50%" class="huntersHornMessageView__countdownCircleTrack"></circle>
        <circle r="46%" cx="50%" cy="50%" class="huntersHornMessageView__countdownCircle" style="animation-duration: ${settings.dismiss}ms;"></circle>
    </svg>`;
    countdown.innerHTML += svgMarkup;
    message.appendChild(countdown);
  }

  messageWrapper.appendChild(message);

  // remove any existing messages
  const existingMessages = huntersHornView.querySelector('.huntersHornView__message');
  if (existingMessages) {
    existingMessages.remove();
  }

  huntersHornView.appendChild(messageWrapper);

  if (settings.dismiss) {
    setTimeout(() => {
      const countdown = messageWrapper.querySelector('.huntersHornMessageView__countdown');
      if (countdown) {
        countdown.classList.add('huntersHornMessageView__countdown--complete');
      }
      messageWrapper.innerHTML = '';
      backdrop.classList.remove('huntersHornView__backdrop--active');
      gameInfo.classList.remove('blur');
    }, settings.dismiss);
  }
};

const toggleHornDom = (verb = 'remove') => {
  const els = [
    {
      selector: '.huntersHornView__horn',
      class: 'huntersHornView__horn--active',
    },
    {
      selector: '.huntersHornView__backdrop',
      class: 'huntersHornView__backdrop--active',
    },
    {
      selector: '.huntersHornView__message',
      class: 'huntersHornView__message--active',
    },
    {
      selector: '.mousehuntHud-environmentName',
      class: 'blur'
    },
    {
      selector: '.mousehuntHud-gameInfo',
      class: 'blur'
    },
    {
      selector: '.huntersHornView__horn',
      class: 'huntersHornView__horn--hide'
    },
    {
      selector: '.huntersHornView__backdrop',
      class: 'huntersHornView__backdrop--active'
    },
    {
      selector: '.huntersHornView__message',
      class: 'huntersHornView__message--active'
    },
  ];

  els.forEach((el) => {
    const dom = document.querySelector(el.selector);
    if (dom) {
      dom.classList[verb](el.class);
    }
  }
  );

  return document.querySelector('.huntersHornView__message');
};

/**
 * TODO: document this
 *
 * @param {*} message
 */
const showHuntersHornMessage = (message) => {
  const defaultValues = {
    callback: null,
    countdown: null,
    actionText: null,
  };

  message = Object.assign(defaultValues, message);

  // if the callback was passed in, we need to wrap it in a function that will dismiss the message
  if (message.callback) {
    const originalCallback = message.callback;
    message.callback = () => {
      originalCallback();
      dismissHuntersHornMessage();
    };
  } else {
    message.callback = dismissHuntersHornMessage;
  }

  const messageDom = toggleHornDom('add');
  const messageView = new hg.views.HuntersHornMessageView(message);
  messageDom.innerHTML = '';
  messageDom.appendChild(messageView.render()[0]);
};

/**
 * TODO: document this
 */
const dismissHuntersHornMessage = () => {
  toggleHornDom('remove');
};

/**
 * Make an element draggable. Saves the position to local storage.
 *
 * @param {string}  dragTarget   The selector for the element that should be dragged.
 * @param {string}  dragHandle   The selector for the element that should be used to drag the element.
 * @param {number}  defaultX     The default X position.
 * @param {number}  defaultY     The default Y position.
 * @param {string}  storageKey   The key to use for local storage.
 * @param {boolean} savePosition Whether or not to save the position to local storage.
 */
const makeElementDraggable = (dragTarget, dragHandle, defaultX = null, defaultY = null, storageKey = null, savePosition = true) => {
  const modal = document.querySelector(dragTarget);
  if (! modal) {
    return;
  }

  const handle = document.querySelector(dragHandle);
  if (! handle) {
    return;
  }

  /**
   * Make sure the coordinates are within the bounds of the window.
   *
   * @param {string} type  The type of coordinate to check.
   * @param {number} value The value of the coordinate.
   *
   * @return {number} The value of the coordinate, or the max/min value if it's out of bounds.
   */
  const keepWithinLimits = (type, value) => {
    if ('top' === type) {
      return value < -20 ? -20 : value;
    }

    if (value < (handle.offsetWidth * -1) + 20) {
      return (handle.offsetWidth * -1) + 20;
    }

    if (value > document.body.clientWidth - 20) {
      return document.body.clientWidth - 20;
    }

    return value;
  };

  /**
   * When the mouse is clicked, add the class and event listeners.
   *
   * @param {Object} e The event object.
   */
  const onMouseDown = (e) => {
    e.preventDefault();
    setTimeout(() => {
      // Get the current mouse position.
      x1 = e.clientX;
      y1 = e.clientY;

      // Add the class to the element.
      modal.classList.add('mh-is-dragging');

      // Add the onDrag and finishDrag events.
      document.onmousemove = onDrag;
      document.onmouseup = finishDrag;
    }, 50);
  };

  /**
   * When the drag is finished, remove the dragging class and event listeners, and save the position.
   */
  const finishDrag = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    // Remove the class from the element.
    modal.classList.remove('mh-is-dragging');

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({ x: modal.offsetLeft, y: modal.offsetTop }));
    }
  };

  /**
   * When the mouse is moved, update the element's position.
   *
   * @param {Object} e The event object.
   */
  const onDrag = (e) => {
    e.preventDefault();

    // Calculate the new cursor position.
    x2 = x1 - e.clientX;
    y2 = y1 - e.clientY;

    x1 = e.clientX;
    y1 = e.clientY;

    const newLeft = keepWithinLimits('left', modal.offsetLeft - x2);
    const newTop = keepWithinLimits('top', modal.offsetTop - y2);

    // Set the element's new position.
    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
  };

  // Set the default position.
  let startX = defaultX || 0;
  let startY = defaultY || 0;

  // If the storageKey was passed in, get the position from local storage.
  if (! storageKey) {
    storageKey = `mh-draggable-${dragTarget}-${dragHandle}`;
  }

  if (savePosition) {
    const storedPosition = localStorage.getItem(storageKey);
    if (storedPosition) {
      const position = JSON.parse(storedPosition);

      // Make sure the position is within the bounds of the window.
      startX = keepWithinLimits('left', position.x);
      startY = keepWithinLimits('top', position.y);
    }
  }

  // Set the element's position.
  modal.style.left = `${startX}px`;
  modal.style.top = `${startY}px`;

  // Set up our variables to track the mouse position.
  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;

  // Add the event listener to the handle.
  handle.onmousedown = onMouseDown;
};

const makeDraggableModal = (opts) => {
  const {
    id,
    title,
    content,
    defaultX,
    defaultY,
    storageKey,
    savePosition,
  } = opts;

  // set the defaults for the options
  opts = Object.assign({
    id: 'mh-utils-modal',
    title: '',
    content: '',
    defaultX: null,
    defaultY: null,
    storageKey: 'mh-utils-modal',
    savePosition: true,
  }, opts);

  // Remove the existing modal.
  const existing = document.getElementById(`mh-utils-modal-${id}`);
  if (existing) {
    existing.remove();
  }

  // Create the modal.
  const modalWrapper = makeElement('div', 'mh-utils-modal-wrapper');
  modalWrapper.id = `mh-utils-modal-${id}`;

  const modal = makeElement('div', 'mh-utils-modal');
  const header = makeElement('div', 'mh-utils-modal-header');
  makeElement('h1', 'mh-utils-modal-title', title, header);

  // Create a close button icon.
  const closeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeIcon.classList.add('mh-utils-modal-close');
  closeIcon.setAttribute('viewBox', '0 0 24 24');
  closeIcon.setAttribute('width', '18');
  closeIcon.setAttribute('height', '18');
  closeIcon.setAttribute('fill', 'none');
  closeIcon.setAttribute('stroke', 'currentColor');
  closeIcon.setAttribute('stroke-width', '1.5');

  // Create the path.
  const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  closePath.setAttribute('d', 'M18 6L6 18M6 6l12 12');
  closeIcon.appendChild(closePath);

  // Close the modal when the icon is clicked.
  closeIcon.addEventListener('click', () => {
    modalWrapper.remove();
  });

  // Append the button.
  header.appendChild(closeIcon);

  // Add the header to the modal.
  modal.appendChild(header);

  // Make the mouse stats table.
  const mouseBody =
   document.createElement('div');
  mouseBody.classList.add('mh-utils-modal-body');

  modal.appendChild(content);

  // Add the modal to the wrapper.
  modalWrapper.appendChild(modal);

  // Add the wrapper to the body.
  document.body.appendChild(modalWrapper);

  // Make the modal draggable.
  makeElementDraggable(
    `mh-utils-modal-${id}`,
    'mh-utils-modal',
    'mh-utils-modal-header',
    defaultX,
    defaultY,
    storageKey,
    savePosition
  );
};

/**
 * Creates an element with the given tag, classname, text, and appends it to the given element.
 *
 * @param {string}      tag      The tag of the element to create.
 * @param {string}      classes  The classes of the element to create.
 * @param {string}      text     The text of the element to create.
 * @param {HTMLElement} appendTo The element to append the created element to.
 *
 * @return {HTMLElement} The created element.
 */
const makeElement = (tag, classes = '', text = '', appendTo = null) => {
  const element = document.createElement(tag);

  // if classes is an array, join it with a space.
  if (Array.isArray(classes)) {
    classes = classes.join(' ');
  }

  element.className = classes;
  element.innerHTML = text;

  if (appendTo) {
    appendTo.appendChild(element);
    return appendTo;
  }

  return element;
};

/**
 * Return an anchor element with the given text and href.
 *
 * @param {string}  text          Text to use for link.
 * @param {string}  href          URL to link to.
 * @param {boolean} tiny          Use the tiny button style.
 * @param {Array}   extraClasses  Extra classes to add to the link.
 * @param {boolean} encodeAsSpace Encode spaces as %20 instead of _.
 *
 * @return {string} HTML for link.
 */
const makeButton = (text, href, tiny = true, extraClasses = [], encodeAsSpace = false) => {
  href = href.replace(/\s/g, '_');

  if (encodeAsSpace) {
    href = href.replace(/_/g, '%20');
  } else {
    href = href.replace(/\s/g, '_');
  }

  href = href.replace(/\$/g, '_');

  return `<a href="${href}" class="mousehuntActionButton ${tiny ? 'tiny' : ''} ${extraClasses.join(' ')}"><span>${text}</span></a>`;
};

/**
 * Creates a popup with two choices.
 *
 * createChoicePopup({
 *   title: 'Choose your first trap',
 *   choices: [
 *     {
 *       id: 'treasurer_mouse',
 *       name: 'Treasurer',
 *       image: 'https://www.mousehuntgame.com/images/mice/medium/bb55034f6691eb5e3423927e507b5ec9.jpg?cv=2',
 *       meta: 'Mouse',
 *       text: 'This is a mouse',
 *       button: 'Select',
 *       callback: () => {
 *         console.log('treasurer selected');
 *       }
 *     },
 *     {
 *       id: 'high_roller_mouse',
 *       name: 'High Roller',
 *       image: 'https://www.mousehuntgame.com/images/mice/medium/3f71c32f9d8da2b2727fc8fd288f7974.jpg?cv=2',
 *       meta: 'Mouse',
 *       text: 'This is a mouse',
 *       button: 'Select',
 *       callback: () => {
 *         console.log('high roller selected');
 *       }
 *     },
 *   ],
 * });
 *
 * @param {Object} options                  The options for the popup.
 * @param {string} options.title            The title of the popup.
 * @param {Array}  options.choices          The choices for the popup.
 * @param {string} options.choices[].id     The ID of the choice.
 * @param {string} options.choices[].name   The name of the choice.
 * @param {string} options.choices[].image  The image of the choice.
 * @param {string} options.choices[].meta   The smaller text under the name.
 * @param {string} options.choices[].text   The description of the choice.
 * @param {string} options.choices[].button The text of the button.
 * @param {string} options.choices[].action The action to take when the button is clicked.
 */
const createChoicePopup = (options) => {
  let choices = '';
  const numChoices = options.choices.length;
  let currentChoice = 0;

  options.choices.forEach((choice) => {
    choices += `<a href="#" id=${choice.id}" class="weaponContainer">
    <div class="weapon">
      <div class="trapImage" style="background-image: url(${choice.image});"></div>
      <div class="trapDetails">
        <div class="trapName">${choice.name}</div>
        <div class="trapDamageType">${choice.meta}</div>
        <div class="trapDescription">${choice.text}</div>
        <div class="trapButton" id="${choice.id}-action">${choice.button || 'Select'}</div>
      </div>
    </div>
    </a>`;

    currentChoice++;
    if (currentChoice < numChoices) {
      choices += '<div class="spacer"></div>';
    }
  });

  const content = `<div class="trapIntro">
    <div id="OnboardArrow" class="larryCircle">
      <div class="woodgrain">
        <div class="whiteboard">${options.title}</div>
      </div>
      <div class="characterContainer">
        <div class="character"></div>
      </div>
    </div>
  </div>
  <div>
    ${choices}
  </div>`;

  hg.views.MessengerView.addMessage({
    content: { body: content },
    css_class: 'chooseTrap',
    show_overlay: true,
    is_modal: true
  });
  hg.views.MessengerView.go();

  options.choices.forEach((choice) => {
    const target = document.querySelector(`#${choice.id}-action`);
    if (target) {
      target.addEventListener('click', () => {
        hg.views.MessengerView.hide();
        if (choice.action) {
          choice.action();
        }
      });
    }
  });
};

/**
 * Creates a favorite button that can toggle.
 *
 * @async
 *
 * @example <caption>Creating a favorite button</caption>
 * createFavoriteButton({
 *   id: 'testing_favorite',
 *   target: infobar,
 *   size: 'small',
 *   defaultState: false,
 * });
 *
 * @param {Object} options              The options for the button.
 * @param {string} options.selector     The selector for the button.
 * @param {string} options.size         Whether or not to use the small version of the button.
 * @param {string} options.active       Whether or not the button should be active by default.
 * @param {string} options.onChange     The function to run when the button is toggled.
 * @param {string} options.onActivate   The function to run when the button is activated.
 * @param {string} options.onDeactivate The function to run when the button is deactivated.
 */
const createFavoriteButton = async (options) => {
  addStyles(`.custom-favorite-button {
    top: 0;
    right: 0;
    display: inline-block;
    width: 35px;
    height: 35px;
    vertical-align: middle;
    background: url(https://www.mousehuntgame.com/images/ui/camp/trap/star_empty.png?asset_cache_version=2) 50% 50% no-repeat;
    background-size: 90%;
    border-radius: 50%;
  }

  .custom-favorite-button-small {
    width: 20px;
    height: 20px;
  }

  .custom-favorite-button:hover {
    background-color: #fff;
    outline: 2px solid #ccc;
    background-image: url(https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png?asset_cache_version=2);
  }

  .custom-favorite-button.active {
    background-image: url(https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png?asset_cache_version=2);
  }

  .custom-favorite-button.busy {
    background-image: url(https://www.mousehuntgame.com/images/ui/loaders/small_spinner.gif?asset_cache_version=2);
  }
  `, 'custom-favorite-button', true);

  const {
    id = null,
    target = null,
    size = 'small',
    state = false,
    isSetting = true,
    defaultState = false,
    onChange = null,
    onActivate = null,
    onDeactivate = null,
  } = options;

  const star = document.createElement('a');

  star.classList.add('custom-favorite-button');
  if (size === 'small') {
    star.classList.add('custom-favorite-button-small');
  }

  star.setAttribute('data-item-id', id);
  star.setAttribute('href', '#');

  star.style.display = 'inline-block';

  let currentSetting = false;
  if (isSetting) {
    currentSetting = getSetting(id, defaultState);
  } else {
    currentSetting = state;
  }

  if (currentSetting) {
    star.classList.add('active');
  } else {
    star.classList.add('inactive');
  }

  star.addEventListener('click', async (e) => {
    star.classList.add('busy');
    e.preventDefault();
    e.stopPropagation();
    const currentStar = e.target;
    const currentState = ! currentStar.classList.contains('active');

    if (onChange !== null) {
      await onChange(currentState);
    } else if (isSetting) {
      saveSetting(id, currentState);
    }

    currentStar.classList.remove('inactive');
    currentStar.classList.remove('active');

    if (currentState) {
      currentStar.classList.add('active');
      if (onActivate !== null) {
        await onActivate(currentState);
      }
    } else {
      currentStar.classList.add('inactive');
      if (onDeactivate !== null) {
        await onDeactivate(currentState);
      }
    }

    currentStar.classList.remove('busy');
  });

  if (target) {
    target.appendChild(star);
  }

  return star;
};

/**
 * Wait for a specified amount of time.
 *
 * @param {number} ms The number of milliseconds to wait.
 */
const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Log to the console.
 *
 * @param {string|Object} message The message to log.
 * @param {Object}        args    The arguments to pass to the console.
 */
const clog = (message, ...args) => {
  // If a string is passed in, log it in line with our prefix.
  if ('string' === typeof message) {
    console.log(`%c[MH Utils] %c${message}`, 'color: #ff0000; font-weight: bold;', 'color: #000000;'); // eslint-disable-line no-console
    console.log(...args); // eslint-disable-line no-console
  } else {
    // Otherwise, log it separately.
    console.log('%c[MH Utils]', 'color: #ff0000; font-weight: bold;'); // eslint-disable-line no-console
    console.log(message); // eslint-disable-line no-console
  }
};

/**
 * Log to the console if debug mode is enabled.
 *
 * @param {string|Object} message The message to log.
 * @param {Object}        args    The arguments to pass to the console.
 */
const debug = (message, ...args) => {
  if (getSetting('debug-mode', false)) {
    clog(message, ...args);
  }
};

/**
 * Add a setting to enable debug mode.
 */
const enableDebugMode = () => {
  const debugSettings = {
    debugModeEnabled: true,
    debug: getSetting('debug-mode', false)
  };

  window.mhutils = window.mhutils ? { ...window.mhutils, ...debugSettings } : debugSettings;

  addSetting('Debug Mode', 'debug-mode', false, 'Enable debug mode', {}, 'game_settings');
};

/**
 * Helper to run a callback when loaded, on ajax request, on overlay close, and on travel.
 *
 * @param {Function} action The callback to run.
 */
const run = async (action) => {
  action();
  onAjaxRequest(action);
  onOverlayClose(action);
  onTravel(null, { callback: action });
};

/**
 * Check if dark mode is enabled.
 *
 * @return {boolean} True if dark mode is enabled, false otherwise.
 */
const isDarkMode = () => {
  return !! getComputedStyle(document.documentElement).getPropertyValue('--mhdm-white');
};

/**
 * Adds classes to the body to enable styling based on the location or if dark mode is enabled.
 */
const addBodyClasses = () => {
  const addLocationBodyClass = () => {
    const addClass = () => {
      const location = getCurrentLocation();
      document.body.classList.add(`mh-location-${location}`);
    };

    addClass();
    onTravel(null, { callback: addClass });
  };

  const addDarkModeBodyClass = () => {
    if (isDarkMode()) {
      document.body.classList.add('mh-dark-mode');
    }
  };

  addLocationBodyClass();
  addDarkModeBodyClass();
};

/**
 * Wait for the app to initialize, then add classes to the body.
 */
setTimeout(() => {
  addBodyClasses();
  eventRegistry.addEventListener('app_init', addBodyClasses);
}, 250);
