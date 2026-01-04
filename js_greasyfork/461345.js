// ==UserScript==
// @name          Steam Trading Links
// @author        thisguy0048
// @namespace     https://greasyfork.org/es/users/1037829-thisguy0048
// @version       1
// @description   Adds extra links to Steam to make trading easier.
// @icon          https://i.imgur.com/wtUF1ci.png
// @icon64        https://i.imgur.com/wtUF1ci.png
// @include       *://steamcommunity.com/app/*
// @include       *://store.steampowered.com/app/*
// @include       *://steamcommunity.com/stats/*
// @include       *://steamcommunity.com//stats/*
// @include       *://steamcommunity.com/id/*/stats/*
// @include       *://steamcommunity.com//id/*/stats/*
// @include       *://steamcommunity.com/profiles/*/stats/*
// @include       *://steamcommunity.com//profiles/*/stats/*
// @grant         none
// @license       MIT
// @updateVersion 1
// @downloadURL https://update.greasyfork.org/scripts/461345/Steam%20Trading%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/461345/Steam%20Trading%20Links.meta.js
// ==/UserScript==

var $, jQuery;
$ = jQuery = window.jQuery;

function urlContains(urlfragment) { return document.URL.indexOf(urlfragment) != -1; }
function replaceAll(find, replace, str) {
	while(str.indexOf(find) != -1){
		str = str.replace(find, replace);
	}
	return str;
}

$("<style></style>").prop("type", "text/css").html("\
div.sel_links {background:linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%) repeat scroll 0% 0% transparent;padding:2px 5px 2px 5px;margin-bottom:10px;font-size:25px;text-align:left;color:#888888;}\
div.sel_links a, div.sel_links a:link {color:#5491cf;text-decoration:none;}\
div.sel_links a:visited {color:#5491cf;}\
div.sel_links a:hover {color:#bbbbbb;}\
div.sel_links a:active {color:#5491cf;}\
div.sel_links hr {border:0;height:1px;background:#0a0a0a;margin-top:2px;margin-bottom:2px;}\
div.sel_foot {margin:0;padding:0;text-align:center;font-size:10px;color:#444444;}\
div.sel_foot a, div.sel_foot a:link {color:#444444;text-decoration:none;}\
div.sel_foot a:visited {color:#444444;}\
div.sel_foot a:hover {color:#bbbbbb;text-decoration:underline;}\
div.sel_foot a:active {color:#444444;}\
div.sel_float {float:right;display:block;width:150px;}").appendTo("head");

var appId;
var appName;
if(urlContains("/stats/")){
	var href = $(".gameLogo").first().find("a").first().attr('href');
	appId = href.split("/app/")[1].split("/")[0].split("?")[0].split("#")[0];
	if(urlContains("/id/") || urlContains("/profiles/")){
		appName = $(".profile_small_header_location").last().text().replace(" Stats","");
	}else{
		appName = $(".profile_small_header_texture").first().find("h1").first().text();
	}
}else{
	appId = document.URL.split("/app/")[1].split("/")[0].split("?")[0].split("#")[0];
	appName = $(".apphub_AppName").first().text();
}


var link_01_04 = "<a title=\"Steam Card Exchange\" href=\"http://www.steamcardexchange.net/index.php?gamepage-appid-" + appId + "\">Steam Card Exchange</a>";
var link_01_05 = "<a title=\"Steam Market Search\" href=\"http://steamcommunity.com/market/search?q=" + appName + "\">Steam Market</a>";
var link_01_06 = "<a title=\"Steam Card Exchange\" href=\"http://www.steamcardexchange.net/index.php?gamepage-appid-" + appId + "\">Steam Card Exchange (?)</a>";


if (urlContains("store.steampowered.com/app/")){
// STORE PAGE - START
var linkDiv = $("<div></div>").addClass("sel_links");
var achDiv = $("#achievement_block");
if(achDiv.length != 0){
	var achLinkText = "Achievements";
	var achP = $(achDiv).find(".block_title").first();
	if(achP.length != 0) {
		var numText = $(achP).text();
		var numBer = numText.split(" ");
		if(numBer.length > 1) {
			achLinkText = numBer[1] + " Achievements";
		}
	}
	linkDiv.append($("<div><a title=\"Steam Achievements\" href=\"http://steamcommunity.com/stats/" + appId + "/achievements\">"+ achLinkText +"</a></div>"));
}else{
	linkDiv.append($("<div>No achievements</div>"));
}

var catDiv = $("#category_block");
var cardFound = false;
if(catDiv.length != 0) {
	var catA = $(catDiv).find("a");
	for (i = 0; i < catA.length; i++){
		if($(catA[i]).attr('href').indexOf("search/?category2=29") > -1){
			linkDiv.append($("<div>" + link_01_04 +  "</div>"));
      linkDiv.append($("<div>" + link_01_05 + "</div>"));
			var cardFound = true;
			break;
		}
	}
}
if(!cardFound){
	linkDiv.append($("<div>No Trading Cards</div>"));
}

var dlcBox = $(".game_area_dlc_section").first();
if (dlcBox.length != 0){
	var dlcLab = "DLC (?)";

	var dlcSubBox = $(dlcBox).find(".tableView").first();
	if(dlcSubBox.length != 0){
		var dlcA = $(dlcSubBox).find("a");
		if(dlcA.length > 1){ dlcLab = "DLC (" + (dlcA.length - 1) + ")"; }
	}
	linkDiv.append($("<a title=\"Steam Store DLC\" href=\"http://store.steampowered.com/dlc/" + appId + "\">" + dlcLab + "</a>"));
}

$("div.rightcol.game_meta_data").prepend(linkDiv);
// STORE PAGE - END
} else if (urlContains("steamcommunity.com/app/")){
// HUB PAGE - START
var linkDiv = $("<div></div>").addClass("sel_links");
var topBox = $(".apphub_sectionTabsHR").first();
if (topBox.length != 0){
	$(linkDiv).insertAfter(topBox);

}
// HUB PAGE - END
}else if(urlContains("/stats/")){
// STATS PAGE - START
var linkDiv = $("<div></div>").addClass("sel_links");
var topDiv = $("#BG_bottom");
$(topDiv).css("paddingTop", "0px");
$("#BG_bottom").prepend(linkDiv);
$("#mainContents").css("paddingTop", "0px");

$(linkDiv).css("margin", "0 0 5px 0");
// STATS PAGE - END
}