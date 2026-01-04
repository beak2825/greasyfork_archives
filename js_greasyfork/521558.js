// ==UserScript==
// @name         Russian Flag Anvisual
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Данный UserScript меняет флаг (можно поставить другой либо какое ни будь изображение)
// @author       HikJS
// @match        https://anivisual.net/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Russia.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521558/Russian%20Flag%20Anvisual.user.js
// @updateURL https://update.greasyfork.org/scripts/521558/Russian%20Flag%20Anvisual.meta.js
// ==/UserScript==

(function() {
    'use strict';
const newLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Russia.png'; // Отвечает за замену флага
const logoElement = document.getElementsByClassName('header__logo')[0].getElementsByTagName('img')[0];
if (logoElement) {
  logoElement.src = newLogoUrl;

  const link = document.querySelector('a[href="/"]'); // Отвечает за добавление надписи
  link.textContent = 'Визуальные новеллы для русских';

  var mainElement = document.querySelector('.main'); // Отвечает за смену фона слева (правда есть ньюанс исчезает фон при открытии какой нибудь игры)
  mainElement.style.backgroundImage = "url('https://i.ibb.co/Km798Sr/IMG-5874.webp')";
}
})();