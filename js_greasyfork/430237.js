// ==UserScript==
// @name         auto-points
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Auto-creating a problem with a false call
// @author       CleverMan
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/*
// @match        *://dispatcher.dostavista.ru/dispatcher/orders/problems/*
// @icon         https://www.google.com/s2/favicons?domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430237/auto-points.user.js
// @updateURL https://update.greasyfork.org/scripts/430237/auto-points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // getClipboardContents();
    var url_problem = document.URL;

    var substring_url = "dispatcher.dostavista.ru/dispatcher/orders/problems";
    var result_url = url_problem.includes(substring_url);

    var disp_assign = 2936414 //Box Problems

    if (result_url == true) {

        var copyText;
        var client;

        try {
            var courier = document.querySelector('.courier-block');
            var courier_block = courier.getElementsByTagName('div')[0];
            var courier_id = courier_block.getElementsByTagName('a')[0].href;
            var courier_name = courier_block.getElementsByTagName('a')[0].innerText;
            courier_id = +/\d+/.exec(courier_id);

        } catch(err) {
            courier_id = null
            courier_name = '"УКАЗАТЬ КУРЬЕРА"'
        }

        localStorage.setItem('courier_id', courier_id);
        localStorage.setItem('courier_name', courier_name);

        var toolbarSection = document.querySelector('.toolbar');
        var add_btn = toolbarSection.getElementsByTagName('a')[0];
        add_btn.classList.add('toolbar_button_add');

        var fifty_points = document.createElement('a');
        fifty_points.innerHTML = '50 Баллов';
        fifty_points.classList.add('toolbar_button', 'btn_fifty_points');

        var hundred_points = document.createElement('a');
        hundred_points.innerHTML = '100 Баллов';
        hundred_points.classList.add('toolbar_button', 'btn_hundred_points');

        toolbarSection.appendChild(fifty_points);
        toolbarSection.appendChild(hundred_points);

        var btn_fifty_points = document.getElementsByClassName('btn_fifty_points')[0];
        var btn_hundred_points = document.getElementsByClassName('btn_hundred_points')[0];

        btn_fifty_points.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            // getClipboardContents();
            StationSwitch('fifty_points');
            toolbar_add.click();
        });
        btn_hundred_points.addEventListener('click', function (event) {
            var toolbar_add = document.getElementsByClassName("toolbar_button_add")[0];
            // getClipboardContents();
            StationSwitch('hundred_points');
            toolbar_add.click();
        });
    }
    else if (result_url == false) {
        // copyText = localStorage.getItem('copyText');
        courier_id = parseInt(localStorage.getItem('courier_id'));
        courier_name = localStorage.getItem('courier_name');


        var station = localStorage.getItem('station');
        if (station == 'fifty_points' || station == 'hundred_points'){
            document.querySelector(`#dispatcher_id > option[value='${disp_assign}']`).setAttribute("selected", "selected");
            document.querySelector(`#causer_id-optgroup-client > option`).setAttribute("selected", "selected");
            try {
                document.querySelector(`#courier_id > option[value='${courier_id}']`).setAttribute("selected", "selected");
            } catch(err) {
                document.querySelector(`#courier_id > option[value]`).setAttribute("selected", "selected");
            }

            document.querySelector(`option[value='${334}']`).setAttribute("selected", "selected");
            if (station == 'fifty_points') {
                document.getElementById('comment').innerHTML = `+50 бб ${courier_name}`;
            }
            else if (station == 'hundred_points') {
                document.getElementById('comment').innerHTML = `+100 бб ${courier_name}`;
            }
             localStorage.clear();
        }
    }
    function StationSwitch (station) {
        localStorage.setItem('station', station);
    }
    // async function getClipboardContents() {
    //     await navigator.clipboard.readText()
    //         .then(text => {
    //         copyText = text;
    //         localStorage.setItem('copyText', copyText);
    //     })
    //         .catch(err => {
    //         console.log('Something went wrong', err);
    //     })
    // }

})();