// ==UserScript==
// @name         MiniProfile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MiniProfileVid
// @author       Уэнсдэй
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478028/MiniProfile.user.js
// @updateURL https://update.greasyfork.org/scripts/478028/MiniProfile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveElement() {
        var userContentLinks = document.querySelector('.fl_r.userContentLinks');
        var userStatCounters = document.querySelector('.userStatCounters.hasContacts');

        if (userContentLinks && userStatCounters) {
            var borderStyle = '1px solid #3D3D3D';
            var paddingTop = '5px';
            var paddingBottom = '5px';
            var marginLeft = '0px';
            userStatCounters.parentNode.insertBefore(userContentLinks, userStatCounters.nextSibling);
            userContentLinks.style.marginLeft = marginLeft;
            userContentLinks.style.paddingTop = paddingTop;
            userContentLinks.style.paddingBottom = paddingBottom;

            userContentLinks.style.borderTop = borderStyle;
        }
    }

    var intervalId = setInterval(moveElement, 1000);

    setTimeout(function() {
        clearInterval(intervalId);
    }, 10000);
})();
