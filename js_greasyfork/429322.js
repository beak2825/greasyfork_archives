// ==UserScript==
// @name         BestOfYoutubeRedirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects bestofyoutube directly to youtube videos.
// @author       You
// @match        https://bestofyoutube.com/*
// @icon         https://www.google.com/s2/favicons?domain=bestofyoutube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429322/BestOfYoutubeRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/429322/BestOfYoutubeRedirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var i, frames;
    var newUrl = "";

    frames = document.getElementsByTagName("iframe");
    var oldUrl = frames[0].src;

   //convert from embed url to noral youtube url
    var regex = /embed\/(.+)/;
    newUrl = oldUrl.match(regex);
    window.location.href = "https://www.youtube.com/watch?v=" + newUrl[1];
})();