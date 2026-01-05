// ==UserScript==
// @name         Zoom Hack
// @namespace    KROKIk
// @version      1
// @description  Użyj skrola by oddalić lub przybliżyć
// @author       KROKIk
// @match        http://vertix.io/*
// @match        http://www.vertix.io/*
// @include        http://vertix.io/*
// @include        http://www.vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25863/Zoom%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/25863/Zoom%20Hack.meta.js
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

