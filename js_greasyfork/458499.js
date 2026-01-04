// ==UserScript==
// @name         Crosshair Cursor
// @namespace    https://arras.io
// @version      0.1
// @description  Changes the cursor to a crosshair when on the Arras.io website
// @author       Scripter
// @match        https://arras.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458499/Crosshair%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/458499/Crosshair%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // change the cursor to a crosshair
    document.body.style.cursor = "crosshair";
})();
