// ==UserScript==
// @name         White Noise Favicon
// @namespace    lander_scripts
// @version      0.133
// @description  change favaicon on white noise page
// @match        https://www.youtube.com/embed/n8CbVgFy-20*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454997/White%20Noise%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/454997/White%20Noise%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function change_favicon(img) {
        var favicon = document.querySelector('link[rel="shortcut icon"]');

        if (!favicon) {
            favicon = document.createElement('link');
            favicon.setAttribute('rel', 'shortcut icon');
            var head = document.querySelector('head');
            head.appendChild(favicon);
        }

        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href', img);
    }

    change_favicon('https://static.hd-trailers.net/images/control_play.png');
})();