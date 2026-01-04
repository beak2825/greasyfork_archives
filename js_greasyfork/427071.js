// ==UserScript==
// @name           Youtube - Remove Description Padding (Wider video, description and comments pane)
// @namespace      youtube
// @author         nascent
// @description    Removes the padding for youtube descriptions allowing for less condensed wdesign and allowing for space for any extra buttons added by other scripts
// @icon           https://www.youtube.com/favicon.ico
// @icon64         https://www.youtube.com/favicon.ico
// @version        1
// @noframes
// @grant          GM_addStyle
// @include        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/427071/Youtube%20-%20Remove%20Description%20Padding%20%28Wider%20video%2C%20description%20and%20comments%20pane%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427071/Youtube%20-%20Remove%20Description%20Padding%20%28Wider%20video%2C%20description%20and%20comments%20pane%29.meta.js
// ==/UserScript==
(async function() {

    //--ytd-watch-flexy-max-player-width
    GM_addStyle(".ytd-app, ytd-watch-flexy[flexy] { --ytd-watch-flexy-max-player-width: unset !important; }");
})();