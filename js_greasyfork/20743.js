// ==UserScript==
// @name        EZ Grabber
// @namespace   DCI
// @version     0.2
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
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20743/EZ%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/20743/EZ%20Grabber.meta.js
// ==/UserScript==

//var	groupId = "323KIQYDLQ77D5RGXU0PW7M41I3C4S";
//var	requester = "Procore";

var groupId = "3EM4DVSA8U8J6KF08Q5EM8I2NYE308";
var requester = "VQ";

var pandaGroupId = '3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF';

if (window.location.toString() === 'https://www.mturk.com/EzGrabber'){
	scanPage();
}

else {
	if (window.name === 'queue' && (document.body.innerHTML.match('There are currently no HITs assigned to you'))){
		window.close();
	}
}

function scanPage(){
	
	ScanDelay = 1;

	document.getElementsByTagName('span')[1].innerHTML = 'Here we go baby ko $_$';
	document.title = 'Scanning for ' + requester;

	scanner();

	function scanner(){		
        if (document.title === 'Scanning for ' + requester){                                        
		    document.title = "$ $ $ $ $";
		} else {
			//document.body.style.backgroundColor = "red";
			document.title = 'Scanning for ' + requester;
		};

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.mturk.com/mturk/previewandaccept?groupId=" + groupId,
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
							document.title = requester + ' found';
                            function openQueue(){                                
                                setTimeout(function(){
                                    queue = window.open('https://www.mturk.com/mturk/preview','queue');
                                    scanner();
                                },2000);
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
							document.title = 'Scanning for ' + requester;
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
    if (HitText.includes('Automatically accept the next HIT')){
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

if (window.location.toString() === 'https://www.mturk.com/mturk/preview'){
	if (window.name === 'queue'){
        var chimeSound = new Audio("http://static1.grsites.com/archive/sounds/birds/birds008.wav");
		chimeSound.play(); 	
    }
}














