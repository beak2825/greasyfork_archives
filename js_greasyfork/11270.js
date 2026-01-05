// ==UserScript==
// @name UL Shuffler
// @description Shuffles li's in UL's
// @author ShareDVI
// @license MIT
// @version 1.0
// @include http://*
// @include https://*
// @namespace https://greasyfork.org/users/13692
// @downloadURL https://update.greasyfork.org/scripts/11270/UL%20Shuffler.user.js
// @updateURL https://update.greasyfork.org/scripts/11270/UL%20Shuffler.meta.js
// ==/UserScript==
(function (window, undefined) {  
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
	
    if (w.self != w.top) {
        return;
    }

	var ul = document.querySelectorAll('ul');
	for (var j = 0; j<ul.length; j++) {
		for (var i = ul[j].children.length; i >= 0; i--) {
			ul[j].appendChild(ul[j].children[Math.random() * i | 0]);
		}
	}
		
})(window);