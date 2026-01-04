// ==UserScript==
// @name         Download Zoom Recording
// @namespace    http://www.bluespace.tech/
// @version      0.3
// @description  Add a green button to download zoom recorded video.
// @author       William Li, author of ID Guard Offline, a great password manager
// @match        https://us02web.zoom.us/rec/*
// @grant        none
// @license      MIT
// @homepageURL  http://www.bluespace.tech/
// @supportURL   https://gist.github.com/everwanna/fbc88a56bd2a71ccc3f7c9443737fdb6
// @downloadURL https://update.greasyfork.org/scripts/402983/Download%20Zoom%20Recording.user.js
// @updateURL https://update.greasyfork.org/scripts/402983/Download%20Zoom%20Recording.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.setTimeout(function() {
        var v = document.getElementsByTagName('video')[0];
        var source = v.currentSrc;

        var download = document.createElement('a');
        download.href = source;
        download.style = "position: fixed; right: 16px; top: 16px; background-color: MediumSeaGreen; color: white; padding: 12px;";

        download.innerText = "Right click, Save Link As...";
        document.body.appendChild(download);
    }, 2000);

})();
