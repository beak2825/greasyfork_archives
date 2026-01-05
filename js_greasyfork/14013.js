// ==UserScript==
// @name        Tweakers Video Fix
// @description Use the default browser HTML5 video player on Tweakers.net
// @include     /^https?:\/\/tweakers.net\/.*/
// @version     1.0
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @namespace   https://greasyfork.org/users/20473
// @downloadURL https://update.greasyfork.org/scripts/14013/Tweakers%20Video%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/14013/Tweakers%20Video%20Fix.meta.js
// ==/UserScript==
$('iframe', top.document).load(function () {
  var iframe = document.getElementsByTagName('iframe') [0];
  var video = iframe.contentDocument.getElementsByTagName('video') [0];
  var url = $(video).attr('src');
  var poster = $(video).attr('poster');
  var newVideo = $('<video controls src="' + url + '" poster="' + poster + '"></video>').css('width', '100%');
  $('.video-container').html(newVideo);
});
