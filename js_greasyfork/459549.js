// ==UserScript==
// @name         ABN Hide Crap
// @author       MENTAL
// @description  Hide crap on ABN
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version      0.4
// @include      /^https://abn\.lol/Torrent*
// @grant        none
// @namespace    abn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://abn.lol
// @downloadURL https://update.greasyfork.org/scripts/459549/ABN%20Hide%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/459549/ABN%20Hide%20Crap.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();
    var url = window.location.href;
    if (url.indexOf('Torrent') != -1) {
        var prohibited = ['BRRIP', 'XVID', 'GHZ', '-CHILL', ' CHILL', 'REBOT', 'GDLN', '-WEEDS', ' WEEDS', 'LM23', '-FRATERNITY', ' FRATERNITY', 'SPOW', '-NOSTALGIA', ' NOSTALGIA', '-JESUS', '-BEO', ' BEO', '-SCAPH', ' SCAPH', '-3SUP3R', '-NONE', '-BRAD'];
        console.log("Prohibited: " + prohibited);
        jQuery("div.mvc-grid tbody tr").each(function() {
           var release="";
           if(jQuery(this).find('td:eq(1) a').size()==1)
           {
               release=jQuery(this).find('td:eq(1) a')[0].innerText;
           }

           console.log("Release: " + release);

           for (var i = 0; i < prohibited.length; i++) {
               if ((release.toUpperCase().indexOf(prohibited[i]) > -1)) {
                   console.log("Hiding " + release + " IT MATCHES " + prohibited[i]);
                   jQuery(this).css("display","none");
               } else {
                       //console.log(release + " NO MATCH " + prohibited[i]);
               }
           }

         });
    }
})();