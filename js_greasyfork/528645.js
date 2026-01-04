// ==UserScript==
// @name VLADIMIR | Кнопки переходники для ГС/ЗГС ГОСС
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Для определенного круга лиц
// @author       Denny Archer
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Даня enemy много болтает чета
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/528645/VLADIMIR%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528645/VLADIMIR%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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

@keyframes gradient {
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
const ButtonCLadm = buttonConfig("ЖБ-АДМ", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/');
const ButtonCLlead = buttonConfig("ЖБ-ЛД", 'https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/');
const ButtonCLpl = buttonConfig("ЖБ-PL", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/');
const ButtonLeadThread = buttonConfig("Р-ЛД", 'https://forum.blackrussia.online/forums/Раздел-государственных-организаций.3490/');
const ButtonWeekThread = buttonConfig("Р-ЕЖЕНЕД", 'https://forum.blackrussia.online/forums/Отчетность-лидеров-фракций.3492/');
const ButtonAppThread = buttonConfig("ЗАЯВКИ", 'https://forum.blackrussia.online/forums/Лидеры.3497/');
const ButtonAdminThread = buttonConfig("А-78", 'https://forum.blackrussia.online/forums/Админ-раздел.3466/');
const ButtonVladimirThread = buttonConfig("Р-78", 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3465/');
const ButtonRulesProject = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

// Добавление кнопок на страницу
bgButtons.append(ButtonCLadm);
bgButtons.append(ButtonCLlead);
bgButtons.append(ButtonCLpl);
bgButtons.append(ButtonLeadThread);
bgButtons.append(ButtonWeekThread);
bgButtons.append(ButtonAppThread);
bgButtons.append(ButtonAdminThread);
bgButtons.append(ButtonVladimirThread);
bgButtons.append(ButtonRulesProject);