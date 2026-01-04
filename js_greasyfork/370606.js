// ==UserScript==
// @name         Firefox Newtab Disabler for GitHub Projects
// @namespace    http://github.com/DuckSoft
// @version      0.1
// @description  Never drag out a new tab.
// @author       DuckSoft
// @match        *://github.com/*/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370606/Firefox%20Newtab%20Disabler%20for%20GitHub%20Projects.user.js
// @updateURL https://update.greasyfork.org/scripts/370606/Firefox%20Newtab%20Disabler%20for%20GitHub%20Projects.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.ondrop = e => {
        e.preventDefault();
        e.stopPropagation();
    }
})();
