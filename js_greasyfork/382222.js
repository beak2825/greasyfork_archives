// ==UserScript==
// @name         JianDan Danmaku
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  from https://tool.zcmzcm.org/webBarrage/help
// @author       You
// @match        https://jandan.net/pic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382222/JianDan%20Danmaku.user.js
// @updateURL https://update.greasyfork.org/scripts/382222/JianDan%20Danmaku.meta.js
// ==/UserScript==

javascript: void((function() { 
	var i = document.createElement('script'); 
	i.charset = 'utf-8', i.setAttribute('src', 'https://cdn.zcmzcm.org/js/webBarrage/webBarrage.js'); 
	document.body.appendChild(i); 
	})())