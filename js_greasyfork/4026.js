// ==UserScript==
// @name       emotes for fine dining
// @namespace  http://use.i.E.your.homepage/
// @version    8
// @description  Either go Raw or go home. Credit to Rhagg's for starting the code off.
// @match      http://instasynch.com/rooms/*
// @grant none
// @copyright  1946
// @downloadURL https://update.greasyfork.org/scripts/4026/emotes%20for%20fine%20dining.user.js
// @updateURL https://update.greasyfork.org/scripts/4026/emotes%20for%20fine%20dining.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
// version 
 
// KitchenHell's emotes
// by Rhaggs and Davey
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = '/*alert("test");*/ \
        setTimeout(function(){ /*alert("abc"); */ \
        $codes["raw"] = \'<img src="http://imgur.com/NW9oGy2.png">\'; \
        $codes["giveup"] = \'<img src="http://i.imgur.com/35FpetD.gif">\'; \
        $codes["dumbo"] = \'<img src="http://i.imgur.com/YemL9d3.gif">\'; \
        $codes["yes"] = \'<img src="http://i.imgur.com/QglALDX.gif">\'; \
        $codes["comeon"] = \'<img src="http://i.imgur.com/2OL5qua.gif">\'; \
        $codes["amy"] = \'<img src="http://i.imgur.com/PDFkgoI.gif">\'; \
        $codes["bb"] = \'<img src="http://i.imgur.com/Qbmleyg.png">\'; \
        $codes["open"] = \'<img src="http://i.imgur.com/7sGQXlH.gif">\'; \
	$codes["unf"] = \'<img src="http://i.imgur.com/wlzoeTV.gif">\'; \
	$codes["stop"] = \'<img src="http://i.imgur.com/m1IPmaZ.gif">\'; \
	$codes["gey"] = \'<img src="http://i.imgur.com/XKhZt3T.jpg">\'; \
	$codes["raj"] = \'<img src="http://i.imgur.com/2u167ZB.jpg">\'; \
	$codes["matty"] = \'<img src="http://i.imgur.com/2qNrVcJ.png">\'; \
	$codes["jp"] = \'<img src="http://i.imgur.com/RS7fa6C.gif">\'; \
	$codes["hadenuf"] = \'<img src="http://i.imgur.com/lWVTkqd.gif">\'; \
	$codes["queen"] = \'<img src="http://i.imgur.com/eAREj26.png">\'; \
	$codes["omg"] = \'<img src="http://i.imgur.com/hnL3TsC.gif">\'; \
	$codes["cold"] = \'<img src="http://i.imgur.com/anZMO11.gif">\'; \
	$codes["out"] = \'<img src="http://i.imgur.com/q44UPS0.gif">\'; \
	}, 1500);'
        ;
 
document.body.appendChild(script);