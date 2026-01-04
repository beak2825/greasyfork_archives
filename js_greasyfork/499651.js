// ==UserScript==
// @name Sniffs All
// @namespace https://greasyfork.org/users/651255
// @version 0.0.1.20241124090832
// @description This is your new file, start writing code
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/499651/Sniffs%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/499651/Sniffs%20All.meta.js
// ==/UserScript==

(function() {
let css = `app-advertising-zone-map {
	display: none !important;
}

#upgrade {
	display: none !important;
}

app-chat-list-ad {
	display: none !important;
}

.conversation-content-container *,
.chat-avatar * {
	pointer-events: none !important;
}

.conversation-content-container .delete-click-overlay {
	pointer-events: all !important;
}



/* ============================================================= */


app-info-window-current-visitor:not(.noPic) .my-profile .app-screen,
app-info-window-current-visitor:not(.noPic) .his-profile .app-screen {
    max-width: 960px !important;
}

app-info-window-current-visitor:not(.noPic) .my-profile .app-panel,
app-info-window-current-visitor:not(.noPic) .his-profile .app-panel {
    max-width: 960px !important;
}

app-info-window-current-visitor:not(.noPic) .profile-overlay {
	background: transparent !important;
}

app-info-window-current-visitor:not(.noPic) .my-profile .panel-upper-controls,
app-info-window-current-visitor:not(.noPic) .his-profile .panel-upper-controls {
	position: absolute;
	right: 0;
	width: 50%;
}

app-info-window-current-visitor:not(.noPic) .profile-image-container.cropped {
    width: 50% !important;
    position: absolute !important;
    right: unset !important;
}

app-info-window-current-visitor:not(.noPic) .his-profile .chat-messages-panel {
    width: 50% !important;
    right: 0;
    background: #444;
}

app-info-window-current-visitor:not(.noPic) .his-profile .chat-input-panel {
    width: 50% !important;
    right: 0;
}

app-info-window-current-visitor:not(.noPic) #profile #profile-container {
	width: 50% !important;
	float: right !important;
}

#lower-nav-zone > div.bottom-menu.ng-tns-c2515005772-8 > div > div:nth-child(2) {
	display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
