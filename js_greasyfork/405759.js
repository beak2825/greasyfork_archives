// ==UserScript==
// @name        Mycroft Patch for Firefox 78
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     1.0
// @copyright   Copyright 2020 Jefferson Scher
// @license     BSD-3-Clause
// @description Modify page function to use supported features only. Tampermonkey or Violentmonkey. v1.0 2020-06-20
// @match       https://mycroftproject.com/*
// @match       http://mycroftproject.com/*
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/405759/Mycroft%20Patch%20for%20Firefox%2078.user.js
// @updateURL https://update.greasyfork.org/scripts/405759/Mycroft%20Patch%20for%20Firefox%2078.meta.js
// ==/UserScript==

unsafeWindow.addOpenSearch = function(name,ext,cat,pid,meth) {
  var title = event.target.textContent;
	// Update the page favicon to pass to the browser
	var favicon = document.querySelector('link[rel="icon"]');
	if (favicon){
		if (ext == 'ico') favicon.setAttribute('type', 'image/vnd.microsoft.icon');
		else favicon.setAttribute('type', 'image/' + ext);
		favicon.href = 'https://mycroftproject.com/updateos.php/id0/' + name + '.' + ext;
	} else {
		favicon = document.createElement('link');
		favicon.setAttribute('rel', 'icon');
		if (ext == 'ico') favicon.setAttribute('type', 'image/vnd.microsoft.icon');
		else favicon.setAttribute('type', 'image/' + ext);
		favicon.href = 'https://mycroftproject.com/updateos.php/id0/' + name + '.' + ext;
		document.getElementsByTagName('head')[0].appendChild(oslink);
	}
	// Add a new link tag for the specified search engine
	var oslink = document.querySelector('link[rel="search"][type="application/opensearchdescription+xml"]');
	if (oslink){
		oslink.remove();
	}
	oslink = document.createElement('link');
	oslink.setAttribute('rel', 'search');
	oslink.setAttribute('type', 'application/opensearchdescription+xml');
	oslink.setAttribute('title', title);
	oslink.href = 'https://mycroftproject.com/installos.php/' + pid + '/' + name + '.xml';
	document.getElementsByTagName('head')[0].appendChild(oslink);
	// Enable visibility of instructional message
	var howtomsg = document.getElementById('howtomsg');
	if (!howtomsg){
		howtomsg = document.createElement('div');
    howtomsg.id = 'howtomsg';
		howtomsg.setAttribute('style', 'position:fixed; top:0; left:25%; width: 50%; text-align: center; padding: 0.75em; border: 2px solid #008; border-radius: 4px; color: #000; background-color: #bee;');
		document.body.appendChild(howtomsg);
	}
	howtomsg.innerHTML = 'Now use the Page Actions menu (&bull;&bull;&bull;) in the address bar to add the "' + title + '" search engine to Firefox.';
	howtomsg.style.display = 'block';
};
