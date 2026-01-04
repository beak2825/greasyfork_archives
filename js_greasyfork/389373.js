// ==UserScript==
// @name           Redirect to old osu! site
// @description    Redirects to osu! old site by simulating click event on site switcher button, and also updates site version cookie expiration date
// @author         Devocub
// @copyright      2019, Devocub
// @version        0.1
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http*://osu.ppy.sh/*
// @include        http*://new.ppy.sh/*
// @grant          none
// @namespace https://greasyfork.org/users/296854
// @downloadURL https://update.greasyfork.org/scripts/389373/Redirect%20to%20old%20osu%21%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/389373/Redirect%20to%20old%20osu%21%20site.meta.js
// ==/UserScript==

// switcher code
// https://s.ppy.sh/js/site-switcher.js

Main();

function Main ()
{
    // update cookie
    document.cookie = 'osu_site_v=old; path=/; domain=.ppy.sh; max-age=9999999999999;';

    // new or old site ?
    // code from switcher
    var currentPage = document.location.pathname + document.location.search;
    var newSitePaths = /^\/(admin|beatmaps|beatmapsets|community|store|users|help|home|rankings|legal|mp|g|groups)/i;
    var newSite = newSitePaths.test(currentPage);

    // run click event only on new site
     if (newSite)
	{
		// switcher button element
		var switcherButton = document.getElementById('osu-site-switcher');

		// check button exists
		if (switcherButton !== null)
		{
			// log
			console.log("Redirect to old site: switching to old site\n");

			// simulate click
			eventFire(switcherButton, 'click');
		}

    }

}

// Simulate event function
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}