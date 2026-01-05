// ==UserScript==
// @name        Crowdsurf Radio
// @namespace   ...
// @description Listen to Crowdsurf HITs while you work. Maybe even do some of them.
// @author      DCI
// @include     https://ops.cielo24.com*
// @include     https://www.mturk.com/mturk/*&CrowdSurfer
// @include     https://www.mturk.com/mturk/accept?*&prevRequester=Crowdsurf+Support&requesterId=AKEBQYX32KM19*
// @include     https://www.mturk.com/mturk/externalSubmit
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/24648/Crowdsurf%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/24648/Crowdsurf%20Radio.meta.js
// ==/UserScript==

// Script activates at this url: https://www.mturk.com/mturk/preview?groupId=3K3X4GGOSLN9WHITSDB41LMDI6SMCK&CrowdSurfer
// You can substitute the groupId of any Crowdsurf batch

// SkipDelay is the number of seconds after the video is finished playing before the next HIT is loaded.
var SkipDelay = 3;

// NoTaskDelay is the number of seconds after getting a "No more tasks available" message before the next HIT is loaded.
var NoTaskDelay = 10;

// VisibilityMode when set to true will cause the currently playing HIT to be automatically accepted when the tab it is playing in becomes visible. 
var VisibilityMode = false;

// QueueMode when set to true will cause you to immediately go back to scanning after accepting a HIT.
var QueueMode = false;

// HITs can also be accepted with the F1 key.

if (window.location.toString().indexOf('cielo24.com') !== -1){
	if (document.body.innerHTML.match('No more tasks of this type are available')){
		window.parent.postMessage("task not available", '*');
	}
	if (document.body.innerHTML.match('CANNOT_WORK_EXPIRED')){
		window.top.postMessage("task not available", '*');
	}	
	if (document.body.innerHTML.match('The task you accepted is no longer available')){
		window.parent.postMessage("task not available", '*');
	}		
	function grab(x) {
		if ( x.keyCode == 112 ) { //F1 -
			window.top.postMessage("accept hit", '*');
		}
	}
	document.addEventListener( "keydown", grab, false); 	
	if (document.getElementsByTagName('video')){
		function skip(){
			window.top.postMessage("finished playing", '*');
		}
		document.getElementsByTagName('video')[0].addEventListener('ended',skip,false);
	}	
}
if (window.location.toString().indexOf('&CrowdSurfer') !== -1){
	var SkipLink = document.querySelectorAll("a[href*='preview?requesterId=&hitId']")[0];
	var AcceptButton = document.querySelectorAll("input[name='/accept']")[0];
	if (document.body.innerHTML.match('You have exceeded the maximum allowed')){
		setTimeout(function(){location.reload(true);},10000);
	}
	function receiveMessage(event){
		if (event.data === "finished playing"){
			setTimeout(function(){
				window.location.replace(SkipLink.href + '&CrowdSurfer');
			},1000*SkipDelay); 
		}
		if (event.data === "task not available"){
			setTimeout(function(){
				window.location.replace(SkipLink.href + '&CrowdSurfer');
			},1000*NoTaskDelay); 
		}		
		if (event.data === "accept hit"){
			AcceptButton.click();
		}		
	}
	window.addEventListener("message", receiveMessage, false);
	function press(i) {
		if ( i.keyCode == 112 ) { //F1 -
			AcceptButton.click();
		}
	}
	document.addEventListener( "keydown", press, false); 
	
	document.addEventListener("visibilitychange", function() {
		if ((document.visibilityState === 'visible') && (VisibilityMode === true)){
			AcceptButton.click();
		}
	})		
}
if (window.location.toString().indexOf('&prevRequester=Crowdsurf+Support&requesterId=AKEBQYX32KM19') !== -1){
	var groupId = window.location.toString().split('groupId=')[1].split('&')[0];
	if (QueueMode === true){
		window.location.replace('https://www.mturk.com/mturk/preview?groupId=' + groupId + '&CrowdSurfer');
	} else {
		function receiveMessage(event){
			if (event.data === "hit submitted"){
				window.location.replace('https://www.mturk.com/mturk/preview?groupId=' + groupId + '&CrowdSurfer');
			}
		}
		window.addEventListener("message", receiveMessage, false);
	}
}
if (window.location.toString().indexOf('externalSubmit') !== -1){
	if (document.body.innerHTML.match('Loading next hit')){
		window.parent.postMessage("hit submitted", '*');
	}
}	