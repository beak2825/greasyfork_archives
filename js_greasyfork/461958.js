// ==UserScript==
// @name         Youtube WC
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically clicks on the reject cookies button
// @author       Radaman
// @match        https://www.youtube.com/*
// @match        https://consent.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      gpl-2.0
// @downloadURL https://update.greasyfork.org/scripts/461958/Youtube%20WC.user.js
// @updateURL https://update.greasyfork.org/scripts/461958/Youtube%20WC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verbosity
    let consentPage = window.location.href.includes("consent") ? true : false;
    if (consentPage) {
        let rejectButton = document.querySelector('[aria-label="Reject all"]');
        if (rejectButton == null) {
            let allButtons = document.querySelectorAll('button');
            if (allButtons.length == 0) {
                console.log("Could not find buttons.");
            }
            else {
                allButtons[0].click();
            }
        }
        else {
            rejectButton.click();
        }
        return;
    }
    let verbose = false;

    // Set up some variables for maintaining order of appearance
    let buttonDetected = false;
    let dialogDetected = false;

    // Select the node that will be observed for mutations
    const targetNode = document.getRootNode();

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.id == "dialog") {
                hideDialog();
                dialogDetected = true;
                if (buttonDetected) {
                    rejectCookies();
                    observer.disconnect();
                    return;
                }
            }
            if (mutation.target.className == "yt-spec-touch-feedback-shape__fill") {
                if (dialogDetected) {
                    rejectCookies();
                    observer.disconnect();
                    document.querySelector("overlay").style.display = "none";
                    return;
                }
                else {
                    buttonDetected = true;
                    if (verbose) console.log('Would have rejected cookies.');
                }
            }
        }
    };

    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function hideDialog() {
        document.querySelector("tp-yt-iron-overlay-backdrop").style.display = "none";
        document.getElementById("dialog").style.display = "none";
        if (verbose) console.log('Hidden dialog');
    }

    function rejectCookies() {
        getElementByXpath("/html/body/ytd-app/ytd-consent-bump-v2-lightbox/tp-yt-paper-dialog/div[4]/div[2]/div[6]/div[1]/ytd-button-renderer[1]/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]").click();
        if (verbose) console.log('Rejected cookies');
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();