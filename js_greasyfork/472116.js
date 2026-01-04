// ==UserScript==
// @name         YouTube to yewtu.be
// @namespace    YouTube-yewtube
// @version      0.2.3
// @description  Redirects all youtube videos Invidious instances
// @author       Anonymous
// @match        https://*.youtube.com/watch?v=*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Youtube_shorts_icon.svg/193px-Youtube_shorts_icon.svg.png
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472116/YouTube%20to%20yewtube.user.js
// @updateURL https://update.greasyfork.org/scripts/472116/YouTube%20to%20yewtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href
    url = url.replace("m.", "")
    window.location = url.replace("youtube.com/watch?v=", "yewtu.be/watch?v=");
})();