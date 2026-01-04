// ==UserScript==
// @name         Разблокировать флажок возрастного ограничения
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Разблокирует чекбокс возрастного ограничения на Rutube.
// @author       You
// @match        https://studio.rutube.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474918/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%84%D0%BB%D0%B0%D0%B6%D0%BE%D0%BA%20%D0%B2%D0%BE%D0%B7%D1%80%D0%B0%D1%81%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/474918/%D0%A0%D0%B0%D0%B7%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%84%D0%BB%D0%B0%D0%B6%D0%BE%D0%BA%20%D0%B2%D0%BE%D0%B7%D1%80%D0%B0%D1%81%D1%82%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==


(function() {
  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        let checkbox = mutation.addedNodes[0].querySelector('input[name="adult"]');
        if (checkbox) {
          checkbox.disabled = false; // установить свойство disabled в false

          let parent = checkbox.parentElement;
          parent.classList.remove('pen-checkbox_disabled'); // удалить класс отключения

          let checkMark = parent.querySelector('.pen-checkbox__checkmark');
          checkMark.classList.remove('pen-checkbox__checkmark_disabled');
        }
      }
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();