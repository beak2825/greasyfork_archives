// ==UserScript==
// @name         Devast io autorun
// @namespace    http://tampermonkey.net/
// @version      2024-09-26
// @description  Devast.io auto run
// @author       You
// @match        https://devast.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=devast.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510901/Devast%20io%20autorun.user.js
// @updateURL https://update.greasyfork.org/scripts/510901/Devast%20io%20autorun.meta.js
// ==/UserScript==

// Створюємо контейнер для GUI
var guiContainer = document.createElement('div');
guiContainer.style.position = 'fixed';
guiContainer.style.top = '10px';
guiContainer.style.right = '10px';
guiContainer.style.padding = '10px';
guiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
guiContainer.style.color = 'white';
guiContainer.style.borderRadius = '5px';
guiContainer.style.zIndex = '1000';
guiContainer.style.fontFamily = 'Arial, sans-serif';

// Додаємо заголовок "Autorun"
var guiTitle = document.createElement('h2');
guiTitle.innerText = 'Autorun press "L" ';
guiTitle.style.margin = '0';
guiTitle.style.paddingBottom = '10px';
guiTitle.style.fontSize = '16px';
guiTitle.style.borderBottom = '1px solid white';

// Додаємо кнопку "Auto shift"
var shiftButton = document.createElement('button');
shiftButton.innerText = 'Auto shift';
shiftButton.style.padding = '5px 10px';
shiftButton.style.fontSize = '14px';
shiftButton.style.cursor = 'pointer';
shiftButton.style.backgroundColor = '#007bff';
shiftButton.style.color = 'white';
shiftButton.style.border = 'none';
shiftButton.style.borderRadius = '3px';
shiftButton.style.marginTop = '10px';

// Змінна для відстеження стану авто-шифта
var autoShiftActive = false;

// Додаємо обробник події для кнопки "Auto shift"
shiftButton.onclick = function() {
    toggleAutoShift();
};

// Функція для перемикання авто-шифта
function toggleAutoShift() {
    autoShiftActive = !autoShiftActive; // Перемикаємо стан авто-шифта

    if (autoShiftActive) {
        shiftButton.innerText = 'Stop Auto shift'; // Змінюємо текст кнопки
        pressKey(16); // Натискаємо Shift
        // Утримуємо Shift
        document.addEventListener('keydown', holdShift);
    } else {
        shiftButton.innerText = 'Auto shift Press "L"'; // Повертаємо текст кнопки
        releaseKey(16); // Відпускаємо Shift
        document.removeEventListener('keydown', holdShift); // Зупиняємо утримання
    }
}

// Функція для натискання клавіші
function pressKey(keyCode) {
    var event = new KeyboardEvent('keydown', {keyCode: keyCode, which: keyCode, bubbles: true});
    document.dispatchEvent(event);
}

// Функція для відпускання клавіші
function releaseKey(keyCode) {
    var event = new KeyboardEvent('keyup', {keyCode: keyCode, which: keyCode, bubbles: true});
    document.dispatchEvent(event);
}

// Функція для утримання Shift
function holdShift(event) {
    if (event.keyCode === 16) {
        event.preventDefault(); // Запобігаємо стандартній поведінці
    }
}

// Додаємо обробник для гарячої клавіші "L"
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'l') { // Перевіряємо, чи натиснута клавіша "L"
        toggleAutoShift(); // Викликаємо функцію перемикання авто-шифта
    }
});

// Додаємо елементи до контейнера
guiContainer.appendChild(guiTitle);
guiContainer.appendChild(shiftButton);

// Додаємо контейнер GUI до сторінки
document.body.appendChild(guiContainer);
