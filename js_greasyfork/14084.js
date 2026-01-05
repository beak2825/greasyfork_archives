// ==UserScript==
// @version 2.3
// @name Hacker_Experience_Log_Listener
// @namespace https://greasyfork.org/pl/scripts/14084-hacker-experience-log-listener/code/Hacker_Experience_Log_Listener.user.js
// @description automatically notifies you when someone hacks into you and throws pop-up window with his ip
// @include https://hackerexperience.com/log
// @author szonek
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14084/Hacker_Experience_Log_Listener.user.js
// @updateURL https://update.greasyfork.org/scripts/14084/Hacker_Experience_Log_Listener.meta.js
// ==/UserScript==    



javascript:(function()
{
	//checking if helogsaver exists in memory if not creating such container
	if(!localStorage.getItem("helogsaver")) localStorage.setItem("helogsaver","");
	
		//creating button showin stored ips
	setTimeout(function()
	{
		var element=document.getElementsByClassName("nav btn-group");
		var przycisk = document.createElement('li');
		przycisk.setAttribute("class", "btn btn-inverse");
		var a=document.createElement('a');
		a.setAttribute("href","javascript:(function(){alert(localStorage.getItem('helogsaver'));})();");
		var icon=document.createElement('i');
		icon.setAttribute("class","fa fa-inverse fa-book");
		var napis=document.createElement('span');
		napis.setAttribute("class","text");
		napis.textContent="Log Listener";
		//appending parts to menubar
		a.appendChild(icon);
		a.appendChild(napis);
		przycisk.appendChild(a);
		element[0].insertBefore(przycisk,element[0].childNodes[0]);
	},1000);
	
	//he log listener
	var logtxt=document.getElementsByClassName('logarea')[0].innerHTML;
	var logline=logtxt.slice(0,logtxt.indexOf("\n"));
	var hackerip=/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g.exec(logline);
	var savedips=localStorage.getItem("helogsaver");
	if (logtxt.search(hackerip)==20)
	{
		if(savedips.search(hackerip)==-1)
		{
			new Audio("http://soundbible.com/mp3/Tornado_Siren_II-Delilah-747233690.mp3").play();
			localStorage.removeItem("helogsaver");
			localStorage.setItem("helogsaver",hackerip+"\n"+savedips);
			alert(hackerip);
		}
	}
	else 
	{
		setTimeout(function(){location.reload(true);},5000)
	}
})();