// ==UserScript==
// @name         ЧОЙЗ, 1-7 и QWER
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  кнопки 1-7=цвет, Q-W-E-R=(fine)-(parts)-(almost)-(fail), стрелка право-лево=открыть-закрыть масштаб
// @author       You
// @match        *://tngadmin.triplenext.net/Admin/MyCurrentTask/ChooseImage*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492841/%D0%A7%D0%9E%D0%99%D0%97%2C%201-7%20%D0%B8%20QWER.user.js
// @updateURL https://update.greasyfork.org/scripts/492841/%D0%A7%D0%9E%D0%99%D0%97%2C%201-7%20%D0%B8%20QWER.meta.js
// ==/UserScript==


// Функция для симуляции нажатия кнопки или ссылки
function clickButton(selector) {
    var button = document.querySelector(selector);
    if (button) {
        button.click();
    } else {
        console.warn(`Button with selector "${selector}" not found.`);
    }
}

// Обработчик события для нажатия клавиш...
document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case 'Digit1':
            clickButton('.red');
            break;
        case 'Digit2':
            clickButton('.blue');
            break;
        case 'Digit3':
            clickButton('.orange');
            break;
        case 'Digit4':
            clickButton('.green');
            break;
        case 'Digit5':
            clickButton('.olive');
            break;
        case 'Digit6':
            clickButton('.gray');
            break;
        case 'Digit7':
            clickButton('.white');
            break;
        case 'KeyQ':
            clickButton('[data-action="Accept"]');
            break;
        case 'KeyW':
            clickButton('[data-action="ImageChoicePerfectRemoveParts"]');
            break;
        case 'KeyE':
            clickButton('[data-action="ManualRedo"]');
            break;
        case 'KeyR':
            clickButton('[data-action="ImageChoiceRejected"]');
            break;
        case 'ArrowLeft':
            clickButton('.btn-prev');
            break;
        case 'ArrowRight':
            clickButton('.btn-next');
            break;
        default:
            console.warn(`No action defined for key "${event.code}".`);
    }
});