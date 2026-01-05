// ==UserScript==
// @name        Disable modal dialogs for automation
// @namespace   http://userstyles.org/automation
// @description Disables things like alert, confirm, and prompt - useful for visiting sites with an automated tool like iMacros
// @include     http://*
// @include     https://*
// @version     18
// @downloadURL https://update.greasyfork.org/scripts/42/Disable%20modal%20dialogs%20for%20automation.user.js
// @updateURL https://update.greasyfork.org/scripts/42/Disable%20modal%20dialogs%20for%20automation.meta.js
// ==/UserScript==
function fixIt() {
	window.onbeforeunload = function() {};
}
fixIt();
setInterval(fixIt, 500);
window.alert = function() {};
window.confirm = function() {};
window.prompt = function() {};