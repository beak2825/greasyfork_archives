// ==UserScript==
// @name         MAM Ratio Prettify
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  11/22/23 Reduce the precision of the main menu ratio to prettify it for larger ratios
// @author       studioninja
// @match        https://www.myanonamouse.net/*
// @icon         https://cdn.myanonamouse.net/imagebucket/218812/square_root_icon_512x512_i31wd3km.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480540/MAM%20Ratio%20Prettify.user.js
// @updateURL https://update.greasyfork.org/scripts/480540/MAM%20Ratio%20Prettify.meta.js
// ==/UserScript==
'use strict';

/**
 * Configuration options for the formatNumber function.
 *
 * @property {number} maxFractionDigits - The number of decimal places to be used in the formatted number.
 *                                        Applies only to both abbreviated numbers.
 *                                        Example: With precision set to 2, a number like 1234.567 will be formatted as 1234.57.
 *
 * @property {number} maxSignificantDigits - Specifies how many significant digits to show in the formatted number.
 *                                           The larger the number gets, the fewer decimal places will be shown.
 *                                           The smaller the number gets, the more decimal places will be shown.
 *                                           Example: With significantFigures set to 7, a number like 12.345678 will be shown as 12.34568.
 *                                           Exmaple: With significantFigures set to 3, a number like 123,238,283 will be shown as 123,000,000.
 *
 * @property {number} minDigitsForAbbreviation - The minimum number of digits a number must have to be formatted in abbreviated notation.
 *                                               Controls when to convert the number into abbreviated format (like K, M, B, T).
 *                                               Example: If digitsForShorthand is 5, numbers like 9999.99999 will be formatted in abbreviated, e.g., 10.00K.
 *
 * @property {Object} units - An object defining abbreviated units and their corresponding numeric values.
 *                            Maps abbreviated notations to their numeric thresholds.
 *                            Example: In { K: 1E3, M: 1E6, B: 1E9, T: 1E12 }, K represents thousands (1E3), M millions (1E6), B billions (1E9), T trillions (1E12).
 * @property {Object} location - Determines if the script should replace the ratio in specific UI locations.
 *                               This allows for selective application of the formatting rules based on the UI context.
 *                               Each property represents a different part of the UI.
 *    @property {boolean} mainMenu - Whether to apply formatting in the main menu.
 *    @property {boolean} userMenuList - Whether to apply formatting in the user menu list.
 *    @property {boolean} forum - Whether to apply formatting in forum sections.
 *    @property {boolean} user - Whether to apply formatting in user-related sections.
 *                               Disabled by default to allow the user to see the full share ratio value in at least one location.
 */
const config = {
    maxFractionDigits: 2,
    maxSignificantDigits: 7,
    minDigitsForAbbreviation: 5,
    units: { K: 1E3, M: 1E6, B: 1E9, T: 1E12 },
    location: {
        mainMenu: true,
        userMenuList: true,
        forum: true,
        user: true, // disabled by default so the user can have at least one location with the full share ratio value
    }
};

const DEBUG = 0;
const LOG_PREFIX = '[MAM-Ratio-Prettify]';

(function () {
    config.location.mainMenu && updateMenuRatio();
    config.location.userMenuList && updateMenuListRatio();
    config.location.forum && updateForumRatio();
    config.location.user && updateUserRatio();
})();

function updateMenuRatio() {
    const ratioEl = document.querySelector("#tmR");
    updateRatio(ratioEl.firstChild);

    // utilize an observer to handle the site or other scripts changing the value
    const callback = (mutationList, observer) => {
        debugLog(`Observer callback triggered`, mutationList, observer);

        // Check if the relevant child node exists
        if (!ratioEl.firstChild) return;

        // Disconnect the observer to prevent infinite loops
        observer.disconnect();

        // Update the ratio
        debugLog(`Observer updating ratio in element: `, ratioEl.firstChild);
        updateRatio(ratioEl.firstChild);

        // Reconnect the observer to listen again for changes
        observer.observe(ratioEl, { childList: true, subtree: true });
        debugLog(`Observer reconnected on element: `, ratioEl);
    };

    const observer = new MutationObserver(callback);

    // Observe both child list changes and character data changes
    observer.observe(ratioEl, { childList: true, subtree: true, characterData: true });
    debugLog(`Observer initiated on element: `, ratioEl);
}

function updateMenuListRatio() {
    const ratio = document.querySelector(".mmUserStats #RatioTD");
    ratio.textContent = ratio.textContent.replace("Ratio: ", "");
    updateRatio(ratio)
    ratio.textContent = `Ratio: ${ratio.textContent}`;
}

function updateForumRatio() {
    // the forum page path starts: /f/t/:topidId
    if (!window.location.pathname.match(/^\/f\/t\/\d+/)) {
        debugLog(`Not in a forum thread, skipping prettification`);
        return;
    }


    // This is pretty fragile because the site doesn't have any unique identifiers for the ratio element and the html isn't semantic
    const ratioEls = document.querySelectorAll(".forumAviBox b:nth-of-type(2)");
    ratioEls.forEach(el => {
        updateRatio(el.nextSibling);
        el.nextSibling.textContent = `\u00A0${el.nextSibling.textContent}`; // \u00A0 is a non-breaking space
    });
}

function updateUserRatio() {
    if (!window.location.pathname.match(/^\/u\/\d+/)) {
        debugLog(`Not in a user page, skipping prettification`);
        return;
    }


    // This is pretty fragile because the site doesn't have any unique identifiers for the ratio element and the html isn't semantic
    // the html here changes between own user vs other user, so we'll need to look for the "Share ratio" text to find the correct row
    const ratioEl = [...document.querySelectorAll(".blockBody table > tbody > tr")].find(el => el.textContent.includes("Share ratio"))?.lastChild?.firstChild;
    if (!ratioEl) {
        debugLog(`Unable to find user ratio element, skipping prettification`);
        return;
    }

    updateRatio(ratioEl);
}

function updateRatio(el) {
    if (!el) {
        console.error(`Attempted to update the ratio of a nonexistent element`);
        return;
    }

    const ratioText = el.textContent;
    const ratio = parseFloat(ratioText.replaceAll(',', ''));
    if (isNaN(ratio)) {
        debugLog(`Invalid ratio value '${ratio}', skipping prettification`);
        return;
    }

    const prettyRatio = formatNumber(ratio);
    el.textContent = prettyRatio;
    debugLog(`Updated ratio from '${ratioText}' to ${prettyRatio}`);
}

function formatNumber(num) {
    const formatConfig = {
        style: 'decimal',
        maximumSignificantDigits: config.maxSignificantDigits,
        maximumFractionDigits: config.maxFractionDigits,
    }

    const roundedNum = parseFloat(num.toPrecision(config.maxSignificantDigits));
    const leftSideDigits = Math.floor(roundedNum).toString().length;

    // Early return for non-abbreviated numbers
    if (leftSideDigits < config.minDigitsForAbbreviation) {
        return new Intl.NumberFormat("en", {...formatConfig, roundingPriority: 'morePrecision'}).format(num);
    }

    // Process for abbreviated numbers
    let formattedNumber = roundedNum;
    let suffix = '';
    for (const [unitSuffix, unitValue] of Object.entries(config.units)) {
        if (formattedNumber < unitValue * 1000) {
            formattedNumber /= unitValue;
            suffix = unitSuffix;
            break;
        }
    }

    // Ensure the number doesn't exceed the range of the last unit
    if (formattedNumber >= 1000 && suffix === '') {
        const lastUnit = Object.keys(config.units).pop();
        const lastUnitValue = config.units[lastUnit];
        formattedNumber /= lastUnitValue;
        suffix = lastUnit;
    }

    return new Intl.NumberFormat("en", {...formatConfig, roundingPriority: 'lessPrecision'}).format(formattedNumber) + suffix;
}

function debugLog(message, ...args) {
    DEBUG && console.debug(`%c${LOG_PREFIX}%c ${message}`, `font-weight: bold`, `font-weight: normal`, ...args);
}