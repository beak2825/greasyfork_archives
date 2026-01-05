// ==UserScript==
// @name        Pale Moon Iframe farmer
// @author      DCI
// @description Pandas, Alerts, Filler
// @namespace   www.redpandanetwork.org
// @version     0.9
// @include     https://www.mturk.com/EzGrabber
// @include     https://www.mturk.com/mturk/preview?prevRequester=*
// @include     https://www.mturk.com/mturk/accept?*&captcha=*
// @include     https://www.mturk.com/*lolcaptcha*
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/return*
// @include     https://www.mturk.com/mturk/preview
// @include     https://www.mturk.com/mturk/*pchoard*
// @include     https://www.amazon.com/ap/signin*
// @include     https://www.mturk.com/mturk/externalSubmit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/23897/Pale%20Moon%20Iframe%20farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/23897/Pale%20Moon%20Iframe%20farmer.meta.js
// ==/UserScript==

// This script runs at https://www.mturk.com/EzGrabber
// Running this script will set your mturk cookies in the current browser to sort HITs by newest and display 20 results per page.

// PrimaryPandas must be formated in this way: groupId-name.
// The name does not need to be exact. It is only for reference.
// These pandas will be cycled through continuously. 
var PrimaryPandas = [
//"3PHLPV04HPPVRL91UEQWY8S8FJRP7P-Totw",
//"323KIQYDLQ77D5RGXU0PW7M41I3C4S-Procore",
//"3XLZDG4M7280UYEGHLXC92IBFQGZL0-Zing",    
//"3EM4DVSA8U8J6KF08Q5EM8I2NYE308-VQ",
"35DNGIKWRF5AJXYRLZJOD6NWZKE716-MyLikes"
//"34VDM42TQZJ4A1I4VNJGAOMNTFOI9E-Yoski10"
//"3T063PBWZWMHWN5MRYYJQ2U632SH62-Yoski8",
//"3DXFGU9SKN2U70BZQM3ZWZUTL7VXEP-Fam"  
];


// SecondaryPandas are terms that are searched for on the page that loads when the primary panda is not up.
// If any of the terms are found, the corresponding HIT will be hoarded until they are gone.
// Search terms can be anything found inside of the HIT capsule HTML, including group id, requester id, requester name, and HIT description.
SecondaryPandas = [
"35DNGIKWRF5AJXYRLZJOD6NWZKE716", // MyLikes
//"3XLZDG4M7280UYEGHLXC92IBFQGZL0", // Zing
//"38MNOT6KWI2RBQGVM0MBPUP6RVH0T8", // Ibotta
"A2S0QCZG8DTNJC", // Procore
"AR6NX2KUSG6IP", // Current Set
"A1QPBFZ0XAI66K", //"Mturk Image Auditor",
//"A2LMCKW9KQH1OL", //"Eagle Eye",
"3PHLPV04HPPVRL91UEQWY8S8FJRP7P", // Taste of the World 2c
"via the A9 Data Acquisition app", // A9 3c
"A1ZZF7LRNQPO0K" //"Upshow"

];

// When an Alerts term is found a search page to the corresponding requester will be opened.
// An alert will also activate, stopping the script from scanning until closed.
// Search terms can be anything found inside of the HIT capsule HTML, including group id, requester id, requester name, and HIT description.
var Alerts = [
"Della Nelson",
"Pinterest",
"SET Master",
"Visual Search Requester"
];

var Blocked = [
"Rate How Relevant a Pin Is to a Query",
"Clickable Image Tagging"
];

var CaptchaGroup = '3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF'; // Copytext


if (window.location.toString() === 'https://www.mturk.com/EzGrabber'){
	scanPage();
}

function scanPage(){
	
	ScanDelay = 0.5;
    
    GM_setValue("requester#", 0);

	document.getElementsByTagName('span')[1].innerHTML = 'Here we go $_$';
	
	function viz(){
		if (document.visibilityState === "visible"){
			GM_setClipboard("Pale Moon Viz");
		}
	}
	
	document.addEventListener("visibilitychange", viz, false);

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
				if (response.responseText.indexOf('What is your email (phone for mobile accounts)?') !== -1){
					window.location.replace('https://www.mturk.com/mturk/beginsignin');
				}
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
							if (document.visibilityState === "visible"){
								GM_openInTab((html.getElementsByTagName('iframe')[0].src), false);
								GM_setClipboard('Pale Moon HIT');
															}
							else {
								GM_openInTab((html.getElementsByTagName('iframe')[0].src), true);								
							}
							scanner();
						} 
						else {
							panda = [];	
							var html = document.createElement('html');
							html.innerHTML = response.responseText;
							var hit_capsules = html.getElementsByTagName('tbody')[6].children;
							
							for (var f = 0; f < hit_capsules.length; f++){
								hit_link = hit_capsules[f].getElementsByTagName('a')[1].toString().replace('preview','previewandaccept');
								req_link = hit_capsules[f].getElementsByTagName('a')[3]; 
								hit_name = html.getElementsByClassName('capsulelink')[(f*2)].innerHTML.replace('<span class="tags"></span>','').trim();
								hit_req = html.getElementsByClassName('requesterIdentity')[f].innerHTML.trim();
								hit_reward = hit_capsules[f].getElementsByClassName('reward')[0].innerHTML.replace('$','');
								
								var blockCounter = 0;
								for (b = 0; b < Blocked.length; b++){
								    if (hit_capsules[f].innerHTML.toLowerCase().indexOf(Blocked[b].toLowerCase()) === -1){
										blockCounter++;
									}
								}
								if (Blocked.length === blockCounter){
									for (x = 0; x < Alerts.length; x++){
										if (hit_capsules[f].innerHTML.toLowerCase().indexOf(Alerts[x].toLowerCase()) !== -1){
											BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav");
											BellSound.play();
											GM_openInTab(req_link.toString());
											alert(hit_req + " - " + hit_name);
										}
									}
								}								

								for (y = 0; y < SecondaryPandas.length; y++){
									if (hit_capsules[f].innerHTML.toLowerCase().indexOf(SecondaryPandas[y]) !== -1){
										panda.push(hit_link);
									}
								}
							}
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
													if (document.visibilityState === "visible"){
														GM_openInTab((html2.getElementsByTagName('iframe')[0].src), false);
													}
													else {
														GM_openInTab((html.getElementsByTagName('iframe')[0].src), true);	
														GM_setClipboard('Pale Moon HIT');														
													}
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
							hoard();
						}
					}
				}
			}
		})        
	}
}

// log in
	if (window.location.toString().indexOf('https://www.amazon.com/ap/signin') !== -1){
		var loginButton = document.getElementById('signInSubmit-input');
		setTimeout(function(){loginButton.click();},5000);
	}

// captcha stuff
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


	if (window.location.toString().indexOf('externalSubmit') !== -1){
			window.parent.postMessage("redirect", '*');
			window.close();
	}

















