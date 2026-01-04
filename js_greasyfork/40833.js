// ==UserScript==
// @name         Virtonomica: рынок города в отдельном окне
// @version      2.15
// @description  В торговом зале магазина открывает окно рынка города в новом окне.
// @author       DeMonyan
// @include      https://*virtonomic*.*/*/*/unit/view/*/trading_hall
// @include      https://virtonomic*.*/*/main_light_style/globalreport/marketing/*
// @include      https://virtonomic*.*/*/main_light_style/globalreport/marketing*
// @grant        none
// @namespace https://greasyfork.org/users/180910
// @downloadURL https://update.greasyfork.org/scripts/40833/Virtonomica%3A%20%D1%80%D1%8B%D0%BD%D0%BE%D0%BA%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0%20%D0%B2%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%20%D0%BE%D0%BA%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/40833/Virtonomica%3A%20%D1%80%D1%8B%D0%BD%D0%BE%D0%BA%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0%20%D0%B2%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%20%D0%BE%D0%BA%D0%BD%D0%B5.meta.js
// ==/UserScript==

var run = function() {
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

(function() {
    'use strict';
    function setOnclick(a) {
        a.setAttribute("onclick","popupWin = window.open(this.href.replace('/main/','/main_light_style/'),'market','width=1020px,height=724px,top=50,left=50px,toolbar=0, location=0, directories=0, menubar=0, scrollbars=1, resizable=0, status=0'); popupWin.focus(); return false");
    }

    function externalLinks() {
        var links = document.getElementsByTagName("a");
        var i=0;
        for (i=0; i<links.length; i++) {
            if (links[i].getAttribute("href") && links[i].getAttribute("href").indexOf('globalreport/marketing/?')!==-1 || links[i].getAttribute("href") && links[i].getAttribute("href").indexOf('globalreport/marketing?')!==-1) {
                setOnclick(links[i]);
            }
        }
        console.log('connect');
    }
    window.onload = externalLinks;

})();

$( document ).ready(function() {
if (document.location.href.indexOf('main_light_style')>0) {
    $('ul.nav-tabs').remove();
    $('h1').next('br').remove();
    $('h1').remove();
    $('.tab-content').css('border','none');
    $('.tab-content').css('padding','0');
    $('head').append("<style>\n"+
"                       div#marketing-pie a, div#flow-chart a {display:none !important}\n"+
"                       div.blk-width33 {width:20% !important;clear: both;}\n"+
"                       div.blk-width66 {width:initial !important; float:initial !important; position: absolute; top: 30px; left: 22%;}\n"+
"                       table.table.table-compact.product-metrics {width: 30%;float: right;margin-bottom:0}\n"+
"                       div#product-metrics h3 {width:20%;float:left}\n"+
"                       div#product-metrics ul.list-group.vir-list-group-strypes {float:left;width:79%}\n"+
"                       div#product-metrics ul.list-group.vir-list-group-strypes li {border:none !important;float:left;width:23%;}\n"+
"                       div#product-metrics ul.list-group.vir-list-group-strypes li:first-child {border:none !important;float:left;width:31%;}\n"+
"                       div#marketing-pie div {overflow: visible !important;width: 67% !important;height: 140px}\n"+
"                       div#product-metrics {height: 20px;}\n"+
"                       .unifilter-item select {width:100% !important}\n"+
"                       .initial {position:initial !important;}\n"+
"                       "+
"                     </style>\n");
}
});
$( document ).ajaxComplete(function(){
    $('.blk-width100').eq(1).attr('class','blk-width33');
    $('.blk-width100').eq(1).attr('class','blk-width33');
    var temp = $('span.options.pull-right').attr('onclick');
    $('span.options.pull-right').attr('onclick',temp+"$('.blk-width66').toggleClass('initial')");
    $('.flex-container.flex-2cols').attr('class','');
    eval($('div#marketing-pie>script').html().replace('"type": "pie",','"type": "pie","startDuration": 0,').replace('"position":"bottom",','"position":"right",').replace('"fixedPosition":true','"enabled":false'));
    var hist=$('div#history>script').html().replace('"position": "bottom",','"position":"bottom","valueWidth": 15,').replace(/Местные поставщики/g,'Местные п-ки');
    $('div#history>script').html(hist);
    eval(hist);

    $('.amcharts-chart-div').find('a').remove();
    $('svg').find('desc').remove();
    $('svg').eq(1).css('font-size','12px');
    $('svg').eq(3).css('font-size','10px');
    $('path').attr('stroke-width','1.5');
    $('svg').eq(3).find('path').attr('stroke-width','2');
})
}
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);

