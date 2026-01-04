// ==UserScript==
// @name         SG Game Tags --- Sighery's mod
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      3.4.2.2
// @description  some tags of the game in Steamgifts.
// @author       Ruphine, Sighery
// @match        *://www.steamgifts.com/*
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @connect      steampowered.com
// @connect      ruphine.esy.es
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/514189/SG%20Game%20Tags%20---%20Sighery%27s%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/514189/SG%20Game%20Tags%20---%20Sighery%27s%20mod.meta.js
// ==/UserScript==

/*jshint multistr: true */

/* Constant Variables */
const linkGameAPI = "https://store.steampowered.com/api/appdetails?appids=";//filters=categories,platforms,genres&
const linkPackAPI = "https://store.steampowered.com/api/packagedetails?packageids=";
const linkBundleAPI = "http://ruphine.esy.es/steamgifts/GetBundleStatus.php";
const linkUserAPI = "https://store.steampowered.com/dynamicstore/userdata/";

//p for properties
const pBundle = {
	class	: "tags_bundle",
	text	: "Bundled",
	text2	: "Not-Bundled",
	title	: "Bundled since ",
	min		: "B",
	min2	: "NB",
	link	: "https://www.steamgifts.com/bundle-games/search?q=",
	color1	: "#E9202A",
	color2	: "#FFFFFF"
};
const pCard = {
	class	: "tags_card",
	text	: "Trading Cards",
	title	: "This game has trading cards",
	min		: "T",
	link	: "http://www.steamcardexchange.net/index.php?inventorygame-appid-",
	color1	: "#3AA435",
	color2	: "#FFFFFF"
};
const pAchievement = {
	class	: "tags_achievement",
	text	: "Achievements",
	title	: "This game has steam achievements",
	min		: "A",
	link	: "http://steamcommunity.com/stats/", // 424280/achievements/";
	color1	: "#305AC9",
	color2	: "#FFFFFF"
};
const pWishlist = {
	class	: "tags_wishlist",
	text	: "Wishlist",
	title	: "This game is in your Steam wishlist",
	min		: "W",
	link	: "https://www.steamgifts.com/account/steam/wishlist/search?q=",
	color1	: "#9335F1",
	color2	: "#FFFFFF"
};
const pLinux = {
	class	: "tags_linux",
	text	: "Linux",
	title	: "Linux supported",
	min		: "L",
	color1	: "#E67300",
	color2	: "#FFFFFF"
};
const pMac = {
	class	: "tags_mac",
	text	: "Mac",
	title	: "Mac Supported",
	min		: "M",
	color1	: "#777777",
	color2	: "#FFFFFF"
};
const pEarly = {
	class	: "tags_early",
	text	: "Early Access",
	title	: "This game is in early access state",
	min		: "E",
	color1	: "#9FA027",
	color2	: "#FFFFFF"
};
const pHidden = {
	class	: "tags_hidden",
	text	: "Hidden",
	title	: "This game is in your filter list",
	min		: "H",
	link	: "https://www.steamgifts.com/account/settings/giveaways/filters/search?q=",
	color1	: "#A0522D",
	color2	: "#FFFFFF"
};
const pOwned = {
	class	: "tags_owned",
	text	: "Owned",
	title	: "You already have this game",
	min		: "O",
	color1  : "#444444",
	color2  : "#FF9900"
};
const pIgnored = {
	class	: "tags_ignored",
	text	: "Ignored",
	title	: "You marked this game as not interested",
	min		: "X",
	color1	: "#E06666",
	color2	: "#FFFFFF"
};

/* CSS */
const myCSS = '\
	.tags { \
		text-decoration: none; \
		border-radius: 4px; \
		padding: 2px 5px; \
		font-size: 8pt; \
		margin: 3px 3px 3px 0px; \
		text-shadow: none; \
		display: none; \
		white-space: nowrap; \
	} \
	.tags.minimalist { \
		margin-right: 0; \
		margin-left: 5px; \
	} \
	.' + pBundle.class + ' { \
		background-color: ' + GM_getValue("bundle-1", pBundle.color1) + '; \
		color: ' + GM_getValue("bundle-2", pBundle.color2) + '; \
	} \
	.' + pCard.class + ' { \
		background-color: ' + GM_getValue("card-1", pCard.color1) + '; \
		color: ' + GM_getValue("card-2", pCard.color2) + '; \
	} \
	.' + pAchievement.class + ' { \
		background-color: ' + GM_getValue("achievement-1", pAchievement.color1) + '; \
		color: ' + GM_getValue("achievement-2", pAchievement.color2) + '; \
	} \
	.' + pWishlist.class + ' { \
		background-color: ' + GM_getValue("wishlist-1", pWishlist.color1) + '; \
		color: ' + GM_getValue("wishlist-2", pWishlist.color2) + '; \
	} \
	.' + pLinux.class + ' { \
		background-color: ' + GM_getValue("linux-1", pLinux.color1) + '; \
		color: ' + GM_getValue("linux-2", pLinux.color2) + '; \
	} \
	.' + pMac.class + ' { \
		background-color: ' + GM_getValue("mac-1", pMac.color1) + '; \
		color: ' + GM_getValue("mac-2", pMac.color2) + '; \
	} \
	.' + pEarly.class + ' { \
		background-color: ' + GM_getValue("early-1", pEarly.color1) + '; \
		color: ' + GM_getValue("early-2", pEarly.color2) + '; \
	} \
	.' + pHidden.class + ' { \
		background-color: ' + GM_getValue("hidden-1", pHidden.color1) + '; \
		color: ' + GM_getValue("hidden-2", pHidden.color2) + '; \
	} \
	.' + pOwned.class + ' { \
		background-color: ' + GM_getValue("owned-1", pOwned.color1) + '; \
		color: ' + GM_getValue("owned-2", pOwned.color2) + '; \
	} \
	.' + pIgnored.class + ' { \
		background-color: ' + GM_getValue("ignored-1", pIgnored.color1) + '; \
		color: ' + GM_getValue("ignored-2", pIgnored.color2) + '; \
	} \
';
$("head").append('<style type="text/css">' + myCSS + '</style>');

const THIS_URL = window.location.href;
const TIMEOUT = 0;
const CACHE_TIME = 6*60*60*1000; //6 hours

var cbCards = GM_getValue("cbCards", true);
var cbAchievement = GM_getValue("cbAchievement", true);
var cbBundled = GM_getValue("cbBundled", true);
var cbWishlist = GM_getValue("cbWishlist", true);
var cbLinux = GM_getValue("cbLinux", false);
var cbMac = GM_getValue("cbMac", false);
var cbEarly = GM_getValue("cbEarly", false);
var cbHidden = GM_getValue("cbHidden", true);
var cbOwned = GM_getValue("cbOwned", true);
var cbIgnored = GM_getValue("cbIgnored", false);

var cbTagStyle = GM_getValue("cbTagStyle", 1); //1 = full, 2 = minimalist

var BundledGames = GM_getValue("BundledGames", "");
var BundledCache = GM_getValue("BundledCache", 0);
var UserdataAPI = GM_getValue("UserdataAPI", "");
var UserdataCache = GM_getValue("UserdataCache", 0);
var GameData = GM_getValue("GameData", "");
var PackageData = GM_getValue("PackageData", "");

var rgWishlist, rgOwnedApps, rgOwnedPackages, rgIgnoredApps, rgIgnoredPackages;
var arrBundled;

// if(cbBundled && BundledCache < Date.now() - CACHE_TIME) // Check if need to request bundle list from ruphine API
// 	getBundleList();
// else if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME) //6 hours. Check if need to request steam user api
if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME) //6 hours. Check if need to request steam user api
	getUserdata();
else
	main();

function main()
{
	// try {
	// 	arrBundled = JSON.parse(BundledGames);
	// }
	// catch (e) {
	// 	console.log("[SG Game Tags] Invalid json format for Bundle List");
	// 	BundledGames = ""; GM_setValue("BundledGames", "");
	// 	BundledCache = 0;  GM_setValue("BundledCache", 0);
	// }

	try {
		var userdata = JSON.parse(UserdataAPI);
		rgWishlist = userdata.rgWishlist;
		rgOwnedApps = userdata.rgOwnedApps;
		rgOwnedPackages = userdata.rgOwnedPackages;
		// This changed recently from an array of apps to an array of dicts such
		// as {"1234": 0}
		rgIgnoredApps = Object.keys(userdata.rgIgnoredApps).map(x => parseInt(x));
		rgIgnoredPackages = Object.keys(userdata.rgIgnoredPackages).map(x => parseInt(x));

	}
	catch (e) {
		console.log("[SG Game Tags] Invalid json format for UserdataAPI");
		UserdataAPI = ""; GM_setValue("UserdataAPI", "");
		UserdataCache = 0; GM_setValue("UserdataCache", 0);
	}

	if(GameData === "")
		PrepareJSON();
	else
	{
		GameData = JSON.parse(GameData);
		PackageData = JSON.parse(PackageData);
	}

	var observer;
	var config = {childList: true, attributes: false, characterData: false, subtree: true};
	if(/www.steamgifts.com\/giveaways\/new/.test(THIS_URL)) // process giveaway creation page
		InitGiveawayCreationPage();
	else if(/www.steamgifts.com\/account\/*/.test(THIS_URL))
	{
		var sidebar_item = '<li class="sidebar__navigation__item">\
								<a class="sidebar__navigation__item__link" href="/sg-game-tags">\
									<div class="sidebar__navigation__item__name">SG Game Tags</div>\
									<div class="sidebar__navigation__item__underline"></div>\
								</a>\
							</li>';
		$($(".sidebar__navigation")[2]).append(sidebar_item);

		if(/(settings\/giveaways\/filters)|steam\/(games|wishlist)/.test(THIS_URL)){
			ProcessGameListPage($(".widget-container"));
			observer = new MutationObserver(function(mutations)
			{
				$.each(mutations, function(index, mutation){
					ProcessGameListPage(mutation.addedNodes);
				});
			});
			$(".widget-container>div").each(function(index, element){
				observer.observe(element, config);
			});
		}
	}
	else if(/www.steamgifts.com\/sg-game-tags/.test(THIS_URL)) // process sg game tags setting page
		initSetting();
	else if(/www.steamgifts.com\/($|giveaways$|giveaways\/search)/.test(THIS_URL)) // homepage and all search active giveaway
	{
		ProcessGiveawayListPage($(".widget-container"));
		// handles element added later by endless scroll, add timeout to delay this function because it is triggered when ext SG runs
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGiveawayListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});

		if($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length === 0 && $(".featured__inner-wrap a img").length > 0)
			ProcessFeaturedGiveaway($(".featured__inner-wrap a img")[0].src);
	}
	// user profile & group page excluding user trade and feedback and excluding group users, stats, and wishlist
	else if(/www.steamgifts.com\/(user|group)\//.test(THIS_URL) && !/user\/\w+\/(feedback|trade)/.test(THIS_URL) && !/group\/\w+\/\w+\/(users|stats|wishlist)/.test(THIS_URL)) // exclude some pages
	{
		ProcessGiveawayListPage($(".widget-container"));
		// handles element added later by endless scroll, add timeout to delay this function because it is triggered when ext SG runs
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGiveawayListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});

		if($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length === 0 && $(".featured__inner-wrap a img").length > 0)
			ProcessFeaturedGiveaway($(".featured__inner-wrap a img")[0].src);
	}
	else if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) // giveaway page https://www.steamgifts.com/giveaway/FGbTw/left-4-dead-2
		ProcessFeaturedGiveaway($(".featured__inner-wrap a")[0].href);

	// https://www.steamgifts.com/giveaways/created
	// https://www.steamgifts.com/giveaways/entered
	// https://www.steamgifts.com/giveaways/won
	// https://www.steamgifts.com/giveaways/wishlist
	else if(/www.steamgifts.com\/(giveaways\/(created|entered|won|wishlist)|group\/\w+\/\w+\/wishlist)/.test(THIS_URL))
	{
		ProcessGameListPage($(".widget-container"));
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGameListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});
	}

	AddShortcutToSettingPage();
}

function ProcessFeaturedGiveaway(URL)
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		var Name = $(".featured__heading__medium").text().substring(0,45); //letter after 45th converted to ...
		var $Target = $(".featured__heading");
		ProcessTags($Target, URL, Name);
	}
}

function ProcessGiveawayListPage(parent) // giveaways list with creator name
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(parent).find(".giveaway__row-inner-wrap").each(function(index, element)
		{
			var URL = $(element).find(".giveaway__heading>a.giveaway__icon").attr("href");
			if(URL !== undefined)
			{
				var Name = $(element).find(".giveaway__heading__name").contents().filter(
					function() //return text without [NEW] and [FREE]
					{
						return this.nodeType === 3; //Node.TEXT_NODE
					}
				).slice(-1)[0].textContent.substring(0,40); //letter after 40th converted to ...
				var $Target = $(element).find(".giveaway__heading");
				ProcessTags($Target, URL, Name);
			}
		});
	}
}

function ProcessGameListPage(parent) // giveaways / games list
{
	console.log('Called ProcessGameListPage?');
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(parent).find(".table__row-inner-wrap").each(function(index, element)
		{
			var URL;
			console.log('ProcessGameListPage. THIS_URL is');
			console.log(THIS_URL);
			console.log('ProcessGameListPage. element is');
			console.log(element);
			// if (/www\.steamgifts\.com\/giveaways\/entered/.test(THIS_URL)) {
			// 	console.log('ProcessGameListPage. Giveaways entered page?');
			// 	// URL = $(element).first("a.table__column__heading").attr('href');
			// 	URL = element.querySelector('a.table__column__heading').href;
			// }
			if (/www.steamgifts.com\/account\/settings\/giveaways\/filters/.test(THIS_URL))
				URL = $(element).find("a.table__column__secondary-link").text();
			else if (/www\.steamgifts\.com\/giveaways\/entered/.test(THIS_URL))
				URL = $($(element).find(".table_image_thumbnail")[0]).css('background-image');
			else
				URL = $($(element).find(".global__image-inner-wrap")[0]).css('background-image');

			console.log('ProcessGameListPage. URL is');
			console.log(URL);

			if(URL !== undefined)
			{
				URL = URL.replace('url(', '').replace(')', '');
				var Name = $(element).find(".table__column__heading").text().substring(0,30);
				var $Target = $(element).find(".table__column--width-fill > :first-child");

				if(/www.steamgifts.com\/sales/.test(THIS_URL))
					$Target.css("display", "block"); //because sales pages don't use <p> thus tags will appears in line with title

				console.log('ProcessGameListPage. calling ProcessTags');
				ProcessTags($Target, URL, Name);
			}
		});
	}
}

function ProcessTags($Target, URL, Name)
{
	var ID = getAppIDfromLink(URL);
	Name = encodeURIComponent(Name); //encode special characters that may break search params
	var linkStore = "";
	if(isApp(URL))
		linkStore = "https://store.steampowered.com/app/" + ID;
	else if(isPackage(URL))
		linkStore = "https://store.steampowered.com/sub/" + ID;

	var $tagBundle, $tagCard, $tagAchievement, $tagWishlist, $tagLinux, $tagMac, $tagEarly, $tagHidden, $tagOwned, $tagIgnored, $tagOther;
	if(cbTagStyle == 1)
	{
		if(cbBundled == 1)
			$tagBundle  = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, $Target);
		else
			$tagBundle  = createTag(pBundle.class, "", pBundle.text2, pBundle.link+Name, $Target);

		$tagCard        = createTag(pCard.class, pCard.title, pCard.text, pCard.link+ID, $tagBundle);
		$tagAchievement = createTag(pAchievement.class, pAchievement.title, pAchievement.text, pAchievement.link+ID+"/achievements/", $tagCard);
		$tagWishlist    = createTag(pWishlist.class, pWishlist.title, pWishlist.text, pWishlist.link+Name, $tagAchievement);
		$tagLinux       = createTag(pLinux.class, pLinux.title, pLinux.text, linkStore, $tagWishlist);
		$tagMac         = createTag(pMac.class, pMac.title, pMac.text, linkStore, $tagLinux);
		$tagEarly       = createTag(pEarly.class, pEarly.title, pEarly.text, linkStore, $tagMac);
		$tagOwned       = createTag(pOwned.class, pOwned.title, pOwned.text, linkStore, $tagEarly);
		$tagIgnored     = createTag(pIgnored.class, pIgnored.title, pIgnored.text, linkStore, $tagOwned);
	}
	else
	{
		if(cbBundled == 1)
			$tagBundle  = createTag(pBundle.class + " minimalist", pBundle.title, pBundle.min, pBundle.link+Name, $Target);
		else
			$tagBundle  = createTag(pBundle.class + " minimalist", "", pBundle.min2, pBundle.link+Name, $Target);

		$tagCard        = createTag(pCard.class + " minimalist", pCard.title, pCard.min, pCard.link+ID, $Target);
		$tagAchievement = createTag(pAchievement.class + " minimalist", pAchievement.title, pAchievement.min, pAchievement.link+ID+"/achievements/", $Target);
		$tagWishlist    = createTag(pWishlist.class + " minimalist", pWishlist.title, pWishlist.min, pWishlist.link+Name, $Target);
		$tagLinux       = createTag(pLinux.class + " minimalist", pLinux.title, pLinux.min, linkStore, $Target);
		$tagMac         = createTag(pMac.class + " minimalist", pMac.title, pMac.min, linkStore, $Target);
		$tagEarly       = createTag(pEarly.class + " minimalist", pEarly.title, pEarly.min, linkStore, $Target);
		$tagOwned       = createTag(pOwned.class + " minimalist", pOwned.title, pOwned.min, linkStore, $Target);
		$tagIgnored     = createTag(pIgnored.class + " minimalist", pIgnored.title, pIgnored.min, linkStore, $Target);
	}

	if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) //only trigger inside giveaway page, no need for homepage
	{
		if(cbTagStyle == 1)
			$tagHidden = createTag(pHidden.class, pHidden.title, pHidden.text, pHidden.link+Name, $tagIgnored);
		else if(cbTagStyle == 2)
			$tagHidden = createTag(pHidden.class + " minimalist", pHidden.title, pHidden.min, pHidden.link+Name, $Target);

		getHiddenStatus(ID, Name, $tagHidden);
	}

	if(isApp(URL))
		getSteamCategories(ID, $tagCard, $tagAchievement, $tagLinux, $tagMac, $tagEarly);
	else if(isPackage(URL))
	{
		$tagCard.attr("href", "");
		$tagAchievement.attr("href", "");
		getSteamCategoriesFromPackage(ID, $tagCard, $tagAchievement, $tagLinux, $tagMac, $tagEarly);
	}

	var type = isApp(URL) ? 'app' : 'sub';
	// if(cbBundled && BundledGames !== "")
	// 	getBundleStatus(ID, type, $tagBundle);
	if(UserdataAPI !== "")
	{
		if(cbWishlist)
			getWishlistStatus(ID, $tagWishlist);
		if(cbOwned)
			getOwnedStatus(ID, $tagOwned, (type == 'app'));
		if(cbIgnored)
			getIgnoredStatus(ID, $tagIgnored, (type == 'app'));
	}
}

function createTag(_class, title, text, href, $divTarget)
{
	var $tag = $('<a target="_blank" class="tags ' + _class +'" title="' + title + '" href="' + href + '">' + text + '</a>');

	if(cbTagStyle == 1 || /www.steamgifts.com\/giveaways\/new/.test(THIS_URL)) // full text below game title, use after, or bundle tag in giveaway creation page
		$divTarget.after($tag);
	else if(cbTagStyle == 2) // minimalist beside game title use append
		$divTarget.append($tag);
	return $tag;
}

function getSteamCategories(appID, $tagCard, $tagAchievement, $tagLinux, $tagMac, $tagEarly, packID = "0")
{
	var needRequest = false;
	if(GameData[appID] === undefined)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0, "game": appID+""};
		GameData[appID] = template;
		needRequest = true;
	}
	else
	{
		var data = GameData[appID];
		if(cbCards && data.cards)
		{
			$tagCard.css("display", "inline-block");
			$tagCard.css("display", "inline-block");
			$tagCard.attr("href", pCard.link+GameData[appID].game);
		}
		if(cbAchievement && data.achievement)
		{
			$tagAchievement.css("display", "inline-block");
			$tagAchievement.attr("href", pAchievement.link+GameData[appID].game+"/achievements/");
		}
		if(cbMac && data.mac)
			$tagMac.css("display", "inline-block");
		if(cbLinux && data.linux)
			$tagLinux.css("display", "inline-block");

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
		else if(data.early_access && cbEarly)
			$tagEarly.css("display", "inline-block");
	}
	if(needRequest)
	{
		var link = linkGameAPI+appID;
		if(GameData[appID].last_checked !== 0 || (packID != "0" && PackageData[packID].last_checked !== 0)) //if not first time checked, filter out the request
			link += "&filters=categories,platforms,genres";

		// console.log("[SG Game Tags] requesting " + link);

		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: link,
			onload: function(data)
			{
				var obj = JSON.parse(data.responseText)[appID].data;
				if(obj !== undefined) // undefined = doesn't have store page or doesn't exist
				// get steam apps categories : achievement, trading cards, etc
				{
					if (obj.type !== undefined && obj.type != "game") //if it is DLC, obj will have different fullgame.appid
					{
						GameData[appID].game = obj.fullgame.appid;
						//set tagcard and tagachievement href to the main game appid
						$tagCard.attr("href", pCard.link+obj.fullgame.appid);
						$tagAchievement.attr("href", pAchievement.link+obj.fullgame.appid+"/achievements/");
					}
					else if(packID != "0" && PackageData[packID].games.indexOf(appID) == -1)
						PackageData[packID].games.push(appID);

					var categories = obj.categories;
					if(categories !== undefined)
					{
						var catCards = $.grep(categories, function(e){ return e.id == "29"; });
						if(catCards.length > 0)
						{
							if(cbCards) $tagCard.css("display", "inline-block");
							GameData[appID].cards = true;
							if(packID != "0")
							{
								PackageData[packID].cards = true;
								if(PackageData[packID].games.length > 1)
									$tagCard.attr("href", "http://ruphine.esy.es/steamgifts/tradingcard.php?packageid="+packID);
								else
									$tagCard.attr("href", pCard.link+PackageData[packID].games[0]);
							}
						}

						var catAchievement = $.grep(categories, function(e){ return e.id == "22"; });
						if(catAchievement.length > 0)
						{
							GameData[appID].achievement = true;
							if(cbAchievement)
								$tagAchievement.css("display", "inline-block");
							if(packID != "0")
							{
								PackageData[packID].achievement = true;
								if(PackageData[packID].games.length > 1)
									$tagAchievement.attr("href", "http://ruphine.esy.es/steamgifts/achievement.php?packageid="+packID);
								else
									$tagAchievement.attr("href", pAchievement.link+PackageData[packID].games[0]+"/achievements/");
							}
						}
					}

					// get steam apps platforms: linux: boolean, mac: boolean
					var platforms = obj.platforms;
					if(platforms.linux)
					{
						GameData[appID].linux = true;
						if(cbLinux)
							$tagLinux.css("display", "inline-block");
						if(packID != "0")
							PackageData[packID].linux = true;
					}
					if(platforms.mac)
					{
						GameData[appID].mac = true;
						if(cbMac)
							$tagMac.css("display", "inline-block");
						if(packID != "0")
							PackageData[packID].mac = true;
					}

					// get steam apps genres
					if(obj.genres !== undefined)
					{
						var genEarly = $.grep(obj.genres, function(e){ return e.id == "70"; });
						if(genEarly.length > 0)
						{
							GameData[appID].early_access = true;
							if(cbEarly)
								$tagEarly.css("display", "inline-block");
							if(packID != "0")
								PackageData[packID].early_access = true;
						}
						else
						{
							GameData[appID].early_access = false;
							if(packID != "0")
								PackageData[packID].early_access = false;
						}
					}
				}
				GameData[appID].last_checked = Date.now();
				GM_setValue("GameData", JSON.stringify(GameData));

				if(packID != "0")
				{
					PackageData[packID].last_checked = Date.now();
					GM_setValue("PackageData", JSON.stringify(PackageData));
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkGameAPI+appID + " Timeout");
			}
		});
	}
}

function getBundleStatus(appID, type, $tag)
{
	var Game = $.grep(arrBundled, function(e){ return (e.AppID == appID && e.Type == type); });
	if(Game.length > 0 && cbBundled == 1) //game found in bundle list
	{
		$tag.css("display", "inline-block");
		$tag.attr("title", pBundle.title+Game[0].BundledDate);
	}
	else if(Game.length == 0 && cbBundled == 2)
		$tag.css("display", "inline-block");
}

function getBundleList()
{
	console.log("[SG Game Tags] requesting " + linkBundleAPI);
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkBundleAPI,
		onload: function(data)
		{
			console.log('On bundlelist req onload');
			BundledGames = data.responseText;
			GM_setValue("BundledGames", BundledGames);

			BundledCache = Date.now();
			GM_setValue("BundledCache", BundledCache);

			if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME)
				getUserdata();
            else
                main();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkBundleAPI + " Timeout");
			if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME)
				getUserdata();
            else
                main();
		},
		onerror: function(data) {
			console.log('On bundlelist req onerror');
		}
	});
}

function getUserdata()
{
	console.log("[SG Game Tags] requesting " + linkUserAPI);
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkUserAPI,
		onload: function(data)
		{
			var result = JSON.parse(data.responseText);
			if(result.rgOwnedApps.length !== 0) //check if user logged in
			{
				UserdataAPI = data.responseText;
				GM_setValue("UserdataAPI", UserdataAPI);

				UserdataCache = Date.now();
				GM_setValue("UserdataCache", UserdataCache);
			}
			else
				console.log("[SG Game Tags] Unable to get user's steam data. User is not logged in to steam.");

			main();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkUserAPI + " Timeout");
			main();
		}
	});
}

function getHiddenStatus(appID, appName, $elems)
{
	if(cbHidden)
	{
		// console.log("[SG Game Tags] requesting " + pHidden.link+appName);
		$.get(pHidden.link+appName, function(data)
		{
			var gamesfound = $(data).find("a.table__column__secondary-link");
			for(i=0; i<$(gamesfound).length; i++)
			{
				var url = $(gamesfound)[i].href;
				var ID = getAppIDfromLink(url);
				if(appID == ID)
				{
					//TODO : Save appID + true ke local cache
					$elems.css("display", "inline-block");
					return true; //exit function
				}
			}
		});
	}
}

function getWishlistStatus(appID, $elems)
{
	appID = parseInt(appID);
	if(rgWishlist.indexOf(appID) >= 0)
		$elems.css("display", "inline-block");
}

function getOwnedStatus(appID, $elems, isApp)
{
	appID = parseInt(appID);
	if(isApp && rgOwnedApps.indexOf(appID) >= 0)
		$elems.css("display", "inline-block");
	else if(!isApp && rgOwnedPackages.indexOf(appID) >= 0)
		$elems.css("display", "inline-block");
}

function getIgnoredStatus(appID, $elems, isApp)
{
	console.log("Ignored status of appID " + appID);
	appID = parseInt(appID);
	console.log(rgIgnoredApps);
	if(isApp && rgIgnoredApps.indexOf(appID) >= 0)
		$elems.css("display", "inline-block");
	else if(!isApp && rgIgnoredPackages.indexOf(appID) >= 0)
		$elems.css("display", "inline-block");
}

function getSteamCategoriesFromPackage(packID, $tagCard, $tagAchievement, $tagLinux, $tagMac, $tagEarly)
{
	var needRequest = false;
	if(PackageData[packID] === undefined || PackageData[packID].games === undefined)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0, "games":[]};
		PackageData[packID] = template;
		needRequest = true;
	}
	else
	{
		var data = PackageData[packID];
		if(cbCards && data.cards)
		{
			$tagCard.css("display", "inline-block");
			if(data.games.length > 1)
			{
				$tagCard.attr("href", "http://ruphine.esy.es/steamgifts/tradingcard.php?packageid="+packID);
				$tagCard.attr("title", "There is " + data.games.length + " games in this package, and at least one of them have trading cards");
			}
			else
				$tagCard.attr("href", pCard.link+data.games[0]);
		}
		if(cbAchievement && data.achievement)
		{
			$tagAchievement.css("display", "inline-block");
			if(data.games.length > 1)
			{
				$tagAchievement.attr("href", "http://ruphine.esy.es/steamgifts/achievement.php?packageid="+packID);
				$tagAchievement.attr("title", "There is " + data.games.length + " games in this package, and at least one of them have achievements");
			}
			else
				$tagAchievement.attr("href", pAchievement.link+data.games[0]+"/achievements/");
		}
		if(cbMac && data.mac)
			$tagMac.css("display", "inline-block");
		if(cbLinux && data.linux)
			$tagLinux.css("display", "inline-block");
		if(cbEarly && data.early_access)
			$tagEarly.css("display", "inline-block");

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
	}
	if(needRequest)
	{
		// console.log("[SG Game Tags] requesting " + linkPackAPI+packID);
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkPackAPI+packID,
			onload: function(data)
			{
				var IDs = JSON.parse(data.responseText)[packID].data;
				if(IDs === undefined)
				{
					PackageData[packID].cards = false;
					PackageData[packID].achievement = false;
					PackageData[packID].mac = false;
					PackageData[packID].linux = false;
					PackageData[packID].early_access = false;
					PackageData[packID].games = [];
					PackageData[packID].last_checked = Date.now();
					GM_setValue("PackageData", JSON.stringify(PackageData));
				}
				else
				{
					IDs = IDs.apps;
					$.each(IDs, function(index)
					{
						getSteamCategories(IDs[index].id, $tagCard, $tagAchievement, $tagLinux, $tagMac, $tagEarly, packID);
					});
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkPackAPI+packID + " Timeout");
			}
		});
	}
}

function PrepareJSON()
{
	var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0};
	var a = {"0":template};
	var temp = JSON.stringify(a);
	GameData = JSON.parse(temp);
	PackageData = JSON.parse(temp);
	GM_setValue("GameData", JSON.stringify(GameData));
	GM_setValue("PackageData", JSON.stringify(PackageData));
}

function getAppIDfromLink(link){
	var url = link.split("/")[4];
	return url.split("?")[0];
}

function isApp(link){
	return /\/app|apps\/0-9\//.test(link);
}

function isPackage(link){
	return /\/sub|subs\/0-9\//.test(link);
}


// ========================================== create new giveaway page ========================================================
function InitGiveawayCreationPage()
{
	if($(".js__autocomplete-data").length > 0)
	{
		var observer = new MutationObserver(function(mutations)
		{
			$(".tags").remove();
			var $table = $(mutations[0].addedNodes).find(".table__row-inner-wrap");
			$table.each(function(index, element)
			{
				var url = $(element).find("a.table__column__secondary-link").text();
				var ID = getAppIDfromLink(url);
				var Name = $(element).find(".table__column__heading").text();
				var $Target = $(element).find(".table__column--width-fill");

				var $tagBundle = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, $Target);
				$tagBundle.css("float", "right");

				var type = isApp(url) ? 'app' : 'sub';
				getBundleStatus(ID, type, $tagBundle);
			});
			$table.on("click", function(event)
			{
				var url = $(this).find("a.table__column__secondary-link").text();
				var ID = getAppIDfromLink(url);
				var Name = $(this).find(".table__column__heading").text();
				var $Target = $(".js__autocomplete-name");
				$tagBundle = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, $Target);
				var type = isApp(url) ? 'app' : 'sub';
				getBundleStatus(ID, type, $tagBundle);
			});
		});
		var config = {childList: true, attributes: false, characterData: false};
		observer.observe($(".js__autocomplete-data")[0], config);
	}
}

// ========================================== setting page ========================================================
function initSetting()
{
	$("head").html('\
		<meta charset="UTF-8">\
		<link rel="shortcut icon" href="https://cdn.steamgifts.com/img/favicon.ico">\
		<title>SG Game Tags Setting</title>\
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">\
		<link rel="stylesheet" type="text/css" href="https://cdn.steamgifts.com/css/minified_v52.css">\
		<script src="https://cdn.steamgifts.com/js/minified_v59.js"></script>\
		<meta name="viewport" content="width=1200">\
		<!-- SGGT Import -->\
		<style type="text/css">\
			.my__checkbox { cursor:pointer; padding:7px 0; } \
			.my__checkbox i { margin-right:7px; } \
			.my__checkbox:not(:last-of-type) { border-bottom:1px dotted #d2d6e0; } \
			.my__checkbox:not(:hover) .form__checkbox__hover,.my__checkbox.is-selected .form__checkbox__hover,.my__checkbox:not(.is-selected) .form__checkbox__selected,.my__checkbox:hover .form__checkbox__default,.my__checkbox.is-selected .form__checkbox__default { \
				display:none; \
			} \
			.row div { display: inline-block; } \
			.preview-tags { width: 80px; margin-left: 10px; } \
			.row .markdown {margin-left: 10px; cursor: pointer; }\
		</style>\
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css" />\
	');
	$("head").append('<style type="text/css">' + myCSS + '</style>');
	$("body").html("");

	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: "/account/settings/giveaways",
		dataType: "html",
		onload: function(data){
			var $header = $(data.responseText).filter("header");
			var $page_outer = $(data.responseText).filter(".page__outer-wrap");
			var $footer_outer = $(data.responseText).filter(".footer__outer-wrap");

			$page_outer.find("form").remove();
			$page_outer.find(".sidebar__navigation .is-selected").removeClass("is-selected").find("a i").remove();
			var $sidebar_item = $('<li class="sidebar__navigation__item is-selected">\
									<a class="sidebar__navigation__item__link" href="/sg-game-tags">\
										<i class="fa fa-caret-right"></i>\
										<div class="sidebar__navigation__item__name">SG Game Tags</div>\
										<div class="sidebar__navigation__item__underline"></div>\
									</a>\
								</li>');
			$($page_outer.find(".sidebar__navigation")[2]).append($sidebar_item);

			$("body").append($header).append($page_outer).append($footer_outer);
			$(".page__heading").after($('<div class="form__rows"></div>'));
			$(".page__heading__breadcrumbs").html('<a href="/sg-game-tags">SG Game Tags Setting</a>');

			initTagPositionSetting();
			initTagOnOffSetting();
			initTagColorSetting();
			changeCBColor();
			AddShortcutToSettingPage();
		},
		ontimeout: function()
		{
			console.log("timeout");
		}
	});
}

function initTagPositionSetting()
{
	var no = $(".form__heading").length + 1;
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var $form__row = $('<div class="form__row"></div>');

		var $form__heading = $('<div class="form__heading"></div>');
		$form__heading
			.append('<div class="form__heading__number">' + no + '.</div>')
			.append('<div class="form__heading__text" title="This setting doesn\'t affect performance, only visual change."> Tags Style </div>');

		var $form__row__indent = $('<div class="form__row__indent"></div>');
			var $form__checkbox_1 = createCheckBox("form__checkbox", CheckIcon + "(Original) Full Text tags below game title", cbTagStyle == 1);
			var $form__checkbox_2 = createCheckBox("form__checkbox", CheckIcon + "(Minimalist) One letter tags beside game title", cbTagStyle == 2);

			$form__checkbox_1.attr("title", 'The tags will display "Trading Cards", "Bundled", etc. This option will increase page height.');
			$form__checkbox_2.attr("title", 'The tags will just display first letter. "Trading Cards" becomes "T", "Bundled" becomes "B", etc.');

			$form__checkbox_1.click(function()
			{
				cbTagStyle = 1;
				GM_setValue("cbTagStyle", 1);
				toggleMinimalist(false);
				$form__checkbox_2.removeClass("is-selected");
				$form__checkbox_1.addClass("is-selected");
			});
			$form__checkbox_2.click(function()
			{
				cbTagStyle = 2;
				GM_setValue("cbTagStyle", 2);
				toggleMinimalist();
				$form__checkbox_1.removeClass("is-selected");
				$form__checkbox_2.addClass("is-selected");
			});

		$form__row__indent.append($form__checkbox_1).append($form__checkbox_2);

	$form__row.append($form__heading).append($form__row__indent);
	$(".form__rows").append($form__row);
}

function initTagOnOffSetting()
{
	var no = $(".form__heading").length + 1;
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var $form__row = $('<div class="form__row"></div>');

		var $form__heading = $('<div class="form__heading"></div>');
		$form__heading
			.append('<div class="form__heading__number">' + no + '.</div>')
			.append('<div class="form__heading__text" title="If you have performance issues, try disable tags you don\'t need"> Enable/Disable Tags </div>');

		var $form__checkbox_1 = createCheckBox("my__checkbox", CheckIcon + pBundle.text, cbBundled);
		var $form__checkbox_2 = createCheckBox("my__checkbox", CheckIcon + pCard.text, cbCards);
		var $form__checkbox_3 = createCheckBox("my__checkbox", CheckIcon + pAchievement.text, cbAchievement);
		var $form__checkbox_4 = createCheckBox("my__checkbox", CheckIcon + pHidden.text, cbHidden);
		var $form__checkbox_5 = createCheckBox("my__checkbox", CheckIcon + pWishlist.text, cbWishlist);
		var $form__checkbox_6 = createCheckBox("my__checkbox", CheckIcon + pLinux.text, cbLinux);
		var $form__checkbox_7 = createCheckBox("my__checkbox", CheckIcon + pMac.text, cbMac);
		var $form__checkbox_8 = createCheckBox("my__checkbox", CheckIcon + pEarly.text, cbEarly);
		var $form__checkbox_9 = createCheckBox("my__checkbox", CheckIcon + pOwned.text, cbOwned);
		var $form__checkbox10 = createCheckBox("my__checkbox", CheckIcon + pIgnored.text, cbIgnored);
		var $form__checkbox11 = $('<div class="my__checkbox is-disabled">' + CheckIcon + 'Not-Bundled</div>');
		if(cbBundled == 2)
		{
			$form__checkbox11.addClass("is-selected").removeClass("is-disabled");
			$form__checkbox_1.addClass("is-disabled").removeClass("is-selected");
		}

		$form__checkbox_1.click(function(){
			if(cbBundled == 1){
				$form__checkbox_1.removeClass("is-selected").addClass("is-disabled");
				cbBundled = 0;
			}
			else{
				$form__checkbox_1.removeClass("is-disabled").addClass("is-selected");
				$form__checkbox11.removeClass("is-selected").addClass("is-disabled");
				if(cbTagStyle == 1)
					$("."+pBundle.class).html(pBundle.text);
				else if(cbTagStyle == 2)
					$("."+pBundle.class).html(pBundle.min);
				cbBundled = 1;
			}
			changeCBColor();
			GM_setValue("cbBundled", cbBundled);
		});
		$form__checkbox11.click(function(){
			if(cbBundled == 2){
				$form__checkbox11.removeClass("is-selected").addClass("is-disabled");
				cbBundled = 0;
			}
			else{
				$form__checkbox_1.removeClass("is-selected").addClass("is-disabled");
				$form__checkbox11.removeClass("is-disabled").addClass("is-selected");
				if(cbTagStyle == 1)
					$("."+pBundle.class).html(pBundle.text2);
				else if(cbTagStyle == 2)
					$("."+pBundle.class).html(pBundle.min2);
				cbBundled = 2;
			}
			changeCBColor();
			GM_setValue("cbBundled", cbBundled);
		});

		$form__checkbox_2.click(function(){toggleCBTags($form__checkbox_2, "cbCards");});
		$form__checkbox_3.click(function(){toggleCBTags($form__checkbox_3, "cbAchievement");});
		$form__checkbox_4.click(function(){toggleCBTags($form__checkbox_4, "cbHidden");});
		$form__checkbox_5.click(function(){toggleCBTags($form__checkbox_5, "cbWishlist");});
		$form__checkbox_6.click(function(){toggleCBTags($form__checkbox_6, "cbLinux");});
		$form__checkbox_7.click(function(){toggleCBTags($form__checkbox_7, "cbMac");});
		$form__checkbox_8.click(function(){toggleCBTags($form__checkbox_8, "cbEarly");});
		$form__checkbox_9.click(function(){toggleCBTags($form__checkbox_9, "cbOwned");});
		$form__checkbox10.click(function(){toggleCBTags($form__checkbox10, "cbIgnored");});

		var $form__row__indent = $('<div class="form__row__indent"></div>');
		$form__row__indent
			.append($form__checkbox_1).append($form__checkbox11)
			.append($form__checkbox_2)
			.append($form__checkbox_3)
			.append($form__checkbox_4)
			.append($form__checkbox_5)
			.append($form__checkbox_6)
			.append($form__checkbox_7)
			.append($form__checkbox_8)
			.append($form__checkbox_9)
			.append($form__checkbox10);

	$form__row.append($form__heading).append($form__row__indent);
	$(".form__rows").append($form__row);
}

function createCheckBox(_class, _html, cbValue)
{
	var $cb = $('<div class="' + _class + '">' + _html + '</div>');
	if(cbValue)
		$cb.addClass("is-selected");
	else
		$cb.addClass("is-disabled");
	return $cb;
}

function toggleCBTags(cbElems, cbName)
{
	var cbValue;
	if(cbName == "cbCards")
		cbValue = cbCards = !cbCards;
	else if(cbName == "cbAchievement")
		cbValue = cbAchievement = !cbAchievement;
	else if(cbName == "cbBundled")
		cbValue = cbBundled = !cbBundled;
	else if(cbName == "cbHidden")
		cbValue = cbHidden = !cbHidden;
	else if(cbName == "cbWishlist")
		cbValue = cbWishlist = !cbWishlist;
	else if(cbName == "cbLinux")
		cbValue = cbLinux = !cbLinux;
	else if(cbName == "cbMac")
		cbValue = cbMac = !cbMac;
	else if(cbName == "cbEarly")
		cbValue = cbEarly = !cbEarly;
	else if(cbName == "cbOwned")
		cbValue = cbOwned = !cbOwned;
	else if(cbName == "cbIgnored")
		cbValue = cbIgnored = !cbIgnored;

	if(cbValue)
		$(cbElems).removeClass("is-disabled").addClass("is-selected");
	else
		$(cbElems).removeClass("is-selected").addClass("is-disabled");

	GM_setValue(cbName, cbValue);
	changeCBColor();
}

function changeCBColor()
{
	var colorCBDisabled = $(".form__checkbox.is-disabled").css("color");
	var colorCBSelected = $(".form__checkbox.is-selected").css("color");
	$(".my__checkbox.is-disabled").css("color", colorCBDisabled);
	$(".my__checkbox.is-selected").css("color", colorCBSelected);
}

function initRowColorPicker(name, tag)
{
	var $row = $('<div class="row"></div');
	var $cp1 = $('<input type="text" class="colorpicker" id="' + name + '-1"/>');
	var $cp2 = $('<input type="text" class="colorpicker" id="' + name + '-2"/>');
	$row.append($cp1).append($cp2)
		.append('<div class="markdown"><a class="default_' + name + '">Default</a></div>')
		.append('<div class="preview-tags"><a class="tags ' + tag.class + '" style="display: inline-block;" title="'+tag.text+'">' + tag.text + '</a></div>');

	initColorpicker($cp1, GM_getValue(name+"-1", tag.color1), tag.class, "background-color", name+"-1");
	initColorpicker($cp2, GM_getValue(name+"-2", tag.color2), tag.class, "color", name+"-2");

	$row.find("a").click(function(){clickDefaultColor(name, tag);});
	return $row;
}

function initTagColorSetting()
{
	var no = $(".form__heading").length + 1;
	var $form__row = $('<div class="form__row"></div>');
		var $form__heading = $('<div class="form__heading"></div>');
		$form__heading
			.append('<div class="form__heading__number">' + no + '.</div>')
			.append('<div class="form__heading__text" title="This setting doesn\'t affect performance, only visual change.">Customize tags color</div>');

		var $form__row__indent = $('<div class="form__row__indent"></div>');
		$form__row__indent
			.append(initRowColorPicker("bundle", pBundle))
			.append(initRowColorPicker("card", pCard))
			.append(initRowColorPicker("achievement", pAchievement))
			.append(initRowColorPicker("wishlist", pWishlist))
			.append(initRowColorPicker("hidden", pHidden))
			.append(initRowColorPicker("linux", pLinux))
			.append(initRowColorPicker("mac", pMac))
			.append(initRowColorPicker("early", pEarly))
			.append(initRowColorPicker("owned", pOwned))
			.append(initRowColorPicker("ignored", pIgnored));

	$form__row.append($form__heading).append($form__row__indent);

	$(".form__rows").append($form__row);

	if(cbBundled == 2)
		$(".tags_bundle").html(pBundle.text2);
	if(cbTagStyle == 2) // change tags if minimalist selected
		toggleMinimalist();
}

function initColorpicker($cp, currentColor, tag, property, GMsetValue)
{
	$cp.spectrum(
	{
		showInput: true, // show color code and lets user input color code
		showInitial: true, //show previous color to compare with new color
		showPalette: true,
		showSelectionPalette: true,
		preferredFormat: "hex", //display hex code
		localStorageKey: "spectrum.sggametags",
		maxSelectionSize: 8,
		palette: [
			[pBundle.color1, pCard.color1, pAchievement.color1, pWishlist.color1, pHidden.color1, pLinux.color1, pMac.color1, pEarly.color1, pOwned.color1, pIgnored.color1],
			["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
			["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
			["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
			["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
			["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
			["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
			["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
			["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
		],
		color:currentColor,
		move: function(color){
			$("."+tag).css(property, color.toHexString());
		},
		change: function(color){
			$("."+tag).css(property, color.toHexString());
		},
		hide: function(color){
			GM_setValue(GMsetValue, color.toHexString());
		}
	});
}

function clickDefaultColor(name, tagprop)
{
	GM_setValue(name+"-1", tagprop.color1);
	GM_setValue(name+"-2", tagprop.color2);
	$("."+tagprop.class).css("background-color", tagprop.color1).css("color", tagprop.color2);
	$("#"+name+"-1").spectrum("set", tagprop.color1);
	$("#"+name+"-2").spectrum("set", tagprop.color2);
}

function toggleMinimalist(minimalist = true)
{
	$("."+pBundle.class).text(minimalist ? pBundle.min : pBundle.text);
	$("."+pCard.class).text(minimalist ? pCard.min : pCard.text);
	$("."+pAchievement.class).text(minimalist ? pAchievement.min : pAchievement.text);
	$("."+pWishlist.class).text(minimalist ? pWishlist.min : pWishlist.text);
	$("."+pLinux.class).text(minimalist ? pLinux.min : pLinux.text);
	$("."+pMac.class).text(minimalist ? pMac.min : pMac.text);
	$("."+pEarly.class).text(minimalist ? pEarly.min : pEarly.text);
	$("."+pHidden.class).text(minimalist ? pHidden.min : pHidden.text);
	$("."+pOwned.class).text(minimalist ? pOwned.min : pOwned.text);
	$("."+pIgnored.class).text(minimalist ? pIgnored.min : pIgnored.text);

	if(cbBundled == 2)
		$("."+pBundle.class).text(minimalist ? pBundle.min2 : pBundle.text2);
}

// ==================================================================================================
function AddShortcutToSettingPage()
{
	var shortcut = '\
		<a class="nav__row" href="/sg-game-tags"> \
			<i class="icon-yellow fa fa-fw fa-tag"></i> \
			<div class="nav__row__summary"> \
				<p class="nav__row__summary__name">SG Game Tags Setting</p> \
				<p class="nav__row__summary__description">Open SG Game Tags setting page</span>.</p> \
			</div> \
		</a>';
	var $dropdown = $(".nav__right-container a[href='/account']").parent().find(".nav__absolute-dropdown .nav__row");
	$($dropdown[2]).before(shortcut); // just before logout button
}
