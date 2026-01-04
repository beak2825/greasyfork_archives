// ==UserScript==
// @name         "Сообщения" вместо "Мессенджера" для ВК
// @namespace    https://mjkey.ru/
// @version      0.1
// @description  Меняет "Мессенджер" обратно на "Сообщения"
// @copyright    2020, MjKey | MjKey.ru
// @author       MjKey
// @match        https://vk.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412237/%22%D0%A1%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%22%20%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BE%20%22%D0%9C%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%22%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/412237/%22%D0%A1%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%22%20%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%BE%20%22%D0%9C%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%22%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9A.meta.js
// ==/UserScript==
(function() {
    'use strict';
     var zag = $('title').html();
     if(zag = 'Мессенджер') {
         $('title').html('Сообщения');
     }
    $('#l_msg').click(function() {
      setTimeout(function () {
          var zag = $('title').html();
          if(zag = 'Мессенджер') {
              $('title').html('Сообщения');
          }
      }, 800);
    });
    $('#l_msg .left_label').html('Сообщения');
})();