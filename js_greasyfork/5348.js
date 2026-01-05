// ==UserScript==
// @name			Steam Badge Helper
// @namespace		iFantz7E.SteamBadgeHelper
// @version			1.41
// @description		Add various features to Steam focus on Trading Cards and Badges
// @match      		*://store.steampowered.com/*
// @match      		*://steamcommunity.com/*
// @match      		*://forums.steampowered.com/*
// @match      		*://store.akamai.steampowered.com/*
// @match      		*://store.steamgames.com/*
// @run-at			document-start
// @grant 			GM_getValue
// @grant 			GM_setValue
// @grant 			GM_listValues
// @grant 			GM_deleteValue
// @grant 			GM_xmlhttpRequest
// @grant       	GM_addStyle
// @connect     	steamcommunity.com
// @icon      		https://store.steampowered.com/favicon.ico
// @copyright		2014, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/5348/Steam%20Badge%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5348/Steam%20Badge%20Helper.meta.js
// ==/UserScript==

// http://userscripts.org/scripts/show/186163
// https://greasyfork.org/en/scripts/5348-steam-badge-helper

(function ()
{
	"use strict";
	// jshint multistr:true
	
	var timeStart = new Date();

	// ===== Config =====

	var enableDebug = false;
	var enableDebugConsole = true;
	var enableCleanLink = true;
	var enableGreenlightNoAutoplay = true;
	var enableMoveGreenlitHeader = true;
	var enableLinkBadgeToFriend = true;
	var enableLinkStoreToBadge = true;
	var enableLinkForumToBadge = true;
	var enableLinkBadgeToForum = true;
	var enableLinkMarketToBadge = true;
	var enableLinkBadgeToMarket = true;
	var enableLinkInventoryToBadge = true;
	var enableLinkProfile = true;
	var enableCompareBadge = true;
	var enableAlwaysClearCache = false;
	var enableCleanSteamMenu = true;
	var enableHideEnhancedBadgePrice = true;
	var enableAutoscrollSearch = true;
	var enableSwapTitle = true;
	var enableShowTitleNoti = false;
	var enableResizeTradeWindow = true;
	var enableMoveMenuEditProfile = true;
	var enableRefreshError = true;
	var enableSetAllCheckBox = true;
	var enableStoreFocus = true;
	var enableStoreHideSection = true;
	var enableAutoExploreQueue = true;
	var enableSkipAgeCheck = true;
	var enableSkipLinkFilter = true;
	var enableMoveSale = true;
	var enableRedirectToLogin = true;
	
	var enableCache = true;
	var enableDebugCache = false;
	var timeCacheExpireSec = 60;

	var appCards = ["286120", "203990", "32200", "259720", "245550", "306410", "249610", "291130"
		, "218640", "268420", "46500", "102200", "301680", "273770", "264320", "339290", "340280"
		, "273830", "303850", "346200", "353980", "296070", "380770", "294190", "258200", "15700"
		, "92800", "267920", "257890", "314700", "448010", "94400", "390460", "269990", "383560"
		, "252490", "384150", "289690", "492340", "445170", "566270", "432990", "281990", "411590"
		, "425220"];
	var appCardMaps = {"202970": "202990", "234510": "35450"};

	var appDlcs = 		// Exclude
	[
		"230889", "256576", "256611", "258643", "222606", "222615", "222618", "277751"
	];

	var marketCurrencies = 
	{ 
		"USD": "1", "GBP": "2", "EUR": "3", "CHF": "4", "RUB": "5", 
		"BRL": "7", "JPY": "8", "NOK": "9", "IDR": "10", "MYR": "11", 
		"PHP": "12", "SGD": "13", "THB": "14", "KRW": "16", "TRY": "17", 
		"MXN": "19", "CAD": "20", "NZD": "22", "CNY": "23", "INR": "24", 
		"CLP": "25", "PEN": "26", "COP": "27", "ZAR": "28", "HKD": "29", 
		"TWD": "30", "SAR": "31", "AED": "32", 
	};
	
	var marketCountries = 
	{ 
		"US": "1", "UK": "2", "BE": "3", "IT": "3", "CH": "4", "RU": "5", "AZ": "1", 
		"BR": "7", "JP": "8", "NO": "9", "ID": "10", "MY": "11", 
		"PH": "12", "SG": "13", "TH": "14", "KR": "16", "TR": "17", 
		"MX": "19", "CA": "20", "NZ": "22", "CN": "23", "IN": "24", 
		"CL": "25", "PE": "26", "CO": "27", "ZA": "28", "HK": "29", 
		"TW": "30", "SA": "31", "AE": "32", 
	};
	
	// ===== End Config =====

	// ===== Cache =====

	var tmpl_time = "badge_{APP}_time";
	var tmpl_price = "badge_{APP}_{SET}_{NUM}_price";
	var tmpl_url = "badge_{APP}_{SET}_{NUM}_url";
	var tmpl_owned = "badge_{APP}_{SET}_{NUM}_owned";

	function clearCache()
	{
		var keep = ["counter"];
		var cache = GM_listValues();
		debug("clearCache: " + cache.length);
		for (var i = 0; i < cache.length; i++)
		{
			if (keep.indexOf(cache[i]) < 0)
			{
				GM_deleteValue(cache[i]);
			}
		}
	}
	if (enableAlwaysClearCache) clearCache();

	function debugCache()
	{
		var cache = GM_listValues()
		if (enableDebugCache)
		{
			debug("debugCache: ");
			if (cache != null) for (var i = 0; i < cache.length; i++)
			{
				debug("-> " + cache[i] + ": " + GM_getValue(cache[i], 0));
			}
		}
		debug("debugCache: " + (cache == null ? 0 : cache.length));
	}
	setTimeout(debugCache, 0);

	function generateCacheName(tmpl, app, isFoil, number)
	{
		var name = tmpl.replace("{APP}", app);
		if (isFoil != null)
		{
			var set = isFoil ? "F1" : "N1";
			name = name.replace("{SET}", set);
		}
		if (number != null)
		{
			name = name.replace("{NUM}", number);
		}
		return name;
	}
	function generateCacheNameTime(app)
	{
		return generateCacheName(tmpl_time, app);
	}
	function generateCacheNamePrice(app, isFoil, number)
	{
		return generateCacheName(tmpl_price, app, isFoil, number);
	}
	function generateCacheNameUrl(app, isFoil, number)
	{
		return generateCacheName(tmpl_url, app, isFoil, number);
	}
	function generateCacheNameOwned(app, isFoil, number)
	{
		return generateCacheName(tmpl_owned, app, isFoil, number);
	}

	function getCacheTime(app)
	{
		var name = generateCacheNameTime(app);
		return GM_getValue(name, 0);
	}
	function getCacheTimeDiff(app)
	{
		return getUnixTimestamp() - getCacheTime(app);
	}
	function setCacheTime(app)
	{
		var name = generateCacheNameTime(app);
		GM_setValue(name, getUnixTimestamp());
	}
	function checkCacheExpire(app)
	{
		var cacheDiff = getCacheTimeDiff(app);
		var isCacheExpire = cacheDiff < 0 || cacheDiff > timeCacheExpireSec;

		debug("cacheTimeDiff: " + cacheDiff + "s");
		debug("isCacheExpire: " + isCacheExpire);

		return isCacheExpire;
	}

	function getCachePrice(app, isFoil, number)
	{
		var name = generateCacheNamePrice(app, isFoil, number);
		return GM_getValue(name, 0);
	}
	function setCachePrice(app, isFoil, number, data)
	{
		var name = generateCacheNamePrice(app, isFoil, number);
		GM_setValue(name, data);
	}

	function getCacheUrl(app, isFoil, number)
	{
		var name = generateCacheNameUrl(app, isFoil, number);
		return GM_getValue(name, 0);
	}
	function setCacheUrl(app, isFoil, number, data)
	{
		var name = generateCacheNameUrl(app, isFoil, number);
		GM_setValue(name, data);
	}

	function getCacheOwned(app, isFoil, number)
	{
		var name = generateCacheNameOwned(app, isFoil, number);
		return GM_getValue(name, 0);
	}
	function setCacheOwned(app, isFoil, number, data)
	{
		var name = generateCacheNameOwned(app, isFoil, number);
		GM_setValue(name, data);
	}

	// ===== End Cache =====

	// ===== Helper =====

	setTimeout(function ()
	{
		var counter = GM_getValue('counter', 0);
		GM_setValue('counter', ++counter);
	}, 0);

	function debug(msg)
	{
		try
		{
			msg = msg ? (new String(msg)).trim().replace(/\s\s/gi, "").replace(/\s/gi, " ") : "";

			if (enableDebugConsole)
				console.log(msg);

			if (enableDebug)
			{
				var divDebugID = "div_debug_7e";
				var divDebugOuterID = divDebugID + "_outer";
				var divOut = document.getElementById(divDebugOuterID);
				var div = document.getElementById(divDebugID);

				var isExistOuter = divOut != null;
				if (!isExistOuter)
				{
					divOut = document.createElement("div");
					divOut.id = divDebugOuterID;
					divOut.style = "font-family:'Courier New', Courier; font-size: 11px; z-index: 999999; padding: 3px; text-align: left;"
						+ " border: 3px solid orange; color: black; background-color: rgba(255,255,255,0.9);"
						+ " position: fixed; top: 3px; left: 3px; overflow-x:hidden; overflow-y:scroll; resize: both;";
					divOut.style.width = "150px";
					divOut.style.height = "100px";

					if (div == null)
					{
						div = document.createElement("div");
						div.id = divDebugID;
						div.style.minWidth = "1000px";
						div.innerHTML = "<span style='font-weight: bold; line-height: 18px;'>Debug:</span>";
					}
					divOut.appendChild(div);
					document.body.appendChild(divOut);
				}
				div.innerHTML = div.innerHTML + " <br/> " + msg;
				divOut.scrollTop = divOut.scrollHeight;
			}
		}
		catch (e)
		{
			console.log("Ex: " + e);
		}
	}

	function debugTime(header)
	{
		header = header ? (new String(header)) + ": " : "";
		var ms = (new Date()) - timeStart;
		debug(header + ms + "ms");
	}
	
	function getUnixTimestamp()
	{
		return parseInt((new Date()) / 1000);
	}

	function randNum()
	{
		return parseInt(Math.random() * 900000 + 100000);
	}

	function randTempID()
	{
		return "id_temp_7e_" + randNum();
	}

	function createDivTemp(id, html)
	{
		var div = document.getElementById(id);
		if (div == null)
		{
			div = document.createElement("div");
			div.id = id;
			document.body.appendChild(div);
		}
		div.style.display = "none";
		div.style.zIndex = "-999999";

		// remove all external sources
		var pattScript = /(<(script|meta|link|style|title)[^>]*>|<\/(script|meta|link|style|title)>)/gi;
		html = html.replace(pattScript, "");

		// replace http to https
		//html = html.replace(/http:\/\//ig, "https://");

		div.innerHTML = html;
	}

	function removeDivTemp(id)
	{
		var ele = document.getElementById(id);
		ele.parentNode.removeChild(ele);
	}

	function attachOnLoad(callback)
	{
		window.addEventListener("load", function (e) {
			callback();
		});
	}

	function attachOnReady(callback)
	{
		document.addEventListener("DOMContentLoaded", function (e) {
			if (document.readyState === "interactive")
			{
				callback();
			}
		});
	}

	function reload()
	{
		var curHref = window.location.href;
		var posHashtag = curHref.indexOf("#");
		if (posHashtag > -1)
		{
			window.location = curHref.substr(0, posHashtag);
		}
		else
		{
			window.location = curHref;
		}
	}
	
	function getCookie(c_name) 
	{
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1) {
			c_start = c_value.indexOf(c_name + "=");
		}
		if (c_start == -1) {
			c_value = null;
		}
		else {
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start, c_end));
		}
		return c_value;
	}
	
	var isVisible = (function()
	{
		var stateKey;
		var eventKey;
		var keys = 
		{
			hidden: "visibilitychange",
			webkitHidden: "webkitvisibilitychange",
			mozHidden: "mozvisibilitychange",
			msHidden: "msvisibilitychange"
		};
		for (stateKey in keys) 
		{
			if (stateKey in document) 
			{
				eventKey = keys[stateKey];
				break;
			}
		}
		return function(c) 
		{
			if (c) 
			{
				document.addEventListener(eventKey, c);
			}
			return !document[stateKey];
		}
	})();

	function isError()
	{
		var url = document.documentURI;
		var retVal = 
			url.indexOf("/api") < 0
			&& url.indexOf("api.") < 0
			&& url.indexOf("/priceoverview") < 0
			&& url.indexOf("/render") < 0
			&& url.indexOf("/login/") < 0
			&& url.indexOf("/widget/") < 0
			&& url.indexOf("/actions/") < 0
			&& url.indexOf("/dynamicstore/") < 0
			&& url.indexOf("/search/suggest?") < 0
			&& url.indexOf("/ajax") < 0
			&& url.indexOf("/moderatormessages") < 0
			&& url.indexOf("/itemordershistogram") < 0
			&& url.indexOf("mobile") < 0
			&& url.indexOf("/chat/") < 0
			&& url.indexOf(".js") < 0
			&& window === window.parent
			&&
			(
				(
					document.querySelector("body.headerless_page"
						+ ", body.flat_page"
						+ ", #main"
						+ ", #supernav"
						+ ", table.tborder"
						+ ", #headerrow"
						+ ", #global_header"
						+ ", .page_header_ctn"
						+ ", .search_page"
						+ ", #bigpicture_about"
						+ ", #ig_bottom"
						+ ", #feedHeaderContainer"
						+ ", img[alt='Steam']"
						+ ", .waitforauth"
						+ ", .no_header"
						+ ", .mobileBody") == null
				)
				||
				(
					document.querySelector(".profile_fatalerror_message"
						+ ", #error_msg") != null
					//|| document.querySelector("#message") != null
				)
			);
		return retVal;
	}
	
	function isErrorBox()
	{
		var retVal = !!(document.querySelector("#error_box"));
		return retVal;
	}

	function isErrorCard()
	{
		var retVal = document.querySelectorAll("#message > p.returnLink").length > 0;
		return retVal;
	}

	function isErrorMarket()
	{
		var retVal = document.querySelectorAll("#searchResultsTable > .market_listing_table_message").length > 0
			;//&& document.querySelector("#hover_content") == null);
		return retVal;
	}

	function getQueryByName(name, url) 
	{
		if (url == null)
			url = location.search;
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(url);
		var retVal = "";
		if (results != null)
		{
			retVal = results[1].replace(/\+/g, " ");
			try
			{
				retVal = decodeURIComponent(retVal);
			}
			catch (ex)
			{
			}
		}
		return retVal;
	}

	function insertBeforeElement(newNode, referenceNode)
	{
		referenceNode.parentNode.insertBefore(newNode, referenceNode);
	}

	function insertAfterElement(newNode, referenceNode)
	{
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	function clickToSelect(ele)
	{
		if (ele != null)
		{
			var range = document.createRange();
			range.setStartBefore(ele.firstChild);
			range.setEndAfter(ele.lastChild);

			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	// ===== End Helper =====


	// ===== Cleaner =====

	/** Auto refresh when error
	*/
	function refreshError()
	{
		if(isError())
		{
			debug("refreshError: activated");
			setTimeout(reload, 5000);
		}
	}
	function refreshErrorCard()
	{
		if(isErrorCard())
		{
			debug("refreshErrorCard: activated");
			setTimeout(reload, 5000);
		}
	}
	function refreshErrorMarket()
	{
		if(isErrorMarket())
		{
			debug("refreshErrorMarket: activated");
			setTimeout(reload, 5000);
		}
	}
	function refreshErrorExplore()
	{
		if(isErrorBox())
		{
			debug("refreshErrorExplore: activated");
			setTimeout(reload, 1000);
		}
	}
	function refreshErrorTimeout(tm)
	{
		function refresh()
		{
			var url = document.documentURI;
			var pattCard = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;
			var pattTrade = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/tradeoffers\//i;
			var pattMarket = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/[0-9]+/i;
			var pattExplore = /^http[s]?:\/\/store.steampowered.com\/\/?explore/i;

			if (url.indexOf("#") < 0 && url.indexOf("json") < 0 && url.indexOf("xml") < 0)
			{
				setTimeout(refreshError, tm);

				if (pattCard.test(url) || pattTrade.test(url))
				{
					setTimeout(refreshErrorCard, tm);
				}
				else if (pattMarket.test(url))
				{
					setTimeout(refreshErrorMarket, tm);
				}
				else if (pattExplore.test(url))
				{
					setTimeout(refreshErrorExplore, tm);
				}
			}
		}
		attachOnLoad(refresh);
	}
	if (enableRefreshError) refreshErrorTimeout(5000);

	/** Remove unnessary parameters in URL
	*/
	function cleanLink()
	{
		var url = document.documentURI;
		var pattApp = /^http[s]?:\/\/store.steampowered.com\/(app|sub|bundle)\/[0-9]+/i;
		var pattSale = /^http[s]?:\/\/store.steampowered.com\/sale\//i;
		var pattBadge = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;
		var pattFork = /^http[s]?:\/\/store\.(.+steampowered|steamgames)\.com\//i;
		var pattParam = /\/\?.*$/
		var pattParamCC = /\/\?cc\=.*$/
		
		var isSameSite = true;
		
		var urlNew = url;

		if (pattApp.test(url))
		{
			var urlNews = url.match(pattApp);
			if (urlNews != null)
			{
				var urlTail = url.replace(pattApp, "");

				if (urlTail == "")
				{
					urlNew = urlNews[0] + "/";
				}
				else if (urlTail != "/")
				{
					if (urlTail[0] === "?")
					{
						urlTail = "/" + urlTail;
					}
					if (!pattParamCC.test(urlTail) && pattParam.test(urlTail))
					{
						urlNew = urlNews[0] + "/";
					}
				}
			}
		}
		else if (pattSale.test(url))
		{
			var idxQuery = url.indexOf("?");
			if (idxQuery > 0)
			{
				urlNew = url.substr(0, idxQuery);
			}
			
			if (!urlNew.endsWith("/"))
			{
				urlNew += "/";
			}
		}
		else if (pattBadge.test(url))
		{
			var urlNews = url.match(pattBadge);
			if (urlNews != null)
			{
				var urlTail = url.replace(pattBadge, "");

				if (urlTail.charAt(0) != "/")
				{
					urlNew = urlNews[0] + "/" + urlTail;
				}
			}
		}
		else if (pattFork.test(url))
		{
			urlNew = url.replace(pattFork, "http://store.steampowered.com/");
			isSameSite = false;
		}

		if (urlNew != url)
		{
			debug("cleanLink: activated");
			if (isSameSite)
			{
				try
				{
					window.history.replaceState(null, null, urlNew);
				}
				catch (ex)
				{
					window.location.replace(urlNew);
				}
			}
			else
			{
				window.location.replace(urlNew);
			}
		}
	}
	function cleanLinkAttach()
	{
		attachOnReady(function() 
		{
			cleanLink();
		});
	}
	if (enableCleanLink) cleanLinkAttach();

	/** Change search parameter to page 1 to determine visited links
	*/
	function cleanLinkSearch()
	{
		var pattSearch = /snr=1_7_7_230_150_[0-9]+/i

		var as = document.querySelectorAll("a.search_result_row");
		for (var j = 0; j < as.length; j++)
		{
			var urlSearch = as[j].href;
			urlSearch = urlSearch.replace(pattSearch, "snr=1_7_7_230_150_1");
			as[j].href = urlSearch;
		}

		document.addEventListener("DOMNodeInserted", onNodeInserted);
		function onNodeInserted(e)
		{
			try
			{
				var node = e.target;
				if (node.classList.contains("search_result_row"))
				{
					var urlSearch = node.href;
					urlSearch = urlSearch.replace(pattSearch, "snr=1_7_7_230_150_1");
					node.href = urlSearch;
				}

				var count = document.querySelectorAll(".search_result_row").length;
				var divs = document.querySelectorAll(".search_pagination_left");
				for (var i = 0; i < divs.length; i++)
				{
					var oldVals = divs[i].innerHTML.match(/[0-9]+/g);
					var oldVal = oldVals[oldVals.length > 0 ? oldVals.length-1 : 0];
					divs[i].innerHTML = "showing " + count + " of " + oldVal;
				}
			}
			catch (ex)
			{
			}
		}

		if (enableAutoscrollSearch)
		{
			var divButton = document.createElement("div");
			divButton.classList.add("btn_client_small");
			divButton.id = "divAutoscroll";
			divButton.style = "position: fixed; right: 20px; bottom: 20px; z-index:3;";
			divButton.innerHTML = "<a href='' onclick='document.addEventListener(\"DOMNodeInserted\", function(){ window.scrollTo(0,document.body.scrollHeight); }); this.parentElement.style.display=\"none\";  window.scrollTo(0,document.body.scrollHeight); return false;'>Autoscroll to end</a>";
			document.body.appendChild(divButton);
		}
	}
	function cleanLinkSearchAttach(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/search\//i;

		if (patt.test(url))
		{
			attachOnLoad(function()
			{
				setTimeout(cleanLinkSearch, tm);
			});
		}
	}
	if (enableCleanLink) cleanLinkSearchAttach(100);

	/** Remove link lifter in URL
	*/
	function cleanLinkLifter()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\//i;
		var pattHome = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/home/i;

		function cleanLifter()
		{
			var lifter = "https://steamcommunity.com/linkfilter/";
			var lifterLen = lifter.length;
			var lifter2 = "?url=";
			var lifterLen2 = lifter2.length;
			var js = "javascript:"
			var jsLen = js.length;

			var as = document.getElementsByTagName("a");
			for (var i = 0; i < as.length; i++)
			{
				var urlLink = as[i].href;
				if (urlLink.indexOf(lifter) == 0)
				{
					urlLink = urlLink.substr(lifterLen);
					if (urlLink.indexOf(lifter2) == 0)
					{
						urlLink = urlLink.substr(lifterLen2);
					}
					as[i].href = urlLink;
				}
				else if (patt.test(url) && urlLink.indexOf(js) == 0)
				{
					if (as[i].getAttribute('onclick') == null)
					{
						urlLink = decodeURIComponent(urlLink.substr(jsLen));
						as[i].setAttribute('onclick', urlLink + "; return false;");
					}
				}
			}
		}

		var cleanLifterTimeoutId = 0;

		function cleanLifterTimeout()
		{
			clearTimeout(cleanLifterTimeoutId);
			cleanLifterTimeoutId = setTimeout(cleanLifter, 1000);
		}

		attachOnReady(cleanLifter);

		if (pattHome.test(url))
		{
			document.addEventListener("DOMNodeInserted", cleanLifterTimeout);
		}
	}
	if (enableCleanLink) cleanLinkLifter();

	/** Clean Steam's menu on top
	*/
	function cleanSteamMenuTimeout(tm)
	{
		attachOnReady(function ()
		{
			GM_addStyle(
				// Steam header
					" .header_installsteam_btn_content , .header_installsteam_btn { display: none !important; } "
				// Enhanced Steam header
					+ " #enhanced_pulldown, #es_menu { display: none !important; } "
				// SOE header
					+ " #soe-t-menu { display: none !important; } "
			);
		
			setTimeout(function()
			{
				var eleSoe = document.querySelector("#soe-t-menu");
				if (eleSoe)
				{
					eleSoe.textContent = "SOE";
					
					var node = eleSoe.nextElementSibling.nextSibling;
					if (node.nodeName == "#text" && node.nodeValue.toString().trim() == "|")
					{
						node.parentElement.removeChild(node);
					}
				}
				
				var eleEs = document.querySelector("#enhanced_pulldown, #es_menu");
				if (eleEs != null)
				{
					var eleNoti = document.querySelector("#header_notification_area");
					if (eleNoti)
					{
						insertAfterElement(eleEs, eleNoti);
					}
					
					var eleEsPop = document.querySelector("#es_popup");
					if (eleEsPop)
					{
						insertAfterElement(eleEsPop.parentElement, eleEs);
					}
				}

				var menu = document.querySelector("#account_pulldown");
				if (menu)
				{
					menu.addEventListener('mouseover', function() {
						var eleSoe = document.querySelector("#soe-t-menu");
						if (eleSoe)
						{
							eleSoe.style.setProperty("display", "inline-block", "important");
						}
						
						var eleEs = document.querySelector("#enhanced_pulldown, #es_menu");
						if (eleEs)
						{
							eleEs.style.setProperty("display", "inline-block", "important");
						}
					});
				}
				
			}, tm);
		});

	}
	if (enableCleanSteamMenu) cleanSteamMenuTimeout(1000);

	/** Hide EnhancedSteam's price on Badge page
	*/
	function hideEnhancedBadgePrice()
	{
		GM_addStyle(".es_card_search, .es_item_action { display: none !important; } ");
	}
	function hideEnhancedBadgePriceTimeout(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/(gamecards\/[0-9]+|inventory)/i;

		if (patt.test(url))
		{
			attachOnReady(function() 
			{
				setTimeout(hideEnhancedBadgePrice, tm);
			});
		}
	}
	if (enableHideEnhancedBadgePrice) hideEnhancedBadgePriceTimeout(0);

	// ===== End Cleaner =====

	// ===== Main =====

	/** Disable autoplay on Greenlight page while autoplay option is on
	*/
	function disableGreenlightAutoplay()
	{
		var iframes = document.getElementsByTagName("iframe");
		for (var i in iframes)
		{
			if (iframes[i].className == "highlight_flash_player_notice")
			{
				iframes[i].src = iframes[i].src.replace("autoplay=1", "autoplay=0");
			}
		}
	}
	function disableGreenlightAutoplayTimeout(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/sharedfiles\/filedetails\//i;

		if (patt.test(url))
		{
			attachOnLoad(function ()
			{
				setTimeout(disableGreenlightAutoplay, tm);
			});
		}
	}
	if (enableGreenlightNoAutoplay) disableGreenlightAutoplayTimeout(0);

	/** Move Greenlit header to match voting section of Greenlight item
	*/
	function moveGreenlitHeader()
	{
		var eleGreenlit = document.querySelector(".flag");
		if (eleGreenlit)
		{
			var eleArea = document.querySelector(".workshopItemPreviewArea");
			if (eleArea)
			{
				eleArea.appendChild(eleGreenlit.parentElement.parentElement);
			}
		}
		
		var eleWait = document.querySelector("#action_wait");
		if (eleWait)
		{
			var eleVote = document.querySelector("#voteNext");
			if (eleVote)
			{
				insertBeforeElement(eleWait, eleVote);
				eleWait.style.top = "6px";
				eleWait.style.position = "relative";
			}
		}
	}
	function moveGreenlitHeaderReady(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/sharedfiles\/filedetails\//i;

		if (patt.test(url))
		{
			attachOnReady(function ()
			{
				moveGreenlitHeader();
			});
		}
	}
	if (enableMoveGreenlitHeader) moveGreenlitHeaderReady();

	/** Move button in Edit Profile page to right
	*/
	function moveMenuEditProfile()
	{
		GM_addStyle(
			".group_content_bodytext { position: fixed; top: 400px; margin-left: 680px; line-height: 34px; z-index: 10; } "
			+ ".rightcol { position: fixed; top: 230px; margin-left: 658px; z-index: 10; } "
			+ ".saved_changes_msg { width: 610px; } "
		);
	}
	function moveMenuEditProfileTimeout(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/edit/i;

		if (patt.test(url))
		{
			attachOnReady(function() 
			{
				setTimeout(moveMenuEditProfile, tm);
			});
		}
	}
	if (enableMoveMenuEditProfile) moveMenuEditProfileTimeout(0);

	/** Add small button on friend section in Badge page to view friends' Badge page for comparing cards
	*   Reduce height of Review textbox
	*/
	function linkBadgeToFriend()
	{
		var url = document.documentURI;
		var pattHead = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]*/i;
		var urlTail = url.replace(pattHead, "");
		//var pattProfile = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+[\/]?$/i;

		// Correct style
		{
			var styleCorrect = "";

			// fix long card name show incorrect column of cards
			styleCorrect += ".badge_card_set_card .badge_card_set_text { max-width: 220px; } ";

			// fix Firefox show incorrect column of friends' avatar
			styleCorrect += ".persona { line-height: 16px; } ";

			// fix EnhancedSteam show incorrect size of next badge progress
			styleCorrect += ".gamecard_badge_progress .badge_info { width: 250px !important; } ";

			// fix oversize friend action button
			styleCorrect += ".badge_friendwithgamecard_actions .btn_medium { padding-bottom: 0px !important;"
				+ " width: 26px !important; text-align: center !important; } ";

			// fix card name display over counter
			styleCorrect += ".badge_card_set_text_qty { z-index: 2 !important; position: relative !important; } ";

			// fix card drop counter is behind button and reposition
			styleCorrect += ".badge_title_stats_content { margin-top: -4px; } ";
			if (document.querySelector(".badge_title_playgame") != null)
			{
				styleCorrect += ".badge_title_stats_content { padding-right: 45px; } ";
			}

			GM_addStyle(styleCorrect);
		}

		// Link to friends
		{
			var imgCard = "<img style='height:16px; opacity:0.72'"
				+ " src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAgCAYAAABdP1tmAAAAGXRF"
				+ "WHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAA"
				+ "ADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht"
				+ "cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1j"
				+ "MDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6"
				+ "cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNj"
				+ "cmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEu"
				+ "MC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3Vy"
				+ "Y2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdp"
				+ "bmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCOUQ2NEUyQkU4MUZFMzExQUEyMkQ1MDNCQkRFRjU0RCIgeG1w"
				+ "TU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5REYxOTJDOTIyM0MxMUUzODY5NTlGQjMwODBFMkI0MyIgeG1w"
				+ "TU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5REYxOTJDODIyM0MxMUUzODY5NTlGQjMwODBFMkI0MyIgeG1w"
				+ "OkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZy"
				+ "b20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QTQwRjJENkNDMjBFMzExQUEyMkQ1MDNCQkRFRjU0"
				+ "RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOUQ2NEUyQkU4MUZFMzExQUEyMkQ1MDNCQkRFRjU0"
				+ "RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVu"
				+ "ZD0iciI/PviNBbAAAAD6SURBVHjaYvz//z/DcAIslBowY8YMivRnZGRQ1UNMDMMMMJKS5ICxsRdIOdHA"
				+ "HceBMWVFVw8BPcMPpD7QMHAFgJ76OFB56B8Qf6KCJ7iAmG0wFArPgKEpS4XCYzEQxwyqUo5CwIvE/kCg"
				+ "xLwDxBrAgPw7mEs5UpKtChDzDJoYwlbfoMUIzkIBqI7oonjY1UOjHhr10KiHRj006qFRD416aNRDg7e1"
				+ "zUBCa5vmHTx8/Rxiwc/BEkNCQI9MpoL9toPFQ6B+Sc5ooUAZAPVYvwylQoEqoz4juh76O6w8BEwOoPS7"
				+ "nkbuWEON5AYCjJTOPgy2wXrG4TadAhBgANX8SbJBOSc0AAAAAElFTkSuQmCC'></a> ";
				
			var els = document.querySelectorAll(".badge_friends_have_earned_friends, .badge_friendwithgamecard");
			for (var i = 0; i < els.length; i++)
			{
				var as = els[i].querySelectorAll(".playerAvatar a, a.persona");
				var limit = 1;
				var curLimit = 0;

				for (var j = 0; j < as.length; j++)
				{
					var a = as[j];
					//if (pattProfile.test(a.href))
					{
						var badgeUrl = a.href + urlTail;

						if (els[i].classList.contains("badge_friends_have_earned_friends")
							|| !a.parentNode.classList.contains("playerAvatar"))
						{
							a.href = badgeUrl;
						}

						if (curLimit < limit && els[i].classList.contains("badge_friendwithgamecard"))
						{
							var elActs = els[i].getElementsByClassName("badge_friendwithgamecard_actions");
							if (elActs)
							{
								for (var k = 0; k < elActs.length; k++)
								{
									var eleA = document.createElement("a");
									eleA.classList.add("btn_grey_grey");
									eleA.classList.add("btn_medium");
									eleA.setAttribute("title", "View friend's badge");
									eleA.setAttribute("href", badgeUrl);
									eleA.innerHTML = imgCard;

									elActs[k].appendChild(eleA);

									curLimit += 1;
								} // end for k
							}
						}
					}
				} // end for j
			} // end for i
		}

		// Sort friends
		{
			setTimeout(function()
			{
				var eleSections = document.querySelectorAll(".badge_friendswithgamecards_section");
				for (var i = 0; i < eleSections.length; i++)
				{
					var keyArr = new Array();
					var valArr = new Array();

					var eleFriends = eleSections[i].querySelectorAll(".badge_friendwithgamecard");
					for (var j = 0; j < eleFriends.length; j++)
					{
						var elePersona = eleFriends[j].querySelector(".persona");
						if (elePersona != null)
						{
							var key = "";

							if (elePersona.classList.contains("in-game"))
							{
								key = "01";
							}
							else if (elePersona.classList.contains("online"))
							{
								key = "02";
							}
							else
							{
								key = "03";
							}

							var key = key + "___" + elePersona.textContent.trim().toLowerCase()
								+ "___" + elePersona.getAttribute("data-miniprofile");
							keyArr.push(key);
							valArr[key] = eleFriends[j];
							eleSections[i].removeChild(eleFriends[j]);
						}
					} // end for j

					keyArr.sort();

					for (var j = keyArr.length - 1; j > -1 ; j--)
					{
						eleSections[i].insertBefore(valArr[keyArr[j]], eleSections[i].firstChild);
					} // end for j

				} // end for i
			}, 100);
		}
	}
	function linkBadgeToFriendAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;

		if (patt.test(url) && !isErrorCard())
		{
			attachOnLoad(linkBadgeToFriend);
		}
	}
	if (enableLinkBadgeToFriend) linkBadgeToFriendAttach();

	/** Add button on top of Store page to view Badge page
	*/
	function linkStoreToBadge()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/app\//i;
		var pattEnd = /[^0-9].*$/i;
		var app = url.replace(patt, "").replace(pattEnd, "");

		var aOwner = document.querySelector("#global_actions > .user_avatar");
		var isLoggedIn = aOwner != null;
		var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";
		var isOwned = document.querySelector(".game_area_already_owned") != null;

		var urlCard = "category2=29";
		var titleCard = "Steam Trading Cards";
		var urlDlc = "category1=21";
		var titleDlc = "Downloadable Content";
		var urlAch = "category2=22";
		var titleAch = "Steam Achievement";

		var isBadge = false;
		var isBadgeMap = false;
		var isAch = false;

		var cookieCountry = getCookie("steamCountry");
		if (cookieCountry)
		{
			GM_setValue("storeCountry", cookieCountry.substr(0, 2));
		}
		
		var as = document.querySelectorAll(".game_area_details_specs a");
		for (var i = 0; i < as.length; i++)
		{
			if (appDlcs.indexOf(app) > -1 || as[i].href.indexOf(urlDlc) > -1 || as[i].textContent == titleDlc)
			{
				isBadge = false;
				isAch = false;
				break;
			}
			else if (as[i].href.indexOf(urlCard) > -1 || as[i].textContent == titleCard)
			{
				isBadge = true;
			}
			else if (as[i].href.indexOf(urlAch) > -1 || as[i].textContent == titleAch)
			{
				isAch = true;
			}
		}

		if (appCardMaps[app] != null)
		{
			isBadge = true;
			isBadgeMap = true;
		}
		else if (!isBadge)
		{
			if (appCards.indexOf(app) > -1)
			{
				isBadge = true;
			}
		}

		if (isBadge)
		{
			var appCard = app;
			if (isBadgeMap)
			{
				appCard = appCardMaps[app];
			}

			var divs = document.getElementsByClassName("apphub_OtherSiteInfo");
			for (var i = 0; i < divs.length; i++)
			{
				divs[i].innerHTML = divs[i].innerHTML
					+ " &nbsp;<a class=\"btnv6_blue_hoverfade btn_medium\""
					+ " href=\"" + ownerUrl + "/gamecards/" + appCard + "/\">"
					+ "<span>Trading Cards</span></a>";
			}
		}

		if (false && isAch)
		{
			var urlAchLink = (isLoggedIn && isOwned ? ownerUrl + "/stats/appid/" : "http://steamcommunity.com/stats/")
				+ app + "/achievements/";

			var divCommu = document.querySelector(".communitylink .block_content_inner");
			if (divCommu != null)
			{
				var aAch = ' <a class="linkbar" href="' + urlAchLink + '">'
					+ '<div class="rightblock" style="margin-top: 3px;"><img src="http://cdn4.store.steampowered.com/public/images/ico/ico_achievements.png"'
					+ ' align="top" border="0" style="margin-right: -9px; height: 20px; margin-top: -5px;"></div>'
					+ 'View Steam Achievements</a>';
				divCommu.innerHTML = divCommu.innerHTML + aAch;
			}

			/*var divDemo = document.querySelector("#demo_block > div");
			if (divDemo != null)
			{
				var divAch = '<div class="demo_area_button"><a class="game_area_wishlist_btn" href="'
					+ urlAchLink + '">View Steam Achievements</a></div>';

				divDemo.innerHTML = divAch + divDemo.innerHTML;
			}*/
		}

		var txtRec = document.getElementById("game_recommendation");
		if (txtRec != null)
		{
			// reduce height of review textbox
			txtRec.style.height = "16px";
			txtRec.onfocus = function(){txtRec.style.height="150px";};
		}

		// Move early access zone
		{
			var eleEa = document.querySelector(".early_access_header");
			if (eleEa != null)
			{
				var elePurchase = document.querySelector("#game_area_purchase");
				if (elePurchase != null)
				{
					insertAfterElement(eleEa, elePurchase);
				}
			}
		}

		// Move language zone
		{
			var eleNote = document.querySelector("#purchase_note > .notice_box_content > b");
			if (eleNote != null)
			{
				var elePurchase = document.querySelector("#game_area_purchase");
				if (elePurchase != null)
				{
					/*var elesGame = elePurchase.querySelectorAll(".game_area_purchase_game_wrapper");
					if (elesGame.length > 0)
					{
						insertAfterElement(eleNote.parentElement.parentElement, elesGame[elesGame.length - 1]);
					}
					else*/
					{
						if (elePurchase.lastElementChild.classList.contains("game_area_dlc_section"))
						{
							eleNote.parentElement.parentElement.style.marginTop = "60px";
						}
						insertAfterElement(eleNote.parentElement.parentElement, elePurchase.lastElementChild);
					}
				}
			}
		}

		// Redirect Steam run
		{
			var eleCart = document.querySelector(".btn_addtocart a");
			if (eleCart)
			{
				if (eleCart.href.indexOf("ShowGotSteamModal") > -1)
				{
					eleCart.href = eleCart.href.replace("javascript:ShowGotSteamModal('", "")
						.replace(/\',.*$/i, "").replace("steam://run", "steam://install");
				}
				else if (eleCart.href.indexOf("steam://run") === 0)
				{
					eleCart.href = eleCart.href.replace("steam://run", "steam://install");
				}
			}
		}

		if (!isLoggedIn)
		{
			var eleLoginMain = document.querySelector("a.global_action_link[href*='/login/']");
			var eleLoginQueue = document.querySelector(".queue_actions_ctn a[href*='/login/']");
			if (eleLoginMain != null && eleLoginQueue != null)
			{
				eleLoginMain.setAttribute("href", eleLoginQueue.getAttribute("href"));
			}
		}
	}
	function linkStoreToBadgeAttach(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/(app|sub)\//i;

		if (patt.test(url))
		{
			attachOnReady(function()
			{
				setTimeout(linkStoreToBadge, tm);
			});
		}
	}
	if (enableLinkStoreToBadge) linkStoreToBadgeAttach(1000);

	/** Add button in Forum page to view Badge page
	*   Mark topic to determine visited links
	*/
	function linkForumToBadge()
	{
		var url = document.documentURI;
		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/app\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");

		var aOwner = document.querySelector("#global_actions > a.user_avatar");
		var isLoggedIn = aOwner != null;
		var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";

		var divs = document.getElementsByClassName("apphub_OtherSiteInfo");
		for (var j = 0; j < divs.length; j++)
		{
			var aBadge = " <a class='btn_darkblue_white_innerfade btn_medium' href='"
				+ ownerUrl + "/gamecards/" + app
				+ "/'><span>Trading Cards</span></a> ";
			divs[j].innerHTML = divs[j].innerHTML + aBadge;
		}

		function markTopic()
		{
			var as = document.getElementsByClassName("forum_topic_overlay");
			for (var i = 0; i < as.length; i++)
			{
				// mark topic
				as[i].style.borderLeft = "3px solid";
			}
		}
		markTopic();
		document.addEventListener("DOMNodeInserted", markTopic);
	}
	function linkForumToBadgeTimeout(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/app\/[0-9]+\/tradingforum\//i;

		if (patt.test(url))
		{
			setTimeout(linkForumToBadge, tm);
		}
	}
	if (enableLinkForumToBadge) linkForumToBadgeTimeout(100);

	/** Add buttons in Badge page to view Trading Forum, Store, friend's Inventory and my Badge page
	*/
	function linkBadgeToForum()
	{
		var url = document.documentURI;

		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");

		GM_addStyle
		(
			"   .sbh_badge_menu_right { float: right; margin-left: 5px; } "
			+ " .badge_card_to_collect_links a[href$='/tradingforum/'], .es_visit_tforum { display: none; } "
		);

		var divs = document.getElementsByClassName("gamecards_inventorylink");
		if (divs.length > 0)
		{
			var aStoreUrl = "http://store.steampowered.com/app/" + app + "/";
			var aForumUrl = "http://steamcommunity.com/app/" + app + "/tradingforum/";
			var aCustom = " <a class='btn_grey_grey btn_small_thin sbh_badge_menu_right' href='" + aStoreUrl + "'>"
				+ " <span>Visit Store Page</span></a> "
				+ " <a class='btn_grey_grey btn_small_thin sbh_badge_menu_right' href='" + aForumUrl + "'>"
				+ " <span>Visit Trade Forum</span></a> ";

			divs[0].innerHTML = divs[0].innerHTML + aCustom;
		}

		var aOwner = document.querySelector("#global_actions > a.user_avatar");
		var isLoggedIn = aOwner != null;
		var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";

		var aFriend = document.querySelector(".profile_small_header_name > a");
		var isFriendExist = aFriend != null;
		var friendUrl = isFriendExist ? aFriend.href : "http://steamcommunity.com/my";
		var friendName = isFriendExist ? aFriend.textContent.trim() : "my"
		var friendNameOwner = isFriendExist ? friendName + "'s" : friendName;

		var isOwner = isLoggedIn && ownerUrl == friendUrl;

		if (!isOwner)
		{
			var divInv;
			if (divs.length > 0)
			{
				divInv = divs[0];
			}
			else
			{
				divInv = document.createElement("div");
				divInv.classList.add("gamecards_inventorylink");
				var divBadge = document.querySelector(".badge_detail_tasks");
				if (divBadge != null)
				{
					divBadge.insertBefore(divInv, divBadge.firstChild);
				}
			}
			var aFrInvUrl = friendUrl + "/inventory/#753_6";
			var aOwnUrl = url.replace(pattAppHead, ownerUrl + "/gamecards/");
			divInv.innerHTML = divInv.innerHTML
				+ "<a class='btn_grey_grey btn_small_thin' href='" + aFrInvUrl + "'><span>View cards in "
				+ friendNameOwner + " Inventory</span></a> "
				+ " <a class='btn_grey_grey btn_small_thin' href='" + aOwnUrl + "'><span>View my Progress</span></a> ";

		}
	}
	function linkBadgeToForumAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;

		if (patt.test(url) && !isErrorCard())
		{
			attachOnLoad(linkBadgeToForum);
		}
	}
	if (enableLinkBadgeToForum) linkBadgeToForumAttach();

	/** Add button in Market page to view Badge and Store page
	*/
	function linkMarketToBadge()
	{
		var url = document.documentURI;

		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/753\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var pattNumber = /[0-9]+/;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");

		var aOwner = document.querySelector("#global_actions > a.user_avatar");
		var isLoggedIn = aOwner != null;
		var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";

		GM_addStyle(
			"#market_buynow_dialog_purchase > span:nth-child(1) { line-height: 80px; padding: 0px 50px 0px 50px !important; } "
			+ "#market_buynow_dialog { width: 850px; } "
			+ ".market_listing_table_header { margin: 0px; } "
			+ ".market_listing_row { margin-top: 2px; } "
			+ ".market_listing_row > .market_listing_es_lowest:nth-child(3) { visibility: hidden; } "
			+ ".market_listing_row > .market_listing_es_lowest:nth-child(8) { display: none; } "
			+ ".es_market_lowest_button { display: none; } "
		);

		var div_tabL = document.querySelectorAll("div.market_large_tab_well");
		for (var i = 0; i < div_tabL.length; i++)
		{
			// reduce height of header
			div_tabL[i].style.height = "50px";
		}
		var div_tabLB = document.querySelectorAll("div.market_large_tab_well_gradient");
		for (var i = 0; i < div_tabLB.length; i++)
		{
			div_tabLB[i].style.height = "65px";
		}

		var div_store = document.getElementById("largeiteminfo_game_name");

		if (div_store != null)
		{
			div_store.innerHTML = "<a href='http://store.steampowered.com/app/" + app + "/'>"
				+ div_store.innerHTML + "</a>";
		}

		var isFoil = false;
		var ele_name = document.getElementById("largeiteminfo_item_name");
		if (ele_name != null)
		{
			isFoil = (ele_name.innerHTML.search("Foil") > -1);
			ele_name.innerHTML = "<a href='" + ownerUrl + "/gamecards/" + app
				+ (isFoil ? "/?border=1" : "/") + "'>" + ele_name.innerHTML + "</a>";
		}

		var ele_icon = document.getElementsByClassName("item_desc_game_icon");
		for (var i = 0; i < ele_icon.length; i++)
		{
			ele_icon[i].innerHTML = "<a href='http://store.steampowered.com/app/" + app + "/'>"
				+ ele_icon[i].innerHTML + "</a>";
		}

		var div_nav = document.getElementsByClassName("market_large_tab_well");
		for (var j = 0; j < div_nav.length; j++)
		{
			var aBadge = ' <div class="apphub_OtherSiteInfo" '
				+ 'style="position: relative; float: right; right: 2px; top: 2px;"> '
				+ '<a style="position: relative; z-index: 1;" class="btn_darkblue_white_innerfade btn_medium" '
				+ 'href="#" onclick="document.getElementById(\'pricehistory\').style.display = \'inherit\'; '
				+ 'document.querySelector(\'.pricehistory_zoom_controls\').style.display = \'inherit\'; return false; " >'
				+ '<span>Show History</span></a> &nbsp;'
				+ '<a style="position: relative; z-index: 1;" class="btn_darkblue_white_innerfade btn_medium" '
				+ 'href="http://store.steampowered.com/app/' + app + '"><span>Store Page</span></a> &nbsp;'
				+ '<a class="btn_darkblue_white_innerfade btn_medium" '
				+ 'href="' + ownerUrl + '/gamecards/' + app + (isFoil ? "/?border=1" : "/")
				+ '"><span>Trading Cards</span></a></div>';
			div_nav[j].innerHTML = div_nav[j].innerHTML + aBadge;
			GM_addStyle(
				"#pricehistory, .pricehistory_zoom_controls { display: none } "
			);
		}

		var span_list = document.querySelectorAll("div.market_listing_row > div:nth-child(3) > span:nth-child(1) > span:nth-child(1)");
		for (var i = 0; i < span_list.length; i++)
		{
			if (!pattNumber.test(span_list[i].textContent))
			{
				span_list[i].parentElement.parentElement.parentElement.style.display = "none";
			}
		}

		// preview bg in profile
		{
			if (ownerUrl != "http://steamcommunity.com/my")
			{
				var aImg = document.querySelector("#largeiteminfo_item_actions > a");
				if (aImg != null)
				{
					var img = aImg.href;
					if (/\.jpg$/i.test(img))
					{
						var urlPreview = ownerUrl + "?previewbg=" + img;

						var a = document.createElement("a");
						a.classList.add("btn_small");
						a.classList.add("btn_grey_white_innerfade");
						a.setAttribute("target", "_blank");
						a.href = urlPreview;
						a.innerHTML = '<span>Preview in Profile</span>';
						aImg.parentElement.appendChild(a);
					}
				}
			}
		}
	}
	function linkMarketToBadgeAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/753\/[0-9]+/i;

		if (patt.test(url) && !isErrorMarket())
		{
			attachOnLoad(linkMarketToBadge);
		}
	}
	if (enableLinkMarketToBadge) linkMarketToBadgeAttach();

	/** Add price of each cards in Badge page and link to Market page
	*/
	function linkBadgeToMarket()
	{
		GM_addStyle(
			".div_market_price { float: right; } " // padding-top: 1px; display: inline-block; padding-left: 90px;
			+ ".gamecard_badge_craftbtn_ctn .badge_craft_button { width: 160px !important; } "
		);

		var url = document.documentURI;

		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");
		var isFoil = getQueryByName("border", url) == "1";
		var urlPrice = "http://steamcommunity.com/market/priceoverview/?appid=753&currency=";
		var urlMarket = "http://steamcommunity.com/market/listings/753/";

		var priceCards = new Array();
		var priceUrls = new Array();
		
		var cookieCountry = getCookie("steamCountry");
		if (cookieCountry)
		{
			GM_setValue("storeCountry", cookieCountry.substr(0, 2));
		}

		setTimeout(function (app, isFoil)
		{
			var isCacheExpire = checkCacheExpire(app);
			
			var elesCardName = document.querySelectorAll(".sbh_cardName");
			for (var i = 0; i < elesCardName.length; i++)
			{
				updatePrice(app, isFoil, i);
		
				if (isCacheExpire || !enableCache)
				{
					var currency = marketCountries[GM_getValue("storeCountry", "US")] || "1";
					var urlPriceCur = urlPrice + currency
						+ "&market_hash_name=" 
						+ app + "-" + encodeURIComponent(elesCardName[i].textContent.trim())
						+ (isFoil ? "%20(Foil)" : "") 
						+ "&sbh_appid=" + app
						+ (isFoil ? "&sbh_border=1" : "") 
						+ "&sbh_cardid=" + i
						+ "&sbh_cardnum=" + (elesCardName.length + 1)
						+ "&sbh_expire=" + (isCacheExpire ? 1 : 0);
						
					//console.log(urlPriceCur);
					
					GM_xmlhttpRequest({
						method: "GET",
						url: urlPriceCur,
						onload: getPriceCur,
					});
				}
			}
		}, 100, app, isFoil);

		function getPriceCur(res)
		{
			var urlCur = res.finalUrl;
			try
			{
				var dataRes = JSON.parse(res.responseText);
				
				var isFoil = getQueryByName("sbh_border", urlCur) == "1";
				var curCard = parseInt(getQueryByName("sbh_cardid", urlCur));
				var numCard = parseInt(getQueryByName("sbh_cardnum", urlCur));
				var app = getQueryByName("sbh_appid", urlCur);
				var marketName = getQueryByName("market_hash_name", urlCur);
				var isResolve = getQueryByName("sbh_resolve", urlCur) == "1";
				var indexCard = (isFoil ? 1 : 0) * numCard + curCard;
				var isCacheExpire = getQueryByName("sbh_expire", urlCur) == "1";
				
				//console.log("marketName: " + marketName);
						
				if (dataRes)
				{
					if (!dataRes.success && !isResolve)
					{
						var marketNameNew = marketName;
						if (marketName.indexOf("566020-Mysterious") > -1)
						{
							marketNameNew = marketName.replace("566020-Mysterious", "566020-Mysterious Card");
						}
						else if (marketName.indexOf("639900-Mysterious") > -1)
						{
							marketNameNew = marketName.replace("639900-Mysterious", "639900-Mysterious Card");
						}
						else
						{
							marketNameNew = isFoil ? marketName.replace("(Foil)", "(Foil Trading Card)") 
								: marketName + " (Trading Card)";
						}
						
						//console.log("marketNameNew: " + marketNameNew);
						
						var currency = marketCountries[GM_getValue("storeCountry", "US")] || "1";
						var urlPriceCur = urlPrice + currency 
							+ "&market_hash_name=" + encodeURIComponent(marketNameNew)
							+ "&sbh_appid=" + app
							+ (isFoil ? "&sbh_border=1" : "") 
							+ "&sbh_cardid=" + curCard
							+ "&sbh_cardnum=" + numCard
							+ "&sbh_expire=" + (isCacheExpire ? 1 : 0)
							+ "&sbh_resolve=1";
							
						//console.log(urlPriceCur);
						
						GM_xmlhttpRequest({
							method: "GET",
							url: urlPriceCur,
							onload: getPriceCur,
						});
					}
					else
					{
						var cPrice = dataRes.lowest_price || "0";
						var cUrl = encodeURIComponent(marketName);

						priceCards[indexCard] = cPrice;
						priceUrls[indexCard] = cUrl;
						
						//console.log("getPriceCur: " + indexCard + ", " + cPrice + ", " + cUrl);

						if (enableCache && isCacheExpire)
						{
							setCacheTime(app);
							
							if (cPrice != "0")
							{
								setCachePrice(app, isFoil, curCard, cPrice);
							}
							setCacheUrl(app, isFoil, curCard, cUrl);
						}
					
						if (false)
						{
							var pattNumCard = /Card [0-9]+ of /i;
							var pattMarket = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/753\//i;
							var pattPrice = /(Price: |Last seen: )/i;

							var divTempID = randTempID();
							createDivTemp(divTempID, res.responseText);
							try
							{
								//debug("ID: "+divTempID);
								var divTemp = document.getElementById(divTempID);
								var numCard = 0;
								try
								{
									var spanNumber = divTemp.getElementsByClassName("element-count")[0];
									if (spanNumber == null)
									{
										debug("Warning: can't get price");
										return;
									}
									numCard = parseInt(spanNumber.textContent.replace(pattNumCard, ""));
								}
								catch (e)
								{
									debug("Ex: " + e);
								}

								var offsetCard = isFoil ? numCard : 0;
								var curCard = 0;

								var isCacheExpire = checkCacheExpire(app);

								priceCards = new Array();
								priceUrls = new Array();

								var as = divTemp.getElementsByClassName("button-blue");
								for (var i = 0; i < as.length; i++)
								{
									if (pattMarket.test(as[i].href))
									{
										if (curCard < numCard * 2)
										{
											var cPrice = as[i].textContent.replace(pattPrice, "").trim();
											var cUrl = as[i].href.replace(urlMarket, "");

											var indexCard = curCard - offsetCard;
											if (indexCard >= 0 && indexCard < numCard)
											{
												priceCards[indexCard] = cPrice;
												priceUrls[indexCard] = cUrl;
											}

											// cache
											if (enableCache && isCacheExpire)
											{
												setCacheTime(app);
												if (curCard < numCard)
												{
													setCachePrice(app, false, curCard, cPrice);
													setCacheUrl(app, false, curCard, cUrl);
												}
												else // foil
												{
													setCachePrice(app, true, curCard - numCard, cPrice);
													setCacheUrl(app, true, curCard - numCard, cUrl);
												}
											}

											curCard += 1;
										}
										else
										{
											break;
										}
									}
								}
							}
							catch (e)
							{
								debug("Ex: " + e);
							}
							removeDivTemp(divTempID);
						}
						updatePrice(app, isFoil, curCard);
					}

					//debugTime("getPriceCur");
				}
				else
				{
					debug("getPriceCur: Fail " + urlCur);
					
					var cUrl = encodeURIComponent(marketName);
					priceUrls[indexCard] = cUrl;
						
					if (enableCache && getCacheUrl(app, isFoil, curCard) == 0)
					{
						setCacheUrl(app, isFoil, curCard, cUrl);
					}
					
					updatePrice(app, isFoil, curCard);
				}
			}
			catch (e)
			{
				debug("Ex: " + e + ", URL: " + urlCur);
			}
		}

		function updatePrice(app, isFoil, curCard)
		{
			var pattNum = /[0-9\.]+/;
			var colorUp = "#CC0000";
			var colorDown = "#009900";

			if (enableCache)
			{
				priceCards = new Array();
				priceUrls = new Array();

				var i = curCard;
				if (i < 15)
				//for (var i = 0; i < 15; i++)
				{
					var p = getCachePrice(app, isFoil, i);
					var u = getCacheUrl(app, isFoil, i);
					if (p != 0)
					{
						priceCards[i] = p;
					}
					if (u != 0)
					{
						priceUrls[i] = u;
					}
				}
			}

			var texts = document.getElementsByClassName("badge_card_set_card");
			var numCard = texts.length;
			var priceSet = 0;

			var j = curCard;
			if (j < texts.length)
			//for (var j = 0; j < texts.length; j++)
			{
				var pUrl = priceUrls[j] ? urlMarket + priceUrls[j] : "";
				var pCard = priceCards[j] ? priceCards[j] : "-";
				var pOnClick = priceCards[j] ? "" : " onclick='return false;' ";
				var pDiff = "";
				var pCardOld = "";

				var divTexts = texts[j].querySelectorAll("div.badge_card_set_text");
				var divText = divTexts[divTexts.length - 1];
				var divMarkets = texts[j].getElementsByClassName("div_market_price");
				var divMarket;
				if (divMarkets.length == 0)
				{
					divMarket = document.createElement("div");
					divMarket.classList.add("div_market_price");
					//divMarket.classList.add("badge_card_set_text_qty");
					divText.appendChild(divMarket);

					var divClear = document.createElement("div");
					divClear.style.clear = "right";
					divText.appendChild(divClear);

					divText.style.whiteSpace = "normal";
				}
				else
				{
					divMarket = divMarkets[0];
					var as = divMarket.getElementsByTagName("a");
					if (as.length > 0)
					{
						var pOld = as[0].textContent;
						var pValOld = pOld.match(pattNum);
						if (pValOld != null)
						{
							//debug("oldPrice[" + j + "]: "+ pValOld);

							pCardOld = "title='Cache Price: " + pOld + "'";

							var pVal = pCard.match(pattNum);
							pVal = pVal ? pVal : 0;

							priceSet += parseFloat(pVal);

							var pValDiff = (parseFloat(pVal) - parseFloat(pValOld)).toFixed(2);
							if(pValDiff > 0)
							{
								pDiff = "<span style='cursor: help; color: " + colorUp + ";' "
									+ pCardOld + ">+" + pValDiff + "</span>";
							}
							else if (pValDiff < 0)
							{
								pDiff = "<span style='cursor: help; color: " + colorDown + ";' "
									+ pCardOld + ">" + pValDiff + "</span>";
							}
							else
							{
								pCardOld = "";
							}
						}
					}
				}

				divMarket.innerHTML = pDiff + ' <a href="' + pUrl + '" ' + pOnClick + ' title="Lowest Price">' + pCard + "</a>";
			} // end for

			if (priceSet > 0)
			{
				//debug("priceSet: " + priceSet);
			}
		}
	}
	function linkBadgeToMarket_old()
	{
		GM_addStyle(
			".div_market_price { float: right; } " // padding-top: 1px; display: inline-block; padding-left: 90px;
			+ ".gamecard_badge_craftbtn_ctn .badge_craft_button { width: 160px !important; } "
		);

		var url = document.documentURI;

		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");
		var isFoil = getQueryByName("border", url) == "1";
		var urlExternal = "http://www.steamcardexchange.net/index.php?gamepage-appid-" + app;
		var urlMarket = "http://steamcommunity.com/market/listings/753/";

		var priceCards = new Array();
		var priceUrls = new Array();

		updatePrice();

		var isCacheExpire = checkCacheExpire(app);
		if (isCacheExpire || !enableCache)
		{
			setTimeout(function ()
			{
				GM_xmlhttpRequest({
					method: "GET",
					url: urlExternal,
					onload: getExternalPrice,
				});
			}, 0);
		}

		function getExternalPrice(res)
		{
			try
			{
				var pattNumCard = /Card [0-9]+ of /i;
				var pattMarket = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/753\//i;
				var pattPrice = /(Price: |Last seen: )/i;

				var aOwner = document.querySelector("#global_actions > a.user_avatar");
				var isLoggedIn = aOwner != null;
				var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";

				var aFriend = document.querySelector(".profile_small_header_name > a");
				var isFriendExist = aFriend != null;
				var friendUrl = isFriendExist ? aFriend.href : "http://steamcommunity.com/my";
				var friendName = isFriendExist ? aFriend.textContent.trim() : "my"
				var friendNameOwner = isFriendExist ? friendName + "'s" : friendName;

				var isOwner = isLoggedIn && ownerUrl == friendUrl;

				var divTempID = randTempID();
				createDivTemp(divTempID, res.responseText);
				try
				{
					//debug("ID: "+divTempID);
					var divTemp = document.getElementById(divTempID);
					var numCard = 0;
					try
					{
						var spanNumber = divTemp.getElementsByClassName("element-count")[0];
						if (spanNumber == null)
						{
							debug("Warning: can't get price");
							return;
						}
						numCard = parseInt(spanNumber.textContent.replace(pattNumCard, ""));
					}
					catch (e)
					{
						debug("Ex: " + e);
					}

					var offsetCard = isFoil ? numCard : 0;
					var curCard = 0;

					var isCacheExpire = checkCacheExpire(app);

					priceCards = new Array();
					priceUrls = new Array();

					var as = divTemp.getElementsByClassName("button-blue");
					for (var i = 0; i < as.length; i++)
					{
						if (pattMarket.test(as[i].href))
						{
							if (curCard < numCard * 2)
							{
								var cPrice = as[i].textContent.replace(pattPrice, "").trim();
								var cUrl = as[i].href.replace(urlMarket, "");

								var indexCard = curCard - offsetCard;
								if (indexCard >= 0 && indexCard < numCard)
								{
									priceCards[indexCard] = cPrice;
									priceUrls[indexCard] = cUrl;
								}

								// cache
								if (enableCache && isCacheExpire)
								{
									setCacheTime(app);
									if (curCard < numCard)
									{
										setCachePrice(app, false, curCard, cPrice);
										setCacheUrl(app, false, curCard, cUrl);
									}
									else // foil
									{
										setCachePrice(app, true, curCard - numCard, cPrice);
										setCacheUrl(app, true, curCard - numCard, cUrl);
									}
								}

								curCard += 1;
							}
							else
							{
								break;
							}
						}
					}
				}
				catch (e)
				{
					debug("Ex: " + e);
				}
				removeDivTemp(divTempID);

				updatePrice();

				debugTime("getExternalPrice");
			}
			catch (e)
			{
				debug("Ex: " + e);
			}
		}

		function updatePrice()
		{
			var pattNum = /[0-9\.]+/;
			var colorUp = "#CC0000";
			var colorDown = "#009900";

			if (enableCache)
			{
				priceCards = new Array();
				priceUrls = new Array();

				for (var i = 0; i < 15; i++)
				{
					var p = getCachePrice(app, isFoil, i);
					var u = getCacheUrl(app, isFoil, i);
					if (p != 0 && u != 0)
					{
						priceCards[i] = p;
						priceUrls[i] = u;
					}
					else
					{
						break;
					}
				}
			}

			var texts = document.getElementsByClassName("badge_card_set_card");
			var numCard = texts.length;
			var priceSet = 0;

			for (var j = 0; j < texts.length; j++)
			{
				var pUrl = priceUrls[j] ? urlMarket + priceUrls[j] : "";
				var pCard = priceCards[j] ? priceCards[j] : "-";
				var pOnClick = priceCards[j] ? "" : " onclick='return false;' ";
				var pDiff = "";
				var pCardOld = "";

				var divTexts = texts[j].querySelectorAll("div.badge_card_set_text");
				var divText = divTexts[divTexts.length - 1];
				var divMarkets = texts[j].getElementsByClassName("div_market_price");
				var divMarket;
				if (divMarkets.length == 0)
				{
					divMarket = document.createElement("div");
					divMarket.classList.add("div_market_price");
					//divMarket.classList.add("badge_card_set_text_qty");
					divText.appendChild(divMarket);

					var divClear = document.createElement("div");
					divClear.style.clear = "right";
					divText.appendChild(divClear);

					divText.style.whiteSpace = "normal";
				}
				else
				{
					divMarket = divMarkets[0];
					var as = divMarket.getElementsByTagName("a");
					if (as.length > 0)
					{
						var pOld = as[0].textContent;
						var pValOld = pOld.match(pattNum);
						if (pValOld != null)
						{
							//debug("oldPrice[" + j + "]: "+ pValOld);

							pCardOld = "title='Cache Price: " + pOld + "'";

							var pVal = pCard.match(pattNum);
							pVal = pVal ? pVal : 0;

							priceSet += parseFloat(pVal);

							var pValDiff = (parseFloat(pVal) - parseFloat(pValOld)).toFixed(2);
							if(pValDiff > 0)
							{
								pDiff = "<span style='cursor: help; color: " + colorUp + ";' "
									+ pCardOld + ">+" + pValDiff + "</span>";
							}
							else if (pValDiff < 0)
							{
								pDiff = "<span style='cursor: help; color: " + colorDown + ";' "
									+ pCardOld + ">" + pValDiff + "</span>";
							}
							else
							{
								pCardOld = "";
							}
						}
					}
				}

				divMarket.innerHTML = pDiff + " <a href='" + pUrl + "' " + pOnClick + " title='Lowest Price'>" + pCard + "</a>";
			} // end for

			if (priceSet > 0)
			{
				debug("priceSet: " + priceSet);
			}
		}
	}
	function linkBadgeToMarketAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;

		if (patt.test(url) && !isErrorCard())
		{
			attachOnReady(linkBadgeToMarket);
		}
	}
	if (enableLinkBadgeToMarket) linkBadgeToMarketAttach();

	/** Compare my cards and friend's cards in Badge page
	*   Mark color of my cards count (Green) and friend's cards count (Blue)
	*/
	function compareBadge()
	{
		var url = document.documentURI;

		var pattAppHead = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\//i;
		var pattAppTail = /[^0-9]+.*/i;
		var app = url.replace(pattAppHead, "").replace(pattAppTail, "");

		{
			try
			{
				var pattNumCard = /Card [0-9]+ of /i;
				var pattMarket = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/753\//i;
				var pattPrice = /Price: /i;

				var isFoil = url.indexOf("border=1") > -1;

				var aOwner = document.querySelector("#global_actions > a.user_avatar");
				var isLoggedIn = aOwner != null;
				var ownerUrl = isLoggedIn ? aOwner.href.substr(0, aOwner.href.length - 1) : "http://steamcommunity.com/my";

				var aFriend = document.querySelector(".profile_small_header_name > a");
				var isFriendExist = aFriend != null;
				var friendUrl = isFriendExist ? aFriend.href : "http://steamcommunity.com/my";
				var friendName = isFriendExist ? aFriend.textContent.trim() : "my"
				var friendNameOwner = isFriendExist ? friendName + "'s" : friendName;

				var isOwner = isLoggedIn && ownerUrl == friendUrl;

				//debug("ownerUrl: "+ownerUrl);
				//debug("friendUrl: "+friendUrl);

				var texts = document.getElementsByClassName("badge_card_set_card");
				var numCard = texts.length;

				//debug("isOwner: "+isOwner);
				//debug("numCard: "+numCard);

				for (var j = 0; j < numCard; j++)
				{
					var divQty = texts[j].querySelector("div.badge_card_set_text_qty");
					var numQty = "(0)";
					if (divQty != null)
					{
						numQty = divQty.textContent.trim();
					}
					else
					{
						divQty = document.createElement("div");
						divQty.classList.add("badge_card_set_text_qty");
						divQty.innerHTML = numQty;

						var divCtn = texts[j].querySelector("div.game_card_ctn");
						if (divCtn != null)
						{
							var divTexts = texts[j].querySelectorAll("div.badge_card_set_text");
							if (divTexts.length < 2)
							{
								texts[j].insertBefore(divQty, divCtn.nextSibling);
							}
							else
							{
								divTexts[0].insertBefore(divQty, divTexts[0].firstChild);
							}
						}
					}
					//debug("numQty: "+numQty);
				} // end for

				var colorOwner = "#8CBE0F";
				var colorFriend = "#5491CF";
				var colorZeroOwner = "#557309";
				var colorZeroFriend = "#355C82";

				var countCardAll = 0;

				var divQtys = document.querySelectorAll("div.badge_card_set_text_qty");
				for (var k = 0; k < divQtys.length; k++)
				{
					var num = divQtys[k].textContent.trim().replace(/[\(\)]/gi, "");
					countCardAll += parseInt(num);

					divQtys[k].innerHTML = "";

					var spanNum = document.createElement("span");
					spanNum.classList.add("span_card_qty");
					spanNum.style.cursor = "help";
					spanNum.innerHTML = " (" + num + ") ";
					divQtys[k].insertBefore(spanNum, null);

					if (isOwner)
					{
						spanNum.classList.add("span_card_qty_owner");
						spanNum.style.color = num > "0"  ? colorOwner : colorZeroOwner;
						spanNum.title = "My cards: " + num;
					}
					else
					{
						spanNum.classList.add("span_card_qty_friend");
						spanNum.style.color = num > "0"  ? colorFriend : colorZeroFriend;
						spanNum.title = friendNameOwner + " cards: " + num;
					}
				}

				debug("countCard: " + countCardAll);
				debug("maxSet: " + parseInt(countCardAll / numCard));

				if (!isOwner)
				{
					var pattProfile = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]*/i;
					var urlExternal = url.replace(pattProfile, ownerUrl);
					//debug("urlExternal: "+urlExternal);

					setTimeout(function ()
					{
						GM_xmlhttpRequest({
							method: "GET",
							url: urlExternal,
							onload: compareCard,
						});
					}, 0);

					function compareCard(res)
					{
						var divTempID = randTempID();
						createDivTemp(divTempID, res.responseText);
						try
						{
							//debug("ID: "+divTempID);
							var divTemp = document.getElementById(divTempID);

							var owner_texts = divTemp.getElementsByClassName("badge_card_set_card");
							var owner_numCard = owner_texts.length;

							if (numCard == owner_numCard)
							{
								var owner_numQtys = new Array();

								for (var i = 0; i < owner_texts.length; i++)
								{
									var owner_divQty = owner_texts[i].querySelector("div.badge_card_set_text_qty");
									if (owner_divQty != null)
									{
										owner_numQtys[i] = owner_divQty.textContent.trim().replace(/[\(\)]/gi, "");
									}
									else
									{
										owner_numQtys[i] = "0";
									}
									//debug("owner_numQtys[i]: "+owner_numQtys[i]);
								} // end for

								var friend_divQtys = document.querySelectorAll("div.badge_card_set_text_qty");
								for (var k = 0; k < friend_divQtys.length; k++)
								{
									var owner_spanNum = friend_divQtys[k].querySelector("span_card_qty_owner");
									if (owner_spanNum == null)
									{
										owner_spanNum = document.createElement("span");
										owner_spanNum.classList.add("span_card_qty");
										owner_spanNum.style.cursor = "help";
										owner_spanNum.classList.add("span_card_qty_owner");
										owner_spanNum.style.color = owner_numQtys[k] > "0"  ? colorOwner : colorZeroOwner;
										owner_spanNum.title = "My cards: " + owner_numQtys[k];
										friend_divQtys[k].insertBefore(owner_spanNum, friend_divQtys[k].firstChild);
									}
									owner_spanNum.innerHTML = " (" + owner_numQtys[k] + ") ";
								}
							}
						}
						catch (e)
						{
							debug("Ex: " + e);
						}
						removeDivTemp(divTempID);
						debugTime("compareBadge");
					}
				}
			}
			catch (e)
			{
				debug("Ex: " + e);
			}
		}

		// Add clickable card name
		{
			GM_addStyle(
				"   .sbh_cardName { color: #999; max-width: 170px; text-overflow: ellipsis; "
				+ "   overflow: hidden; /*display: inline-block;*/ white-space: nowrap;} "
			);

			var eleTexts = document.querySelectorAll(".badge_card_set_card");
			for (var i = 0; i < eleTexts.length; i++)
			{
				var eleText = eleTexts[i].querySelector(".badge_card_set_text");
				for (var j = 0; j < eleText.childNodes.length; j++)
				{
					if (eleText.childNodes[j].nodeName == "#text")
					{
						var text = eleText.childNodes[j].textContent.trim();
						if (text != "")
						{
							var eleSpan = document.createElement("div");
							eleSpan.classList.add("sbh_cardName");
							eleSpan.textContent = text;
							eleText.replaceChild(eleSpan, eleText.childNodes[j]);

							eleSpan.addEventListener("click", function (e)
							{
								var ele = e.target;
								clickToSelect(ele);
							});

							j = eleText.childNodes.length;
						}
					}
				}
			}
		}
	}
	function compareBadgeAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/gamecards\/[0-9]+/i;

		if (patt.test(url) && !isErrorCard())
		{
			attachOnReady(compareBadge);
		}
	}
	if (enableCompareBadge) compareBadgeAttach();

	/** Link items in inventory to store and badge page
	*/
	function linkInventoryToBadge()
	{
		if (isError())
			return;

		GM_addStyle
		(
			" .view_inventory_page .item.activeInfo "
				+ "{ background-image: none !important; background-color: #9B9B9B !important; border: 1px solid #C9C9C9; } "
			+ " .descriptor { max-height: 100px; overflow-y: auto; } "
			+ " .inventory_iteminfo .item_desc_content { padding-top: 225px !important; padding-bottom: 0px !important; }"
			+ " #pricehistory_notavailable { display: none !important; }"
		);
		
		if (getQueryByName("modal") == "1")
		{
			GM_addStyle
			(
				" .inventory_page_left { padding-bottom: 400px; } "
				+ " .descriptor, .item_scrap_actions { display: none; } "
				+ " #market_sell_dialog_accept > span { line-height: 30px; } "
				+ " #market_sell_dialog_confirm_buttons > .market_dialog_bottom_buttons { margin-top: 110px; } "
				+ " #market_sell_dialog_ok { min-width: 150px; } "
			);
		}
	}
	function linkInventoryToBadgeAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/inventory/i;

		if (patt.test(url))
		{
			attachOnLoad(linkInventoryToBadge);
		}
	}
	if (enableLinkInventoryToBadge) linkInventoryToBadgeAttach();

	function editTitle()
	{
		var url = document.documentURI;
		try
		{
			var titleOld = document.title;
			var titleNew = titleOld;
			var titleNoti = "";
			var pattSale = /[0-9]+%/i;
			var intervalTitle = null;

			if (enableSwapTitle)
			{
				var splitSpace = titleOld.split(" ");
				if (splitSpace.length > 1)
				{
					if (pattSale.test(splitSpace[1]))
					{
						splitSpace.splice(0, 1);
						splitSpace.splice(1, 1);
						titleOld = splitSpace.join(" ");
					}
				}
				var split = titleOld.split("::").reverse();
				for (var i = 0; i < split.length; i++)
				{
					split[i] = split[i].trim();
				}
				if (url.indexOf("steamcommunity.com/market/listings/") > -1)
				{
					var posApp = split[0].search(/\d/);
					if (posApp > -1)
					{
						split[0] = split[0].substr(posApp);
					}
					var posSub = split[0].indexOf("-");
					if (posSub > 0)
					{
						split[0] = split[0].substr(posSub + 1) + " - " + split[0].substr(0, posSub);
					}
				}
				titleNew = split.join(" :: ");
				document.title = titleNew;
			}

			var divH = document.querySelector("#header_notification_area");
			if (divH != null)
			{
				divH.addEventListener('mouseover', function() {
					clearInterval(intervalTitle);
					document.title = titleNew;
				});
			}

			if (enableShowTitleNoti)
			{
				function updateTitleNoti()
				{
					var noti = document.querySelector("#header_notification_link");
					if (noti != null)
					{
						var notiNum = noti.textContent.trim();
						if (notiNum != "" && notiNum != "0")
						{
							//debug("updateTitleNoti: "+notiNum);
							titleNoti = "("+notiNum+") ";
						}
						else
						{
							titleNoti = "";
						}
						if (document.title != titleNoti + titleNew)
						{
							//debug("changeTitle: "+notiNum);
							document.title = titleNoti + titleNew;
						}
					}
				}

				intervalTitle = setInterval(updateTitleNoti, 1000);

				{
					/*
					var timeoutID = -1;

					noti.addEventListener("DOMSubtreeModified", function (e) {
						debug("DOMSubtreeModified");
						try
						{
							clearTimeout(timeoutID);
						}
						catch (ex)
						{
						}
						updateTitleNoti();
					});

					noti.addEventListener("DOMNodeInserted", function (e) {
						debug("DOMNodeInserted");
						try
						{
							clearTimeout(timeoutID);
						}
						catch (ex)
						{
						}
						updateTitleNoti();
					});

					noti.addEventListener("DOMNodeRemoved", function (e) {
						debug("DOMNodeRemoved");
						timeoutID = setTimeout(updateTitleNoti,100);
					});
					*/
				}
			}
		}
		catch (ex)
		{
			debug("editTitle: "+ex);
		}
	}
	function editTitleAttach()
	{
		attachOnReady(editTitle);
	}
	if (enableSwapTitle || enableShowTitleNoti) editTitleAttach();

	/** Resize trade window that is larger than 768px
	*/
	function resizeTradeWindow()
	{
		if (window.innerHeight < 800)
		{
			//GM_addStyle("#mainContent { transform: scale(0.8, 0.8); transform-origin: 50% 0px 0px; }");

			if (window.innerWidth > 1000)
			{
				//window.resizeBy(-240,0);
				//window.moveBy(200,0);
			}
		}

		var ele = document.querySelector("#trade_escrow_header, .trade_partner_info_block");
		if (ele != null)
		{
			ele.scrollIntoView();
		}

		// Fix blank box in Firefox
		{
			setInterval(function ()
			{
				if (isVisible())
				{
					var ele = document.querySelector("#inventory_displaycontrols");
					if (ele != null)
					{
						if (ele.offsetHeight > 200)
						{
							if (ele.style.float != "left")
							{
								ele.style.float = "left";
							}
						}
						else
						{
							if (ele.style.float != "")
							{
								ele.style.float = "";
							}
						}
					}
				}
			}, 1000);
		}
		
		// Use arrow keys to change page
		{
			document.body.addEventListener("keydown", function (e)
			{
				var query = "";
				
				if (e.keyCode != undefined)
				{
					if (e.keyCode === 37)	// Left
					{
						query = "#pagebtn_previous";
					}
					else if (e.keyCode === 39)	// Right
					{
						query = "#pagebtn_next";
					}
				}
				
				if (query !== "")
				{
					var eleTarget = document.querySelector(query);
					if (eleTarget)
					{
						e.preventDefault();
						eleTarget.click();
						return false;
					}
				}
			}, true);
		}
	}
	function resizeTradeWindowAttach(tm)
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(tradeoffer|trade)\//i;

		if (patt.test(url))
		{
			attachOnLoad(function ()
			{
				setTimeout(resizeTradeWindow, tm);
			});
		}
	}
	if (enableResizeTradeWindow) resizeTradeWindowAttach(100);

	/** Add link in profile page
	*/
	function linkProfile()
	{
		GM_addStyle(".achievement_progress_bar_ctn { width: 118px; margin-left: 4px; } "
			+ ".showcase_stat .value { z-index: 2; position: relative; } ");

		var aOwner = document.querySelector("#global_actions > a.user_avatar");
		var isLoggedIn = aOwner != null;
		
		var url = document.documentURI;
		var urlOwner = url;

		if (urlOwner[urlOwner.length-1] != "/")
		{
			urlOwner = urlOwner + "/";
		}

		var urlName = urlOwner + "namehistory/";
		var urlPost = urlOwner + "posthistory/";
		var labelName = "Name History";
		var labelPost = "Post History";
		var arrUrl = ["", urlName, urlPost];
		var arrLbl = ["", labelName, labelPost];

		var divOuter = document.querySelector(".profile_item_links");
		if (divOuter != null)
		{
			for (var i = 0; i < arrUrl.length; i++)
			{
				var div = document.createElement("div");
				if (div != null)
				{
					div.className = "profile_count_link";
					div.innerHTML = '<a href="' + arrUrl[i] + '"><span class="count_link_label">'
						+ arrLbl[i] + '</span> <span class="profile_count_link_total"> </span></a>';

					divOuter.appendChild(div);
				}
			}
		}

		// preview bg in profile
		function previewBg()
		{
			var bg = getQueryByName("previewbg");
			if (bg != "")
			{
				var divBg = document.querySelector("div.has_profile_background");
				if (divBg != null)
				{
					divBg.style.backgroundImage = "url('" + bg + "')";
				}

				var divBgIn = document.querySelector("div.profile_background_image_content");
				if (divBgIn != null)
				{
					divBgIn.style.backgroundImage = "url('" + bg + "')";
				}
			}
		}
		attachOnLoad(previewBg);
		
		// Focus profile
		if (isLoggedIn)
		{
			var eleTarget = document.querySelector(".no_header");
			if (eleTarget != null)
			{
				eleTarget.scrollIntoView();
			}
		}
	}
	function linkProfileReady()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+(\/?\?.*)?\/?$/i;

		if (patt.test(url))
		{
			attachOnReady(linkProfile);
		}
	}
	if (enableLinkProfile) linkProfileReady();

	/** Set all checkbox to checked
	*/
	function setAllCheckBox()
	{
		var eles = document.querySelectorAll("#market_buynow_dialog_accept_ssa"
			+ ", #market_sell_dialog_accept_ssa, #accept_ssa, #verify_country_only, #market_buyorder_dialog_accept_ssa");
		for (var i = 0; i < eles.length; i++)
		{
			eles[i].checked = true;
		}
	}
	function setAllCheckBoxReady()
	{
		var url = document.documentURI;
		var pattMarket = /^http[s]?:\/\/steamcommunity.com\/market\/listings\/[0-9]+/i;
		var pattInv = /^http[s]?:\/\/steamcommunity.com\/(id|profiles)\/[^\/]+\/inventory/i;
		var pattCart = /^http[s]?:\/\/store.steampowered.com\/checkout/i;

		if (pattMarket.test(url) || pattInv.test(url) || pattCart.test(url))
		{
			attachOnReady(setAllCheckBox);
		}
	}
	if (enableSetAllCheckBox) setAllCheckBoxReady();

	/** Scroll store page to easy view
	*/
	function storeFocus()
	{
		// Store focus
		{
			var eleAccount = document.querySelector("#account_pulldown");
			if (eleAccount != null)
			{
				var divHead = document.querySelector(".breadcrumbs > .blockbg, "
					+ " .breadcrumbs > a, div.auction_block:nth-child(1), .market_listing_nav > a");
				if (divHead != null)
				{
					divHead.scrollIntoView();
				}
			}
		}

		// Click to select app name
		{
			var eleName = document.querySelector(".apphub_AppName, .pageheader");
			if (eleName != null)
			{
				eleName.addEventListener("click", function (e)
				{
					var ele = e.target;
					clickToSelect(ele);
				});
			}
		}
	}
	function storeFocusAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/(store.steampowered.com\/(app|sub|bundle)\/|steamcommunity.com\/(auction\/item\/|sharedfiles\/filedetails\/\?id=|market\/listings\/))/i;

		if (patt.test(url))
		{
			attachOnReady(storeFocus);
		}
	}
	if (enableStoreFocus) storeFocusAttach();

	function autoExploreQueue()
	{
		var url = document.documentURI;
		var pattApp = /^http[s]?:\/\/store.steampowered.com\/app/i;
		var pattExplore = /^http[s]?:\/\/store.steampowered.com\/\/?explore/i;

		// Auto explore queue in app
		if (pattApp.test(url))
		{
			GM_addStyle(
				" .sbh_autoQueueOption { float: right; padding-right: 3px; } "
				+ " #sbh_autoQueue { vertical-align: text-top; } "
			);

			// Clean url in next queue
			{
				var eleQueue = document.querySelector("#next_in_queue_form");
				if (eleQueue != null)
				{
					var action = eleQueue.getAttribute("action");
					if (action[action.length] != "/")
					{
						action += "/";
						eleQueue.setAttribute("action", action);
					}
				}
			}
				
			function autoQueue()
			{
				var tm = 3000;
				debug("AutoQueue: Next in " + tm + "ms");
				setTimeout(function ()
				{
					var eleCheck = document.querySelector("#sbh_autoQueue");
					if (eleCheck != null && eleCheck.checked)
					{
						var ele = document.querySelector(".btn_next_in_queue");
						if (ele != null)
						{
							GM_setValue("storeAutoQueueLast", getUnixTimestamp());
							ele.click();
						}
					}
				}, tm);
			}

			var eleDes = document.querySelector(".queue_controls_description");
			if (eleDes != null)
			{
				var eleSpan = document.createElement("span");
				eleSpan.classList.add("sbh_autoQueueOption");

				var eleInput = document.createElement("input");
				eleInput.id = "sbh_autoQueue";
				eleInput.setAttribute("type", "checkbox");
				eleInput.setAttribute("value", "auto");

				if (GM_getValue("storeAutoQueue", 0) == "true")
				{
					eleInput.checked = true;

					var ele = document.querySelector(".btn_next_in_queue");
					if (ele != null)
					{
						autoQueue();
					}
				}

				eleInput.addEventListener("click", function (e)
				{
					var ele = e.target;
					if (ele.checked)
					{
						GM_setValue("storeAutoQueue", "true");
						autoQueue();
					}
					else
					{
						GM_setValue("storeAutoQueue", "false");
					}
				});

				var eleLabel = document.createElement("label");
				eleLabel.setAttribute("for", "sbh_autoQueue");
				eleLabel.textContent = " Auto Explore Queue";

				eleSpan.appendChild(eleInput);
				eleSpan.appendChild(eleLabel);
				eleDes.appendChild(eleSpan);
			}
			else
			{
				// Session lost
				
				if (GM_getValue("storeAutoQueue", 0) == "true")
				{
					var aOwner = document.querySelector("#global_actions > .user_avatar");
					var isLoggedIn = aOwner != null;
					
					if (!isLoggedIn)
					{
						// Auto reload every 10s within 2 minutes
						var tmExpireShort = 120;
						var tmReloadShort = 10000;
						
						// Auto reload every 30s within 10 minutes
						var tmExpireLong = 600;
						var tmReloadLong = 30000;
						
						var tmReload = 0;
						
						var tmDiff = getUnixTimestamp() - GM_getValue("storeAutoQueueLast", 0);
						if (tmDiff < tmExpireShort)
						{
							tmReload = tmReloadShort;
						}
						else if (tmDiff < tmReloadLong)
						{
							tmReload = tmExpireLong;
						}
						
						if (tmReload > 0)
						{
							debug("AutoQueue: Refresh in " + tmReload + "ms");
							setTimeout(reload, tmReload);
						}
					}
				}
			}
		}

		// Auto explore queue in explore
		if (pattExplore.test(url))
		{
			if (GM_getValue("storeAutoQueue", 0) == "true")
			{
				var eleText = document.querySelector(".subtext");
				if (eleText != null && /[^-][0-9]/.test(eleText.textContent.trim()))
				{
					setTimeout(function ()
					{
						var ele = document.querySelector("#discovery_queue_start_link");
						if (!ele || ele.parentElement.style.display === "none")
						{
							ele = document.querySelector("#refresh_queue_btn");
						}
						if (ele)
						{
							ele.click();
						}
					}, 3000);
					
					setTimeout(function ()
					{
						var ele = document.querySelector(".newmodal_buttons > .btn_medium");
						if (ele)
						{
							ele.click();
							
							debug("AutoQueue: Refresh in " + 1000 + "ms");
							setTimeout(reload, 1000);
						}
					}, 10000);
					
					setTimeout(function ()
					{
						var ele = document.querySelector(".newmodal_buttons > .btn_medium");
						if (ele)
						{
							ele.click();
							
							debug("AutoQueue: Refresh in " + 1000 + "ms");
							setTimeout(reload, 1000);
						}
					}, 20000);
				}
			}

		}
	}
	function autoExploreQueueAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/\/?(app|explore)/i;

		if (patt.test(url))
		{
			// Fix for slow connection
			var didAutoExploreQueue = false;
			var attemptAutoExploreQueue = 0;
			var tmAutoExploreQueue = setInterval(function()
			{
				//console.log("AutoQueue: Slow connection");
				didAutoExploreQueue = true;
				autoExploreQueue();
				if (document.querySelector("#sbh_autoQueue") != null)
				{
					clearInterval(tmAutoExploreQueue);
				}
				else
				{
					if (attemptAutoExploreQueue > 10)
					{
						console.log("AutoQueue: Auto refresh from slow connection");
						reload();
					}
					attemptAutoExploreQueue++;
				}
			}, 5000);
			attachOnReady(function()
			{
				if (!didAutoExploreQueue || document.querySelector("#sbh_autoQueue") == null)
				{
					clearInterval(tmAutoExploreQueue);
					autoExploreQueue();
				}
			});
		}
	}
	if (enableAutoExploreQueue) autoExploreQueueAttach();

	function skipAgeCheck()
	{
		setTimeout(function ()
		{
			var ele = document.querySelector(".btns.agegate_text_container > a, #age_gate_btn_continue");
			if (ele != null)
			{
				ele.setAttribute("onclick", ele.getAttribute("onclick") + "; return false;");
				ele.click();
			}
			
			var eleAge = document.querySelector("#ageYear option[selected]");
			if (eleAge != null)
			{
				eleAge.removeAttribute("selected");
				
				var eleAgeFirst = document.querySelector("#ageYear option");
				eleAgeFirst.setAttribute("selected", "true");
				
				var eleBtn = document.querySelector(".btn_small[onclick^='DoAgeGateSubmit()']");
				if (eleBtn != null)
				{
					eleBtn.click();
				}
			}
			
		}, 3000);
	}
	function skipAgeCheckAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/(store\.steampowered\.com\/(app\/[0-9]+\/agecheck|agecheck\/app\/[0-9]+)|steamcommunity\.com\/app\/)/i;

		if (patt.test(url))
		{
			attachOnReady(skipAgeCheck);
		}
	}
	if (enableSkipAgeCheck) skipAgeCheckAttach();

	function skipLinkFilter()
	{
		setTimeout(function ()
		{
			var ele = document.querySelector("#proceedButton");
			if (ele != null)
			{
				ele.click();
			}
		}, 3000);
	}
	function skipLinkFilterAttach()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/linkfilter\//i;

		if (patt.test(url))
		{
			attachOnReady(skipLinkFilter);
		}
	}
	if (enableSkipLinkFilter) skipLinkFilterAttach();

	/** Hide queue in already owned in store page
	*/
	function storeHideSection()
	{
		var divOwn = document.querySelector(".already_owned_actions");
		if (divOwn)
		{
			GM_addStyle(
				".game_area_already_owned { margin-top: 10px !important; } "
				+ ".queue_ctn { display: none; } "
				+ "#review_container, .reviewPostedDescription, .review_box > .thumb { display: none; } "
				+ ".sbh_margin_left { margin-left: 5px; } "
				+ ".game_area_play_stats { min-height: 50px; } "
				+ "#review_container { margin-top: 30px; } "
				+ ".game_area_already_owned_btn a[href='http://store.steampowered.com/about/'] { display: none; } "
			);

			var html = ""

			html += ' <a class="btnv6_blue_hoverfade  btn_medium  right sbh_margin_left sbh_showFollow" onclick="'
				+ "var sbhQueue = document.querySelector('.queue_ctn');"
				+ "if (sbhQueue != null) { sbhQueue.style.display = 'inherit'; sbhQueue = null;} "
				+ "this.style.display = 'none'; return false;"
				+ '"><span>Follow</span></a> ';

			var divReview = document.querySelector("#review_container, .reviewPostedDescription");
			if (divReview != null)
			{
				html += ' <a class="btnv6_blue_hoverfade  btn_medium  right sbh_margin_left" onclick="'
					+ "var sbhReview = document.querySelector('#review_container, .reviewPostedDescription'); "
					+ "if (sbhReview != null) { sbhReview.style.display = 'inherit'; sbhReview = null; } "
					+ "var sbhReviewThumb = document.querySelector('.review_box > .thumb'); "
					+ "if (sbhReviewThumb != null) { sbhReviewThumb.style.display = 'inherit'; sbhReviewThumb = null; } "
					+ "this.style.display = 'none'; return false;"
					+ '"><span>Review</span></a> ';
			}

			divOwn.innerHTML += html;
			
			setTimeout(function()
			{
				var eleQueue = document.querySelector(".queue_ctn");
				if (eleQueue)
				{
					var eleIgnore = eleQueue.querySelector(".queue_btn_ignore .queue_btn_inactive:first-child");
					if (eleIgnore)
					{
						if (eleIgnore.style.display === "none")
						{
							eleQueue.style.display = 'inherit';
							var eleFollow = document.querySelector(".sbh_showFollow");
							if (eleFollow)
							{
								eleFollow.style.display = 'none';
							}
						}
					}
				}
			}, 500);
		}
	}
	function storeHideSectionReady()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/app\//i;

		if (patt.test(url))
		{
			attachOnReady(storeHideSection);
		}
	}
	if (enableStoreHideSection) storeHideSectionReady();

	/** Move sale section in main page
	*/
	function moveSale()
	{
		var eleSpecial = document.querySelector(".home_page_content.special_offers");
		if (eleSpecial)
		{			
			var eleFeature = document.querySelector(".home_cluster_ctn.home_ctn");
			if (eleFeature)
			{
				var eleMarketing = document.querySelector(".home_ctn.marketingmessage_area");
				if (eleMarketing)
				{
					insertBeforeElement(eleMarketing, eleFeature.firstElementChild);
				}
				insertBeforeElement(eleSpecial, eleFeature.firstElementChild);
			}
		}
	}
	function moveSaleReady()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/($|\?)/i;

		if (patt.test(url))
		{
			attachOnReady(moveSale);
		}
	}
	if (enableMoveSale) moveSaleReady();

	/** Move sale section in main page
	*/
	function redirectToLogin()
	{
		var url = document.documentURI;
		var aOwner = document.querySelector("#global_actions > a.user_avatar");
		var isLoggedIn = aOwner != null;
		
		if (!isLoggedIn)
		{
			if (url.indexOf("/login/") > -1)
			{
				var eleRemember = document.querySelector("#remember_login");
				if (eleRemember)
				{
					eleRemember.checked = true;
				}
			}
			else
			{
				window.location = "https://steamcommunity.com/login/home/?goto=";
			}
		}
	}
	function redirectToLoginReady()
	{
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/steamcommunity.com\/(login\/home\/\?goto=)?$/i;

		if (patt.test(url))
		{
			attachOnReady(redirectToLogin);
		}
	}
	if (enableRedirectToLogin) redirectToLoginReady();

	// ===== End Main =====

	attachOnReady(function()
	{
		debugTime("ready");
		
		var url = document.documentURI;
		var patt = /^http[s]?:\/\/store.steampowered.com\/(app|sub|sale)\//i;

		if (patt.test(url))
		{
			// Fix price position in old ES
			{
				GM_addStyle
				(
					"   .game_area_dlc_row, .tab_item { display: inherit !important; } "
					+ " .game_purchase_action_bg { white-space: normal !important; } "
					+ " .sbh_regional_container { min-width: 220px; } "
					+ " .sbh_regional_container.sbh_regional_container_oldEs { right: 300px !important; } "
				);
		
				var time_fixPosEs = getUnixTimestamp();
				var tmId_fixPosEs = setInterval(function ()
				{
					if (getUnixTimestamp() - time_fixPosEs > 10)
					{
						clearInterval(tmId_fixPosEs);
					}
					
					var elesContainer = document.querySelectorAll(".es_regional_container");
					if (elesContainer.length > 0)
					{
						clearInterval(tmId_fixPosEs);
							
						for (var i = 0; i < elesContainer.length; i++)
						{
							elesContainer[i].classList.add("sbh_regional_container");
						}
							
						if (document.querySelector(".es_regional_icon"))
						{
							// New ES
						}
						else
						{
							// Old ES
							
							for (var i = 0; i < elesContainer.length; i++)
							{
								elesContainer[i].classList.add("sbh_regional_container_oldEs");
							}
						
							var elesOrg = document.querySelectorAll(".game_purchase_action .discount_original_price");
							for (var i = 0; i < elesOrg.length; i++)
							{
								if (elesOrg[i].style.position == "relative")
								{
									elesOrg[i].style.position = "";
								}
							}
							
							var elesPct = document.querySelectorAll(".game_purchase_action .discount_pct");
							for (var i = 0; i < elesPct.length; i++)
							{
								if (elesPct[i].parentElement.style.paddingLeft == "25px")
								{
									elesPct[i].style.marginLeft = "-25px";
									elesPct[i].style.marginRight = "25px";
								}
							}
						}
					}
				}, 300);
			}
		}
	});

	attachOnLoad(function()
	{
		debugTime("load");

		// Set currency for SIH
		{
			setTimeout(function()
			{
				var currency = marketCountries[GM_getValue("storeCountry", "US")] || "1";
				var clientScript = " currencyId = " + currency + "; ";

				var eleClientScript = document.createElement("script");
				eleClientScript.innerHTML = clientScript;
				document.head.appendChild(eleClientScript);
			}, 500);
		}
		
		// Fix css for older browser
		GM_addStyle(".carousel_container .arrow.left > div { background-position: 23px 0px; } ");
		
		// Fix css for market transaction display
		GM_addStyle("#market_transactions .transactionRowTitle { display: inline-block; padding-right: 5px; }");
		
		// Fix css for ES tag
		GM_addStyle(".recent_game .game_info .game_info_cap img.es_overlay { width: auto; }");
		
	});

	function testEvent()
	{
		/*
		document.querySelector("#header_notification_link").addEventListener("DOMCharacterDataModified", function (e) {
			debugTime("DOMCharacterDataModified");
		});

		document.querySelector("#header_notification_link").addEventListener("DOMSubtreeModified", function (e) {
			debugTime("DOMSubtreeModified");
		});
		
		{
			// select the target node
			var target = document.querySelector("#header_notification_link");
			 
			// create an observer instance
			var observer = new MutationObserver(function(mutations) 
			{
				mutations.forEach(function(mutation) 
				{
					debugTime("mutation: " + mutation.type);
				});    
			});
			 
			// pass in the target node, as well as the observer options
			observer.observe(target, 
			{
				childList: true, 
				attributes: true, 
				characterData: true, 
				subtree: true, 
				attributeOldValue: true, 
				characterDataOldValue: true, 
			});
			 
			// later, you can stop observing
			//observer.disconnect();
		}
		*/
		
	}
	attachOnLoad(testEvent);
	
	

})();

// End
