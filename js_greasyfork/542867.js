// ==UserScript==
// @name         51-55 | Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      0.1
// @description  Для определенного круга лиц
// @author       Soul Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542867/51-55%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/542867/51-55%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
// ==/UserScript==

    const bgButtons = document.querySelector(".pageContent");
    const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.style = "color: #E6E6FA; background-color: #000000; border-color: #E6E6FA; border-radius: 13px";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("click", () => {
    window.location.href = href;
    });
    return button;
    };

    const Button1 = buttonConfig("Тех 51", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tula.2262/');
    const Button2 = buttonConfig("Тех 52", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ryazan.2304/');
    const Button3 = buttonConfig("Тех 53", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-murmansk.2346/');
    const Button4 = buttonConfig("Тех 54", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-penza.2388/');
    const Button5 = buttonConfig("Тех 55", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kursk.2430/');
    const Button6 = buttonConfig("Жб 51", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9651-tula.2261/');
    const Button7 = buttonConfig("Жб 52", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9652-ryazan.2303/');
    const Button8 = buttonConfig("Жб 53", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9653-murmansk.2345/');
    const Button9 = buttonConfig("Жб 54", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9654-penza.2387/');
    const Button10 = buttonConfig("Жб 55", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/');
    const Button11 = buttonConfig("Игр 51", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2290/');
    const Button12 = buttonConfig("Игр 52", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2332/');
    const Button13 = buttonConfig("Игр 53", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2374/');
    const Button14 = buttonConfig("Игр 54", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2416/');
    const Button15 = buttonConfig("Игр 55", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/');

 
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
    