// ==UserScript==
// @name         Enhanced Archiver CAPTCHA Resolver and Detector
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Detects and resolves CAPTCHAs, including "Too Many Requests" pages and common reCAPTCHA types. Prevents infinite tab opening. Refreshes error page after CAPTCHA resolution by direct signal.
// @author       Your Name
// @match        https://archive.is/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.ph/*
// @match        *://*/recaptcha/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/521240/Enhanced%20Archiver%20CAPTCHA%20Resolver%20and%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/521240/Enhanced%20Archiver%20CAPTCHA%20Resolver%20and%20Detector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL = 3000;
    const TIMEOUT_DURATION = 5 * 60 * 1000;
    const CLOSE_TAB_DELAY = 2000; // Delay before closing CAPTCHA tab (in milliseconds)

    let captchaTab = null;
    const TAB_ID = Math.random().toString(36).substr(2, 9); // Unique ID for each tab
    const errorPageUrl = window.location.href;
    let captchaState = GM_getValue('captchaState', {});
    let isCaptchaSolvingActive = false; // Flag to prevent multiple tab openings for the same error page

    captchaState[TAB_ID] = captchaState[TAB_ID] || { role: "isErrorPage", resolved: false, checkBoxClicked: false, solved: false };
    GM_setValue('captchaState', captchaState);

    let status = {
        captchaDetected: false,
        tabOpened: false,
        captchaSolved: false,
        timeoutReached: false,
        checkboxFound: false,
        imageCaptchaFound: false,
        audioCaptchaFound: false,
        dosCaptchaDetected: false
    };

    // Helper Functions
    const isHidden = (el) => el?.offsetParent === null;

    const detectElements = (selectors) => {
        return Object.keys(selectors).reduce((acc, key) => {
            acc[key] = document.querySelector(selectors[key]) !== null;
            return acc;
        }, {});
    };

    function detectCaptchaElements() {
        const selectors = {
            checkboxFound: ".recaptcha-checkbox-border",
            imageCaptchaFound: "#rc-imageselect",
            audioCaptchaFound: "#recaptcha-audio-button",
            dosCaptchaDetected: ".rc-doscaptcha-body",
        };

        // Detect elements and update status
        Object.assign(status, detectElements(selectors));

        if (status.captchaDetected) {
            console.log("CAPTCHA elements detected:", status);
            displayStatus();
        }
    }

    function handleErrorPage() {
        console.log(`[Error Page ${TAB_ID}] Too Many Requests detected. Resolving CAPTCHA...`);
        status.captchaDetected = true;
        status.originalPage = true;
        displayStatus();
        if (!isCaptchaSolvingActive) {
            isCaptchaSolvingActive = true;
            openCaptchaTab();
        } else {
            console.log(`[Error Page ${TAB_ID}] CAPTCHA solving already active for this page.`);
        }
    }

    function handleCaptchaPage() {
        console.log(`[CAPTCHA Tab ${TAB_ID}] CAPTCHA mode active. Monitoring for resolution...`);
        displayStatus();

        const urlParams = new URLSearchParams(window.location.search);
        const originalTabId = urlParams.get('errorPageId');

        if (!status.audioCaptchaFound) {
            console.log(`[CAPTCHA Tab ${TAB_ID}] No audio CAPTCHA detected.`);

            if (originalTabId && captchaState[originalTabId]) {
                console.log(`[CAPTCHA Tab ${TAB_ID}] Signaling error page ${originalTabId} to refresh.`);
                captchaState[originalTabId].readyToRefresh = true;
                GM_setValue('captchaState', captchaState);
            } else {
                console.warn(`[CAPTCHA Tab ${TAB_ID}] Could not find the original error page state.`);
            }

            setTimeout(() => {
                console.log(`[CAPTCHA Tab ${TAB_ID}] Closing.`);
                window.close();
            }, CLOSE_TAB_DELAY);
        }
    }

    function main() {
        if (isErrorPage()) {
            handleErrorPage();
        } else if (isCaptchaPage()) {
            handleCaptchaPage();
        } else {
            detectCaptchaElements();
        }
    }

    const startInterval = setInterval(() => {
        try {
            // Detect Cloudflare CAPTCHA
            if (detectCloudflareCaptcha()) {
                const captchaForm = document.querySelector("form[action*='challenge']");
                if (!captchaForm) {
                    console.log(`[${TAB_ID}] Cloudflare CAPTCHA solved and page verified!`);
                    captchaState[TAB_ID].solved = true;
                    GM_setValue('captchaState', captchaState);
                    clearInterval(startInterval);
                    return;
                }
            }

            // Existing reCAPTCHA logic
            const checkBox = document.querySelector(".recaptcha-checkbox-border");
            const recaptchaStatus = document.querySelector("#recaptcha-accessible-status")?.innerText;

            if (checkBox && !isHidden(checkBox) && !captchaState[TAB_ID].checkBoxClicked) {
                checkBox.click();
                captchaState[TAB_ID].checkBoxClicked = true;
                GM_setValue('captchaState', captchaState);
                console.log(`[${TAB_ID}] Checkbox clicked and state updated.`);
            }

            if (recaptchaStatus?.includes("You are verified")) {
                captchaState[TAB_ID].solved = true;
                GM_setValue('captchaState', captchaState);
                console.log(`[${TAB_ID}] reCAPTCHA Solved and state updated!`);
                clearInterval(startInterval);
            }
        } catch (err) {
            console.error(`[${TAB_ID}] Error detecting CAPTCHA resolution:`, err.message);
            clearInterval(startInterval);
        }
    }, 5000);

    function displayStatus() {
        console.table(status);
    }

    function isErrorPage() {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent.trim() === 'Too Many Requests';
    }

    function isCaptchaPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('captchaMode');
    }

    function reloadErrorPage() {
        console.log(`[Error Page ${TAB_ID}] Reloading the error page...`);
        isCaptchaSolvingActive = false; // Allow solving again if needed
        window.location.reload(true); // Force a full page reload
    }

    function monitorStateForAutoRefresh() {
        const interval = setInterval(() => {
            captchaState = GM_getValue('captchaState', {});

            if (captchaState[TAB_ID]?.readyToRefresh) {
                console.log(`[Error Page ${TAB_ID}] Received refresh signal. Reloading.`);
                clearInterval(interval);
                reloadErrorPage();
            }
        }, CHECK_INTERVAL);

        setTimeout(() => {
            const hasPendingSolvingTab = Object.values(captchaState).some(state =>
                state.role === 'solvingTab' && state.relatedErrorPageId === TAB_ID && !state.resolved
            );

            if (hasPendingSolvingTab) {
                console.log(`[Error Page ${TAB_ID}] CAPTCHA resolution timed out.`);
            }
            clearInterval(interval);
            isCaptchaSolvingActive = false; // Reset flag if timed out or no solving tab
        }, TIMEOUT_DURATION);
    }

    function openCaptchaTab() {
        if (captchaTab) {
            console.log(`[Error Page ${TAB_ID}] CAPTCHA tab already open. Skipping new tab creation.`);
            return;
        }

        const newURL = `${window.location.origin}?captchaMode=true&errorPageId=${TAB_ID}`;
        captchaTab = GM_openInTab(newURL, { active: false, insert: true, setParent: true });

        // Store the association between the error page and the solving tab
        if (captchaTab) {
            status.tabOpened = true;
            displayStatus();
            console.log(`[Error Page ${TAB_ID}] New CAPTCHA tab opened:`, newURL);

            // Update the state for the newly opened CAPTCHA tab
            const solvingTabId = Object.keys(captchaState).find(id => captchaState[id].role === undefined); // Find a newly created entry
            if (solvingTabId) {
                captchaState[solvingTabId] = { role: 'solvingTab', resolved: false, relatedErrorPageId: TAB_ID };
                GM_setValue('captchaState', captchaState);
            }

            monitorStateForAutoRefresh(); // Start monitoring on the error page
        }
    }

    function detectCloudflareCaptcha() {
        return document.querySelector("form[action*='challenge']") !== null;
    }

    // Function to check if the reCAPTCHA checkbox is solved
    function isCheckboxSolved() {
        const checkbox = document.querySelector(".recaptcha-checkbox-border");
        if (checkbox) {
            const ariaChecked = checkbox.getAttribute("aria-checked");
            if (ariaChecked === "true") {
                console.log(`[${TAB_ID}] reCAPTCHA is already solved!`);
                return true;
            } else {
                console.log(`[${TAB_ID}] reCAPTCHA is not yet solved.`);
                return false;
            }
        } else {
            console.log(`[${TAB_ID}] reCAPTCHA checkbox not found on this page.`);
            return false;
        }
    }

    // Run the check once when the page loads
    window.addEventListener('load', () => {
        isCheckboxSolved();
    });

    main();
})();