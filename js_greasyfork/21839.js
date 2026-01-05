// ==UserScript==
// @name           Stavki_ENVD_in_memo
// @namespace      http://virtonomic*.*/*/main/geo/regionENVD/*
// @description    Создаёт список ставок ЕНВД. origin https://greasyfork.org/ru/scripts/8427-sale-envd
// @include        http*://virtonomic*.*/*/main/geo/regionENVD/*
// @version 		0.0.2.20150306114003
// @downloadURL https://update.greasyfork.org/scripts/21839/Stavki_ENVD_in_memo.user.js
// @updateURL https://update.greasyfork.org/scripts/21839/Stavki_ENVD_in_memo.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$=win.$;
var text='';
$('table.list>tbody>tr[class]').each(function(){
  $('td:contains("%")',this).each(function(){
    var percCell = $(this);
    var nameCell = percCell.prev();
    text += '"'+nameCell.text()+'":'+percCell.text().replace(/\s+/,'').replace('%','')+',';
    //console.log(text);
  });
});
//alert(text.slice(0,-1));
$('table.list').first().before('<textarea id="stavki_envd_memo" style="width:100%" rows="3"></textarea>');
$('#stavki_envd_memo').val(text.slice(0,-1));
