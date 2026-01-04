// ==UserScript==
// @name         Быстрый доступ | Для Азааааааамата
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Быстрый доступ для BR
// @author       Azamat_Mascherano
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522413/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%90%D0%B7%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%BC%D0%B0%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522413/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%90%D0%B7%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%B0%D0%BC%D0%B0%D1%82%D0%B0.meta.js
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
    
    ButtonRep.textContent = "Tech";
    ButtonWarning.textContent = "Жалоба на тех спецов";
    ButtonWarningP.textContent = "UFA 25";
    ButtonNakaz.textContent = "Жалоба на тех спец 25";
    ButtonSdelka.textContent = "Сервер UFA";
    ButtonObj.textContent = "Жалоба на игроков";
    ButtonLd.textContent = "Форумник";
    ButtonAp.textContent = "База знаний";

    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonNakaz);
    bgButtons.append(ButtonSdelka);
    bgButtons.append(ButtonObj);
    bgButtons.append(ButtonLd);
    bgButtons.append(ButtonAp);

    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#8808080"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "3px solid #4a4b4d"

    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#808080"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"

    ButtonWarningP.style.margin = "10px";
    ButtonWarningP.style.background = "#808080"
    ButtonWarningP.style.borderRadius = "15px"
    ButtonWarningP.style.boreder = "2px solid #4a4b4d"
    
    ButtonNakaz.style.margin = "10px";
    ButtonNakaz.style.background = "#808080"
    ButtonNakaz.style.borderRadius = "15px"
    ButtonNakaz.style.boreder = "2px solid #4a4b4d"
    
    ButtonSdelka.style.margin = "10px";
    ButtonSdelka.style.background = "#808080"
    ButtonSdelka.style.borderRadius = "15px"
    ButtonSdelka.style.boreder = "2px solid #4a4b4d"
    
    ButtonObj.style.margin = "10px";
    ButtonObj.style.background = "#808080"
    ButtonObj.style.borderRadius = "15px"
    ButtonObj.style.boreder = "2px solid #4a4b4d"
    
    ButtonLd.style.margin = "10px";
    ButtonLd.style.background = "#808080"
    ButtonLd.style.borderRadius = "15px"
    ButtonLd.style.boreder = "2px solid #4a4b4d"
    
    ButtonAp.style.margin = "10px";
    ButtonAp.style.background = "#808080"
    ButtonAp.style.borderRadius = "15px"
    ButtonAp.style.boreder = "2px solid #4a4b4d"

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/";
    };

    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ufa.1138/";
    };
    
    function BNakaz() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9625-ufa.1206/";
    };
    
    function BSdelka() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9625-ufa.1140/";
    };
    
    function BObj() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/";
    };
    
    function BLd() {
        window.location.href = "https://forum.blackrussia.online/members/desant_deceased.592963/";
    };
    
    function BAp() {
        window.location.href = "https://vk.com/br_spec";
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
    
    ButtonAp.addEventListener("click", () => {
        BAp();
        ButtonAp.style.background = "#fff"
    });


// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
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
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
})();