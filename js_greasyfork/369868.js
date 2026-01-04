// ==UserScript==
// @name         HWM_BattleEnhancer
// @namespace    Небылица
// @version      1.0
// @description  Улучшения функционала боёв
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/war\.php/
// @downloadURL https://update.greasyfork.org/scripts/369868/HWM_BattleEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/369868/HWM_BattleEnhancer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function insertBefore(newNode, referenceNode){ // Вставка newNode перед referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
    function separateUnits(number){ // Отделяет (ещё) number юнитов
        var i,
            maxI = number - 1,
            sliderButton2 = document.getElementById("slider_but2");
        for (i=0;i<maxI;i++){
            sliderButton2.dispatchEvent(mouseupEvent);
        }
    }
    function separateUnitsPart(part){ // Отделяет 1 part-ную юнитов с округлением вниз и нажимает "Применить"
        var totalAmount = document.getElementById("army_slider").getAttribute("max");
        separateUnits(Math.floor(totalAmount/part));
        document.getElementById("btn_separate_separate_army").dispatchEvent(mouseupEvent);
    }
    function loadingTimeoutWrapper(){ // Обёртка под ожидание прогрузки
        var finishBattleCloseButton = document.getElementById("finish_battle_close"),
            separateArmyDiv = document.getElementById("win_SeparateArmy");

        if (finishBattleCloseButton && separateArmyDiv){
            // сдвиг кнопки закрытия окошка с результатами боя
            finishBattleCloseButton.style.margin = "5px 10px 0px 0px";
            finishBattleCloseButton.style.height = "32px";
            finishBattleCloseButton.style.width = "32px";

            // делаем кнопки отделения существ
            var sliderDiv = document.querySelector("div.block_sliders_horizontal"),
                separateHalf = document.createElement("div"),
                separateThird = document.createElement("div");

            separateHalf.setAttribute("id", "BA_separateHalf");
            separateThird.setAttribute("id", "separateThird");
            separateHalf.setAttribute("class", "btns");
            separateThird.setAttribute("class", "btns");

            separateHalf.innerHTML = "<span>Отделить 1/2</span>";
            separateThird.innerHTML = "<span>Отделить 1/3</span>";

            separateHalf.style.marginRight = "2px";
            separateThird.style.marginLeft = "1px";

            insertBefore(separateHalf, sliderDiv);
            insertBefore(separateThird, sliderDiv);

            // вяжем события по клику
            separateHalf.addEventListener("mouseup", function(){separateUnitsPart(2);});
            separateThird.addEventListener("mouseup", function(){separateUnitsPart(3);});
        } else{
            window.setTimeout(function(){loadingTimeoutWrapper();}, 250);
        }
    }

    // Обёртка под ожидание прогрузки
    var mouseupEvent = new Event("mouseup");
    loadingTimeoutWrapper();
})();