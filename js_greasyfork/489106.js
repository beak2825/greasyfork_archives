// ==UserScript==
// @name         Mini-Block
// @namespace    http://shikimori.one/
// @version      0.0
// @description  Мини блок с дополнительными бб.
// @author        pirate-
// @match           *://shikimori.tld/*
// @match           *://shikimori.one/*
// @match           *://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489106/Mini-Block.user.js
// @updateURL https://update.greasyfork.org/scripts/489106/Mini-Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createBlock() {
        var block = document.createElement('div');
        block.className = 'all-elements';
        block.style.display = 'none';
        return block;
    }

    function toggleBlock() {
        var block = document.querySelector('.all-elements');
        if (block) {
            if (block.style.display === 'none') {
                block.style.display = 'flex';
            } else {
                block.style.display = 'none';
            }
        }
    }

    var button = document.createElement('span');
    button.addEventListener('click', toggleBlock);

    var blockStyle = document.createElement('style');
    blockStyle.textContent = ' .all-elements { position: absolute; top: -260px; background: white; border: 1px solid; padding: 5px; gap: 5px; width: 150px; overflow: auto; height: 250px; flex-direction: column; } .add-el { margin-left: 8px; }  .add-el  span  { cursor:pointer; } .all-elements  span:hover { color:red; } .add-el > span:before { font-family: shikimori; content: ""; }';

    var block = createBlock();

    var parentElement = document.createElement('span');
    parentElement.className = 'add-el';
    parentElement.appendChild(button);
    parentElement.appendChild(block);

    document.head.appendChild(blockStyle);

    function checkAndAppend() {
        var editorControlsElement = document.querySelector('.editor-controls');
        if (editorControlsElement && !editorControlsElement.querySelector('.all-elements')) {
            editorControlsElement.appendChild(parentElement);
        }
    }

    checkAndAppend();

    setInterval(checkAndAppend, 1000);

    function wrapText(wrapper) {
        var textarea = document.querySelector('.editor-area');
        if (!textarea) return;

        var selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        var newText = wrapper.replace('+ selectedText +', selectedText);
        var beforeText = textarea.value.substring(0, textarea.selectionStart);
        var afterText = textarea.value.substring(textarea.selectionEnd);
        textarea.value = beforeText + newText + afterText;
    }

    function createButton(text, wrapper) {
        var button = document.createElement('span');
        button.textContent = text;
        button.addEventListener('click', function() {
            wrapText(wrapper);
        });
        return button;
    }

    var buttons = [{
            text: 'Центрировать',
            wrapper: '[center] + selectedText + [/center]'
        },
        {
            text: 'Справа',
            wrapper: '[right] + selectedText + [/right]'
        },
        {
            text: 'Код',
            wrapper: '[code] + selectedText + [/code]'
        },
        {
            text: 'Размыть',
            wrapper: '[span=b-menu-line is-spoilers][span=blurred] + selectedText + [/span][/span]'
        },

        {

            text: 'Скрыть текст',
            wrapper: '[span=hidden]  + selectedText + [/span]'
        },
        {
            text: 'Переключатель',
            wrapper: '[div=user-defined] + selectedText + [/div]'
        },
        {
            text: 'Дефолтный заголовок',
            wrapper: '[div=subheadline m5] + selectedText + [div]'
        },
        {
            text: 'Спойлер 100%',
            wrapper: '[spoiler=Спойлер is-fullwidth] + selectedText + [/spoiler]'
        },
        {
            text: 'Спойлер v1',
            wrapper: '[spoiler_v1=Спойлер] + selectedText + [/spoiler_v1]'
        },
        {
            text: 'Прекращено',
            wrapper: '[span=b-anime_status_tag discontinued] + selectedText +  [/span]'
        },
        {
            text: 'Приостановлено',
            wrapper: '[span=b-anime_status_tag paused] + selectedText +  [/span]'
        },
        {
            text: 'Вышло',
            wrapper: '[span=b-anime_status_tag released] + selectedText +  [/span]'
        },
        {
            text: 'Выходит',
            wrapper: '[span=b-anime_status_tag ongoing] + selectedText +  [/span]'
        },
        {
            text: 'Анонс',
            wrapper: '[span=b-anime_status_tag anons] + selectedText +  [/span]'
        },
        {
            text: 'Другое',
            wrapper: '[span=b-anime_status_tag other] + selectedText +  [/span]'
        },
        {
            text: 'Новости',
            wrapper: '[span=b-anime_status_tag news] + selectedText +  [/span]'
        },
        {
            text: 'Отзыв',
            wrapper: '[span=b-anime_status_tag review] + selectedText +  [/span]'
        },
        {
            text: 'Статья',
            wrapper: '[span=b-anime_status_tag article] + selectedText +  [/span]'
        },
        {
            text: 'Косплей',
            wrapper: '[span=b-anime_status_tag cosplay] + selectedText +  [/span]'
        },
        {
            text: 'Оффтоп',
            wrapper: '[span=b-anime_status_tag offtopic] + selectedText +  [/span]'
        },
        {
            text: 'Игнор',
            wrapper: '[span=b-anime_status_tag ignored] + selectedText +  [/span]'
        },
        {
            text: 'Рассылка',
            wrapper: '[span=b-anime_status_tag broadcast] + selectedText +  [/span]'
        }
    ];

    var editorControlsElement = document.querySelector('.all-elements');
    if (editorControlsElement) {
        buttons.forEach(function(item) {
            var button = createButton(item.text, item.wrapper);
            editorControlsElement.appendChild(button);
        });
    }
})();