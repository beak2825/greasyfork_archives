// ==UserScript==
// @name         magnetic liuli
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  liuli, hacg, 琉璃, 琉璃神社, magnet, magnetic, link, magnetic link, 磁链, 磁鏈, 磁力链接, 磁力鏈接
// @author       請叫我紅領巾！
// @match        https://www.liuli.in/wp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377846/magnetic%20liuli.user.js
// @updateURL https://update.greasyfork.org/scripts/377846/magnetic%20liuli.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var content = document.querySelector('div.entry-content');
    content.innerHTML = content.innerHTML.replace(/(\w{40})/,'<a href="magnet:?xt=urn:btih:$1">$1</a>');
    
})();