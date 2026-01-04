// ==UserScript==
// @name         stop oznaczaniu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blokowanie postów zawierających słowo "oznacz"
// @author       https://github.com/szymonborda
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36544/stop%20oznaczaniu.user.js
// @updateURL https://update.greasyfork.org/scripts/36544/stop%20oznaczaniu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onscroll = function() {
        var divs = document.getElementsByClassName('userContentWrapper');
        for (var i = 0; i < divs.length; i++) {

            if (divs[i].innerHTML.indexOf('oznacz') != -1) {
                divs[i].style.padding = '10px';
                divs[i].innerHTML = '<span style="color: red;">Post zablokowany</span>';
            }
        }
    };

})();