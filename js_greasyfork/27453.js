// ==UserScript==
// @name         Sorry, Forbes
// @namespace    forbes.ru
// @version      1.4
// @description  Sorry, Forbes (hide the ads)
// @author       Anton
// @match        http://www.forbes.ru/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27453/Sorry%2C%20Forbes.user.js
// @updateURL https://update.greasyfork.org/scripts/27453/Sorry%2C%20Forbes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (console) console.log('Forbes?');
    jQuery('body').addClass('infinity-page').removeClass('withAdBlock').find('.blocker_warning').hide();
})();