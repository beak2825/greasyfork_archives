// ==UserScript==
// @name         Reddit width fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tries to set reddit posts to not be quite so wide so they don't interfere with other elements on the page (useful for RES)
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450372/Reddit%20width%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/450372/Reddit%20width%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript/14898381#14898381
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
    insertCss('.nestedlisting > .thing{width:72.5%;}')
    insertCss('.linklisting > .thing{width:72.5%;}')
})();