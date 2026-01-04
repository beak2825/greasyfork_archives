// ==UserScript==
// @name           OnePageWonder
// @namespace      OPW
// @description    Opens all links in IFrame, so going "back" is fast!
// @include        http://*
// @version 0.0.1.20180527065009
// @downloadURL https://update.greasyfork.org/scripts/368529/OnePageWonder.user.js
// @updateURL https://update.greasyfork.org/scripts/368529/OnePageWonder.meta.js
// ==/UserScript==

var peak = 999000;

// @todo Duh add event to body and you can catch all links even those added after us!

for (var i=document.links.length-1;i>=0;i--) {

	var link = document.links[i];

	if (link.href.match('^#'))
		continue;
	if (link.href.match('^javascript:'))
		continue;
	if (link.href.substring(0,document.location.length+1) == document.location+'#')
		continue;

	var myFunc = function(evt) {
		GM_log("Opening IFRAME...");
		var link = evt.currentTarget;
		evt.preventDefault();
		var iframe = document.createElement("IFRAME");
		iframe.src = link.href;
		iframe.style.position = 'fixed';
		iframe.style.top = '10px';
		iframe.style.left = '10px';
		iframe.width = window.innerWidth - 20 - 4;
		iframe.height = window.innerHeight - 20;
		peak++;
		iframe.style.zIndex = peak;
		document.body.appendChild(iframe);
		// iframe.addEventListener('mouseout',function(){
			// document.body.removeChild(iframe);
		// },false);

		var closeButton = document.createElement("IMG");

		function hideOldDOM() {
			for (var i=document.body.childNodes.length-1;i>=0;i--) {
				var elem = document.body.childNodes[i];
				if (elem == iframe || elem == closeButton || !elem.style)
					continue;
				elem.oldDisplay = elem.style.display;
				elem.style.display = 'none';
			}
		}

		function showOldDOM() {
			for (var i=document.body.childNodes.length-1;i>=0;i--) {
				var elem = document.body.childNodes[i];
				if (elem.style)
					elem.style.display = '';
			}
		}

		hideOldDOM();

		closeButton.src = "http://icons.iconarchive.com/icons/pixelmixer/basic/delete-icon.jpg";
		closeButton.width = '16';
		closeButton.height = '16';
		closeButton.style.position = 'fixed';
		closeButton.style.top = '14px';
		closeButton.style.right = '33px';
		peak++;
		closeButton.style.zIndex = peak;
		closeButton.addEventListener('click',function(){
			showOldDOM();
			document.body.removeChild(iframe);
			document.body.removeChild(closeButton);
		},false);
		document.body.appendChild(closeButton);

		return false;
	};

	link.addEventListener('click',myFunc,true);
	// This responds to right-click:
	// link.addEventListener('mousedown',myFunc,true);

}

if (top != window) {
	// We are an IFrame
	// Add a close and a maximize button.
	// Also a location bar, back button, etc.
	// Also an open in new window/tab button.
	var maximizeButton = document.createElement("IMG");
	maximizeButton.src = "http://icons.iconarchive.com/icons/pixelmixer/basic/up-icon.jpg";
	maximizeButton.width = '16';
	maximizeButton.height = '16';
	maximizeButton.style.position = 'fixed';
	maximizeButton.style.top = '2px';
	maximizeButton.style.right = '20px';
	maximizeButton.style.zIndex = '9999';
	maximizeButton.addEventListener('click',function(){
		top.location = document.location;
	},false);
	document.body.appendChild(maximizeButton);
}

