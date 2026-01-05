// ==UserScript==
// @name           Cyrpt reminder
// @namespace      https://userscripts-mirror.org/users/75549
// @description    Reminds you what to optimize in each cyrpt zone
// @include        http://127.0.0.1*crypt.php
// @include        *kingdomofloathing.com*crypt.php
// @version 0.0.1.20170802072201
// @downloadURL https://update.greasyfork.org/scripts/4137/Cyrpt%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/4137/Cyrpt%20reminder.meta.js
// ==/UserScript==

places = document.getElementsByTagName('a');
for(i=0;i<places.length;i++)
{
	if(places[i].href.indexOf("264") != -1)
	{
		places[i].title = "+item";
	}
	if(places[i].href.indexOf("263") != -1)
	{
		places[i].title = "olfact dirty lihc";
	}
	if(places[i].href.indexOf("262") != -1)
	{
		places[i].title = "+NC, +ML";
	}
	if(places[i].href.indexOf("261") != -1)
	{
		places[i].title = "+init";
	}
}