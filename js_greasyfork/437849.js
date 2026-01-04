// ==UserScript==
// @name         streamtape player download
// @namespace    https://greasyfork.org/en/users/175554-reissfeld
// @version      1.0
// @description  Downloading from streamtape
// @author       Reissfeld
// @match        https://streamtape.com/*
// @icon         https://streamtape.com/favicon.ico
// @run-at       document-end
// @grant        GM_openInTab
// @license      GNU-V3.0
// @downloadURL https://update.greasyfork.org/scripts/437849/streamtape%20player%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/437849/streamtape%20player%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = document.querySelector('#mainvideo')
    setTimeout(function(){
    GM_openInTab (video.src);
    },5000)
})();