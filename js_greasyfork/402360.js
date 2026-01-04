// ==UserScript==
// @name         Scrap.tf Raffle AutoEnter
// @version      1.6
// @description  Auto-enters raffles
// @namespace    http://steamcommunity.com/groups/Cannonknights
// @match        https://scrap.tf/raffles
// @match        https://www.scrap.tf/raffles
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402360/Scraptf%20Raffle%20AutoEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/402360/Scraptf%20Raffle%20AutoEnter.meta.js
// ==/UserScript==

(function () {
	function randominrange(low,high) {return Math.round(Math.random()*(high-low)+low);}
	
	function getElementsByClass(clas) {
		var ret = [];
		var elems = document.getElementsByTagName('*'), i;
		for (i in elems) {
			if((' ' + elems[i].className + ' ').indexOf(' '+clas+' ')
					> -1) {
				ret.push(elems[i]);
			}
		}
		return ret;
	}
	
	function notify(notify) { 
		var divid = "saer";
		var div = document.getElementById(divid); 
		if (!div) {
			var trades;
			var titles = getElementsByClass("panel-title"), i;
			for (i in titles) {
				if (titles[i].innerHTML == "Public Raffles") trades = (titles[i].parentNode).parentNode;
			}
			var div = document.createElement("div"); 
			div.id = divid; 
			trades.insertBefore(div, trades.childNodes[0]);
		}
		div.innerHTML = notify;
	}
	
	function showstatus() { 
		reload_time--; 
		if (reload_time <= 0) { 
			clearInterval(counter); 
			location.reload();
			return; 
		} 
		var hr = Math.floor(reload_time/3600);
		var min = Math.floor(reload_time/60)-hr*60;
		var sec = reload_time-((hr*3600)+(min*60));
		if (sec<10) notify("&nbsp; Scrap.tf Raffle AutoEnter: Reloading page in "+min+":0"+sec); 
		else notify("&nbsp; Scrap.tf Raffle AutoEnter: Reloading page in "+min+":"+sec);
	}
	
	var reload_time, counter, RELOAD_MINUTES, raffle, entered, won;
	var used = [];
	var elems = document.getElementsByTagName('*'), i;
	for (i in elems) {
		if (elems[i].className == "panel-raffle") {
			won = (elems[i].parentNode).id != "raffles-list";
			if (!won) {
				raffle = (elems[i].id).substr(11,6);
				if (elems[i].getAttribute("style")) entered = true;
				else entered = false;
				for (var a = 0; a <= used.length; a++) {
					if (used[a] == raffle) entered = true;
				}
				if (!entered) {
					ScrapTF.Raffles.EnterRaffle(raffle);
					used.push(raffle);
				}
			}
		}
	}
	reload_time = randominrange(20,40);
	counter = setInterval(showstatus, 1000);
}).call(this);