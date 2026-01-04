// ==UserScript==
// @name         Теги без подсветки
// @namespace    http://tampermonkey.net/
// @version      2024-02-03
// @description  Убирает вырвиглазное выделение тегов цветом
// @author       mega.animeshnik
// @match        *://pikabu.ru/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486402/%D0%A2%D0%B5%D0%B3%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/486402/%D0%A2%D0%B5%D0%B3%D0%B8%20%D0%B1%D0%B5%D0%B7%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8.meta.js
// ==/UserScript==

var target = document.querySelector('.stories-feed__container');
// создаем новый экземпляр наблюдателя
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    document.querySelectorAll('.tags__tag_colorized').forEach((element) => element.classList.remove('tags__tag_colorized'));
  });
});

// создаем конфигурации для наблюдателя
var config = { attributes: true, childList: true, characterData: true };
// запускаем механизм наблюдения
observer.observe(target,  config);
document.querySelectorAll('.tags__tag_colorized').forEach((element) => element.classList.remove('tags__tag_colorized'));