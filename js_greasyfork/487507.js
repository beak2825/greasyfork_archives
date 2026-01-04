// ==UserScript==
// @name        [GC] - Kadoatery Feed Logging (Discord Webhook)
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/kadoatery/*
// @require     https://update.greasyfork.org/scripts/485575/1330924/%5BGC%5D%20-%20Kadoatery%20Details%20Helper.js
// @version     86
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @license     MIT
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Checks if feeding a kad was successful and, if it is, logs the results to pass through a Discord webhook.
// @downloadURL https://update.greasyfork.org/scripts/487507/%5BGC%5D%20-%20Kadoatery%20Feed%20Logging%20%28Discord%20Webhook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487507/%5BGC%5D%20-%20Kadoatery%20Feed%20Logging%20%28Discord%20Webhook%29.meta.js
// ==/UserScript==



if (!localStorage.getItem('scriptAlert-487507')) {
    alert("Kadoatery Feed Discord Webhooks script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-487507', 'true');
}