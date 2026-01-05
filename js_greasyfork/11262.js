// ==UserScript==
// @name       Evepraisal Ratio Adder
// @namespace  https://twitter.com/spike2050
// @version    0.2
// @description  Adds a Ratio Column to the Evepraisal Table
// @match      http://evepraisal.com/e/*
// @copyright  2015+, You
// @downloadURL https://update.greasyfork.org/scripts/11262/Evepraisal%20Ratio%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/11262/Evepraisal%20Ratio%20Adder.meta.js
// ==/UserScript==


$('table#results > tbody > tr > td:nth-child(5)').each(function(index, element) {
  element = $(element);
  var sellIskTxt = element.children('span').eq(0).text();
  var buyIskTxt = element.children('span').eq(1).text();
  var ratioTxt = '100';
  if (/\d+(,\d+)*\.\d{2}/.test(sellIskTxt) && /\d+(,\d+)*\.\d{2}/.test(buyIskTxt) && sellIskTxt != '0.00' && buyIskTxt != '0.00') {
    var buyIsk = parseInt(buyIskTxt.replace(',',''));
    var sellIsk = parseInt(sellIskTxt.replace(',',''));
    ratioTxt = Math.floor((1.0 - buyIsk / sellIsk) * 100) + '';
  }
  element.parent().append('<td data-sort="' + ratioTxt + '">' + ratioTxt + '</td>');
});

$('table#results > thead > tr').append('<th class="header">Sellratio</th>');

$('table#results').tablesorter();
