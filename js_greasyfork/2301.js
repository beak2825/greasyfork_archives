// ==UserScript==
// @name           Steam Store Achievement Links
// @namespace      http://greasyfork.org/users/2240-doodles
// @author         Doodles
// @version        3
// @description    Adds links to Achievement Websites from a games Steam store page.
// @include        http://store.steampowered.com/app/*
// @include        https://store.steampowered.com/app/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2301/Steam%20Store%20Achievement%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/2301/Steam%20Store%20Achievement%20Links.meta.js
// ==/UserScript==

// Check if Game has Achievements
var found = false;
var achDiv;
var divs = document.getElementsByTagName('div');		
for(var i = 0; i < divs.length;i++)
{
	if(divs.item(i).getAttribute('class') == "communitylink_achievement_inner")
	{
		achDiv = divs.item(i);
		found = true;
		break;
	}
}
// Add Links if Game has Achievements
if(found)
{
	var appid = getAppID();
	// achievementstats.com
	var link1 = createLink("http://www.achievementstats.com/index.php?action=games&gameId=" + appid, "AchievementStats.com Page");
	achDiv.appendChild(link1);
	// astats.astats.nl
	var link2 = createLink("http://astats.astats.nl/astats/Steam_Game_Info.php?AppID=" + appid, "Astats.nl Page");
	achDiv.appendChild(link2);
	// steamscore.net
	var link3 = createLink("http://steamscore.net/game/" + appid, "SteamScore.net Page");
	achDiv.appendChild(link3);
	// howlongtobeat.com
	var appname = getAppName();
	if(appid != "//") 
	{
		var link4 = createLink("http://www.howlongtobeat.com/search.php?t=games&s=" + appname, "Search game on HowLongToBeat.com");
		achDiv.appendChild(link4);
	}
}

// METHODS
function getAppID() {
	var appid = document.URL.split("/app/")[1].split("/")[0];
	if(appid.indexOf("?") != -1)
	{
		appid = appid.split("?")[0];
	}
	return appid;
}

function getAppName() {
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++) 
	{
		if(divs[i].className == "apphub_AppName") 
		{
			return divs[i].innerHTML;
			break;
    	}
	}
	return "//";
}

function createLink(url, link_text) {
	var link = document.createElement('a');
	link.setAttribute('class', 'linkbar');
	link.setAttribute('href', url);
	//var innerDiv = document.createElement('div');
	//innerDiv.setAttribute('class', 'rightblock');
	//var divImg = document.createElement('img');
	//divImg.setAttribute('src', 'http://store.akamai.steamstatic.com/public/images/ico/ico_achievements.png');
	//link.appendChild(innerDiv);
	//innerDiv.appendChild(divImg);
	link.appendChild(document.createTextNode(link_text));
	return link;
}