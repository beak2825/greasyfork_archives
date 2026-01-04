// ==UserScript==
// @name         GGn site links
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.81
// @include      *
// @description  Helps users to easily retrieve info on a game from various sites
// @author       NeutronNoir (minor fixes by ZeDoCaixao)
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/38686/GGn%20site%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/38686/GGn%20site%20links.meta.js
// ==/UserScript==

(function() {
	var links = JSON.parse(GM_getValue("links") || "{}");
	GM_setValue("links", JSON.stringify(links));
	if (typeof console != "undefined" && typeof console.log != "undefined") console.log(links);

	if (window.location.hostname == "gazellegames.net") {
		links.active = false;
        links.ratings_active = false;
		if (document.URL.indexOf("/torrents.php?action=editgroup") != -1) add_search_buttons();
	}
	else {
        if (typeof links.active != "undefined" && links.active === true) add_validate_button();
        if (typeof links.ratings_active != "undefined" && links.ratings_active === true) add_ratings_validate_button();
	}
	GM_addStyle(button_css());
})();

function add_search_buttons() {
    $("#reviews_table>tbody").after('<tr><td><input id="search_ratings" type="button" value="Search Ratings"/><input id="validate_ratings" type="button" value="Validate Ratings"/></td></tr>');
    $("#search_ratings").click(function () {
        var title = encodeURIComponent($("h2>a").text());
		if (typeof console.log !== "undefined" && typeof console.log != "undefined") console.log(title);

        window.open("http://www.metacritic.com/search/game/="+title+"/results", '_blank');
        window.open("http://www.ign.com/search?q=" + title + "&type=object&objectType=game&filter=games", '_blank');
        window.open("http://www.gamespot.com/search/?q="+title, '_blank');

        var links = {};
        links.websites = [];
		links.ratings = {};
		links.ratings_active = true;
		GM_setValue("links", JSON.stringify(links));
    });
    $("#validate_ratings").click(function () {
        var links = JSON.parse(GM_getValue("links") || "{}");
		links.websites.forEach( function (link) {
            if (link.indexOf("metacritic.com") != -1) $("#metauri").val(link);
            else if (link.indexOf("ign.com") != -1) $("#ignuri").val(link);
            else if (link.indexOf("gamespot.com") != -1) $("#gamespotscoreuri").val(link);
        });

        if (typeof links.ratings.metacritic !== "undefined") $("#meta").val(links.ratings.metacritic);
        if (typeof links.ratings.ign !== "undefined") $("#ignscore").val(links.ratings.ign);
        if (typeof links.ratings.gamespot !== "undefined") $("#gamespotscore").val(links.ratings.gamespot);

        links = {};
        GM_setValue("links", JSON.stringify(links));
    });

	$("#gameswebsiteuri").after('<input id="search_weblinks" type="button" value="Search WebLinks"/><input id="validate_weblinks" type="button" value="Validate WebLinks"/>');
    $("#search_weblinks").click(function() {
		var title = encodeURIComponent($("h2>a").text());
		if (typeof console.log !== "undefined" && typeof console.log != "undefined") console.log(title);

        window.open("https://www.google.com/search?q=" + title + "%20official%20website", '_blank');	            //For every platform
        window.open("https://en.wikipedia.org/w/index.php?search=" + title, '_blank');
        window.open("http://www.giantbomb.com/search/?indices[0]=game&q=" + title, '_blank');
		window.open("https://www.google.com/search?q=" + title + "%20site:amazon.com", '_blank');
		window.open("http://www.gamefaqs.com/search?game=" + title, '_blank');
        window.open("https://www.google.com/search?q=" + title + "%20site:howlongtobeat.com", '_blank');

        if ($("#psnuri").length !== 0) window.open("https://www.playstation.com/en-us/search/?q="+title, '_blank');	//PSN only
        if ($("#xboxuri").length !== 0) window.open("http://www.xbox.com/en-us/Search?q="+title, '_blank');	        //XBox only
        if ($("#googleplayuri").length !== 0) window.open("https://play.google.com/store/search?q="+title, '_blank');	//Android only
		if ($("#mobygamesuri").length !== 0) window.open("https://www.mobygames.com/search/quick?q=" + title + "&sFilter=1&sG=on", '_blank');	//retro only

        if ($("#pcwikiuri").length !== 0) {	//PC (win/lin/mac) only
			window.open("https://vndb.org/v/all?sq=" + title, '_blank');
			window.open("http://pcgamingwiki.com/w/index.php?search="+title, '_blank');
			window.open("http://store.steampowered.com/search/?term="+title+"&category1=998", '_blank');
			window.open("https://www.gog.com/games##search="+title, '_blank');
			window.open("https://www.humblebundle.com/store/search?search="+title, '_blank');
			window.open("https://itch.io/search?q="+title, '_blank');
		}

        if ($("#nexusmodsuri").length !== 0) {	//Windows only
            window.open("https://www.origin.com/en-ie/store/browse?q="+title, '_blank');
			window.open("https://www.google.com/search?q="+title+"%20site:nexusmods.com", '_blank');
        }

        if ($("#rpggeekuri").length !== 0)  {	//Pen and paper /Board games
			window.open("https://rpggeek.com/geeksearch.php?action=search&objecttype=rpgunified&q="+title, '_blank');
			window.open("https://index.rpg.net/display-search.phtml?firstsearch=1&key=title&match=loose&value="+title, '_blank');
			window.open("https://drivethrurpg.com/browse.php?keywords="+title, '_blank');
		}

		var links = {};
		links.websites = [];
		links.active = true;
		GM_setValue("links", JSON.stringify(links));
    });

	$("#validate_weblinks").click( function () {
		var links = JSON.parse(GM_getValue("links") || "{}");
		var links_official = [];
		links.websites.forEach( function (link) {
			if (link.indexOf("wikipedia.org") != -1) $("#wikipediauri").val(link);	//All
			else if (link.indexOf("giantbomb.com") != -1) $("#giantbomburi").val(link);
			else if (link.indexOf("howlongtobeat.com") != -1) $("#howlongtobeaturi").val(link);
			else if (link.indexOf("amazon.com") != -1) $("#amazonuri").val(link);
			else if (link.indexOf("gamefaqs.gamespot.com") != -1) $("#gamefaqsuri").val(link);

			else if (link.indexOf("vndb.org") != -1) $("#vndburi").val(link);	//PC
			else if (link.indexOf("store.steampowered.com") != -1) $("#steamuri").val(link);
			else if (link.indexOf("gog.com") != -1) $("#goguri").val(link);
			else if (link.indexOf("humblebundle.com") != -1) $("#humbleuri").val(link);
			else if (link.indexOf("itch.io") != -1) $("#itchuri").val(link);
			else if (link.indexOf("origin.com") != -1) $("#originuri").val(link);
			else if (link.indexOf("pcgamingwiki.com") != -1) $("#pcwikiuri").val(link);
			else if (link.indexOf("nexusmods.com") != -1) $("#nexusmodsuri").val(link);

			else if (link.indexOf("playstation.com") != -1) $("#psnuri").val(link);	//PS3-4

			else if (link.indexOf("marketplace.xbox.com") != -1) $("#xboxuri").val(link);	//XBox 360-One

			else if (link.indexOf("itunes.apple.com") != -1) $("#itunesuri").val(link);	//Mac/iOS

			else if (link.indexOf("rpggeek.com") != -1) $("#rpggeekuri").val(link);	//Pen and paper
			else if (link.indexOf("index.rpg.net") != -1) $("#rpgneturi").val(link);
			else if (link.indexOf("drivethrurpg.com") != -1) $("#drivethrurpguri").val(link);

			else if (link.indexOf("play.google.com") != -1) $("#googleplayuri").val(link);	//Android

			else if (link.indexOf("mobygames.com") != -1) $("#mobygamesuri").val(link);	//Retro

			else links_official.push(link);
		});

		if (links_official.length > 0) $("#gameswebsiteuri").val(links_official[0]);

		links.websites = [];
		links.active = false;
		GM_setValue("links", JSON.stringify(links));
	});
}

function add_ratings_validate_button() {
	if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
	$("body").prepend('<input type="button" id="save_link" value="Save link"/>');
	$("#save_link").click( function() {
		var links = JSON.parse(GM_getValue("links") || "{}");
        if (typeof links.websites === "string") links.websites = JSON.parse(links.websites);   //Fix for a weird bug happening on http://www.arkane-studios.com/uk/arx.php, transforming the array of strings into a string
		links.websites.push(document.URL.replace(/\?.*/, ""));
        if (window.location.hostname.indexOf("metacritic.com") != -1) links.ratings.metacritic = $("span[itemprop='ratingValue']").first().text();
        else if (window.location.hostname.indexOf("ign.com") != -1) links.ratings.ign = $("span[itemprop='ratingValue']").text().trim();
        else if (window.location.hostname.indexOf("gamespot.com") != -1)links.ratings.gamespot = $(".gs-score__cell").first().text().trim();
		GM_setValue("links", JSON.stringify(links));
        window.close();
	});
}

function add_validate_button() {
	if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
	$("body").prepend('<input type="button" id="save_link" value="Save link"/>');
	$("#save_link").click( function() {
		var links = JSON.parse(GM_getValue("links") || "{}");
        if (typeof links.websites === "string") links.websites = JSON.parse(links.websites);   //Fix for a weird bug happening on http://www.arkane-studios.com/uk/arx.php, transforming the array of strings into a string
		links.websites.push(document.URL);
		GM_setValue("links", JSON.stringify(links));
        window.close();
	});
}

function button_css () {
	return "\
		#save_link {\
			position: fixed;\
			left: 0;\
			top: 0;\
			z-index: 9999999;\
			cursor: pointer;\
            height: 5vh;\
            width: 10vh;\
            background-color: lightblue;\
		}\
	";
}