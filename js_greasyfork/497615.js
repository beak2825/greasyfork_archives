// ==UserScript==
// @name         Quick Offtop LZT
// @description Скрипт для быстрого постинга в оффтопике zelenka.guru
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       @wallet_lzt
// @match        https://zelenka.guru/forums/8/*
// @match        https://lolz.live/forums/8/*
// @grant        GM_addStyle
// @grant        GM_cookie
// @icon         https://icon666.com/r/_thumb/lzh/lzhyyoq3j4cb_64.png
// @require https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.5/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/497615/Quick%20Offtop%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/497615/Quick%20Offtop%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .fast_btn {
        margin-left: 10px;
        height: 28px;
        background-size: 45%;
        background-repeat: no-repeat;
    }

     .inputWithButton {
        display: flex;
        align-items: center;
        border-radius: 6px;
        padding-top: 12px;
        max-width: 400px;
    }

    .inputWithButton textarea {
        height: 18px;
        resize: none;
         outline: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 6px 0 0 6px;
        background-color: rgb(49 49 49);
        color: #fff;
    }

    .inputWithButton button {
    padding: 8px 20px;
    border: none;
    border-radius: 0 6px 6px 0;
    background-color: rgb(34, 142, 93);
    color: #fff;
    cursor: pointer;
    transition: filter 0.3s;
}

.inputWithButton button:hover {
    filter: brightness(130%);
}
    `);
    
    
    const bearer = ""; // Ваш API-ключ

    const sup_msg = ""; // Дополнительный текст снизу сообщения, можно оставить пустым
// Генерация быстрых кнопок


const renderQuickButtons = function() {
    const latestThreads = document.querySelector('.latestThreads._insertLoadedContent');
    const titles = latestThreads.querySelectorAll('.PreviewTooltip h3');

    for (let title of titles) {
        const parentLink = title.parentNode;

        if (!parentLink.querySelector('.fast_btn')) {
            const button = document.createElement('button');
            button.classList.add('fast_btn', 'button');
            button.innerHTML = '<!-- icon666.com - MILLIONS vector ICONS FREE --><svg width="15px" height="15px" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="clip0_7:7"><path d="m0 0h24v24h-24z"/></clipPath><g clip-path="url(#clip0_7:7)"><path d="m12.24 0c-.345 0-.6657.177881-.8484.470611l-6.23997 9.999989c-.19237.3083-.20236.6967-.02608 1.0145.17627.3178.51107.5149.87446.5149h2.89718l-3.83806 10.6613c-.16565.4601.0258.9726.45258 1.2114s.96367.1339 1.26917-.248l12.00002-15.00001c.2401-.30017.2869-.71141.1204-1.05788-.1665-.34646-.5169-.56681-.9013-.56681h-2.9018l3.7265-5.43447c.2099-.30609.233-.703252.0601-1.031616-.173-.328363-.5136-.533914-.8848-.533914z" fill="white"/></g></svg>';

            button.addEventListener('click', function() {
                event.preventDefault();
                const parentTitle = event.target.closest('.PreviewTooltip').querySelector('h3');

                if (parentLink.tagName === 'A') {
                    const existingForm = parentLink.querySelector('form');
                    if (existingForm) {
                        parentLink.removeChild(existingForm);
                    } else {
                        const form = document.createElement('form');
                        form.classList.add('inputWithButton');
                        form.innerHTML = '<textarea placeholder="Введите текст..."></textarea><button>Отправить</button>';

                        form.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });

                        const formButton = form.querySelector('button');
                        const textarea = form.querySelector('textarea');

                        formButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            const inputText = textarea.value;
                            const threadId = parentLink.getAttribute('href').match(/\d+/)[0];

                            const newIcon = document.createElement('i');
                            newIcon.classList.add('fa', 'fa-bullseye', 'mainc', 'Tooltip');
                            newIcon.setAttribute('data-placement', 'left');
                            newIcon.setAttribute('aria-hidden', 'true');
                            newIcon.setAttribute('title', '');
                            newIcon.setAttribute('tabindex', '0');
                            parentTitle.insertBefore(newIcon, parentTitle.firstChild);

                            console.log('Текст из поля ввода:', inputText);
                            console.log('ID треда:', threadId);
                            createPost(threadId, inputText, bearer);
                            parentLink.removeChild(form);
                            checkThreads();
                        });

                        textarea.addEventListener('keyup', function(event) {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                formButton.click();
                            }
                        });

                        parentLink.appendChild(form);
                        textarea.focus();
                    }
                }
            });

            title.appendChild(button);
        }
    }
};

// Функция для отображения кнопки
function renderShowButton() {
    const linkGroup = document.querySelector('.linkGroup');

    const button = document.createElement('a');
    button.classList.add('OverlayTrigger', 'button', 'Tooltip');
    button.setAttribute('href', '');
    button.setAttribute('title', 'Скрывать темы с ответами');
    button.setAttribute('data-cachedtitle', 'Скрывать темы с ответами');

    const iElement = document.createElement('i');
    iElement.classList.add('fa', 'fa-bullseye', checkStatus());
    button.appendChild(iElement);

    button.addEventListener('click', function(e) {
        e.preventDefault();
        const status = Cookies.get('ShowTopicsWithAnswers');

        if (status && status == 'true') {
            Cookies.set('ShowTopicsWithAnswers', 'false');
        } else {
            Cookies.set('ShowTopicsWithAnswers', 'true');
        }

        window.location.reload();
    });

    linkGroup.insertBefore(button, linkGroup.firstChild);
    linkGroup.querySelectorAll('.Tooltip')?.forEach(el => XenForo.Tooltip($(el)));

    function checkStatus() {
        const status = Cookies.get('ShowTopicsWithAnswers');
        return status == 'true' ? 'mainc' : 'muted';
    }
}

renderQuickButtons();
renderShowButton();
checkThreads();

// Очередь для отправки сообщений
class Queue {
    constructor(interval = 3000) {
        this._queue = [];
        this._monitor = setInterval(() => {
            const request = this._queue.shift();
            if (request) {
                const { thread_id, msg, options } = request;

                fetch(`https://api.zelenka.guru/posts?thread_id=${thread_id}`, options)
                    .then((response) => response.json())
                    .then((response) => {
                        console.log(response);
                    if (response.post) {
                        Alert(`Сообщение "${response.post.post_body_plain_text}" отправлено!`, 5000);
                    } else {
                    Alert(`${response.errors[0]}`, 5000);
                    }
                    })
                    .catch((err) => {
                        console.error(err);
                    console.log(err)
                    });

            }
        }, interval);
    }

    dispose = () => clearInterval(this._monitor);
    push = (str) => this._queue.push(str);
}

const queue = new Queue(6000);

// Создание поста
function createPost(thread_id, msg, bearer) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${bearer}`,
        },
        body: new URLSearchParams({ post_body: msg.trim() + '\n' + sup_msg }),
    };

    queue.push({ thread_id, msg, options });
}

// Вывод уведомлений
function Alert(text, time) {
    return XenForo.alert(text, false, time);
}

// Отслеживание изменений для перерендеринга кнопок
const observer2 = new MutationObserver(function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        if (mutation.target.classList.contains('latestThreads') && mutation.target.classList.contains('_insertLoadedContent')) {
            renderQuickButtons();
            checkThreads();
        }
    });
});

observer2.observe(document.body, { subtree: true, childList: true });

// Проверка тредов и их скрытие
function checkThreads() {
    const discussionListItems = document.querySelectorAll('.discussionListItem');

    discussionListItems.forEach(item => {
        const bullseyeElement = item.querySelector('.fa-bullseye');
        const status = Cookies.get('ShowTopicsWithAnswers');

        if (bullseyeElement && status == 'true') {
            item.remove();
        }
    });
}


})();