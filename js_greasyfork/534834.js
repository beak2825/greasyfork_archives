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
// @downloadURL https://update.greasyfork.org/scripts/534834/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/534834/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
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


const Button51 = buttonConfig("L 71", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9671-ulyanovsk.3002/');
const Button52 = buttonConfig("L 72", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9672-yakutsk.3034/');
const Button53 = buttonConfig("L 73", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9673-tambov.3288/');
const Button54 = buttonConfig("L 74", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9674-bratsk.3323/');
const Button55 = buttonConfig("L 75", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9675-astrakhan.3358/');
const ButtonTech51 = buttonConfig("F 71", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ulyanovsk.3003/');
const ButtonTech52 = buttonConfig("F 72", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-yakutsk.3035/');
const ButtonTech53 = buttonConfig("F 73", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tambov.3289/');
const ButtonTech54 = buttonConfig("F 74", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-bratsk.3324/');
const ButtonTech55 = buttonConfig("F 75", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-astrakhan.3359/');
const ButtonComp51 = buttonConfig("И 71", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3023/');
const ButtonComp52 = buttonConfig("И 72", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3055/');
const ButtonComp53 = buttonConfig("И 73", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3309/');
const ButtonComp54 = buttonConfig("И 74", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3344/');
const ButtonComp55 = buttonConfig("И 75", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3379/');
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

