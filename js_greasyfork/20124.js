// ==UserScript==
// @name        video link for video.sibnet.ru
// @namespace   video.sibnet.ru
// @description ссылка на видио сайта video.sibnet.ru под плеером
// @include     http://video.sibnet.ru/video*
// @include     http://video.sibnet.ru/*/video*
// @include     https://video.sibnet.ru/video*
// @include     https://video.sibnet.ru/*/video*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20124/video%20link%20for%20videosibnetru.user.js
// @updateURL https://update.greasyfork.org/scripts/20124/video%20link%20for%20videosibnetru.meta.js
// ==/UserScript==

var player_div = document.getElementById('player_container_wrapper');
var all_td = document.getElementsByTagName('td');
if (player_div != null && all_td != null) {
  var decode_url = decodeURIComponent(player_div.firstChild.children[4].value.split('&')[3]);
  var dec_sp = decode_url.split('file=')[1].split('/');

  if (dec_sp[3].indexOf('m3u8') != - 1) {
    link = '/v/' + dec_sp[2] + '/' + dec_sp[3].replace('m3u8', 'mp4');
  } else if (dec_sp[3].indexOf('flv') != - 1) {
    link = decode_url.split('file=')[1];
  } else {
    link = 'error!';
    console.log(decode_url);
  }
  for (var i = 0; i < all_td.length; i++) {
    if (all_td[i].className == 'video_size') {
      all_td[i].innerHTML = '<a href="' + link + '">' + all_td[i].textContent + '</a>';
    }
  }
} else {console.log("error!");}