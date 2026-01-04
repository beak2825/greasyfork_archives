// ==UserScript==
// @name           Business Central Backup Automation
// @name:de        Business Central Backup-Automatisierung

// @description    Automates the creation of backups of the Business Central database using Azure.
// @description:de Automatisierung des Erstellens von Backups von Business Central mittels Azure.

// @version        2.1.0
// @author         Rsge
// @copyright      2025+, Jan G. (Rsge)
// @license        Mozilla Public License 2.0
// @icon           https://msweugwcas4004-a8arc8v.appservices.weu.businesscentral.dynamics.com/tenant/msweua1602t06326066/tab/92b102bf-7e05-4693-b322-e60777e7602f/Brand/Images/favicon.ico

// @namespace      https://github.com/Rsge
// @homepageURL    https://github.com/Rsge/Business-Central-Auto-Backup
// @supportURL     https://github.com/Rsge/Business-Central-Auto-Backup/issues

// @match          https://portal.azure.com/*
// @match          https://businesscentral.dynamics.com/*

// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/533636/Business%20Central%20Backup%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/533636/Business%20Central%20Backup%20Automation.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Constants
  const T = 1000;
  const LOC = window.location;
  const LINK_LABEL = "azureSasUrl";
  // Resources
  const ENV_IDX = 0; // Index (0-based) of environment to backup in list of BC Admin center
  const START_AUTOMATION_QUESTION = "Start backup automation?";
  const PASTE_SAS_URI_MSG = `<p>Sadly, automatic pasting of the SAS-URL doesn't seem possible.<br>
  The SAS-URL will be added to your clipboard.<br>
  Please paste it manually using <kbd><kbd>Ctrl</kbd>+<kbd>V</kbd></kbd>.<br>
  After pasting, the export will automatically be started immediately and the tab closed after 5 s.<br>
  It can then take around 15 minutes for the backup to show up in Containers.</p>`;

  // Variables
  let i;

  // Basic functions
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function getCookies() {
    return document.cookie.split(";")
      .map(function(cstr) {
      return cstr.trim().split("=");})
      .reduce(function(acc, curr) {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
  }
  function setCookie(key, value) {
    document.cookie = key + "=" + value + "; path=/";
  }
  function getXthElementByClassName(className, i = 0) {
    return document.getElementsByClassName(className)[i];
  }
  function getElementByClassNameAndTitle(className, title) {
    let items = Array.from(document.getElementsByClassName(className));
    const foundItem = items.find(
      e => e.title.startsWith(title)
    );
    return foundItem;
  }
  function getElementByClassNameAndText(className, text) {
    let items = Array.from(document.getElementsByClassName(className));
    const foundItem = items.find(
      e => e.textContent.startsWith(text)
    );
    return foundItem;
  }
  async function findClickWait(className, string, t, useText = false) {
    let element;
    if (useText) {
      element = getElementByClassNameAndText(className, string);
    } else {
      element = getElementByClassNameAndTitle(className, string);
    }
    if (element) {
      element.click();
      await sleep(t);
      return true;
    }
    return false;
  }

  /* --------------------------------------------------- */

  /* Custom dialog boxes */

  // Base dialog
  async function cdialog(id, html) {
    // Create dialog HTML.
    let dialog = document.createElement("dialog");
    dialog.id = id;
    dialog.innerHTML = html;
    // Add dialog to site and show it.
    document.body.appendChild(dialog);
    dialog.showModal();
    // Wait for click on one of the buttons.
    return new Promise(function(resolve) {
      let buttons = dialog.getElementsByClassName("button")
      for (i = 0; i < buttons.length; i++) {
        let result = i == 0;
        buttons[i].addEventListener("click", function() {dialog.close(); resolve(result);});
      }
    });
  }

  // Confirmation dialog
  async function yesNoDialog(msg) {
    return await cdialog("yesNoDialog", `<p>
    <label>${msg}</label>
</p><p class="button-row">
    <button name="yesButton" class="button">Ja</button>
    <button name="noButton" class="button">Nein</button>
</p>`);
  }

  // Ok dialog
  async function okCancelDialog(msg) {
    return await cdialog("okCancelDialog", `<p>
    <label>${msg}</label>
</p><p class="button-row">
    <button name="okButton" class="button">OK</button>
    <button name="cancelButton" class="button">Abbrechen</button>
</p>`);
  }

  /* --------------------------------------------------- */

  /* Main */
  // Azure
  window.addEventListener('load', async function() {
    if (LOC.href.endsWith("azure.com/#home") && await yesNoDialog(START_AUTOMATION_QUESTION)) {
      // Sidebar
      await findClickWait("fxs-topbar-sidebar-collapse-button", "Show portal menu", 0.5*T);
      // Storage accounts
      await findClickWait("fxs-sidebar-item-link", "Storage accounts", 3*T);
      // First storage account
      let accountCName = "fxc-gcflink-link"
      if (!getXthElementByClassName(accountCName)) {
        window.open("https://portal.azure.com/#blade/HubsExtension/BrowseResourceLegacy/resourceType/Microsoft.Storage%2FStorageAccounts", "_self");
        await sleep(3*T);
      }
      getXthElementByClassName(accountCName).click();
      await sleep(3*T);
      // Sidebar
      await findClickWait("fxs-topbar-sidebar-collapse-button", "Show portal menu", 0.5*T);
      // Shared access signature
      await findClickWait("fxc-menu-item", "Shared access signature", 5*T, true);
      // SAS form
      let sasCategories = document.getElementsByClassName("msportalfx-layoutChildren-horizontal-inlineblock");
      /// Checkboxes - check = false, uncheck = true
      let sasTypeAndIdcs = [
        [true, [1, 2, 3,]], // Allowed services (Blob)
        [false, [1, 2,]], // Allowed resource types (Containter, Object)
        [true, [3, 4, 6, 7, 8, 9]], // Allowed permissions (Read, Write, Delete, Create)
      ];
      for (i = 0; i < sasTypeAndIdcs.length; i++) {
        let sasType = sasTypeAndIdcs[i][0];
        for (let sysIdx of sasTypeAndIdcs[i][1]) {
          let sasElement = sasCategories[i].children[sysIdx]
          let sasCheckBox = sasElement.getElementsByClassName("fxc-base azc-control azc-editableControl")[0];
          if (sasCheckBox.ariaChecked == sasType.toString()) {
            sasCheckBox.click()
          }
        }
      }
      /// Date
      let endDatePicker = getXthElementByClassName("azc-datePicker", 1);
      let datePanelOpener = endDatePicker.children[0].children[1];
      datePanelOpener.click();
      let datePanel = getXthElementByClassName("azc-datePanel");
      let todayBox = datePanel.getElementsByClassName("azc-datePanel-selected")[0];
      let weekArray = Array.from(todayBox.parentNode.children);
      let todayIdx = weekArray.indexOf(todayBox);
      let tomorrowBox = weekArray[todayIdx + 1];
      tomorrowBox.click();
      await sleep(T);
      /// Generate
      await findClickWait("fxc-simplebutton", "Generate SAS and connection string", 2*T, true);
      /// Copy
      let encLink = encodeURIComponent(getElementByClassNameAndTitle("azc-input azc-formControl", "https://").value);
      // Open BC
      let bcWindow = window.open("https://businesscentral.dynamics.com/?noSignUpCheck=1&" + LINK_LABEL + "=" + encLink)
      await sleep(T);
      // Sidebar
      await findClickWait("fxs-topbar-sidebar-collapse-button", "Show portal menu", 0.5*T);
      // Containers
      await findClickWait("fxc-menu-item", "Containers", 4*T, true);
      // First container
      getXthElementByClassName("ms-List-cell")?.children[0].children[1].children[0].children[0].children[1].click();
      await sleep(240*T);
      await findClickWait("azc-toolbarButton-label", "Refresh", T, true);
    } // BusinessCentral
    else if (LOC.host.startsWith("businesscentral")) {
      // Normal BC
      if (!LOC.pathname.endsWith("/admin")) {
        // Get SAS link from URL.
        let params = new URLSearchParams(LOC.search);
        const Link = encodeURIComponent(params.get(LINK_LABEL));
        // If no link found, exit for normal use.
        if (!Link) {
          return;
        }
        // Wait for loading of elements.
        let ranSettings = false;
        let ranAC = false;
        let observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            // "Disable" observer after Admin Center is clicked.
            if (ranAC) {
              return;
            }
            let node = mutation.addedNodes[0];
            if (node?.children != null && node.children.length > 0) {
              // Open settings dropdown.
              const SettingsButtonID = "O365_MainLink_Settings";
              if (!ranSettings && node.children[0].id == SettingsButtonID) {
                ranSettings = true;
                document.getElementById(SettingsButtonID).click();
              } // Open Admin Center (in new tab) and close current tab.
              // Also set a cookie with the SAS link for use in the Admin Center.
              else {
                let adminCenter = document.getElementById("AdminCenter")
                if (adminCenter) {
                  ranAC = true;
                  setCookie(LINK_LABEL, Link)
                  adminCenter.click();
                  window.close();
                }
              }
            }
          });
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      } // BC Admin Center
      else {
        // Get SAS link from cookie.
        const Link = getCookies()[LINK_LABEL];
        // If no link found, exit for normal use.
        if (!Link || Link.length == 0) {
          return;
        }
        // Environments
        findClickWait("ms-Button ms-Button--action ms-Button--command", "Environments", 0);
        // Wait for loading of environments.
        let run = false;
        const EnvListClassName = "ms-List-page"
        let observer = new MutationObserver(function(mutations) {
          mutations.forEach(async function(mutation) {
            let node = mutation.addedNodes[0];
            //console.log(node);
            if (node?.children != null) {
              if (node.className == EnvListClassName) {
                // First environment
                let envList = getXthElementByClassName(EnvListClassName);
                let env = envList.children[ENV_IDX].children[0].children[0].children[0].children[0].children[0];
                env.click();
                await sleep(T);
                // Database dropdown
                await findClickWait("ms-Button ms-Button--commandBar ms-Button--hasMenu", "Database", 0.5*T);
                // Create export
                await findClickWait("ms-ContextualMenu-link", "Create database export");
              } else if (node.className.startsWith("ms-Layer ms-Layer--fixed")) {
                // Insert link
                let sasTxt = getElementByClassNameAndTitle("ms-TextField-field", "SAS URI from Azure");
                if (sasTxt) {
                  let decLink = decodeURIComponent(Link);
                  await sleep(T);
                  if (await okCancelDialog(PASTE_SAS_URI_MSG)) {
                    const inputHandler = async function(e) {
                      if (e.target.value == decLink) {
                        await sleep(T);
                        await findClickWait("ms-Button ms-Button--primary", "Create", 5*T, true);
                        window.close();
                      }
                    }
                    sasTxt.addEventListener("input", inputHandler);
                    navigator.clipboard.writeText(decLink);
                    sasTxt.focus();
                  }
                }
              }
            }
          });
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }
    }
  })
})();
