// ==UserScript==
// @name         Технические Чоколадки
// @namespace    https://forum.blackrussia.online/
// @version      1.2
// @description  el scripto для Павляшика
// @author       Gambito_Kalashnikov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/516698/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A7%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/516698/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A7%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8.meta.js
// ==/UserScript==
 
const Button51 = buttonConfig("Игроки 41", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.1870/');
const Button52 = buttonConfig("Игроки 42", "https://forum.blackrussia.online/forums/Жалобы-на-игроков.1912/");
const Button53 = buttonConfig("Игроки 43", "https://forum.blackrussia.online/forums/Жалобы-на-игроков.1954/");
const Button54 = buttonConfig("Игроки 44", "https://forum.blackrussia.online/forums/Жалобы-на-игроков.1996/");
const Button55 = buttonConfig("Игроки 45", "https://forum.blackrussia.online/forums/Жалобы-на-игроков.2038/")
const ButtonTech51 = buttonConfig("Тех 41", "https://forum.blackrussia.online/forums/Технический-раздел-belgorod.1842/")
const ButtonTech52 = buttonConfig("Тех 42", "https://forum.blackrussia.online/forums/Технический-раздел-makhachkala.1884/")
const ButtonTech53 = buttonConfig("Тех 43", "https://forum.blackrussia.online/forums/Технический-раздел-vladikavkaz.1926/")
const ButtonTech54 = buttonConfig("Тех 44", "https://forum.blackrussia.online/forums/Технический-раздел-vladivostok.1968/")
const ButtonTech55 = buttonConfig("Тех 45", "https://forum.blackrussia.online/forums/Технический-раздел-kaliningrad.2010/")
const ButtonComp51 = buttonConfig("Жб 41", "https://forum.blackrussia.online/forums/Сервер-№41-belgorod.1841/")
const ButtonComp52 = buttonConfig("Жб 42", "https://forum.blackrussia.online/forums/Сервер-№42-makhachkala.1883/")
const ButtonComp53 = buttonConfig("Жб 43", "https://forum.blackrussia.online/forums/Сервер-№43-vladikavkaz.1925/")
const ButtonComp54 = buttonConfig("Жб 44", "https://forum.blackrussia.online/forums/Сервер-№44-vladivostok.1967/")
const ButtonComp55 = buttonConfig("Жб 45", "https://forum.blackrussia.online/forums/Сервер-№45-kaliningrad.2009/")
const ButtonComp533 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/")
 
bgButtons.append(Button51);
bgButtons.append(Button52);
bgButtons.append(Button53);
bgButtons.append(Button54);
bgButtons.append(Button55);
bgButtons.append(ButtonTech51);
bgButtons.append(ButtonTech52);
bgButtons.append(ButtonTech53);
bgButtons.append(ButtonTech54);
bgButtons.append(ButtonTech55);
bgButtons.append(ButtonComp51);
bgButtons.append(ButtonComp52);
bgButtons.append(ButtonComp53);
bgButtons.append(ButtonComp54);
bgButtons.append(ButtonComp55);
bgButtons.append(ButtonComp533);

