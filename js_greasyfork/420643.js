// ==UserScript==
// @name         microsoftstream auto theatre
// @version      0.2
// @description  full auto theatre
// @author       cckats
// @match        https://web.microsoftstream.com/video/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/420643/microsoftstream%20auto%20theatre.user.js
// @updateURL https://update.greasyfork.org/scripts/420643/microsoftstream%20auto%20theatre.meta.js
// ==/UserScript==

( function() {
    'use strict';
    var test=0;
    const interval = setInterval(function() {
        if(document.getElementsByClassName("amp-theater-icon vjs-control vjs-button")[0].innerText == "Theater mode"){
            document.getElementsByClassName("amp-theater-icon vjs-control vjs-button")[0].click();
        }

		var css = ["video-page .row + .row{margin-top: 0px!important;}.row {    max-width: 89rem!important;}"].join("\n");
		if( document.getElementById("skin") == null){
			if (typeof GM_addStyle != "undefined") {
				GM_addStyle(css);
			} else if (typeof PRO_addStyle != "undefined") {
				PRO_addStyle(css);
			} else if (typeof addStyle != "undefined") {
				addStyle(css);
			} else {
				var node = document.createElement("style");
				node.setAttribute("id", "skin");
				node.type = "text/css";
				node.appendChild(document.createTextNode(css));
				var heads = document.getElementsByTagName("head");
				if (heads.length > 0) {
					heads[0].appendChild(node);
				} else {
					// no head yet, stick it whereever
					document.documentElement.appendChild(node);
				}
			}
		}
test++;
        if(test >= 6){
            clearInterval(interval);
        }
},500)

})();