// ==UserScript==
// @name         WaniKani Better Lesson Picker
// @namespace    better-lesson-picker
// @version      1.2.2
// @description  Lesson picker improvements
// @author       Mystery
// @license      MIT
// @match        https://www.wanikani.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488210/WaniKani%20Better%20Lesson%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/488210/WaniKani%20Better%20Lesson%20Picker.meta.js
// ==/UserScript==

(function() {
    /* global wkof */
    'use strict';

    if (!window.wkof) {
        if (confirm('Better Lesson Picker requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    let loaded = false;
    wkof.on_pageload([/\/subject-lessons\/picker\/?$/], main, unload);

    function unload() {
        loaded = false;
    }

    function main() {
        if (loaded) {
            return;
        }
        loaded = true;

        // Insert CSS
        document.head.insertAdjacentHTML('beforeend',`
        <style name="better_lesson_picker" type="text/css">
            .better-lesson-picker__input::-webkit-outer-spin-button,
            .better-lesson-picker__input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            .better-lesson-picker__input {
                -moz-appearance: textfield;
                width: 3em;
                height: 48px;
                font: inherit;
                font-size: 20px;
                text-align: center;
                border-radius: var(--border-radius-tight);
            }
            .better-lesson-picker__input[disabled] {
                background-color: var(--color-button-lesson-picker-disabled-background);
                color: var(--color-button-lesson-picker-disabled-text);
                user-select: none;
            }
            .better-lesson-picker__input--radical {
                border: var(--color-radical) 2px solid;
            }
            .better-lesson-picker__input--kanji {
                border: var(--color-kanji) 2px solid;
            }
            .better-lesson-picker__input--vocabulary {
                border: var(--color-vocabulary) 2px solid;
            }
            .better-lesson-picker__input--all {
                border: 2px solid transparent;
                background:
                    linear-gradient(var(--color-wk-panel-content-background) 0 0) padding-box,
                    conic-gradient(
                      var(--color-kanji) 0deg,
                      var(--color-kanji) 128deg,
                      var(--color-vocabulary) 128deg,
                      var(--color-vocabulary) 230deg,
                      var(--color-radical) 233deg,
                      var(--color-radical) 360deg
                    ) border-box;
            }

            .lesson-picker__footer-content {
                display: flex;
                gap: 10px;
            }

            .lesson-picker__button {
                width: 210px;
                height: 48px;
            }

            .wk-form__fieldset:not(:last-of-type) {
                margin-bottom: 0px;
            }
        </style>
        `);

        // variables
        let currentEl;
        let firstEl;
        let dragged;

        const items = {
            radical: [],
            kanji: [],
            vocabulary: []
        };

        const inputs = {
            radical: undefined,
            kanji: undefined,
            vocabulary: undefined,
            all: undefined
        };

        const inputFocusValue = {};

        // main functions
        populateItems();
        addInputs();
        addEventListeners();


        function populateItems() {
            document.querySelectorAll('div.lesson-picker__subjects').forEach(el => {
                const type = el.querySelector('span').classList[1].split('--')[1];
                items[type].push(...el.children);
            });
        }

        function addInputs() {
            const form = document.querySelector('form.lesson-picker__footer-content');
            for (const key in inputs) {
                inputs[key] = createNumberInput(form, key);
            }
            reorderDom(form);
        }

        function addEventListeners() {
            document.addEventListener('mousedown', handleMousedown);

            document.addEventListener('click', handleClick);

            // Update inputs when selecting all
            document.querySelector('button.lesson-picker__section-toggle-all').addEventListener('click', () => setTimeout(updateInputs, 10));

            document.querySelectorAll('button.lesson-picker__section-toggle').forEach(el => {
                el.addEventListener('click', () => setTimeout(updateInputs, 10));
            });
        }

        function handleMousedown(e) {
            if (isItem(e)) {
                dragged = false;
                currentEl = undefined;
                firstEl = e.target;
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', handleMouseup);
            }

        }

        function handleDrag(e) {
            dragged = true;
            if (currentEl !== e.target) {
                currentEl = e.target;
                if (isItem(e)) {
                    e.target.click();
                    updateInputs();
                }
            }
        }

        function handleMouseup(e) {
            if (firstEl === e.target && dragged) {
                // if you drag and release on the same item triggers the click event negating the drag click
                e.target.click();
            }
            if (!dragged) {
                setTimeout(updateInputs, 10);
            }
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseup);
        }

        function handleInput(type) {
            let list;
            if (type === 'all') {
                list = Object.values(items).reduce((acc, cur) => acc.concat(cur), []);
            } else {
                list = items[type]
            }

            return function(e) {
                const val = Number(e.target.value);
                if (val >= 0) {
                    list.forEach((el, i) => {
                        if (i <= val - 1) {
                            if (el.ariaSelected === 'false') {
                                el.click();
                            }
                        } else {
                            if (el.ariaSelected === 'true') {
                                el.click();
                            }
                        }
                    });
                }
                if (val > list.length) {
                    e.target.value = list.length;
                }
                updateInputs(type);
            }
        }

        function handleClick(e) {
            if (e.shiftKey && isItem(e)) {
                const list = [];
                document.querySelectorAll('div.lesson-picker__subjects').forEach(el => list.push(...el.children));
                const clickedItem = e.target.closest('.lesson-picker__subject');
                for (let i = list.indexOf(clickedItem) - 1; i >= 0; i--) {
                    const el = list[i];
                    if (el.ariaSelected !== clickedItem.ariaSelected) {
                        el.click();
                    } else {
                        break;
                    }
                }
            }
        }

        function isItem(e) {
            const target = e.target.closest('.lesson-picker__subject, .subject-character');
            return !!target;
        }

        function createNumberInput(form, type) {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('better-lesson-picker__input');
            input.classList.add(`better-lesson-picker__input--${type}`);
            input.addEventListener('input', handleInput(type));
            input.addEventListener('focus', e => {
                inputFocusValue[type] = e.target.value;
                e.target.value = '';
            });
            input.addEventListener('blur', e => {
                if (e.target.value === '') {
                    e.target.value = inputFocusValue[type];
                }
            });
            input.value = 0;
            if (type !== 'all' && items[type].length === 0) {
                input.disabled = true;
            }
            form.appendChild(input);
            return input;
        }

        function updateInputs(type) {
            let total = 0;
            for (const key in items) {
                let count = 0;
                items[key].forEach(el => {
                    if (el.ariaSelected === 'true') {
                        count++;
                    }
                });
                if (!type || key !== type) {
                    inputs[key].value = count;
                }
                total += count;
            }
            if (type !== 'all') {
                inputs.all.value = total;
            }
        }

        function reorderDom(form) {
            const checkbox = document.querySelector('fieldset div.wk-form__field--checkbox').parentElement;
            checkbox.style.justifyContent = 'center';
            form.appendChild(checkbox);
        }
    }
})();