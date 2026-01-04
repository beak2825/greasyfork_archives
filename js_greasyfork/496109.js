// ==UserScript==
// @name         WaniKani Kanji Vocabulary in Lessons
// @namespace    http://tampermonkey.net/
// @version      2024-06-30
// @description  Show vocabulary for kanji during WaniKani lessons on the "Examples" tab.
// @author       Victor Medeiros
// @match        https://www.wanikani.com/subject-lessons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1380162
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496109/WaniKani%20Kanji%20Vocabulary%20in%20Lessons.user.js
// @updateURL https://update.greasyfork.org/scripts/496109/WaniKani%20Kanji%20Vocabulary%20in%20Lessons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize WaniKani Open Framework
    if (!window.wkof) {
        alert('WaniKani Level Up Speed Assistant requires Wanikani Open Framework.\n' +
              'You will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    window.wkof.include('ItemData');
    window.wkof.ready('ItemData').then(load_vocab);

    function load_vocab() {
        window.wkof.ItemData.get_items('subjects').then(process_items);
    }

    function process_items(items) {
        window.wkItemInfo.on("lesson").forType("kanji").under("examples").append(
            "Vocabulary Examples (extended)",
            kanjiObject => {
                const kanjiData = items.find(item => item.id === kanjiObject.id);
                if (kanjiData) {
                    const vocabList = kanjiData.data.amalgamation_subject_ids
                    .map(example_id => items.find(item => item.id === example_id))
                    .sort((a, b) => a.data.level - b.data.level);

                    const section = document.createElement('section');
                    section.id = 'section-amalgamations';
                    section.className = 'subject-section__content';
                    section.setAttribute('data-toggle-target', 'content');

                    const div = document.createElement('div');
                    div.className = 'subject-character-grid subject-character-grid--single-column';

                    const ol = document.createElement('ol');
                    ol.className = 'subject-character-grid__items';

                    vocabList.forEach(vocab => {
                        if (vocab && vocab.data) {
                            const li = document.createElement('li');
                            li.className = 'subject-character-grid__item';

                            const a = document.createElement('a');
                            a.className = 'subject-character subject-character--vocabulary subject-character--grid subject-character--unlocked';
                            a.title = vocab.data.readings[0].reading;
                            a.href = `https://www.wanikani.com/vocabulary/${vocab.data.slug}`;
                            a.setAttribute('data-turbo-frame', '_blank');

                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'subject-character__content';

                            const spanCharacters = document.createElement('span');
                            spanCharacters.className = 'subject-character__characters';
                            spanCharacters.lang = 'ja';
                            spanCharacters.textContent = vocab.data.characters;

                            const infoDiv = document.createElement('div');
                            infoDiv.className = 'subject-character__info';

                            const spanReading = document.createElement('span');
                            spanReading.className = 'subject-character__reading';
                            spanReading.textContent = vocab.data.readings[0].reading;

                            const spanMeaning = document.createElement('span');
                            spanMeaning.className = 'subject-character__meaning';
                            spanMeaning.textContent = vocab.data.meanings[0].meaning + ` (Level ${vocab.data.level})`;

                            infoDiv.appendChild(spanReading);
                            infoDiv.appendChild(spanMeaning);

                            contentDiv.appendChild(spanCharacters);
                            contentDiv.appendChild(infoDiv);

                            a.appendChild(contentDiv);
                            li.appendChild(a);
                            ol.appendChild(li);
                        }
                    });

                    div.appendChild(ol);
                    section.appendChild(div);
                    return section;
                }
                return 'Failed to find Kanji object';
            }
        );
    }
})();
