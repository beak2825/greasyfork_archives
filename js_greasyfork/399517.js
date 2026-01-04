// ==UserScript==
// @name         Condole
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  condole!
// @author       AnCoSONG
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399517/Condole.user.js
// @updateURL https://update.greasyfork.org/scripts/399517/Condole.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let html = document.querySelector('html')
    function transitionToGray(dom){

        const transitionConfig = "filter 0.5s linear"
        dom.style.transition = transitionConfig
        dom.style.webkitTransition = transitionConfig
        dom.style['-moz-transition'] = transitionConfig
        dom.style['-o-transition'] = transitionConfig
        dom.style['-ms-transition'] = transitionConfig
    }

    function grayScalify(dom, level=1){
        const grayscale = `grayscale(${level})`
        dom.style.filter = grayscale
        dom.style.webkitFilter = grayscale
        dom.style['-moz-filter'] = grayscale
        dom.style['-o-filter'] = grayscale
        dom.style['-ms-filter'] = grayscale
    }
    transitionToGray(html);
    grayScalify(html);
})();