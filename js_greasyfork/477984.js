// ==UserScript==
// @name         To SiIvaGunner Wiki
// @namespace    https://greasyfork.org/users/1201646
// @version      1.0.2
// @description  View a rip on the SiIvaGunner Wiki in one click!
// @author       lemocha
// @match        https://www.youtube.com/*
// @icon         https://static.wikia.nocookie.net/siivagunner/images/4/4a/Site-favicon.ico
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477984/To%20SiIvaGunner%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/477984/To%20SiIvaGunner%20Wiki.meta.js
// ==/UserScript==


(() =>
{
	"use strict";
	// register menu command
	GM_registerMenuCommand("To SiIva Wiki", () => redirect("https://siivagunner.fandom.com/wiki/"));

	function redirect(url)
	{
		// get rip title based on youtube document title
		let title = document.title.split(" - YouTube")[0];

		// remove notification count in document title if present
		if (title.charAt(0) === "(" && /[0-9]/.test(title.charAt(1)))
		{
			title = title.slice(title.indexOf(") ") + 2);
		}

		// replace certain characters so link is URL safe
		title = title.replaceAll("?", "%3F");
		title = title.replaceAll(" ", "_");
		title = title.replaceAll("[", "(");
		title = title.replaceAll("]", ")");
		title = title.replaceAll("#", "");

		// open wiki page in new tab
		const a = document.createElement("a");
		a.href = url + title;
		a.target = "_blank";
		a.click();
	}
})();