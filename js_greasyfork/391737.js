// ==UserScript==
// @name         SkidrowReloaded -- Unlock selection & contextual menus
// @author       Silv3r
// @version      1.0.0
// @description  Simple script to restore the default behavior of the mouse events (selection and context menu)
// @include      https://www.skidrowreloaded.com/*
// @grant        none
// @namespace https://greasyfork.org/users/393151
// @downloadURL https://update.greasyfork.org/scripts/391737/SkidrowReloaded%20--%20Unlock%20selection%20%20contextual%20menus.user.js
// @updateURL https://update.greasyfork.org/scripts/391737/SkidrowReloaded%20--%20Unlock%20selection%20%20contextual%20menus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.onselectstart = null;
    document.body.onmousedown = null;
    document.body.style.cursor = "";
    document.oncontextmenu = null;
})();