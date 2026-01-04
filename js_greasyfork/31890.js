// ==UserScript==
// @name         Prettyoutube
// @namespace    https://greasyfork.org/ru/users/145034-iiw
// @version      0.1
// @description  Always shows left panel in youtube
// @author       iiw
// @match        https://www.youtube.com/*
// @match        https://*.youtube.com/*
// @match        http://www.youtube.com/*
// @match        http://*.youtube.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/31890/Prettyoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/31890/Prettyoutube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    $('#appbar-guide-menu').addClass('.guide-pinning-enabled');
    $('#appbar-guide-menu').addClass('.guide-pinned');
    $('#appbar-guide-menu').addClass('.show-guide');

    setInterval(function() {
        $('#watch-discussion').css('margin-left', '220px');
        $('#watch-header').css('margin-left', '220px');
        $('#watch-description').css('margin-left', '220px');
        $('#action-panel-details').css('margin-left', '220px');

        $('#appbar-guide-menu').css('visibility', 'visible');
        $('#appbar-guide-menu').css('opacity', '1');
        $('#appbar-guide-menu').css('left', '0');

    }, 1000);


})();