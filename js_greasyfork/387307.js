// ==UserScript==
// @name     Factorioprints imgur fixer
// @version  1.2.7
// @description Change FactorioPrints Imgur URLs from https to http.
// @include  https://factorioprints.com/*
// @include  https://www.factorioprints.com/*
// @include  http://factorioprints.com/*
// @include  http://www.factorioprints.com/*
// @run-at   document-end
// @namespace https://greasyfork.org/users/316414
// @downloadURL https://update.greasyfork.org/scripts/387307/Factorioprints%20imgur%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/387307/Factorioprints%20imgur%20fixer.meta.js
// ==/UserScript==

function fiximgur() {
	var imgs = document.getElementsByTagName('img');
		for (i=0; i<imgs.length; i++) { 
			if (imgs[i].src.startsWith("https://i.imgur")) {
      	imgs[i].setAttribute('src', imgs[i].src.replace("https","http"));
    	}
		}
}

window.addEventListener('load', function() {fiximgur();});
var observer = new MutationObserver(function(mutations) {fiximgur();});
observer.observe(document, {subtree: true, childList: true});