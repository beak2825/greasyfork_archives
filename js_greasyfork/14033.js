// ==UserScript==
// @version 1.16
// @name Hacker_Experience_Task_Manager_Notify_Sound
// @namespace https://greasyfork.org/pl//scripts/14033-hacker-experience-task-manager-notify/code/Hacker_Experience_Task_Manager_Notify_Sound.user.js
// @description notifies you when any of your processes has less than one secon till end
// @include https://hackerexperience.com/processes*
// @include https://hackerexperience.com/software*
// @include https://hackerexperience.com/internet*
// @author szonek
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14033/Hacker_Experience_Task_Manager_Notify_Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/14033/Hacker_Experience_Task_Manager_Notify_Sound.meta.js
// ==/UserScript==   



javascript:(function()
{


	var myVar;
	var times;
	times=document.getElementsByClassName('elapsed');
	myVar = setInterval(function()
	{
		for (var i=0; i<times.length; i++)
		{
			if (times[i].innerHTML=="0h:0m:1s")
			{
				new Audio("http://soundbible.com/mp3/flyby-Conor-1500306612.mp3").play();
				times[i]=null;
			}
		}
	}
	,800);
})();