// ==UserScript==
// @name           New Torrents Marker
// @namespace      New Torrents Marker
// @description    Marks new torrents since last visit
// @version        1.0.11
// @grant          GM_getValue
// @grant          GM_setValue
// @match          *://www.torrentbytes.net/browse*
// @match          *://www.torrentleech.org/torrents/browse*
// @match          *://beta.torrentleech.org/torrents/browse*
// @match          *://scenehd.org/browse*
// @match          *://www.sparvar.org/browse*
// @downloadURL https://update.greasyfork.org/scripts/27791/New%20Torrents%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/27791/New%20Torrents%20Marker.meta.js
// ==/UserScript==

// var domain = location.hostname.match('([^\.]+)\.(be|biz|ca|com|de|eu|gr|in|info|it|me|name|net|no|org|pl|ro|ru|su|to|ua|us)$');
var domain = window.location.host.match(/(?:www\.)?(.*)/i);
var strGMValueName = domain[1]

// SETTINGS START

// String to mark new torrents
var strInsert = "<div class='newDiv'>NEW</div>";
// In what <td> to insert the above string, relative to which <td> date is found in.
var strInsertWhere = -3;
// Difference in seconds between local time and site time.
var strTimeDiff = 0;
// Start search at this <TD>, to stop false catches in header etc.
var strFirstTD = 25;
// Set this to true to stop marking at first page, otherwise it will keep marking until the last NEW is found.
var updateVisit = false;
// Add a "catchup" button in the bottom right corner.
// Useful if 'updateVisit = false' and you have several pages of NEW to read, but you don't want to.
var catchupButton = true;
// Only update visit with Catchup Button, useful when debugging
var catchupForce = false;
// Regex to find date + time.
var reDates = new RegExp("([0-9]{4}-[0-9]{2}-[0-9]{2}).*([0-9]{2}:[0-9]{2}:[0-9]{2})");

// Site specific settings. You can add the above settings here.
if (domain) {
    switch (domain[1]) {
      case 'torrentbytes.net':
			strInsertWhere = -3;
			// strTimeDiff = -3600;
			strFirstTD = 60;
		break;
      case 'torrentleech.org':
      case 'beta.torrentleech.org':
			strInsertWhere = 0;
			// strTimeDiff = +3600;
			strFirstTD = 35;
		break;
      case 'scenehd.org':
			strInsertWhere = -5;
			strTimeDiff = 0;
			strFirstTD = 50;
		break;
      case 'sparvar.org':
			strInsertWhere = -7;
			strTimeDiff = 0;
			strFirstTD = 25;
		break;
	}
}
// SETTINGS END

var sheet = document.createElement('style')
sheet.innerHTML = "\
	.newDiv { \
		float: right; \
		padding-top: 4px; \
		font-style: italic; \
		font-weight: bold; \
		font-size: 12px; \
		color: #ff0000; \
		z-index: 1000; \
	} \
	.newDiv:hover {color: green;} \
	#cbButton, #lvDiv { \
		position: fixed; \
		border-radius: 3px; \
		background: #ff0000; \
		padding:5px; \
		color: #fff; \
		cursor: pointer; \
		font-family: Verdana; \
		font-size:10px; \
		line-height: 10px; \
		text-shadow: 0pt 0pt 5px #000; \
		opacity:0.7; \
	} \
	#cbButton:hover, #lvDiv:hover {background: green; opacity:1;} \
	#cbButton { right: 10px; bottom: 10px; } \
	#lvDiv { left: 10px; bottom: 10px; font-size: 9px; } \
";
document.body.appendChild(sheet);

Date.prototype.defaultView=function(){
	var yyyy=this.getFullYear();
	var mm=this.getMonth()+1;
	if(mm<10)mm='0'+mm;
	var dd=this.getDate();
	if(dd<10)dd='0'+dd;
	var hh=this.getHours();
	if(hh<10)hh='0'+hh;
	var mmm=this.getMinutes();
	if(mmm<10)mmm='0'+mmm;
	var ss=this.getSeconds();
	if(ss<10)ss='0'+ss;
	return String(yyyy+"-"+mm+"-"+dd+" "+hh+":"+mmm+":"+ss)
}

var lastVisit = GM_getValue(strGMValueName, false);
if(lastVisit.length == 13) {
	var lvDiv = document.createElement("div");
	lvDiv.id = "lvDiv";
	lvDiv.innerHTML = "Last Visit: <br/>" + new Date(parseInt(lastVisit)).defaultView() + "<br />GMT: " + new Date(parseInt(lastVisit)).getTimezoneOffset()/60*-1;
	document.body.appendChild(lvDiv);

	var strDates = document.getElementsByTagName('td');
	for (i = strFirstTD; i < strDates.length; ++i) {
		var reMatch = reDates.exec(strDates[i].innerHTML);
		if (reMatch) {
			strTime=new Date(reMatch[1]).toDateString();
			strTime=new Date(strTime + ", " + reMatch[2]).getTime();
			strTime = strTime + (strTimeDiff * 1000);
			// alert(i + " --- " + reMatch[1] + " " + reMatch[2] + " --- " + parseInt(strTime) +" --- "+ parseInt(lastVisit));
			if(parseInt(strTime) > parseInt(lastVisit)) {
				strDates[i + strInsertWhere].innerHTML = strInsert + strDates[i + strInsertWhere].innerHTML;
			} else {
				updateVisit=true;
				break;
			}
		}
	}
} else {
    updateVisit=true;
}

if(catchupForce) {
	catchupButton=true;
	updateVisit=false;
}

if(catchupButton && !updateVisit) {
	var sheet = document.createElement('style')
	sheet.innerHTML = "";
	document.body.appendChild(sheet);
	
	var cb = document.createElement("div");
	cb.id = "cbButton";
	cb.innerHTML = "MARK AS READ";
	document.body.appendChild(cb);
	cb.addEventListener("click", function() {doUpdateVisit(); cb.style.visibility="hidden";}, false);
}

if(updateVisit) {
	doUpdateVisit();
}

function doUpdateVisit() {
	var d=new Date().getTime();
	GM_setValue(strGMValueName, ""+d+"");
}