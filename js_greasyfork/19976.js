// ==UserScript==
// @name        Kissanime_Download
// @namespace   Kissanime_Download
// @description Get the download links without jumping to the video page
// @match     https://kissanime.to/Anime/*
// @match     http://kissanime.to/Anime/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19976/Kissanime_Download.user.js
// @updateURL https://update.greasyfork.org/scripts/19976/Kissanime_Download.meta.js
// ==/UserScript==
var episodes = $('table.listing > tbody > tr > td > a');
episodes.each(function () {
  $(this).parent().append('(<a href=\'#\' class=\'download\'> download</a>)');
});
$('a.download').click(function (event) {
  url = 'https://kissanime.to' + $(this).prev().attr('href')
  url = url + ' div#divDownload';
  console.log(url);
 
  var ele = $(this);
  $(ele).parent().append('<div class="ajax">ajax result</div>');
  $('div.ajax').load(url);
  return false // prevents the click event  default action
});