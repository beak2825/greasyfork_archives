// ==UserScript==
// @name        Download KBOO Episodes
// @namespace   Violentmonkey Scripts
// @match       https://kboo.fm/program/*
// @grant       none
// @local       en-US
// @version     2.0
// @author      thompcha
// @license     none
// @description Make archived episodes on kboo.fm downloadable
// @require     http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/485296/Download%20KBOO%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/485296/Download%20KBOO%20Episodes.meta.js
// ==/UserScript==

$( document ).ready(function() {
  $('[id^="jp_jplayer_"]').each(function() {
      mp3_link = $(this).attr('data-endpoint');
      $(this).closest('.station-audio-player').next().prepend('<p>Download link:<br><a class="downloadLink" href="' + mp3_link + '">' + mp3_link + '</a></p>');
  });

  $('.downloadLink').on('click', function(event) {
      event.preventDefault();

      var $link = $(this);
      var filename = $link.attr('href').substring($link.attr('href').lastIndexOf('/') + 1);

      $link.attr('download', filename);

      var clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
      });

      $link[0].dispatchEvent(clickEvent);
  });
});