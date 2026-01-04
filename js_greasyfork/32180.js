// ==UserScript==
// @name                Multi Hoard Deluxe 
// @author              DCI
// @namespace           www.redpandanetwork.org
// @description         you wouldn't understand
// @version             2.0
// @grant               GM_xmlhttpRequest
// @grant               GM_openInTab
// @include             https://www.mturk.com/bookmark*
// @include             https://www.mturk.com/*tabcount*
// @include             https://www.mturk.com/mturk*MHDeluxe*
// @include 	        https://www.mturk.com/mturk/accept*
// @include             https://www.mturk.com/mturk/findhits*
// @include             https://www.mturk.com/mturk/preview*
// @include             https://www.mturk.com/mturk/searchbar*
// @include             https://www.mturk.com/mturk/sorthits*
// @include             https://www.mturk.com/mturk/sortsearchbar*
// @include             https://www.mturk.com/mturk/viewhits*
// @include             https://www.mturk.com/mturk/viewsearchbar*
// @include             https://www.mturk.com/FrameHoard*
// @include             https://www.mturk.com/QueueHoard*
// @include             https://www.mturk.com/mturk/externalSubmit
// @downloadURL https://update.greasyfork.org/scripts/32180/Multi%20Hoard%20Deluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/32180/Multi%20Hoard%20Deluxe.meta.js
// ==/UserScript==

var Delay = 0.8;

if (~window.location.toString().indexOf('https://www.mturk.com/mturk')){ 
	var previewLinkEls = document.querySelectorAll('span.capsulelink a');
	for (var i = 0; i < previewLinkEls.length; i++) {
		var previewLink = previewLinkEls[i].getAttribute('href');
		if (previewLink && previewLink.split('?')) {
			var previewLinkArray = previewLink.split('?');
			if (previewLinkArray[0] == '/mturk/preview') {			
			
				var previewAndAcceptLink = previewLinkArray[0] + 'andaccept?' + previewLinkArray[1];
				var parentSpan = previewLinkEls[i].parentNode;				
				
				var previewAndAcceptEl = document.createElement('a');
				previewAndAcceptEl.setAttribute('href', previewAndAcceptLink);
				previewAndAcceptEl.setAttribute('target', '_blank');
				previewAndAcceptEl.setAttribute('style', 'padding-right: 20px;');
				previewAndAcceptEl.innerHTML = 'Accept';
				parentSpan.insertBefore(previewAndAcceptEl, parentSpan.firstChild);  

				var fiveTabsLink = document.createElement("a");            
				fiveTabsLink.setAttribute('href', previewAndAcceptLink + "&tabcount5");
				fiveTabsLink.setAttribute('class', 'newhb');
				fiveTabsLink.setAttribute('style', 'padding-right: 20px;'); 
				fiveTabsLink.setAttribute('id', 'closers');
				fiveTabsLink.innerHTML = "5 tabs";	
				parentSpan.insertBefore(fiveTabsLink, parentSpan.firstChild);			
				
				var queueLink = document.createElement("a");            
				queueLink.setAttribute('href', 'https://www.mturk.com/QueueHoard' + previewAndAcceptLink.split('groupId=')[1]);
				queueLink.setAttribute('class', 'newhb');
				queueLink.setAttribute('style', 'padding-right: 20px;'); 
				queueLink.setAttribute('id', 'closers');
				queueLink.innerHTML = "Queue";	
				parentSpan.insertBefore(queueLink, parentSpan.firstChild);				
			}
		}
	}
}

if (~window.location.toString().indexOf('https://www.mturk.com/QueueHoard')){     
	document.getElementsByTagName('span')[1].innerHTML = 'Here we go $_$';
	var groupId = window.location.toString().split('QueueHoard')[1];
	var pre = 'https://www.mturk.com/mturk/previewandaccept?groupId=';
	var final = pre + groupId;
	var accepted = 0;	
	function hoard(){
		document.title = "HITs accepted: " + accepted;		
		GM_xmlhttpRequest({
			method: "GET",
			url: final,
			onload: function(response) {
				if (response.responseText.indexOf('You have exceeded') !== -1){
					document.title = 'PRE Delay'
					setTimeout(function(){hoard();},5000);
				}
				else if (response.responseText.indexOf('You have accepted the maximum number of HITs allowed') !== -1){
					document.title = 'Max HITs accepted'
					setTimeout(function(){hoard();},10000);
				}				
				else if (response.responseText.indexOf('userCaptchaResponse') !== -1){
						alert('CAPTCHA');
						hoard();
				}
				else if (response.responseText.indexOf('Automatically accept the next HIT') !== -1){
					accepted++;
					setTimeout(function(){hoard();},1000 * Delay);
				}
				else {
					setTimeout(function(){hoard();},1000 * Delay);
				}
			}
		})
	}	
	hoard();
	setTimeout(function(){window.open('https://www.mturk.com/mturk/preview')},2000);
}

if ((~window.location.toString().indexOf('tabcount')) && (~window.location.toString().indexOf('mturk.com/mturk'))){ 
	var tabcount = window.location.toString().split("tabcount")[1];
	for (f = 0; f < (tabcount - 1); f++){
		GM_openInTab(window.location.toString().replace("tabcount",""),{active: false, insert: false});
	}
}	



	
	

	