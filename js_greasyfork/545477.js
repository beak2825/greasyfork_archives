// ==UserScript==
// @name         Быстрый доступ к разделам
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  для руководства KALUGA
// @author       Константин Неоспоримый
// @match        https://forum.blackrussia.online/*
// @icon         https://i.postimg.cc/sgHhyBLR/da471d9caf96b924ce425fc5e7efe71c.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545477/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%D0%BA%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/545477/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%D0%BA%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B0%D0%BC.meta.js
// ==/UserScript==


(function() {
    'use strict';


    const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonWarningP = document.createElement("button");
    const ButtonServer = document.createElement("button");
    const ButtonNorma = document.createElement("button");
    const ButtonObj = document.createElement("button");
    const ButtonLd = document.createElement("button");
    const ButtonAp = document.createElement("button");
    
    ButtonRep.textContent = "Админ раздел";
    ButtonWarning.textContent = "Жб на адм";
    ButtonWarningP.textContent = "Жб на игроков";
    ButtonServer.textContent = "Сервер KALUGA";
    ButtonNorma.textContent = "Норма";
    ButtonObj.textContent = "Обжалования";
    ButtonLd.textContent = "Заявки на ЛД";
    ButtonAp.textContent = "Заявки на АП";

    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonServer);
    bgButtons.append(ButtonNorma);
    bgButtons.append(ButtonObj);
    bgButtons.append(ButtonLd);
    bgButtons.append(ButtonAp);

    ButtonRep.style.marginLeft = "5px";
    ButtonRep.style.background = "#C0C0C0"
    ButtonRep.style.borderRadius = "30px"
    ButtonRep.style.boreder = "1px solid #4a4b4d"

    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#C0C0C0"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"

    ButtonWarningP.style.margin = "10px";
    ButtonWarningP.style.background = "#C0C0C0"
    ButtonWarningP.style.borderRadius = "15px"
    ButtonWarningP.style.boreder = "2px solid #4a4b4d"
    
    ButtonServer.style.margin = "10px";
    ButtonServer.style.background = "#C0C0C0"
    ButtonServer.style.borderRadius = "15px"
    ButtonServer.style.boreder = "2px solid #4a4b4d"
    
    ButtonNorma.style.margin = "10px";
    ButtonNorma.style.background = "#C0C0C0"
    ButtonNorma.style.borderRadius = "15px"
    ButtonNorma.style.boreder = "2px solid #4a4b4d"
    
    ButtonObj.style.margin = "10px";
    ButtonObj.style.background = "#C0C0C0"
    ButtonObj.style.borderRadius = "15px"
    ButtonObj.style.boreder = "2px solid #4a4b4d"
    
    ButtonLd.style.margin = "10px";
    ButtonLd.style.background = "#C0C0C0"
    ButtonLd.style.borderRadius = "15px"
    ButtonLd.style.boreder = "2px solid #4a4b4d"
    
    ButtonAp.style.margin = "10px";
    ButtonAp.style.background = "#C0C0C0"
    ButtonAp.style.borderRadius = "15px"
    ButtonAp.style.boreder = "2px solid #4a4b4d"

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.3501/';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3517/";
    };

    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3519/";
    };
    
    function BServer() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9679-kaluga.3500/";
    };
    
    function BNorma() {
        window.location.href = "https://forum.blackrussia.online/threads/kaluga-%D0%95%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B0%D1%8F-%D0%BE%D1%82%D1%87%D1%91%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.9821273/";
    };
    
    function BObj() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3520/";
    };
    
    function BLd() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3532/";
    };
    
    function BAp() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3531/";
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
    
    ButtonServer.addEventListener("click", () => {
        BServer();
        ButtonServer.style.background = "#fff"
    });
    
    ButtonNorma.addEventListener("click", () => {
        BNorma();
        ButtonNorma.style.background = "#fff"
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