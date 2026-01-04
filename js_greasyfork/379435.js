// ==UserScript==
// @name         VacyourfriendsRemastered
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prank friends by adding a fake VAC status to their profile. Based on the site https://vacyourfriends.com/ which no longer seems to be operational.
// @author       TechnicalOpposite
// @match        *://steamcommunity.com/profiles/*
// @match        *://steamcommunity.com/id/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379435/VacyourfriendsRemastered.user.js
// @updateURL https://update.greasyfork.org/scripts/379435/VacyourfriendsRemastered.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Append the button to apply fake VAC status
	document.getElementById('global_action_menu').insertAdjacentHTML('beforeend', '<div id="vyf_btn" class="vyf_btn_red"><a class="vyf_btn_content">VAC Them</a>');

	const vacbanhtml = '<div class="profile_ban_status"><div class="profile_ban">1 VAC ban on record<span class="profile_ban_info"> | <a class="whiteLink" href="https://support.steampowered.com/kb_article.php?ref=7849-Radz-6869&l=english" target="_blank" rel="noreferrer">Info</a></span></div>0 day(s) since last ban</div>';

	// Inject VAC ban HTML into the DOM, aka "VAC" your friends.
	document.getElementById('vyf_btn').onclick = function () {
		if (!document.getElementsByClassName('profile_ban_status').length) {
			if (document.getElementsByClassName('profile_private_info').length) {
				document.getElementsByClassName('profile_rightcol')[0].insertAdjacentHTML('beforeend', vacbanhtml);
			} else {
				document.getElementsByClassName('responsive_status_info')[0].insertAdjacentHTML('beforeend', vacbanhtml);
			}
		}
	}
	// CSS
	GM_addStyle(`#vyf_btn{
    display:inline-block;
    position:relative;
    line-height:24px;
    margin-left:3px
    }
    .vyf_btn_red{
    background-color:#b31515
    }
    .vyf_btn_content{
    display:inline-block!important;
    padding-left:35px!important;
    padding-right:9px!important;
    background-position:10px 5px!important;
    background-image:url(https://i.postimg.cc/tJ3L2Fbb/vac-them-button.png);
    background-repeat:no-repeat;
    text-decoration:none;
    color:#e5e4dc!important;
    font-weight:400
    }`)
})();