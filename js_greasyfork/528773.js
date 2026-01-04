// ==UserScript==
// @name         Кнопки переходники на форум
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Для 41-45
// @author       Kalibr Stoyn
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator крутыш. 
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/528773/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/528773/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
// ==/UserScript==

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

const Button51 = buttonConfig("Игроки  41", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1870/');
const Button52 = buttonConfig("Игроки 42", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1912/');
const Button53 = buttonConfig("Игроки 43", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1954/');
const Button54 = buttonConfig("Игроки 44", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1996/');
const Button55 = buttonConfig("Игроки 45", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2038/');
const ButtonTech51 = buttonConfig("Жб 41", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9641-belgorod.1841/');
const ButtonTech52 = buttonConfig("Жб 42", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9642-makhachkala.1883/');
const ButtonTech53 = buttonConfig("Жб 43", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9643-vladikavkaz.1925/');
const ButtonTech54 = buttonConfig("Жб 44", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9644-vladivostok.1967/');
const ButtonTech55 = buttonConfig("Жб 45", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9645-kaliningrad.2009/');
const ButtonComp51 = buttonConfig("Тех 41", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-belgorod.1842/');
const ButtonComp52 = buttonConfig("Тех 42", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-makhachkala.1884/');
const ButtonComp53 = buttonConfig("Тех 43", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-vladikavkaz.1926/');
const ButtonComp54 = buttonConfig("Тех 44", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-vladivostok.1968/');
const ButtonComp55 = buttonConfig("Тех 45", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kaliningrad.2010/');
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

