// ==UserScript==
// @name         auto-problem
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  AutoCreate problem in Dostavista
// @author       CleverMan
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/*
// @match        *://dispatcher.dostavista.ru/dispatcher/orders/problems/*
// @icon         https://www.google.com/s2/favicons?domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429577/auto-problem.user.js
// @updateURL https://update.greasyfork.org/scripts/429577/auto-problem.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url_problem = document.URL;

    var substring_url = "dispatcher.dostavista.ru/dispatcher/orders/problems";
    var result_url = url_problem.includes(substring_url);

    if (result_url == true) {

        var courier = document.querySelector('.courier-block');

        var courier_block = courier.getElementsByTagName('div')[0];
        var courier_id = courier_block.getElementsByTagName('a')[0].href;
        courier_id = +/\d+/.exec(courier_id);

        localStorage.setItem('courier_id', courier_id);

        var toolbarSection = document.querySelector('.toolbar');

        var add_btn = toolbarSection.getElementsByTagName('a')[0];
        add_btn.classList.add('toolbar_button_add');

        var auto = document.createElement('a');
        auto.innerHTML = 'Стандартный (авто)';
        auto.classList.add('toolbar_button', 'btn_auto');

        var control = document.createElement('a');
        control.innerHTML = 'Контроль';
        control.classList.add('toolbar_button', 'btn_сontrol');

        var not_started = document.createElement('a');
        not_started.innerHTML = 'Не выехал';
        not_started.classList.add('toolbar_button', 'btn_not_started');

        var forgot = document.createElement('a');
        forgot.innerHTML = 'Забыл';
        forgot.classList.add('toolbar_button', 'btn_forgot');

        var lateness = document.createElement('a');
        lateness.innerHTML = 'Опоздание';
        lateness.classList.add('toolbar_button', 'btn_lateness');

        var waiting = document.createElement('a');
        waiting.innerHTML = 'Ожидание';
        waiting.classList.add('toolbar_button', 'btn_waiting');

        toolbarSection.appendChild(auto);
        toolbarSection.appendChild(control);
        toolbarSection.appendChild(not_started);
        toolbarSection.appendChild(forgot);
        toolbarSection.appendChild(lateness);
        toolbarSection.appendChild(waiting);

        var btn_auto = document.getElementsByClassName('btn_auto')[0];
        var btn_сontrol = document.getElementsByClassName('btn_сontrol')[0];
        var btn_not_started = document.getElementsByClassName('btn_not_started')[0];
        var btn_forgot = document.getElementsByClassName('btn_forgot')[0];
        var btn_lateness = document.getElementsByClassName('btn_lateness')[0];
        var btn_waiting = document.getElementsByClassName('btn_waiting')[0];

        btn_auto.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('auto');
            toolbar_add.click();
        });
        btn_сontrol.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('control');
            toolbar_add.click();
        });
        btn_not_started.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('not_started');
            toolbar_add.click();
        });
        btn_forgot.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('forgot');
            toolbar_add.click();
        });
        btn_lateness.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('lateness');
            toolbar_add.click();
        });
        btn_waiting.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            StationSwitch('waiting');
            toolbar_add.click();
        });
    }
    else if (result_url == false) {
        courier_id = parseInt(localStorage.getItem('courier_id'));
        var station = localStorage.getItem('station');
        if (station == 'auto') {
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            setTimeout(focusDescription, 200);
        }
        else if (station == 'control') {
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`option[value='${390}']`).setAttribute("selected", "selected");
            setTimeout(focusDescription, 200);
        }
        else if (station == 'not_started') {
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`option[value='${387}']`).setAttribute("selected", "selected");
            document.getElementById('comment').innerHTML = `пуш, не ответ \n//не ответ`;
        }
        else if (station == 'forgot') {
            document.querySelector(`#status_id > option[value='${10}']`).setAttribute("selected", "selected");
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`option[value='${400}']`).setAttribute("selected", "selected");
            document.getElementById('comment').innerHTML = 'Забыл';
        }
        else if (station == 'lateness') {
            document.querySelector(`#status_id > option[value='${11}']`).setAttribute("selected", "selected");
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`option[value='${402}']`).setAttribute("selected", "selected");
            document.getElementById('comment').innerHTML = 'По логам не опаздывает';
        }
        else if (station == 'waiting') {
            document.querySelector(`#status_id > option[value='${11}']`).setAttribute("selected", "selected");
            document.querySelector(`#causer_id-optgroup-courier > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            document.querySelector(`option[value='${405}']`).setAttribute("selected", "selected");
            setTimeout(focusDescription, 200);
        }
        localStorage.clear();
    }
    function StationSwitch (station) {
        localStorage.setItem('station', station);
    }
    function focusDescription () {
        document.getElementById('comment').focus();
    }

})();