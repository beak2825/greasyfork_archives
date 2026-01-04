// ==UserScript==
// @name         Kinopoisk Rating Importer
// @namespace    https://kinopoisk.ru/
// @version      1.4
// @description  Импорт оценок из JSON и установка их на Kinopoisk
// @match        https://www.kinopoisk.ru/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541841/Kinopoisk%20Rating%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/541841/Kinopoisk%20Rating%20Importer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let list = GM_getValue('ratings_list', []);
  let index = GM_getValue('ratings_index', 0);

  function resetStorage() {
    GM_setValue('ratings_list', []);
    GM_setValue('ratings_index', 0);
    alert('Хранилище очищено.');
  }

  function loadAndStartFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data)) throw new Error('Неверный формат');
          GM_setValue('ratings_list', data);
          GM_setValue('ratings_index', 0);
          alert(`Загружено фильмов: ${data.length}`);
          // Переход на первую страницу фильма или сериала
          window.location.href = `https://www.kinopoisk.ru/film/${data[0].id}/` || `https://www.kinopoisk.ru/series/${data[0].id}/`;
        } catch (err) {
          alert('Ошибка при разборе JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function processRating() {
    list = GM_getValue('ratings_list', []);
    index = GM_getValue('ratings_index', 0);
    if (!list || !list.length || index >= list.length) return;

    const current = list[index];
    if (!current || !current.id || !current.rating) return;

    // Проверка соответствия ID в URL для фильма или сериала
    const urlMatch = location.href.match(/(film|series)\/(\d+)/);
    if (!urlMatch || urlMatch[2] !== String(current.id)) return;

    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(() => {
        const ratingInput = document.querySelector(
            `form.film-rate-form label[data-value="${current.rating}"] input`
        );

        // Ищем наличие любой пользовательской оценки
        const ratedEl = document.querySelector('span.styles_value__K90aa');
        const existingRating = ratedEl ? ratedEl.textContent.trim() : null;

        if (existingRating) {
            console.log(`⏩ Пропущено: "${current.name}" уже оценён на ${existingRating}`);
            clearInterval(interval);
            GM_setValue('ratings_index', index + 1);
            if (index + 1 < list.length) {
                const next = list[index + 1];
                window.location.href = `https://www.kinopoisk.ru/film/${next.id}/` || `https://www.kinopoisk.ru/series/${next.id}/`;
            } else {
                alert('✅ Все оценки установлены!');
                resetStorage();
            }
            return;
        }

      if (ratingInput) {
        clearInterval(interval);
        console.log(`✅ Оценка ${current.rating} → ${current.name}`);
        ratingInput.click();
        setTimeout(() => {
          GM_setValue('ratings_index', index + 1);
          if (index + 1 < list.length) {
            const next = list[index + 1];
            window.location.href = `https://www.kinopoisk.ru/film/${next.id}/` || `https://www.kinopoisk.ru/series/${next.id}/`;
          } else {
            alert('✅ Все оценки установлены!');
            resetStorage();
          }
        }, 1000);
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn(`⚠️ Оценка не найдена для "${current.name}". Пропускаем.`);
          clearInterval(interval);
          GM_setValue('ratings_index', index + 1);
          if (index + 1 < list.length) {
            const next = list[index + 1];
            window.location.href = `https://www.kinopoisk.ru/film/${next.id}/` || `https://www.kinopoisk.ru/series/${next.id}/`;
          } else {
            alert('✅ Все оценки установлены!');
            resetStorage();
          }
        } else {
          console.log(`⌛ Ожидание формы (${attempts}/${maxAttempts})...`);
        }
      }
    }, 1000);
  }

  // Только на страницах фильмов и сериалов
  if (/https:\/\/www\.kinopoisk\.ru\/(film|series)\/\d+/.test(location.href)) {
    setTimeout(processRating, 1000);
  }

  // Меню Tampermonkey
  GM_registerMenuCommand('📥 Импортировать из JSON', loadAndStartFromFile);
  GM_registerMenuCommand('🧹 Очистить хранилище', resetStorage);
})();
