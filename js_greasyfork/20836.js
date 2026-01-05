// ==UserScript==
// @name        ^DCI Penny Farmer II
// @description Farmalicious
// @version     2.8
// @author      DCI
// @namespace   http://www.redpandanetwork.org
// @include     *
// @exclude     https://greasyfork.org*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/20836/%5EDCI%20Penny%20Farmer%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/20836/%5EDCI%20Penny%20Farmer%20II.meta.js
// ==/UserScript==

var pandaGroupId = '3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF';

var maxout = $( ":contains('accepted the maximum')" );
if (maxout.length && window.location.toString().indexOf("farmer") != -1){
	setTimeout(function(){
		location.reload(true);
		},5000)
} 
else {
	captcha();
}

function captcha(){
	if (($('input[name="userCaptchaResponse"]').length > 0) && (window.location.toString().indexOf("farmer") != -1)){
		setTimeout(function(){window.location.replace("https://www.mturk.com/mturk/previewandaccept?groupId=" + pandaGroupId + "&pchoard")},0500);
	}
	else {
		sort();
	}
}

function sort(){
	if (window.location.toString().indexOf("lolprocored") != -1){
		window.close();
	} 
	else {
		if (window.location.toString().indexOf("farmer") != -1 || window.location.toString().indexOf("knowidea") != -1){
			runscript();
		}
		else {
			closer();
		}
	}
}

function runscript(){
	HoardDelay = 0
	ScanDelay = 0.1

	function cycle(){
		var Group0 = "3EM4DVSA8U8J6KF08Q5EM8I2NYE308" // Venue Quality
		var Group1 = "3EGCY5R6XY0PS57S4R2H1KZW7LSAYC" // MyLikes 1c
		var Group2 = "empty";
		var Group3 = "empty";
		var Group4 = "empty";
		var Group5 = "empty";
		var Group6 = "empty";
		var Group7 = "empty";
		var Group8 = "empty";
		var Group9 = "empty";
		var Group10 = "empty";
		var Group11 = "empty";
		var Group12 = "empty";
		var Group13 = "empty";
		var Group14 = "empty";
		var Group15 = "empty";
		var Group16 = "empty";
		var Group17 = "empty";
		var Group18 = "empty";
		var Group19 = "empty";
		var Group20 = "empty";

		// "3568B45QGKJKSZZ2HCEHVBDPJNOO3L" //annabel
		// "3OUUO7TL3Y71BHITPHHI1LHQTZQHEH" //DCS
		// "323KIQYDLQ77D5RGXU0PW7M41I3C4S" // Procore Development 5c
		// "3FOA7RUSUPTZLGMO1S07TFGAJIFPGX" // Procore Current Set 5c
		// "3TM075AKEJBXARCTTGH13SP6H49C2Y" // Procore Development 10c
		// "30B721SJLR5BYYBNQJ0CVKJEQOZ0OB" // Zing 1c
		// "30B721SJLR5BYYBNQJ0CVKJESN00OC" // Ibotta 1c
		// "3EGCY5R6XY0PS57S4R2H1KZW7LSAYC" // MyLikes 1c
		// "3SI493PTSWRNV2K9KNV25SFBTCTDZ4" // MyLikes 1c
		// "3EM4DVSA8U8J6KF08Q5EM8I2NYE308" // Venue Quality
		// "3YR6VNT524072WC81WHWV5R9ABTB7F" // Daniel Leffel 1c
		// "3PHLPV04HPPVRL91UEQWY8S8FJRP7P" // Taste of the World 2c
		// "3DXFGU9SKN2U70BZQM3ZWZUTL7VXEP" // Family Search Photos and Stories 3c
		// "30VZHLSOYT54E67KP51VACL5U49H9J" // Yoski 8c
		// "372VRO63LXJN2ZMHNPFR1IGVI48HBP" // Yoski 10c
		// "38YYIW9UV00Y8R36U4U8TYYB9F2IWZ" // Ben Peterson - Rate Business Profile Photos 3c
		// "3D8AITOIIKLLGNE1Z4F7BADEO0SIU3" // Ben Peterson - Rate Social Profile Photos 3c
		// "3ZA8T98ZB58M6JXMYRJC3HEKPURFTG" // Ben Peterson - Rate Dating Profile Photos (Male 27-37) 3c
		// "3EGG3WLVA0K75BCSXC8U46W9L5PIXX" // skillpages 2c
		// "3TFUINTXMPZKQQG3WDZM5DC3RJ8T91" // John Roberts 6c
		// "3VH5C6LHP1N5P6YDE8CL1VKPAXGLLD" // amturk 5c
		// "3U1ZIKCYY7QDZA78BW6ARJZ3GZ6T5H" // Sortfolio 2c

		var groups = [Group0,Group1,Group2,Group3,Group4,Group5,Group6,Group7,Group8,Group9,Group10,
		Group11,Group12,Group13,Group14,Group15,Group16,Group17,Group18,Group19,Group20];

		var pre = "https://www.mturk.com/mturk/previewandaccept?groupId=";
		var post = ("&isPreviousIFrame=true&prevRequester=farmer");
		
		function start(){
			window.location.replace(pre + Group0 + post + "0");
		}

		if (location == "https://www.mturk.com/farmer"){
			document.body.innerHTML = document.body.innerHTML.replace('Looking for Something?','Here we go baby ko $_$');
			$('.title_orange_text').eq(0).hide();
			start();
		}

		var groupnum = document.getElementsByTagName('h6')[0].innerHTML.substr(82,2);

		if (groups[++groupnum] == "empty"){
			setTimeout(function(){
				start();
			},ScanDelay*1000)
		}

		if (groups[groupnum] != "empty"){
			setTimeout(function(){
				next();
				},ScanDelay*1000)
			}
		function next(){
			window.location.replace(pre + groups[groupnum] + post + (groupnum));
		} 
	}

	var exceeded = $( ":contains('You have exceeded')" );
	if (exceeded.length){
		setTimeout(function(){
			location.reload(true);
		},3000);
	} 

	var hits = $( ":contains('Automatically accept the next HIT')" );
	if (hits.length  && window.location.toString().indexOf("knowidea") == -1){
		chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
		chimeSound.play(); 
		setTimeout(function(){
			$('input[type="checkbox"]').eq(2).prop('checked', false);
		},1000)
		setTimeout(function(){
			GM_openInTab(window.location.toString(),{active: false, insert: true})
		},HoardDelay*1000)
	}
	else {
		if (window.location.toString().indexOf("knowidea") == -1){
			cycle();
		}
	}

	window.addEventListener("message", receiveMessage, false);
	function receiveMessage(q){
		var msg = q.data;
		var lolprocored = "&lolprocored";
		var returnlink = $("a[href*='mturk/return']")[0];
		if (msg == "closeplzbb"){
			window.close();
		}
		if (msg == "onozprocored"){
			window.location.replace(returnlink + lolprocored);
		}
	}
}

function closer(){
	var submit = $( ":contains('Loading next hit')" );
	var procored = $('img[src="/assets/error_pages/404-img.png"]');
	var cset = $( ":contains('You may have mistyped')" );
	if (submit.length){
		window.parent.postMessage("closeplzbb", '*');
	} 
	else {
		if (procored.length || cset.length){
			window.parent.postMessage("onozprocored", '*');
		}
	}
}

if (window.location.toString().indexOf(pandaGroupId) !== -1){
    var HitText = document.body.innerHTML.toString();
    if (HitText.indexOf('Automatically accept the next HIT') !== -1){
	    var returnlink = $("a[href*='mturk/return']")[0];
        window.location.replace(returnlink + '&lolcaptcha');
    }
}

if (window.location.toString().indexOf('&lolcaptcha') !== -1){
	window.location.replace('https://www.mturk.com/farmer');
}

if (window.location.toString().indexOf('pchoard') !== -1){
    var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds005.wav");
	chimeSound.play();
    document.title = "CAPTCHA!";
}