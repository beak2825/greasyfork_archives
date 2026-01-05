// ==UserScript==
// @name        Howrse BannerAd Border Removal
// @namespace   myHowrse
// @description Removes the border for the Banner Ad on Howrse.
// @include     http://www.howrse.com/*
// @exclude     http://www.howrse.com/member/forum/
// @exclude     http://www.howrse.com/member/forum/topics/*
// @author      daexion
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/206/Howrse%20BannerAd%20Border%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/206/Howrse%20BannerAd%20Border%20Removal.meta.js
// ==/UserScript==

var l = document.getElementsByTagName('div');

var i=0;

while(i<l.length)
{
	if(l[i].hasAttribute("style"))
	{
		GM_log(l[i].getAttribute("style"));
		if(l[i].getAttribute("style") == "float: left; min-width: 728px; padding-left: 0px; min-height: 90px; border: 2px solid rgb(200, 223, 229);")
		{
			l[i].setAttribute("style","float: left; min-width: 728px; padding-left: 0px; min-height: 90px; border: 0px solid rgb(200, 223, 229);");
			i=l.length;
		}
		if(l[i].getAttribute("style") == "float: left; min-width: 728px; padding-left: 0px; min-height: 90px; border: 2px solid #C8DFE5;")
		{
			l[i].setAttribute("style","float: left; min-width: 728px; padding-left: 0px; min-height: 90px; border: 0px solid #C8DFE5;");
			i=l.length;
		}
	}
	++i;
};