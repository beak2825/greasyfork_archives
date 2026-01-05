// ==UserScript==
// @name        Farmer Monitor
// @description farmer/monitor
// @namespace   DCI
// @include     https://www.mturk.com/mturk/FarmerMonitor
// @include     https://www.mturk.com/mturk/previewandaccept?*&prevRequester=farmer*
// @include     https://www.mturk.com/mturk/accept?*&captcha=*
// @include     https://www.mturk.com/mturk/*&fmcloser*
// @include     https://www.mturk.com/*lolcaptcha*
// @include     https://www.mturk.com/mturk/*lolprocored*
// @include     https://www.mturk.com/mturk/return*
// @include     https://app.procore.com/*
// @include     https://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     http://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     https://www.mturk.com/mturk/externalSubmit
// @include     https://www.mturk.com/mturk/submit
// @version     1
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/21452/Farmer%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/21452/Farmer%20Monitor.meta.js
// ==/UserScript==

var HITs = [
//"323KIQYDLQ77D5RGXU0PW7M41I3C4S", // Procore
//"3XLZDG4M7280UYEGHLXC92IBFQGZL0", // Zing   
"3EM4DVSA8U8J6KF08Q5EM8I2NYE308", // VQ
"3EGCY5R6XY0PS57S4R2H1KZW7LSAYC"  // MyLikes
];

var Alerts = [
"Jeff Lind",
"Web Page Categorization" // SET Master
];


var SecondaryPandas = [
"Upshow"
];

var HoardDelay = 0.1;

var pre = "https://www.mturk.com/mturk/previewandaccept?groupId=";
var post = ("&isPreviousIFrame=true&prevRequester=farmer");

if (location == "https://www.mturk.com/mturk/FarmerMonitor"){
	document.body.innerHTML = document.body.innerHTML.replace('Looking for Something?','Here we go, baby ko $_$');
	document.getElementsByClassName("title_orange_text")[0].style.visibility = "hidden";
	window.location.replace(pre + HITs[0] + post + "1");
}

if ((location.toString().indexOf("previewandaccept") !== -1) && (location.toString().indexOf("farmer") !== -1)){
	if (document.querySelectorAll("input[name='userCaptchaResponse']")[0]){
		//setTimeout(function(){window.location.replace(pre + CaptchaGroup + "&pchoard")},0500);
	} else {
		if (document.body.innerHTML.indexOf('You have exceeded') !== -1){
			setTimeout(function(){location.reload(true)},5000);
		} else {
			if (document.body.innerHTML.indexOf('Automatically accept the next HIT') !== -1){
				chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
				chimeSound.play();
				setTimeout(function(){GM_openInTab(window.location.toString(),{active: false, insert: true})},HoardDelay*1000);
				function receiveMessage(event){
					if (event.data === "closeplz"){
						window.close();
					}
					var returnlink = document.querySelectorAll("a[href*='mturk/return']")[0];
					if (event.data == "procored"){
						window.location.replace(returnlink + "&lolprocored");
					}					
				}
				window.addEventListener("message", receiveMessage, false);				
			}
			else {				
				var AlertState = false;
				var SecondaryState = false;
				var hit_capsules = document.getElementsByTagName('tbody')[6].children;
				
				for (var f = 0; f < hit_capsules.length; f++){
					hit_link = hit_capsules[f].querySelectorAll("a[href*='preview?']")[0];
					req_link = hit_capsules[f].querySelectorAll("a[href*='requesterId']")[0];
					hit_name = document.getElementsByClassName('capsulelink')[(f*2)].innerHTML.replace('<span class="tags"></span>','').trim();
					hit_req = document.getElementsByClassName('requesterIdentity')[f].innerHTML.trim();
					
					for (x = 0; x < Alerts.length; x++){
						if ((hit_capsules[f].innerHTML.match(Alerts[x])) && (AlertState == false)){
							var AlertState = true;
							BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav");
							BellSound.play();
							GM_openInTab(req_link.toString());
							alert(hit_req + " - " + hit_name);
						}
					}						
					for (y = 0; y < SecondaryPandas.length; y++){
						if (hit_capsules[f].innerHTML.match(SecondaryPandas[y])){
							var SecondaryState = true;
							var closer = hit_link.toString().replace('preview','previewandaccept') + '&fmcloser';
							GM_openInTab(closer,{active: false, insert: true});
						}
					}
				}
				if (SecondaryState == true){
					setTimeout(function(){location.reload(true);},10000);
				}
				if ((AlertState == false) && (SecondaryState == false)){
					var IndexNumber = Number(window.location.toString().split('farmer')[1]);
					if (IndexNumber == HITs.length){
						window.location.replace(pre + HITs[0] + post + "1");
					} else {
						window.location.replace(pre + HITs[IndexNumber] + post + (IndexNumber + 1));
					}
				}					
			}
		}		
	}
}

if (window.location.toString().indexOf('externalSubmit') !== -1){
		window.parent.postMessage("closeplz", '*');
}

if ((window.location.toString().indexOf('www.procore') !== -1) || (window.location.toString().indexOf('app.procore') !== -1)){
		var procored = document.querySelectorAll('img[src="/assets/error_pages/404-img.png"]');
		if (procored.length){
			window.parent.postMessage("procored", '*');
		} 
}

if (window.location.toString().indexOf('&lolprocored') !== -1){
	window.close();
}

if (window.location.toString().indexOf("fmcloser") != -1) {
    if (document.getElementsByName("autoAcceptEnabled")[0]) {
		chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
		chimeSound.play();
		setTimeout(function(){GM_openInTab(window.location.toString(),{active: false, insert: true});},HoardDelay*1000);
		function receiveMessage(q){
			if (q.data == "closeplz"){
				window.close();
			}
		}
		window.addEventListener("message", receiveMessage, false);
    } else {
		window.close();	
    }
}

// Venue Quality window close
if (window.location.toString() === 'https://www.mturk.com/mturk/submit'){
	if (document.body.innerHTML.indexOf('Your results have been submitted to Venue Quality') !== -1){
		window.close();
	}
}

