// ==UserScript==
// @name         LG WTB PY Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load the Paraguay version of the LG WTB CL widget
// @author       Vijay Khemlani
// @match        https://www.lg.com/cl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406824/LG%20WTB%20PY%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/406824/LG%20WTB%20PY%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var wtbIframe = $('.lazyload-iframe');
    var originalSrc = wtbIframe.attr('data-src');
    var newSrc = originalSrc.replace('https://www.lg-donde-comprar.cl/lg_wtb/widget/?', 'https://www.lg-donde-comprar.cl/lg_wtb/widget/?country=PY&');
    wtbIframe.attr('data-src', newSrc);
    wtbIframe.attr('src', newSrc);
})();
