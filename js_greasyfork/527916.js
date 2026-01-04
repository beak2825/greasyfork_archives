// ==UserScript==
// @name         Slorum Sanity Checker
// @namespace    http://slorum.net/
// @version      0000-00-01
// @description  Protect Your Own Dang Sanity
// @author       Fazer#103
// @match        https://slorum.org/*
// @match        https://slorum.net/*
// @match        https://workwebpage.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/527916/Slorum%20Sanity%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/527916/Slorum%20Sanity%20Checker.meta.js
// ==/UserScript==

// comma separated array of usernames to 'sanity check'. Remove all spaces. 

var sanityCheck = document.getElementsByClassName("sparkywannabe");
for(var i = 0; i < sanityCheck.length; i++){
	sanityCheck[i].style.display = "none";
}