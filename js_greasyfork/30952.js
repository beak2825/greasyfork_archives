// ==UserScript==
// @name        Meneame Simple
// @namespace   meneame.simple
// @include     https://www.meneame.net/*
// @include     https://www.meneame.net
// @run-at      document-idle
// @version     1.2
// @grant       none
// @description Usar conjuntamente con https://userstyles.org/styles/144573/meneame-simple
// @downloadURL https://update.greasyfork.org/scripts/30952/Meneame%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/30952/Meneame%20Simple.meta.js
// ==/UserScript==
var hideh4 = [
  'etiquetas',
  'más visitadas',
  'destacadas',
  'destacadas',
  'más votadas',
  'suscripciones por RSS'
];
var selector = 'div.sidebox:has(.body.mainsites,h4:contains(' + hideh4.join('),h4:contains(') + '))';

$(document).ready(function () {
  $(selector).remove();
  $('div.sidebox-rounded.orange .body .next:not(:has(*))').remove();
  $('div.sidebox:has(h4:contains(mejores comentarios))').prependTo('#sidebar');
  $('a.comments,div.guest a, div.sidebox div.body h5 a.tooltip, #singlewrap h4 a, .news-body h3 a').not("[href$=\'/standard\']").each(function () {
    this.href = this.href + '/standard';
  });
  var combo = $('div.select-wrapper');
  if (combo.length) {
    var detail = $('.news-details-data-down');
    if (detail.length==0) detail = $('.news-details');
    $('.news-details-data-up').remove();
    detail.attr('style', 'display: block');
    var enlace = $('div.news-details-main');
    var select = combo.find('select');
    select.find('> option:first').text(enlace.find('a.comments').text());
    select.removeAttr('class')
    select.attr('style', 'width: auto; padding-right: 5px;')
    var div = $('<div style=\'line-height: 30px;float: left;\'></div>')
    select.appendTo(div);
    enlace.remove();
    div.prependTo(detail);
    combo.remove();
  }
});
