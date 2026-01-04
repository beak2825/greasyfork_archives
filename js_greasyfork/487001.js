// ==UserScript==
// @name        [GC] - Underwater Map Prizes (Discord Webhook)
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/treasurehunt/redeemmap*
// @match       https://www.grundos.cafe/games/treasurehunt/?type=underwater
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     86
// @author      Cupkait
// @require     https://update.greasyfork.org/scripts/485703/1319674/%5BGC%5D%20-%20Map%20Prizes%20Helper.js

// @description Userscript that allows you to send your Underwater Map prize results to Discord 
// @description via a webhook. Multiple webhooks are supported. If you are in a Discord server
// @description and want to use this but aren't sure how, feel free to reach out! NM: Cupkait, Discord DM: kaitlin.
// @downloadURL https://update.greasyfork.org/scripts/487001/%5BGC%5D%20-%20Underwater%20Map%20Prizes%20%28Discord%20Webhook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487001/%5BGC%5D%20-%20Underwater%20Map%20Prizes%20%28Discord%20Webhook%29.meta.js
// ==/UserScript==



if (!localStorage.getItem('scriptAlert-487001')) {
    alert("The Underwater Map Discord Webhook script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-487001', 'true');
}