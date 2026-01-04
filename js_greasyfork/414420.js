// ==UserScript==
// @name         ResetEra Auto Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically toggle built-in dark mode on resetera.com
// @author       Nathaniel Wu
// @match        *.resetera.com/*
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/13f3c865e190c2b182e41b9978c49782
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414420/ResetEra%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/414420/ResetEra%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const setDarkMode = on => {
        const light_dark_switch = document.querySelector('label#js-XFUniqueId3.thstyleswitch_toggleSwitch > input.thstyleswitch_toggleSwitch__checkbox');
        if (!Boolean(light_dark_switch)) {
            console.log('site updated, current script no longer works');
            return;
        }
        let is_light = !(light_dark_switch.checked);
        if (on === is_light) light_dark_switch.click();
    }
    if (window.matchMedia) {// if the browser/os supports system-level color scheme
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkMode(e.matches));
    } else {// otherwise use local time to decide
        let hour = (new Date()).getHours();
        setDarkMode(hour > 18 || hour < 8);
    }
})();