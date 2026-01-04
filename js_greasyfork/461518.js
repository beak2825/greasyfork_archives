// ==UserScript==
// @name         Wattpad Width Fixer and Suggestions Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Futzes with the width settings to make it wider
// @author       You
// @match        https://www.wattpad.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wattpad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461518/Wattpad%20Width%20Fixer%20and%20Suggestions%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/461518/Wattpad%20Width%20Fixer%20and%20Suggestions%20Hider.meta.js
// ==/UserScript==

var userPreferenceAdditionalPaddingPX = "0";

(function() {
    'use strict';

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
    var authorDeets = document.querySelector('.left-rail > #sticky-nav');
    document.querySelector('header > .meta,header > .restart-part').insertAdjacentElement('beforebegin', authorDeets.cloneNode(true));
    var commentBubblePaddingWidth = window.getComputedStyle(document.querySelector('#story-reading .page p'), null).getPropertyValue('padding-right').split("px")[0]
    insertCss('#sticky-end{width:auto;}')
    insertCss('.panel-reading{margin-left:'+(parseInt(commentBubblePaddingWidth,10)+parseInt(userPreferenceAdditionalPaddingPX,10))+'px;width:auto;}')
    insertCss('#story-reading .page p{margin-right:'+userPreferenceAdditionalPaddingPX+'px}')
    insertCss('.left-rail{display:none;}')
    insertCss('.right-rail{display:none;}')
    insertCss('.modal-open{overflow:inherit;}')
})();