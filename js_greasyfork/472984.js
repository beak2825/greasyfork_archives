// ==UserScript==
// @name        fire deleter,and 🐛 emoji adder
// @namespace   Violentmonkey Scripts
// @match       https://neal.fun/password-game/
// @license MIT
// @grant       none
// @version     alpha 0.5
// @author      -
// @description 13.08.2023, 17:12:06
// @downloadURL https://update.greasyfork.org/scripts/472984/fire%20deleter%2Cand%20%F0%9F%90%9B%20emoji%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/472984/fire%20deleter%2Cand%20%F0%9F%90%9B%20emoji%20adder.meta.js
// ==/UserScript==


// Запустите этот код после того, как страница загрузится полностью

// Функция для удаления эмодзи огня
function removeFireEmojis() {
  const emojis = document.querySelectorAll(".emoji.fire");

  emojis.forEach(emoji => {
    emoji.remove();
  });
}

// Дождитесь полной загрузки страницы
window.addEventListener("load", () => {
  removeFireEmojis();
});



// Добавляем обработчик события на изменение содержимого поля ввода
var inputElement = document.querySelector("#pw");
if (inputElement) {
  inputElement.addEventListener("input", function(event) {
    var inputValue = event.target.value;
    var bugsCount = (inputValue.match(/🐛/g) || []).length;

    if (bugsCount > 0) {
      // Находим все эмодзи 🐛 в строке ввода и заменяем на оригинальное количество
      var originalBugsCount = Math.min(3, bugsCount); // Максимум 3 эмодзи
      var bugsToAddString = "🐛".repeat(originalBugsCount);
      event.target.value = inputValue.replace(/🐛+/g, bugsToAddString);
    }
  });
}
