// ==UserScript==
// @name            HotPot.ai NOADS
// @namespace       Wizzergod
// @version         1.0.5
// @description     NOADS
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/*
// @downloadURL https://update.greasyfork.org/scripts/488926/HotPotai%20NOADS.user.js
// @updateURL https://update.greasyfork.org/scripts/488926/HotPotai%20NOADS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = {
        '.internalAdBox, .topAdBox, .artMakerAdBox': 'none',
        'article:nth-of-type(-n+9), #headerBox, #rootGallery, #apiAccess, #rootFooter, #disabled, .disabled, #cookieOverlay, #faq': 'none'
    };

    function addHideStyles() {
        var style = document.createElement('style');
        style.type = 'text/css';
        var css = '';
        for (var selector in styles) {
            css += selector + '{ display: ' + styles[selector] + ' !important; } ';
        }
        style.innerHTML = css;
        document.head.insertBefore(style, document.head.firstChild);
    }

    addHideStyles();

    function hideElements() {
        for (var selector in styles) {
            var elements = document.querySelectorAll(selector);
            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = styles[selector];
                }
            }
        }
    }

    window.addEventListener('load', hideElements);
})();