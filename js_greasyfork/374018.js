// ==UserScript==
// @name         Geotek filter
// @namespace    http://www.froebel-gruppe.de/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://geotek.de/support/meine-tickets/
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374018/Geotek%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/374018/Geotek%20filter.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    var container = $('.wpas-form-control.wpas-filter-status').parent().next();
    var checkbox = $('<input type="checkbox" id="showClosed" />');
    var label = $('<label for="showClosed">Geschlossene Tickets anzeigen</label>');
    container.append(checkbox);
    container.append(label);
    checkbox.click(function(){
        showClosed(checkbox.is(":checked"));
    });
    var ticketsBody = $('#wpas_ticketlist tbody');

    showClosed(false);

    function showClosed(show){
        var childNodes = ticketsBody.children("tr");
        var visible = 0;
        for(var i=0, l=childNodes.length;i<l;i++){
            var child = $(childNodes[i]);
            if (child.hasClass("wpas-status-closed") && !show){
                child.css("display", "none");
            } else {
                child.css("display", "table-row");
                visible++;
            }
            if (visible %2 === 0){
                child.css("background-color", "#f2f2f2");
            } else {
                child.css("background-color", "#ffffff");
            }

        }
    }
    $(".wpas_table_pagination").remove();
})(jQuery);