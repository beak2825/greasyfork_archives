// ==UserScript==
// @name         Reset Reviewer's Name
// @author       Saiful Islam
// @version      0.2
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://wayfarer.nianticlabs.com/*
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/480267/Reset%20Reviewer%27s%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/480267/Reset%20Reviewer%27s%20Name.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

	let reviewer = prompt("----Review BOT----\n\nTo Ensure that we have enough player's reviewing, We will collect all review you are doing under your name.\n\nPlease Input Your Nickname & a Unique UserName in the box.\n\nExample: Alex ReviewerPoGoAlex \n\nIf You are reviewing from Multiple Mobile/PC/Browsers, Input the same Title There too.");
	localStorage.setItem("CollectReviewerName", reviewer);
	alert(localStorage.getItem("CollectReviewerName").toString()); 
})();