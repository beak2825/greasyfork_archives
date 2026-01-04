// ==UserScript==
// @name         HTML Разметка в junon.io | RU
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Позволяет вставлять HTML и CSS элементы, используя #(твой текст)#
// @author       Belogvardeec
// @license      MIT
// @match        *://junon.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526454/HTML%20%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20junonio%20%7C%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/526454/HTML%20%D0%A0%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20junonio%20%7C%20RU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertContentToHTMLCSS(element) {
        if (element.id === 'chat_input') return; // игнорируем меню чата где можно писать

        let content = element.value || element.textContent; // берём текст без HTML
        const regex = /#(.*?)#/g;

        if (!regex.test(content)) return; // если нет #...#, то идём нахуй

        // удаляем предыдущие элементы(кастомные), шобы избежать дублирования
        element.querySelectorAll('.custom-content').forEach(el => el.remove());

        // добавляем стиль только один раз во избежание конфликтов
        if (!document.querySelector('.custom-style')) {
            const style = document.createElement('style');
            style.className = 'custom-style';
            style.innerHTML = `
                .custom-content {
                    color: white;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        // замена #(текст)# на HTML-контент
        const newContent = content.replace(regex, (_, p1) => {
            return `<span class="custom-content">${p1}</span>`;
        });

        // поддержка input'ов
        if (element.tagName.toLowerCase() === 'input') {
            let output = element.parentNode.querySelector('.custom-content-container');
            if (!output) {
                output = document.createElement('div');
                output.className = 'custom-content-container';
                element.insertAdjacentElement('afterend', output);
            }
            output.innerHTML = newContent;
        } else {
            element.innerHTML = newContent;
        }

        // помечаем пупсика, шоб не втыкал
        element.dataset.converted = "true";
    }

    function processElements() {
        document.querySelectorAll('input, .chat_content').forEach(element => {
            convertContentToHTMLCSS(element);
        });
    }

    setInterval(processElements, 450);

})();
