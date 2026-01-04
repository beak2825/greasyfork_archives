// ==UserScript==
// @name         NNM-Club Open Spoilers
// @description  Создаёт кнопку над первым спойлером, при нажатии на которую открываются все спойлеры на странице NNM-Club. Можно (не проверял, но по логике должно) переделать для другого сайта. Для этого нужно вместо (или добавить через запятую) CSS-класса .spoiler-wrap вставить селектор спойлера с нужного сайта. Добавлено для USBTor.Ru  Новое в 0.4: Исключены от открытия скриптом спойлеры - "Список файлов в торренте" и "Похожие темы"
// @license MIT
// @icon         http://nnmclub.to/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       Nexus с сайта JavaScript.Ru
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40473/NNM-Club%20Open%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/40473/NNM-Club%20Open%20Spoilers.meta.js
// ==/UserScript==

(function () {
  var spoilers = [].slice.call(document.querySelectorAll('div.postbody .spoiler-wrap,.sp-wrap,.sp-head'));
  if (!spoilers.length) {
    return;
  }
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = 'Открыть все спойлеры';
  btn.addEventListener('click', function () {
   spoilers.forEach(function (node) {
    if(node.parentNode.classList.contains('center')) return;
     node.querySelector('.clickable').dispatchEvent(new Event('click'));
   });
  });
  spoilers[0].insertAdjacentHTML('beforebegin', '<br>');
  spoilers[0].insertAdjacentHTML('beforebegin', '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp');
  spoilers[0].parentNode.insertBefore(btn, spoilers[0]);
})();