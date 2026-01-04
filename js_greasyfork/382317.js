// ==UserScript==
// @name         Watch YouTube on DuckDuckGo
// @namespace    https://carletonstuberg.com/
// @version      1.1.0
// @description  Automatically watch YouTube on DuckDuckGo
// @author       Carleton Stuberg
// @include      https://www.youtube.com/watch*
// @include      https://youtube.com/watch*
// @include      https://www.youtube-nocookie.com/*
// @include      https://youtube-nocookie.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382317/Watch%20YouTube%20on%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/382317/Watch%20YouTube%20on%20DuckDuckGo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!window.location.hostname.includes("nocookie")) {
    	window.location = "https://duckduckgo.com/" + document.title.replace(" \- YouTube", "") + " " + location.search.replace("\?v\=", "") + " video";
    } else {
    	top.location.hostname = "www.youtube.com";
    }

})();