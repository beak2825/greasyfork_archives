// ==UserScript==
// @name         Dro4illa Clicker (SIGame Clicker)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description:en  Clicker for SIGame (https://vladimirkhil.com/si/online). Press answer button faster than others!
// @description:ru Кликер для Своей Игры (https://vladimirkhil.com/si/online). Позволяет автоматически нажимать на кнопку ответа быстрее всех
// @author       Hot_Dro4illa228
// @include      *vladimirkhil.com/si/online*
// @icon         https://vladimirkhil.com/si/online/favicon.ico
// @grant        none
// @license GPL
// @description Clicker for SIGame (https://vladimirkhil.com/si/online)
// @downloadURL https://update.greasyfork.org/scripts/436511/Dro4illa%20Clicker%20%28SIGame%20Clicker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436511/Dro4illa%20Clicker%20%28SIGame%20Clicker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function myLoop() {
        setTimeout(function() {
            if (document.querySelector("#table") == null) {
                myLoop();
            }
            else {
                waiting_main();
            };
        }, 1000)
    }
    myLoop();

    var clicker_btn_red = "";
    var clicker_btn_green = "";

    function waiting_main() {
        var working = false;
        if (document.querySelector("#gameLogHost") != null) {
            let clicker_btn = document.createElement('div');
            clicker_btn_red = '<button type="button" style="background-color: #d92f2f" class="wide commandButton bottomButton" title="Включить автокликер">Автокликер</button>';
            clicker_btn_green = '<button type="button" style="background-color: #70d92f" class="wide commandButton bottomButton" title="Выключить автокликер">Автокликер</button>';
            clicker_btn.className = "sideButtonHost";
            clicker_btn.innerHTML = clicker_btn_red;
            clicker_btn.id = "clicker_div";
            document.querySelector("#gameLogHost").append(clicker_btn);
        }
        else {
            let clicker_btn = document.createElement('div');
            clicker_btn_red = '<button class="flyoutButton exit" style="background-color: #d92f2f" title="Включить автокликер">Автокликер</button>';
            clicker_btn_green = '<button class="flyoutButton exit" style="background-color: #70d92f" title="Включить автокликер">Автокликер</button>';
            clicker_btn.innerHTML = clicker_btn_red;
            clicker_btn.id = "clicker_div";
            document.querySelector("#buttons").append(clicker_btn);
        };

        document.querySelector("#clicker_div").addEventListener('click', function (event) {
            if (working == false) {
                document.querySelector("#clicker_div").innerHTML = clicker_btn_green;
                working = true;
            }
            else {
                document.querySelector("#clicker_div").innerHTML = clicker_btn_red;
                working = false;
            }
        });

        // Цель
        var target = document.querySelector("body")

        // Конфигурация observer (за какими изменениями наблюдать)
        const config = {
            attributes: false,
            childList: true,
            subtree: true
        };

        // Колбэк-функция при срабатывании мутации
        const callback = function(mutationsList, observer) {
            if (getElementByXpath('//*[@id="table"]/div[2]/div') != null && working == true){
                getElementByXpath('//*[@id="reactHost"]/div/section/div[1]/div[2]/div/button').click();
            };
        };

        // Создаём экземпляр наблюдателя с указанной функцией колбэка
        const observer = new MutationObserver(callback);

        // Начинаем наблюдение за настроенными изменениями целевого элемента
        observer.observe(target, config);
    };

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

})();
