// ==UserScript==
// @name         Trail ACT TACTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sms.tactv.in/index.php/search_cutomer_stb/customer_or_stb
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422742/Trail%20ACT%20TACTV.user.js
// @updateURL https://update.greasyfork.org/scripts/422742/Trail%20ACT%20TACTV.meta.js
// ==/UserScript==

(function() {
    'use strict';
//    setInterval(function() {
    $('#pack').append('<option value="672">140 New Pack</option>');
    document.getElementById("pack").value= 672;

//    }, 200);
        setTimeout(function() {

                         if ($('#active').val() == 'ACTIVATE');
//                                                  if ($('#deactive').val() == ' DEACTIVATE');
                {
                        document.getElementById('active').click();
// //                                         document.getElementById('deactive').click();
//                     setTimeout(function() {
//                     document.getElementById("deactivation_reason").value= 6;
//                         }, 200);
                }
    }, 200);
//document.getElementById("pack").value= 672;
    // Your code here...
})();