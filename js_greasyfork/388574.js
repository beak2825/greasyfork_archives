// ==UserScript==
// @name        Add accesskey shortcut to pause button and "star word" for memrise
// @namespace   rektagon
// @description Adds accesskey+p shortcut for accessing pause button and accesskey+a shortcut for accessing "star word for later review" in memrise sessions
// @include     https://www.memrise.*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/388574/Add%20accesskey%20shortcut%20to%20pause%20button%20and%20%22star%20word%22%20for%20memrise.user.js
// @updateURL https://update.greasyfork.org/scripts/388574/Add%20accesskey%20shortcut%20to%20pause%20button%20and%20%22star%20word%22%20for%20memrise.meta.js
// ==/UserScript==
(function() {
    'use strict';


    document.querySelector(".js-pause-btn").accessKey="p";
    document.addEventListener("DOMNodeInserted", function() {
        document.querySelector("span.star").accessKey="a";
    },false);
})();