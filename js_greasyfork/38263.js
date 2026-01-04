// ==UserScript==
// @name         Emotes for GordonRamsey
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  More to come!
// @author       MasterBateman
// @match        http://instasync.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38263/Emotes%20for%20GordonRamsey.user.js
// @updateURL https://update.greasyfork.org/scripts/38263/Emotes%20for%20GordonRamsey.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
// $codes[""] = \'<img src="">\'; \

// GordonRamsey's emotes
// by MasterBateman (Credit to froggyfrog for the the HUGE copy pasta)
// based of KitchenHell's emotes by Rhaggs, the redundants and broken links have been removed
// Make instasynch great again!
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ /*alert("abc"); */ \
        $codes["raw"] = \'<img src="https://i.imgur.com/CNLyYcB.gif?1">\'; \
        $codes["giveup"] = \'<img src="http://i.imgur.com/35FpetD.gif">\'; \
        $codes["dumbo"] = \'<img src="http://i.imgur.com/YemL9d3.gif">\'; \
        $codes["yes"] = \'<img src="http://i.imgur.com/QglALDX.gif">\'; \
        $codes["comeon"] = \'<img src="http://i.imgur.com/2OL5qua.gif">\'; \
        $codes["amy"] = \'<img src="http://i.imgur.com/PDFkgoI.gif">\'; \
        $codes["bb"] = \'<img src="http://i.imgur.com/Qbmleyg.png">\'; \
        $codes["open"] = \'<img src="http://i.imgur.com/7sGQXlH.gif">\'; \
	$codes["unf"] = \'<img src="http://i.imgur.com/wlzoeTV.gif">\'; \
	$codes["stop"] = \'<img src="http://i.imgur.com/m1IPmaZ.gif">\'; \
	$codes["lamb"] = \'<img src="https://i.imgur.com/yIuamYF.jpg?1">\'; \
	$codes["jp"] = \'<img src="http://i.imgur.com/RS7fa6C.gif">\'; \
	$codes["hadenuf"] = \'<img src="http://i.imgur.com/lWVTkqd.gif">\'; \
	$codes["red"] = \'<img src="https://i.imgur.com/dwF0fRb.png?1">\'; \
	$codes["omg"] = \'<img src="http://i.imgur.com/hnL3TsC.gif">\'; \
	$codes["cold"] = \'<img src="http://i.imgur.com/anZMO11.gif">\'; \
	$codes["out"] = \'<img src="http://i.imgur.com/q44UPS0.gif">\'; \
	$codes["blue"] = \'<img src="https://i.imgur.com/tt7Jaju.png?1">\'; \
        $codes["ramsey"] = \'<img src="https://i.imgur.com/3StUQix.jpg?1">\'; \
        $codes["sadsy"] = \'<img src="https://i.imgur.com/i7JR1P9.jpg?1">\'; \
        $codes["fuck"] = \'<img src="https://i.imgur.com/S2ULqQ7.gif?2">\'; \
        $codes["wtf"] = \'<img src="https://i.imgur.com/wvefcE4.jpg?1">\'; \
	}, 1500);'
        ;

document.head.appendChild(script);