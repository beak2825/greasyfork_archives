// ==UserScript==
// @name         YaTracker Worklog select helper
// @namespace    http://tampermonkey.net/
// @version      1.94
// @description  Provide ability to select worklog type
// @author       Onellect
// @match        https://tracker.yandex.ru/*
// @exclude      https://tracker.yandex.ru/admin/*
// @exclude      https://tracker.yandex.ru/*/statistics*
// @exclude      https://tracker.yandex.ru/queues/new/*
// @exclude      https://tracker.yandex.ru/agile/board/*/sprints*
// @exclude      https://tracker.yandex.ru/queues/new/copy-queue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463466/YaTracker%20Worklog%20select%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463466/YaTracker%20Worklog%20select%20helper.meta.js
// ==/UserScript==

var cssLocator = ".add-worklog-dialog";
var items = [
    'Анализ',
    'Разработка',
    'Документирование',
    'Стендап/ретро',
    'Обучение',
    'Помощь в обучении',
    'Тестирование',
    'Демонстрация',
    'Мониторинг обращений',
    'Техподдержка',
    'Консультация',
    'Тест обновления',
    'Деплой'
];

setInterval(() => {
    const container = $(cssLocator);
    const antiDouble = document.createElement('no-double-adding-select');
    if(container.find("textarea").length && !container.find('no-double-adding-select').length) {
        container.append(antiDouble);
        showSelectWorklog($(cssLocator));
    }
}, 100);

function showSelectWorklog (jNode) {
    var select = document.createElement('select');
    var defaultValue = localStorage.getItem('workDefault');
    items.forEach(item => {
        var option = new Option(item, item, false, defaultValue === item);
        select.appendChild(option);
    });
    $(".g-dialog-body").append(select);
    select.onchange = function(event) {
        changeTextareaValue(jNode.find("textarea"), event.target.value);
        localStorage.setItem('workDefault', event.target.value);
    };
    changeTextareaValue(jNode.find("textarea"), select.value);
}
function changeTextareaValue(jqueryTextarea, value) {
    const textarea = jqueryTextarea[0];
    const valueSetter = Object.getOwnPropertyDescriptor(textarea, 'value').set;
    const prototype = Object.getPrototypeOf(textarea);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(textarea, value);
    } else {
        valueSetter.call(textarea, value);
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true, target: textarea }));
}
