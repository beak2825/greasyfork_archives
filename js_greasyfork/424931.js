// ==UserScript==
// @name          Remplazar endscreen por gif animado
// @description	  Remplazar endscreen por gif animado al terminar videos youtube
// @version       1.0.0
// @author        AyD
// @include       https://www.youtube.com/watch*
// @include       https://www.youtube.com/embed/*
// @namespace https://greasyfork.org/users/758165
// @downloadURL https://update.greasyfork.org/scripts/424931/Remplazar%20endscreen%20por%20gif%20animado.user.js
// @updateURL https://update.greasyfork.org/scripts/424931/Remplazar%20endscreen%20por%20gif%20animado.meta.js
// ==/UserScript==
(function() {var css = [
  
".ytp-show-tiles .ytp-videowall-still{display: none!important; }",

".html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles{",
"background-image: url(https://i.pinimg.com/originals/5f/83/34/5f83344fa4ac946d95bf41aeb298e88d.gif)!important;",
"background-repeat: repeat-x!important; background-size: contain!important;transform: scale(1.20)translateY(-10px); background-position: center;}",   
    
"div [theater] .html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles{transform: scale(1.1)translateY(-10px);}"	

].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("document");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
