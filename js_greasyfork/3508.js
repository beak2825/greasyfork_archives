// ==UserScript==
// @id             fix-firefox-995728
// @name           Fix Firefox smooth scrolling
// @version        2014.7.22
// @namespace      CoolCmd
// @author         CoolCmd
// @description    Attempt to fix Firefox bug 995728 (https://bugzilla.mozilla.org/show_bug.cgi?id=995728)
// @homepage       https://bugzilla.mozilla.org/show_bug.cgi?id=995728
// @license        MIT License; http://opensource.org/licenses/mit-license
// @include        http://*
// @include        https://*
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3508/Fix%20Firefox%20smooth%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/3508/Fix%20Firefox%20smooth%20scrolling.meta.js
// ==/UserScript==

(function(){
"use strict";
var CLOCK_CHANGE_DURATION = 85 * 1000;
var nLastChangeTime = 0;
document.addEventListener('scroll', function()
{
	var nNow = Date.now();
	if (nNow - nLastChangeTime > CLOCK_CHANGE_DURATION)
	{
		nLastChangeTime = nNow;
		// Increase system clock resolution for 90 seconds.
		document.defaultView.cancelAnimationFrame(document.defaultView.requestAnimationFrame(function(){}));
	}
}, false);
})();