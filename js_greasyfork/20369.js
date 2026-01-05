// ==UserScript==
// @name           TH Satchel/Ornamentapult Status
// @description    This script checks for you when you last used the Satchel of Independence or Ornamentapult in your Inventory.
// @author         Patojonas
// @version        3.0
// @grant          GM_xmlhttpRequest
// @include        *twilightheroes.com/main.php
// @namespace https://greasyfork.org/users/47958
// @downloadURL https://update.greasyfork.org/scripts/20369/TH%20SatchelOrnamentapult%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/20369/TH%20SatchelOrnamentapult%20Status.meta.js
// ==/UserScript==
//flags
var ProblemPWD = 1;
var ProblemSatchel = 1;
var ProblemOrnamentapult = 1;
var SatchelPresent = 0;
var OrnamentaPresent = 0;
if (/main/.exec(location.href)) {
	//checks if you have the items
	var itemspresent = GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.twilightheroes.com/use.php?filter=instant",
        synchronous: true
    });
    items = itemspresent.responseText;
	if (items.match(/satchel of independence/)) { SatchelPresent = 1;}
    if (items.match(/ornamentapult/)) { OrnamentaPresent = 1;}
	//box design html
    var c = document.getElementsByTagName('h1')[0]; // 'center' if you want it just above the map
    var mybox = document.createElement("div");
	var satchelhtml = '<div id="satchel_container" style="text-align:center; ' +
        'opacity: .75; filter: alpha(opacity=75); z-index:100; display:inline-block; ' +
        'margin: 3px; padding: 7px; overflow: hidden; font-size: 11pt; ' +
        'font-family: arial, sans-serif; background-color: #ccffcc; color: #000000;">' +
        '<span id="satcheltitle"><a href="http://th.blandsauce.com/wiki/Satchel_of_independence" target="_blank"><h1>Satchel of Independence</h1></a></span>' +
        '<span id="satchelstatus">Checking status...</span>' +
        '<span id="satcheluselink"><br />Creating link...</span></div>';
	var ornamenhtml = '<div id="ornamentapult_container" style="text-align:center; ' +
        'opacity: .75; filter: alpha(opacity=75); z-index:100; display:inline-block; ' +
        'margin: 3px; padding: 7px; overflow: hidden; font-size: 11pt; ' +
        'font-family: arial, sans-serif; background-color: #ccffcc; color: #000000;">' +
        '<span id="ornamentapultitle"><a href="http://th.blandsauce.com/wiki/Ornamentapult" target="_blank"><h1>Ornamentapult</h1></a></span>' +
        '<span id="ornamentapultstatus">Checking status...</span>' +
        '<span id="ornamentapultuselink"><br />Creating link...</span></div>';
	//builds box according to your needs
	if (SatchelPresent && OrnamentaPresent){
		mybox.innerHTML = '<center>' + satchelhtml + ornamenhtml + '</center>';
		} else if (SatchelPresent && !OrnamentaPresent) {
		mybox.innerHTML = '<center>' + satchelhtml + '</center>';
		} else if (!SatchelPresent && OrnamentaPresent) {
		mybox.innerHTML = '<center>' + ornamenhtml + '</center>';
		} else {
			return;
		}
    c.parentNode.insertBefore(mybox, c); //to add it above things
    //c.parentNode.appendChild(mybox); //to add it after the map
	//fetching user MD5ed password
    var pwdget = GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.twilightheroes.com/skills.php",
        synchronous: true
    });
    a = pwdget.responseText;
    var pwdFound = a.match(/<input type=hidden name=pwd value=(\w+)>/);
    if ((pwdFound != null) && (pwdFound[1] != null)) {
		//if valid pass found then create links
		var satchelLink = '<a href="http://www.twilightheroes.com/use.php?which=2257&pwd=' + pwdFound[1] + '" target="main"><h7>Use Now</h7></a>';
		var ornamentapultLink = '<a href="http://www.twilightheroes.com/use.php?which=2458&pwd=' + pwdFound[1] + '" target="main"><h7>Use Now</h7></a>';
        ProblemPWD  = 0;
    }
	//fetch Satchel status
	if (SatchelPresent){
		var satchelastuseget = GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.twilightheroes.com/popup.php?item=82243597",
			synchronous: true
		});
		s = satchelastuseget.responseText;
		//fetch box elements to fill according to satchel status
		var satchelStatusSpan = document.getElementById('satchelstatus');
		var satchelLinkSpan = document.getElementById('satcheluselink');
		//status chain
		if (s.match(/Was filled/)) {
			satchelStatusSpan.innerHTML = day(0);
			satchelLinkSpan.parentNode.removeChild(satchelLinkSpan);
			ProblemSatchel = 0;
		} else if (s.match(/day fireworks/) && ProblemPWD == 0) {
			satchelStatusSpan.innerHTML = day(1);
			satchelLinkSpan.innerHTML = satchelLink;
			ProblemSatchel = 0;
		} else if (s.match(/independence yesterday/) && ProblemPWD == 0) {
			satchelStatusSpan.innerHTML = day(2);
			satchelLinkSpan.innerHTML = satchelLink;
			ProblemSatchel = 0;
		} else if (s.match(/three independence/) && ProblemPWD == 0) {
			satchelStatusSpan.innerHTML = day(3);
			satchelLinkSpan.innerHTML = satchelLink;
			ProblemSatchel = 0;
		} else if (s.match(/four independence/) && ProblemPWD == 0) {
			satchelStatusSpan.innerHTML = day(4);
			satchelLinkSpan.innerHTML = satchelLink;
			ProblemSatchel = 0;
		} else if (s.match(/bunch of independence/) && ProblemPWD == 0) {
			satchelStatusSpan.innerHTML = day(5);
			satchelLinkSpan.innerHTML = satchelLink;
			ProblemSatchel = 0;
		} else if (ProblemSatchel || ProblemPWD) {
			//in case of server hicups or dividing by 0
			satchelStatusSpan.innerHTML = "There was an error.";
			satchelLinkSpan.parentNode.removeChild(satchelLinkSpan);
		}
	}
	//fetch Ornamentapult status
	if (OrnamentaPresent){
		var ornamentapultlastuseget = GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.twilightheroes.com/popup.php?item=30885917",
			synchronous: true
		});
		o = ornamentapultlastuseget.responseText;
		//fetch box elements to fill according to satchel status
		var OrnamentapultStatusSpan = document.getElementById('ornamentapultstatus');
		var OrnamentapultLinkSpan = document.getElementById('ornamentapultuselink');
		//status chain
		if (o.match(/Launched some/)) {
			OrnamentapultStatusSpan.innerHTML = day(0);
			OrnamentapultLinkSpan.parentNode.removeChild(OrnamentapultLinkSpan);
			ProblemOrnamentapult = 0;
		} else if (o.match(/ready to launch/) && ProblemPWD == 0) {
			OrnamentapultStatusSpan.innerHTML = day(1);
			OrnamentapultLinkSpan.innerHTML = ornamentapultLink;
			ProblemOrnamentapult = 0;
		} else if (o.match(/two whole/) && ProblemPWD == 0) {
			OrnamentapultStatusSpan.innerHTML = day(2);
			OrnamentapultLinkSpan.innerHTML = ornamentapultLink;
			ProblemOrnamentapult = 0;
		} else if (o.match(/three days/) && ProblemPWD == 0) {
			OrnamentapultStatusSpan.innerHTML = day(3);
			OrnamentapultLinkSpan.innerHTML = ornamentapultLink;
			ProblemOrnamentapult = 0;
		} else if (o.match(/four days/) && ProblemPWD == 0) {
			OrnamentapultStatusSpan.innerHTML = day(4);
			OrnamentapultLinkSpan.innerHTML = ornamentapultLink;
			ProblemOrnamentapult = 0;
		} else if (o.match(/into orbit/) && ProblemPWD == 0) {
			OrnamentapultStatusSpan.innerHTML = day(5);
			OrnamentapultLinkSpan.innerHTML = ornamentapultLink;
			ProblemOrnamentapult = 0;
		} else if (ProblemOrnamentapult || ProblemPWD) {
			//in case of server hicups or dividing by 0
			OrnamentapultStatusSpan.innerHTML = "There was an error.";
			OrnamentapultLinkSpan.parentNode.removeChild(OrnamentapultLinkSpan);
		}
	}
}

function day(num)
{
	if(num == 0){
		return 'Last time used:<h2>Today</h2>';
	} else if (num == 5){	
		return "Last time used:<h2>At least 5 days ago</h2>Waiting any longer won't increase item quality.<br />";
	} else {
		return 'Last time used:<h2>'+num+' days ago</h2>';
	}
}