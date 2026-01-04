// ==UserScript==
// @name         71/Ulyanovsk||Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      1.0.0
// @description  Для определенного круга лиц
// @author       M.Tuchev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon         https://sun36-1.userapi.com/s/v1/ig2/ABc_7mzhNjiaghbppbYEVJQjJBxscTOh6w6Ww5EWUWeLvq9fk6ccFZC_CPXy50VrZDpXknFsKtoYfH78gPTnKta7.jpg?quality=96&crop=0,0,200,200&as=32x32,48x48,72x72,108x108,160x160&ava=1&u=olvt8TqNDAXL6j4AowpsGaoo6-Nw8skWyxdJTjHW7JE&cs=80x80
// @downloadURL https://update.greasyfork.org/scripts/538860/71Ulyanovsk%7C%7C%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/538860/71Ulyanovsk%7C%7C%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
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

  const Button50 = buttonConfig("71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3004/');
  const Button51 = buttonConfig("Тех. раздел 71", 'https://forum.blackrussia.online/forums/Технический-раздел-ulyanovsk.3003/');
  const Button52 = buttonConfig("Жб на техов 71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3002/');
  const Button53 = buttonConfig("Жб 71", 'https://forum.blackrussia.online/forums/Жалобы.3020/');
  const Button54 = buttonConfig("Заявки 71", 'https://forum.blackrussia.online/forums/Сервер-№71-ulyanovsk.3231/');
  const Button55 = buttonConfig("BIO 71", 'https://forum.blackrussia.online/forums/РП-биографии.3026/');
  const Button56 = buttonConfig("ADMINS 71", 'https://forum.blackrussia.online/forums/Админ-раздел.3005/');
  const Button57 = buttonConfig("Курилка", 'https://forum.blackrussia.online/forums/Курилка.15/');


  bgButtons.append(Button50);
  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);
  bgButtons.append(Button56);
  bgButtons.append(Button57);