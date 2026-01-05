// ==UserScript==
// @name        GetHybrid - Hide Instructions for Check Search Keywords
// @version     1
// @author	    Hunter Thompson
// @description hides instructions
// @include     http://www.gethybrid.io/workers/tasks/*
// @include     https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace   Creme
// @downloadURL https://update.greasyfork.org/scripts/23713/GetHybrid%20-%20Hide%20Instructions%20for%20Check%20Search%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/23713/GetHybrid%20-%20Hide%20Instructions%20for%20Check%20Search%20Keywords.meta.js
// ==/UserScript==

if ($('li:contains("Check search keywords")').length) {
    
    $('div[class="item-response order-1"]').hide();
    $('div[class="item-response order-2"]').css('font-size', '20px');
       
}