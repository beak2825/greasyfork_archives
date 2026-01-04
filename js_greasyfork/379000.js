// ==UserScript==
// @name Rossvyaz
// @namespace Rossvyaz uznat po nomeru
// @description убирает с сайта россвязи ненужные данные
// @match https://rossvyaz.ru/deyatelnost/resurs-numeracii/vypiska-iz-reestra-sistemy-i-plana-numeracii
// @grant none
// @version 0.0.1.20190304133925
// @downloadURL https://update.greasyfork.org/scripts/379000/Rossvyaz.user.js
// @updateURL https://update.greasyfork.org/scripts/379000/Rossvyaz.meta.js
// ==/UserScript==


window.onload = function()
{
  $('.page-header').hide();
  $('.page-title-header').hide();
  $('.container-fluid > p:eq(1)').hide();
  $('.container-fluid > p:eq(0)').hide();
  $('.page-footer').hide();
  $('.row:eq(6)').hide();
  $('h2').hide();
  $('.row:eq(8)').hide();
  $('.row:eq(9)').hide();
}

