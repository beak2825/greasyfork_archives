// ==UserScript==
// @name         Hide ad frames on aiondatabase.net
// @version      0.1
// @description  This script hides all ad frames on aiondatabase.net and extends the main container to fill the whole page.
// @author       Goshinki
// @match        http://aiondatabase.net/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js 
// @namespace https://greasyfork.org/users/143845
// @downloadURL https://update.greasyfork.org/scripts/31786/Hide%20ad%20frames%20on%20aiondatabasenet.user.js
// @updateURL https://update.greasyfork.org/scripts/31786/Hide%20ad%20frames%20on%20aiondatabasenet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#top_slot').parent().css('display', 'none');
    $('#sidebar').parent().css('display', 'none');
    $('#bottom_slot').parent().css('display', 'none');
    $('.page_outer').parent().attr('class', 'col-sm-12 col-md-12 col-lg-12');
    // Your code here...
})();
