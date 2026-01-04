// ==UserScript==
// @name         PybGen Dark Mode
// @namespace    https://romw314.com
// @version      2024-12-28
// @description  Use PybGen in the hidden built-in Dark Mode, enabled by this script.
// @author       romw314
// @match        https://romw314.com/priv0/pybgen0/*
// @icon         https://romw314.com/priv0/pybgen0/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522138/PybGen%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522138/PybGen%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sp = new URLSearchParams(window.location.search);
    if (sp.has('dark')) return;
    sp.set('dark', '1');
    window.location.search = sp.toString();
})();