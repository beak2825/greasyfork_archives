// ==UserScript==
// @name         Arrow keys browsing for homestuck
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       Chris Pie
// @match        https://www.homestuck.com/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40605/Arrow%20keys%20browsing%20for%20homestuck.user.js
// @updateURL https://update.greasyfork.org/scripts/40605/Arrow%20keys%20browsing%20for%20homestuck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(e) {
        var currURL = window.location.href;
        var currURLsplit = currURL.split('/');
        var currPage = parseInt(currURLsplit[currURLsplit.length-1]);
        var nextPage = currPage + 1;
        var previousPage = currPage - 1;
        var newLocation = "";
        for (var i = 0; i<currURLsplit.length-1;i++)
        {
            newLocation += currURLsplit[i] + '/';
        }
        switch (e.keyCode) {
            case 37:
                newLocation += previousPage;
                break;
            case 39:
                newLocation += nextPage;
                break;
            default: return;
        }
        window.location.href = newLocation;
};
})();