// ==UserScript==
// @match          https://forums.overclockers.ru/*
// @match          https://overclockers.ru/*
// @name           Форум Overclockers.ru
// @namespace      http://coolcmd.webhosting-for-free.com/script/
// @description    https://coolcmd.tk/for/
// @version        2019.8.8
// @author         CoolCmd
// @license        MIT; https://opensource.org/licenses/MIT
// @homepageURL    https://coolcmd.tk/for/
// @supportURL     https://coolcmd.tk/for/
// @grant          none
// @nocompat       Chrome
// @compatible     firefox
// @incompatible   chrome
// @incompatible   opera
// @incompatible   safari
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/1866/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20Overclockersru.user.js
// @updateURL https://update.greasyfork.org/scripts/1866/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20Overclockersru.meta.js
// ==/UserScript==

'use strict';

if (window.self === window.top)
{
  setTimeout(function()
  {
	  window.stop();
    document.body.innerHTML =
      '<p style="font: medium sans-serif; padding: 3em; text-align: left; color: black; background: white; max-width: 50em; margin: 5em auto">\
      <b>Скрипт</b> <q>Форум Overclockers.ru</q>, который установлен в вашем браузере, больше не поддерживается.\
      Пожалуйста, замените его на <b>расширение</b> <q>Форум Overclockers.ru</q>\
      <a href="https://coolcmd.tk/for/#firefox" style="color: blue !important; text-decoration: underline !important" target="_blank">по этой инструкции</a>.\
      Этот увлекательный процесс займёт 10 минут, без регистрации и СМС.\
      О проблемах с установкой пишите\
      <a href="https://forums.overclockers.ru/viewtopic.php?f=14&amp;t=370722" style="color: blue !important; text-decoration: underline !important" target="_blank">здесь</a>.\
      <br><br>CoolCmd</p>';
  }, 100);
}
