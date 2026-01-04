// ==UserScript==
// @name         AniChat Morse
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Morse
// @author       Fenion
// @match        https://anichat.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anichat.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463757/AniChat%20Morse.user.js
// @updateURL https://update.greasyfork.org/scripts/463757/AniChat%20Morse.meta.js
// ==/UserScript==

const dictionary = [
    ['А', '•− '],
    ['Б', '−••• '],
    ['В', '•−− '],
    ['Г', '−−• '],
    ['Д', '−•• '],
    ['Е', '• '],
    ['Ё', '• '],
    ['Ж', '•••− '],
    ['З', '−−•• '],
    ['И', '•• '],
    ['Й', '•−−− '],
    ['К', '−•− '],
    ['Л', '•−•• '],
    ['М', '−− '],
    ['Н', '−• '],
    ['О', '−−− '],
    ['П', '•−−• '],
    ['Р', '•−• '],
    ['С', '••• '],
    ['Т', '− '],
    ['У', '••− '],
    ['Ф', '••−• '],
    ['Х', '•••• '],
    ['Ц', '−•−• '],
    ['Ч', '−−−• '],
    ['Ш', '−−−− '],
    ['Щ', '−−•− '],
    ['Ъ', '−−•−− '],
    ['Ы', '−•−− '],
    ['Ь', '−••− '],
    ['Э', '••−•• '],
    ['Ю', '••−− '],
    ['Я', '•−•− '],
    ['0', '−−−−−'],
    ['1', '•−−−− '],
    ['2', '••−−− '],
    ['3', '•••−− '],
    ['4', '••••− '],
    ['5', '••••• '],
    ['6', '−•••• '],
    ['7', '−−••• '],
    ['8', '−−−•• '],
    ['9', '−−−−• '],
    ['.', '•••••• '],
    [',', '•−•−•− '],
    ['!', '−−••−− '],
    ['?', '••−−•• '],
    [' ', '/ '],
];

const textToMorse = () => {
    let source = prompt('Введите текст для перевода');
    if (!source) return;
    source = source.toUpperCase().split('');
    const result = source.map((v) => {
        const symbol = dictionary.find((i) => i[0] === v);
        if (!symbol) return v + ' ';
        return symbol[1];
    }).join('');
    const input = document.body.querySelector('#content');
    input.value = input.value + ' ' + result;
    input.focus();
};

const initTextToMorse = () => {
    const inputs = document.body.querySelector('#main_input_box');
    const morse = document.createElement('div');
    morse.innerHTML = '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';
    morse.className = 'input_item main_item base_main';
    morse.onclick = textToMorse;
    inputs.before(morse);
};

const morseToText = (msgId) => {
    const msgNode = document.body.querySelector(`#log${msgId} .chat_message`);
    const msgText = msgNode.innerText;
    const result = msgText
        .split(' ')
        .map((v) => {
            const formatted = v.replaceAll('.', '•').replaceAll('-', '−').replace('_', '−');
            const signal = dictionary.find((i) => i[1].replace(' ', '') === formatted);
            if (!signal) return v;
            return signal[0].toLowerCase();
        })
        .join('');
    msgNode.innerText = result;
};

const initMorseToText = () => {
    const origin = window.logMenu;
    window.logMenu = (...args) => {
        origin(...args);
        const target = document.body.querySelector('#logmenu');
        const item = document.createElement('div');
        const msgId = target.children[0].attributes.getNamedItem('data').value;
        item.className = 'fmenu_item fmenut log_menu_item log_report';
        item.innerText = 'Перевести Морзе';
        item.onclick = () => morseToText(msgId);
        target.append(item);
        const chatNodeRect = document.body.querySelector(`#log${msgId} .cclear`).getBoundingClientRect();
        document.body.querySelector('#log_menu').style = `left: ${chatNodeRect.left - 130}px; top: ${chatNodeRect.top}px; height: 90px;`;
    }
};

(function() {
    'use strict';

    initTextToMorse();
    initMorseToText();
})();