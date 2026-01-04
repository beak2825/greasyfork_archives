// ==UserScript==
// @name         PVU-Auto-Watering
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Автоматический полив, когда капча будет прорешена и растение обнулится
// @author       TG: cry_trader
// @match        http*://*.plantvsundead.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/431262/PVU-Auto-Watering.user.js
// @updateURL https://update.greasyfork.org/scripts/431262/PVU-Auto-Watering.meta.js
// ==/UserScript==
'use strict';

window.onload = function () {
    var nav_list = document.getElementsByClassName('tw-flex nav__list');

    if (nav_list) {
        // копирайт
        console.log('Скрипт работает! TG: @cry_trader');
        var author_ui = document.createElement('span');
        author_ui.style.zIndex = '9999';
        author_ui.style.fontSize = '9pt';
        author_ui.style.fontWeight = 'bold';
        author_ui.style.color = 'white';
        author_ui.style.marginLeft = '30px';
        var t = document.createTextNode('Скрипт работает! TG: @cry_trader');
        author_ui.appendChild(t);
        nav_list[0].appendChild(author_ui);
    }
};

var page_href = location.href;
var page_regexp = new RegExp('(http(|s).*\/\/|).*plantvsundead\.com.*farm\/.{24}$', 'gumi');

if (page_regexp.test(page_href) == true) {

    // инициализация конфига
    GM_config.init({
        'id': 'MyConfig', // The id used for this instance of GM_config
        'fields': // Fields object
        {
            'Count': // This is the id of the field
            {
                'label': 'Поливать растения до (поливов)', // Appears next to field
                'type': 'int', // Makes this setting a text field
                'default': 199 // Default value if user doesn't change it
            },
            'CloseAfterWatering': // This is the id of the field
            {
                'label': 'Закрыть вкладку после полива через (секунд) [введи -1, чтобы отключить функцию]', // Appears next to field
                'type': 'int', // Makes this setting a text field
                'default': 15 // Default value if user doesn't change it
            },
            'CloseByCount': // This is the id of the field
            {
                'label': 'Закрыть вкладку, если на ней больше (поливов) [введи -1, чтобы отключить функцию]', // Appears next to field
                'type': 'int', // Makes this setting a text field
                'default': -1 // Default value if user doesn't change it
            }
        }
    });


    // UI
    var wrapper = document.getElementsByTagName('body')[0];


    /*
    // инпут поливки растений
    var count_water = createSpan('Поливать растения до:', wrapper);
    count_water.style.fontSize = '10pt';
    count_water.style.top = '26%';
    count_water.style.color = 'white';

    var count_water_val = GM_getValue('count_water_val', 199);
    var count_water_inp = createInput(count_water_val, 'count_water_inp', count_water)
    count_water_inp.style.width = '120px';
    count_water_inp.style.marginLeft = '5px';

    count_water_inp.addEventListener('keyup', logElement);
    count_water_inp.addEventListener('change', logElement);

    // чекбокс автозакрытия страницы
    var close_action = createSpan('Закрыть страницу после поливки через 15 сек', wrapper);
    close_action.style.fontSize = '10pt';
    close_action.style.color = 'white';
    close_action.style.top = '31%';

    var close_action_val = GM_getValue('close_action_val', false);
    var close_checkbox = createCheckbox(close_action_val, 'close_action_checkbox', close_action)

    count_water_inp.addEventListener('change', logElement);
    */

    // лог
    var title_watering_ui = createSpan('На растении (обновляется динамически):\n', wrapper);
    title_watering_ui.style.top = '30%';

    var count_ui = createSpan('x', wrapper);
    count_ui.style.top = '32%';
    count_ui.style.fontSize = '16pt';

    var title_ui = createSpan('Log:\n', wrapper);
    title_ui.style.top = '36%';

    var log = createSpan('', wrapper);
    log.style.top = '37%';
    log.style.fontWeight = 'normal';
    log.style.fontSize = '10pt';

    var show_config = createButton('Открыть конфиг', 'show_config_btn', wrapper);
    show_config.addEventListener('click', openConfig);

    // Главный цикл
    waitUseBtn();

    function openConfig() {
        GM_config.open();
    }

    /*
        // запись в storage
        function logElement() {

            var val = parseInt(this.value, 10);
            if (val < 0) this.value = 0;
            GM_setValue('count_water_val', this.value);

        }
    */

    // создать спан
    function createSpan(caption, bdy) {
        var spn = document.createElement('span');
        spn.style.zIndex = '9999';
        spn.style.fontSize = '10pt';
        spn.style.fontWeight = 'bold';
        spn.style.position = 'absolute';
        spn.style.left = '17%';
        spn.style.top = '25%';
        spn.style.color = 'white';
        var t = document.createTextNode(caption);
        spn.appendChild(t);
        bdy.appendChild(spn);

        return spn;
    }

    /*
        // создать инпут number
        function createInput(val, class_name, bdy) {
            var inp = document.createElement('input');
            inp.type = 'number';
            inp.style.zIndex = '9999';
            inp.style.fontSize = '12pt';
            inp.value = val;
            inp.style.width = '90px';
            inp.style.height = '33px';
            inp.style.border = '1px solid black';
            inp.style.padding = '7px';
            inp.classList.add(class_name);
            bdy.appendChild(inp);

            return inp;
        }

        // создать инпут checkbox
        function createCheckbox(checkmark, class_name, bdy) {
            var inp = document.createElement('input');
            inp.type = 'checkbox';
            inp.checked = checkmark;
            inp.style.zIndex = '9999';
            inp.style.color = 'white';
            inp.style.marginLeft = '5px';
            inp.classList.add(class_name);
            bdy.appendChild(inp);

            return inp;
        }
    */
    // создать кнопку
    function createButton(caption, class_name, bdy) {
        var btn = document.createElement('button');
        btn.style.zIndex = '9999';
        btn.style.width = '120px';
        btn.style.height = '38px';
        btn.style.position = 'absolute';
        btn.style.color = 'white';
        btn.style.border = '1px solid white';
        btn.style.left = '17%';
        btn.style.top = '23%';
        btn.style.fontSize = '10pt';
        btn.classList.add(class_name);
        var t = document.createTextNode(caption);
        btn.appendChild(t);
        bdy.appendChild(btn);

        return btn;
    }


    // виден ли элемент на странице
    function isVisible(ele) {
        if (ele) {
            var style = window.getComputedStyle(ele);
            if ((style.width !== "0") &&
                (style.height !== "0") &&
                (style.opacity !== "0") &&
                (style.display !== 'none') &&
                (style.visibility !== 'hidden')) return true;
        }
        return false;
    }


    // поиск кнопки Use
    function waitUseBtn() {
        log.innerText += '\nИщем кнопку Use...';
        var checkUseBtnInterval = setInterval(function () {


            var overlay = document.getElementsByClassName('v-overlay');
            //console.log(overlay);
            //console.log(isVisible(overlay[0]));
            if ((overlay) && (isVisible(overlay[0]) == true)) {
                log.innerText += '\nНашли кнопку Use!';
                waitDialog();
                checkPlantWatering();
                clearInterval(checkUseBtnInterval);

                var plant = document.getElementsByClassName('small');
                if ((plant) && (plant.length > 0)) {
                    var close_by_count = GM_config.get('CloseByCount');
                    if ((close_by_count != -1) && (parseInt(plant[0].innerText, 10) >= close_by_count)) {
                        window.close();
                    }
                }
            }


            var usages = document.getElementsByClassName('usages');

            if ((usages) && (isVisible(usages[2]) == true)) {
                if (parseInt(usages[2].innerText, 10) > 0) {

                    var use_btn = document.querySelectorAll('button');
                    if ((use_btn) && (isVisible(use_btn[4]) == true)) {
                        if (isVisible(overlay[0]) == false) use_btn[4].click();
                        //use_btn[4].style.display = 'none';
                        //console.log('нажали USe');
                    }

                }
            }


            //var use_btn = document.querySelectorAll('button');
            //if (isVisible(use_btn[4]) != true) use_btn[4].style.display = 'block';


            /*
            var captcha = document.querySelectorAll('#captcha');
            if ((captcha) && (isVisible(captcha[0]) == true)) {
                log.innerText += '\nНашли кнопку Use!';
                clearInterval(checkUseBtnInterval);
                waitDialog();
            }
            */

        }, 1000);
    }


    // поиск диалогового окна
    function waitDialog() {
        log.innerText += '\nИщем диалоговое окно и решаем капчу...';
        var waitDialogInterval = setInterval(function () {

            // проверка антикапчи
            var captcha = document.querySelectorAll('#captcha');
            if ((captcha) && (isVisible(captcha[0]) == true)) {
                var captcha_status = document.getElementsByClassName('status');
                if (captcha_status.length > 0) {
                    if (captcha_status[0].innerText == 'Solved') {
                        log.innerText += '\nКапча решена!';
                        clearInterval(waitDialogInterval);
                        waitPlant();
                    } else if (captcha_status[0].innerText == 'Captcha could not be solved by 5 different workers') {
                        //log.innerText += '\nПеререшаем капчу!';
                        clearInterval(waitDialogInterval);
                        location.reload();
                        //waitUseBtn();
                    }
                }
            }

            // проверка ручной капчи
            var captcha_manual = document.getElementsByClassName('geetest_success_radar_tip_content');
            var count = 0;
            if (captcha_manual.length > 0) {
                captcha_manual.forEach((elem) => {
                    if (elem.innerText == 'Verification Succeeded') count++;
                })

                if (count == captcha_manual.length) {
                    log.innerText += '\nВсе капчи решены!';
                    clearInterval(waitDialogInterval);
                    waitPlant();
                }
            }

        }, 1000);
    }


    // ожидаем обнуления растения
    function waitPlant() {
        log.innerText += '\nЖдем обновления растения...';
        var waitPlantInterval = setInterval(function () {

            // повторная проверка капчи
            var good_captcha = false;
            if (good_captcha == false) {
                var captcha_status = document.getElementsByClassName('status');
                if (captcha_status.length > 0) {
                    if (captcha_status[0].innerText == 'Captcha could not be solved by 5 different workers') {
                        good_captcha = true;
                        //log.innerText += '\nПеререшаем капчу!';
                        clearInterval(waitPlantInterval);
                        location.reload();
                        //waitUseBtn();
                    }
                }
            }

            // var count_water_value = GM_getValue('count_water_val', 199);
            // count_water_inp.value = count_water_value;
            var count_water_value = GM_config.get('Count');

            var plant = document.getElementsByClassName('small');
            if ((plant) && (plant.length > 0)) {

                if (parseInt(plant[0].innerText, 10) <= count_water_value) {
                    var confirm_btn = document.getElementsByClassName('btn-confirm');
                    if (confirm_btn) confirm_btn[0].click();
                    log.innerText += '\nПолили на ' + plant[0].innerText + ' поливок';
                    clearInterval(waitPlantInterval);
                    closePlant();
                }

                var close_by_count = GM_config.get('CloseByCount');
                if ((close_by_count != -1) && (parseInt(plant[0].innerText, 10) >= close_by_count)) {
                    window.close();
                }
            }

        }, 250);
    }
}

function checkPlantWatering() {

    var checkPlantWateringInterval = setInterval(function () {

        var plant = document.getElementsByClassName('small');
        if ((plant) && (plant.length > 0)) {
            count_ui.innerText = plant[0].innerText + ' поливки(ок)';
            var close_by_count = GM_config.get('CloseByCount');
            if ((close_by_count != -1) && (parseInt(plant[0].innerText, 10) >= close_by_count)) {
                clearInterval(checkPlantWateringInterval);
                window.close();
            }
        }

    }, 2000);


}

// закрываем вкладку после поливки
function closePlant() {
    var close_after_watering = GM_config.get('CloseAfterWatering');

    if (close_after_watering != -1) {
        log.innerText += '\nВкладка закроется через ' + close_after_watering.toString() + ' секунд!';

        var closePlantTimeout = setTimeout(function () {
            window.close();
        }, close_after_watering * 1000);
    }
}