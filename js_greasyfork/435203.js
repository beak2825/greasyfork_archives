// ==UserScript==
// @name     	Disable Scroll Event in Google Slides When Using Touchpad
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/disable-scroll-event-in-google-slides-when-using-touchpad.user.js
// @version  	1.0.0
// @description Removes scroll event from #workspace-container in Google Slides when a touchpad is detected.
// @author   	Enchoseon
// @include  	*docs.google.com/presentation/d/*
// @grant    	none
// @downloadURL https://update.greasyfork.org/scripts/435203/Disable%20Scroll%20Event%20in%20Google%20Slides%20When%20Using%20Touchpad.user.js
// @updateURL https://update.greasyfork.org/scripts/435203/Disable%20Scroll%20Event%20in%20Google%20Slides%20When%20Using%20Touchpad.meta.js
// ==/UserScript==

(function() {
    "use strict";
    function killScrollEvent() {
        if (document.getElementById("workspace-container") !== null) {
            window.addEventListener(
                "wheel",
                function (event) {
                    event.stopImmediatePropagation();
                },
                true
            );
        }
    }
    function detectTrackPad(e) { // https://stackoverflow.com/a/62415754
        if (e.wheelDeltaY) {
            if (e.wheelDeltaY === (e.deltaY * -3)) {
                killScrollEvent();
            }
        } else if (e.deltaMode === 0) {
            killScrollEvent();
        }
    }
    document.addEventListener("mousewheel", detectTrackPad, false);
    document.addEventListener("DOMMouseScroll", detectTrackPad, false);
})();
