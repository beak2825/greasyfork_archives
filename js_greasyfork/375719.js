// ==UserScript==
// @name         Sharing.wtf Countdown Skip + Adblock Nag Remove
// @namespace    https://greasyfork.org/en/users/215602
// @version      0.1
// @description  Skips the countdown
// @author       JUSSKiE
// @match        *://www.sharing.wtf/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/375719/Sharingwtf%20Countdown%20Skip%20%2B%20Adblock%20Nag%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/375719/Sharingwtf%20Countdown%20Skip%20%2B%20Adblock%20Nag%20Remove.meta.js
// ==/UserScript==

// Set download timer to 0s
window.eval("seconds = 0;");

// Remove adverts
$('.metaRedirectWrapperTopAds').remove();
$('.ad-container').remove();
$('.dv').remove();
$('.google-center-div').remove();
$('.google_image_div').remove();
$('.aw0').remove();
$('.img_ad').remove();
$('.jar').remove();
$('._vdo_ads_player_ai_').remove();
$("div[id$='adblockinfo']").remove();