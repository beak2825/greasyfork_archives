// ==UserScript==
// @name         MfcLocalBlacklistAddOn
// @namespace    https://myfigurecollection.net/profile/rrf
// @version      0.1
// @description  Allows you to set figures in "blacklist", so they are shown blurred/darkened in result pages.
// @author       rrf
// @match        https://myfigurecollection.net/*
// @grant        GM_addStyle
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/461799/MfcLocalBlacklistAddOn.user.js
// @updateURL https://update.greasyfork.org/scripts/461799/MfcLocalBlacklistAddOn.meta.js
// ==/UserScript==

// Consts from the official UI
const kIconToggleOn = 'icon-toggle-on';
const kIconToggleOff = 'icon-toggle-off';
const kIconBeforeCssClass = 'icon-before';
const kInfoBoxIconCssClass = 'icon';
const kInfoBoxIconThCssClass = 'icon-th';
const kInfoBoxActionsCssClass = 'actions';
const kInfoBoxCollectionCssClass = 'tbx-target-COLLECTION data_2'; // to append the new box after this.
const kItemCssClass = 'item-icon';

// Consts for this script.
const kBlacklistKeyPrefix = 'blacklist.';
const kBlacklistBoxCssClass = 'tbx-target-BLACKLIST';
const kBlacklistBoxTitleText = 'Blacklist';
const kBlacklistCheckBoxText = 'Blacklist this item';
const kBlacklistCheckboxSpanId = 'blacklist-chkbox';
const kBlacklistCssClass = 'item-icon-blacklisted';
const kForceOwnedCssClass = 'item-icon-owned';
const kForceOrderedCssClass = 'item-icon-ordered';
const kAddedCss = `
  span.item-icon:has(a):has(span):has(span.icon-check-circle) {
     background: lightgreen;
  }
  span.item-icon:has(a):has(span):has(span.item-is-collected-as-1) {
     background: lightblue;
  }
  /*These 2 are the same as the above, but for the item page where the class is added manually*/
  span.item-icon.item-icon-owned {
     background: lightgreen;
  }
  span.item-icon.item-icon-ordered {
     background: lightblue;
  }
  /*This is the main one, added manually through the database*/
  span.item-icon-blacklisted {
     filter: brightness(40%) blur(2px);
  }
  /*New default*/
  span.item-icon {
     background: grey;
  }
  `;

function GetItemIdFromUrl(url) { return parseInt(url.match(new RegExp("item\/(\\d+)"))[1]); }
function IsItemPage() { return !!document.URL.match(new RegExp("item\/(\\d+)")); }

function UpdateBlacklistStatus() {
    let chkboxSpan = document.getElementById(kBlacklistCheckboxSpanId);
    let isBlacklist = chkboxSpan.classList.contains(kIconToggleOn);
    let newValue = !isBlacklist;
    let dbKey = kBlacklistKeyPrefix+GetItemIdFromUrl(document.URL);
    if (newValue) {
        GM.setValue(dbKey, true);
    } else {
        GM.deleteValue(dbKey); // on false, just remove it from the db.
    }
    console.log('Updated to: ' + newValue);

    // also update the UI.
    if (isBlacklist) {
        chkboxSpan.classList.remove(kIconToggleOn);
        chkboxSpan.classList.add(kIconToggleOff);
    } else {
        chkboxSpan.classList.remove(kIconToggleOff);
        chkboxSpan.classList.add(kIconToggleOn);
    }
    return false;
}

function PrepareBlacklistControlBox(currentBlacklistStatus) {
    // Create extra box for blacklist mode.
    let blacklistBox = document.createElement('div');
    blacklistBox.classList.add(kBlacklistBoxCssClass);
    let blacklistSection = document.createElement('section');
    blacklistBox.appendChild(blacklistSection);
    let blacklistH2 = document.createElement('h2');
    blacklistSection.appendChild(blacklistH2);
    let blacklistSpan = document.createElement('span');
    blacklistSpan.classList.add(kInfoBoxIconCssClass);
    blacklistSpan.classList.add(kInfoBoxIconThCssClass);
    blacklistH2.appendChild(blacklistSpan);
    blacklistH2.append(kBlacklistBoxTitleText);

    // Add action button.
    let actionsDiv = document.createElement('div');
    actionsDiv.classList.add(kInfoBoxActionsCssClass);
    let actionsA = document.createElement('a');
    actionsA.href = '#';
    actionsA.title = kBlacklistCheckBoxText;
    actionsA.onclick = UpdateBlacklistStatus;
    actionsDiv.appendChild(actionsA);
    let actionsSpan = document.createElement('span');
    actionsSpan.classList.add(kIconBeforeCssClass);
    actionsSpan.id = kBlacklistCheckboxSpanId;
    if (currentBlacklistStatus) {
        actionsSpan.classList.add(kIconToggleOn);
    } else {
        actionsSpan.classList.add(kIconToggleOff);
    }
    actionsA.appendChild(actionsSpan);
    blacklistH2.appendChild(actionsDiv);

    // Append the box.
    let collectionBox = document.getElementsByClassName(kInfoBoxCollectionCssClass)[0];
    collectionBox.parentNode.insertBefore(blacklistBox, collectionBox.nextSibling);
}

(function() {
    'use strict';
    if (IsItemPage()) {
        let itemId = GetItemIdFromUrl(document.URL);
        (async function() {
            // Read item's blacklist status.
            let itemBlacklistStatus = await GM.getValue(kBlacklistKeyPrefix+itemId, false);
            PrepareBlacklistControlBox(itemBlacklistStatus);
        })();
        return;
    }
    GM_addStyle(kAddedCss);

    // Update other pages.
    let allFoundItemsInPage = document.getElementsByClassName(kItemCssClass);
    for (let i = 0; i < allFoundItemsInPage.length; ++i) {
        let itemId = GetItemIdFromUrl(allFoundItemsInPage[i].getElementsByTagName('a')[0].href);
        (async function() {
            let itemBlacklistStatus = await GM.getValue(kBlacklistKeyPrefix+itemId, false);
            if (itemBlacklistStatus) {
                console.log('blacklisted: ' + itemId);
                allFoundItemsInPage[i].classList.add(kBlacklistCssClass);
            }
        })();
    }
})();
