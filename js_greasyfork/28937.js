// ==UserScript==
// @name         Shortnews Redirect
// @namespace    stylefish
// @version      0.1
// @description  redirect to real article on shortnews instead of the mini reader with the big logo on top
// @author       stylefish
// @match        http://www.shortnews.de/beamto/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28937/Shortnews%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/28937/Shortnews%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';   
    document.location = document.getElementById("source-iframe").src;
})();