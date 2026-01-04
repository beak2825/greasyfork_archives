// ==UserScript==
// @name         MirrorDriveVid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MirrorVid
// @author       You
// @match        https://drive.google.com/file/*
// @icon         https://t3.ftcdn.net/jpg/05/25/34/32/360_F_525343276_wzrufQ72rFbfxVTSJgUOHkjjUo0Td5ql.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479477/MirrorDriveVid.user.js
// @updateURL https://update.greasyfork.org/scripts/479477/MirrorDriveVid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        document.addEventListener("click", function(){
            document.getElementById("drive-viewer-video-player-object-0").style.transform = "scaleX(-1)";
});
}, false);

})();