// ==UserScript==
// @name         Кнопки переходники на форум
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Для определенного круга лиц
// @author       Shyne Zazik | ЗКТС 71-75
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Даня enemy много болтает чета
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/536419/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/536419/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
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



const Button54 = buttonConfig("ЖБ ТЕХ", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9674-bratsk.3323/');
const ButtonTech54 = buttonConfig("ТЕХ РАЗДЕЛ", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-bratsk.3324/');
const ButtonComp54 = buttonConfig("ЖБ ИГРОКИ", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3344/');
const ButtonComp533 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/")



bgButtons.append(Button54);
bgButtons.append(ButtonTech54);
bgButtons.append(ButtonComp54);
bgButtons.append(ButtonComp533);

