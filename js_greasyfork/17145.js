// ==UserScript==
// @name           IMDb: remove amazon ads
// @namespace      https://greasyfork.org/en/users/8981-buzz
// @description    Removes amazon 'Watch now' ads
// @author         buzz
// @require        https://code.jquery.com/jquery-2.2.0.min.js
// @version        0.3
// @license        GPLv2
// @match          *://*.imdb.com/title/tt*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/17145/IMDb%3A%20remove%20amazon%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/17145/IMDb%3A%20remove%20amazon%20ads.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function($) {
  var $watchbar = $('.watchbar2'), $el;
  if ($watchbar.length === 1) {
    var $parpar = $watchbar.parent().parent();
    if ($parpar.hasClass('article')) {
      $el = $parpar;
    }
    else {
      $el = $('.watchbar2').parent();
    }
    var text = $el.text();
    $el.find('script').each(function() {
      text = text.replace($(this).text(), '');
    });
    text = text.toLowerCase();
    if (text.indexOf('amazon') > 0 || text.indexOf('watch') > 0 || text.indexOf('disc') > 0) {
      $el.hide();
    }
    else {
      $el.show();
    }
  }
});
