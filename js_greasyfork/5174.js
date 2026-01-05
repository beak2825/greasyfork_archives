// ==UserScript==
// @name          Steam Extra Game Links
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       11
// @description   Adds extra links to Steam Store and Game Hub pages.
// @icon          http://i.imgur.com/ocF36Q0.png
// @icon64        http://i.imgur.com/zK9Apns.png
// @include       *://steamcommunity.com/app/*
// @include       *://store.steampowered.com/app/*
// @include       *://steamcommunity.com/stats/*
// @include       *://steamcommunity.com//stats/*
// @include       *://steamcommunity.com/id/*/stats/*
// @include       *://steamcommunity.com//id/*/stats/*
// @include       *://steamcommunity.com/profiles/*/stats/*
// @include       *://steamcommunity.com//profiles/*/stats/*
// @grant         none
// @updateVersion 11
// @downloadURL https://update.greasyfork.org/scripts/5174/Steam%20Extra%20Game%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/5174/Steam%20Extra%20Game%20Links.meta.js
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
div.sel_links {background:linear-gradient(to right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%) repeat scroll 0% 0% transparent;padding:2px 5px 2px 5px;margin-bottom:10px;font-size:10px;text-align:left;color:#888888;}\
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

var link_01_01 = "<a title=\"Achievement Stats\" href=\"http://www.achievementstats.com/index.php?action=games&gameId=" + appId + "\">AchievementStats.com</a>";
var link_01_02 = "<a title=\"AStats\" href=\"http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=" + appId + "\">AStats.nl</a>";
var link_01_03 = "<a title=\"How Long To Beat\" href=\"http://howlongtobeat.com/?t=games&searchname=" + appName + "\">HowLongToBeat.com</a>";
var link_01_04 = "<a title=\"Steam Card Exchange\" href=\"http://www.steamcardexchange.net/index.php?gamepage-appid-" + appId + "\">Steam Card Exchange</a>";
var link_01_05 = "<a title=\"Steam Market Search\" href=\"http://steamcommunity.com/market/search?q=" + appName + "\">Steam Market</a>";
var link_01_06 = "<a title=\"Steam Card Exchange\" href=\"http://www.steamcardexchange.net/index.php?gamepage-appid-" + appId + "\">Steam Card Exchange (?)</a>";

var link_02_01 = "<a title=\"Steam Charts\" href=\"http://steamcharts.com/app/" + appId + "\">SteamCharts.com</a>";
var link_02_02 = "<a title=\"Steam Graph\" href=\"http://steamgraph.net/index.php?action=graph&appid=" + appId + "&from=0\">SteamGraph.net</a>";
var link_02_03 = "<a title=\"Steam DB\" href=\"http://steamdb.info/app/" + appId + "/\">SteamDB.info</a>";
var link_02_04 = "<a title=\"PC Gaming Wiki\" href=\"http://pcgamingwiki.com/api/appid.php?appid=" + appId + "\">PC Gaming Wiki</a>";

var link_03_01 = "<a title=\"Steam Stats\" href=\"http://steamcommunity.com/stats/" + appId + "/\">Steam Stats and Achievements</a>";
var link_03_02 = "<a title=\"Official Steam Group\" href=\"http://steamcommunity.com/ogg/" + appId + "\">Official Steam Group</a>";
var link_03_03 = "<a title=\"Steam Store\" href=\"http://store.steampowered.com/app/" + appId + "\">Steam Store</a>";
var link_03_04 = "<a title=\"Steam Store DLC\" href=\"http://store.steampowered.com/dlc/" + appId + "\">DLC (?)</a>";
var link_03_05 = "<a title=\"IsThereAnyDeal.com Search\" href=\"http://isthereanydeal.com/#/search:" + appName + ";/scroll:%23gamelist\">IsThereAnyDeal.com</a>";
var link_03_06 = "<a title=\"News RSS Feed (by getoffmalawn.com)\" href=\"http://www.getoffmalawn.com/steamnews/" + appId + ".atom\">News RSS Feed</a>";
var link_03_07 = "<a title=\"RSS Feed by Third Party - getoffmalawn.com\" href=\"http://www.getoffmalawn.com/steamnews\">(?)</a>";

var link_04_01 = "<a title=\"Steam Hub\" href=\"http://steamcommunity.com/app/" + appId + "/\">Steam Hub</a>";
var link_04_02 = "<a title=\"Steam Hub Discussions\" href=\"http://steamcommunity.com/app/" + appId + "/discussions/\">Discussions</a>";
var link_04_03 = "<a title=\"Steam Hub Screenshots\" href=\"http://steamcommunity.com/app/" + appId + "/screenshots/\">Screenshots</a>";
var link_04_04 = "<a title=\"Steam Hub Artwork\" href=\"http://steamcommunity.com/app/" + appId + "/images/\">Artwork</a>";
var link_04_05 = "<a title=\"Steam Hub Videos\" href=\"http://steamcommunity.com/app/" + appId + "/videos\">Videos</a>";
var link_04_06 = "<a title=\"Steam Hub News\" href=\"http://steamcommunity.com/app/" + appId + "/news\">News</a>";
var link_04_07 = "<a title=\"Steam Hub Announcements\" href=\"http://steamcommunity.com/app/" + appId + "/announcements\">Announcements</a>";
var link_04_08 = "<a title=\"Steam Hub Guides\" href=\"http://steamcommunity.com/app/" + appId + "/guides/\">Guides</a>";
var link_04_09 = "<a title=\"Steam Hub Reviews\" href=\"http://steamcommunity.com/app/" + appId + "/reviews/\">Reviews</a>";

var link_foot_1 = "<a title=\"GreasyFork\" target\"_blank\" href=\"https://greasyfork.org/scripts/5174-steam-extra-game-links\">GreasyFork</a>";
var link_foot_2 = "<a title=\"DoodlesStuff\" target\"_blank\" href=\"http://doodlesstuff.com/?script=segl\">DoodlesStuff</a>";

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
linkDiv.append($("<div>" + link_01_01 + " | " + link_01_02 + "</div>"));
var catDiv = $("#category_block");
var cardFound = false;
if(catDiv.length != 0) { 
	var catA = $(catDiv).find("a");
	for (i = 0; i < catA.length; i++){
		if($(catA[i]).attr('href').indexOf("search/?category2=29") > -1){
			linkDiv.append($("<div>" + link_01_04 + " | " + link_01_05 + "</div>"));
			var cardFound = true;
			break;
		}
	}
}
if(!cardFound){ 
	linkDiv.append($("<div>No Trading Cards</div>")); 
}
linkDiv.append($("<div>" + link_03_05 + " | " + link_01_03 + "</div>"));
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
linkDiv.append($("<hr>"));
linkDiv.append($("<div>" + link_02_01 + "</div><div>" + link_02_02 + "</div><div>" + link_02_03 + "</div><div>" + link_02_04 + "</div>"));
linkDiv.append($("<hr>"));
linkDiv.append($("<div>" + link_04_01 + ": " + link_04_02 + ", " + link_04_03 + ", " + link_04_04 + ", " + link_04_05 + ", " + link_04_06 + ", " + link_04_07 + ", " + link_04_08 + ", " + link_04_09 + "</div>"));
linkDiv.append($("<hr>"));
linkDiv.append($("<div>" + link_03_01 + "</div><div>" + link_03_02 + "</div>"));
linkDiv.append($("<div>" + link_03_06 + " " + link_03_07 + "</div>"));
linkDiv.append($("<hr>"));
linkDiv.append($("<div class=\"sel_foot\">Steam Extra Links: " + link_foot_1 + " | " + link_foot_2 + "</div>"));
$("div.rightcol.game_meta_data").prepend(linkDiv);
// STORE PAGE - END
} else if (urlContains("steamcommunity.com/app/")){
// HUB PAGE - START
var linkDiv = $("<div></div>").addClass("sel_links");
var topBox = $(".apphub_sectionTabsHR").first();
if (topBox.length != 0){
	$(linkDiv).insertAfter(topBox);
	linkDiv.append($("<div class=\"sel_foot sel_float\">Steam Extra Links:<br>" + link_foot_1 + " | " + link_foot_2 + "</div>"));
	linkDiv.append($("<div>" + link_01_01 + " | " + link_01_02 + " | " + link_01_03 + " | " + link_02_01 + " | " + link_02_02 + " | " + link_02_03 + " | " + link_02_04 + "</div>"));
	linkDiv.append($("<hr>"));
	linkDiv.append($("<div>" + link_03_03 + " | " + link_03_04 + " | " + link_01_06 + " | " + link_03_05 + " | " + link_03_01 + " | " + link_03_02 + " | " + link_03_06 + " " + link_03_07 + "</div>"));
}
// HUB PAGE - END
}else if(urlContains("/stats/")){
// STATS PAGE - START
var linkDiv = $("<div></div>").addClass("sel_links");
var topDiv = $("#BG_bottom");
$(topDiv).css("paddingTop", "0px");
$("#BG_bottom").prepend(linkDiv);
$("#mainContents").css("paddingTop", "0px");
linkDiv.append($("<div class=\"sel_foot sel_float\">Steam Extra Links:<br>" + link_foot_1 + " | " + link_foot_2 + "</div>"));
linkDiv.append($("<div>" + link_01_01 + " | " + link_01_02 + " | " + link_01_03 + " | " + link_02_01 + " | " + link_02_02 + " | " + link_02_03 + " | " + link_02_04 + "</div>"));
linkDiv.append($("<hr>"));
linkDiv.append($("<div>" + link_03_03 + " | " + link_03_04 + " | " + link_01_06 + " | " + link_03_05 + " | " + link_03_01 + " | " + link_03_02 + " | " + link_03_06 + " " + link_03_07 + "</div>"));
$(linkDiv).css("margin", "0 0 5px 0");
// STATS PAGE - END
}