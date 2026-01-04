// ==UserScript==
// @name        [GC] - Underwater Fishing Mods
// @namespace   Grundo's Cafe
// @match       https://www.grundos.cafe/water/fishing/
// @match       https://www.grundos.cafe/help/userscripts/
// @grant       GM.getValue
// @grant     	GM.setValue
// @grant       GM.addStyle
// @grant       GM.xmlHttpRequest
// @version     86
// @license     MIT
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Fishing rewards sorting and logging with combined results.
// @require https://update.greasyfork.org/scripts/489454/1588028/%5BGC%5D%20-%20Underwater%20Fishing%20Prizes%20Library.js
// @require https://update.greasyfork.org/scripts/514423/1554918/GC%20-%20Universal%20Userscripts%20Settings.js
// @downloadURL https://update.greasyfork.org/scripts/535830/%5BGC%5D%20-%20Underwater%20Fishing%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/535830/%5BGC%5D%20-%20Underwater%20Fishing%20Mods.meta.js
// ==/UserScript==




if (!localStorage.getItem('scriptAlert-535830')) {
    alert("Underwater Fishing Logger script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-535830', 'true');
}