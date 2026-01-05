// ==UserScript==
// @name         Steve Goodrich
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  does it all for you
// @author       pyro
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28487/Steve%20Goodrich.user.js
// @updateURL https://update.greasyfork.org/scripts/28487/Steve%20Goodrich.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#web_url').val($("td:contains('Text String:')").next()[0].innerHTML.replace('-','').match(/\d{8}/)[0] || '');
})();