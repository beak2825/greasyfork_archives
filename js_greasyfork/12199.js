// ==UserScript==
// @name        Seach Movie from Douban
// @namespace   feifeihang.info
// @description Add a movie searching field in Douban Movie
// @include     http://movie.douban.com/subject/*
// @include     https://movie.douban.com/subject/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12199/Seach%20Movie%20from%20Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/12199/Seach%20Movie%20from%20Douban.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var LIST = {
    'Bilibili 哔哩哔哩': 'http://www.bilibili.com/search?keyword=',
    'Soku 搜库': 'http://www.soku.com/search_video/q_',
    'Youtube': 'https://www.youtube.com/results?search_query='
  };
  // find and trim movie title.
  var dom = document.querySelector('#content > h1:nth-child(1) > span:nth-child(1)') || document.querySelector('#content > h1:nth-child(2) > span:nth-child(1)');
  var title = dom.innerHTML;
  title = title.trim();
  // find aside bar.
  var aside = document.querySelector('.aside');
  // now create the external movie links field.
  var field = document.createElement('div');
  field.className += ' gray_ad'; // the light green color style is defined as class 'gray_ad'.
  var subject = document.createElement('h2');
  subject.innerHTML = '视频搜索  · · · · · ·';
  field.appendChild(subject);
  // now add all entities.
  for (var item in LIST) {
    var link = document.createElement('a');
    link.innerHTML = item;
    link.setAttribute('href', LIST[item] + title);
    link.setAttribute('target', '_blank');
    field.appendChild(link);
    field.innerHTML += '<br/>';
  }
  // finally, add the field to aside bar.
  aside.insertBefore(field, aside.firstChild);
}) (window, document);
