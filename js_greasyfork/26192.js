// ==UserScript==
// @name        Apollo Artists Page Collage
// @namespace   Expander
// @description Strips the images out of the torrent group and prepends it to the top of the page.
// @include     https://apollo.rip/artist.php?id=*
// @include     https://passtheheadphones.me/artist.php?id=*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26192/Apollo%20Artists%20Page%20Collage.user.js
// @updateURL https://update.greasyfork.org/scripts/26192/Apollo%20Artists%20Page%20Collage.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  $('.group_image').each(function (el) {
    var tlink = $(this).siblings().find('strong .tooltip').attr('href');
    $(this).wrap('<a class="group_image_link" href="' + tlink + '" target="_blank"></a>');
  });
  $('#discog_table').prepend('<div class="album_container"></div>');
  $('.group_image').parent().appendTo('.album_container');
  $('.album_container').css({
    'display': 'flex',
    'flex-flow': 'row wrap',
    'justify-content': 'space-around'
  });
  $('.group_image_link').css({
    'width': '24%',
    'margin': '.2em 0'
  })
  $('.group_image').css({
    'width': '100%'
  })
  $('.group_image img').css({
    'width': '100%',
    'height': 'auto'
  })
}, false);
