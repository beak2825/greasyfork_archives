// ==UserScript==
// @name         LZT Bookmarks
// @namespace    lzt_bookmarks
// @version      0.5
// @description  Скрипт позволяет добавлять заметки к темам, которые были добавлены в избранные
// @author       seuyh
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/seuyh/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492213/LZT%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/492213/LZT%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';
function addNoteToThreadDiv(threadDiv, threadId) {
    const savedNote = localStorage.getItem('note_' + threadId);
    if (savedNote) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-element';
        noteElement.style.paddingBottom = '12px';
        noteElement.textContent = "Заметка: " + savedNote;
        threadDiv.appendChild(noteElement);
    }
}

function addNoteInputAndButton() {
    const bookmarkButton = document.querySelector('#content > div > div > div.pageNavLinkGroup.mn-15-0-0 > div > a.StarContent');
    const maincClassExists = bookmarkButton.classList.contains('mainc');

    const existingNoteInput = document.querySelector('.note-input');
    if (existingNoteInput) {
        existingNoteInput.remove();
        document.querySelector('.save-note-btn').remove();
        const threadId = window.location.pathname.split('/')[2];
        localStorage.removeItem('note_' + threadId);
        showNotification('Заметка удалена!');
        return;
    }

    if (!maincClassExists) {
        addButton();
    }
}

function addButton() {
    const noteInput = document.createElement('input');
    noteInput.setAttribute('type', 'text');
    noteInput.setAttribute('placeholder', 'Добавить заметку');
    noteInput.classList.add('note-input');
    noteInput.classList.add('textCtrl');

    const threadId = window.location.pathname.split('/')[2];
    const savedNote = localStorage.getItem('note_' + threadId);
    if (savedNote) {
        noteInput.value = savedNote;
    }

    let saveTimer;
    let notificationTimer;
    const saveInterval = 50;
    const notificationInterval = 600;

    const saveNote = () => {
        const note = noteInput.value.trim();
        if (note !== '') {
            localStorage.setItem('note_' + threadId, note);
        } else {
            localStorage.removeItem('note_' + threadId);
        }
    };

    const showNotificationAfterTyping = () => {
        const note = noteInput.value.trim();
        if (note !== '') {
            showNotification('Заметка сохранена!');
        } else {
            showNotification('Заметка удалена!');
        }
    };

    noteInput.addEventListener('input', () => {
        clearTimeout(saveTimer);
        clearTimeout(notificationTimer);
        saveTimer = setTimeout(saveNote, saveInterval);
        notificationTimer = setTimeout(showNotificationAfterTyping, notificationInterval);
    });

    const container = document.querySelector("#content > div > div > div.pageNavLinkGroup.mn-15-0-0");
    container.appendChild(noteInput);
}



window.onload = function() {
    setTimeout(function() {
    if (window.location.pathname.split('/')[1] === 'threads') {
    const bookmarkButton = document.querySelector('#content > div > div > div.pageNavLinkGroup.mn-15-0-0 > div > a.StarContent');
    const maincClassExists = bookmarkButton.classList.contains('mainc');
    if (maincClassExists) {
        addButton();
    }
    }
    if (window.location.href === "https://zelenka.guru/?tab=fave") {
            const threadDivs = document.querySelectorAll('div[id^="thread-"]');
            threadDivs.forEach(div => {
                const threadId = div.id.split('-')[1];
                addNoteToThreadDiv(div, threadId);
            });
        addDeleteNoteHandler();
        }
    }, 1000);
};

document.addEventListener('click', function(event) {
    const target = event.target;
    if (window.location.pathname.split('/')[1] === 'threads' && target.closest('#content > div > div > div.pageNavLinkGroup.mn-15-0-0 > div > a.StarContent')) {
        addNoteInputAndButton();
    }
});

function addDeleteNoteHandler() {
    if (window.location.href.includes("https://zelenka.guru/?tab=fave")) {
        const links = document.querySelectorAll('div[id^="thread-"] .StarContent');

        links.forEach(link => {
            link.addEventListener('click', (event) => {
                if (link.classList.contains('mainc')) {
                    event.preventDefault();

                    const threadDiv = link.closest('div[id^="thread-"]');
                    if (threadDiv) {
                        const threadId = threadDiv.id.replace('thread-', '');
                        localStorage.removeItem('note_' + threadId);

                        showNotification('Заметка удалена!');


                        const noteElement = threadDiv.querySelector('.note-element');
                        if (noteElement) {
                            noteElement.remove();
                        }
                    }
                }
            });
        });
    }
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    notification.style.position = 'fixed';
    notification.style.top = '-50px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'rgb(0, 186, 120) radial-gradient(circle, transparent 1%, rgb(0, 186, 120) 1%) center/15000%';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '10000';
    notification.style.transition = 'top 0.5s ease';

    setTimeout(() => { notification.style.top = '45px'; }, 10);

    setTimeout(() => {
        notification.style.top = '-50px';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
// Функция проверки URL и инициализации скрипта для отображения заметок
function checkUrlAndInitNotes() {
    if (window.location.href === "https://zelenka.guru/forums/?tab=fave") {
        const threadDivs = document.querySelectorAll('div[id^="thread-"]');
        threadDivs.forEach(div => {
            const threadId = div.id.split('-')[1];
            addNoteToThreadDiv(div, threadId);
        });
        addDeleteNoteHandler();
    }
}

let lastUrl = window.location.href;
setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        checkUrlAndInitNotes();
    }
}, 1000);

checkUrlAndInitNotes();

})();