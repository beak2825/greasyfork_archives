// ==UserScript==
// @name         Bring Save Button Back
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Возвращает кнопку сохранения поста на pikabu.ru на её законное место.
// @author       NosefU
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452975/Bring%20Save%20Button%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/452975/Bring%20Save%20Button%20Back.meta.js
// ==/UserScript==

const saveButtonIcon = '<svg class="svg-icon" style="fill: currentColor;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M730.584615 78.769231v267.815384c0 19.692308-15.753846 37.415385-37.415384 37.415385H273.723077c-19.692308 0-37.415385-15.753846-37.415385-37.415385V78.769231H157.538462C114.215385 78.769231 78.769231 114.215385 78.769231 157.538462v708.923076c0 43.323077 35.446154 78.769231 78.769231 78.769231h708.923076c43.323077 0 78.769231-35.446154 78.769231-78.769231V220.553846L803.446154 78.769231h-72.861539z m137.846154 750.276923c0 19.692308-15.753846 37.415385-37.415384 37.415384H194.953846c-19.692308 0-37.415385-15.753846-37.415384-37.415384V500.184615c0-19.692308 15.753846-37.415385 37.415384-37.415384h636.061539c19.692308 0 37.415385 15.753846 37.415384 37.415384v328.861539zM488.369231 267.815385c0 19.692308 15.753846 37.415385 37.415384 37.415384h90.584616c19.692308 0 37.415385-15.753846 37.415384-37.415384V78.769231h-163.446153l-1.969231 189.046154z"  /></svg>';


function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


function addSaveButtons(footerNodes) {
    for (let storyFooter of footerNodes) {
        let storyCard = storyFooter.closest(".story");
        let storyId = storyCard.dataset.storyId;
        let saveButton = document.createElement("div");
        saveButton.innerHTML = saveButtonIcon;
        saveButton.classList.add("story__save");
        if (storyCard.dataset.saved) saveButton.classList.add("story__save_active");
        saveButton.dataset.storyId = storyId;
        storyFooter.prepend(saveButton);
    }
}


// Коллбэк при срабатывании мутации
const observerCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type !== 'childList')	continue; // проверяем, что это изменение структуры страницы
        for (let node of mutation.addedNodes) { // сначала проходим по добавленным нодам
            if (node.nodeName === "#text" || node.nodeName === "#comment") continue; // отсекаем текст
            let storyFooters = node.getElementsByClassName('story__footer');
            addSaveButtons(storyFooters);
        }
    }
};


GM_addStyle('.story__save > svg {color: var(--color-black-700); height: 20px; width: 20px;}');
GM_addStyle('.story__save_active {background-color: var(--color-primary-700) !important;}');
GM_addStyle('.story__save_active > svg {color: var(--color-bright-900);}');

let storyFooters = document.getElementsByClassName('story__footer');
addSaveButtons(storyFooters);

// и вешаем обсервер для тех, у кого бесконечная лента
const config = {childList: true, subtree: true};
const observer = new MutationObserver(observerCallback);
observer.observe(document.body, config);