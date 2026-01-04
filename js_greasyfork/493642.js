// ==UserScript==
// @name         Readli Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Удаляет лишнее содержимое, заменяет буквы и удаляет "Ридли" из OG Title на readli.net
// @author       You
// @match        https://readli.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493642/Readli%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/493642/Readli%20Cleaner.meta.js
// ==/UserScript==

(function() {
    // Функция для замены букв с учётом тегов ссылок и пустых тегов
    function replaceTextWithLinks(text) {
        // Регулярное выражение для поиска текста вне тегов и непустых тегов
        const textRegex = /(>|^)([^<]+)(?=<|$)/g;

        return text.replace(textRegex, function(match, p1, textContent) {
            // Проверяем, не является ли текст пустым
            if (textContent.trim() === "") {
                return match; // Возвращаем исходное совпадение без изменений
            }

            // Замена букв в текстовом содержимом
            let replacedText = textContent
                .replace(/c/g, 'с')
                .replace(/p/g, 'р')
                .replace(/r/g, 'г')
                .replace(/x/g, 'х')
                .replace(/o/g, 'о')
                .replace(/e/g, 'е')
                .replace(/y/g, 'у')
                .replace(/C/g, 'С')
                .replace(/M/g, 'М')
                .replace(/K/g, 'К')
                .replace(/E/g, 'Е')
                .replace(/A/g, 'А')
                .replace(/H/g, 'Н')
                .replace(/T/g, 'Т')
                .replace(/P/g, 'Р')
                .replace(/O/g, 'О')
                .replace(/X/g, 'Х')
                .replace(/nbsр/g, 'nbsp')
                .replace(/a/g, 'а');

            return `${p1}${replacedText}`;
        });
    }

    // Замена букв и символов внутри <p> с учётом ссылок
    document.querySelectorAll('p').forEach(function(paragraph) {
        paragraph.innerHTML = replaceTextWithLinks(paragraph.innerHTML);
    });

    // Удаление "Ридли" из тега <title>
    var titleElement = document.querySelector("title");
    if (titleElement) {
        titleElement.textContent = titleElement.textContent.replace("Ридли", "");
    }

    // Function to remove comments within a specific element
    function removeComments(element) {
        const commentRegex = /<!-- readli_online -->/g;
        element.innerHTML = element.innerHTML.replace(commentRegex, '');
    }

    // Target divs with the class "reading wrapper" and remove comments
    document.querySelectorAll('div.reading.wrapper').forEach(function(readingDiv) {
        removeComments(readingDiv);
    });
    // Удаление "Ридли" из тега og:title
    var ogTitleElement = document.querySelector('meta[property="og:title"]');
    if (ogTitleElement) {
        ogTitleElement.content = ogTitleElement.content.replace("Ридли", "");
    }

})();