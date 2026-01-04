// ==UserScript==
// @name            音乐下载助手
// @version          0.0.3
// @include          *://music.liuli.lol/music/*
// @include          *://music.liuli.lol/kugou/*
// @include          *://music.liuli.lol/xiami/*
// @description   音乐下载助手是方便下载的时候重命名
// @grant             none
// @run-at           document-end
// @namespace https://greasyfork.org/users/157626
// @downloadURL https://update.greasyfork.org/scripts/34673/%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/34673/%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var href = document.getElementById('dow').getAttribute('href');
var title = $('.container h2').text();
var author = $('.container h2').next().text();

var isMusicPath = window.location.pathname.indexOf('music') > -1;

if (href.indexOf('==/0') > -1) {
  title = '无法下载!无法下载!无法下载!无法下载!无法下载!无法下载!';
}

if (!isMusicPath) {
  author = $('.container h2').next().next().text();
}

var filename = author + ' - ' + title + '.mp3';

var html = [
  '<div>',
    '<p><input id="i1" type="text" value="'+ href +'" style="width:600px"></p>',
    '<p><input id="i2" type="text" value="'+ filename +'" style="width:600px"></p>',
    '<p><a href="'+ href +'" download="'+ filename +'">下载</a></p>',
  '</div>'
];
$('body').append(html.join(''));

function select() {
  $('#i1, #i2').on('click', function() {
    $(this).select();
  });
}

select();