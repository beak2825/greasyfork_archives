// ==UserScript==
// @name        Video illimitée | Openclassrooms
// @namespace   https://openclassrooms.com/courses/*
// @include     https://openclassrooms.com/courses/*
// @version     1
// @grant       none
// @description Regarder des vidéo en illimitée sur openclassrooms
// @downloadURL https://update.greasyfork.org/scripts/21339/Video%20illimit%C3%A9e%20%7C%20Openclassrooms.user.js
// @updateURL https://update.greasyfork.org/scripts/21339/Video%20illimit%C3%A9e%20%7C%20Openclassrooms.meta.js
// ==/UserScript==

//Created by WW|T VectorXHD

$(function () {
  $(document).ready(function () {
    setTimeout(function ()
    {
      var link = $('iframe#video_Player_0[data-src-origine^=\'https://vimeo.com\']').attr('data-src-origine');
      var html = '<a href=' + link + '  target="_blank"> Go to vimeo </a> </br> ';
      var ok = link.split('/');
      var titre = $('h2.part-title').text();
      var o = '<h2 class="part-title" style="text-transform: uppercase;color: #e95325;font-weight: 300;font-size: 29px;border-bottom: 1px solid #bebebe;margin-bottom: 30px;padding-bottom: 10px;">Mode illimitée actif - #WWT</div>';
      var video = '<div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0px;" class="videoWrapper"><iframe style="position: absolute; top: 0px; left: 0px; width: 92%; height: 87%;" src="https://player.vimeo.com/video/' + ok[3] + '" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0" height="341" width="630"></iframe></div>'
      if (link == '')
      {
      } 
      else
      {
        $('div.videoDownload').prepend(html);
        $('iframe#video_Player_0[data-src-origine^=\'https://vimeo.com\']').remove();
        if ($('h2.part-title').text() == '')
        {
          $('div.videoDownload').before(video);
          $('div.videoWrapper').before(o).css('text-align', 'center');
        } 
        else
        {
          $('h2.part-title').after(video).fadeIn(1500);
          $('h2.part-title').text('Mode illimitée actif - #WWT').css('text-align', 'center');
        }
      }
    }, 2000);
  });
})

