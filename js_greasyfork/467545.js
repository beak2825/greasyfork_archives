// ==UserScript==
// @name         Go away telegram-freeloader!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удаляет ссылки на телегу и ВК.
// @author       notimer
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlgrm.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467545/Go%20away%20telegram-freeloader%21.user.js
// @updateURL https://update.greasyfork.org/scripts/467545/Go%20away%20telegram-freeloader%21.meta.js
// ==/UserScript==
//
// Функция удаления из нод ссылок
function removeTelega(textNodes) {
    for (let blockNode of textNodes) {
        if (blockNode.hasChildNodes()) {
            if (typeof blockNode.childNodes[1] !== 'undefined') {
                blockNode.childNodes[1].querySelectorAll('[href^="https://t.me"],[href^="https://vk.com"],[href*="t.me"],[href*="vk.com"]').forEach(function(elem) {elem.remove();});
            }
        }
    }
}
// Коллбэк при срабатывании мутации
const observerCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type !== 'childList')	continue;
        for (let node of mutation.addedNodes) {
            if (node.nodeName === "#text" || node.nodeName === "#comment") continue;
            let storyTelega = node.getElementsByClassName('story-block story-block_type_text');
            removeTelega(storyTelega);
        }
    }
};

let storyTelega = document.getElementsByClassName('story-block story-block_type_text');
removeTelega(storyTelega);

// Обсервер для тех, у кого бесконечная лента
const config = {childList: true, subtree: true};
const observer = new MutationObserver(observerCallback);
observer.observe(document.body, config);