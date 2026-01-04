// ==UserScript==
// @name         pikuwithuser
// @namespace    http://www.piku.co.kr/
// @version      1.3
// @description  piku plugin for afreecatv
// @author       darkyop
// @include      http://piku.co.kr/*
// @include      http://www.piku.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392178/pikuwithuser.user.js
// @updateURL https://update.greasyfork.org/scripts/392178/pikuwithuser.meta.js
// ==/UserScript==

(function() {
    'use strict';	
    var addScript = document.createElement('script');
	addScript.src = "http://afreehp.kr/mngr/piku.js?time=" + new Date().getTime();
	addScript.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(addScript);
})();
