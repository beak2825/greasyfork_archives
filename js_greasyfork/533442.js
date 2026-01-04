// ==UserScript==
// @name         RED | Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      0.0.2
// @description  Для определенного круга лиц
// @author       J Kingsman
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/533442/RED%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/533442/RED%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
// ==/UserScript==
 
  const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style = "border-radius: 13";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
  window.location.href = href;
  });
  return button;
  };
 
  const Button51 = buttonConfig("Тех. раздел 01", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-red.226/');
  const Button52 = buttonConfig("Тех. раздел 74", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-bratsk.3324/');
  const Button53 = buttonConfig("Жб на техов 01", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%961-red.1182/');
  const Button54 = buttonConfig("Жб на игроков 01", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.88/');

  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);