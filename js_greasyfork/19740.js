// ==UserScript==
// @name         Wikia ad skipper
// @namespace    https://github.com/AlorelUserscripts/wikia-remove-intersitial-modal
// @homepage     https://github.com/AlorelUserscripts/wikia-remove-intersitial-modal
// @supportURL   https://github.com/AlorelUserscripts/wikia-remove-intersitial-modal/issues
// @author       Alorel <a.molcanovas@gmail.com>
// @version      1.0.3
// @description  Skips the "skip this ad" screen when leaving wikia.com to an external page
// @author       Alorel <a.molcanovas@gmail.com>
// @icon         https://cdn.jsdelivr.net/gh/AlorelUserscripts/wikia-remove-intersitial-modal@1.0/ico.png
// @include      http*://*.wikia.com*
// @grant        GM_openInTab
// @run-at       document-end
// @license      LGPL-2.1
// @downloadURL https://update.greasyfork.org/scripts/19740/Wikia%20ad%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/19740/Wikia%20ad%20skipper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var main = function () {
        (function () {
            var elements = document.querySelectorAll([
                    ".exitstitial",
                    ".external",
                    ".exitw"
                ].join(",")),
                callback = function (e) {
                    e.preventDefault();
                    GM_openInTab(this.getAttribute("href"), e.ctrlKey || 1 === e.button);
                },
                i = 0;
            for (; i < elements.length; i++) {
                elements[i].addEventListener("click", callback);
            }
        })();

        (function () {
            var css = document.createElement("style");
            css.innerText = [
                    ".blackout",
                    "#ExitstitialInfobox"
                ].join(",") + '{display:none!important}';
            document.body.appendChild(css);
        })();
    };

    if ('loading' !== document.readyState) {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }
})();
