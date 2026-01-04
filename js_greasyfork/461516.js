// ==UserScript==
// @name         FantasyNameGenerators Shorten Banner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modifies the CSS of the pages on the site to 'shrink' the banner section with the graphic and whatnot which, while cool, is a lot to have to scroll past on the non-homepage pages.
// @author       You
// @match        https://www.fantasynamegenerators.com/*
// @exclude      https://www.fantasynamegenerators.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantasynamegenerators.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461516/FantasyNameGenerators%20Shorten%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/461516/FantasyNameGenerators%20Shorten%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Your code here...
    function insertCss( code ) {
        var style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            // IE
            style.styleSheet.cssText = code;
        } else {
            // Other browsers
            style.innerHTML = code;
        }

        document.getElementsByTagName("head")[0].appendChild( style );
    }
    insertCss('#bannercontainer{height:inherit;}')
    insertCss('#banner{height:inherit;padding-top:175px}')
    insertCss('#navContainer{margin-top:-175px;}')

})();