// ==UserScript==
// @name         Kibana colored
// @version      1.0
// @description  This script change color of log entries in Kibana base on 'severity' field
// @author       Viktor Yengovatov
// @match        https://*/app/kibana*
// @match        http://*/app/kibana*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/169451
// @downloadURL https://update.greasyfork.org/scripts/38173/Kibana%20colored.user.js
// @updateURL https://update.greasyfork.org/scripts/38173/Kibana%20colored.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var check = function(t, txt){
        return $(t).find('td').filter(function() {
            return $(this).text().trim() === txt;
        }).size();
    };

    $( window).scroll(function() {
        var elements = $('.discover-table-row');
        elements.each(function() {

            if(check(this,'WARN')){
                $(this).css("background-color","#664411");
            }
            if(check(this,'W')){
                $(this).css("background-color","#664411");
            }
            if(check(this,'ERROR')){
                $(this).css("background-color","#660000");
            }
            if(check(this,'E')){
                $(this).css("background-color","#660000");
            }
            if(check(this,'INFO')){
                $(this).css("background-color","#335533");
            }
            if(check(this,'I')){
                $(this).css("background-color","#335533");
            }
        });
    });
})();