// ==UserScript==
// @name         JordiScript
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script para filtrar los threads molestos del foro
// @author       Murder
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428244/JordiScript.user.js
// @updateURL https://update.greasyfork.org/scripts/428244/JordiScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var even = document.getElementsByClassName('even');
    var odd = document.getElementsByClassName('odd');
    for (var i = 0; i < even.length; ++i) {
        var item = even[i];
        if(item.innerHTML.includes('<a href="/?p=profile&amp;uid=5657753">jordi_xala</a>')) {
           item.innerHTML = '';
        }
    }

    for (var j = 0; j < odd.length; ++j) {
        var oddItem = odd[j];
        if(oddItem.innerHTML.includes('<a href="/?p=profile&amp;uid=5657753">jordi_xala</a>')) {
           oddItem.innerHTML = '';
        }
    }
})();
