// ==UserScript==
// @name        PQR for report_by_produce
// @namespace   virtonomica
// @include     *virtonomic*.*/*/main/company/view/*/sales_report/by_produce
// @description PQR column for sales report by_produce
// @version     1.02
// @author      ctsigma
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34426/PQR%20for%20report_by_produce.user.js
// @updateURL https://update.greasyfork.org/scripts/34426/PQR%20for%20report_by_produce.meta.js
// ==/UserScript==

var run = function() {
var st = '.c_prsnt ' +
        '{'+
        'font-size:12px;'+
        'text-align:right;'+
        'width:70px;'+
        'display:table-cell;'+
        'border:solid 1px #ffffff;'+
        'vertical-align: middle'+
        '}';
$('#mainContent style').append(st);
$('.c_qlt:eq(1)').after('<span class="c_prsnt">PQR</span>');
  $('.c_row').each(function(){
    var q = parseFloat($('.c_qlt:eq(0)',this).html());
    var r = parseFloat($('.c_qlt:eq(1)',this).html());
    var n = $('.c_name:eq(0)',this).html();
    var qty = parseInt($('.c_qty:eq(0)',this).html().replace(/\s/g,''));
    console.log(n+"|"+(q/r).toFixed(2)+"|"+qty);
    if (r > 0) {$('.c_qlt:eq(1)',this).after('<span class="c_prsnt">'+(q/r).toFixed(2)+'</span>');}
  });
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);