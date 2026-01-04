// ==UserScript==
// @name        Откат "мессенджера" до сообщений в ВКонтакте
// @namespace   Violentmonkey Scripts
// @match       https://vk.com
// @grant       none
// @version     1.1
// @author      Groove Addiction
// @description Данный скрипт откатывает недавнее обновление "мессенджера" до сообщений в ВКонтакте путем заменой заголовка и текста в меню + бонусом заменяет "сообщества" на группы.
// @downloadURL https://update.greasyfork.org/scripts/412349/%D0%9E%D1%82%D0%BA%D0%B0%D1%82%20%22%D0%BC%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%22%20%D0%B4%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/412349/%D0%9E%D1%82%D0%BA%D0%B0%D1%82%20%22%D0%BC%D0%B5%D1%81%D1%81%D0%B5%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%22%20%D0%B4%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.meta.js
// ==/UserScript==



if (window.location.href == "https://vk.com/im")  {


document.title = 'Сообщения';

  
}

document.getElementById("l_msg").innerHTML = document.getElementById("l_msg").innerHTML.replace(/Мессенджер/g,'Сообщения')
document.getElementById("l_gr").innerHTML = document.getElementById("l_gr").innerHTML.replace(/Сообщества/g,'Группы')