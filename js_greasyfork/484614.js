// ==UserScript==
// @name         change text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  меняет выделенный текст на странице
// @author       awaw (Andrey) https://zelenka.guru/andrey/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484614/change%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/484614/change%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeSelectedText() {
        var selectedText = window.getSelection().toString();
        if (selectedText !== "") {
            var newText = prompt('Введи текст');
            if (newText !== null) {
                var range = window.getSelection().getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(newText));
            }
        } else {
            alert('Выдели текст который хочешь изменить');
        }
    }

// кнопка. можно менять область и как далеко оно находится, надпись (можно убрать, будет маленькая кнопочка)

    function addChangeTextButton() {
        var button = document.createElement('button');
        button.innerText = 'изменить'; // тут меняется или убирается текст
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.addEventListener('click', changeSelectedText);
        document.body.appendChild(button);
    }

    window.addEventListener('load', function() {
        addChangeTextButton();
    });
})();
