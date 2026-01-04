// ==UserScript==
// @name         Old Reddit Redirect (with Funny Hat fix)
// @namespace    http://asleepysamurai.com
// @version      0.1
// @description  Redirect any new reddit url except for "/media", "/gallery" or "/poll" to old reddit. Fixes the "Funny Hat" redirect.
// @author       Balaganesh Damodaran
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      BSD Zero Clause License
// @downloadURL https://update.greasyfork.org/scripts/476626/Old%20Reddit%20Redirect%20%28with%20Funny%20Hat%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476626/Old%20Reddit%20Redirect%20%28with%20Funny%20Hat%20fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!['/gallery','/media','/poll'].find(pathPrefix => window.location.pathname.toLowerCase().startsWith(pathPrefix))){
        window.location.host = 'old.reddit.com'
    }
})();