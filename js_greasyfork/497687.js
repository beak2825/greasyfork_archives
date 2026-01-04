// ==UserScript==
// @name         dszh无头贴显示
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  dszh无头贴显示★
// @license MIT
// @author       zds
// @match        https://dszh.org/list.php?*
// @match        *://dszh.xyz/list.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dszh.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497687/dszh%E6%97%A0%E5%A4%B4%E8%B4%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/497687/dszh%E6%97%A0%E5%A4%B4%E8%B4%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){//do something

	var lists = document.getElementsByTagName("a");
	for(var i = 0;i < lists.length;i++)
	{
		if(lists[i].innerText==""&&lists[i].href.includes("show"))
		{
			lists[i].innerText="★";
		}
	}
}
})();