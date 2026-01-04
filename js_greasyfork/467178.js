// ==UserScript==
// @name         Zetflix Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Добавляет кнопку "Скачать" для сайта zetflix.online...
// @author       You
// @match        https://*.zetfix.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zetfix.online
// @require      https://code.jquery.com/jquery-3.2.1.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467178/Zetflix%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/467178/Zetflix%20Downloader.meta.js
// ==/UserScript==





setTimeout(function(){
      //let src = $('.tabs-b.video-box.visible iframe').contents().find('#playnd iframe').contents().find('video').attr('src');
      $('#ftitle').wrap(function(){
          let link = $('<a/>');
          let src = $('.tabs-b.video-box.visible iframe').contents().find('#playnd iframe').contents().find('video').attr('src');
          link.attr('href', src);
          link.text('Скачать');
          return link;
      });
}, 5000);

