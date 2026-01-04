// ==UserScript==
// @name         Kazachstán Basketbal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Detail se přesměruje na do správné live url
// @author       Michal
// @match        https://nbf.kz/en/match/?id=*
// @icon         https://nbf.kz/_templates/page/img/top-logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479237/Kazachst%C3%A1n%20Basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/479237/Kazachst%C3%A1n%20Basketbal.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var currentURL = window.location.href;
    var match = currentURL.match(/id=(\d+)/);
    if (match) {
        var id = match[1];
        var newURL = 'https://nbf.kz/en/match/?id=' + id + '#online';
        window.location.href = newURL;
    }
})();