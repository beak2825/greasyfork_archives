// ==UserScript==
// @name         Buttons for quick copying of text. Zelenka.guru.
// @namespace    http://tampermonkey.net/
// @license      https://zelenka.guru/rukia/
// @version      1.0
// @description  Добавляет кнопки для копирования текста, позволяет создавать/удалять пользовательские кнопки и сохраняет их после перезагрузки.
// @author       Rukia
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://i.imgur.com/IOOaCrP.png
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/508362/Buttons%20for%20quick%20copying%20of%20text%20Zelenkaguru.user.js
// @updateURL https://update.greasyfork.org/scripts/508362/Buttons%20for%20quick%20copying%20of%20text%20Zelenkaguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonData = JSON.parse(localStorage.getItem('customButtons')) || [];
    let buttonCount = buttonData.length;
    const maxButtonCount = 11;
    const maxButtonTextLength = 28;

    function createButton(buttonText, copyText, isNew = false) {
        let button = document.createElement("button");
        button.textContent = buttonText;
        button.style.position = "fixed";
        button.style.right = "20px";
        button.style.width = "110px";
        button.style.height = "40px";
        button.style.backgroundColor = "#228e5d";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.style.top = `${calcButtonPosition()}px`;

        button.onclick = function() {
            GM_setClipboard(copyText);
            button.style.backgroundColor = "#303030";
            setTimeout(function() {
                button.style.backgroundColor = "#228e5d";
            }, 500);
        };

        button.classList.add('custom-button');
        document.body.appendChild(button);
        buttonCount++;
        updateButtonPositions();

        if (isNew) {
            buttonData.push({text: buttonText, copyText: copyText});
            localStorage.setItem('customButtons', JSON.stringify(buttonData));
        }
    }

    // Создание кнопки +
    function createAddButton() {
        let addButton = document.createElement("button");
        addButton.textContent = "+";
        addButton.style.position = "fixed";
        addButton.style.right = "85px";
        addButton.style.width = "20px";
        addButton.style.height = "20px";
        addButton.style.backgroundColor = "#32CD32";
        addButton.style.color = "#fff";
        addButton.style.border = "none";
        addButton.style.borderRadius = "5px";
        addButton.style.cursor = "pointer";
        addButton.style.zIndex = "1000";
        addButton.style.top = "95%";

        addButton.onclick = function() {
            if (buttonCount >= maxButtonCount) {
                alert('Нельзя создать больше 11 кнопок.');
                return;
            }

            let buttonText = prompt("Введите текст для кнопки (макс. 28 символов):");
            let copyText = prompt("Введите текст, который будет копироваться:");

            if (buttonText && buttonText.length > maxButtonTextLength) {
                alert(`Текст кнопки слишком длинный! Максимум ${maxButtonTextLength} символов.`);
                return;
            }

            if (buttonText && copyText) {
                createButton(buttonText, copyText, true);
            }
        };

        document.body.appendChild(addButton);
    }

    function createRemoveButton() {
        let removeButton = document.createElement("button");
        removeButton.textContent = "-";
        removeButton.style.position = "fixed";
        removeButton.style.right = "110px";
        removeButton.style.width = "20px";
        removeButton.style.height = "20px";
        removeButton.style.backgroundColor = "#FF6347";
        removeButton.style.color = "#fff";
        removeButton.style.border = "none";
        removeButton.style.borderRadius = "5px";
        removeButton.style.cursor = "pointer";
        removeButton.style.zIndex = "1000";
        removeButton.style.top = "95%";

        removeButton.onclick = function() {
            if (buttonData.length === 0) {
                alert("Нет кнопок для удаления.");
                return;
            }

            let buttonNames = buttonData.map((btn, index) => `${index + 1}: ${btn.text}`).join("\n");

            let choice = prompt(`Введите номер кнопки для удаления или напишите "all" для удаления всех кнопок:\n${buttonNames}`);

            if (choice && choice.toLowerCase() === "all") {
                if (confirm("Вы уверены, что хотите удалить все кнопки?")) {
                    buttonData = [];
                    localStorage.setItem('customButtons', JSON.stringify(buttonData));
                    reloadButtons();
                    alert("Все кнопки удалены.");
                }
            } else {
                let indexToRemove = parseInt(choice) - 1;
                if (indexToRemove >= 0 && indexToRemove < buttonData.length) {
                    buttonData.splice(indexToRemove, 1);
                    localStorage.setItem('customButtons', JSON.stringify(buttonData));
                    reloadButtons();
                } else {
                    alert('Неверный выбор!');
                }
            }
        };

        document.body.appendChild(removeButton);
    }

    function calcButtonPosition() {
        const screenHeight = window.innerHeight;
        const buttonSpacing = 60;
        const totalButtonHeight = buttonCount * buttonSpacing;
        return (screenHeight / 2) - (totalButtonHeight / 2) + (buttonCount * buttonSpacing);
    }

    function updateButtonPositions() {
        let buttons = document.querySelectorAll('.custom-button');
        buttons.forEach((button, index) => {
            button.style.top = `${calcButtonPositionForIndex(index)}px`;
        });
    }

    function calcButtonPositionForIndex(index) {
        const screenHeight = window.innerHeight;
        const buttonSpacing = 45;
        const totalButtonHeight = buttonCount * buttonSpacing;
        return (screenHeight / 2) - (totalButtonHeight / 2) + (index * buttonSpacing);
    }

    function reloadButtons() {
        document.querySelectorAll('.custom-button').forEach(btn => btn.remove());
        buttonCount = 0;

        buttonData.forEach(btn => {
            createButton(btn.text, btn.copyText);
        });
    }

    createAddButton();
    createRemoveButton();
    reloadButtons();
})();
