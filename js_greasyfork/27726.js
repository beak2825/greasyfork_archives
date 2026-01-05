// ==UserScript==
// @name         JenkinsGreenAndRedBuildIcons
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Draża
// @match        http: ..............................................
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27726/JenkinsGreenAndRedBuildIcons.user.js
// @updateURL https://update.greasyfork.org/scripts/27726/JenkinsGreenAndRedBuildIcons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var redIcons = document.getElementsByClassName("icon-red icon-sm");
    var blueIcons = document.getElementsByClassName("icon-blue icon-sm");
    var loadingIcons = document.getElementsByClassName("icon-blue-anime icon-sm");

    for(var i = 0; i < redIcons.length; i++) {
        redIcons[i].src = "http://www.clker.com/cliparts/T/G/b/7/r/A/red-dot-hi.png";
    }
    for(i = 0; i < blueIcons.length; i++) {
        blueIcons[i].src = "http://www.clker.com/cliparts/R/d/z/v/H/1/neon-green-dot-hi.png";
    }
    for(i = 0; i < loadingIcons.length; i++) {
        loadingIcons[i].src = "http://www.clker.com/cliparts/W/i/K/w/1/D/glossy-orange-circle-icon-md.png";
    }
})();