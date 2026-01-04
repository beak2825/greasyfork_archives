// ==UserScript==
// @name        mail.i.ua загрузка одного файла архивом
// @description Добавляет ссылку для загрузки вложений архивом для тех писем, где только одно вложение
// @version     2019.11.09
// @author      Vivinga
// @include     https://mbox2.i.ua/read/*
// @namespace https://greasyfork.org/users/396220
// @downloadURL https://update.greasyfork.org/scripts/392166/mailiua%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0%20%D0%B0%D1%80%D1%85%D0%B8%D0%B2%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/392166/mailiua%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%84%D0%B0%D0%B9%D0%BB%D0%B0%20%D0%B0%D1%80%D1%85%D0%B8%D0%B2%D0%BE%D0%BC.meta.js
// ==/UserScript==

var c = document.querySelector('.message_attachment');
if (c) {
  var as = c.querySelector('a');
  if (!as.classList.contains('download_zip')) {
    var s = document.createElement('span');
    s.classList.add('float_right');
    s.classList.add('downloads');
    var a = document.createElement('a');
    a.classList.add('download_zip');
    a.href = as.href.replace('/2/','/all/');
    a.innerHTML = '<i></i>архивом';
    s.append(a);
    c.prepend(s);
  }
}
