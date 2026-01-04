// ==UserScript==
// @name         Replace copied linkedin links with sales navigator links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Minimizing repetetive actions
// @author       Aleksandre Kiknadze
// @match        https://docs.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=techradar.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436262/Replace%20copied%20linkedin%20links%20with%20sales%20navigator%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/436262/Replace%20copied%20linkedin%20links%20with%20sales%20navigator%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('copy', function(e) {
        if(e.clipboardData.getData('text/plain').match(/https:\/\/www.linkedin.com\/company\/\d+$/g)) {
        let link;
        let id;
        let data = e.clipboardData;
        link = data.getData('text/plain');
        id = link.replace(/\D/g,'');
        e.clipboardData.setData('text/plain', `https://www.linkedin.com/sales/company/${id}`)
        e.preventDefault();
        }
});
})();