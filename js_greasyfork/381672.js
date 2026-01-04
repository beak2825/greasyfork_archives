// ==UserScript==
// @name         HWM_MGBigMoveSectorButton
// @namespace    Небылица
// @version      1.0
// @description  Добавляет большую кнопку перехода в район задания ГН (с возможностью мгновенного перехода)
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/mercenary_guild\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/381672/HWM_MGBigMoveSectorButton.user.js
// @updateURL https://update.greasyfork.org/scripts/381672/HWM_MGBigMoveSectorButton.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function insertAfter(newNode, referenceNode){ // Вставка newNode после referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var documentInnerHTHL = document.documentElement.innerHTML,
        taskAvaible = documentInnerHTHL.indexOf("минут") !== -1 && documentInnerHTHL.indexOf("Принять") === -1 && documentInnerHTHL.indexOf("Вы еще не приняли это задание") === -1;

    // создаём чекбокс автоперехода и подпись к нему, добавляем после кнопки
        var autoMoveCheckboxDiv = document.createElement("div"),
            autoMoveCheckbox = document.createElement("input"),
            autoMoveCheckboxLabelSpan = document.createElement("span"),
            faceImage = document.querySelector("img[width='150'][height='150']");

        autoMoveCheckboxDiv.setAttribute("id", "autoMoveCheckboxDiv");
        autoMoveCheckboxDiv.style.textAlign = "center";
        autoMoveCheckboxDiv.style.margin = "7px 0px 7px 0px";

        autoMoveCheckbox.setAttribute("type", "checkbox");
        autoMoveCheckbox.setAttribute("id", "autoMoveCheckbox");
        autoMoveCheckbox.style.margin = "0px 1px 0px 0px";
        if (GM_getValue("autoMove")){
            autoMoveCheckbox.checked = true;
        }

        autoMoveCheckboxLabelSpan.setAttribute("id", "autoMoveCheckboxLabelSpan");
        autoMoveCheckboxLabelSpan.innerText = "Отправляться сразу";
        autoMoveCheckboxLabelSpan.style.verticalAlign = "top";

        autoMoveCheckboxDiv.appendChild(autoMoveCheckbox);
        autoMoveCheckboxDiv.appendChild(autoMoveCheckboxLabelSpan);
        insertAfter(autoMoveCheckboxDiv, faceImage);

        // записываем настройку по изменению чекбокса и сразу переходим, если чекнули
        autoMoveCheckbox.onchange = function(){
            GM_setValue("autoMove", autoMoveCheckbox.checked);
            if (taskAvaible && autoMoveCheckbox.checked){
                document.getElementById("moveSectorButton").click();
            }
        };

    // если есть принятое задание
    if (taskAvaible){
        // задаём и описываем кнопку, вспомогательный элемент и вставляем её перед ним
        var moveSectorButtonDiv = document.createElement("div"),
            moveSectorButton = document.createElement("button"),
            otherSectorDelta = (documentInnerHTHL.indexOf("Вы находитесь в другом районе") === -1) ? 0 : 1,
            hrForInsertingBefore = document.querySelectorAll("hr[width='90%']")[0 + otherSectorDelta];

        moveSectorButton.setAttribute("id", "moveSectorButton");
        moveSectorButton.innerText = "Отправиться в путь!";

        moveSectorButton.setAttribute("height", "100px");
        moveSectorButton.setAttribute("width", "50px");
        moveSectorButtonDiv.style.textAlign = "center";
        moveSectorButtonDiv.style.margin = "-10px 0px 10px 0px";

        hrForInsertingBefore.parentNode.insertBefore(moveSectorButtonDiv, hrForInsertingBefore);
        moveSectorButtonDiv.appendChild(moveSectorButton);

        // привязываем событие клика
        moveSectorButton.onclick = function(){
            window.open(document.querySelector("a[href^='move_sector.php?id=']").getAttribute("href"), "_self")
        };

        // осуществляем автопереход, если задан
        if (GM_getValue("autoMove")){
            moveSectorButton.click();
        }
    }
})();