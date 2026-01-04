// ==UserScript==
// @name        Monitor Royal Mail site
// @version     1.0
// @description Get notified of changes
// @author      Scott
// @include     https://www.royalmail.com/*
// @include     */tracking-results/*
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @require		https://greasyfork.org/scripts/421266-easy-cookie-manager/code/Easy%20Cookie%20Manager.js?version=905199
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/429944/Monitor%20Royal%20Mail%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/429944/Monitor%20Royal%20Mail%20site.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jQuery = unsafeWindow.jQuery; 			//Need for Tampermonkey or it raises warnings.
    var $ = unsafeWindow.jQuery; 				//Need for Tampermonkey or it raises warnings.

    var notificationRepeatTime = 60000;			//Notification of update is raised every 60 seconds (60000) by default
    var pageRefreshTime = 300000;				//Page refreshes every 5 minutes (300000) by default
    var packageID = window.location;			//Current page URL
    packageID = packageID.toString().split("/");//Split out URL
    packageID = packageID.pop();				//Get ID of package (Used in setting cookie name)


	//
	//Refresh page every x minutes
	//
	setInterval(function()
		{
			location.reload();
		}, pageRefreshTime);


	//
	//If dropdown exists, click to open it
	//
	var dropdownExists = setInterval(function() {
		if ($('.accordion-header').length)
		{
			jQuery(".accordion-header").click();
			clearInterval(dropdownExists);
		}
	}, 250);


	//
	//Get number of updates currently on the page
	//
	var historyItems = jQuery(".history-item").length;
    //historyItems = historyItems + 3; //Used for testing only, it increases the number of items this script things there are on the page


	//
	//Cookie check
		//If existing, compare with number of items on page, alert user if page is greater than number in cookie
		//If not existing, create and continue so it's ready for next time
	//
	if (getCookie("RoyalMailPackage" + packageID)) {console.log("Cookie already exists, current value = " + getCookie("RoyalMailPackage" + packageID));}

    if (getCookie('RoyalMailPackage' + packageID) < historyItems)
		{
			setInterval(function()
				{
					Notification.requestPermission().then(function(result) {
					var text = 'There is an update on your package!';
					var notification = new Notification('Royal Mail Update!', { body: text });
				});
			}, notificationRepeatTime);

			setCookie('RoyalMailPackage' + packageID,'' + historyItems,"","","");
            console.log("Cookie updated, new value = " + getCookie('RoyalMailPackage' + packageID));
		}
	else if (!getCookie('RoyalMailPackage' + packageID))
		{
			setCookie('RoyalMailPackage' + packageID,'' + historyItems,"","","31");
            console.log("Cookie created, current value = " + getCookie('RoyalMailPackage' + packageID));
		}


})();