// ==UserScript==
// @name         Uta-Net - Allow Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows highlighting and copying on Uta-Net.com
// @author       erc2nd
// @match        https://www.uta-net.com/*
// @icon         https://ures.jp/uta-net.com/img/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465974/Uta-Net%20-%20Allow%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/465974/Uta-Net%20-%20Allow%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var noCopyElem = document.querySelector(".moviesong");
    var noCopy = function (e) {
        var clone = noCopyElem.cloneNode(true);
        noCopyElem.parentNode.replaceChild(clone, noCopyElem);
    };
    noCopyElem.addEventListener('mousemove', noCopy);

})();