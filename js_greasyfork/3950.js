// ==UserScript==
// @name       emotes for fine dining
// @namespace  http://use.i.E.your.homepage/
// @version    6.2
// @description  Raw memes
// @match      http://instasynch.com/rooms/KitchenHell
// @grant none
// @copyright  2014
// @downloadURL https://update.greasyfork.org/scripts/3950/emotes%20for%20fine%20dining.user.js
// @updateURL https://update.greasyfork.org/scripts/3950/emotes%20for%20fine%20dining.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
// $codes[""] = \'<img src="">\'; \
 
// KitchenHell's emotes
// by Rhaggs (Credit to froggyfrog for the the HUGE copy pasta)
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
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
 
document.head.appendChild(script);