// ==UserScript==
// @name         Кнопки переходники на форум
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
// @downloadURL https://update.greasyfork.org/scripts/502261/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/502261/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
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


const Button51 = buttonConfig("Название раздела", 'Ссылка на раздел');
const Button52 = buttonConfig("Название раздела", 'Ссылка на раздел');
const Button53 = buttonConfig("Название раздела", 'Ссылка на раздел');
const Button54 = buttonConfig("Название раздела", 'Ссылка на раздел');
const Button55 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonTech51 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonTech52 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonTech53 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonTech54 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonTech55 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonComp51 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonComp52 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonComp53 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonComp54 = buttonConfig("Название раздела", 'Ссылка на раздел');
const ButtonComp55 = buttonConfig("Название раздела", 'Ссылка на раздел');
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

