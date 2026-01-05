// ==UserScript==
// @name         karnage zoom
// @namespace    meatman2tasty
// @version      1.1
// @description  Use Mouse scroll
// @author       meatman2tasty
// @match        http://karnage.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26534/karnage%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/26534/karnage%20zoom.meta.js
// ==/UserScript==

var scrollDelta = 0,
cvs = document.getElementById('cvs');
cvs.addEventListener('mousewheel', zoom, false);
cvs.addEventListener('DOMMouseScroll', zoom, false);


function zoom(a) {
userScroll = overlayFadeUp = overlayFadeDown = overlayMaxAlpha = 0
animateOverlay = false
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scrollDelta = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail));
    if (socket && scrollDelta == -1 && maxScreenHeight < 4000) {
            (maxScreenHeight = maxScreenWidth += 250);
            resize();
            scrollDelta = 0;
		viewMult = 100 //dont want to calculate viewMult relative to the new screen width/height, so ill just hide it for now
    }
    if (socket && scrollDelta == 1 && maxScreenHeight > 1000) {
            (maxScreenHeight = maxScreenWidth -= 250);
            resize();
            scrollDelta = 0;
		viewMult = 100
    }
}
