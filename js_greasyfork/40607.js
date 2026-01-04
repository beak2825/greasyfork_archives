// ==UserScript==
// @name         Schoology Auto-Login
// @namespace SchoologyAutoLogin
// @version      1
// @description  Automatically logs into Schoology
// @author       WolfB
// @include       *app.schoology.com/login*
// @grant        none
// @license      CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/40607/Schoology%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/40607/Schoology%20Auto-Login.meta.js
// ==/UserScript==

setTimeout(function() {
	document.forms[0].submit();
}, 1); //A delay of one milisecond. It does not work with 0.