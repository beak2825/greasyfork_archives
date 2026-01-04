// ==UserScript==
// @name         Mops Time Picker
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Добавление удобного календаря для выбора даты/времени
// @author       Nikitin Nikita
// @match        https://tng-mops-portal.azurewebsites.net/*
// @match        https://mops-dafuc0a6ftbqguhy.z01.azurefd.net/*
// @match        https://mops-portal.azurewebsites.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azurewebsites.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478823/Mops%20Time%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/478823/Mops%20Time%20Picker.meta.js
// ==/UserScript==


(function() {
    'use strict';

// Задержка для убедительности, что страница и все её скрипты загружены
setTimeout(function() {
    // Функция загрузки скрипта
    function loadScript(src, onLoad) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = onLoad;
        script.src = src;
        document.head.appendChild(script);
    }

    // Функция загрузки CSS
    function loadCSS(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Функция инициализации datetimepicker
    function initDatetimePicker() {
        $("input[type='datetime']").not('.datetimepicker-applied').datetimepicker({
            format: 'H:i d/m/Y',
            step: 15,
            onChangeDateTime: function(dp, $input) {
                $input[0].dispatchEvent(new Event('change'));
            }
        }).addClass('datetimepicker-applied');
    }

    // Функция, которая запускает всё после загрузки jQuery
    function afterJQueryLoaded() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.20/jquery.datetimepicker.full.min.js', function() {
            initDatetimePicker();
            // Настройка наблюдателя за изменениями в DOM
            new MutationObserver(initDatetimePicker).observe(document.body, { childList: true, subtree: true });
        });
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.20/jquery.datetimepicker.min.css');
    }

    // Загрузка jQuery и запуск цепочки загрузок
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js', afterJQueryLoaded);

}, 2000); // Используем задержку 2 секунд
})();
