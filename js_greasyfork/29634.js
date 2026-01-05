// ==UserScript==
// @name        Steam Auto Sign In
// @namespace   iFantz7E.SteamAutoSignIn
// @description Auto sign in through Steam for each third-party site.
// @version     1.03
// @match       https://steamcommunity.com/openid/login*
// @match       https://steamcommunity.com/oauth/login*
// @icon        https://store.steampowered.com/favicon.ico
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @copyright   2017, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/29634/Steam%20Auto%20Sign%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/29634/Steam%20Auto%20Sign%20In.meta.js
// ==/UserScript==

(function ()
{
	"use strict";
	// jshint multistr:true

function attachOnReady(callback) 
{
	document.addEventListener("DOMContentLoaded", function (e) 
	{
		callback();
	});
}

function insertAfterElement(newNode, referenceNode) 
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var tmAutoSignIn = -1;

function stopAutoSignIn()
{
	console.log("AutoSignIn: Stop");
	clearTimeout(tmAutoSignIn);
}

function startAutoSignIn()
{
	var tm = 3000;
	console.log("AutoSignIn: Next in " + tm + "ms");
	
	clearTimeout(tmAutoSignIn);
	tmAutoSignIn= setTimeout(function ()
	{
		var eleCheck = document.querySelector("#sasi_autoSignIn");
		if (eleCheck && eleCheck.checked)
		{
			var eleErr = document.querySelector("#error_display");
			if (eleErr && eleErr.textContent.trim() !== "")
			{
				eleCheck.checked = false;
				console.log("AutoSignIn: Error SignIn");
			}
			else
			{
				var eleSignIn = document.querySelector("#openidForm > #imageLogin");
				if (eleSignIn)
				{
					eleSignIn.click();
				}
			}
		}
	}, tm);
}

function main() 
{
	GM_addStyle(" \
		#openidForm > #imageLogin { margin-right: 12px; } \
		.sasi_autoSignInLabel { padding: 10px 10px 10px 4px; \
		  display: inline-block; max-width: 98%; \
		  white-space: nowrap; overflow: hidden; \
		  text-overflow: ellipsis; vertical-align: middle; } \
		.sasi_autoSignInLabel, .sasi_autoSignInLabel * { cursor: pointer; } \
		#sasi_autoSignIn { vertical-align: middle; margin-bottom: 4px; } \
		.sasi_site { color: #67c1f5; } \
		.sasi_unselectable, .sasi_unselectable * { \
			-webkit-touch-callout: none !important; \
			-webkit-user-select: none !important; \
			-khtml-user-select: none !important; \
			-moz-user-select: none !important; \
			-ms-user-select: none !important; \
			user-select: none !important; } \
	");
	
	// Support all languages
	var rgxSite = /[ „]{1}([a-z0-9\-]+\.[a-z0-9\-\.]+|Steam Translation Server|Bohemia Interactive|SEGA)[ “에]{1}/i;
	
	var eleH = document.querySelector(".OpenID_MainHeader > h1");
	if (eleH)
	{
		var siteMatch = (" " + eleH.textContent.trim() + " ").match(rgxSite);
		if (siteMatch && siteMatch.length > 0 && siteMatch[0].length > 5)
		{
			var site = siteMatch[0].substr(1, siteMatch[0].length - 2);
			var keySite = "autoSignIn___" + site;
			
			var eleSignIn = document.querySelector("#openidForm > #imageLogin");
			if (eleSignIn)
			{
				var eleSpan = document.createElement("span");
				eleSpan.classList.add("sasi_autoSignInSection");

				var eleInput = document.createElement("input");
				eleInput.id = "sasi_autoSignIn";
				eleInput.setAttribute("type", "checkbox");
				eleInput.setAttribute("value", "true");

				if (GM_getValue(keySite, 0) === 1)
				{
					eleInput.checked = true;
					startAutoSignIn();
				}

				eleInput.addEventListener("click", function (e)
				{
					var ele = e.target;
					
					if (ele.checked)
					{
						GM_setValue(keySite, 1);
						startAutoSignIn();
					}
					else
					{
						GM_setValue(keySite, 0);
						stopAutoSignIn();
					}
				});

				var eleSpanSite = document.createElement("span");
				eleSpanSite.classList.add("sasi_site");
				eleSpanSite.textContent = site;
				
				var eleLabel = document.createElement("label");
				eleLabel.classList.add("sasi_autoSignInLabel");
				eleLabel.classList.add("sasi_unselectable");

				eleLabel.appendChild(eleInput);
				eleLabel.appendChild(document.createTextNode(" Auto sign into "));
				eleLabel.appendChild(eleSpanSite);
				
				eleSpan.appendChild(eleLabel);
				
				insertAfterElement(eleSpan, eleSignIn);
			}
		}
	}
}

attachOnReady(main);
	
})();

// End
