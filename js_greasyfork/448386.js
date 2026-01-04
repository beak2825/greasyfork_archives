// ==UserScript==
// @name        Компаньон загрузчика внешней ссылки для fbreader.org для flibusta
// @namespace   Violentmonkey Scripts
// @match       https://flibusta.site/*
// @grant       none
// @version     1.0
// @author      Йетанозер
// @license     MIT
// @description Добавляет на флибусту ссылку для использования с загрузчиком внешней ссылки для fbreader.org
// @downloadURL https://update.greasyfork.org/scripts/448386/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D1%8C%D0%BE%D0%BD%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B0%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B5%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20fbreaderorg%20%D0%B4%D0%BB%D1%8F%20flibusta.user.js
// @updateURL https://update.greasyfork.org/scripts/448386/%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D1%8C%D0%BE%D0%BD%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B0%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B5%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20fbreaderorg%20%D0%B4%D0%BB%D1%8F%20flibusta.meta.js
// ==/UserScript==

const readLinks = document.querySelectorAll('div#main.clear-block img ~ span + a');

readLinks.forEach(link => {
  const url = link.nextElementSibling.href;
  if (url) {
    const aTag = document.createElement('a');
    aTag.setAttribute('href', `https://books.fbreader.org/catalog?bookLink=${url}`);
    aTag.setAttribute('target', '_blank');
    aTag.innerText = "(добавить в FB)";
    link.parentNode.insertBefore(aTag, link.nextSibling);
  }
});
