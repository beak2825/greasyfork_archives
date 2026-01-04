// ==UserScript==
// @name         Полный скрипт для кураторов форума | Для KHABAROVSK
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Быстрый доступ для BR
// @author       Orkni_Stalin
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513445/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20%D0%94%D0%BB%D1%8F%20KHABAROVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/513445/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20%D0%94%D0%BB%D1%8F%20KHABAROVSK.meta.js
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
    
    ButtonRep.textContent = "Отчетность КФ";
    ButtonWarning.textContent = "Рп БИО";
    ButtonWarningP.textContent = "Рп ситуации";
    ButtonNakaz.textContent = "Рп организации";
    ButtonSdelka.textContent = "Рп био на доработке";
    ButtonObj.textContent = "Рп ситуации на доработке";
    ButtonLd.textContent = "Рп организации на доработке";
    
 
    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonNakaz);
    bgButtons.append(ButtonSdelka);
    bgButtons.append(ButtonObj);
    bgButtons.append(ButtonLd);
    
 
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

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/threads/khabarovsk-%D0%95%D0%B6%D0%B5%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B0%D1%8F-%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C-%D0%9A%D0%A4.5724328/unread';
    };
 
    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.2186/";
    };
 
    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.2185/";
    };
    
    function BNakaz() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2183/";
    };
    
    function BSdelka() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%BD%D0%B0-%D0%B4%D0%BE%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B5.2212/";
    };
    
    function BObj() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8-%D0%BD%D0%B0-%D0%B4%D0%BE%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B5.2209/";
    };
    
    function BLd() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2183/";
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
    countElement1.textContent = 'ТЕМЫ НА ОЖИДАНИИ: ' + count1;
    // Применяем стили к новому элементу
    countElement1.style.fontFamily = 'Arial';
    countElement1.style.fontSize = '16px';
    countElement1.style.color = 'red';

    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', countElement1);

    // Создаем новый элемент для отображения количества элементов с классом 'structItem structItem--thread is-prefix2'
    var countElement2 = document.createElement('div');
    // Устанавливаем класс для нового элемента, чтобы стилизовать его
    countElement2.className = 'count-element';
    // Записываем количество в новый элемент
    countElement2.textContent = 'ТЕМЫ НА РАССМОТРЕНИИ: ' + count2;
    // Применяем стили к новому элементу
    countElement2.style.fontFamily = 'Arial';
    countElement2.style.fontSize = '16px';
    countElement2.style.color = 'red';

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
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [

    {
     title: '---------------------------------------------------------------RP Биографии---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата не подходит',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваш возраст не совпадает с датой рождения.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей биографии составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Мало информации',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к в ней мало информации.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'От 3-его лица',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Уже одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на англ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Нон рп ник',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата рождения не дописана',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Супергерой',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Ситуации---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Отказано',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на англ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей ситуации составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Не сюда',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Обратитесь в нужный вам раздел.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Организации---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Отказано',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}

function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
  user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
  },
  greeting: () =>
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
};
}

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();