// ==UserScript==
// @name           OGame Redesign: Atack Watcher
// @namespace      Vesselin
// @version        1.00
// @date           2018-01-01
// @description    Displays a countdown timer for the Auction in OGame 4.*
// @include        http://*.ogame.*/game/index.php?*
// @downloadURL https://update.greasyfork.org/scripts/373352/OGame%20Redesign%3A%20Atack%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/373352/OGame%20Redesign%3A%20Atack%20Watcher.meta.js
// ==/UserScript==

(function ()
{
	alert("2");	
	
	var myFunc1 = (function ()
	{
	});
	
	
		var eventbox = document.getElementById('eventboxFilled');
	 
		if(eventbox)
		{
			var events = eventbox.innerHTML;
		    
		    if(events.search("враждебный") > 0)
		  	{
		    	alert(events.search("враждебный"));
		    }
		}
		else
		{
			alert("ошибка: не могу найти eventbox");
		}
		
	
	function alarmVib (duraction, interval)
	{
		alert("1");
		var vInterval = setInterval(function() { vibrate(duration); }, interval);
		clearInterval(vInterval);
		vibrate(0);		
	}
	
	if (document.location.href.indexOf ("/game/index.php?page=galaxy") >= 0)
		alarmVib (300, 1000);
	else if (document.getElementById ("attack_alert"))
		alarmVib (myFunc1);
}) ();