// ==UserScript==
// @name        help for labs
// @description Подсказки для лабораторий
// @namespace   virta
// @include     http://virtonomica.*/*/main/unit/view/*
// @include     http://virtonomica.*/*/main/company/view/*/unit_list
// @version     1.000001
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12292/help%20for%20labs.user.js
// @updateURL https://update.greasyfork.org/scripts/12292/help%20for%20labs.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;
var arr_razmer={"10":"4","30":"8","100":"13","300":"19","700":"25","1000":"бесконечности"};
var arr_razmer2={"1":"4","2":"8","3":"13","4":"19","5":"25","6":"бесконечности"};
if((/(?:company)/.test(location.href))){
//для общего списка
$('table.unit-list-2014 tr td[class][title*="Лаборатория"]').each(function(){
var razmer=$('span',this).text().replace(/[^\d]/g,'');
var info="до "+arr_razmer2[razmer]+'\n'+"6-8 техна - 1 размер предприятия"+'\n'+"9-14 техна - 2 размер предприятия"+'\n'+"15-19 техна - 3 размер предприятия"+'\n'+"20-25 техна - 4 размер предприятия"+'\n'+"26 и выше техна - 5 размер предприятия";
$(this).prop('title',info);})
//прячем отпускников
$('table.unit-list-2014 tr').each(function(){
if($('td.prod>img[title*="отпуск"]',this).length){$(this).css({opacity:0.3})}});
}
else {
//для страницы конкретной лаборатории
if((/(?:лаборатор)/.test($('table.infoblock td:eq(0)').prop("textContent")))){
var razmer=$('table.infoblock td:eq(1)').prop('textContent').match(/\d+/);
var info="до "+arr_razmer[razmer]+'\n'+"6-8 техна - 1 размер предприятия"+'\n'+"9-14 техна - 2 размер предприятия"+'\n'+"15-19 техна - 3 размер предприятия"+'\n'+"20-25 техна - 4 размер предприятия"+'\n'+"26 и выше техна - 5 размер предприятия";
$('table.infoblock tr:eq(0)').mouseover().prop('title',info);}}
