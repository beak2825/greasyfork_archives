// ==UserScript==
// @name         StackOverflow Answers full width
// @namespace    https://xxbi.me/
// @version      1.0
// @description  Makes the Main bar full width to show more content and hide the stupid useless Side Bar
// @author       xBiei
// @license      MIT
// @match        *://stackoverflow.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://stackexchange.com/*
// @match        *://superuser.com/*
// @match        *://serverfault.com/*
// @match        *://askubuntu.com/*
// @match        *://stackapps.com/*
// @match        *://mathoverflow.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468782/StackOverflow%20Answers%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/468782/StackOverflow%20Answers%20full%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sideBar = document.getElementById('sidebar');
    const mainBar = document.getElementById('mainbar');
    sideBar.hidden = true
    mainBar.style = "width: auto"
})();