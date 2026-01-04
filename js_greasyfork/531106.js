// ==UserScript==// ==UserScript==
// @name         Для технических чоколадок 23 / C.Legasy
// @namespace    https://forum.blackrussia.online
// @version      1.01
// @description  Для модерирования и работы на форуме
// @author       Carlos Legasy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license  MIT
// @collaborator
// @icon https://i.postimg.cc/PrdT1Ch8/95cb0bdbdaa969d13d2e602d9ff2b93a.jpg
// @downloadURL
// @updateURL
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/531106/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%87%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BE%D0%BA%2023%20%20CLegasy.user.js
// @updateURL https://update.greasyfork.org/scripts/531106/%D0%94%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%87%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BE%D0%BA%2023%20%20CLegasy.meta.js
// ==/UserScript==

const bgButtons = document.querySelector(".pageContent");

// Функция создания кнопки
const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("bgButton");

    // Устанавливаем стили для кнопки
    button.style.padding = "5px 10px";
    button.style.fontSize = "12px";
    button.style.margin = "2px";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.color = "#fff";
    button.style.cursor = "pointer";
    button.style.position = "relative";
    button.style.overflow = "hidden";

    button.addEventListener("click", () => {
        window.location.href = href;
    });

    return button;
};

// CSS для анимации
const style = document.createElement('style');
style.textContent = `
.bgButton {
    transition: background-color 0.5s, transform 0.2s; /* Плавный переход */
}

.bgButton:hover {
    transform: scale(1.05); /* Увеличение при наведении */
}

[club66008961|@keyframes] gradient {
    0% { background-color: #007bff; }
    25% { background-color: #0056b3; }
    50% { background-color: #004080; }
    75% { background-color: #003366; }
    100% { background-color: #007bff; }
}

.bgButton {
    animation: gradient 5s infinite alternate; /* Плавная анимация */
}
`;

// Добавление стилей в страницу
document.head.append(style);

// Создание кнопок
const ButtonCLadm = buttonConfig("ЖБ на игроков", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1082/');
const ButtonCLlead = buttonConfig("Тех 23", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-moscow.1052/');
const ButtonCLpl = buttonConfig("ЖБ  на техов", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9623-moscow.1204/');
const ButtonLeadThread = buttonConfig("тех 80", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-novgorod.3535/');

// Добавление кнопок на страницу
bgButtons.append(ButtonCLadm);
bgButtons.append(ButtonCLlead);
bgButtons.append(ButtonCLpl);
bgButtons.append(ButtonLeadThread);