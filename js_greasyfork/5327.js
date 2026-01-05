// ==UserScript==
// @name     		Steamlessness Helper
// @namespace		iFantz7E.SlnHelper
// @version		1.12
// @description		Show only first time games in Steamlessness Companion
// @match      		http://steamlessness.appspot.com/?someSteamIdentifier=*
// @icon      		http://steamlessness.appspot.com/favicon.ico
// @grant       	GM_addStyle
// @copyright		2014, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/5327/Steamlessness%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5327/Steamlessness%20Helper.meta.js
// ==/UserScript==

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
	
function reload()
{
	window.location = window.location.href;
}

function hideGame()
{
	var earn = 0;
	var as = document.querySelectorAll("tr > td:nth-child(3) > a:nth-child(1)");
	for (var i = 0; i < as.length; i++)
	{
		var isHidden = false;
		var isOwned = true;
		
		var tr = as[i].parentElement.parentElement;
		var text = as[i].textContent.trim().toLowerCase();
		if (text != "play for the first time" 
			&& text != "play for 1 hours")
		{
			isHidden = true;
		}
		else
		{
			var obt = tr.querySelector("td:nth-child(7)");
			if (obt == null || obt.textContent.indexOf("Available") != 0)
			{
				isOwned = false;
			}		
		}
		
		if (isHidden)
		{
			tr.style.display = "none";
		}
		else
		{
			if (isOwned)
			{
				var reward = tr.querySelector("td:nth-child(4)");
				if (reward != null)
				{
					var text = reward.textContent.trim();
					if (text.indexOf("£") == 0)
					{
						earn += parseInt(reward.textContent.trim());
					}
				}
			}
			
			var rare = tr.querySelector("td:nth-child(8)");
			if (rare != null)
			{
				var app = tr.querySelector("td:nth-child(9) > a:nth-child(1)");
				if (app != null)
				{
					rare.textContent = app.getAttribute("href").replace("http://store.steampowered.com/app/","");
				}
			}
		}
	}

	var thRare = document.querySelector("th.header:nth-child(8)");
	if (thRare != null)
	{
		thRare.textContent = "app id";
		thRare.setAttribute("title", "Steam App ID");
	}
	
	var hEarn = document.querySelector("#slnh_earn");
	if (hEarn != null)
	{
		hEarn.textContent = ("You can earn from first playing: £" + earn * 0.01);
	}
}
	
function main() 
{
	GM_addStyle(
		" tr > td:nth-child(9) { width: 100px; } "
		+ " tr > td:nth-child(2) { width: 50px; } "
		+ " #myTable { width: 1100px; } "
	);
		
	var inputSync = document.querySelector("#userIdSubmitSync");
	if (inputSync != null)
	{
		inputSync.parentElement.innerHTML += " <input id='slnh_showfirst' type='button' value='Show only first playing' class='ui-button ui-widget ui-state-default ui-corner-all'></input> <h3 id='slnh_earn'> </h3>";
	
		var inputHide = document.querySelector("#slnh_showfirst");
		if (inputHide != null)
		{
			inputHide.addEventListener("click", function (e) 
			{
				hideGame();
			});
		}
	}
	else
	{
		debug("refresh: activated");
		setTimeout(reload, 3000);
	}
}



attachOnLoad(main);

// End

