// ==UserScript==
// @name Metrolife Kinopoisk
// @description Добавляет ссылку в заглавии торрента на Кинопоиск.
// @author TechnoBit
// @version 1.0.0
// @date 2015-12-24
// @namespace TechnoBit
// @match http://torrents.metrolife.ru/details.php*
// @grant none
// @icon data:image/icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAiFgAAl5GMAM/LyABbUksAQDQsALWxsADr6ukAT0M8AH51cAAwJh8ApaCcANzd2gDEv70A////AIyGhABkXFQA3d3d3d3d3d3d3d3d3d3d3cXF5t3brMwaUAmXbWMACZPcmZm9iZmZ9t1ZktiZmZ+93dpdqZlJO93d3dVERJdt3d3dJEREdt3d3dt0REe93d3dY0REO9od3dY0R0MtVErd2Ed38txHdF2Hd38t3ed3eszMy93d3MLM3d3d3d3d3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @downloadURL https://update.greasyfork.org/scripts/15999/Metrolife%20Kinopoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/15999/Metrolife%20Kinopoisk.meta.js
// ==/UserScript==

$(function () {
  var elem = document.getElementsByClassName("rowhead")[0];
  var str = elem.innerHTML;
  if (-1 < str.indexOf('фильмы')) {
    var title_elem = elem.nextSibling;

    var movie_names = title_elem.textContent.split('/');
    if (movie_names.length == 1) {
      movie_names = title_elem.textContent.split('(');
    }
    
    var imgs = "https://plus.google.com/_/favicon?domain=";
    var link = '<a target="_blank" title="www.kinopoisk.ru" href="http://www.kinopoisk.ru/index.php?first=yes&what=&kp_query=' + movie_names[0].trim() + '"><img src="' + imgs + 'www.kinopoisk.ru"></a>';
    
    title_elem.innerHTML += link;
  }
});