// ==UserScript==
// @name         Open in Spotify Desktop client
// @description  Opens spotify links in the desktop app
// @version      1.3
// @author       yungsamd17
// @namespace    https://github.com/yungsamd17/UserScripts
// @license      MIT License
// @icon         https://raw.githubusercontent.com/yungsamd17/UserScripts/main/scripts/icons/Open-in-Spotify.png
// @match        https://open.spotify.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471790/Open%20in%20Spotify%20Desktop%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/471790/Open%20in%20Spotify%20Desktop%20client.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data=document.URL.match(/[\/\&](track|playlist|album|artist|user|show|episode)\/([^\&\#\/\?]+)/i);
    console.log("This is a "+data[1]+" with id:"+data[2]+"\nAttempting to redirect");
    window.location.replace('spotify:'+data[1]+':'+data[2]);
    window.close(); // Close tab instantly
})();
