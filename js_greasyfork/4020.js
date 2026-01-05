// ==UserScript==
// @name Fiverr Original
// @author Arnold François Lecherche
// @namespace greasyfork.org
// @icon http://www.fiverr.com/favicon.ico
// @version 1.2
// @description Provides links to the original pictures on Fiverr
// @include http://fiverr.com/*
// @include http://*.fiverr.com/*
// @include https://fiverr.com/*
// @include https://*.fiverr.com/*
// @grant none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @run-at document-end
// @copyright 2015 Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/4020/Fiverr%20Original.user.js
// @updateURL https://update.greasyfork.org/scripts/4020/Fiverr%20Original.meta.js
// ==/UserScript==
function originalImages() {
  'use strict';
  var originalArray = [];
  $('.delivery-item img').each(function (index, element) {
    var smallURL = element.getAttribute('src'), originalURL = smallURL.replace(/\/(small|medium|large|v2_102)\/(optima_)?/g, '/original/');
    if (originalURL !== smallURL) originalArray.push('<a href="' + originalURL + '">Original&nbsp;' + index + '</a>');
  });
  $('#originalImages').remove();
  $('.gallery').append('<div id="originalImages">' + originalArray.join(' | ') + '</div>');
}
$(document).ready(originalImages);
$('.js-gallery-nav').click(originalImages);