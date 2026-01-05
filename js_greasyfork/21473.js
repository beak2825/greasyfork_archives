// ==UserScript==
// @name        SET Master
// @description Hoard+keys. A=yes F=no
// @namespace   DCI
// @include     https://www.mturk.com/mturk/*hitGroupId*
// @include     https://www.mturk.com/mturk/externalSubmit
// @include     https://www.mturkcontent.com/dynamic/hit*
// @include     https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=A21C7HHM1RNKOR&searchWords=web+page+categorization&sortType=NumHITs%3A1&pageSize=10
// @version     1.4
// @grant       GM_openInTab
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/21473/SET%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/21473/SET%20Master.meta.js
// ==/UserScript==

var HoardDelay = 1;

// Search Page Hoarder
if (window.location.toString() ==('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=A21C7HHM1RNKOR&searchWords=web+page+categorization&sortType=NumHITs%3A1&pageSize=10')){	
	//var hoard = confirm("Begin hoarding?");
	//if (hoard === true){
		if (document.querySelectorAll("a[href*='preview?']").length > 0){
			var hitLink = document.querySelectorAll("a[href*='preview?']");
			window.open((hitLink[0] + "&prevRequester=hitGroupId0").replace('preview','previewandaccept'));
			window.addEventListener("message", receiveMessage, false);
			function receiveMessage(event){
				var msg = event.data;
				if (msg === "hitGone9"){location.reload(true)}else {setTimeout(function(){
					var groupNumber = msg.slice(-1);
					if (msg.toString().indexOf('hitUp') !== -1){
						window.open((hitLink[groupNumber] + "&prevRequester=hitGroupId" + groupNumber).replace('preview','previewandaccept'));
					}
					if (msg.toString().indexOf('hitGone') !== -1){
						window.open((hitLink[(Number(groupNumber) + 1)] + "&prevRequester=hitGroupId" + (Number(groupNumber) + 1)).replace('preview','previewandaccept'));
					}				
				},1000 * HoardDelay);};
			}
		}
	//}
}

// HIT page postMessaging
if (window.location.toString().indexOf('hitGroupId') !== -1){
	var groupNumber = window.location.toString().slice(-1);
	if (document.body.innerHTML.match('Finished with this HIT?')){
		window.opener.postMessage("hitUp" + groupNumber, '*');
		function receiveMessage(event){
			if (event.data === "closeParent"){
				window.close();
			}
		}
		window.addEventListener("message", receiveMessage, false);
	}
	if (document.body.innerHTML.match('There are no HITs in this group available to you at the moment')){
		window.opener.postMessage("hitGone" + groupNumber, '*');
		window.close();
	}
	if (document.body.innerHTML.match('You have exceeded')){
		setTimeout(function(){
			window.opener.postMessage("hitUp" + groupNumber, '*');
			window.close();
			},5000);
	}
	if (document.body.innerHTML.match('You have accepted the maximum number of HITs allowed')){
		setTimeout(function(){
			window.opener.postMessage("hitUp" + groupNumber, '*');
			window.close();
			},10000);
	}	
}	

// Window closing
if (window.location.toString().indexOf('externalSubmit') !== -1){
		window.parent.postMessage("closeParent", '*');
}

// Hotkeys
if (window.location.toString().indexOf('mturkcontent.com') !== -1){	
	if (document.querySelectorAll('a[href="http://www.set.tv/"]').length > 0){
		document.getElementById('instructions').scrollIntoView(true);
		document.getElementsByTagName('img')[0].height = (screen.height * .5);		
		function press(i) {
			if ( i.keyCode == 65 ) { //A -
				document.querySelectorAll("input[type='radio']")[0].click();
				document.getElementById('submitButton').click();
			}
			if ( i.keyCode == 70 ) { //F -
				document.querySelectorAll("input[type='radio']")[1].click();
				document.getElementById('submitButton').click();
			}
		}
		document.addEventListener( "keydown", press, false);
	}
}
	
				
				
				
				
				
				
				
				
				
				
				
				

 