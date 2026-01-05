// ==UserScript==
// @name          Wayback Machine Timeline Compressor
// @namespace     DoomTay
// @description   Trims the capture graph timeline to only the earliest and latest years
// @version       1.0.5
// @include       /https?:\/\/(web|wayback)\.archive\.org\/web\//
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/16055/Wayback%20Machine%20Timeline%20Compressor.user.js
// @updateURL https://update.greasyfork.org/scripts/16055/Wayback%20Machine%20Timeline%20Compressor.meta.js
// ==/UserScript==

var rangeOfYears = ((new Date()).getFullYear() - 1995);

var smallTimelineLength = 25 * rangeOfYears;
var bigTimelineLength = 49 * rangeOfYears;

var smallTimeline = document.querySelector("#sparklineImgId[width = \"" + smallTimelineLength + "\"]");
var bigTimeline = document.querySelector("#sparklineImgId[width = \"" + bigTimelineLength + "\"]");

if(smallTimeline)
{
	smallTimeline.src = smallTimeline.src.replace(new RegExp("(/web/jsp/graph\\.jsp\\?graphdata=" + smallTimelineLength + "_27)(?:_\\d\\d\\d\\d:-1:000000000000)+|(?:_\\d\\d\\d\\d:-1:000000000000)+$","g"), "$1");
	
	var startYear = parseInt(smallTimeline.src.substr(smallTimeline.src.search(/\d\d\d\d:/),4));
	var lastYear = parseInt(smallTimeline.src.substr(smallTimeline.src.search(/\d\d\d\d(?!.*\d\d\d\d:)/),4));
	var yearRange = (lastYear - startYear) + 1;
	var timelineScript = Array.prototype.find.call(document.scripts,script => script.innerHTML.includes(smallTimelineLength + ", 27"));
	if(timelineScript)
	{
		var newScript = document.createElement("script");
		newScript.type = "text/javascript";
		newScript.innerHTML = timelineScript.innerHTML.replace("(" + smallTimelineLength + ", 27, 25, 2)","(" + smallTimelineLength + ", 27, " + (smallTimelineLength / yearRange) + ", " + (smallTimelineLength - yearRange)/(12 * yearRange) + ")").replace(/firstYear = \d\d\d\d/,"firstYear = " + startYear);
		timelineScript.parentNode.replaceChild(newScript,timelineScript);
		var yt = document.querySelector(".yt");
		if(yt) yt.parentNode.removeChild(yt);
		var mt = document.querySelector(".mt");
		if(mt) mt.parentNode.removeChild(mt);
		__wm.bt();
	}
	
}

if(bigTimeline)
{
	bigTimeline.src = bigTimeline.src.replace(/(\/web\/jsp\/graph.jsp\?nomonth=1&graphdata=1078_75)(?:_\d\d\d\d:-1:000000000000)+|(?:_\d\d\d\d:-1:000000000000)+$/g, "$1");
	
	var lastYear = parseInt(bigTimeline.src.substr(bigTimeline.src.search(/\d\d\d\d(?!.*\d\d\d\d:)/),4));				
	
	window.firstYear = parseInt(bigTimeline.src.substr(bigTimeline.src.search(/\d\d\d\d:/),4));
	window.startYear = parseInt(window.location.href.substr(window.location.href.indexOf("archive.org/web/") + 16,4)) - firstYear;
	var yearRange = (lastYear - firstYear) + 1;
	window.yearImgWidth = (bigTimelineLength / yearRange);
	window.monthImgWidth = (bigTimelineLength - yearRange)/(12 * yearRange);
	document.getElementById("wbMouseTrackYearImg").style.width = (Math.round(10*yearImgWidth)/10) + "px";
	var yearLabels = document.getElementsByClassName("year-label");
	for(var y = yearLabels.length - 1; y >= 0; y--)
	{
		while(y > -1 && (yearLabels[y].dataset.year > lastYear || yearLabels[y].dataset.year < firstYear))
		{
			var oldY = yearLabels.length - 1;
			yearLabels[y].parentNode.removeChild(yearLabels[y]);
			if(y == oldY) y--;
		}
	}
	
	var newYearStyle = document.createElement("style");
	newYearStyle.type = "text/css";
	newYearStyle.innerHTML = "a.year-label {width: " + (Math.round(10*(bigTimelineLength /yearRange))/10) + "px}\
	\
	a.year-label:last-child {width: " + (bigTimelineLength - ((Math.round(10*(bigTimelineLength /yearRange))/10) * (yearRange - 1))) + "px}";
	document.head.appendChild(newYearStyle);
}