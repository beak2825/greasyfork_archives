// ==UserScript==
// @name           Delayed Post Poince Shower
// @namespace      Slorum
// @include        http://*slorum.*/forum/view/?id=988*
// @include        http://*workwebpage.*/forum/view/?id=988*
// @grant	   none
// @description    Displays earned poince on the slorum game
// @version 0.0.1.20160330204524
// @downloadURL https://update.greasyfork.org/scripts/18375/Delayed%20Post%20Poince%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/18375/Delayed%20Post%20Poince%20Shower.meta.js
// ==/UserScript==

var lmnts = document.getElementsByTagName("h5");
var h6lmnts = document.body.getElementsByTagName("h6");
var timeString;
var dateTime;
var thisTime;
var lastTime;
var startPosition=0;
var jump=1;
var scoresJump=1;
var scores = new Array();

var h6Start=1;

if (h6lmnts[1].innerHTML.indexOf("stick")>0)
{
	h6Start=2;
}

//go through the list of h5 elements 
for (var i=h6Start;i<lmnts.length/2;i++)
{
	//pick out the time strings and derive the number of minutes since epoch
	thisTime = getTime(lmnts[i*2+1].innerHTML.split('M')[0].substring(23));
	lastTime = getTime(lmnts[i*2-1].innerHTML.split('M')[0].substring(23));

	scores.push(getPoince(thisTime-lastTime));
}

if (h6lmnts[1].innerHTML.indexOf("stick")>0)
 {
	h6lmnts[h6Start+1].innerHTML = '  <strong>Poince:</strong> 0' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + h6lmnts[h6Start+1].innerHTML; // do the new page 0 poince
	scoresJump=2;
 }
 else
 {
	h6lmnts[h6Start].innerHTML = '  <strong>Poince:</strong> 0' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + h6lmnts[h6Start].innerHTML; // do the new page 0 poince
 }

//go through the list and insert the Poince listings
for (var i=h6Start;i<h6lmnts.length/2;i++)
{
	h6lmnts[i*2+jump].innerHTML = '  <strong>Poince:</strong> '+scores[i-scoresJump] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +h6lmnts[i*2+jump].innerHTML;
}

function getTime(toGetFrom)
{
	dateTime = new Date();

	//leaves us with "9/24/09 @ 2:36 AM"
	timeString = toGetFrom;

	//set the Month, Day of the Month and Year
	var mnth = timeString.split('/')[0];
	mnth -=1;
	dateTime.setMonth(mnth);
	dateTime.setDate(timeString.split('/')[1]);
	dateTime.setFullYear('20'+timeString.split('/')[2].split(' ')[0]);

	//leaves us with " 2:36 AM"
	timeString = timeString.split('@')[1].substring(1);

	var hours=timeString.split(':')[0];
	var em = timeString.substring(timeString.length-2);

	//takes care of stupid 12AM / 12 PM problem
	if (em==' P')
	{
		if (hours!=12)
			hours=hours-0+12;
	}
	else
	{
		if (hours==12)
			hours=0;
	}

	//sets Hours and Minutes
	dateTime.setHours(hours);
	dateTime.setMinutes(timeString.split(':')[1].split(' ')[0]);

	return Math.round(dateTime.getTime()/60000);
}

function getPoince(diff)
{
	var poinceTimes = new Array(120,90,60,45,30,20,15,10,5,0);
	var poincePlus = new Array(200,130,80,50,30,15,8,3,1,0);

	for (var i=0;i<poinceTimes.length;i++)
	{
		if (diff >= poinceTimes[i])
			return poincePlus[i];
		else if (diff == poinceTimes[i]-1)
			return 0;
		else if (diff == poinceTimes[i]-2)
			return -5;
		else if (diff == 3)
			return 0;

	}

}