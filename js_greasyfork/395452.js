// ==UserScript==
// @name         GLPI SN DELL Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/glpi/front/search.php?*
// @include      *
// @grant        GM_log
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/395452/GLPI%20SN%20DELL%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/395452/GLPI%20SN%20DELL%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lines = $('div#page table.tab_cadrehov tbody > tr');
    var DELL_SN_URL = '';
    $.each( lines, function( index, line ) {
        GM_log(line);
        var snTd = $(line).find('td:nth-child(6)');
        GM_log(snTd);
        if(snTd.length === 0) return;
        var sn = snTd[0].innerText;
        if (sn) {
            GM_log('SN: ' + sn);
            $(snTd).html('<a href="/dell/sn/'+sn+'" target="_blank">'+sn+'</a>');
        }

    });
})();