
// ==UserScript==
// @name       south park emotes
// @namespace  http://use.i.E.your.homepage/
// @version    0.3.1.1
// @description  pls enjoy
// @match      http://instasynch.com/rooms/SouthPark
// @grant none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2758/south%20park%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/2758/south%20park%20emotes.meta.js
// ==/UserScript==

 
// instasynch.com/rooms/SouthPark
// emote script for greasemonkey or tampermonkey.
// version 1
 
// amazing emotes for south park room
// by froggyfrog
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = '/*alert("test");*/ \
        setTimeout(function(){ /*alert("abc"); */ \
        $codes["cry"] = \'<img src="http://i.imgur.com/3Lv0MpY.gif">\'; \
        $codes["puke"] = \'<img src="http://i.imgur.com/y6msFcc.gif">\'; \
        $codes["faggot"] = \'<img src="http://i.imgur.com/xE0hNYn.gif">\'; \
        $codes["retardalert"] = \'<img src="http://i.imgur.com/STPz7DH.gif">\'; \
        $codes["snooki"] = \'<img src="http://i.imgur.com/VbOm00X.gif">\'; \
        $codes["catpee"] = \'<img src="http://i.imgur.com/CoSQJoI.gif">\'; \
        $codes["idowhatiwant"] = \'<img src="http://i.imgur.com/J31n5BM.jpg">\'; \
        $codes["inhale"] = \'<img src="http://i.imgur.com/8IXAubf.jpg">\'; \
        $codes["tyrone"] = \'<img src="http://i.imgur.com/rd4qpxQ.jpg">\'; \
        $codes["whatamiseeing"] = \'<img src="http://i.imgur.com/s8fUHCd.gif">\'; \
	$codes["autism"] = \'<img src="http://i.imgur.com/MBhWYSR.gif">\'; \
	$codes["dank"] = \'<img src="http://i.imgur.com/l6lANcx.gif">\'; \
	$codes["happening"] = \'<img src="http://i.imgur.com/642PjCs.gif">\'; \
	$codes["go"] = \'<img src="http://i.imgur.com/aqhrV.gif">\'; \
	$codes["XD"] = \'<img src="http://i.imgur.com/3pRAj4N.jpg">\'; \
	$codes["steveapprove"] = \'<img src="http://i.imgur.com/jQFp9cX.gif">\'; \
	$codes["joy"] = \'<img src="http://i.imgur.com/deDVz4r.gif">\'; \
	$codes["spook"] = \'<img src="http://i.imgur.com/IkS8h9M.gif">\'; \
	$codes["notcp"] = \'<img src="http://i.imgur.com/O8O7n.gif">\'; \
	$codes["ban"] = \'<img src="http://i.imgur.com/tua4xS9.gif">\'; \
	$codes["fedora"] = \'<img src="http://i.imgur.com/z0ZDirP.jpg">\'; \
	$codes["bro"] = \'<img src="http://i.imgur.com/tetARvq.gif">\'; \
	$codes["pedo"] = \'<img src="http://i.imgur.com/6iBSmUe.jpg">\'; \
        $codes["dorksided"] = \'<img src="http://i.imgur.com/w9jFu.jpg">\'; \
        $codes["typicalamerican"] = \'<img src="http://i.imgur.com/MpMFw.gif">\'; \
        $codes["smug"] = \'<img src="http://i.imgur.com/VsXwe.png">\'; \
	$codes[":O"] = \'<img src="http://i.imgur.com/c3ta0qY.gif">\'; \
	$codes["santa"] = \'<img src="http://i.imgur.com/fNoyE6r.jpg">\'; \
	$codes["face"] = \'<img src="http://i.imgur.com/fl8vC15.jpg">\'; \
	$codes["lel"] = \'<img src="http://i.imgur.com/OBJjgM5.jpg">\'; \
        }, 1500);'
        ;
 
document.body.appendChild(script);