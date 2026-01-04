// ==UserScript==
// @name             Outlook App Rail to Header
// @namespace        http://www.alittleresearch.com.au/
// @version          2025-04-03
// @description      Move Outlook's app rail to the header.
// @author           Nick Sheppard
// @license          MIT
// @contributionURL  https://ko-fi.com/npsheppard
// @match            https://outlook.office.com/*
// @match            https://outlook.live.com/*
// @icon             https://www.alittleresearch.com.au/sites/default/files/alriconbl-transbg-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534786/Outlook%20App%20Rail%20to%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/534786/Outlook%20App%20Rail%20to%20Header.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2025 Nicholas Paul Sheppard. See README.md for details
//
// Buy me a Ko-Fi at https://ko-fi.com/npsheppard.
///////////////////////////////////////////////////////////////////////////////


// set which buttons should remain in the header buttons region
const headerButtonsConf = {
    'owaMeetNowButton_container': false,
    'teams_container': false,
    'owaPremiumBtn_container': false,
    'owaNoteFeedButton_container': false,
    'owaTimePanelBtn_container': false,
    'owaActivityFeedButton_container': false,
    'owaSettingsBtn_container': true,
    'owaTipsBtn_container': false,
    'owaChatButton_container': false,
    'owaChatCopilotButton_container': false,
    'OwaMergedNotificationPane_container': false
};

var documentObserver = null;

// main function
(function() {
    'use strict';

    // create the document observer and start observing
    createDocumentObserver();
    connectDocumentObserver();

})();


///////////////////////////////////////////////////////////////////////////////
// Document observer functions.
//
// The document observer looks for changes to the left rail (id LeftRail)
// and the main application panel (id MainModule).
//
// The left rail is only created once. As soon as we find it, we can set its
// display style to none, with nothing further to do.
//
// The main module is rebuilt several times during construction of the page,
// and again when switching from Mail to Calendar view, and vice versa. Each
// time, we attach a new observer to it, which updates the header buttons
// region (id headerButtonsRegionId) for the new main module.
///////////////////////////////////////////////////////////////////////////////

// Create the document observer
function createDocumentObserver() {

    documentObserver = new MutationObserver((mutations) => {
        var leftRail = null;
        var mainModule = null;
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                var ancestor = node;
                while (ancestor != null) {
                    if (ancestor.id === "LeftRail") {
                        // found the left rail
                        leftRail = ancestor;
                        break;
                    } else if (ancestor.id === "MainModule") {
                        // found the main module
                        mainModule = ancestor;
                        break;
                    }
                    ancestor = ancestor.parentNode;
                }
            }
        }
        if (leftRail != null) {
            // hide the left rail
            leftRail.style.display = "none";
        }
        if (mainModule != null) {
            // observe the main module; the callback function will insert the rail items into the header
            var mainModuleObserver = new MutationObserver(onMainModuleMutation);
            mainModuleObserver.observe(mainModule, { childList: true, subtree: true, attributes: false, characterData: false });
        }
    });

}


// Start the document observer
function connectDocumentObserver() {

    documentObserver.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });

}


// Stop the document observer
function disconnectDocumentObserver() {

    documentObserver.disconnect();

}


///////////////////////////////////////////////////////////////////////////////
// Respond to mutation of the main module, inserting the app rail into the
// header.
//
// The header buttons are contained within a div with id headerButtonsRegionId.
// Each button is identified by a class name, which is used as a key in the
// headerButtonsConf structure.
//
// Each item from the app rail is contained by a div with class ___77lcry0,
// which is one out of many classes they have. We don't need to identify them
// individually, so the class name works for our purposes.
//
// Input:
//   mutations - the mutations
//   observer - the observer
///////////////////////////////////////////////////////////////////////////////
function onMainModuleMutation(mutations, observer) {

    // disconnect the observer; a new one will attach when Outlook updates the main module
    if (observer != null) {
        observer.disconnect();
    }

    // remove unwanted children
    const headerButtonsRegion = document.getElementById("headerButtonsRegionId");
    var child = headerButtonsRegion.firstElementChild;
    while (child != null) {
        const next = child.nextElementSibling;
        if (child.id in headerButtonsConf && !headerButtonsConf[child.id]) {
            headerButtonsRegion.removeChild(child);
        }
        if (child.classList.contains("___77lcry0")) {
           headerButtonsRegion.removeChild(child);
        }
        child = next;
    }

    // disconnect to document observer to prevent infinite recursion
    disconnectDocumentObserver();

    // insert the app rail buttons at the start of the header button region
    const apps = fetchAppRailCollection();
    for (var i = apps.length - 1; i >= 0 ; i--) {
        headerButtonsRegion.insertAdjacentElement("afterbegin", apps[i]);
    }

    // reconnect the document observer
    connectDocumentObserver();

}


///////////////////////////////////////////////////////////////////////////////
// Manage the collection of buttons on the app rail.
//
// App buttons appear on the app rail at various times during building of the
// page. The fetchRailButtons() function checks for new buttons that have
// appeared since the last invocation and moves them into the
// appRailCollection array, from where they'll later be inserted into the
// header region.
//
// The app rail is a div with id LeftRail. This div is further divided into two
// div more elements, one with class ___1w2h5wn that contains the applications
// and another with class ___1fkhojs that contains the "More apps" button. Each
// button is contained in a div with class ___77lcry0. We preserve the order of
// the two div's using the appRailSeparator variable.
//
///////////////////////////////////////////////////////////////////////////////
var appRailCollection = [];
var appRailSeparator = 0;
function fetchAppRailCollection() {

    // check for new items added to the top div of the left rail
    const leftRailCollection1 = document.querySelectorAll("#LeftRail .___1w2h5wn .___77lcry0");
    for (let i = 0; i < leftRailCollection1.length; i++) {
        // remove from the left rail
        leftRailCollection1.item(i).parentNode.removeChild(leftRailCollection1.item(i));

        // insert into the collection before the separator
        if (appRailCollection.length > 0) {
            appRailCollection.splice(appRailSeparator, 0, leftRailCollection1.item(i));
        } else {
            appRailCollection.push(leftRailCollection1.item(i));
        }
        appRailSeparator++;
    }

    // check for new items added to the bottom div of the left rail
    const leftRailCollection2 = document.querySelectorAll("#LeftRail .___1fkhojs .___77lcry0");
    for (let i = 0; i < leftRailCollection2.length; i++) {
        // remove from the left rail
        leftRailCollection2.item(i).parentNode.removeChild(leftRailCollection2.item(i));

        // insert into the collection at the end
        appRailCollection.push(leftRailCollection2.item(i));
    }

    // return the collection for use by the callback
    return appRailCollection;

}
