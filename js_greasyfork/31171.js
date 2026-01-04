// ==UserScript==
// @name		Show Rocket League Stats via Steam
// @namespace	steam
// @include		/https?:\/\/steamcommunity\.com\/(id|profiles)\/[^/]+\/?$/
// @description Create a link in a user's steam profile to quickly see his stats Rocket League.
// @version		1.2
// @author      @Glaived_Dev
// @licence     CC0 - Public Domain
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/31171/Show%20Rocket%20League%20Stats%20via%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/31171/Show%20Rocket%20League%20Stats%20via%20Steam.meta.js
// ==/UserScript==

/**
 * @namespace
 * @property {object}  config
 * @property {object}  config.variables                   - Contains script configuration.
 * @property {string}  config.variables.siteForShowStats  - Site used to display statistics. "rocketleague.tracker.network" | "rocketleaguestats"
 * @property {bool}    config.variables.sameTab           - If you want open the page in the same tab
 */
config = function(){
	var variables = {
		siteForShowStats: "rocketleague.tracker.network",
		sameTab: true,
	};

	function init(){};

	return {
		init: init,
		variables: variables,
	};
}();

/*******************************************************************************************************************************************************
 *******************************************************************************************************************************************************
 ****************************                                                                                               ****************************
 ****************************                                 DON'T MODIFY ANYTHING BELOW                                   ****************************
 ****************************                                                                                               ****************************
 *******************************************************************************************************************************************************
 *******************************************************************************************************************************************************
 */

id = window.location.href.replace(new RegExp(/https?:\/\/steamcommunity\.com\/(id|profiles)\//), "");

if(id.substr(id.length - 1) == "/") id = id.slice(0, -1);

jQuery(document).ready(function(){
	console.log("%c INFO : Show Rocket League Stats via Steam script is running… ", "color: #3498db");

	if(config.variables.siteForShowStats == "rocketleaguestats")
		var url = "https://rocketleaguestats.com/profile/steam/";
	else if(config.variables.siteForShowStats == "rocketleague.tracker.network")
		var url = "https://rocketleague.tracker.network/profile/steam/";
	else
		var url = "https://rocketleague.tracker.network/profile/steam/";

	var tab     = config.variables.sameTab ? "_self" : "_blank";
	var private = jQuery(".profile_private_info").size() > 0 ? true : false;

	if(private){
		jQuery("head").append("<style>\
			.profile_header_actions {\
				clear: both;\
			}\
			.profile_header_badgeinfo_badge_area {\
				float: right;\
			}\
			.profile_header .profile_header_centered_persona {\
				right: initial;\
			}\
		</style>");

		jQuery(".profile_header_actions").prepend("<a class=\"btn_profile_action btn_medium\" target=\""+tab+"\" href=\""+url+id+"\"><span>Rocket League stats</span></a>");
	}else{
		jQuery(".profile_item_links").prepend("<div class=\"profile_count_link ellipsis\">\
			<a target=\""+tab+"\" href=\""+url+id+"\">\
			<span class=\"count_link_label\">Rocket League stats</span>&nbsp;\
			</a>\
		</div>");
	}
});