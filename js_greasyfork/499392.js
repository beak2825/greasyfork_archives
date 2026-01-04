// ==UserScript==
// @name         Быстрый доступ | Для ANAPA milton
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Быстрый доступ для BR
// @author      Milton
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499392/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20ANAPA%20milton.user.js
// @updateURL https://update.greasyfork.org/scripts/499392/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20ANAPA%20milton.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
 
    const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonWarningP = document.createElement("button");
    const ButtonNakaz = document.createElement("button");
    const ButtonSdelka = document.createElement("button");
    const ButtonBio = document.createElement("button");


    ButtonRep.textContent = "Раздел Анапы";
    ButtonWarning.textContent = "Жб на адм";
    ButtonWarningP.textContent = "Жб на игроков";
    ButtonNakaz.textContent = "Раздел";
    ButtonSdelka.textContent = "Заявки";
    ButtonBio.textContent = "Форумник";

 
    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonNakaz);
    bgButtons.append(ButtonSdelka);
    bgButtons.append(ButtonBio);

    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#bdbdbd"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "1px solid #4a4b4d"
 
    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#bdbdbd"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"
 
    ButtonWarningP.style.margin = "10px";
    ButtonWarningP.style.background = "#bdbdbd"
    ButtonWarningP.style.borderRadius = "15px"
    ButtonWarningP.style.boreder = "2px solid #4a4b4d"
    
    ButtonNakaz.style.margin = "10px";
    ButtonNakaz.style.background = "#bdbdbd"
    ButtonNakaz.style.borderRadius = "15px"
    ButtonNakaz.style.boreder = "2px solid #4a4b4d"
    
    ButtonSdelka.style.margin = "10px";
    ButtonSdelka.style.background = "#bdbdbd"
    ButtonSdelka.style.borderRadius = "15px"
    ButtonSdelka.style.boreder = "2px solid #4a4b4d"

    ButtonBio.style.margin = "10px";
    ButtonBio.style.background = "#bdbdbd"
    ButtonBio.style.borderRadius = "15px"
    ButtonBio.style.boreder = "2px solid #4a4b4d"
    
  
    
  
    
    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/Сервер-№30-anapa.1375/';
    };
 
    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1400/";
    };
 
    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-игроков.1402/";
    };
    
    function BNakaz() {
        window.location.href = "https://forum.blackrussia.online/forums/Раздел-для-агентов-поддержки.1384/";
    };
    
    function BSdelka() {
        window.location.href = "https://forum.blackrussia.online/forums/Агенты-поддержки.3268/";
    };
    function BBio() {
        window.location.href = "https://forum.blackrussia.online/members/%F0%9D%94%B8%F0%9D%95%9D%F0%9D%95%96%F0%9D%95%A9%F0%9D%95%92%F0%9D%95%9F%F0%9D%95%95%F0%9D%95%A3-%F0%9D%95%84%F0%9D%95%9A%F0%9D%95%9D%F0%9D%95%A5%F0%9D%95%A0%F0%9D%95%9F-%E2%99%A1.1059393/";
    };
 
    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#fff"
    });
 
    ButtonWarning.addEventListener("click", () => {
        BWarning();
        ButtonWarning.style.background = "#fff"
    });
 
    ButtonWarningP.addEventListener("click", () => {
        BWarningP();
        ButtonWarningP.style.background = "#fff"
    });
    
    ButtonNakaz.addEventListener("click", () => {
        BNakaz();
        ButtonNakaz.style.background = "#fff"
    });
    
    ButtonSdelka.addEventListener("click", () => {
        BSdelka();
        ButtonSdelka.style.background = "#fff"
    });

    ButtonBio.addEventListener("click", () => {
        BBio();
        ButtonBio.style.background = "#fff"
    });

    ButtonObj.addEventListener("click", () => {
        BObj();
        ButtonObj.style.background = "#fff"
    });
    
    ButtonLd.addEventListener("click", () => {
        BLd();
        ButtonLd.style.background = "#fff"
    });
    ButtonRAp.addEventListener("click", () => {
        BRAp();
        ButtonRAp.style.background = "#fff"
    });
   // Функция для подсчета элементов с классами 'structItem structItem--thread is-prefix14' и 'structItem structItem--thread is-prefix2'
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix14'
    var countElement1 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement1.className = 'count-element';
    // Записываем количество в новый элемент
    countElement1.textContent = 'Темы в ожидании: ' + count1;
    // Применяем стили к новому элементу
    countElement1.style.fontFamily = 'Arial';
    countElement1.style.fontSize = '16px';
    countElement1.style.color = '#0fbfff';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement1);

    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix2'
    var countElement2 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement2.className = 'count-element';
    // Записываем количество в новый элемент
    countElement2.textContent = 'Темы на рассмотрении: ' + count2;
    // Применяем стили к новому элементу
    countElement2.style.fontFamily = 'Arial';
    countElement2.style.fontSize = '16px';
    countElement2.style.color = '#ff2400';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement2);
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
})();