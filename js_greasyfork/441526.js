// ==UserScript==
// @name         Lobste.rs ignore system theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ignore system color theme for Lobste.rs
// @author       r8
// @license      MIT
// @match        https://lobste.rs/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441526/Lobsters%20ignore%20system%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/441526/Lobsters%20ignore%20system%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.documentElement.classList.remove('color-scheme-system');
})();