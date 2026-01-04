// ==UserScript==
// @name         Reddit Crowd Uncontroller
// @version      1.2
// @description  unhides reddit comments hidden by the 'crowd control' feature
// @author       /u/cupred
// @match        https://*.reddit.com/*
// @namespace https://greasyfork.org/users/817750
// @downloadURL https://update.greasyfork.org/scripts/432776/Reddit%20Crowd%20Uncontroller.user.js
// @updateURL https://update.greasyfork.org/scripts/432776/Reddit%20Crowd%20Uncontroller.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // find all the divs that are collapsed that aren't below the score threshold (have a 'collapsed-for-reason' class)
    let collapsedComments = document.querySelectorAll('div.thing.collapsed:not(.collapsed-for-reason)');

    // if the res commentHidePersistor indicates the user didn't manually hide the element then uncollapse it
    collapsedComments.forEach(function (el, i) {
    	let manuallyCollapsed = el.querySelector('div.entry > p.tagline > a[collapse-reason]');
    	if(!manuallyCollapsed)
    	{
    		el.classList.remove('collapsed');
    		el.classList.add('noncollapsed');
    	}
    });
})();