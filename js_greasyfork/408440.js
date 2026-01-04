// ==UserScript==
// @name         Reddit Auto Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Automatically toggle built-in dark mode on reddit.com
// @author       Nathaniel Wu
// @match        *://*.reddit.com/*
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/f638b2fee2ece92742bfbf7d4db19f18
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408440/Reddit%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/408440/Reddit%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const repeat_until_successful = (function_ptr, interval) => {
        if (!function_ptr())
            setTimeout(() => {
                repeat_until_successful(function_ptr, interval);
            }, interval);
    };
    const new_ui = getComputedStyle(document.getElementsByTagName("header")[0].firstElementChild).getPropertyValue('--newRedditTheme-body').trim() === '';
    const in_dark_mode = new_ui ? () => {
        return getComputedStyle(document.getElementsByTagName("header")[0].firstElementChild).getPropertyValue('--shreddit-content-background').trim() == '#0E1113'/*subject to change*/;
    } : () => {
        return getComputedStyle(document.getElementsByTagName("header")[0].firstElementChild).getPropertyValue('--newRedditTheme-body').trim() == "#1A1A1B"/*subject to change*/;
    };
    const element_hidden = (element) => {
        return element.offsetWidth === 0 && element.offsetHeight === 0;
    };
    const switch_theme = new_ui ? () => {
        let preferences_button = document.querySelector('#expand-user-drawer-button' /*subject to change*/);
        if (!Boolean(preferences_button))
            return false;
        let preferences_panel = document.querySelector('#user-drawer-content' /*subject to change*/);
        if (!Boolean(preferences_panel))
            return false;

        if (element_hidden(preferences_panel))
            preferences_button.click();
        let night_mode_button = document.querySelector('#darkmode-list-item faceplate-switch-input[name="darkmode-switch-name"]' /*subject to change*/);
        if (night_mode_button == null)
            return false;
        night_mode_button.click();
        repeat_until_successful(() => {
            if (!element_hidden(preferences_panel)) {
                preferences_button.click();
                return false;
            }
            return true;
        }, 500);
        return true;
    } : () => {
        let preferences_button = document.querySelector("#USER_DROPDOWN_ID"/*subject to change*/);
        if (preferences_button == null)
            return false;
        if (document.evaluate('/html/body/div/div[@role="menu"]'/*subject to change*/, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue == null) {
            preferences_button.click();
            return false;
        }
        let night_mode_button = document.evaluate('/html/body/div/div[@role="menu"]//button/span[.="Dark Mode"]/../button'/*subject to change*/, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (night_mode_button == null) {
            night_mode_button = document.evaluate('/html/body/div/div[@role="menu"]//button/div[.="Dark Mode"]/../button'/*subject to change*/, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (night_mode_button == null)
                return false;
        }
        night_mode_button.click();
        preferences_button.click();
        return true;
    };
    const setDarkMode = (on) => {
        if (in_dark_mode() != on)
            repeat_until_successful(switch_theme, 10);
    }
    const in_iframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (!in_iframe()) {
        // 4/19/2025: after recent reddit update, theme switching often does not work within a short period when the website initially loads
        const theme_delay = 1500;
        if (window.matchMedia) {// if the browser/os supports system-level color scheme
            setTimeout(() => { setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches); }, theme_delay);
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkMode(e.matches));
        } else {// otherwise use local time to decide
            let hour = (new Date()).getHours();
            setTimeout(() => { setDarkMode(hour > 18 || hour < 8); }, theme_delay);
        }
    }
})();