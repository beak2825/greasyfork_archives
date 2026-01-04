// ==UserScript==
// @name        reply by alt + arrows
// @namespace   Violentmonkey Scripts
// @include     https://www.twitch.tv/popout/*/chat*
// @include     https://www.twitch.tv/*
// @version     1.2
// @author      yyko
// @description select the message you want to reply to by pressing the alt and arrow keys
// @grant       GM.addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486233/reply%20by%20alt%20%2B%20arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/486233/reply%20by%20alt%20%2B%20arrows.meta.js
// ==/UserScript==


const getChat = () => document.querySelector('.chat-scrollable-area__message-container');
const replyTargetClass = 'reply_target';

GM.addStyle(`.chat-line__message{transition: background-color .3s;}.${replyTargetClass}{background-color: #6666;}`);

let tempMsg;

window.addEventListener('click', (event) => {
    // сбрасывать tempMsg при ручном закрытии окна ответа пользователем
    if(event.isTrusted && event.target.className.includes('ScCoreButton-sc')){
        resetReply();

        return;
    }

    if(event.altKey){
        // ответить на сообщение при Alt
        const msg = event.target.closest('.chat-line__message');
        if(msg){
            findReplyBtn(msg)?.click();
        }
    }
});

function resetReply(){
    tempMsg?.classList.remove(replyTargetClass);
    tempMsg = undefined;
}

function closeReply() {
    resetReply();

    // поиск и, при наличии, клик по кнопке закрытия окна ответа. если не найдена, то evaluate вернёт null, а сравнение (и функция) false, иначе true
    return document.evaluate('//div[contains(@class, "chat-input-tray__open")]//button[contains(@class, "ScCoreButton-sc")]', document)?.iterateNext()?.click() !== null;
}

function findReplyBtn(element) {
    // return document.evaluate('/div[contains(@class, "chat-line__reply-icon")]//button', element)?.iterateNext();
    return element.querySelector('div.chat-line__reply-icon button');
}

function findNext(msg, above) {
    // если холодный старт (текущее сообщение не выбрано)
    let coldStart = !msg;

    while (true) {
        msg = (coldStart && above) ? getChat().lastElementChild : ((above) ? msg.previousElementSibling : msg.nextElementSibling);
        coldStart = false;

        // если нет следующего элемента
        if (!msg) {
            return {};
        }


        // поиск кнопки ответа
        const replyBtn = findReplyBtn(msg);

        // если нет кнопки ответа, то это какое-то неправильное сообщение и стоит попробовать поискать нормальное
        if (!replyBtn) {
            continue;
        }

        return {
            msg,
            replyBtn,
        };
    }
}

window.addEventListener('keydown', (event) => {
    if (!event.altKey) {
        return;
    }

    if (!['ArrowUp', 'ArrowDown', 'KeyN'].includes(event.code)) {
        return;
    }

    if (event.code === 'KeyN') {
        closeReply();
        return false;
    }


    const above = event.code === 'ArrowUp';

    let res = findNext(tempMsg, above);

    // если нет следующего сообщения
    if (!res.msg) {
        // и направление вниз
        if (!above) {
            // просто закрыть ответ
            return closeReply();
        }

        // иначе ничего не делать
        return;
    }

    resetReply();
    tempMsg = res.msg;

    res.msg.classList.add('reply_target');
    res.replyBtn.click();
}, {
    passive: true,
});
