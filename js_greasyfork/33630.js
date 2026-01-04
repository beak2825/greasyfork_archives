// ==UserScript==
// @name          YouTube Old Colors
// @namespace     http://userstyles.org
// @description	  Changes all the bright red colors on YouTube to the darker red that was previously used. The new color is the same as how is used to be and is easier on the eyes than the super-bright color they now use. It also replaces the new YouTube logo with the old one.
// @author        Salty Robot
// @homepage      https://userstyles.org/styles/147374
// @include       http://youtube.com/*
// @include       https://youtube.com/*
// @include       http://*.youtube.com/*
// @include       https://*.youtube.com/*
// @run-at        document-start
// @version       0.20170831050149
// @downloadURL https://update.greasyfork.org/scripts/33630/YouTube%20Old%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/33630/YouTube%20Old%20Colors.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Made by Salty Robot",
	"Version 2 */",
	"",
	"/* Subscription box */",
	"",
	".exp-invert-logo .resume-playback-progress-bar, .exp-invert-logo .yt-uix-button-subscribe-branded, .exp-invert-logo .yt-uix-button-subscribe-branded[disabled], .exp-invert-logo .yt-uix-button-subscribe-branded[disabled]:hover, .exp-invert-logo .yt-uix-button-subscribe-branded[disabled]:active, .exp-invert-logo .yt-uix-button-subscribe-branded[disabled]:focus, .exp-invert-logo .sb-notif-on .yt-uix-button-content, .exp-invert-logo .guide-item.guide-item-selected, .exp-invert-logo .guide-item.guide-item-selected:hover, .exp-invert-logo .guide-item.guide-item-selected .yt-deemphasized-text, .exp-invert-logo .guide-item.guide-item-selected:hover .yt-deemphasized-text {",
	"    background-color: #CC181E !important;",
	"}",
	"",
	"/* Other things */",
	"",
	".exp-invert-logo a.yt-uix-button-epic-nav-item:hover, .exp-invert-logo a.yt-uix-button-epic-nav-item.selected, .exp-invert-logo a.yt-uix-button-epic-nav-item.yt-uix-button-toggled, .exp-invert-logo a.yt-uix-button-epic-nav-item.partially-selected, .exp-invert-logo a.yt-uix-button-epic-nav-item.partially-selected:hover, .exp-invert-logo button.yt-uix-button-epic-nav-item:hover, .exp-invert-logo button.yt-uix-button-epic-nav-item.selected, .exp-invert-logo button.yt-uix-button-epic-nav-item.yt-uix-button-toggled, .exp-invert-logo .epic-nav-item:hover, .exp-invert-logo .epic-nav-item.selected, .exp-invert-logo .epic-nav-item.yt-uix-button-toggled, .exp-invert-logo .epic-nav-item-heading, .exp-invert-logo .yt-gb-shelf-item-thumbtab.yt-gb-selected-shelf-tab::before {",
	"    border-color: #CC181E !important;",
	"}",
	"",
	"/* Logo */",
	"",
	".exp-invert-logo #header:before, .exp-invert-logo .ypc-join-family-header .logo, .exp-invert-logo #footer-logo .footer-logo-icon, .exp-invert-logo #yt-masthead #logo-container .logo, .exp-invert-logo #masthead #logo-container, .exp-invert-logo .admin-masthead-logo a, .exp-invert-logo #yt-sidebar-styleguide-logo #logo {",
	"    background: no-repeat url(http://i.imgur.com/H2soYno.png) !important;",
	"    background-size: 71px 30px !important;",
	"}",
	"",
	".exp-invert-logo #header:before, .exp-invert-logo .ypc-join-family-header .logo, .exp-invert-logo #footer-logo .footer-logo-icon, .exp-invert-logo #yt-masthead #logo-container .logo, .exp-invert-logo #masthead #logo-container, .exp-invert-logo .admin-masthead-logo a, .exp-invert-logo #yt-sidebar-styleguide-logo #logo {",
	"    ",
	"    width: 75px;",
	"    height: 30px;",
	"}",
	"",
	"",
	"/* Tiny logos */",
	"",
	".exp-invert-logo .guide-item .guide-video-youtube-red-icon {",
	"    background: no-repeat url(http://i.imgur.com/aWl0dpx.png) !important;",
	"    width: 20px !important;",
	"    height: 20px !important;",
	"}",
	"",
	".guide-item .guide-unplugged-icon {",
	"    background: no-repeat url(http://i.imgur.com/nt1wenI.png) !important;",
	"    background-size: auto !important;",
	"    width: 20px !important;",
	"    height: 20px !important;",
	"}",
	"",
	"/* Various texts */",
	"",
	".exp-invert-logo li.guide-section h3, .exp-invert-logo li.guide-section h3 a {",
	"    color: #cc181e !important;",
	"}",
	"",
	"/* YT Live box */",
	"",
	".yt-badge-live {",
	"    border: 1px solid #CC181E;",
	"    color: #CC181E;",
	"}"
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
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
