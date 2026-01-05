
// ==UserScript==
// @name       penis
// @namespace  http://use.i.E.your.homepage/
// @version    0.2
// @description  pls enjoy
// @match      http://instasynch.com/rooms/SouthPark
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2803/penis.user.js
// @updateURL https://update.greasyfork.org/scripts/2803/penis.meta.js
// ==/UserScript==

 
// instasynch.com/rooms/SouthPark
// emote script for greasemonkey or tampermonkey.
// version 1
 
// amazing emotes for south park room
// froggyfrog
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = '/*alert("test");*/ \
        setTimeout(function(){ /*alert("abc"); */ \
		$codes["GIANTPENIS"] = \'<img src="http://i.imgur.com/fdFTQqK.png">\'; \
        }, 1500);'
        ;
 
document.body.appendChild(script);