// ==UserScript==
// @name         XDA - Disable ads
// @namespace    https://www.androidacy.com/?f=xda
// @version      0.2
// @description  Removes ads on XDA
// @author       Androidacy
// @match        https://forum.xda-developers.com/*
// @icon         https://www.google.com/s2/favicons?domain=xda-developers.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427013/XDA%20-%20Disable%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/427013/XDA%20-%20Disable%20ads.meta.js
// ==/UserScript==

(function() {
    var nTimer = setInterval(function () {
            if (window.$) {
                $(this).parent("script").remove();
                $('body').addClass('page-template-template-noads noad');
                clearInterval(nTimer);
            }
        }, 25);
})();