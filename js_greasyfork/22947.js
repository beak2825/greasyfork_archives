// ==UserScript==
// @name         SubBox+
// @namespace    http://ekoze.ca/
// @version      1.0
// @description  Uses all space available for the subcription box
// @author       Chad Gregory
// @match        https://www.youtube.com/feed/subscriptions*
// @copyright 2016+, ekoze.ca
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/22947/SubBox%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/22947/SubBox%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#content').css('width', '100%');
    $('body').css('background', 'transparent');
})();