// ==UserScript==
// @name         Auto-Click "Click to See Spoiler"
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  "Click to see spoiler", as a feature of reddit, sucks. I want to be rid of it. I already saw the spoiler tag and chose to click anyway. Why am I being made to click again?? Not to mention what a pain in the ass it is when using keyboard navigation, since there's no way at all to avoid switching to the mouse for it.
// @author       bmn
// @match        https://*.reddit.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393140/Auto-Click%20%22Click%20to%20See%20Spoiler%22.user.js
// @updateURL https://update.greasyfork.org/scripts/393140/Auto-Click%20%22Click%20to%20See%20Spoiler%22.meta.js
// ==/UserScript==

const spoilerLabel = "Click to see spoiler";

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    if (typeof(jQuery) !== "undefined") {
        jQuery(".expando-gate__show-once").click();
        jQuery("div[data-test-id=post-content] button:contains('" + spoilerLabel + "')").parent().siblings("a").find("*").click();
    }
})();