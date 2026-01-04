// ==UserScript==
// @name         [GC] - Dailies Preferences Wizard
// @namespace    https://www.grundos.cafe/
// @version      86
// @license MIT
// @description  Set preferences including redirects for dailies with expanded functionality.
// @match        https://www.grundos.cafe/*
// @require      https://update.greasyfork.org/scripts/514423/1554918/GC%20-%20Universal%20Userscripts%20Settings.js
// @grant        GM.getValue
// @grant        GM.setValue
//

// @downloadURL https://update.greasyfork.org/scripts/534984/%5BGC%5D%20-%20Dailies%20Preferences%20Wizard.user.js
// @updateURL https://update.greasyfork.org/scripts/534984/%5BGC%5D%20-%20Dailies%20Preferences%20Wizard.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-534984')) {
    alert("Dailies Preferences script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-534984', 'true');
}