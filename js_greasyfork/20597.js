// ==UserScript==
// @name        EZ Grabber
// @namespace   DCI
// @version     0.7
// @description Grabs HITs
// @author      DCI
// @include     https://www.mturk.com/EzGrabber
// @include     https://www.mturk.com/mturk/preview?prevRequester=*
// @include     https://www.mturk.com/mturk/accept?*&captcha=*
// @include     https://www.mturk.com/*lolcaptcha*
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/return*
// @include     https://www.mturk.com/mturk/preview
// @include     https://www.mturk.com/mturk/*pchoard*
// @include     https://www.mturk.com/mturk/*lolprocored*
// @include     https://app.procore.com/*
// @include     https://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @include     http://www.procoretech.com/mechanical_turk/show_drawing_revision*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/20597/EZ%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/20597/EZ%20Grabber.meta.js
// ==/UserScript==

var requesters = [
"323KIQYDLQ77D5RGXU0PW7M41I3C4S-Procore",
"3XLZDG4M7280UYEGHLXC92IBFQGZL0-Zing",    
"3EM4DVSA8U8J6KF08Q5EM8I2NYE308-VQ",
"3EGCY5R6XY0PS57S4R2H1KZW7LSAYC-MyLikes"    
];
    
var pandaGroupId = '3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF';

if (window.location.toString() === 'https://www.mturk.com/EzGrabber'){
	scanPage();
}

function scanPage(){
	
	ScanDelay = 1;
    
    GM_setValue("requester#", 0);

	document.getElementsByTagName('span')[1].innerHTML = 'Here we go baby ko $_$';
	//document.title = 'Scanning for ' + requester;

	scanner();

	function scanner(){	
        if (GM_getValue("requester#") === requesters.length){
            GM_setValue("requester#", 0);
        }
                
        if (document.title === 'Scanning for ' + requesters[GM_getValue("requester#")].split("-")[1]){                                        
		    document.title = "$ $ $ $ $";
		} else {
			//document.body.style.backgroundColor = "red";
			document.title = 'Scanning for ' + requesters[GM_getValue("requester#")].split("-")[1];
		};

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.mturk.com/mturk/previewandaccept?groupId=" + requesters[GM_getValue("requester#")].split("-")[0],
			onload: function(response) {
				if (response.responseText.indexOf('You have exceeded') !== -1){
					setTimeout(function(){scanner();},5000);
				}
				else {
					if (response.responseText.indexOf('userCaptchaResponse') !== -1){
                        setTimeout(function(){window.location.replace("https://www.mturk.com/mturk/previewandaccept?groupId=" + pandaGroupId + "&pchoard")},0500);
                    }
					else {
						if (response.responseText.indexOf('Automatically accept the next HIT') !== -1){
							document.title =requesters[GM_getValue("requester#")].split("-")[1] + ' found';
                            function openQueue(){                                
                                setTimeout(function(){
                                    queue = window.open('https://www.mturk.com/mturk/preview','queue');
                                    scanner();
                                },0000);
                            }
                            if (typeof(queue) == 'undefined'){
								openQueue();						
							} 
                            else {
                                if (queue.closed){
                                    openQueue();
                                }
                                else{
                                    scanner();
                                }
                            }
						} 
						else {
							document.title = 'Scanning for ' + requesters[GM_getValue("requester#")].split("-")[1];
                            GM_setValue("requester#", GM_getValue("requester#") + 1);
							setTimeout(function(){scanner();},1000 * ScanDelay);
						}
					}
				}
			}
		})        
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
	window.location.replace('https://www.mturk.com/EzGrabber');
}

if (window.location.toString().indexOf('pchoard') !== -1){
    var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds005.wav");
	chimeSound.play();
    document.title = "CAPTCHA!";
}

if (window.name === 'queue'){
    if (window.location.toString() === 'https://www.mturk.com/mturk/preview'){
        if (document.body.innerHTML.match('There are currently no HITs assigned to you')){
            setTimeout(function(){
                location.reload(true);
            },1000);
        }
        else {
            var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
            chimeSound.play(); 	
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
            window.close();
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














