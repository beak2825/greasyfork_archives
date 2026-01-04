// ==UserScript==
// @name         eDom SnowFlakers Disable
// @version      0.1
// @description  eDom Christmas Snowflakes disabler
// @author       amb1tionz
// @include       *https://www.edominations.com/*
// @grant        none
// @namespace https://greasyfork.org/users/716749
// @downloadURL https://update.greasyfork.org/scripts/418629/eDom%20SnowFlakers%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/418629/eDom%20SnowFlakers%20Disable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let snowflakes = document.querySelector(".snowflakes")
    snowflakes.setAttribute("style", "display: none")
})();