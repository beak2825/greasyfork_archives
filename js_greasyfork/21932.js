// ==UserScript==
// @name        EnchancedPool
// @namespace   AnkietoRozbudowywacz
// @include     http://www.wykop.pl/*
// @version     1.1
// @grant       none
// @description  Dodatek dodaje podgląd wyników bez konieczności klikania czegokolwiek. 
// @downloadURL https://update.greasyfork.org/scripts/21932/EnchancedPool.user.js
// @updateURL https://update.greasyfork.org/scripts/21932/EnchancedPool.meta.js
// ==/UserScript==

function AnkietoRozbudowywacz()
{
  $('#surveyBox').each(function () {
    var arr = [
    ];
    $('ul[data-surveyresult] li > div:first-child').each(function () {
      arr.push($(this).text());
    });
    $('ul[data-surveyform] li').each(function (i) {
      $(this).append('<div class="js-rozbudowywacz" style=\'width:20%; float: right; clear:both\';>' + arr[i] + '</div>')
    })
  });
}
AnkietoRozbudowywacz()
$(document).on('ajaxSuccess', function (event, request, settings) {
  if (request.responseJSON.operations[0].method === 'handleAjaxPagination')
  {
    $('.js-rozbudowywacz').each(function () {
      $(this).remove();
    });
    AnkietoRozbudowywacz();
  }
});