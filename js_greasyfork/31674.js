// ==UserScript==
// @name         Script Zoom
// @namespace    Test
// @version      0.1
// @description  Its pretty glitchy but hey it works! Use mouse scroll and tampermonkey.
// @author       Assasinat0r
// @match        http://vertix.io/*
// @match        http://www.vertix.io/*
// @include        http://vertix.io/*
// @include        http://www.vertix.io/*
// @grant        See everything!
// @downloadURL https://update.greasyfork.org/scripts/31674/Script%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/31674/Script%20Zoom.meta.js
// ==/UserScript==

var scrollType = 0,
cvs = document.getElementById('cvs');
cvs.addEventListener('mousewheel', zoom, false);
cvs.addEventListener('DOMMouseScroll', zoom, false);


function zoom(a) {
userScroll = overlayFadeUp = overlayFadeDown = overlayMaxAlpha = 0
animateOverlay = false
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scrollType = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail));
    if (socket && scrollDelta == -1 && maxScreenHeight < 4000) {
            (maxScreenHeight = maxScreenWidth += 250);
            resize();
            scrollDelta = 0;
		viewMult = 100 
    }
    if (socket && scrollDelta == 1 && maxScreenHeight > 1000) {
            (maxScreenHeight = maxScreenWidth -= 250);
            resize();
            scrollDelta = 0;
		viewMult = 100
    }
}