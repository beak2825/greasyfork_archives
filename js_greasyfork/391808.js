// ==UserScript==
// @name         Wordpress-UserData-Manipulator
// @namespace    https://greasyfork.org/de/users/228374-lynx
// @version      0.3
// @description  Using Firefox's private mode Wordpress's backend displays a popup for hints again and again. This script clicks the disable button for you.
// @author       LYNX
// @match        *://*/wp-admin/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/391808/Wordpress-UserData-Manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/391808/Wordpress-UserData-Manipulator.meta.js
// ==/UserScript==
/*global $: false */

(function() {
    'use strict';
    var button;

    button = document.querySelector("button.nux-dot-tip__disable");
    if( button ) button.click();

    button = document.querySelector("div.edit-post-welcome-guide button");
    if( button ) button.click();

})();
