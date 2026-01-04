// ==UserScript==
// @name         TransALot
// @namespace    http://tampermonkey.net/
// @version      v1.1.2
// @description  make the world transition!
// @author       PCwqyy
// @match        http://*/*
// @match        https://*/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/567385.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507940/TransALot.user.js
// @updateURL https://update.greasyfork.org/scripts/507940/TransALot.meta.js
// ==/UserScript==

(function() {
    var Body114=document.getElementsByTagName("body");
	var Id=setInterval(()=>{
		if(Body114.length!=0)
		{
			var Style114=document.createElement('style');
			Style114.textContent="*{transition: 2s;}a{transition: 0.5s;}span{transition: 0s;}";
			Body114[0].appendChild(Style114);
			clearInterval(Id);
		}
	},10);
})();