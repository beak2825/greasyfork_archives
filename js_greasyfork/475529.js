// ==UserScript==
// @name         Colon Cancer Tab Removal Script
// @version      1.0.0
// @description  Removes the colon cancer tab from the menu.
// @author       Colon
// @match        *://arras.io/*
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/475529/Colon%20Cancer%20Tab%20Removal%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/475529/Colon%20Cancer%20Tab%20Removal%20Script.meta.js
// ==/UserScript==
try {
document.getElementsByClassName("menuTab colonCancer")[0].remove();
} catch {return false};