// ==UserScript==
// @name           FF pe FB by Mandy
// @include        http://*
// @version        1.0.5e
// @namespace https://greasyfork.org/users/1584
// @description Removes https links of facebook from frendzforum
// @downloadURL https://update.greasyfork.org/scripts/1299/FF%20pe%20FB%20by%20Mandy.user.js
// @updateURL https://update.greasyfork.org/scripts/1299/FF%20pe%20FB%20by%20Mandy.meta.js
// ==/UserScript==


	var links = document.getElementsByTagName('img');			
			for(var i=links.length; i--;) {
				var img_ = links[i].src;
					img_ = img_.replace('https://m.ak.fbcdn.net/', 'http://m.ak.fbcdn.net/');
					links[i].src = img_;
					}