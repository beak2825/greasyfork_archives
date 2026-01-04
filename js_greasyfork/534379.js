// ==UserScript==
// @name         Кнопки для Риназа 
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Для определенного круга лиц
// @author       -----
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Даня enemy много болтает чета
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/534379/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%B8%D0%BD%D0%B0%D0%B7%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/534379/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%B8%D0%BD%D0%B0%D0%B7%D0%B0.meta.js
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
 
 
const Button51 = buttonConfig("ОПС", 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/');
const Button52 = buttonConfig("Жб тех 41", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9641-belgorod.1841/');
const Button53 = buttonConfig("Тех 41", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-belgorod.1842/');
const Button54 = buttonConfig("Игроки 41", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1870/');


bgButtons.append(Button51);
bgButtons.append(Button52);
bgButtons.append(Button53);
bgButtons.append(Button54);
