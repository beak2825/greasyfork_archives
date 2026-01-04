// ==UserScript==
// @name         (ChromeOS) Calculator Rickroll (Alt+R)
// @namespace    https://greasyfork.org/users/1201646
// @version      1.0
// @description  Redirects the ChromeOS calculator app to Never Gonna Give You Up when pressing Alt+R.
// @author       lemocha
// @match        https://calculator.apps.chrome/
// @icon         https://lh3.googleusercontent.com/WxY4nHcChLXwanpdhY5AE2SE9fK7qp0kfJBNql2Pt0WyuJ24zFCQYUMV5_bGOGMpcm6Qs360yCEuvV9EZ1Jcz0_j=s60
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477986/%28ChromeOS%29%20Calculator%20Rickroll%20%28Alt%2BR%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477986/%28ChromeOS%29%20Calculator%20Rickroll%20%28Alt%2BR%29.meta.js
// ==/UserScript==


(() => {
	"use strict";
	document.addEventListener("keyup", event =>
	{
		// if Alt+R key combo pressed
		if (event.altKey && event.key === "r")
		{
			// redirect to Never Gonna Give You Up
			window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
		}
	});
})();