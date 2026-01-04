// ==UserScript==
// @name         Yandex Music Explicit Mark Replacement
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Replaces the exclamation explicit mark with a classic one on Yandex Music
// @author       wileyfoxyx
// @match        https://music.yandex.ru/*
// @match        https://music.yandex.com/*
// @match        https://music.yandex.by/*
// @match        https://music.yandex.kz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523783/Yandex%20Music%20Explicit%20Mark%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/523783/Yandex%20Music%20Explicit%20Mark%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleExplicitMarks() {
        const explicitElements = document.querySelectorAll('.d-explicit-mark');

        explicitElements.forEach(element => {
            const title = element.title;

            if (title.includes("УЧАСТНИК ГРУППЫ ПРИЗНАН ИНОАГЕНТОМ") && title.includes("Возрастное ограничение 18+")) {
                element.remove();
            }
            else if (title.includes("ИСПОЛНИТЕЛЬ ПРИЗНАН ИНОАГЕНТОМ") && title.includes("Возрастное ограничение 18+")) {
                element.remove();
            }
            else if (title.includes("THE ARTIST IS RECOGNIZED AS A FOREIGN AGENT") && title.includes("Age restriction 18+")) {
                element.remove();
            }
            else if (title.includes("A BAND MEMBER IS RECOGNIZED AS A FOREIGN AGENT") && title.includes("Age restriction 18+")) {
                element.remove();
            }
            else if (title === "Возрастное ограничение 18+" || title === "Age restriction 18+") {
                const newSpan = document.createElement('span');
                newSpan.className = 'd-explicit-mark d-explicit-mark--e';
                newSpan.title = 'Сервис Яндекс Музыка может содержать информацию, не предназначенную для несовершеннолетних';
                element.replaceWith(newSpan);
            }
        });
    }

    function removeAgentDiv() {
        const agentDivs = document.querySelectorAll('.page-artist__agent');

        agentDivs.forEach(agentDiv => {
            const textContent = agentDiv.textContent.trim();

            if (textContent === "ИСПОЛНИТЕЛЬ ПРИЗНАН ИНОАГЕНТОМ" || textContent === "УЧАСТНИК ГРУППЫ ПРИЗНАН ИНОАГЕНТОМ" || textContent === "THE ARTIST IS RECOGNIZED AS A FOREIGN AGENT" || textContent === "A BAND MEMBER IS RECOGNIZED AS A FOREIGN AGENT") {
                agentDiv.remove();
            }
        });
    }

    handleExplicitMarks();
    removeAgentDiv();

    const observer = new MutationObserver(() => {
        handleExplicitMarks();
        removeAgentDiv();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();