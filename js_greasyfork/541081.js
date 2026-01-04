// ==UserScript==
// @name         Torn Celebration Logos replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace celebration logos with the default dark mode Torn Logo
// @author       Yuko [2570196]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541081/Torn%20Celebration%20Logos%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/541081/Torn%20Celebration%20Logos%20replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const disablePrideDay = true;
    const disableValentine = false;
    const disableThanksgiving = false;
    const disableAprilsFool = false;
    const disableBoxingDay = false;
    const disableChristmasDay = false;
    const disableChristmasEve = false;
    const disableEasterSunday = false;
    const disableGuyFawkes = false;
    const disableHalloween = false;
    const disableIndependence = false;
    const disableNewYear = false;
    const disableStPatrick = false;

    const defaultLogoSet = `image-set(
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@1x.webp") type("image/webp") 1x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@2x.webp") type("image/webp") 2x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@3x.webp") type("image/webp") 3x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@4x.webp") type("image/webp") 4x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@1x.png") type("image/png") 1x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@2x.png") type("image/png") 2x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@3x.png") type("image/png") 3x,
        url("/images/v2/torn_logo/dark_mode/regular/desktop/logo@4x.png") type("image/png") 4x
    )`;

    let css = '';

    if (disableValentine) {
        css += `.d[data-country=torn][data-celebration=st-valentine] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableThanksgiving) {
        css += `.d[data-country=torn][data-celebration=thanks-giving] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disablePrideDay) {
        css += `.d[data-country=torn][data-celebration=pride-day] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableAprilsFool) {
        css += `.d[data-country=torn][data-celebration=aprils-fool] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableBoxingDay) {
        css += `.d[data-country=torn][data-celebration=boxing-day] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableChristmasDay) {
        css += `.d[data-country=torn][data-celebration=christmas-day] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableChristmasEve) {
        css += `.d[data-country=torn][data-celebration=christmas-eve] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableEasterSunday) {
        css += `.d[data-country=torn][data-celebration=easter-sunday] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableGuyFawkes) {
        css += `.d[data-country=torn][data-celebration=guy-fawkes] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableHalloween) {
        css += `.d[data-country=torn][data-celebration=halloween] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableIndependence) {
        css += `.d[data-country=torn][data-celebration=independence] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableNewYear) {
        css += `.d[data-country=torn][data-celebration=new-year] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (disableStPatrick) {
        css += `.d[data-country=torn][data-celebration=st-patrick] div.logo {
            background-image: ${defaultLogoSet} !important;
        }\n`;
    }

    if (css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);
    }
})();
