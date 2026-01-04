// ==UserScript==
// @name         Slow In
// @namespace    http://tampermonkey.net/
// @version      v1.1.2
// @description  help to make the world transition!
// @author       PCwqyy
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @icon         https://cdn.luogu.com.cn/upload/usericon/567385.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507939/Slow%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/507939/Slow%20In.meta.js
// ==/UserScript==

(function() {
	var Body514=document.getElementsByTagName("body");
	var Id114=setInterval(()=>{
		if(Body514.length!=0)
		{
			var Displayer514=document.createElement('div');
			Displayer514.id="transdisplayer"
			var Style514=document.createElement('style');
			Style514.textContent=`
				@keyframes transss{
					0%{opacity: 1;}
					100%{opacity: 0;}
				}
				@keyframes transsss{
					0%{opacity: 0;}
					100%{opacity: 1;}
				}
				#transdisplayer{
					width:100vw;
					height:100vh;
					z-index:1145141919810;
					position: fixed;
					left: 0px;
					top: 0px;
					animation: transss 0.9s;
					background-color: white;
				}
				*{animation: transsss 1s;}
			`;
			Body514[0].appendChild(Style514);
			Body514[0].appendChild(Displayer514);
			setTimeout(()=>{Displayer514.style.display="none";},950);
			clearInterval(Id114);
		}
	});
})();