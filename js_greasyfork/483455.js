// ==UserScript==
// @name        [GC] - SDB Removal Improvements
// @namespace   https://www.grundos.cafe
// @match       https://www.grundos.cafe/safetydeposit/*
// @license    MIT
// @version     86
// @author      Cupkait (& shoutout to Josh)
// @description Never try to remove too many items from your SDB again!
// @downloadURL https://update.greasyfork.org/scripts/483455/%5BGC%5D%20-%20SDB%20Removal%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/483455/%5BGC%5D%20-%20SDB%20Removal%20Improvements.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-483455')) {
    alert("The SDB Removal Improvements script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-483455', 'true');
}