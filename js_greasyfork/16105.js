// ==UserScript==
// @name            Bundle Helper
// @namespace       iFantz7E.BundleHelper
// @version         1.09
// @description     Add tools for many bundle sites.
// @match           *://cubicbundle.com/*
// @match           *://dailyindiegame.com/*
// @match           *://forums.steampowered.com/forums/showthread.php?*
// @match           *://www.gogobundle.com/latest/bundles/*
// @match           *://groupees.com/*
// @match           *://otakumaker.com/*
// @match           *://www.otakumaker.com/*
// @match           *://otakubundle.com/latest/bundles/*
// @match           *://steamcommunity.com/*/home*
// @match           *://steamcommunity.com/groups/*/announcements*
// @match           *://steamcompanion.com/gifts/*
// @match           *://steamground.com/*
// @match           *://store.steampowered.com/account/notinterested/*
// @match           *://store.steampowered.com/app/*
// @match           *://store.steampowered.com/widget/*
// @match           *://store.steampowered.com/search/*
// @match           *://whosgamingnow.net/*
// @match           *://www.bunchkeys.com/*
// @match           *://www.bundlekings.com/*
// @match           *://www.fanatical.com/*
// @match           *://www.dailyindiegame.com/*
// @match           *://www.gamebundle.com/*
// @match           *://www.hrkgame.com/*
// @match           *://www.humblebundle.com/*
// @match           *://www.indiegala.com/*
// @match           *://www.orlygift.com/*
// @match           *://www.reddit.com/r/*/comments/*
// @match           *://www.superduperbundle.com/*
// @match           *://www.sgtools.info/*
// @match           *://steamkeys.ovh/*
// @match           *://steamdb.info/*
// @run-at          document-start
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @connect         store.steampowered.com
// @connect         www.hrkgame.com
// @connect         www.fanatical.com
// @connect         www.steamgifts.com
// @icon            https://store.steampowered.com/favicon.ico
// @license         GPL-3.0-only
// @copyright       2016, 7-elephant
// @supportURL      https://steamcommunity.com/id/7-elephant/
// @contributionURL https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/16105/Bundle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/16105/Bundle%20Helper.meta.js
// ==/UserScript==

// Connect to store.steampowered.com to get owner info
// Connect to www.hrkgame.com and www.fanatical.com to get Steam ID of each products
// Connect to www.steamgifts.com to get bundle threads

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 10 Jan 2016
// https://greasyfork.org/scripts/16105-bundle-helper/

(function ()
{
	"use strict";
	// jshint multistr:true

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e)
	{
		callback();
	});
}

function attachOnReady(callback)
{
	document.addEventListener("DOMContentLoaded", function (e)
	{
		callback();
	});
}

function insertBeforeElement(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfterElement(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeElement(node)
{
	node.parentElement.removeChild(node);
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

function getQueryByName(name, url)
{
	if (url == null)
	{
		url = location == null ? "" : location.search;
	}
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
			console.error("getQueryByName", ex.message);
		}
	}
	return retVal;
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

function scrollToElement(selector, offset)
{
	if (typeof offset === "undefined")
	{
		offset = -20;
	}

	var ele = null;
	if (selector)
	{
		if (selector instanceof HTMLElement)
		{
			ele = selector;
		}
		else
		{
			ele = document.querySelector(selector);
		}
		if (ele)
		{
			ele.scrollIntoView(true);
			window.scrollBy(0, offset);
		}
	}
}

function normalizeArray(arr)
{
	arr = arr.filter(function(elem, index, self)
	{
		return index == self.indexOf(elem);
	});
	return arr;
}

function randNum(min, max)
{
	return Math.round(Math.random() * (max - min) + min);
}

var timeoutList = [];
var intervalList = [];

function setTimeoutCustom(func, tm, params)
{
	var id = setTimeout(func, tm, params);
	timeoutList.push(id);
	return id;
}

function clearTimeoutAll()
{
	for (var i = 0; i < timeoutList.length; i++)
	{
		clearTimeout(timeoutList[i]);
	}
}

function setIntervalCustom(func, tm, params)
{
	var id = setInterval(func, tm, params);
	intervalList.push(id);
	return id;
}

function clearIntervalAll()
{
	for (var i = 0; i < intervalList.length; i++)
	{
		clearInterval(intervalList[i]);
	}
}

function getUnixTimestamp()
{
	return parseInt(Date.now() / 1000);
}

function resetProfileCacheTimestamp()
{
	GM_setValue(name_profile_time, 0);
	console.log("Cache: refresh");
}

function isProfileCacheExpired()
{
	var isExpired = false;
	var timestampExpired = 5 * 60;

	var profileTimestamp = GM_getValue(name_profile_time, 0);

	var profileTimestampDiff = getUnixTimestamp() - profileTimestamp;
	if (profileTimestampDiff > timestampExpired)
	{
		isExpired = true;
	}

	if (!isExpired)
	{
		var profileJson = GM_getValue(name_profile_json, 0);
		if (!profileJson)
		{
			isExpired = true;
		}
	}

	if (!isExpired)
	{
		console.log("Cache: " + profileTimestampDiff + "s");
	}

	return isExpired;
}

function setProfileCache(json)
{
	GM_setValue(name_profile_json, json);
	GM_setValue(name_profile_time, getUnixTimestamp());
}

function markOwned(query, getElementCallback, getProductIdCallback
	, classOwned, classNotInterested, classWished, getCountCallback)
{
	if (!document.querySelector(query))
	{
		//console.log("markOwned: empty");
		return;
	}
	
	if (!getElementCallback)
	{
		getElementCallback = function(ele, type)
		{
			// type -> 1: Owned, 2: Ignored, 3: Wishlist
			return ele;
		};
	}
	
	if (!getProductIdCallback)
	{
		getProductIdCallback = function(ele)
		{
			return ele.getAttribute("href");
		};
	}
	
	if (!getCountCallback)
	{
		getCountCallback = function(appCount, subCount, appOwned, subOwned)
		{
		};
	}
	
	if (!classOwned) classOwned = "";
	if (!classNotInterested) classNotInterested = "";
	if (!classWished) classWished = "";
	
	var apps = [];
	var subs = [];
	
	var rgxId = /[0-9]{3,}/g;
	var rgxApp = /((:\/\/(store\.steampowered\.com|steamcommunity\.com|steamdb\.info)(\/agecheck)?\/app|\/steam\/apps)\/[0-9]+|^[0-9]{3,}$)/i;
	var rgxSub = /(:\/\/(store\.steampowered\.com|steamdb\.info)\/sub|\/steam\/subs)\/[0-9]+/i;
	
	var markFromJson = function(dataRes)
	{
		if (!dataRes)
		{
			//console.log("markFromJson: empty");
			return;
		}
		
		var countOwned = [0, 0];
		var countAll = [0, 0];
		
		if (typeof dataRes["rgOwnedApps"] !== "undefined"
			&& typeof dataRes["rgOwnedPackages"] !== "undefined"
			&& typeof dataRes["rgIgnoredApps"] !== "undefined")
		{
			var eleApps = document.querySelectorAll(query);
			for (var i = 0; i < eleApps.length; i++)
			{
				var attrHref = getProductIdCallback(eleApps[i]);
				var ids = attrHref.match(rgxId);
				if (ids)
				{
					var valId = parseInt(ids[0]);
						
					if (rgxApp.test(attrHref))
					{
						if (dataRes["rgOwnedApps"].indexOf(valId) > -1)
						{
							var ele = getElementCallback(eleApps[i], 1);
							if (ele && classOwned !== "")
							{
								ele.classList.add(classOwned);
							}
							countOwned[0]++;
						}
						else
						{
							//console.log("App: not owned - https://store.steampowered.com/app/" + id + "/");
							if (dataRes["rgWishlist"].indexOf(valId) > -1)
							{
								var ele = getElementCallback(eleApps[i], 3);
								if (ele && classWished !== "")
								{
									ele.classList.add(classWished);
								}
							}
							else if (dataRes["rgIgnoredApps"][valId] === 0)
							{
								var ele = getElementCallback(eleApps[i], 2);
								if (ele && classNotInterested !== "")
								{
									ele.classList.add(classNotInterested);
								}
							}
						}
						countAll[0]++;
					}
					else if (rgxSub.test(attrHref))
					{								
						if (dataRes["rgOwnedPackages"].indexOf(valId) > -1)
						{
							var ele = getElementCallback(eleApps[i], 1);
							if (ele && classOwned !== "")
							{
								ele.classList.add(classOwned);
							}
							countOwned[1]++;
						}
						else
						{
							//console.log("Sub: not owned - https://store.steampowered.com/sub/" + id + "/");
						}
						countAll[1]++;
					}
				}
			}
		}
		
		if (countAll[0] > 1)
		{
			console.log("App: owned " + countOwned[0] + "/" + countAll[0]);
		}
		if (countAll[1] > 1)
		{
			console.log("Sub: owned " + countOwned[1] + "/" + countAll[1]);
		}
		
		getCountCallback(countAll[0], countAll[1], countOwned[0], countOwned[1]);
	}

	// Force mark from cache
	{
		setTimeoutCustom(function()
		{
			// Delay after script ran
			var profileJson = GM_getValue(name_profile_json, 0);
			markFromJson(profileJson);
		}, 300);
	}
		
	/*if (isProfileCacheExpired())
	{
		GM_xmlhttpRequest(
		{
			method: "GET",
			url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
			onload: function(response) 
			{
				console.log("markOwned: userdata " + response.responseText.length + " bytes");
				
				var dataRes = JSON.parse(response.responseText);
				
				setProfileCache(dataRes);				
				markFromJson(dataRes);
				
			} // End onload
		});
	}*/
}

function markOwned_old(query, markOwnedCallback)
{
	var rgxId = /[0-9]{3,}/g;
	var rgxApp = /:\/\/((store\.steampowered|steamcommunity)\.com\/app|cdn.akamai.steamstatic.com\/steam\/apps)\/[0-9]+/i;
	var rgxSub = /:\/\/store\.steampowered\.com\/sub\/[0-9]+/i;

	GM_xmlhttpRequest(
	{
		method: "GET",
		url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
		onload: function(response)
		{
			var dataRes = JSON.parse(response.responseText);

			var countOwned = [0, 0];
			var countAll = [0, 0];

			if (typeof dataRes["rgOwnedApps"] !== "undefined"
				&& typeof dataRes["rgOwnedPackages"] !== "undefined"
				&& typeof dataRes["rgIgnoredApps"] !== "undefined")
			{
				var eleApps = document.querySelectorAll(query);
				for (var i = 0; i < eleApps.length; i++)
				{
					var attrHref = eleApps[i].getAttribute("href") || eleApps[i].getAttribute("src");
					var ids = attrHref.match(rgxId);
					if (ids != null)
					{
						var valId = parseInt(ids[0]);

						if (rgxApp.test(attrHref))
						{
							if (dataRes["rgOwnedApps"].indexOf(valId) > -1)
							{
								markOwnedCallback(eleApps[i]);
								countOwned[0]++;
							}
							else
							{
								console.log("App: not owned - http://store.steampowered.com/app/" + valId + "/");
							}
							countAll[0]++;
						}
						else if (rgxSub.test(attrHref))
						{
							if (dataRes["rgOwnedPackages"].indexOf(valId) > -1)
							{
								markOwnedCallback(eleApps[i]);
								countOwned[1]++;
							}
							else
							{
								console.log("Sub: not owned - http://store.steampowered.com/sub/" + valId + "/");
							}
							countAll[1]++;
						}
					}
				}

			}

			var diff = countAll[0] - countOwned[0];
			console.log("App: " + countOwned[0] + "/" + countAll[0] + (diff > 10 ? " Diff: " + diff : ""));
			console.log("Sub: " + countOwned[1] + "/" + countAll[1]);

		} // End onload
	});
}

var name_profile_json = "bh_profile_json";
var name_profile_time = "bh_profile_time";

function main()
{
	// #8BC349
	// #6EA028
	// #2ECC71
	// #92B300

	GM_addStyle(
		"   .bh_button { "
		+ "	  border-radius: 2px; border: medium none; padding: 10px; display: inline-block; "
		+ "   cursor: pointer; background: #67C1F5 none repeat scroll 0% 0%; "
		+ "   width: 120px; text-align: center; } "
		+ " .bh_button a { "
		+ "   text-decoration: none !important; color: #FFF !important; "
		+ "   padding: 0px 2px; } "
		+ " .bh_button:hover a { "
		+ "   color: #0079BF !important; } "
		+ " .bh_button, .bh_button a { "
		+ "   font-family: Verdana; font-size: 12px; "
		+ "   line-height: 16px; } "
		+ " .bh_owned { background-color: #7CA156 !important; "
		+ "   transition: background 500ms ease 0s; } "
		+ " #bh_markOwned { "
		+ "   position: fixed; right: 20px; bottom: 20px; z-index: 33; } "
		+ " #bh_OpenLib { "
		+ "   position: fixed; right: 20px; bottom: 65px; z-index: 33; } "
	);

	var url = document.documentURI;

	if (url.indexOf("hrkgame.com") > -1)
	{
		if (window !== window.parent)
			return;

		GM_addStyle(
			"   .bh_owned { background-color: #97BA22 !important; } "
			+ " #bh_markOwned { bottom: 40px !important; } "
		);

		if (url.indexOf("/randomkeyshop/make-bundle") > -1)
		{
			// Add load button
			{
				var divButton = document.createElement("div");
				divButton.classList.add("bh_button");
				divButton.id = "bh_loadAll";
				divButton.setAttribute("style", "bottom: 86px;");
				divButton.setAttribute("onclick", " \
					this.firstElementChild.textContent = \"Loading...\"; \
					window.scrollTo(0,document.body.scrollHeight); \
					var countHidden = 5; \
					var idx = setInterval(function(ele) \
					{ \
						var eleLoad = document.querySelector(\"#loader-icon\"); \
						if (eleLoad) \
						{ \
							window.scrollTo(0,document.body.scrollHeight); \
							if (eleLoad.style.display == \"none\") \
							{ \
								countHidden--; \
							} \
							else \
							{ \
								countHidden = 5; \
							} \
						} \
						else \
						{ \
							countHidden--; \
						} \
						if (countHidden < 0) \
						{ \
							clearInterval(idx); \
							ele.style.display=\"none\"; \
							var eleRes = document.querySelector(\"#result\"); \
							if (eleRes) \
							{ \
								eleRes.scrollIntoView(true); \
								window.scrollBy(0, -80); \
							} \
						} \
					}, 500, this); \
					return false; \
				");
				divButton.innerHTML = "<a onclick='return false;'>Load All</a>";
				document.body.appendChild(divButton);
			}

			// Add mark button
			{
				var divButton = document.createElement("div");
				divButton.classList.add("bh_button");
				divButton.id = "bh_markOwned";

				var eleA = document.createElement("a");
				eleA.setAttribute("onclick", "return false;");
				eleA.textContent = "Mark Owned";

				divButton.appendChild(eleA);
				document.body.appendChild(divButton);

				divButton.addEventListener("click", function()
				{
					GM_xmlhttpRequest(
					{
						method: "GET",
						url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
						onload: function(response)
						{
							var dataResSteam = JSON.parse(response.responseText);

							if (typeof dataResSteam["rgOwnedApps"] == "undefined"
								|| dataResSteam["rgOwnedApps"].length == 0)
							{
								console.log("not logged in");
							}
							else if (typeof dataResSteam["rgOwnedApps"] !== "undefined"
								&& typeof dataResSteam["rgOwnedPackages"] !== "undefined"
								&& typeof dataResSteam["rgIgnoredApps"] !== "undefined")
							{
								var parser = new DOMParser();
								var rgxId = /[0-9]+/;
								var rgxApp = /:\/\/store\.steampowered\.com\/app\/[0-9]+/i;
								var rgxSub = /:\/\/store\.steampowered\.com\/sub\/[0-9]+/i;

								var elesProduct = document.querySelectorAll("#result .content:not(.bh_owned)");

								var productCur = 0;
								var tmId = setInterval(function()
								{
									if (productCur >= elesProduct.length)
									{
										clearInterval(tmId);
									}
									else
									{
										var dataHref = elesProduct[productCur].firstElementChild.getAttribute("data-href");
										if (dataHref != null)
										{
											var fullHref = "https://www.hrkgame.com" + dataHref + "/";
											elesProduct[productCur].setAttribute("bh_href", fullHref);

											GM_xmlhttpRequest(
											{
												method: "GET",
												url: fullHref,
												onload: function(response)
												{
													var isOwned = false;

													var dataRes = parser.parseFromString(response.responseText, "text/html");

													var eleA = dataRes.querySelector(".storeside a.item[href*='store.steampowered.com/']");
													if (eleA != null)
													{
														var attrHref = eleA.href;
														var id = rgxId.exec(attrHref);
														if (id != null)
														{
															var valId = parseInt(id);

															if (rgxApp.test(attrHref))
															{
																if (dataResSteam["rgOwnedApps"].indexOf(valId) > -1)
																{
																	isOwned = true;
																}
																else
																{
																	console.log("App: not owned - http://store.steampowered.com/app/" + id + "/");
																}
															}
															else if (rgxSub.test(attrHref))
															{
																if (dataResSteam["rgOwnedPackages"].indexOf(valId) > -1)
																{
																	isOwned = true;
																}
																else
																{
																	console.log("Sub: not owned - http://store.steampowered.com/sub/" + id + "/");
																}
															}

															if (isOwned)
															{
																for (var i = 0; i < elesProduct.length; i++)
																{
																	if (elesProduct[i].getAttribute("bh_href") == response.finalUrl)
																	{
																		elesProduct[i].classList.add("bh_owned");
																		break;
																	}
																}
															}
														}
													}
													else
													{
														console.log("Info: not found - " + response.finalUrl);
													}

												} // End onload
											});
										}
									}
									productCur++
								}, 200);
							}

						} // End onload
					});
				});
			}
		}
		else if (url.indexOf("/library") > -1)
		{
			var clientScript = ' \
				confirm = function() \
				{ \
					return true; \
				}; \
			';

			var eleClientScript = document.createElement("script");
			eleClientScript.innerHTML = clientScript;
			document.head.appendChild(eleClientScript);
		}
	}
	else if (url.indexOf("fanatical.com") > -1)
	{
		GM_addStyle(
			//" .bh_owned { background-color: #A7CC00 !important; } "
			" .bh_owned { background-color: #D0FE00 !important; } "
			+ " .bh_owned:hover { background-color: #BBE500 !important; } "
			+ " .bh_owned *, .bh_owned.pnm-product-card .card-block .card-title { "
			+ "   color: #444 !important; fill: #444 !important; } "
			+ " .bh_owned .was, .bh_owned .was * { color: #777 !important; } "
			+ " .bh_owned .hide-checkbox + label span { color: #DDD !important; } "
			+ " .bh_owned .hide-checkbox:checked + label span { color: #D0FE00 !important; } "
			+ " .bh_owned .text-fade { display: none !important; } "
			+ " #launcher { bottom: 100px !important; } "
		);

		if (url.indexOf("/bundle/") > -1)
		{
			var fn_markOwned = function()
			{
				markOwned(".product-details a[href*='store.steampowered.com/']", function(ele)
					{
						return ele.parentElement.parentElement
							.parentElement.parentElement.parentElement
							.parentElement.parentElement.parentElement
							.parentElement.parentElement.parentElement
							.parentElement.firstElementChild.firstElementChild;
					}, null, "bh_owned");
			};

			var obTarget_root = document.querySelector("#root");
			if (obTarget_root)
			{
				var tmOb_root = -1;
				var obMu_root = new MutationObserver(function(mutations)
				{
					mutations.forEach(function(mutation)
					{
						if (mutation.type !== "attributes"
							|| mutation.target.tagName === "TR")
						{
							clearTimeout(tmOb_root);
							tmOb_root = setTimeoutCustom(function()
							{
								fn_markOwned();
							}, 200);
						}
					});
				});

				var obConfig_root = { childList: true, subtree: true };
				obMu_root.observe(obTarget_root, obConfig_root);
			}

			// Add mark button
			/*{
				var divButton = document.createElement("div");
				divButton.classList.add("bh_button");
				divButton.id = "bh_markOwned";

				var eleA = document.createElement("a");
				eleA.setAttribute("onclick", "return false;");
				eleA.textContent = "Mark Owned";

				divButton.appendChild(eleA);
				document.body.appendChild(divButton);

				divButton.addEventListener("click", function()
				{
					fn_markOwned();
				});
			}*/
		}
		else if (url.indexOf("/pick-and-mix/") > -1)
		{
			// Add mark button
			{
				var divButton = document.createElement("div");
				divButton.classList.add("bh_button");
				divButton.id = "bh_markOwned";

				var eleA = document.createElement("a");
				eleA.setAttribute("onclick", "return false;");
				eleA.textContent = "Mark Owned";

				divButton.appendChild(eleA);
				document.body.appendChild(divButton);

				divButton.param_promo = url.substr(url.indexOf("/pick-and-mix/") + 14)
					.replace(/\?.+/, "").replace(/#.+/, "");
				eleA.param_promo = divButton.param_promo;

				divButton.addEventListener("click", function(e)
				{
					var promo = e.target.param_promo;

					GM_xmlhttpRequest(
					{
						method: "GET",
						url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
						onload: function(response)
						{
							var dataResSteam = JSON.parse(response.responseText);

							if (typeof dataResSteam["rgOwnedApps"] == "undefined"
								|| dataResSteam["rgOwnedApps"].length == 0)
							{
								console.log("not logged in");
							}
							else if (typeof dataResSteam["rgOwnedApps"] !== "undefined"
								&& typeof dataResSteam["rgOwnedPackages"] !== "undefined"
								&& typeof dataResSteam["rgIgnoredApps"] !== "undefined")
							{
								var elesProduct = document.querySelectorAll(".pnm-product-card:not(.bh_owned)");
								for (var i = 0; i < elesProduct.length; i++)
								{
									var eleSlug = elesProduct[i].querySelector(".faux-block-link__overlay-link");
									if (eleSlug)
									{
										var href = eleSlug.href;
										elesProduct[i].dataset.slug = href.substr(href.indexOf("/game/") + 6);
									}
								}

								GM_xmlhttpRequest(
								{
									method: "GET",
									url: "https://api.fanatical.com/api/promotions/" + promo,
									onload: function(response)
									{
										var dataRes = JSON.parse(response.responseText);

										var slugs = [];

										var i = dataRes.length - 1;
										//for (var i = 0; i < dataRes.length; i++)
										{

											for (var j = 0; j < dataRes[i].products.length; j++)
											{
												if (dataRes[i].products[j].drm.steam)
												{
													slugs.push(dataRes[i].products[j].slug);
												}
											}
										}

										slugs = normalizeArray(slugs);

										var slugCur = 0;
										var tmId = setInterval(function()
										{
											if (slugCur >= slugs.length)
											{
												clearInterval(tmId);
											}
											else
											{
												GM_xmlhttpRequest(
												{
													method: "GET",
													url: "https://api.fanatical.com/api/products/" + slugs[slugCur],
													onload: function(response)
													{
														var isOwned = false;

														var dataRes = JSON.parse(response.responseText);

														if (!dataRes.steam.sub)
														{
															if (dataResSteam["rgOwnedApps"].indexOf(dataRes.steam.id) > -1)
															{
																isOwned = true;
															}
															else
															{
																console.log("App: not owned - http://store.steampowered.com/app/" + dataRes.steam.id + "/ - " + dataRes.slug);
															}
														}
														else
														{
															if (dataResSteam["rgOwnedPackages"].indexOf(dataRes.steam.id) > -1)
															{
																isOwned = true;
															}
															else
															{
																console.log("Sub: not owned - http://store.steampowered.com/sub/" + dataRes.steam.id + "/ - " + dataRes.slug);
															}
														}

														if (isOwned)
														{
															for (var i = 0; i < elesProduct.length; i++)
															{
																if (elesProduct[i].dataset.slug === dataRes.slug)
																{
																	elesProduct[i].classList.add("bh_owned");
																	break;
																}
															}
														}

													} // End onload
												});
											}
											slugCur++;
										}, 200);

									} // End onload
								});

							}

						} // End onload
					});
				});
			}
		}
	}
	else if (url.indexOf("reddit.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned , .md .bh_owned code { background-color: #DFF0D8 !important; } "
			+ " li > .bh_owned, div > p > .bh_owned { padding: 0px 2px 0px 2px; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			//document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned("td > a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}

		setTimeout(function()
		{
			markOwned("td > a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement.parentElement;
			}, null, "bh_owned");

			markOwned("li > a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement;
			}, null, "bh_owned");

			markOwned("li > p > a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement.parentElement;
			}, null, "bh_owned");

			markOwned("div > p > a[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}, 1000);
	}
	else if (url.indexOf("groupees.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #DFF0D8 !important; } "
			+ " #subscribe-form { display: none; } "
			+ " input[name='search'] { position: fixed; z-index: 1099; left: 18%; top: 16px; } "
			+ " button[role='show3dKeyModal'] { position: fixed; z-index: 1099; left: 72%; top: 16px; } "
			+ " .cancel-spin { position: fixed !important; z-index: 1099 !important; left: 39.5% !important; top: 22px !important; } "
			+ " .bh_owned_dark { background-color: rgba(140, 197, 63, 0.6) !important; } "
		);
		/*
		var a = document.querySelector("input[name='search']");
		var b = document.querySelector("#subscribe-form");
		b.parentElement.insertBefore(a,b);
		b.parentElement.removeChild(b);
		*/
		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				var apps = [];

				var eleApps = document.querySelectorAll(".bundle > .products .info .description a[href*='store.steampowered.com/app/']"
					+ ", .expanded .product-info a[href*='store.steampowered.com/app/']"
					+ ", .product-details.hidden .external-links a[href*='store.steampowered.com/app/']");
				console.log("Apps: " + eleApps.length);

				for (var i = 0; i < eleApps.length; i++)
				{
					var app = /[0-9]+/.exec(eleApps[i].getAttribute("href"));
					if (app != null)
					{
						apps.push(app[0]);
					}
				}

				apps = apps.filter(function(elem, index, self)
				{
					return index == self.indexOf(elem);
				});

				var appAll = apps.join(",");

				GM_xmlhttpRequest(
				{
					method: "GET",
					headers:
					{
						"Cache-Control": "max-age=0"
					},
					url: "https://store.steampowered.com/api/appuserdetails/?appids=" + appAll,
					onload: function(response)
					{
						var dataRes = JSON.parse(response.responseText);

						var countOwned = 0;

						var elePurchases = null;
						var elePrds = document.querySelectorAll(".bundle > .products .product h3"
							+ ", .expanded .details, .product-info");
						var eleApps = document.querySelectorAll(".bundle > .products .info"
							+ ", .expanded .details, .product-details.hidden");
						for (var i = 0; i < eleApps.length; i++)
						{
							var eleApp = eleApps[i].querySelector(".description a[href*='store.steampowered.com/app/']"
								+ ", .product-info a[href*='store.steampowered.com/app/']"
								+ ", .external-links a[href*='store.steampowered.com/app/']");
							if (eleApp != null)
							{
								var app = /[0-9]+/.exec(eleApp.getAttribute("href"));
								if (app != null)
								{
									if (typeof dataRes[app] !== "undefined")
									{
										if (dataRes[app].success)
										{
											if (dataRes[app].data.is_owned)
											{
												var eleLabel = elePrds[i];
												if (eleLabel.classList.contains("product-info"))
												{
													eleLabel.classList.add("bh_owned_dark");

													// Mark game in build bundles
													{
														var eleName = eleLabel.querySelector("h4");
														if (eleName)
														{
															var name = eleName.textContent.trim();

															if (elePurchases == null)
															{
																elePurchases = document.querySelectorAll(".purchase-products > .bundle-product > .input > label");
															}

															if (elePurchases != null)
															{
																for (var j = 0; j < elePurchases.length; j++)
																{
																	if (elePurchases[j].textContent.trim() == name)
																	{
																		elePurchases[j].parentElement.parentElement.classList.add("bh_owned_dark");
																	}
																}
															}
														}
													}

												}
												else
												{
													eleLabel.classList.add("bh_owned");
												}
												countOwned++;
											}
											else
											{
												console.log("App: not owned - http://store.steampowered.com/app/" + app);
											}
										}
										else
										{
											console.log("App: not success - http://store.steampowered.com/app/" + app);
										}
									}
								}
							}
						}

						console.log("Apps: owned - " + countOwned);

					} // End onload
				});

			});
		}
	}
	else if (url.indexOf("indiegala.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned, .bh_owned .bundle-item-trading { background-color: rgba(125, 174, 45, 0.9) !important; } "
			+ " .ig-bundle { padding-left: 3px; padding-right: 3px; margin-bottom: 3px; } "
			+ " .bh_owned.ig-bundle { background-color: rgba(125, 174, 45) !important; } "
			+ " .bh_owned.ig-bundle .bundle-item-trading { background-color: rgba(125, 174, 45, 0) !important; } "
			+ " .bh_owned .add-info-button-cont .left, .bh_owned .add-info-button-cont .palette-background-2 { "
			+ "   background-color: #7DAE2D !important; } "
			+ " .bh_owned .add-info-button-cont .right .inner-info, .bh_owned .add-info-button-cont .right .palette-border-2 { "
			+ "   border-color: #7DAE2D !important; } "
			+ " .bh_owned.medium-game .game-cover-medium { border: 3px solid #7DAE2D; background-color: rgba(125, 174, 45, 0.4); } "
			+ " .bh_owned.game-data-cont { background-color: #76AD1C !important; } "
			+ " .bundle-item-trading-cards-cont span { opacity: 0.7; } "
			+ " .span-title .title_game, .span-title .title_drm, .span-title .title_music { "
			+ "   line-height: 43px !important; margin: 10px 0px 10px 15px !important; "
			+ "   padding-left: 10px !important; border-radius: 3px !important; } "
			+ " .medium-game { min-height: 146px; } "
		);

		// Auto reload when error
		{
			setTimeout(function()
			{
				if (document.title == "500 Server Error")
				{
					console.log("Autorefresh: 500 Server Error");
					setTimeout(function()
					{
							reload();
					}, 5000);
				}
			}, 10000);
		}

		// Insert email to bundle section
		{
			var countRetryEmail = 10;
			var tmRetryEmail = setInterval(function()
			{
				var eleEmail = document.querySelector(".account-email");
				var eleInput = document.querySelector(".email-input");
				if (eleEmail && eleInput)
				{
					var email = eleEmail.textContent.trim();
					if (email != "")
					{
						eleInput.value = email;
						clearInterval(tmRetryEmail);
					}
				}

				if (countRetryEmail < 0)
				{
					clearInterval(tmRetryEmail);
				}
				countRetryEmail--;
			}, 3000);
		}

		// Add mark button
		if (url.indexOf("/store/product/") < 0)
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				var rgxId = /[0-9]{3,}/g;
				var rgxApp = /:\/\/((store\.steampowered\.com|steamcommunity\.com)\/app|www.indiegala.com\/store\/product\/[^\/]+)\/[0-9]+/i;
				var rgxSub = /:\/\/(store\.steampowered\.com|steamcommunity\.com)\/sub\/[0-9]+/i;
				var rgxInvalidApp = /:\/\/store\.steampowered\.com\/[0-9]+\//i;

				var eleApps = document.querySelectorAll("a[href*='store.steampowered.com/']");
				for (var i = 0; i < eleApps.length; i++)
				{
					var attrHref = eleApps[i].getAttribute("href");
					if (rgxInvalidApp.test(attrHref))
					{
						eleApps[i].setAttribute("href", attrHref.replace("store.steampowered.com/", "store.steampowered.com/app/"));
					}
				}

				GM_xmlhttpRequest(
				{
					method: "GET",
					url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
					onload: function(response)
					{
						var dataRes = JSON.parse(response.responseText);

						var countOwned = 0;

						if (typeof dataRes["rgOwnedApps"] !== "undefined"
							&& typeof dataRes["rgOwnedPackages"] !== "undefined"
							&& typeof dataRes["rgIgnoredApps"] !== "undefined")
						{
							var elePrds = document.querySelectorAll(
								".bundle-item-link, .in .in .in .game-steam-url"
								+ ", #this_your_gift .game-steam-url");
							var eleApps = document.querySelectorAll(
								".game-opened-switcher a[href*='store.steampowered.com/'].game-steam-url"
								+ ", .game-opened-switcher a[href*='steamcommunity.com/'].game-steam-url"
								+ ", .bundle-item-header a[href*='store.steampowered.com/'].game-steam-url"
								+ ", .bundle-item-header a[href*='steamcommunity.com/'].game-steam-url"
								+ ", .in .in .in .game-steam-url"
								+ ", #this_your_gift .game-steam-url"
								+ ", .game-cover-medium[href^='/store/product/']"
								+ ", #game_list_div .game-data-cont a[href^='/store/product/']"
								+ ", .search-page-store .game-data-cont a[href^='/store/product/']");

							var eleTitle = document.querySelector("#title-p");
							if (eleTitle && eleTitle.textContent.trim() === "Indiegala gift")
							{
								elePrds = document.querySelectorAll(
									"#steam-key-games .game-steam-url");
								eleApps = document.querySelectorAll(
									"#steam-key-games .game-steam-url");
							}


							for (var i = 0; i < eleApps.length; i++)
							{
								var attrHref = eleApps[i].href;
								var ids = attrHref.match(rgxId);
								if (ids != null)
								{
									var valId = parseInt(ids[ids.length - 1]);

									var eleLabel = null;

									if (eleApps[i].classList.contains("game-cover-medium"))
									{
										eleLabel = eleApps[i].parentElement;
									}
									else if (eleApps[i].parentElement.parentElement.classList.contains("game-data-cont"))
									{
										eleLabel = eleApps[i].parentElement.parentElement;
									}
									else if (elePrds[i].classList.contains("bundle-item-link"))
									{
										eleLabel = elePrds[i].parentElement.parentElement;
									}
									else
									{
										eleLabel = elePrds[i].parentElement;
									}

									if (rgxApp.test(attrHref))
									{
										if (dataRes["rgOwnedApps"].indexOf(valId) > -1)
										{
											eleLabel.classList.add("bh_owned");
											countOwned++;
										}
										else
										{
											console.log("App: not owned - http://store.steampowered.com/app/" + valId);
										}
									}
									else if (rgxSub.test(attrHref))
									{
										if (dataRes["rgOwnedPackages"].indexOf(valId) > -1)
										{
											eleLabel.classList.add("bh_owned");
											countOwned++;
										}
										else
										{
											console.log("Sub: not owned - http://store.steampowered.com/sub/" + valId);
										}
									}
								}
							}

							console.log("Apps: owned - " + countOwned);
						}
					} // End onload
				});

			});
		}

		// Change title
		{
			var countRetryTitle = 10;
			var tmRetryTitle = setInterval(function()
			{
				var elesPrice = document.querySelectorAll(".bundle-claim-phrase");
				for (var i = elesPrice.length - 1; i > -1; i--)
				{
					var elePrice = elesPrice[i].querySelector("span");
					if (elePrice)
					{
						var price = elePrice.textContent.trim();
						if (price.indexOf("$") == 0)
						{
							document.title = price + " " + document.title;
							clearInterval(tmRetryTitle);
							break;
						}
					}
				}

				if (countRetryTitle < 0)
				{
					clearInterval(tmRetryTitle);
				}
				countRetryTitle--;
			}, 3000);
		}

		// Load library
		if (url.indexOf("/profile") > -1)
		{
			var clientScript = " \
				function openBundleLibrary() \
				{ \
					$.ajax({ \
						type: 'GET', \
						data: { user_id : '" + getQueryByName("user_id") + "' }, \
						url: '/ajaxprofile_sale_tab', \
						dataType: 'json', \
						context: $( '#profile_bundle_section .accordion-toggle' ), \
						 \
						beforeSend: function(){ \
							console.log('Start: open bundle library' ); \
							openBundleLibraryAjaxSemaphore = false; \
							$('.spinner', $( '#profile_bundle_section .accordion-toggle' ) ).remove(); \
							$( '#profile_bundle_section .accordion-toggle' ).append(\" <span class='spinner'><i class='fa fa-spinner fa-spin'></i></span>\"); \
						}, \
						success: function(data){ \
							console.log('Success: open bundle library' ); \
							$( '#collapseBundles .panel-body' ).html( data['html'] ); \
							setTimeout(function() \
							{ \
								$('#profile_bundle_section .accordion-toggle:not([aria-expanded=\"true\"])').click(); \
							}, 500); \
						}, \
						error: function(){ \
							console.log('Error: open bundle library' ); \
							setTimeout(openBundleLibrary, 500); \
						}, \
						complete: function(){ \
							openBundleLibraryAjaxSemaphore = false; \
							$('.spinner', $( '#profile_bundle_section .accordion-toggle' ) ).remove(); \
						}, \
					}); \
				} \
				setTimeout(openBundleLibrary, 1000); \
			";

			var eleClientScript = document.createElement("script");
			eleClientScript.innerHTML = clientScript;
			document.head.appendChild(eleClientScript);

			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_OpenLib";
			divButton.setAttribute("onclick", "openBundleLibrary()");

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Open Library";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);
		}

		if (url.indexOf("/successpay") > -1 || url.indexOf("/givmessage?message=ok") > -1)
		{
			setTimeout(function()
			{
				window.location = "/profile";
				/*
				var eleBtn = document.querySelector("#faang.fa-angle-down");
				if (eleBtn)
				{
					eleBtn.click();
				}
				*/
			}, 10000);
		}
	}
	else if (url.indexOf("orlygift.com") > -1)
	{
		if (window !== window.parent)
			return;

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				var apps = [];

				var eleApps = document.querySelectorAll("div[id^='game-detail-'] a.btn-primary[href^='http://store.steampowered.com/app/']");
				console.log("Apps: " + eleApps.length);

				for (var i = 0; i < eleApps.length; i++)
				{
					var app = /[0-9]+/.exec(eleApps[i].getAttribute("href"));
					if (app != null)
					{
						apps.push(app[0]);
					}
				}

				apps = apps.filter(function(elem, index, self)
				{
					return index == self.indexOf(elem);
				});

				var appAll = apps.join(",");

				GM_xmlhttpRequest(
				{
					method: "GET",
					headers:
					{
						"Cache-Control": "max-age=0"
					},
					url: "https://store.steampowered.com/api/appuserdetails/?appids=" + appAll,
					onload: function(response)
					{
						var dataRes = JSON.parse(response.responseText);

						var countOwned = 0;

						var elePrds = document.querySelectorAll(".box-game");
						var eleApps = document.querySelectorAll("div[id^='game-detail-']");
						for (var i = 0; i < eleApps.length; i++)
						{
							var eleApp = eleApps[i].querySelector("a.btn-primary[href^='http://store.steampowered.com/app/']");
							if (eleApp != null)
							{
								var app = /[0-9]+/.exec(eleApp.getAttribute("href"));
								if (app != null)
								{
									if (typeof dataRes[app] !== "undefined")
									{
										if (dataRes[app].success)
										{
											if (dataRes[app].data.is_owned)
											{
												var eleLabel = elePrds[i];
												eleLabel.classList.add("bh_owned");
												countOwned++;
											}
											else
											{
												console.log("App: not owned - " + app);
											}
										}
										else
										{
											console.log("App: not success - " + app);
										}
									}
								}
							}
						}

						console.log("Apps: owned - " + countOwned);

					} // End onload
				});

			});
		}
	}
	else if (url.indexOf("cubicbundle.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #91BA07 !important; } "
		);
		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned(".price a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement.parentElement.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("dailyindiegame.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned, .bh_owned a, .bh_owned a:not(:visited) .DIG2content { color: #202020 !important; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				if (document.querySelectorAll(".DIG-content a[href*='store.steampowered.com/']").length > 0)
				{
					markOwned(".DIG-content a[href*='store.steampowered.com/']", function(ele)
					{
						return ele.parentElement
							.parentElement.parentElement
							.parentElement.parentElement;
					}, null, "bh_owned");
				}
				else
				{
					markOwned(".DIG2content a[href*='store.steampowered.com/']", function(ele)
					{
						return ele.parentElement.parentElement;
					}, null, "bh_owned");

					markOwned(".DIG3_14_Gray a[href*='store.steampowered.com/']", function(ele)
					{
						return ele.parentElement.parentElement.parentElement;
					}, null, "bh_owned");
				}
			});
		}
	}
	else if (url.indexOf("bundlekings.com") > -1)
	{
		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned(".content-wrap a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("otakumaker.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #91BA07 !important; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned(".gantry-width-spacer a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("otakubundle.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #91BA07 !important; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned("#hikashop_product_left_part > .g-grid > .g-block "
					+ " > .g-block > a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("gogobundle.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #91BA07 !important; border: 1px solid white; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned(".g-block > .g-block > a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("superduperbundle.com") > -1)
	{
		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned("#gameslist a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("gamebundle.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #A0CC41 !important; border-bottom: 45px solid rgba(233, 233, 233, 0.5); } "
			+ " .bh_owned .activebundle_game_bundle_debut_title { background-color: #A0CC41 !important; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned(".activebundle_game_section_full a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("humblebundle.com") > -1)
	{
		GM_addStyle(
			"   .game-box img { max-height: 180px !important; max-width: 130px !important; } "
			+ " .image-grid { animation: none !important; } "
		);

		var rgxBta = /Pay more than the average of (.[0-9\.]+).+/i;
		var rgxFix = /Pay (.[0-9\.]+) or more to also unlock!/i;
		var strPay = "Pay ";
		var price = "";

		var elesPrice = document.querySelectorAll(".dd-header-headline");
		for (var i = 0; i < elesPrice.length; i++)
		{
			var priceRaw = elesPrice[i].textContent.trim();
			if (rgxBta.test(priceRaw))
			{
				price = priceRaw.replace(rgxBta, "$1");
				break;
			}
			else if (rgxFix.test(priceRaw))
			{
				price = priceRaw.replace(rgxFix, "$1");
				break;
			}
		}

		if (!price && elesPrice.length >= 3 && elesPrice.length <= 4)
		{
			var priceRaw = elesPrice[1].textContent.trim();
			if (priceRaw.indexOf(strPay) > -1)
			{
				price = priceRaw.replace(strPay, "").replace("+", "");
			}
		}

		if (price)
		{
			document.title = price + " " + document.title;
		}

		var eleSold = document.querySelector(".heading-bundles-sold .mini-digit-holder");
		if (eleSold != null)
		{
			var sold = eleSold.getAttribute("data-initial-value") || "";
			eleSold.parentElement.parentElement.setAttribute("title", sold);
		}

		var countRetrySold = 10;
		var tmRetrySold = setInterval(function()
		{
			var sold = "";
			var elesSold = document.querySelectorAll(".hr-main-container .mini-digit-holder .top-cutter .heading-num");
			for (var i = 0; i < elesSold.length; i++)
			{
				sold = sold + "" + elesSold[i].textContent.trim();
			}

			if (sold !== "")
			{
				clearInterval(tmRetrySold);

				var eleCount = document.querySelector(".hr-tagline-bundles-sold");
				if (eleCount)
				{
					eleCount.textContent += " (" + sold.replace(/^0+/, "") + ")";
				}
			}

			if (countRetrySold < 0)
			{
				clearInterval(tmRetrySold);
			}
			countRetrySold--;
		}, 1000);

		if (url.indexOf("/downloads") > -1)
		{
			GM_addStyle(
				"   #steam-tab .redeem-instructions, #steam-tab .recommend-this-game { display: none; } "
				+ " #papers-content { margin-bottom: 300px; } "
			);

			attachOnLoad(function()
			{
				setTimeout(function()
				{
					var elesClick = document.querySelectorAll(".keyfield-value");
					if (elesClick.length === 1)
					{
						var eleFocus = document.querySelector(".expiration-messaging");
						if (eleFocus)
						{
							eleFocus.parentElement.scrollIntoView();
							window.scrollBy(0, -100);
							
                            elesClick[0].click();
                        }
					}

				}, 2000);
			});

			/*setTimeout(function()
			{
				var elesKey = document.querySelectorAll(".sr-redeemed-bubble");
				for (var i = 0; i < elesKey.length; i++)
				{
					elesKey[i].addEventListener("click", function (e)
					{
						var ele = e.target;
						clickToSelect(ele);
					});
				}
			}, 3000);*/
		}
		else if (url.indexOf("/receipt") > -1)
		{
			setTimeout(function()
			{
				var eleClick = document.querySelector(".js-success-redirect a");
				if (eleClick)
				{
					eleClick.click();
				}
			}, 10000);
		}
		else if (url.indexOf("/emailhelper") > -1)
		{
			setTimeout(function()
			{
				var eleClicks = document.querySelectorAll("a[href*='/?key=']");
				if (eleClicks.length > 0 && eleClicks.length < 3)
				{
					eleClicks[0].click();
				}
			}, 3000);
		}
		else if (url.indexOf("/store/") > -1)
		{
			setTimeout(function()
			{
				var elePrice = document.querySelector(".current-price.free");
				if (elePrice)
				{
					scrollToElement(elePrice, -500);
				}
			}, 3000);
		}
	}
	else if (url.indexOf("steamcompanion.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned.banner { margin-bottom: 5px !important; margin-top: 35px !important; "
			+ "   padding-bottom: 15px !important; padding-top: 15px !important; } "
			+ " .bh_owned.giveaway-links { opacity: 0.75; } "
		);

		markOwned("#hero a[href*='store.steampowered.com/']"
			, null, null, "bh_owned");

		// Mark
		{
			var query = ".giveaway-links img[src^='https://steamcdn-a.akamaihd.net/steam/apps/']";
			var getLabelCallback = function(ele)
			{
				return ele.parentElement.parentElement.parentElement;
			};

			var apps = [];

			var eleApps = document.querySelectorAll(query);

			for (var i = 0; i < eleApps.length; i++)
			{
				var app = /[0-9]+/.exec(eleApps[i].getAttribute("src"));
				if (app != null)
				{
					apps.push(app[0]);
				}
			}

			apps = apps.filter(function(elem, index, self)
			{
				return index == self.indexOf(elem);
			});

			console.log("Apps: " + apps.length);
			var appAll = apps.join(",");

			GM_xmlhttpRequest(
			{
				method: "GET",
				headers:
				{
					"Cache-Control": "max-age=0"
				},
				url: "https://store.steampowered.com/api/appuserdetails/?appids=" + appAll,
				onload: function(response)
				{
					var dataRes = JSON.parse(response.responseText);

					var countOwned = 0;

					var eleApps = document.querySelectorAll(query);
					for (var i = 0; i < eleApps.length; i++)
					{
						var appUrl = eleApps[i].getAttribute("src");
						if (appUrl.indexOf("https://steamcdn-a.akamaihd.net/steam/apps/") > -1)
						{
							var app = /[0-9]+/.exec(appUrl);
							if (app != null)
							{
								if (typeof dataRes[app] !== "undefined")
								{
									if (dataRes[app].success)
									{
										if (dataRes[app].data.is_owned)
										{
											var eleLabel = getLabelCallback(eleApps[i]);
											eleLabel.classList.add("bh_owned");
											countOwned++;
										}
										else
										{
											//console.log("App: not owned - http://store.steampowered.com/app/" + app + "/");
										}
									}
									else
									{
										//console.log("App: not success - https://steamdb.info/app/" + app + "/");
									}
								}
							}
						}
					}

					console.log("Apps: owned - " + countOwned);

				} // End onload
			});
		}
	}
	else if (url.indexOf("store.steampowered.com") > -1)
	{
		if (url.indexOf("/widget/") > -1)
		{
			GM_addStyle(
				"   .bh_owned { background-color: transparent !important; } "
				+ " .bh_owned a { color: #71A034 !important; }"
			);

			markOwned(".main_text a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement;
			}, null, "bh_owned");
		}
		else if (url.indexOf("/app/") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   background-color: #6D8C1A !important; "
				+ "   padding: 0px 2px 0px 2px; "
				+ " } "
			);

			markOwned(".glance_details p > a[href*='store.steampowered.com/']"
				+ ", .game_area_dlc_bubble  a[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}
		else if (url.indexOf("/notinterested/") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   background-color: #6D8C1A !important; "
				+ "   padding: 5px 100px 5px 5px !important; "
				+ "   margin-left: -5px; margin-right: 50px; "
				+ " } "
			);

			markOwned(".ignoredapps > a[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}
		else if (url.indexOf("/search/") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   background-color: #6D8C1A66 !important; "
				+ " } "
			);

			markOwned(".search_result_row[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}
	}
	else if (url.indexOf("steamcommunity.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #71A034 !important; "
			+ "   padding: 0px 2px 0px 2px; } "
			+ " .bh_owned.blotter_userstatus_game { padding: 0px; border-color: #71A034; } "
		);

		if (url.indexOf("/home") > -1)
		{
			var querySteamHome = ".blotter_gamepurchase_details a[href*='store.steampowered.com/']:not(.bh_owned) "
				+ ", .blotter_author_block a[href*='store.steampowered.com/']:not(.bh_owned) "
				+ ", .blotter_author_block a[href*='steamcommunity.com/app/']:not(.bh_owned) "
				+ ", .blotter_daily_rollup_line a[href*='steamcommunity.com/app/']:not(.bh_owned) ";
			markOwned(querySteamHome, function(ele, type)
			{
				if (type === 1)
				{
					if (ele.classList.contains("blotter_userstats_game"))
					{
						ele.parentElement.classList.add("bh_owned");
					}
					else
					{
						ele.classList.add("bh_owned");
					}
				}
			});

			var targetObMark = document.getElementById("blotter_content");
			if (targetObMark)
			{
				var tmObMark = -1;
				var obMark = new MutationObserver(function(mutations)
				{
					mutations.forEach(function(mutation)
					{
						clearTimeout(tmObMark);
						tmObMark = setTimeout(function(querySteamHome)
						{
							markOwned(querySteamHome, function(ele, type)
							{
								if (type === 1 && !ele.classList.contains("blotter_userstats_game"))
								{
									ele.classList.add("bh_owned");
								}
							});

						}, 100, querySteamHome);
					});
				});

				var configObMark = { childList: true };
				obMark.observe(targetObMark, configObMark);
			}
		}
		else if (url.indexOf("/announcements") > -1)
		{
			markOwned(".announcement_body a[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}
	}
	else if (url.indexOf("forums.steampowered.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #71A034 !important; "
			+ "   padding: 0px 2px 0px 2px;"
			+ " } "
		);

		markOwned("div[id^='post_message'] a[href*='store.steampowered.com/']"
			, null, null, "bh_owned");
	}
	else if (url.indexOf("whosgamingnow.net") > -1)
	{
		if (url.indexOf("/discussion") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   padding: 0px 2px 0px 2px;"
				+ " } "
			);

			markOwned(".MessageList a[href*='store.steampowered.com/']"
				, null, null, "bh_owned");
		}
		else if (url.indexOf("/redeem") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   border: 1px solid #FFF;"
				+ " } "
				+ " .bh_owned .BoxArt { "
				+ "   border: 0px !important;"
				+ " } "
			);

			markOwned(".GameInfo a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement.parentElement.parentElement;
			});
		}
		else if (url.indexOf("/giveaway") > -1)
		{
			GM_addStyle(
				"   .bh_owned { "
				+ "   border: 5px solid #7CA156;"
				+ " } "
			);

			markOwned("img[src*='://cdn.akamai.steamstatic.com/steam/']"
				, null, null, "bh_owned");
		}
	}
	else if (url.indexOf("steamground.com") > -1 && url.indexOf("/wholesale") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #48B24B !important; } "
			+ " .bh_owned .wholesale-card_title { color: #373d41 !important; } "
			+ " .bh_steam { display: none; } "
		);

		var elesTitle = document.querySelectorAll(".wholesale-card_title");
		if (elesTitle.length > 0)
		{
			GM_xmlhttpRequest(
			{
				method: "GET",
				url: "https://www.steamgifts.com/discussion/iy081/steamground-wholesale-build-a-bundle",
				onload: function(response)
				{
					var data = response.responseText;
					var eleContainer = document.createElement("div");
					eleContainer.innerHTML = data;

					var eleComment = eleContainer.querySelector(".comment__description");
					if (eleComment)
					{
						var elesGame = eleComment.querySelectorAll("table td:nth-child(1) a[href*='store.steampowered.com/']");
						if (elesGame.length > 0)
						{
							var arrTitle = [];
							for (var i = 0; i < elesTitle.length; i++)
							{
								arrTitle.push(elesTitle[i].textContent.trim());
							}

							for (var i = 0; i < elesGame.length; i++)
							{
								var isMatch = false;
								var game = elesGame[i].textContent.trim().toLowerCase();
								for (var j = 0; j < elesTitle.length; j++)
								{
									var title = elesTitle[j].textContent.trim().toLowerCase();
									if (game === title
										|| (title.indexOf("|") > -1 && game === title.replace("|", ":"))
										|| (game === "ball of light" && title === "ball of light (journey)")
										|| (game === "its your last chance in new school" && title === "it is yоur last chance in new schооl")
										|| (game === "shake your money simulator 2016" && title === "shake your money simulator")
										|| (game === "spakoyno: back to the ussr 2.0" && title === "spakoyno back to the ussr 2.0")
										|| (game === "or" && title === "or!"))
									{
										isMatch = true;

										arrTitle = arrTitle.filter(function(value)
										{
											return value !== elesTitle[j].textContent.trim()
										});
									}

									if (isMatch)
									{
										var eleA = document.createElement("a");
										eleA.classList.add("bh_steam");
										eleA.href = elesGame[i].href;
										elesTitle[j].parentElement.parentElement.appendChild(eleA);

										break;
									}
								}
								if (!isMatch)
								{
									console.log("Not match: " + elesGame[i].href + " " + elesGame[i].textContent);
								}
							}

							if (arrTitle.length > 0)
							{
								console.log("Not match: " + arrTitle.length);
								for (var i = 0; i < arrTitle.length; i++)
								{
									console.log("Not match: " + arrTitle[i]);
								}
							}

							markOwned(".wholesale-card > a[href*='store.steampowered.com/']", function(ele)
							{
								return ele.parentElement;
							}, null, "bh_owned");
						}
					}

				} // End onload
			});
		}
	}
	else if (url.indexOf("bunchkeys.com") > -1)
	{
		GM_addStyle(
			"   .bh_owned { border: #B5D12E 3px solid !important; "
			+ "   margin-left: -3px; margin-top: -3px; } "
		);

		// Add mark button
		{
			var divButton = document.createElement("div");
			divButton.classList.add("bh_button");
			divButton.id = "bh_markOwned";

			var eleA = document.createElement("a");
			eleA.setAttribute("onclick", "return false;");
			eleA.textContent = "Mark Owned";

			divButton.appendChild(eleA);
			document.body.appendChild(divButton);

			divButton.addEventListener("click", function()
			{
				markOwned("a[href*='store.steampowered.com/']", function(ele)
				{
					return ele.parentElement;
				}, null, "bh_owned");
			});
		}
	}
	else if (url.indexOf("sgtools.info") > -1)
	{
		GM_addStyle(
			"   .bh_owned { background-color: #71A034 !important; } "
		);
		if (url.indexOf("/lastbundled") > -1)
		{
			markOwned("#content > div > table > tbody > tr > td > a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement.parentElement;
			}, null, "bh_owned");
		}
		else if (url.indexOf("/deals") > -1)
		{
			markOwned(".deal_game_image > img[src*='cdn.akamai.steamstatic.com/steam/']", function(ele)
			{
				return ele.parentElement;
			}, null, "bh_owned");
		}
		else if (url.indexOf("/whitelisted") > -1)
		{
			markOwned(".cmGame > a[href*='store.steampowered.com/']", function(ele)
			{
				return ele.parentElement;
			}, null, "bh_owned");
		}
	}
	else if (url.indexOf("steamkeys.ovh") > -1)
	{
		markOwned("td > a[href*='store.steampowered.com/']", function(ele)
		{
			return ele.parentElement.parentElement;
		}, null, "bh_owned");
	}
	else if (url.indexOf("steamdb.info") > -1)
	{
		if (window !== window.parent)
		{
			return;
		}

		GM_addStyle(
			"   .bh_owned, tr.bh_owned td { background-color: #DDF7D3 !important; } "
			+ " .bh_owned_transparent { background-color: #bcf0a880 !important; } "
		);

		markOwned(" \
			#apps .app \
			, #dlc .app \
			, .container > .table .app \
			, .sales-section .app \
			, .page-search .app \
			", null, function(ele)
		{
			return ele.getAttribute("data-appid");
		}, "bh_owned");

		markOwned(" \
			#subs .package \
			, .sales-section .package \
			, .page-search .package \
			", null, function(ele)
		{
			return "/steam/subs/" + ele.getAttribute("data-subid");
		}, "bh_owned");

		markOwned(".table-products .app"
			, null, function(ele)
		{
			return ele.getAttribute("data-appid");
		}, "bh_owned_transparent");

		markOwned(".app-history .appid"
			, function(ele)
		{
			return ele.parentElement;
		}, function(ele)
		{
			return ele.textContent.trim();
		}, "bh_owned");
	}

	window.addEventListener("beforeunload", function(e)
	{
		clearTimeoutAll();
		clearIntervalAll();
	});
}

attachOnReady(main);

})();

// End
