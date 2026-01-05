// ==UserScript==
// @name        EnchancedPool
// @namespace   AnkietoRozbudowywacz
// @include     http://www.wykop.pl/*
// @version     1.2
// @grant       none
// @description  Dodatek dodaje podgląd wyników bez konieczności klikania czegokolwiek.
// @downloadURL https://update.greasyfork.org/scripts/21966/EnchancedPool.user.js
// @updateURL https://update.greasyfork.org/scripts/21966/EnchancedPool.meta.js
// ==/UserScript==

function AnkietoRozbudowywacz()
{
  $('#surveyBox').each(function () {
    var arr = [
    ];
    $('ul[data-surveyresult] li').each(function () {
      arr.push({
        text: $(this).children('div:first-child').text(),
        width: getPercentage($(this).find('div div').attr('style'), 'width')
      });
    });
    $('ul[data-surveyform] li').each(function (i) {
      var background = prefixed('background', 'linear-gradient(left, rgba(67,131,175,.25) ' + arr[i].width + '%, white 0%);');
      $(this).append('<div class="js-rozbudowywacz" style=\'width:20%; float: right; clear:both; padding: 2px; ' + background + '\'>' + arr[i].text + '</div>');
    });
  });
}
AnkietoRozbudowywacz();
$(document).on('ajaxSuccess', function (event, request, settings) {
  if (request.responseJSON.operations[0].method === 'handleAjaxPagination')
  {
    $('.js-rozbudowywacz').each(function () {
      $(this).remove();
    });
    AnkietoRozbudowywacz();
  }
});

function prefixed(key, value) {
 return [
   key + ': -webkit-' + value,
   key + ': -moz-' + value,
   key + ': -ms-' + value,
   key + ': ' + value
  ].join(' ');
}

function getPercentage(style, key) {
 var match = style.match(new RegExp(key + ':\\s*(\\d+(\\.\\d*)?)%'));
 return match ? parseFloat(match[1], 10) : 0;
}