// ==UserScript==
// @name         HWM_MapEnhancer
// @namespace    Небылица
// @version      1.2
// @description  Улучшения функционала карты
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/map\.php/
// @downloadURL https://update.greasyfork.org/scripts/369867/HWM_MapEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/369867/HWM_MapEnhancer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function loadingTimeoutWrapper(mode){ // Обёртка под ожидание прогрузки (mode – "map" для обычной страницы карты, "moving" – для страницы перехода)
        if (mode === undefined){
            if (document.documentElement.innerHTML.indexOf("Район:") !== -1){
                mode = "map";
            } else{
                mode = "moving";
            }
        }

        switch (mode){
                // страница карты
            case "map":
                var mapNotifs = document.querySelectorAll(".map_notif");

                if (mapNotifs.length !== 0){
                    // прячем восклицательные знаки на иконках ГС, ГЛ и ГИ
                    mapNotifs.forEach(function(element){element.style.display = "none";});

                    // добавляем отступ для блока со списком учреждений в районе
                    document.getElementById("text1").style.marginBottom = "5px";
                } else{
                    window.setTimeout(function(){loadingTimeoutWrapper("map");}, 250);
                }
                break;

                // страница перехода
            case "moving":
                var text3 = document.getElementById("text3");

                if (text3.innerText.length !== 0){
                    // добавляем время перехода в заголовок вкладки
                    addTimeToTitle(text3, document.title);
                } else{
                    window.setTimeout(function(){loadingTimeoutWrapper("moving");}, 250);
                }
                break;
        }
    }
    function addTimeToTitle(text3, commonPart){ // С периодичностью в 500 мс добавляем текущее время до конца перехода в начало заголовка вкладки
        var time = Number(text3.innerHTML.split(" ")[1]);
        if (time >= 0){
            document.title = time + " сек. " + commonPart;
            window.setTimeout(function(){addTimeToTitle(text3, commonPart)}, 500);
        }
    }


    // Обёртка под ожидание прогрузки
    loadingTimeoutWrapper();
})();