// ==UserScript==
// @name         Steam Community - Chat Dropdown
// @namespace    Royalgamer06
// @version      0.3
// @description  Adds dropdown menu in steam profile pages with options to chat through web or steam client
// @author       Royalgamer06
// @include      /(http|https)\:\/\/steamcommunity.com\/(id|profiles)\/.+/
// @exclude      /(http|https)\:\/\/steamcommunity.com\/(id|profiles)\/.+\/.+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18690/Steam%20Community%20-%20Chat%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/18690/Steam%20Community%20-%20Chat%20Dropdown.meta.js
// ==/UserScript==

if (jQuery("div.profile_header_actions > a[href*=LaunchWebChat]").length > 0) {
    var steamid = g_rgProfileData.steamid;
    var href = jQuery('div.profile_header_actions > a').attr('href');
    var html = '<span class="btn_profile_action btn_medium" id="profile_chat_dropdown_link" onclick="ShowMenu( this, \'profile_chat_dropdown\', \'right\' );"> <span>Send a Message <img src="http://steamcommunity-a.akamaihd.net/public/images/profile/profile_action_dropdown.png"></span> </span><div class="popup_block" id="profile_chat_dropdown" style="visibility: visible; top: 168px; left: 679px; display: none; opacity: 1;"> <div class="shadow_ul"></div> <div class="shadow_top"></div> <div class="shadow_ur"></div> <div class="shadow_left"></div> <div class="shadow_right"></div> <div class="shadow_bl"></div> <div class="shadow_bottom"></div> <div class="shadow_br"></div> <div class="popup_body popup_menu shadow_content"> <a class="popup_menu_item" href="' + href + '"><img src="//steamcommunity-a.akamaihd.net/public/images/skin_1/icon_btn_comment.png">&nbsp; Web browser chat</a> <a class="popup_menu_item" href="steam://friends/message/' + steamid + '"><img src="//steamcommunity-a.akamaihd.net/public/images/skin_1/icon_btn_comment.png">&nbsp; Steam Client chat</a> </div> </div>';
    jQuery('div.profile_header_actions > a').replaceWith(html);
}