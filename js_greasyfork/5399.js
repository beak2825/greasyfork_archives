// ==UserScript==
// @id             amazon.com_mobile2desktop
// @name           Amazon.com auto redirect mobile to desktop version
// @version        1.3.2
// @namespace      V@no
// @author         V@no
// @description    Automatically redirect from mobile version to desktop version of the page.
// @include        http://amazon.com/*
// @include        http://www.amazon.com/*
// @include        https://amazon.com/*
// @include        https://www.amazon.com/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/5399/Amazoncom%20auto%20redirect%20mobile%20to%20desktop%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/5399/Amazoncom%20auto%20redirect%20mobile%20to%20desktop%20version.meta.js
// ==/UserScript==

//redirect mobile to desktop
(function()
{
	let log = console.log.bind(console);
	if (location.pathname.match(/^\/gp\/aw\//i))
	{
		window.location.replace(window.location.toString().replace(/^(https?:\/\/(www\.)?amazon\.com\/)gp\/aw\/(d\/)?(.*)/ig, "$1dp/$4"));
	}
	else
	{
		//redirect to charity amazon
		if (!location.hostname.match(/smile\.amazon\.com/i) && location.href.indexOf("signin") == -1)
		{
			let smile = window.location.toString().replace(/^(https?:\/\/)([^\/]+)\/(.*)/ig, "$1smile.amazon.com/$3");
			if (location.search.indexOf("pldnSite") == -1)
			{
log("Redirecting to smile.amazon.com");
				window.location.replace(smile);
			}
			else
			{
log("Can't redirect to smile.amazon.com due to pldnSite")
			}
		}
	}
})();