// ==UserScript==
// @name         Быстрый доступ | Для VOLGOGRAD
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Быстрый доступ для BR
// @author       тест
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504301/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/504301/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20VOLGOGRAD.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
 
    const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonWarningP = document.createElement("button");
    const ButtonNakaz = document.createElement("button");
    const ButtonSdelka = document.createElement("button");
    const ButtonObj = document.createElement("button");
    const ButtonLd = document.createElement("button");
    const ButtonAp = document.createElement("button");
    const Buttonvost = document.createElement("button");

    
    ButtonRep.textContent = "Админ раздел";
    ButtonWarning.textContent = "Обжалования";
    ButtonWarningP.textContent = "Жб на игроков";
    ButtonNakaz.textContent = "Жб на лидеров";
    ButtonSdelka.textContent = "Жб на администрацию";
    ButtonObj.textContent = "Заявки на АП";
    ButtonLd.textContent = "Заявки на ЛД";
    Buttonvost.textContent = "Восстановление";

    
 
    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonNakaz);
    bgButtons.append(ButtonSdelka);
    bgButtons.append(ButtonObj);
    bgButtons.append(ButtonLd);
    bgButtons.append(Buttonvost);
    
 
    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#b4b5b8"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "1px solid #4a4b4d"
 
    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#b4b5b8"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"
 
    ButtonWarningP.style.margin = "10px";
    ButtonWarningP.style.background = "#b4b5b8"
    ButtonWarningP.style.borderRadius = "15px"
    ButtonWarningP.style.boreder = "2px solid #4a4b4d"
    
    ButtonNakaz.style.margin = "10px";
    ButtonNakaz.style.background = "#b4b5b8"
    ButtonNakaz.style.borderRadius = "15px"
    ButtonNakaz.style.boreder = "2px solid #4a4b4d"
    
    ButtonSdelka.style.margin = "10px";
    ButtonSdelka.style.background = "#b4b5b8"
    ButtonSdelka.style.borderRadius = "15px"
    ButtonSdelka.style.boreder = "2px solid #4a4b4d"
    
    ButtonObj.style.margin = "10px";
    ButtonObj.style.background = "#b4b5b8"
    ButtonObj.style.borderRadius = "15px"
    ButtonObj.style.boreder = "2px solid #4a4b4d"
    
    ButtonLd.style.margin = "10px";
    ButtonLd.style.background = "#b4b5b8"
    ButtonLd.style.borderRadius = "15px"
    ButtonLd.style.boreder = "2px solid #4a4b4d"

        Buttonvost.style.margin = "10px";
    Buttonvost.style.background = "#b4b5b8"
    Buttonvost.style.borderRadius = "15px"
    Buttonvost.style.boreder = "2px solid #4a4b4d"
    
    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1760/';
    };
 
    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1787/";
    };
 
    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1786/";
    };
    
    function BNakaz() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1785/?prefix_id=14";
    };
    
    function BSdelka() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1784/?prefix_id=14";
    };
    
    function BObj() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3077/";
    };
    
    function BLd() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3078/";
    };
        function Bvost() {
        window.location.href = "https://forum.blackrussia.online/forums/Восстановление-на-пост-администратора.491/";
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
    
    ButtonObj.addEventListener("click", () => {
        BObj();
        ButtonObj.style.background = "#fff"
    });
    
    ButtonLd.addEventListener("click", () => {
        BLd();
        ButtonLd.style.background = "#fff"
    });
        Buttonvost.addEventListener("click", () => {
        Bvost();
        Buttonvost.style.background = "#fff"
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
    countElement1.style.fontFamily = 'Georgy';
    countElement1.style.fontSize = '20px';
    countElement1.style.color = 'Cherry';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement1);

    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix2'
    var countElement2 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement2.className = 'count-element';
    // Записываем количество в новый элемент
    countElement2.textContent = 'Темы на рассмотрении: ' + count2;
    // Применяем стили к новому элементу
    countElement2.style.fontFamily = 'Georgy';
    countElement2.style.fontSize = '20px';
    countElement2.style.color = 'Cherry';

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