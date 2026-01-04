// ==UserScript==
// @name         Router Favicon
// @namespace    lander_scripts
// @version      0.1
// @description  change favicon on router page
// @match        https://192.168.1.254/
// @grant        none
// @icon         https://cdn4.iconfinder.com/data/icons/electronics-24/100/Electronics_Copy_40-512.png
// @downloadURL https://update.greasyfork.org/scripts/390354/Router%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/390354/Router%20Favicon.meta.js
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

    change_favicon('https://dl1.cbsistatic.com/i/2017/08/26/6c791e30-f332-4aa3-9339-1eb27205f012/11ee053d55a9dddee9b5b2687fdb7606/iconimg96221.png');
})();