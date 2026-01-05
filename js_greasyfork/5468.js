// ==UserScript==
// @name        is_safe checker
// @namespace   Dr.YeTii
// @description scans and complies a list of incorrectly tagged safe/unsafe torrents
// @include     http*://kickass.to/usearch/*is_safe%3A0*/*
// @include     http*://kickass.to/usearch/*is_safe%3A1*/*
// @include     http*://kat.cr/usearch/*is_safe%3A0*/*
// @include     http*://kat.cr/usearch/*is_safe%3A1*/*
// @require		  http://code.jquery.com/jquery-latest.js
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5468/is_safe%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/5468/is_safe%20checker.meta.js
// ==/UserScript==

var list = '';
var n = 0;
var pathname = window.location.pathname;

$('.markeredBlock').each(function () {
  //                           Torrents marked unsafe but are                                 ||                             Torrents marked safe but aren't                             //
  if (($('[id^="cat_"] a', $(this)).html() != 'XXX' && pathname.indexOf('is_safe%3A0') > - 1) || ($('[id^="cat_"] a', $(this)).html() == 'XXX' && pathname.indexOf('is_safe%3A1') > - 1)) {
    list = list + location.protocol + '//' + location.host + $('.cellMainLink', $(this)).attr('href') + '\n';
    n++;
    if (n % 15 == 0) { // Every 15 torrents it adds an line gap.
      list = list + '\n';
    }
  }
});

// Add textbox/message
if (n > 0) {
  textbox = '<textarea onclick="select()" id="listHere" name="content" class="botmarg5px">' + list + '</textarea><br><br>';
} else {
  textbox = '<h3>No torrents found</h3>';
}
$('#mainSearchTable').prepend('<h2>Torrents</h2>' + textbox);
