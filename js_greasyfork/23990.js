// ==UserScript==
// @name         Generous Gazette
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes paywall on Colorado Springs based Gazette newspaper.
// @author       thebspatrol
// @match        http*://gazette.com/*
// @match        http*://*.gazette.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23990/Generous%20Gazette.user.js
// @updateURL https://update.greasyfork.org/scripts/23990/Generous%20Gazette.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _html;
    function pollPage(){
        _html = document.getElementsByTagName("csg-modal");
        if (_html !== undefined){
            console.log("paywall caught!");
            while (_html.length > 0) {
                _html[0].parentElement.removeChild(_html[0]);
                clearInterval(interval);
            }
        }
    }
    var interval = setInterval(pollPage, 250);
})();
