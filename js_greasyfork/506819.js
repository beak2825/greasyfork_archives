// ==UserScript==
// @name         Counter
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      2.0
// @description  Показывает количество символов и слов в текстовом поле
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506819/Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/506819/Counter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addCounter(textarea) {
    if (textarea.next("#Counter").length === 0) {
      let counter = $(
        '<div id="Counter" style="position: absolute; right: 5px; bottom: 15px; font-size: 12px; color: gray;"></div>'
      );
      textarea.after(counter);

      textarea.on("input", function () {
        let text = textarea.val().replace(/(\r\n|\n|\r)/g, "  ");
        let charCount = text.length;
        let wordCount = textarea[0].value.trim().split(/\s+/).filter(Boolean).length;

        counter.text(`Символов: ${charCount} | Слов: ${wordCount}`);
      });

      textarea.trigger("input");
    }
  }

  function observeAreas() {
    let areas = [
      $('textarea[name="review[body]"]'),
      $('textarea[name="comment[body]"]'),
      $('textarea[name="critique[text]"]'),
      $('textarea[name="club[description]"]'),
      $('textarea[name="club_page[text]"]'),
      $('textarea[name="message[body]"]'),
      $('textarea[name="article[body]"]'),// добавил "article[body]"
      $('textarea[name="anime[description_ru_text]"]'),// добавил "anime[description_ru_text]"
      $('textarea[name="anime[description_en_text]"]'),// добавил "anime[description_en_text]"
      $('textarea[name="reason"]'),// добавил "reason"
      $('textarea[name="character[description_en_text]"]'),// добавил "character[description_en_text]"
      $('textarea[name="character[description_ru_text]"]'),// добавил "character[description_ru_text]"
      $('textarea[name="manga[description_ru_text]"]'),// добавил "manga[description_en_text]"
      $('textarea[name="manga[description_en_text]"]'),// добавил "manga[description_ru_text]"

      $('textarea[name="collection[text]"]')// добавил "collection[text]"

    ];

    areas.forEach(function (textarea) {
      if (textarea.length && textarea.next("#Counter").length === 0) {
        addCounter(textarea);
      }
    });
  }

  $(document).on("input", function () {
    observeAreas();
  });
})();
