// ==UserScript==
// @name         Webmail URCA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Masque les éléments inutiles
// @author       Christian Lescuyer
// @match        https://roundcube.univ-reims.fr/pers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408030/Webmail%20URCA.user.js
// @updateURL https://update.greasyfork.org/scripts/408030/Webmail%20URCA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    $('#topnav').hide();
    $('#topline').hide();
    $('#mainscreen').css('top', '33px');
    $('#messagesearchtools').css('top', '-33px');
})();