// ==UserScript==
// @name         esin
// @description  Created for Esin.
// @match        https://twitter.com/*
// @exclude      https://twitter.com/explore
// @exclude      https://twitter.com/messages/*
// @version      2.0
// @namespace https://greasyfork.org/users/719113
// @downloadURL https://update.greasyfork.org/scripts/418918/esin.user.js
// @updateURL https://update.greasyfork.org/scripts/418918/esin.meta.js
// ==/UserScript==

(function ()
{
	'use strict';
	console.log("V2.0 Deneme")
	var twitter = 0;
	var button = document.createElement("button");

	function waitForElementToDisplay(selector, time)
	{
		if (document.querySelector(selector) != null)
		{
            console.log("...");
			button.innerText = "Türkiye'deki Trendleri Göster"
			button.onclick = function ()
			{
				if (twitter == 1)
				{ // Trendler gösteriliyorsa
					document.querySelector("div[aria-label^='Zaman Akışı: Gündemdekiler']").style.display = "none";
					twitter = 0;
					button.innerText = "Türkiye'deki Trendleri Göster";
				}
				else
				{
					document.querySelector("div[aria-label^='Zaman Akışı: Gündemdekiler']").style.display = "block";
					twitter = 1;
					button.innerText = "Türkiye'deki Trendleri Gizle";
				}
			};
			document.querySelector("div[aria-label^='Zaman Akışı: Gündemdekiler']").style.display = "none";
			document.querySelector("nav").append(button);
			return;
		}
		else
		{
			setTimeout(function ()
			{
				waitForElementToDisplay(selector, time);
			}, time);
		}
	}
	waitForElementToDisplay("div[aria-label^='Zaman Akışı: Gündemdekiler']", 1000);
})();