// ==UserScript==
// @name         SG User Steam Level
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      1.2.3
// @description  Shows steam level of SG user in their profile page.
// @author       Ruphine

// @match        *://www.steamgifts.com/user/*
// @connect      ruphine.esy.es
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/18862/SG%20User%20Steam%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/18862/SG%20User%20Steam%20Level.meta.js
// ==/UserScript==

var styles = "<link rel='stylesheet' type='text/css' href='https://steamcommunity-a.akamaihd.net/public/shared/css/shared_global.css?v=Kh4iVpODIZtA'>";
$("head").append(styles);

const link = "http://ruphine.esy.es/steamgifts/sgsteamlevel.php?steamid=";
getUserLevel(getSteamID());

function getSteamID()
{
	var profile = $(".sidebar__shortcut-inner-wrap a")[0].href;
	// http://steamcommunity.com/profiles/76561198152694723
	var pattern = /(\d){0,20}$/; //get digit with length between 0-20 characters
	var steamid = pattern.exec(profile)[0];

	return steamid;
}

function getUserLevel(steamid)
{
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: link+steamid,
		onload: function(data)
		{
			// { "response": { "player_level": 35 } }
			var level = JSON.parse(data.responseText).response.player_level;
			showLevel(level);
		}
	});
}

function showLevel(level)
{
	var spanLevel = document.createElement("span");
	// spanLevel.classList.add("friendPlayerLevelNum");
	spanLevel.innerHTML = level;

	var divLevel = document.createElement("div");
	divLevel.classList.add("friendPlayerLevel");
	$(divLevel).append(spanLevel);

	if(level < 100)
	{
		var level_1 = Math.floor(level/10) * 10; //level 35 becomes 30
		divLevel.classList.add("lvl_" + level_1);
	}
	else
	{
		var level_1 = Math.floor(level % 100 / 10) * 10; // level 235 becomes 30
		var level_2 = Math.floor(level/100) * 100; // level 235 becomes 200
		divLevel.classList.add("lvl_" + level_2);
		divLevel.classList.add("lvl_plus_" + level_1);
	}

	$(".featured__heading").append(divLevel);
}



// doesn't use this anymore, but it might come in handy later
/*var styles;
styles = 	"<style> \
			.friendPlayerLevel \
			{ \
				display: inline-block; \
				font-size: 16px; \
				border-radius: 16px; \
				border: solid white 2px; \
				height: 28px; \
				width: 28px; \
				line-height: 28px; \
				text-align: center; \
				cursor: default; \
			} \
			.friendPlayerLevel.lvl_0 { border-color: #9b9b9b; } \
			.friendPlayerLevel.lvl_10 { border-color: #c02942; } \
			.friendPlayerLevel.lvl_20 { border-color: #d95b43; } \
			.friendPlayerLevel.lvl_30 { border-color: #fecc23; } \
			.friendPlayerLevel.lvl_40 { border-color: #467a3c; } \
			.friendPlayerLevel.lvl_50 { border-color: #4e8ddb; } \
			.friendPlayerLevel.lvl_60 { border-color: #7652c9; } \
			.friendPlayerLevel.lvl_70 { border-color: #c252c9; } \
			.friendPlayerLevel.lvl_80 { border-color: #542437; } \
			.friendPlayerLevel.lvl_90 { border-color: #997c52; } \
			.friendPlayerLevel.lvl_100, .friendPlayerLevel.lvl_200, .friendPlayerLevel.lvl_300, .friendPlayerLevel.lvl_400, .friendPlayerLevel.lvl_500, .friendPlayerLevel.lvl_600, .friendPlayerLevel.lvl_700, .friendPlayerLevel.lvl_800, .friendPlayerLevel.lvl_900, .friendPlayerLevel.lvl_1000 \
			{ \
				border: none; \
				border-radius: 0; \
				background-repeat: no-repeat; \
				background-position: 0 0; \
				font-size: 14px; \
				height: 32px; \
				width: 32px; \
				line-height: 32px; \
			} \
			.friendPlayerLevel.lvl_100 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_hexagons.png' ); } \
			.friendPlayerLevel.lvl_200 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_shields.png' ); } \
			.friendPlayerLevel.lvl_300 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_books.png' ); text-shadow: 1px 1px #1a1a1a; } \
			.friendPlayerLevel.lvl_400 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_chevrons.png' ); } \
			.friendPlayerLevel.lvl_500 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_circle2.png' ); } \
			.friendPlayerLevel.lvl_600 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_angle.png' ); } \
			.friendPlayerLevel.lvl_700 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_flag.png' ); } \
			.friendPlayerLevel.lvl_800 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_wings.png' ); } \
			.friendPlayerLevel.lvl_900 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_arrows.png' ); } \
			.friendPlayerLevel.lvl_1000 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_crystals.png' ); } \
			.friendPlayerLevel.lvl_1100 { background-image: url( 'http://steamcommunity-a.akamaihd.net/public/shared/images/community/levels_space.png' ); } \
			.friendPlayerLevel.lvl_plus_10 { background-position: 0 -32px; } \
			.friendPlayerLevel.lvl_plus_20 { background-position: 0 -64px; } \
			.friendPlayerLevel.lvl_plus_30 { background-position: 0 -96px; } \
			.friendPlayerLevel.lvl_plus_40 { background-position: 0 -128px; } \
			.friendPlayerLevel.lvl_plus_50 { background-position: 0 -160px; } \
			.friendPlayerLevel.lvl_plus_60 { background-position: 0 -192px; } \
			.friendPlayerLevel.lvl_plus_70 { background-position: 0 -224px; } \
			.friendPlayerLevel.lvl_plus_80 { background-position: 0 -256px; } \
			.friendPlayerLevel.lvl_plus_90 { background-position: 0 -288px; } \
		</style>";
$("head").append(styles);*/