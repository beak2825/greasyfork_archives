// ==UserScript==
// @name         Berkeley Youtube Maximize Lecture
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resize extra-wide videos, to fill the entire screen with the whiteboard or projector.
// @author       jamesli3397
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37728/Berkeley%20Youtube%20Maximize%20Lecture.user.js
// @updateURL https://update.greasyfork.org/scripts/37728/Berkeley%20Youtube%20Maximize%20Lecture.meta.js
// ==/UserScript==

(function foo() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var vid = document.getElementsByTagName('video')[0];
    console.log(vid.videoWidth, vid.videoHeight);
    if (vid.videoWidth === 0) {
        setTimeout(foo, 200);
    } else if (vid.videoWidth / vid.videoHeight > 2) {
        addGlobalStyle(`
video[style] {
/*width: 200vw !important;
height: 100vh !important;*/
width: 200% !important;
height: 100% !important;
left: 0px !important;
top: 0px !important;
}
.html5-video-container {
position: initial !important;
height: 100%;
}`
        );
    }
})();