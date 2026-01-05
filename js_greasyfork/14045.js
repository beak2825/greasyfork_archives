// ==UserScript==
// @version 1.15
// @name Hacker_Experience_Log_Auto_Cleaner
// @namespace https://greasyfork.org/pl/scripts/14045-hacker-experience-log-auto-clearer/code/Hacker_Experience_Log_Auto_Clearer.user.js
// @description automatically clears log of servers you log into
// @include https://hackerexperience.com/internet*
// @author szonek
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14045/Hacker_Experience_Log_Auto_Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/14045/Hacker_Experience_Log_Auto_Cleaner.meta.js
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


	var a=document.getElementsByClassName('logarea')[0].innerHTML;
	var c=a.slice(0,a.indexOf("\n")+1);
	var hackerip=/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g.exec(c);
	var ownip=document.getElementsByClassName('header-ip-show')[0].textContent;
	if(a.search(hackerip)==20)
	{
		if (hackerip==ownip)
		{
			var d=a.replace(c,"");
			document.getElementsByClassName('logarea')[0].value=d;
			document.getElementsByClassName('btn btn-inverse')[5].click()
		}
	}
})();
