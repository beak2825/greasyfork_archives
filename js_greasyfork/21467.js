// ==UserScript==
// @name        Iframe farmer
// @author      DCI
// @description Pandas, Alerts, Filler
// @namespace   www.redpandanetwork.org
// @version     1.3
// @include     https://www.mturk.com/EzGrabber
// @include     https://www.mturk.com/mturk/preview?prevRequester=*
// @include     https://www.mturk.com/mturk/accept?*&captcha=*
// @include     https://www.mturk.com/*lolcaptcha*
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/return*
// @include     https://www.mturk.com/mturk/preview
// @include     https://www.mturk.com/mturk/*pchoard*
// @include     https://www.mturk.com/mturk/*lolprocored*
// @include     https://www.mturk.com/mturk/*&filler*
// @include     https://app.procore.com/*
// @include     https://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     http://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     https://www.mturk.com/mturk/externalSubmit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/21467/Iframe%20farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/21467/Iframe%20farmer.meta.js
// ==/UserScript==

// This script runs at https://www.mturk.com/EzGrabber
// Running this script will set your mturk cookies in the current browser to sort HITs by newest and display 20 results per page.

// PrimaryPandas must be formated in this way: groupId-name.
// The name does not need to be exact. It is only for reference.
// These pandas will be cycled through continuously. 
var PrimaryPandas = [
"323KIQYDLQ77D5RGXU0PW7M41I3C4S-Procore",
//"3XLZDG4M7280UYEGHLXC92IBFQGZL0-Zing",    
"3EM4DVSA8U8J6KF08Q5EM8I2NYE308-VQ",
"3EGCY5R6XY0PS57S4R2H1KZW7LSAYC-MyLikes"
];


// SecondaryPandas are terms that are searched for on the page that loads when the primary panda is not up.
// If any of the terms are found, the corresponding HIT will be hoarded until they are gone.
// Search terms can be anything found inside of the HIT capsule HTML, including group id, requester id, requester name, and HIT description.
SecondaryPandas = [
"A2S0QCZG8DTNJC", // Procore
"AR6NX2KUSG6IP", // Current Set
//"via the A9 Data Acquisition app", // A9 3c
"A1ZZF7LRNQPO0K" //"Upshow"
];

// When an Alerts term is found a search page to the corresponding requester will be opened.
// An alert will also activate, stopping the script from scanning until closed.
// Search terms can be anything found inside of the HIT capsule HTML, including group id, requester id, requester name, and HIT description.
var Alerts = [
"Jeff Lind",
"Web Page Categorization" // Set Master
];


// When active, the FillerGroup's correpsonding HIT will be accepted whenever the queue is empty.
// After each FillerGroup HIT is completed, the queue is checked again.
// The FillGroup value needs to be a group ID.
// If left blank, this feature will not be active.
var FillerGroup = ""; //3K3X4GGOSLN9WHITSDB41LMDI6SMCK // Crowdsurf
    
var CaptchaGroup = '3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF'; // Copytext

if (window.location.toString() === 'https://www.mturk.com/EzGrabber'){
	scanPage();
}

function scanPage(){
	
	ScanDelay = 0.5;
    
    GM_setValue("requester#", 0);

	document.getElementsByTagName('span')[1].innerHTML = 'Here we go $_$';

	scanner();

	function scanner(){	
        if (GM_getValue("requester#") === PrimaryPandas.length){
            GM_setValue("requester#", 0);
        }
		
		if (document.title === 'Scanning for ' + PrimaryPandas[GM_getValue("requester#")].split("-")[1]){
			document.title = "$ $ $ $";
		}
		else {
			document.title = 'Scanning for ' + PrimaryPandas[GM_getValue("requester#")].split("-")[1];
		}

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.mturk.com/mturk/previewandaccept?groupId=" + PrimaryPandas[GM_getValue("requester#")].split("-")[0] + "&sortType=LastUpdatedTime%3A1&pageSize=20",
			onload: function(response) {
				if (response.responseText.indexOf('You have exceeded') !== -1){
					document.title = 'PRE Delay'
					setTimeout(function(){scanner();},5000);
				}
				else {
					if (response.responseText.indexOf('userCaptchaResponse') !== -1){
                        setTimeout(function(){window.location.replace("https://www.mturk.com/mturk/previewandaccept?groupId=" + CaptchaGroup + "&pchoard")},0500);
                    }
					else {
						if (response.responseText.indexOf('Automatically accept the next HIT') !== -1){
							document.title =PrimaryPandas[GM_getValue("requester#")].split("-")[1] + ' found';
                            var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
                            chimeSound.play(); 	
 							var html = document.createElement('html');
							html.innerHTML = response.responseText;
                            
                            if (html.getElementsByTagName('iframe').length > 0){
                                window.open(html.getElementsByTagName('iframe')[0].src);
                                scanner();
                            } else {
                                setTimeout(function(){
                                    if (typeof(queue) == 'undefined'){
                                        window.open('https://www.mturk.com/mturk/preview','queue');
                                    }
                                }, 1000);
                                scanner();
                            }
                        } else {
							panda = [];							
							var html = document.createElement('html');
							html.innerHTML = response.responseText;
							var hit_capsules = html.getElementsByTagName('tbody')[6].children;
							
							for (var f = 0; f < hit_capsules.length; f++){
								hit_link = hit_capsules[f].getElementsByTagName('a')[1].toString().replace('preview','previewandaccept');
								req_link = hit_capsules[f].getElementsByTagName('a')[3]; 
								hit_name = html.getElementsByClassName('capsulelink')[(f*2)].innerHTML.replace('<span class="tags"></span>','').trim();
								hit_req = html.getElementsByClassName('requesterIdentity')[f].innerHTML.trim();
								
								for (x = 0; x < Alerts.length; x++){
									if (hit_capsules[f].innerHTML.match(Alerts[x])){
										BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav");
										BellSound.play();
										GM_openInTab(req_link.toString());
										alert(hit_req + " - " + hit_name);
									}
								}								

								for (y = 0; y < SecondaryPandas.length; y++){
									if (hit_capsules[f].innerHTML.match(SecondaryPandas[y])){
										panda.push(hit_link);
									}
								}
							}
							hoard();
							function hoard(){
								if (panda.length > 0){									
									GM_xmlhttpRequest({
										method: "GET",
										url: panda[0],
										onload: function(hitcheck) {
											if (hitcheck.responseText.indexOf('Automatically accept the next HIT') !== -1){
                                                var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
                                                chimeSound.play(); 	
													var html2 = document.createElement('html');
													html2.innerHTML = hitcheck.responseText;
													//GM_openInTab((html2.getElementsByTagName('iframe')[0].src),{active: false, insert: false});
													window.open(html2.getElementsByTagName('iframe')[0].src);
													hoard();
											}
											else {
												panda.splice(0,1);
												hoard();
											}
										}
									})
								}
								else {
									document.title = 'Scanning for ' + PrimaryPandas[GM_getValue("requester#")].split("-")[1];
									GM_setValue("requester#", GM_getValue("requester#") + 1);
									setTimeout(function(){scanner();},1000 * ScanDelay);
								}	
							}
							//hoard();
						}
					}
				}
			}
		})        
	}
}



if (window.location.toString().indexOf(CaptchaGroup) !== -1){
    var HitText = document.body.innerHTML.toString();
    if (HitText.indexOf('Automatically accept the next HIT') !== -1){
	    var returnlink = $("a[href*='mturk/return']")[0];
        window.location.replace(returnlink + '&lolcaptcha');
    }
}
if (window.location.toString().indexOf('&lolcaptcha') !== -1){
	window.location.replace('https://www.mturk.com/EzGrabber');
}

if (window.location.toString().indexOf('pchoard') !== -1){
    var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds005.wav");
	chimeSound.play();
    document.title = "CAPTCHA!";
}

if (window.name === 'queue'){
	document.title = "Queue";
    if (window.location.toString() === 'https://www.mturk.com/mturk/preview'){
        if (document.body.innerHTML.match('There are currently no HITs assigned to you')){
            setTimeout(function(){
                location.reload(true);
            },1000);
        }
        else {
            //var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
            //chimeSound.play(); 	
			function receiveMessage(q){
				var msg = q.data;
				var returnlink = $("a[href*='mturk/return']")[0];
				if (msg == "procored"){
					window.location.replace(returnlink + "&lolprocored");
				}
			}
			window.addEventListener("message", receiveMessage, false);			
        }
    }
    else {
        if (document.body.innerHTML.match('There are currently no HITs assigned to you')){
			if (FillerGroup.length > 0){
				window.location.replace("https://www.mturk.com/mturk/previewandaccept?groupId=" + FillerGroup + "&filler");
			}
			else {
				window.close();
			}
        }
    }
}

if ((window.location.toString().indexOf('www.procore') !== -1) || (window.location.toString().indexOf('app.procore') !== -1)){
		var procored = $('img[src="/assets/error_pages/404-img.png"]');
		if (procored.length){
			window.parent.postMessage("procored", '*');
		} 
}

if (window.location.toString().indexOf('&lolprocored') !== -1){
	window.location.replace("https://www.mturk.com/mturk/preview")
}

if (window.location.toString().indexOf('externalSubmit') !== -1){
		window.parent.postMessage("redirect", '*');
		window.close();
}

if (FillerGroup.length > 0){
	if (window.location.toString().indexOf('mturk.com/EzGrabber') !== -1){
		window.open("https://www.mturk.com/mturk/previewandaccept?groupId=" + FillerGroup + "&filler");
	}
	if (window.location.toString().indexOf("&filler") !== -1){
		function receiveMessage(event){
			var msg = event.data;
			if (msg === "redirect"){
				window.location.replace("https://www.mturk.com/mturk/preview");
			}
		}
		window.addEventListener("message", receiveMessage, false);
	}
}















