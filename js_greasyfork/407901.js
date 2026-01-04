// ==UserScript==
// @name Reddit Minimal Dark
// @namespace https://old.reddit.com
// @version 1.0.1
// @description Minimal Dark UserCSS style for Reddit
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/407901/Reddit%20Minimal%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/407901/Reddit%20Minimal%20Dark.meta.js
// ==/UserScript==

(function() {
let css = `

/* Hide annoying stuff */
.give-gold-button,
.goldvertisement,
.embed-comment,
.nub {
	display: none !important;
}
/* Reset */
*, *:before, *:after {
	background-color: transparent !important;
	border: none !important;
	color: #777 !important;
}
/* Default links */
a {
	color: #48b !important;
}
a:visited {
	color: #369 !important;
}
a:hover {
	color: #5ad !important;
}
/* Background */
html,
body,
#sr-more-link {
	background-color: #222 !important;
}
/* Top bar */
#header-img,
#mail,
.sidebox.create .spacer a {
	filter: invert(80%) hue-rotate(180deg) !important;
}
.drop-choices,
.hover-bubble,
.modal-dialog {
	background: #111 !important;
}
.tabmenu .selected a {
	color: #999 !important;
}
/* Side bar */
.listing-chooser-collapsed .grippy {
	width: 1px !important;
}
.listing-chooser-collapsed .listing-chooser {
	padding-right: 1px !important;
}
.listing-chooser li.selected {
	box-shadow: none !important;
}
.grippy:after {
	display: none !important;
}
/* Inputs and buttons */
input,
textarea,
.linkinfo .shortlink input,
.new-comment .usertext-body,
.morelink a,
.morelink:hover a,
.fancy-toggle-button a,
.usertext button {
	background: #333 !important;
	color: #999 !important;
	font-weight: normal !important;
}
/* Listing */
.thing .title {
	color: #aaa !important;
}
.title:visited {
	color: #777 !important;
}
.thing .title:hover {
	color: #ccc !important;
}
.arrow {
	filter: brightness(45%);
}
.arrow.upmod,
.arrow.downmod {
	filter: brightness(50%) contrast(120%);
}
.link .score.likes {
	color: #b3684d !important;
}
.link .score.dislikes {
	color: #7070c2 !important;
}
.expando-button {
	filter: brightness(45%) contrast(180%);
	background-color: transparent !important;
}
.moderator,
.green {
	color: #3a3 !important;
}
.admin,
.nsfw-stamp * {
	color: #a66 !important;
}
.pagename a,
.trophy-name {
	color: #999 !important;
}
.buttons li {
	padding: 0 !important;
}
.buttons a {
	margin-right: 8px !important;
	color: #888 !important;
}
.buttons a:visited {
	color: #666 !important;
}
.buttons a:hover {
	color: #aaa !important;
}
.pagename,
.tabmenu li,
.link .midcol,
.buttons a,
.subreddit {
	font-weight: normal !important;
}
.search-expando.collapsed:before,
.comment-fade {
	display: none !important;
}
.recommended-link {
	border-color: #333 !important;
}
/* Comments */
.link .usertext .md,
blockquote,
pre,
code,
.gold-accent {
	background-color: #111 !important;
}
.md blockquote {
	border-left: solid 4px #333 !important;
}
.md td {
	border: solid 1px #333 !important;
}
hr {
	border-bottom: solid 1px #333 !important;
}
.comment .author,
.morecomments a {
	font-weight: normal !important;
}
/* RES */
.guider,
.guiders_button,
.res-fancy-toggle-button,
#RESConsoleContainer,
#RESShortcutsAddFormContainer {
	background: #222 !important;
}
.RESDialogSmall,
.RESDropdownOptions,
.RESNotification,
#alert_message {
	background: #111 !important;
}
.RES-keyNav-activeElement,
.RES-keyNav-activeElement .md-container {
	background: #333 !important;
}
.res-nightmode .arrow {
	filter: none !important;
}
/* new.reddit.com */
#header,
#lightbox,
#hamburgers,
#overlayScrollContainer,
#SHORTCUT_FOCUSABLE_DIV > div:first-child,
header,
div[data-redditstyle],
body > div,
div[style^="left:"]
div[role="button"] {
	background-color: #222 !important;
}
#header svg {
	filter: invert(90%) hue-rotate(180deg);
}
div[contenteditable="true"] {
	background: #333 !important;
}
#overlayFixedContent + div {
	background: rgba(0, 0, 0, 0.7) !important;
}
div[data-slot] {
	display: none !important;
}
.icon, .icon:before {
	color: inherit !important;
}
a[data-click-id="timestamp"] {
	color: #777 !important;
}
a[data-click-id="body"] h2 {
	color: #aaa !important;
}
a[data-click-id="body"]:visited h2 {
	color: #777 !important;
}
.scrollerItem {
	box-shadow: none !important;
}

div.content::before { display: none !important; }
div.infobar-toaster-container { display: none !important; }
div.side { display: none !important; }
.bottommenu-advertise { display: none !important; }
section.infobar { display: none !important; }

body div#sr-header-area { background-color: #222 !important; border-bottom: none !important; }
body div#sr-header-area a { color: #48b !important; }
body div#sr-header-area a#sr-more-link { background: #222 !important; }
#header-bottom-left .tabmenu { position: initial !important; }

body.comments-page .sitetable.nestedlisting { background: initial !important; }
body.comments-page .commentarea .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
body.comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
/* the below 11 lines is merely a copy of the above 11 lines, to correct the userscript version of this UserCSS style */
html:lang(np) .comments-page .sitetable.nestedlisting { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }
html:lang(np) .comments-page .commentarea .comment .comment .comment .comment .comment .comment .comment .comment .comment .comment { background: initial !important; }

div#overlayScrollContainer > div:first-child { background: #222 !important; }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
