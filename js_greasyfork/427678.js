// ==UserScript==
// @name YouTube: Quality of Life
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @match https://www.youtube.com/embed/*
// @downloadURL https://update.greasyfork.org/scripts/427678/YouTube%3A%20Quality%20of%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/427678/YouTube%3A%20Quality%20of%20Life.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "youtube.com" || location.hostname.endsWith(".youtube.com"))) {
		css += `
			@import url('https://rsms.me/inter/inter.css');
		    
		    * {
				font-family: 'Inter' !important;
			}
			
		    html {
		        scrollbar-color: #787879 #272728;
		    }
		    
		    ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy, ytd-watch-flexy[fullscreen] #player-theater-container.ytd-watch-flexy {
		        background: transparent;
		    }
		`;
}
if (location.href.startsWith("https://www.youtube.com/embed/")) {
		css += `
			.ytp-chrome-top.ytp-show-cards-title,
			.ytp-paid-content-overlay,
			.ytp-impression-link,
			.ytp-pause-overlay,
			a.ytp-button.yt-uix-sessionlink {
				display: none;
			}
			
			.ytp-large-play-button-bg {
				fill: #212121 !important;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
