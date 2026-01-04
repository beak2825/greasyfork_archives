// ==UserScript==
// @name         HWM_MGQuickReturn
// @namespace    Небылица
// @version      1.14
// @description  Быстрый возврат в сектор ГН
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(map|mercenary_guild|war)\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/369393/HWM_MGQuickReturn.user.js
// @updateURL https://update.greasyfork.org/scripts/369393/HWM_MGQuickReturn.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function getLinkToReturn(HTML){ // Возвращает ссылку на переход в ближайший сектор с ГН (или сразу на гильдию, если идти и не нужно) – скармливать код страницы карты
        // получаем код текущего района
        var currentLocaleRegExp = /cmbut\d+?\*ldbut\d+?\*(.*?):/,
            currentLocaleIdArr = currentLocaleRegExp.exec(HTML),
            currentLocaleId;

        if (currentLocaleIdArr !== null){
            currentLocaleId = currentLocaleIdArr[1];
        } else{
            currentLocaleRegExp = /FlashVars(.*?):/;
            currentLocaleIdArr = currentLocaleRegExp.exec(HTML);

            if (currentLocaleIdArr !== null){
                currentLocaleIdArr = currentLocaleIdArr[1].split('*');
                currentLocaleId = currentLocaleIdArr[currentLocaleIdArr.length - 1];
            } else {currentLocaleId = 1;}
        }

        var localesСorrespondence = {
            "1": "2", // Empire Capital
            "2": "0", // East River
            "3": "6", // Tiger Lake
            "4": "2", // Rogues' Wood
            "5": "2", // Wolf Dale
            "6": "0", // Peaceful Camp
            "7": "2", // Lizard Lowland
            "8": "2", // Green Wood
            "9": "6", // Eagle Nest
            "10": "2", // Portal Ruins
            "11": "2", // Dragons' Caves
            "12": "6", // Shining Spring
            "13": "6", // Sunny City
            "14": "2", // Magma Mines
            "15": "16", // Bear Mountain
            "16": "0", // Fairy Trees
            "17": "2", // Harbour City
            "18": "16", // Mythril Coast
            "19": "21", // Great Wall
            "20": "21", // Titans' Valley
            "21": "0", // Fishing Village
            "22": "21", // Kingdom Castle
            "23": "6", // Ungovernable Steppe
            "24": "6", // Crystal Garden
            "25": "", // East Island
            "26": "2", // The Wilderness
            "27": "6" // Sublime Arbor
        }

        var localeToReturn = localesСorrespondence[currentLocaleId],
            linkToReturn = "";
        if (localeToReturn !== "0"){
            if (!GM_getValue("alwaysReturnTo")){
                linkToReturn = "move_sector.php?id=" + localeToReturn;
            } else{
                linkToReturn = "move_sector.php?id=" + GM_getValue("alwaysReturnToLocaleCode");
            }
        } else{
            linkToReturn = "mercenary_guild.php";
        }
        return linkToReturn;
    }
    function insertAfter(newNode, referenceNode){ // Вставка newNode после referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }


    var documentInnerHTHL = document.documentElement.innerHTML;
    switch (location.pathname){
        case "/map.php":
            // добавляем кнопку на возврат для разбойников
            if (GM_getValue("showReturnButton")){
                // определяем кнопку и элемент, после которого вставлять
                var returnToMGButton = document.createElement("a"),
                    referenceNode = document.querySelector("b > a[href^='map.php?cx=']").parentElement;

                // собираем кнопку
                returnToMGButton.setAttribute("href", getLinkToReturn(documentInnerHTHL));
                returnToMGButton.innerHTML = "<b>Вернуться в ГН</b>";

                // вставляем кнопку
                insertAfter(returnToMGButton, referenceNode);
                insertAfter(document.createElement("br"), referenceNode);
                insertAfter(document.createElement("br"), referenceNode);
            }

            // при входе в бой ГН запоминаем сектор (ссылку) для возврата через "Продолжить"
            var acceptButton = document.querySelector("a[href^='/map.php?action=accept_merc_task']");

            if (acceptButton !== null){
                acceptButton.onclick = function(event){
                    event.preventDefault();

                    GM_setValue("linkToReturn", getLinkToReturn(documentInnerHTHL));

                    // идём в бой
                    window.open(event.target.href, "_self");
                }
            }
            break;

        case "/mercenary_guild.php":
            // создаём, описываем и вставляем настройку фиксированного возврата
            var alwaysReturnToDiv = document.createElement("div"),
                alwaysReturnToCheckbox = document.createElement("input"),
                alwaysReturnToLabelSpan = document.createElement("span"),
                alwaysReturnToSelect = document.createElement("select"),
                faceImage = document.querySelector("img[width='150'][height='150']");

            alwaysReturnToDiv.setAttribute("id", "alwaysReturnToDiv");
            alwaysReturnToDiv.style.textAlign = "center";
            alwaysReturnToDiv.style.margin = "7px 0px 7px 0px";

            alwaysReturnToCheckbox.setAttribute("type", "checkbox");
            alwaysReturnToCheckbox.setAttribute("id", "alwaysReturnToCheckbox");
            alwaysReturnToCheckbox.style.margin = "0px 1px 0px 0px";
            if (GM_getValue("alwaysReturnTo")){
                alwaysReturnToCheckbox.checked = true;
            }

            alwaysReturnToLabelSpan.setAttribute("id", "alwaysReturnToLabelSpan");
            alwaysReturnToLabelSpan.innerHTML = "Возвращаться в:<br>";
            alwaysReturnToLabelSpan.style.verticalAlign = "top";

            alwaysReturnToSelect.setAttribute("id", "alwaysReturnToSelect");
            alwaysReturnToSelect.innerHTML =
                "<option value='2'>East River</option>" +
                "<option value='6'>Peaceful Camp</option>" +
                "<option value='16'>Fairy Trees</option>" +
                "<option value='21'>Fishing Village</option>";
            alwaysReturnToSelect.style.margin = "3px 0px 0px 0px";

            alwaysReturnToSelect.disabled = !alwaysReturnToCheckbox.checked;
            if (!GM_getValue("alwaysReturnToLocaleCode")){
                GM_setValue("alwaysReturnToLocaleCode", "2");
            }
            alwaysReturnToSelect.value = GM_getValue("alwaysReturnToLocaleCode");

            alwaysReturnToDiv.appendChild(alwaysReturnToCheckbox);
            alwaysReturnToDiv.appendChild(alwaysReturnToLabelSpan);
            alwaysReturnToDiv.appendChild(alwaysReturnToSelect);
            insertAfter(alwaysReturnToDiv, faceImage);

            // сохраняем настройки по изменению полей
            alwaysReturnToCheckbox.onchange = function(){
                GM_setValue("alwaysReturnTo", alwaysReturnToCheckbox.checked);
                alwaysReturnToSelect.disabled = !alwaysReturnToCheckbox.checked;
            };

            alwaysReturnToSelect.onchange = function(){
                GM_setValue("alwaysReturnToLocaleCode", alwaysReturnToSelect.value);
            };

            // если имеется принятое задание
            if (documentInnerHTHL.indexOf("минут") !== -1 && documentInnerHTHL.indexOf("Принять") === -1 && documentInnerHTHL.indexOf("Вы еще не приняли это задание") === -1){
                if (documentInnerHTHL.indexOf("<b>Армия") !== -1){ // для армий ставим соответствующий флаг
                    GM_setValue("ifArmy", true);
                }
                if (documentInnerHTHL.indexOf("разбойники {") !== -1){ // для разбойников ставим показ кнопки и пишем возврат груза через "Продолжить"
                    GM_setValue("showReturnButton", true);
                    GM_setValue("linkToReturn", "map.php?action=accept_merc_task3");
                }
            } else{ // иначе затираем ссылку, показ кнопки и флаг армии
                GM_setValue("linkToReturn", "");
                GM_setValue("showReturnButton", false);
                GM_setValue("ifArmy", false);
            }
            break;

            // перенаправляем кнопку "Продолжить" при наличии сохранённой ссылки
        case "/war.php":
            var linkToReturn = GM_getValue("linkToReturn");

            if (linkToReturn !== ""){
                var continueButton = document.getElementById("btn_continue_WatchBattle");

                if (continueButton !== null){
                    continueButton.onclick = function(event){
                        event.preventDefault();

                        // для всего, кроме проигранных армий переходим по сохранённой ссылке и убираем её из хранилища
                        if (!(GM_getValue("ifArmy") && document.getElementById("finalresult_text").innerHTML.indexOf("<b>Победившая сторона:</b></font><br><b><font color=\"#0000FF\">Армия") !== -1)){
                            GM_setValue("linkToReturn", "");
                            window.open(linkToReturn, "_self");
                        } else{ // для проигранных армий выходим на карту
                            window.open("map.php", "_self");
                        }
                    }
                }
            }
            break;
    }
})();