// ==UserScript==
// @name         YT Queue fix
// @version      0.1
// @description  Reduces the Queue's miniplayer size
// @author       n0thing
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/90770
// @downloadURL https://update.greasyfork.org/scripts/393300/YT%20Queue%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/393300/YT%20Queue%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.addEventListener('load', function () { //wait until page fully loaded before messing with it

    var newstyle = document.createElement("style");
    newstyle.setAttribute("type","text/css");
    newstyle.setAttribute("id","cssoverride");
    newstyle.innerHTML = "ytd-miniplayer.style-scope.ytd-app{height:413px !important;}";
    newstyle.innerHTML += "#player-container.style-scope.ytd-miniplayer{height:64px !important;}";
    newstyle.innerHTML += ".video.style-scope.ytd-miniplayer{height:64px !important;}";
    document.body.appendChild(newstyle);
    }, false);
})();