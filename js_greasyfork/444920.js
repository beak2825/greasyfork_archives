// ==UserScript==
// @name         autoproblem
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Autocreate problem in panel
// @author       makeka
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @match        *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444920/autoproblem.user.js
// @updateURL https://update.greasyfork.org/scripts/444920/autoproblem.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var docurl = document.URL;
  var page = docurl.includes("dispatcher.dostavista.ru/dispatcher/orders/view/");
  var page_add = docurl.includes("dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id");
  if (page == true) {
    try {
      var zz = +/\d+/.exec(docurl);
    } catch (err) {
      zz = null
    }
    // ищем куда тыкнуть кнопку
    var toolbarSection = document.querySelector('.autocomplete');
    // кнопка на создание проблемы
    var super_style = document.createElement('style');
    super_style.innerHTML = '.autocomplete {min-width:450px;}.select_issues {padding:5px 10px;width:250px;}.btn_issues {background:#ddd; padding: 5px;display:inline-block;border-radius:5px;margin:4px 10px 5px 10px;text-decoration:none;color:#333 !important;}.btn_issues:hover{background:#e84118;color:#fff !important;}';
    toolbarSection.appendChild(super_style);
    var create_problem = document.createElement('select');
    create_problem.innerHTML = ''+
      '<option>Выберите тип проблемы</option>'+
      '<optgroup label="Dostavista (курьеры dostavista)">'+
      '<option value="17">Контроль/заказ на контроле</option>'+
      '<option value="18">Клиент отказался от оплаты ложного вызова</option>'+
      '<option value="19">Клиент отказался от оплаты заказа</option>'+
      '<option value="20">Клиент отказался от оплаты платного ожидания</option>'+
      '<option value="21">Курьер дезинформировал диспетчера</option>'+
      '<option value="22">Курьер не выполнил условия заказа</option>'+
      '<option value="23">Курьер закрыл адрес не посетив его</option>'+
      '</optgroup>'+
      '<optgroup label="Enterprise (курьеры-партнеры)">'+
      '<option value="1">Курьер снялся с заказа</option>'+
      '<option value="7">Курьер опоздал на адрес</option>'+
      '<option value="8">Курьер закрыл адрес не посетив его</option>'+
      '<option value="12">Клиент попросил отключить курьера от сервиса</option>'+
      '<option value="13">Жалоба на поведение/внешний вид курьера</option>'+
      '<option value="15">Курьер дезинформировал диспетчера</option>'+
      '<option value="16">Курьер пришел в магазин без термосумки</option>'+
      '<option value="14">Прочее</option>'+
      '</optgroup>'+
      '<optgroup label="Порча/утрата отправления">'+
      '<option value="9">Курьер повредил отправление</option>'+
      '<option value="10">Курьер утратил отправление</option>'+
      '<option value="11">Курьер пропал с отправлением</option>'+
      '<option value="24">Проверка на фрод</option>'+
      '<option value="25">Фрод (отметка на адресе)</option>'+
      '</optgroup>';
    create_problem.classList.add('toolbar_button', 'select_issues', 'select');
    toolbarSection.appendChild(create_problem);
    var btn_create_problem = document.getElementsByClassName('select_issues')[0];
    var select_issue = document.getElementsByClassName('select_issues')[0];
    btn_create_problem.addEventListener('click', function(event) {
      StationSwitch('create_problem');
    });
    var btn_create = document.createElement('a');
    btn_create.innerHTML = 'Создать проблему ';
    btn_create.setAttribute("href", "https://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id/" + zz + "/returl/%2Fdispatcher%2Forders%2Fproblems%2F" + zz);
    btn_create.classList.add('toolbar_button', 'btn_issues');
    toolbarSection.appendChild(btn_create);
    var add_btn_create = document.getElementsByClassName('select_issues')[0];
    add_btn_create.addEventListener('click', function(event) {
      try {
        var courier = document.querySelector('.courier-block');
        var courier_block = courier.getElementsByTagName('div')[0];
        var courier_id = courier_block.getElementsByTagName('a')[0].href;
        courier_id = +/\d+/.exec(courier_id);
      } catch (err) {
        courier_id = "null"
      }
      // сохраняем ID курьера для виновника
      localStorage.setItem('courier_id', courier_id);
      var issue_value = issue_value = document.getElementsByClassName('select_issues')[0].value;
      if (issue_value == "1") {
        StationSwitch('create_problem_leave_1');
      } else if (issue_value == "7") {
        StationSwitch('create_problem_gett_7');
      } else if (issue_value == "8") {
        StationSwitch('create_problem_gett_8');
      } else if (issue_value == "9") {
        StationSwitch('create_problem_ob_9');
      } else if (issue_value == "10") {
        StationSwitch('create_problem_ob_10');
      } else if (issue_value == "11") {
        StationSwitch('create_problem_ob_11');
      } else if (issue_value == "12") {
        StationSwitch('create_problem_sd_12');
      } else if (issue_value == "13") {
        StationSwitch('create_problem_sd_13');
      } else if (issue_value == "14") {
        StationSwitch('create_problem_gett_14');
      } else if (issue_value == "15") {
        StationSwitch('create_problem_sd_15');
      } else if (issue_value == "16") {
        StationSwitch('create_problem_gett_16');
      } else if (issue_value == "17") {
        StationSwitch('create_problem_dv_17');
      } else if (issue_value == "18") {
        StationSwitch('create_problem_dv_18');
      } else if (issue_value == "19") {
        StationSwitch('create_problem_dv_19');
      } else if (issue_value == "20") {
        StationSwitch('create_problem_dv_20');
      } else if (issue_value == "21") {
        StationSwitch('create_problem_sd_21');
      } else if (issue_value == "22") {
        StationSwitch('create_problem_dv_22');
      } else if (issue_value == "23") {
        StationSwitch('create_problem_dv_23');
      } else if (issue_value == "24") {
        StationSwitch('create_problem_ob_24');
      } else if (issue_value == "25") {
        StationSwitch('create_problem_dv_25');
      }
    });
    console.log("Старт")
  } else if (page_add == true) {
    console.log("Старт 2")
    let courier_id = parseInt(localStorage.getItem('courier_id')); // сохранили айдишник
    var station = localStorage.getItem('station');
    if (station.includes("create_problem") == true) {
      console.log("Старт 3")
      if (station.includes("create_problem_leave") == true || station.includes("create_problem_gett") == true) {
        document.querySelector(`#status_id > option[value='10`).setAttribute("selected", "selected");
      }
      // Типы проблем
      if (station.includes("create_problem_leave") == true) {
        document.querySelector(`#type_id > optgroup > option[value='${451}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_gett_7') {
        document.querySelector(`#type_id > optgroup > option[value='${454}']`).setAttribute("selected", "selected");
        document.getElementById('comment').innerHTML = `Курьер опоздал на заказ.`;
      }
      if (station == 'create_problem_gett_8') {
        document.querySelector(`#type_id > optgroup > option[value='${456}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_ob_9') {
        document.querySelector(`#type_id > optgroup > option[value='${229}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${1810087}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_ob_10') {
        document.querySelector(`#dispatcher_id > option[value='${1810087}']`).setAttribute("selected", "selected");
        document.querySelector(`#type_id >  optgroup > option[value='${243}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_ob_11') {
        document.querySelector(`#type_id >  optgroup > option[value='${259}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${1810087}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_sd_12') {
        document.querySelector(`#type_id >  optgroup > option[value='${461}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${3128292}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_sd_13') {
        document.querySelector(`#type_id >  optgroup > option[value='${455}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${3128292}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_sd_15') {
        document.querySelector(`#type_id >  optgroup > option[value='${463}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${3128292}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_gett_14') {
        document.querySelector(`#type_id >  optgroup > option[value='${460}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_gett_16') {
        document.querySelector(`#type_id >  optgroup > option[value='${464}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_17') {
        document.querySelector(`#type_id >  optgroup > option[value='${390}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_18') {
        document.querySelector(`#type_id >  optgroup > option[value='${334}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_19') {
        document.querySelector(`#type_id >  optgroup > option[value='${335}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_20') {
        document.querySelector(`#type_id >  optgroup > option[value='${336}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_sd_21') {
        document.querySelector(`#type_id >  optgroup > option[value='${301}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${3128292}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_22') {
        document.querySelector(`#type_id >  optgroup > option[value='${439}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_23') {
        document.querySelector(`#type_id >  optgroup > option[value='${385}']`).setAttribute("selected", "selected");
      }
      // Комментарии
      if (station == 'create_problem_leave_1') {
        document.getElementById('comment').innerHTML = `Курьер попросил снять его с заказа.`;
      }
      if (station.includes("create_problem_ob") == true) {
        document.getElementById('comment').innerHTML = ``;
      }
      if (station == 'create_problem_ob_24') {
        document.querySelector(`#type_id >  optgroup > option[value='${501}']`).setAttribute("selected", "selected");
        document.querySelector(`#dispatcher_id > option[value='${1810087}']`).setAttribute("selected", "selected");
      }
      if (station == 'create_problem_dv_25') {
        document.querySelector(`#status_id > option[value='10`).setAttribute("selected", "selected");
        document.getElementById('comment').innerHTML = `Курьер отметился на адресе, но не стал его закрывать.`;
        document.querySelector(`#type_id >  optgroup > option[value='${502}']`).setAttribute("selected", "selected");
      }
      try {
        console.log("Старт 4")
        document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
        document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
        if(station == 'create_problem_dv_19' || station == 'create_problem_dv_18' || station == 'create_problem_dv_20') {
          document.querySelector(`#causer_id-optgroup-client > option:first-child`).setAttribute("selected", "selected");
        }
      } catch (err) {
        console.log("Старт 5")
        return;
      }
      localStorage.clear();
    }
  }

  function StationSwitch(station) {
    localStorage.setItem('station', station);
  }
})();