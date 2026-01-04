// ==UserScript==
// @name         Wanikani Oh No
// @namespace    http://tampermonkey.net/
// @version      6.6.6
// @description  Living nightmare
// @author       Gorbit99
// @include      /^https?://((www|preview).)?wanikani.com
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/430979/Wanikani%20Oh%20No.user.js
// @updateURL https://update.greasyfork.org/scripts/430979/Wanikani%20Oh%20No.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let newEntry = {
        aud: [
            {
                url: 'https://cdn.wanikani.com/audios/41457-subject-4946.ogg?1569280489',
                content_type: 'audio/ogg',
                pronunciation: 'ふく',
                gender: 'male',
                source_id: 41079,
                voice_actor_id: 2,
                voice_actor_name: 'Kenichi',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/41455-subject-4946.mp3?1569280488',
                content_type: 'audio/mpeg',
                pronunciation: 'ふく',
                gender: 'male',
                source_id: 41079,
                voice_actor_id: 2,
                voice_actor_name: 'Kenichi',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/41453-subject-4946.ogg?1569280487',
                content_type: 'audio/ogg',
                pronunciation: 'ふく',
                gender: 'female',
                source_id: 41077,
                voice_actor_id: 1,
                voice_actor_name: 'Kyoko',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/41451-subject-4946.mp3?1569280486',
                content_type: 'audio/mpeg',
                pronunciation: 'ふく',
                gender: 'female',
                source_id: 41077,
                voice_actor_id: 1,
                voice_actor_name: 'Kyoko',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/12143-subject-4946.ogg?1547872874',
                content_type: 'audio/ogg',
                pronunciation: 'ふぐ',
                gender: 'male',
                source_id: 6324,
                voice_actor_id: 2,
                voice_actor_name: 'Kenichi',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/12149-subject-4946.mp3?1547872874',
                content_type: 'audio/mpeg',
                pronunciation: 'ふぐ',
                gender: 'male',
                source_id: 6324,
                voice_actor_id: 2,
                voice_actor_name: 'Kenichi',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/32018-subject-4946.ogg?1553789460',
                content_type: 'audio/ogg',
                pronunciation: 'ふぐ',
                gender: 'female',
                source_id: 23676,
                voice_actor_id: 1,
                voice_actor_name: 'Kyoko',
                voice_description: 'Tokyo accent',
            },
            {
                url: 'https://cdn.wanikani.com/audios/32023-subject-4946.mp3?1553789461',
                content_type: 'audio/mpeg',
                pronunciation: 'ふぐ',
                gender: 'female',
                source_id: 23676,
                voice_actor_id: 1,
                voice_actor_name: 'Kyoko',
                voice_description: 'Tokyo accent',
            },
        ],
        auxiliary_meanings: [],
        auxiliary_readings: [],
        en: ['Fugu', 'Blowfish', 'Pufferfish'],
        id: 4946,
        kana: ['ふぐ', 'ふく'],
        srs: 1,
        syn: [],
        voc: '河豚',
        collocations: [],
        kanji: [
            { kan: '河', en: 'River', slug: '河' },
            { kan: '豚', en: 'Pork, Pig', slug: '豚' },
        ],
    };


    let originalAjax = $.ajax;
    $.ajax = (data) => {
        console.log(data);
        if (
            data.url === '/review/queue' &&
            data.type === 'get' &&
            data.dataType === 'json'
        ) {
            let originalSuccess = data.success;
            data.success = (items) => {
                items.push(newEntry);
                originalSuccess(items);
            };

            return originalAjax(data);
        }

        return originalAjax(data);
    };

    window.addEventListener("load", changeReviewElementCount);
})();

function changeReviewElementCount() {
  let reviewButton = document.querySelector(
    '.lessons-and-reviews__reviews-button'
  );
  if (reviewButton) {
    $.getJSON('/review/queue', (data) => {
      let count = data.length;

      reviewCountToButtonClass(count, reviewButton);

      let numberSpan = document.querySelector(
        '.lessons-and-reviews__reviews-button > span'
      );
      numberSpan.textContent = count;
    });
  }

  let startReviewQueueCount = document.querySelector('#review-queue-count');
  if (startReviewQueueCount) {
    $.getJSON('/review/queue', (data) => {
      let count = data.length;
      let startReviewButton = document.querySelector('#start-session > a');
      if (count !== 0) {
        startReviewButton.classList.remove('disabled');
        startReviewButton.replaceWith(startReviewButton.cloneNode(true));
      }

      startReviewQueueCount.textContent = count;
    });
  }
}

function reviewCountToButtonClass(count, node) {
  let reviewStages = [0, 1, 50, 100, 250, 500, 1000];

  countToButtonClass(
    count,
    node,
    'lessons-and-reviews__reviews-button--',
    reviewStages
  );
}

function lessonCountToButtonClass(count, node) {
  let lessonStages = [0, 1, 25, 50, 100, 250, 500];

  countToButtonClass(
    count,
    node,
    'lessons-and-reviews__lessons-button--',
    lessonStages
  );
}

function countToButtonClass(count, node, base, stages) {
  for (const stage of stages) {
    node.classList.remove(base + stage);
  }

  for (let i = 0, len = stages.length - 1; i < len; i++) {
    if (count < stages[i + 1]) {
      node.classList.add(base + stages[i]);
      return;
    }
  }

  node.classList.add(base + stages[stages.length - 1]);
}