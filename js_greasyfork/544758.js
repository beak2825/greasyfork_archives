// ==UserScript==
// @name         11-15 | Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      0.0.2
// @description  йоу
// @author       Soul Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544758/11-15%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/544758/11-15%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
// ==/UserScript==

    const bgButtons = document.querySelector(".pageContent");
    const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.style = "color: #E6E6FA; background-color: rgba(28, 28, 28, 0); border-color: #E6E6FA; border-radius: 13px";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("click", () => {
    window.location.href = href;
    });
    return button;
    };

    const Button1 = buttonConfig("Тех 11", 'https://forum.blackrussia.online/forums/Технический-раздел-indigo.493/');
    const Button2 = buttonConfig("Тех 12", 'https://forum.blackrussia.online/forums/Технический-раздел-white.554/');
    const Button3 = buttonConfig("Тех 13", 'https://forum.blackrussia.online/forums/Технический-раздел-magenta.613/');
    const Button4 = buttonConfig("Тех 14", 'https://forum.blackrussia.online/forums/Технический-раздел-crimson.653/');
    const Button5 = buttonConfig("Тех 15", 'https://forum.blackrussia.online/forums/Технический-раздел-gold.660/');
    const Button6 = buttonConfig("Жб 11", 'https://forum.blackrussia.online/forums/Сервер-№11-indigo.1192/');
    const Button7 = buttonConfig("Жб 12", 'https://forum.blackrussia.online/forums/Технический-раздел-white.554/');
    const Button8 = buttonConfig("Жб 13", 'https://forum.blackrussia.online/forums/Сервер-№13-magenta.1194/');
    const Button9 = buttonConfig("Жб 14", 'https://forum.blackrussia.online/forums/Сервер-№14-crimson.1195/');
    const Button10 = buttonConfig("Жб 15", 'https://forum.blackrussia.online/forums/Технический-раздел-gold.660/');
    const Button11 = buttonConfig("Игр 11", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.519/');
    const Button12 = buttonConfig("Игр 12", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.560/');
    const Button13 = buttonConfig("Игр 13", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.599/');
    const Button14 = buttonConfig("Игр 14", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.640/');
    const Button15 = buttonConfig("Игр 15", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.682/');

 
    bgButtons.append(Button1);
    bgButtons.append(Button2);
    bgButtons.append(Button3);
    bgButtons.append(Button4);
    bgButtons.append(Button5);
    bgButtons.append(Button6);
    bgButtons.append(Button7);
    bgButtons.append(Button8);
    bgButtons.append(Button9);
    bgButtons.append(Button10);
    bgButtons.append(Button11);
    bgButtons.append(Button12);
    bgButtons.append(Button13);
    bgButtons.append(Button14);
    bgButtons.append(Button15);
    