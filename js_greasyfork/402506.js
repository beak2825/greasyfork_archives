// ==UserScript==
// @name         TOM_hours
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  easy look at TOM hours
// @author       pzawadow
// @match        https://fclm-portal.amazon.com/reports/functionRollup?reportFormat=HTML&warehouseId=WRO1&processId=1002960&maxIntradayDays=1&spanType=Intraday&startDateIntraday=2020%2F05%2F02&startHourIntraday=17&startMinuteIntraday=30&endDateIntraday=2020%2F05%2F03&endHourIntraday=4&endMinuteIntraday=0
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/402506/TOM_hours.user.js
// @updateURL https://update.greasyfork.org/scripts/402506/TOM_hours.meta.js
// ==/UserScript==

(function() {
    'use strict';
// todo
var p_specjalist=parseFloat(0);
    $('#function-4300035028').find('tbody').find('.empl-all').each(function( index ){p_specjalist++});
var p_marshal=parseFloat(0);
    $('#function-4300035027').find('tbody').find('.empl-all').each(function( index ){p_marshal++});
var p_CIO=parseFloat(0);
    $('#function-4300035026').find('tbody').find('.empl-all').each(function( index ){p_CIO++});
var p_tdr=parseFloat(0);
    $('#function-4300035077').find('tbody').find('.empl-all').each(function( index ){p_tdr++});
var p_total=p_specjalist+p_marshal+p_CIO+p_tdr;
//end of todo
var h_specjalist = parseFloat($('#function-4300035028').find("tfoot").children('.empl-all').children('.size-total').text());
var h_marshal = parseFloat($('#function-4300035027').find("tfoot").children('.empl-all').children('.size-total').text());
var h_CIO = parseFloat($('#function-4300035026').find("tfoot").children('.empl-all').children('.size-total').text());
var h_tdr = parseFloat($('#function-4300035077').find("tfoot").children('.empl-all').children('.size-total').text());
if(isNaN(h_tdr)){h_tdr=0};
    var h_total =(h_specjalist+h_marshal+h_CIO+h_tdr).toFixed(2);
var br = document.createElement("br");

$("#timestamps").after("<table class='sortable result-table align-left'><caption>TOM Hours</caption><thead><tr><th rowspan='3'>Process</th><th rowspan='3'>Number of hours</th><th rowspan='3'>Head count</th></tr></thread><tbody><tr class=' empl-all empl-amzn'><td>training</td><td>"+h_tdr+"</td><td>"+p_tdr+"</tr><tr class=' empl-all empl-amzn'><td>Marshal</td><td>"+h_marshal+"</td><td>"+p_marshal+"</td></tr><tr class=' empl-all empl-amzn'><td>Lead</td><td>"+h_specjalist+"</td><td>"+p_specjalist+"</td></tr><tr class=' empl-all empl-amzn'><td>Check in/out</td><td>"+h_CIO+"</td><td>"+p_CIO+"</td></tr></tbody><tfoot><tr class=' empl-all empl-amzn'><td>TOTAL</td><td>"+h_total+"</td><td>"+p_total+"</td></tr></tfoot>");
    // Your code here...
})();