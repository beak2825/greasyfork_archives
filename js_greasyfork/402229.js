// ==UserScript==
// @author         CTQY
// @name           ameblo image opener
// @name:ja        アメブロ画像ダウンロード
// @namespace      ct.qy
// @homepageURL    https://greasyfork.org/scripts/402229-ameblo-image-opener
// @version        1.0.2
// @include        *ameblo.jp/*
// @description    Alt+click to open full-size ameblo image in new tab.
// @description:ja Alt+クリックでアメブロのフルサイズの画像を新しいタブで開きます。
// @icon           https://ameblo.jp/favicon.ico
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402229/ameblo%20image%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/402229/ameblo%20image%20opener.meta.js
// ==/UserScript==

var timestamp = 0;

(function($){

$(document).on('click', '.userImageLink, article, img', function(e, a) {
  if (!e) e = window.event;
  if (!e.altKey) return;
  e.preventDefault();
  if (e.timeStamp <= timestamp) return;
  timestamp = e.timeStamp;
  var target = $(e.currentTarget);
  var img = target.is('img') ? target : target.find('img').last();
  var url = img.attr('src');
  if (url) {
    window.open(url.split('?')[0], '_blank');
  }
});

})(jQuery);
