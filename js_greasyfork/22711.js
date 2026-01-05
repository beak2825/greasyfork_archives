// ==UserScript==
// @name         RedMp3 Album
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the world!
// @author       You
// @include      https://redmp3.su/album/*
// @include      http://redmp3.su/album/*
// @exclude      http://redmp3.su/artist/*
// @include      https://mp3red.su/album/*
// @include      http://mp3red.su/album/*
// @exclude      http://mp3red.su/artist/*
// @include      https://mp3red.co/album/*
// @include      http://mp3red.co/album/*
// @exclude      http://mp3red.co/artist/*
// @include      http://mp3red.cc/album/*
// @exclude      http://mp3red.cc/artist/*

// @include      https://mp3red.me/album/*
// @include      http://mp3red.me/album/*
// @exclude      http://mp3red.me/artist/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22711/RedMp3%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/22711/RedMp3%20Album.meta.js
// ==/UserScript==
$('img').css('display','none');

$('document').ready(function() {
    $('img').css('display','none');
 /*
    $('a').click(function() { $(this).attr('target', '_blank'); });
    link_count = $('.track-title').length;
    $('.track-title').each(function(){
       console.log(this);
    });
});

*/
  $links = $('.track-title');

  var time = 15000;

  $links.each(function(i, v) {
      setTimeout( function(){
//console.log(i);
console.log(v);

          //$(v).attr('target', '_blank');
          window.open($(v).attr('href'), '_blank');
          //$(v).click();

      }, time);
      time += 15000;
  });

    });