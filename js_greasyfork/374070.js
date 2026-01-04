// ==UserScript==
// @name         SteamGift Night Mode
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Quick SteamGift Night Mode
// @author       Mhaw
// @match        https://www.steamgifts.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374070/SteamGift%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/374070/SteamGift%20Night%20Mode.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('div.footer__outer-wrap{background-color: #141414;}');
    GM_addStyle('body{background: #0F0D0A}');
    GM_addStyle('div.global__image-inner-wrap, div.ui-datepicker, div.popup, div.table_image_thumbnail, div.table_image_avatar, div.widget-container img, div.page__outer-wrap, div.nav__absolute-dropdown, a.table_image_avatar, a.table_image_thumbnail, a.featured__column--group, a.giveaway_image_avatar, div.featured__column--contributor-level, a.giveaway_image_thumbnail{filter: invert(100%)');
    
})();