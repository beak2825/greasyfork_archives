// ==UserScript==
// @name         44, 56 | Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      0.0.1
// @description  Для определенного круга лиц
// @author       J Kingsman
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://i.dailymail.co.uk/1s/2021/12/07/18/26397236-10285081-ANSWER_BLOOD_DIAMOND_This_2006_political_war_thriller_raked_in_a-a-68_1638900061648.jpg
// @downloadURL https://update.greasyfork.org/scripts/533443/44%2C%2056%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/533443/44%2C%2056%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
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
 
  const Button51 = buttonConfig("Тех. раздел 44", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-vladivostok.1968/');
  const Button52 = buttonConfig("Тех. раздел 56", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-arkhangelsk.2472/');
  
  bgButtons.append(Button51);
  bgButtons.append(Button52);