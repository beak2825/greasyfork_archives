// ==UserScript==
// @name        DECIPHER - Expand userlist
// @version     1
// @description Makes list of users larger so it's easier to view at-a-glance
// @author      Scott / SSearle
// @include		https://survey-d.dynata.com/apps/portal/*
// @include		projects/detail/selfserve/*/*
// @exclude     *:xmledit
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/232210
// @downloadURL https://update.greasyfork.org/scripts/423571/DECIPHER%20-%20Expand%20userlist.user.js
// @updateURL https://update.greasyfork.org/scripts/423571/DECIPHER%20-%20Expand%20userlist.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jQuery = unsafeWindow.jQuery; 	//Need for Tampermonkey or it raises warnings.
	var timer1 = setInterval(enlargeBox,100);

	function enlargeBox()
		{
			//if (!jQuery(".btn-tertiary").text().includes("Add User / Group"))	//If you're -NOT- on the user list
				//{																//
	        		jQuery(".nav-link").eq(1).click();							//Click on it
					jQuery(".main").height("600px");							//Set height
	        		clearInterval(timer1);										//Stop
				//}
		}

})();