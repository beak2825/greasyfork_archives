// ==UserScript==
// @name         Bountiful Beanstalk HUD Enhancer
// @namespace    https://github.com/hymccord
// @source       https://github.com/hymccord/bb-hud-enhancer
// @version      0.9
// @description  Enhance the Bountiful Beanstalk HUD with useful information!
// @author       Xellis
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.mousehuntgame.com/images/mice/square/6b9bd6acb4a07d560f61e5678e4ff3b5.jpg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/468738/Bountiful%20Beanstalk%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/468738/Bountiful%20Beanstalk%20HUD%20Enhancer.meta.js
// ==/UserScript==
// @ts-ignore
((w) =>{ if (w) { w.name = 'bb-hud-enh';}})();

// This userscript is built via rollup so the it might look unkempt.
// View the source repo for the organized source code.

var styles = ":bb-hud-enh {\n  position: 'block';\n}\n\n.bb-hud-enh-remembrall-button {\n  position: absolute;\n  top: 15px;\n  left: 222px;\n  z-index: 23;\n  width: 20px;\n  height: 20px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiBgkNBw7FMYKQAAABFElEQVQoz53SvS5EURQF4G+mGCLx02mnQDkUCgWRoNVKPICGhhYPIaHBAwjzDkMi8QRCoVAOEiaG0NmKO/fOuIaEfZq99l5n7Z9z+JdNOnTj3atrBxa6k8acidw5M5qnTWsIdZsqepRUbLkXnsx00kY0hGP9Xy4POBEejbRDNeFI8Vs7RcfCaQpnhbqBLB0i8wfVhXmKWMauZtcRn+1hKQEXQqUj2anIuHCduA9C74/EPqGZlC6hgHJHeiXzCu3gpVBRdtvC6z58WG2hCeEqUbzAmtNMcccGhltoEeft9USus6lsPXfCXALK3r4R04VXhVpKu+2iCEOq+SfMW59x2+6Ex6+fIm9phdpvavDiyn46wh/tE5uVY811cdV8AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA2LTA5VDEzOjA3OjE0KzAwOjAweWHOTgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNi0wOVQxMzowNzoxNCswMDowMAg8dvIAAAAASUVORK5CYII=);\n}\n\n.bountifulBeanstalkCastleView__noiseMeterArrow {\n  font-size: 15px;\n  position: absolute;\n  left: 0;\n  transform: translate(-50%, -25%);\n  transition: left 0.8s ease;\n  z-index: 1;\n}\n\n.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin {\n  -webkit-text-stroke: 0.5px black;\n  color: rgb(55, 209, 55);\n}\n\n.bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg {\n  -webkit-text-stroke: 0.5px black;\n  color: yellow\n}\n\n.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax {\n  -webkit-text-stroke: 0.5px black;\n  color: red;\n}\n\n.headsUpDisplayBountifulBeanstalkView__craftalyzerQuantity {\n  top: 50px;\n  right: 0px;\n  position: absolute;\n  text-align: right;\n}\n\n.harpMeIn__buttonContainer .mousehuntTooltip,\n.harpMeOut__buttonContainer .mousehuntTooltip {\n  width: 200px;\n  bottom: 16%;\n  transform: translateX(-95px);\n  text-align: center;\n}\n";

// @ts-nocheck
/*
# MIT License

Copyright (c) 2022 Brad Parbs

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
 * @typedef VisibilityCallback
 * @property {Function} show   The callback to call when the element is shown.
 * @property {Function} hide   The callback to call when the element is hidden.
 * @property {Function} change The callback to call when the element is changed.
 */

/**
 * @typedef UserVisibilityCallback
 * @property {Function=} show   The callback to call when the element is shown.
 * @property {Function=} hide   The callback to call when the element is hidden.
 */

/**
 * Run the callbacks depending on visibility.
 *
 * @author bradp
 * @since 1.0.0
 *
 * @ignore
 *
 * @param {{[key: string]: {isVisible: boolean, selector: string}}} settings Settings object.
 * @param {HTMLElement}   parentNode The parent node.
 * @param {Object.<string, UserVisibilityCallback>} callbacks  The callbacks to run.
 *
 * @return {Object} The settings.
 */
const runCallbacks = (settings, parentNode, callbacks) => {
  // Loop through the keys on our settings object.
  Object.keys(settings).forEach((key) => {
    // If the parentNode that's passed in contains the selector for the key.
    if (parentNode.classList.contains(settings[ key ].selector)) {
      // Set as visible.
      settings[ key ].isVisible = true;

      // If there is a show callback, run it.
      if (callbacks[ key ] && callbacks[ key ].show) {
        callbacks[ key ].show();
      }
    } else if (settings[ key ].isVisible) {
      // Mark as not visible.
      settings[ key ].isVisible = false;

      // If there is a hide callback, run it.
      if (callbacks[ key ] && callbacks[ key ].hide) {
        callbacks[ key ].hide();
      }
    }
  });

  return settings;
};

/**
 * Add user callback keys to settings.
 *
 * @author hymccord
 * @since 1.6.1
 *
 * @ignore
 *
 * @param {{[key: string]: {isVisible: boolean, selector: string}}} settings Settings object.
 * @param {{[key: string]: VisibilityCallback & {selector: string}}} callbacks  The callbacks to run.
 *
 * @return {{[key: string]: {isVisible: boolean, selector: string}}} The settings.
 */
const addCallbacksToSettings = (settings, callbacks) => {
  Object.keys(callbacks).forEach((key) => {
    if (callbacks[key].selector) {
      settings[key] = {
        isVisible: false,
        selector: callbacks[key].selector
      };
    }
  });

  return settings;
};

/**
 * Do something when the overlay is shown or hidden.
 *
 * @param {VisibilityCallback | {[key: string]: UserVisibilityCallback & {selector: string}}} callbacks
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

  overlayData = addCallbacksToSettings(overlayData, callbacks);

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
 * Do something when the page or tab changes.
 *
 * @param {UserVisibilityCallback} callbacks
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
  tabData = addCallbacksToSettings(tabData, callbacks);


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
    return settings[ key ];
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
  settings[ key ] = value;

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
const saveSettingAndToggleClass = (node, key, value, identifier) => {
  // Toggle the state of the checkbox.
  node.classList.toggle('active');

  // Save the setting.
  saveSetting(key, value, identifier);

  // Add the completed class & remove it in a second.
  node.parentNode.classList.add('completed');
  setTimeout(() => {
    node.parentNode.classList.remove('completed');
  }, 1000);
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
 * @param {{
 *   id: string,
 *   name: string}} section      The section settings.
 * @param {string}  tab          The tab to add the settings to.
 */
const addSetting = (name, key, defaultValue = true, description = '', section = {}, tab = 'userscript-settings') => {
  onPageChange({ preferences: { show: () => addSettingOnce(name, key, defaultValue, description, section, tab) } });
  addSettingOnce(name, key, defaultValue, description, section, tab);

  addSettingRefreshReminder();
  onPageChange({ preferences: { show: addSettingRefreshReminder } });
};

/**
 * Add a setting to the preferences page.
 *
 * @ignore
 *
 * @param {string}  name         The setting name.
 * @param {string}  key          The setting key.
 * @param {boolean} defaultValue The default value.
 * @param {string}  description  The setting description.
 * @param {{
 *   id: string,
 *   name: string}} section      The section settings.
 * @param {string}  tab          The tab to add the settings to.
 */
const addSettingOnce = (name, key, defaultValue = true, description = '', section = {}, tab = 'userscript-settings') => {
  // Make sure we have the container for our settings.
  const container = document.querySelector(`.mousehuntHud-page-tabContent.${tab}`);
  if (! container) {
    return;
  }

  section = {
    id: section.id || 'mh-utils-settings',
    name: section.name || 'Userscript Settings',
    description: section.description || '',
  };

  // If we don't have our custom settings section, then create it.
  let sectionExists = document.querySelector(`#${section.id}`);
  if (! sectionExists) {
    // Make the element, add the ID and class.
    const title = document.createElement('div');
    title.id = section.id;
    title.classList.add('gameSettingTitle');

    // Set the title of our section.
    title.textContent = section.name;

    // Add a separator.
    const seperator = document.createElement('div');
    seperator.classList.add('separator');

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
  settings.classList.add('settingRowTable');
  settings.id = `${section.id}-${key}`;

  const settingRow = document.createElement('div');
  settingRow.classList.add('settingRow');

  const settingRowLabel = document.createElement('div');
  settingRowLabel.classList.add('settingRow-label');

  const settingName = document.createElement('div');
  settingName.classList.add('name');
  settingName.innerHTML = name;

  const defaultSettingText = document.createElement('div');
  defaultSettingText.classList.add('defaultSettingText');
  defaultSettingText.textContent = defaultValue ? 'Enabled' : 'Disabled';

  const settingDescription = document.createElement('div');
  settingDescription.classList.add('description');
  settingDescription.innerHTML = description;

  settingRowLabel.appendChild(settingName);
  settingRowLabel.appendChild(defaultSettingText);
  settingRowLabel.appendChild(settingDescription);

  const settingRowAction = document.createElement('div');
  settingRowAction.classList.add('settingRow-action');

  const settingRowInput = document.createElement('div');
  settingRowInput.classList.add('settingRow-action-inputContainer');

  const settingRowInputCheckbox = document.createElement('div');
  settingRowInputCheckbox.classList.add('mousehuntSettingSlider');

  // Depending on the current state of the setting, add the active class.
  const currentSetting = getSetting(key, null, section.id);
  if (currentSetting) {
    settingRowInputCheckbox.classList.add('active');
  } else if (null === currentSetting && defaultValue) {
    settingRowInputCheckbox.classList.add('active');
  }

  // Event listener for when the setting is clicked.
  settingRowInputCheckbox.onclick = (event) => {
    saveSettingAndToggleClass(event.target, key, !event.target.classList.contains('active'), section.id);
  };

  // Add the input to the settings row.
  settingRowInput.appendChild(settingRowInputCheckbox);
  settingRowAction.appendChild(settingRowInput);

  // Add the label and action to the settings row.
  settingRow.appendChild(settingRowLabel);
  settingRow.appendChild(settingRowAction);

  // Add the settings row to the settings container.
  settings.appendChild(settingRow);
  sectionExists.appendChild(settings);

  addSettingRefreshReminder();
};

/**
 * Add a refresh reminder to the settings page.
 *
 * @ignore
 */
const addSettingRefreshReminder = () => {
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

// setTimeout(() => {
//   addBodyClasses();
//   eventRegistry.addEventListener('app_init', addBodyClasses);
// }, 250);

/**
 * @param {unknown[]} args
 */
function log(...args) {
  console.log('%c[bb-hud-enhancer]:', 'color: green; font-weight: bold', ...args);
}

/* eslint-disable quotes */
const Templates = {
  'CraftalyzerContainer': `<div class="headsUpDisplayBountifulBeanstalkView__craftalyzerQuantity"></div>`,
  'HistoryButton': `<a href="#" class="bb-hud-enh-remembrall-button"></a>`,
  'NoiseMeterArrow': `<div class="bountifulBeanstalkCastleView__noiseMeterArrow">▲</div>`,
  'HarpMeOut': `
<div class="bountifulBeanstalkPlayHarpDialogView__roomInfoContainer harpMeOutContainer" style="margin-top: 0;">
  <div class="bountifulBeanstalkPlayHarpDialogView__room">
    <div class="bountifulBeanstalkPlayHarpDialogView__roomText" style="color: #85d523;">
      Set Soft
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton min" style="color: white;">
        Min
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the minimal amount of noise.
        <br>
        Best when min and max noise per hunt is equal.
        <br>
        <br>
        <b>Warning:</b> Uses a minimal amount of strings.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton avg" style="color: white;">
        Avg
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the average amount of noise. Based on your estimated catch rate.
        <br>
        <br>
        <b>Warning:</b> No guarantee that you will get to next room.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeIn__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton max" style="color: white;">
        Max
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set soft value as if you made the most amount of noise. (ie 100% CR).
        <br>
        <br>
        <b>Warning:</b> Uses the most amount of strings but you won't get chased out if you make less than the max amount of noise with the amount hunts left.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
  </div>
  <div class="bountifulBeanstalkPlayHarpDialogView__lootMultiplier" style="width: 100px;">
    Harp Me Out!
  </div>
  <div class="bountifulBeanstalkPlayHarpDialogView__room">
    <div class="bountifulBeanstalkPlayHarpDialogView__roomText" style="color: #85d523;">
      Set Loud
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton max" style="color: white;">
        Max
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Sets loud value as if you made the minimal amount of noise.
        <br>
        <br>
        <b>Warning:</b> Uses the most amount of string to guarantee chase.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton avg" style="color: white;">
        Avg
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set loud value as if you made the average amount of noise. Based on your estimated catch rate.
        <br>
        <br>
        <b>Warning:</b> No guarantee to get chased out.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
    <div class="harpMeOut__buttonContainer mousehuntTooltipParent">
      <button class="bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton min" style="color: white;">
        Min
      </button>
      <div class="mousehuntTooltip tight top noEvents">
        Set loud value as if you made the most amount of noise.
        <br>
        Best when min and max noise per hunt is equal.
        <br>
        <br>
        <b>Warning:</b> If noise per hunt is not constant, then you won't get chased out unless you have 100% CR.
        <div class="mousehuntTooltip-arrow"></div>
      </div>
    </div>
  </div>
</div>
  `
};

const SettingsIdentifier = 'bb-hud-enh-settings';

/**
 * @type {Record<BbHudEnhSetting,{name: string, id: string, defaultValue: boolean, description?: string}>}
 */
const SETTINGS = {
  enableCraftalyzer: {
    id: 'bb-hud-enable-craftalyzer',
    name: 'Bean Craftalyzer',
    defaultValue: true,
    description: 'Show amount of beans that can be crafted given current ingrediants.'
  },
  enableNoisehelper: {
    id: 'bb-hud-enable-noisehelper',
    name: 'Noise Helper',
    defaultValue: true,
    description: 'Show projected noise amounts below the noise meter and in the tooltip.'
  },
  enableHarpmeout: {
    id: 'bb-hud-enable-harpmeout',
    name: 'Harp Me Out',
    defaultValue: true,
    description: 'Show the Max/Avg/Min amount buttons in the Harp playing dialog.'
  },
};

/**
 * @param {BbHudEnhSetting} id
 */
function getEnhancerSetting(id) {
  const setting = SETTINGS[id];
  return getSetting(setting.id, setting.defaultValue, SettingsIdentifier);
}

function addSettings() {
  addSettingsTab();

  for (const [, value] of Object.entries(SETTINGS)) {
    addSetting(value.name, value.id, value.defaultValue, value.description, {id: 'bb-hud-enh-settings', name: 'Bountiful Beanstalk HUD Enhancer'});
  }
}

function getHUD() {
  return $('.headsUpDisplayBountifulBeanstalkView');
}

/**
 *
 * @param {JQuery<HTMLElement>} container
 * @returns
 */
function getNoiseMeter(container) {
  return $('.bountifulBeanstalkCastleView__noiseMeter', container);
}

// TODO: replace settings
const settings = {
  upsell: {
    beanster_recipe: true,
    lavish_beanster_recipe: true,
    leaping_lavish_beanster_recipe: true,
    royal_beanster_recipe: true
  },
  ignore: {
    magic_essence_craft_item: true,
    gold_stat_item: true,
  }
};

/** @type {Craftalyzer} */
let _craftalyzer;

/** @param {User} data */
function addCraftalyzer(data) {

  if (!getEnhancerSetting('enableCraftalyzer')) {
    return;
  }

  const recipies = getRecipies(data.enviroment_atts);
  _craftalyzer = new Craftalyzer(recipies);

  _craftalyzer.render(data, settings);
}


/** @param {User} data */
function updateCraftalyzer(data) {
  if (!_craftalyzer) {
    return;
  }

  _craftalyzer.update(data, settings);
}

/**
 * @param {EnvironmentAttributes} atts
 */
function getRecipies(atts) {
  /** @type {{[key: string]: Craftable}} */
  const recipies = {};
  for (const [key, value] of Object.entries(atts)) {
    if (!key.endsWith('_recipe')) {
      continue;
    }

    if (typeof value === 'object' && 'vanilla' in value) {
      // @ts-ignore
      recipies[key] = value;
    }
  }

  return recipies;
}

class Craftalyzer {

  /** @type {{[key: string]: Recipe & {result: string}}} */
  _currentRecipies = {};
  /** @type {Map<string, string>} */
  _currentRecipeOutputsToRecipeName = new Map();

  /** @param {{[key: string]: Craftable}} recipies */
  constructor(recipies) {
    this._recipies = recipies;
  }

  /**
   * @param {User} data
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  render(data, settings) {
    this.setCurrentRecipies(settings);

    $('.headsUpDisplayBountifulBeanstalkView__baitCraftableContainer').each((i, e) => {
      $(e).append(Templates.CraftalyzerContainer);
    });

    this.updateItems(data, settings);
  }

  /**
   * @param {User} data
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  update(data, settings) {
    this.updateItems(data, settings);
  }

  /**
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  setCurrentRecipies(settings) {
    this._currentRecipies = {};
    this._currentRecipeOutputsToRecipeName = new Map();
    Object.entries(this._recipies)
      .forEach(([craftableRecipeName, craftable]) => {
        let recipe = craftable.vanilla;
        if (craftable.has_upsell && settings.upsell[craftableRecipeName]) {
          recipe = craftable.upsell;
        }
        this._currentRecipies[craftableRecipeName] = {...recipe, result: craftable.result.type};
        this._currentRecipeOutputsToRecipeName.set(craftable.result.type, craftableRecipeName);
      });
  }

  /**
   * @param {User} data
   * @param {{ ignore: { [x: string]: any; }; }} settings
   */
  updateItems(data, settings) {
    const currentlyCraftable = [];
    for (const [recipeName, recipe] of Object.entries(this._currentRecipies)) {
      const currentQuantity = this.getCraftable(recipeName, data.enviroment_atts.items);

      const maxQuantity = this.getCraftableQuantityWithLimit(Infinity, recipeName, data.enviroment_atts.items, settings);
      currentlyCraftable.push({
        selector: recipe.result,
        classSelector: 'headsUpDisplayBountifulBeanstalkView__ingredientQuantity',
        quantity: `+${currentQuantity} | +${maxQuantity}`
      });
    }

    this.renderAllCraftable(currentlyCraftable);
  }

  /**
   * @param {string} recipeName
   * @param {{ [x: string]: { quantity_unformatted: number; }; }} inventoryItems
   */
  getCraftable(recipeName, inventoryItems) {
    if (!(recipeName in this._currentRecipies)) {
      log('Unknown recipe!');
    }

    const recipe = this._currentRecipies[recipeName];
    return recipe.items.reduce(function (acc, item) {
      const maxCraftable = Math.floor(
        inventoryItems[item.type].quantity_unformatted / item.required_quantity
      );
      return Math.min(acc, maxCraftable);
    }, Infinity) * recipe.action.result_quantity;
  }

  /**
   * @param {string} recipeName
   * @param {number} limit
   * @param {{ [x: string]: { quantity_unformatted: number; }; }} inventoryItems
   * @param {{ ignore: { [x: string]: any; }; }} settings
   */
  getCraftableQuantityWithLimit(limit, recipeName, inventoryItems, settings) {
    if (!(recipeName in this._currentRecipies)) {
      log('Unknown recipe!');
      return 0;
    }

    const recipe = this._currentRecipies[recipeName];

    for (const ingredient of recipe.items) {
      if (settings.ignore[ingredient.type]) {
        continue;
      }

      let availableQuantity = inventoryItems[ingredient.type].quantity_unformatted;
      const requiredQuantity = ingredient.required_quantity;

      const recursiveRecipeName = this._currentRecipeOutputsToRecipeName.get(ingredient.type);
      if (recursiveRecipeName && (availableQuantity / requiredQuantity) < limit) {
        // We dont have enough ingredients to satify craft.
        // Turn N crafts of parent item into amount of ingrediants needed/consumed
        const ingredientsNeeded = Math.max(0, limit * requiredQuantity - availableQuantity);
        const ingredientCraftsNeeded = Math.ceil(ingredientsNeeded / this._currentRecipies[recursiveRecipeName].action.result_quantity);

        const craftedQuantity = this.getCraftableQuantityWithLimit(ingredientCraftsNeeded, recursiveRecipeName, inventoryItems, settings);
        availableQuantity += craftedQuantity;
      }

      const numberOfCrafts = Math.floor(availableQuantity / requiredQuantity);
      limit = Math.min(limit, numberOfCrafts);
    }

    return limit * recipe.action.result_quantity;
  }

  /**
   * @param {{selector: string;quantity: number;classSelector:string;}[]} data
   */
  renderAllCraftable(data) {
    const container = getHUD();
    for (const craftable of data) {
      $(`.headsUpDisplayBountifulBeanstalkView__baitCraftableContainer[data-item-type="${craftable.selector}"] .headsUpDisplayBountifulBeanstalkView__craftalyzerQuantity`, container)
        .text(craftable.quantity);
    }
  }
}

/**
 * @type {MousePowers}
 */
const MicePowers = {
  'Baroness Von Bean': { power: 31000, eff: 100 },
  'Mythical Giant King': { power: 148100, eff: 200 },
  'Sassy Salsa Dancer': { power: 24000, eff: 100 },
  'Baroque Dancer': { power: 33000, eff: 100 },
  'Budrich Thornborn': { power: 12000, eff: 100 },
  'Cagey Countess': { power: 29000, eff: 100 },
  'Cell Sweeper': { power: 16200, eff: 100 },
  'Chafed Cellist': { power: 30520, eff: 100 },
  'Clumsy Cupbearer': { power: 28000, eff: 100 },
  'Dastardly Duchess': { power: 34550, eff: 100 },
  'Diminutive Detainee': { power: 20000, eff: 100 },
  'Dungeon Master': { power: 104250, eff: 300 },
  'Gate Keeper': { power: 25185, eff: 100 },
  'Jovial Jailor': { power: 17300, eff: 100 },
  'Key Master': { power: 23140, eff: 100 },
  'Leafton Beanwell': { power: 13000, eff: 100 },
  'Lethargic Guard': { power: 19040, eff: 100 },
  'Malevolent Maestro': { power: 138450, eff: 300 },
  'Malicious Marquis': { power: 36660, eff: 100 },
  'Obstinate Oboist': { power: 19000, eff: 100 },
  'Peaceful Prisoner': { power: 15000, eff: 100 },
  'Peevish Piccoloist': { power: 21000, eff: 100 },
  'Pernicious Prince': { power: 86363, eff: 150 },
  'Plotting Page': { power: 32000, eff: 100 },
  'Scheming Squire': { power: 38000, eff: 100 },
  'Smug Smuggler': { power: 30000, eff: 100 },
  'Sultry Saxophonist': { power: 23000, eff: 100 },
  'Treacherous Tubaist': { power: 77925, eff: 150 },
  'Vindictive Viscount': { power: 25000, eff: 100 },
  'Vinneus Stalkhome': { power: 80900, eff: 400 },
  'Violent Violinist': { power: 33090, eff: 100 },
  'Whimsical Waltzer': { power: 22000, eff: 100 },
  'Wrathful Warden': { power: 70300, eff: 150 },
};

const MiceARs = {
  'Bountiful Beanstalk': {
    'Beanstalk': {
      'Gouda': {
        '-': {
          'Budrich Thornborn': 50.62,
          'SampleSize': 18260,
          'Leafton Beanwell': 49.38
        }
      },
      'SB+': {
        '-': {
          'Budrich Thornborn': 50.05,
          'SampleSize': 5860,
          'Leafton Beanwell': 49.95
        }
      }
    },
    'Beanstalk Boss': {
      'Gouda': {
        '-': {
          'Vinneus Stalkhome': 100,
          'SampleSize': 1384
        }
      },
      'SB+': {
        '-': {
          'Vinneus Stalkhome': 100,
          'SampleSize': 414
        }
      }
    },
    'Dungeon': {
      'Gouda': {
        '-': {
          'Smug Smuggler': 39.63,
          'SampleSize': 7292,
          'Diminutive Detainee': 34.85,
          'Peaceful Prisoner': 25.52
        }
      },
      'SB+': {
        '-': {
          'Smug Smuggler': 39.15,
          'SampleSize': 2986,
          'Diminutive Detainee': 34.19,
          'Peaceful Prisoner': 26.66
        }
      },
      'Beanster': {
        '-': {
          'Jovial Jailor': 45.15,
          'SampleSize': 15332,
          'Cell Sweeper': 30.36,
          'Lethargic Guard': 24.48
        }
      },
      'Lavish Beanster': {
        '-': {
          'Gate Keeper': 50.7,
          'SampleSize': 10908,
          'Key Master': 49.3
        }
      },
      'Leaping Lavish Beanster': {
        '-': {
          'Gate Keeper': 50.7,
          'SampleSize': 10908,
          'Key Master': 49.3
        }
      },
      'Royal Beanster': {
        '-': {
          'Wrathful Warden': 100,
          'SampleSize': 2428
        }
      }
    },
    'Ballroom': {
      'Gouda': {
        '-': {
          'Baroque Dancer': 40.16,
          'SampleSize': 11392,
          'Sassy Salsa Dancer': 34.02,
          'Whimsical Waltzer': 25.82
        }
      },
      'SB+': {
        '-': {
          'Baroque Dancer': 38.7,
          'SampleSize': 3711,
          'Sassy Salsa Dancer': 34.9,
          'Whimsical Waltzer': 26.41
        }
      },
      'Beanster': {
        '-': {
          'Peevish Piccoloist': 39.77,
          'SampleSize': 10253,
          'Obstinate Oboist': 30.53,
          'Sultry Saxophonist': 29.7
        }
      },
      'Lavish Beanster': {
        '-': {
          'Violent Violinist': 50.39,
          'SampleSize': 14911,
          'Chafed Cellist': 49.61
        }
      },
      'Leaping Lavish Beanster': {
        '-': {
          'Violent Violinist': 50.39,
          'SampleSize': 14911,
          'Chafed Cellist': 49.61
        }
      },
      'Royal Beanster': {
        '-': {
          'Treacherous Tubaist': 100,
          'SampleSize': 7930
        }
      }
    },
    'Great Hall': {
      'Gouda': {
        '-': {
          'Scheming Squire': 40.39,
          'SampleSize': 973,
          'Plotting Page': 33.4,
          'Clumsy Cupbearer': 26.21
        }
      },
      'SB+': {
        '-': {
          'Scheming Squire': 39.13,
          'SampleSize': 994,
          'Plotting Page': 35.61,
          'Clumsy Cupbearer': 25.25
        }
      },
      'Beanster': {
        '-': {
          'Baroness Von Bean': 39.76,
          'SampleSize': 737,
          'Cagey Countess': 32.16,
          'Vindictive Viscount': 28.09
        }
      },
      'Lavish Beanster': {
        '-': {
          'Malicious Marquis': 50.58,
          'SampleSize': 605,
          'Dastardly Duchess': 49.42
        }
      },
      'Leaping Lavish Beanster': {
        '-': {
          'Malicious Marquis': 50.58,
          'SampleSize': 605,
          'Dastardly Duchess': 49.42
        }
      },
      'Royal Beanster': {
        '-': {
          'Pernicious Prince': 100,
          'SampleSize': 838
        }
      }
    },
    'Castle Giants': {
      'SB+': {
        '-': {
          'Dungeon Master': 33.33,
          'SampleSize': 3,
          'Malevolent Maestro': 33.33,
          'Mythical Giant King': 33.33
        }
      }
    }
  },
};

/**
 * @param {number} power
 * @param {number} luck
 * @param {number} mPower Mouse power
 * @param {number} mEff Mouse effectiveness
 */
function getCatchRate(power, luck, mPower, mEff) {
  mEff /= 100;
  return Math.min(1, (power * mEff + 2 * Math.pow(Math.floor(luck * Math.min(1.4, mEff)), 2)) / (mPower + power * mEff));
}

/** @type {MousePool} */
/**
 * @param {number} power
 * @param {number} luck
 * @param {MousePool} pool
 */
function getOverallCatchRate(power, luck, pool) {
  let overallCatchRate = 0;
  let overallAR = 0;
  for (const mouseName in pool) {
    const mouse = pool[mouseName];
    const cr = getCatchRate(power, luck, mouse.power, mouse.eff);
    overallCatchRate += cr * mouse.rate;
    overallAR += mouse.rate;
  }

  return overallCatchRate / overallAR;
}

/** @param {User} data */
function getProjectedMinNoise(data) {
  const castle = data.enviroment_atts.castle;
  if (castle.is_auto_harp_enabled) {
    return castle.noise_level;
  }

  const minNoise = castle.noise_level + castle.projected_noise.actual_min * castle.hunts_remaining;

  return minNoise;
}

/** @param {User} data */
function getProjectedAvgNoise(data) {
  const castle = data.enviroment_atts.castle;
  if (castle.is_auto_harp_enabled) {
    return castle.noise_level;
  }

  const cre = getCastleCatchRate(data);
  const noisePerHunt =
    data.enviroment_atts.castle.projected_noise.actual_min * (1 - cre) +
    data.enviroment_atts.castle.projected_noise.actual_max * cre;

  const avgNoise = Math.round(castle.noise_level + noisePerHunt * castle.hunts_remaining);

  return avgNoise;
}
/** @param {User} data */
function getProjectedMaxNoise(data) {
  const castle = data.enviroment_atts.castle;
  if (castle.is_auto_harp_enabled) {
    return castle.noise_level;
  }

  const maxNoise = castle.noise_level + castle.projected_noise.actual_max * castle.hunts_remaining;

  return maxNoise;
}

/**
 * Get catch rate for bb castle.
 * @param {User} data
 */
function getCastleCatchRate(data) {
  /** @type {MousePool} */
  const pool = {};

  if (data.bait_name === 0) {
    return 1;
  }

  let cheese = data.bait_name.replace(/ Cheese$/, '');
  if (cheese.indexOf('Beanster') == -1) {
    cheese = 'Gouda';
  }

  let stage = data.enviroment_atts.castle.current_floor.name.replace(/ Floor$/, '');
  // @ts-ignore
  const population = MiceARs[data.environment_name][stage][cheese]['-'];
  for (const mouse in population) {
    if (mouse == 'SampleSize') {
      continue;
    }

    const rate = population[mouse];
    pool[mouse] = {
      power: MicePowers[mouse].power,
      eff: MicePowers[mouse].eff,
      rate: rate,
    };
  }

  return getOverallCatchRate(data.trap_power, data.trap_luck, pool);
}

/** @type {NoiseHelper} */
let _noiseHelper;

/**
 * @param {User} data
 */
function addNoiseHelper(data) {
  if (!getEnhancerSetting('enableNoisehelper')) {
    return;
  }

  const container = getHUD();
  _noiseHelper = new NoiseHelper(container);
  _noiseHelper.render(data);
}

/**
 * @param {User} data
 */
function updateNoiseHelper(data) {
  if (!_noiseHelper) {
    return;
  }

  _noiseHelper.update(data);
}

class NoiseHelper {
  /** @type {JQuery<HTMLElement>} */
  _container;

  /**
   * @param {JQuery<HTMLElement>} container
   */
  constructor(container) {
    this._container = container;
  }

  /**
   * @param {User} data
   */
  render(data) {
    const atts = data.enviroment_atts;
    if (!atts.in_castle) {
      return;
    }

    if (atts.castle.is_boss_chase) {
      return;
    }


    this._container = getHUD();
    this.#intializeAllArrows();

    this.update(data);
  }

  /**
   * @param {User} data
   */
  update(data) {
    const atts = data.enviroment_atts;
    if (atts.castle.is_boss_chase) {
      return;
    }

    const noiseMeter = getNoiseMeter(this._container);
    const meterWidth = noiseMeter.width() ?? 457;

    // Min
    let totalProjectedNoise = getProjectedMinNoise(data);
    let triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);

    if (triangle.length === 0) {
      this.#intializeAllArrows();
      triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);
    }

    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    // Avg
    totalProjectedNoise = getProjectedAvgNoise(data);
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    // Max
    totalProjectedNoise = getProjectedMaxNoise(data);
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    this.updateToolTips(data);
  }

  /**
   * @param {User} data
  */
  updateToolTips(data) {
    const noiseMeterContainer = $(
      '.bountifulBeanstalkCastleView__noiseMeter',
      this._container
    );

    const noiseMeterTooltip = $('.mousehuntTooltip', noiseMeterContainer);
    if (!data.enviroment_atts.castle.is_boss_chase) {
      const minNoise = getProjectedMinNoise(data);
      const avgNoise = getProjectedAvgNoise(data);
      const maxNoise = getProjectedMaxNoise(data);
      noiseMeterTooltip.append(`
      <div style="text-align: center;">
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin">▲</span><span>: Room ends with a minimum of ${minNoise} noise.</span>
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg">▲</span><span>: Room ends with a average of ${avgNoise} noise.</span>
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax">▲</span><span>: Room ends with a maximum of ${maxNoise} noise.</span>
      </div>
      `);
    }
  }

  /**
   *
   * @param {EnvironmentAttributes} data
   * @param {number} totalProjectedNoise
   * @returns {number}
   */
  #getProjectedNoisePercent(data, totalProjectedNoise) {
    const projectedNoisePercent = totalProjectedNoise / data.castle.max_noise_level;
    return Math.min(1, projectedNoisePercent);
  }

  #intializeAllArrows() {
    const noiseMeter = getNoiseMeter(this._container);

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin'
    );

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg'
    );

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax'
    );
  }

  /**
   * @param {JQuery<HTMLElement>} parent
   * @param {string} cssClass
   */
  #initNoiseArrow(parent, cssClass) {
    const arrow = $(Templates.NoiseMeterArrow);
    arrow.addClass(cssClass);
    $(parent).append(arrow);
    arrow.css('left');
    return arrow;
  }
}

// eslint-disable-next-line no-unused-vars
let _harpMeOut;

function addHarpMeOut() {
  if (!getEnhancerSetting('enableHarpmeout')) {
    return;
  }

  onOverlayChange({
    harpDialog: {
      selector: 'bountifulBeanstalkHarpStringDialogPopup',
      show: () => {
        _harpMeOut = HarpMeOut();
        _harpMeOut.render();
      },
      hide: () => {

      }
    }
  });
}

// Harp Helper.... Harp me out... heheheh
const HarpMeOut = () => {
  const self = {};
  /** @type {JQuery<HTMLElement> | null} */
  let _container = null;

  self.render = () => {
    const regularPlayTab = $('.bountifulBeanstalkPlayHarpDialogView__regularPlayTab');
    const buttonRow = $('.bountifulBeanstalkPlayHarpDialogView__buttonRow', regularPlayTab);
    _container = $(Templates.HarpMeOut).insertBefore(buttonRow);
    applyEventListeners();
  };

  function applyEventListeners() {
    if (!_container) {
      return;
    }

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.max', _container)
      .on('click', handleMaxButton);

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.avg', _container)
      .on('click', handleAvgButton);

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.min', _container)
      .on('click', handleMinButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.max', _container)
      .on('click', handleMinusMaxButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.avg', _container)
      .on('click', handleMinusAvgButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.min', _container)
      .on('click', handleMinusMinButton);
  }

  function handleMaxButton() {
    const minNoise = getProjectedMinNoise(user);
    playLoudly(minNoise);
  }

  function handleAvgButton() {
    const avgNoise = getProjectedAvgNoise(user);
    playLoudly(avgNoise);
  }

  function handleMinButton() {
    const maxNoise = getProjectedMaxNoise(user);
    playLoudly(maxNoise);
  }

  function handleMinusMinButton() {
    const minNoise = getProjectedMinNoise(user);
    playSoftly(minNoise);
  }

  function handleMinusAvgButton() {
    const avgNoise = getProjectedAvgNoise(user);
    playSoftly(avgNoise);
  }

  function handleMinusMaxButton() {
    const maxNoise = getProjectedMaxNoise(user);
    playSoftly(maxNoise);
  }


  /**
   * @param {number} toNoise
   */
  function playLoudly(toNoise) {
    const data = getData().castle;
    const stringsToPlay = data.max_noise_level - toNoise;
    setLoudVolume(stringsToPlay);
  }

  /**
   * @param {number} toNoise
   */
  function playSoftly(toNoise) {
    const data = getData().castle;
    const stringsToPlay = toNoise - data.max_noise_level + 1;
    setSoftVolume(stringsToPlay);
  }

  /**
   * @param {number} number
   */
  function setLoudVolume(number) {
    const input = $('.bountifulBeanstalkPlayHarpDialogView__input[data-mode="plus"]');

    number = Math.max(number, 0);

    input.val(number).trigger('change');
  }

  /**
   * @param {number} number
   */
  function setSoftVolume(number) {
    const input = $('.bountifulBeanstalkPlayHarpDialogView__input[data-mode="minus"]');

    number = Math.max(number, 0);

    input.val(number).trigger('change');
  }

  function getData() {
    return user.enviroment_atts;
  }

  return self;
};

log('loaded!');

let initialized = false;

/** @param {User} user */
function getLocation(user) {
  return user.environment_name;
}

/** @param {User} user */
function isAtBountifulBeanstalk(user) {
  return getLocation(user) == 'Bountiful Beanstalk';
}

/** @param {User} user */
function updateAll(user) {
  updateCraftalyzer(user);
  updateNoiseHelper(user);
}

/** @param {User} user */
function initialize(user) {
  $('.headsUpDisplayBountifulBeanstalkView');

  addSettings();
  addStyles(styles, 'bb-hud-enh', true);
  addCraftalyzer(user);
  addNoiseHelper(user);
  // addRemembrall();
  addHarpMeOut();

  initialized = true;
}

function main() {
  if (isAtBountifulBeanstalk(user)) {
    initialize(user);
  }

  eventRegistry.addEventListener('ajax_response', (data) => {
    try {
      if (!data.user) {
        return;
      }

      if (!isAtBountifulBeanstalk(data.user)) {
        initialized = false;
        return;
      }

      if (initialized) {
        updateAll(data.user);
        return;
      }

      initialize(data.user);
    } catch (e) {
      log(e);
    }
  }, undefined, false, 10);
}

try {
  main();
} catch (e) {
  log(e);
}
