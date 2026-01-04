// ==UserScript==
// @name         Github Repository Name as Tab Title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change tab title to : Repository Name / blabla
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478910/Github%20Repository%20Name%20as%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/478910/Github%20Repository%20Name%20as%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
		var loca = location.href, name = loca, d=document, t=d.title;
		// https://github.com/user/repository-name
		var name = name.slice(name.indexOf('/', 20)+1);
		if(name.includes('/'))
			name = name.slice(0, name.indexOf('/'));
		debug(t, name);
		if(!t.includes(name) || loca.includes('/issues/'))
			t = name+' / '+t;
		else
			t = t.slice(t.indexOf(name))

		t = t[0].toUpperCase() + t.slice(1)
		d.title = t;

	}, 800)


    // Your code here...
})();