// ==UserScript==
// @name           DYAF
// @namespace      DYAF
// @author         bbbenji
// @description    Disable Youtube auto-focusing
// @include        https://*.youtube.com/*
// @include        http://*.youtube.com/*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/33465/DYAF.user.js
// @updateURL https://update.greasyfork.org/scripts/33465/DYAF.meta.js
// ==/UserScript==

var maxTime = 3000;
var timeoutInterval = 5;

var usedTime = 0;
var isManualFocus = false;
function check() {
    if (!isManualFocus && document.activeElement.tagName.toLowerCase() == "input") {
        console.log("BLURRED");
        document.activeElement.blur();
    }
    usedTime += timeoutInterval;
    if (usedTime < maxTime) {
        window.setTimeout(check, timeoutInterval);
    }
}
check();


document.body.addEventListener("click", function (evt) {
    if (evt.target.tagName == "INPUT") {
        console.log("MANUAL CLICK");
        isManualFocus = true;
    }
});

document.body.addEventListener("keydown", function (evt) {
    isManualFocus = true;
});