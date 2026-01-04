// ==UserScript==
// @name        Wikiwand Setting Override
// @version     1.2
// @description Update settings for Wikiwand.com to prefered values
// @include     https://www.wikiwand.com/*
// @author      kunalagra
// @license     MIT
// @namespace   https://greasyfork.org/users/878597
// @supportURL  https://github.com/kunalagra/
// @run-at      document-end
// @icon        https://www.wikiwand.com/icon-512.png
// @downloadURL https://update.greasyfork.org/scripts/509541/Wikiwand%20Setting%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/509541/Wikiwand%20Setting%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';

      const settingsObject = {
        "columnWidth": "62em",
        "theme": "black",
        "fontSize": "17.5px",
        "fontBody": {
            "FALLBACK": "var(--base-font-body)",
            "ja": "var(--font-m-plus-rounded-1c)",
            "zh": "var(--font-noto-sans-sc)",
            "ko": "var(--font-ibm-plex-sans-kr)",
            "he": "var(--font-rubik)",
            "ar": "var(--font-ibm-plex-sans-arabic)",
            "th": "var(--font-ibm-plex-sans-thai)",
            "hi": "var(--font-hind)"
        },
        "fontHeader": {
            "FALLBACK": "var(--base-font-header)",
            "ja": "var(--font-zen-kaku-gothic-new)",
            "zh": "var(--font-noto-serif-sc)",
            "ko": "var(--font-nanum-gothic)",
            "he": "var(--font-secular-one)",
            "ar": "var(--font-tajawal)",
            "th": "var(--font-kanit)",
            "hi": "var(--font-mukta)"
        },
        "links": "color",
        "ai": "false",
        "toc": "true",
        "textAlign": "auto",
        "layout": "cover"
    };
    // Function to get a cookie value by name
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookiesArray = document.cookie.split(';');
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i].trim();
            if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
        }
        return null;
    }

    // Function to set a cookie
    function setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + "; path=/; secure; samesite=None";
        console.log(`Cookie '${name}' set with value: ${value}`);
    }

    // Check if the 'settings' cookie exists
    const settingsCookie = getCookie('settings');

    if (settingsCookie) {
        console.log(`Cookie 'settings' already exists with value: ${settingsCookie}`);
    } else {
        console.log("Cookie 'settings' not found. Setting a new cookie with a defined values.");
        const settings = JSON.stringify(settingsObject);
        setCookie('settings', settings);
        setCookie('wikiwand-omni-intro', true)
        location.reload();
    }
})();

