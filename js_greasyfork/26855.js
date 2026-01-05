// ==UserScript==
// @name         Mediaset Unlimited Streaming
// @version      0.1
// @description  Mediaset unlimited streaming without logging in!
// @author       Gia90
// @include      /http:\/\/(?:www\.)*mediaset\.it\/(?:canale5|italia1|rete4|la5|italia2|mediasetextra|topcrime|iris)/
// @namespace https://greasyfork.org/users/97781
// @downloadURL https://update.greasyfork.org/scripts/26855/Mediaset%20Unlimited%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/26855/Mediaset%20Unlimited%20Streaming.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	startTimer = function(max) {
		var textbox = document.createElement("div");
		textbox.innerHTML = "<b>ENJOY UNLIMITED STREAMING by Gia90</b>";
		textbox.className = "countdown";
		textbox.style.textTransform = "none";
		document.getElementById('video-player').appendChild(textbox);
	};
}, false);
