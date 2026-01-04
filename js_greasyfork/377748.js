// ==UserScript==
// @name         PON / SORT MISSION COORDS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Сортировка кординат в миссиях с указанием точки старта
// @author       Kaminoko
// @match        *://pathofninja.ru/*
// @match        *://www.pathofninja.ru/*
// @match        *://pathofninja.com/*
// @match        *://www.pathofninja.com/*
// @match        *://148.251.233.231/*
// @match        *://178.63.14.254/*
// @match        *://pon.fun/*
// @match        *://www.pon.fun/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/377748/PON%20%20SORT%20MISSION%20COORDS.user.js
// @updateURL https://update.greasyfork.org/scripts/377748/PON%20%20SORT%20MISSION%20COORDS.meta.js
// ==/UserScript==

(function() {
    'use strict';
//-- METHODS
    function calcDiff(firstEl, secondEl) {
        var fArr = firstEl.split("-");
        var sArr = secondEl.split("-");
        var fresult = Math.abs(fArr[0] - sArr[0]);
        var sresult = Math.abs(fArr[1] - sArr[1]);
        if(fresult > sresult) {
            return fresult;
        }
        else {
            return sresult;
        }
    }
    function findBetterPath(coords) {
        var currentCor;
        var ArrCoor = coords.split(",");
        if(!isFillCurrentCoords) {
            startCor = prompt("Введите начальную координату(к примеру - '56-28') или 0 если таковой нету:");
            isFillCurrentCoords = true;
        }
        var firstIndex = 0;
        if(startCor == 0 || startCor == "" || startCor == null) {
            currentCor = ArrCoor[0];
            firstIndex = 1;
        }
        else {
            currentCor = startCor;
        }
         for(var x = 0; x < ArrCoor.length; x++) {
            ArrCoor[x] = ArrCoor[x].replace(/[^-0-9]/gim,'');
        }
        var resultArr = [];
        var curDiff = 200;
        var tempDiff = 0;
        var curIndex = -1;
        resultArr.push(currentCor);
        for(var j = firstIndex; j < ArrCoor.length; j++) {
            for(var i = firstIndex; i < ArrCoor.length; i++) {
                if(!!ArrCoor[i]) {
                    tempDiff = calcDiff(currentCor, ArrCoor[i]);
                    if(curDiff > tempDiff) {
                        curDiff = tempDiff;
                        curIndex = i;
                    }
                }
            }
            curDiff = 200;
            resultArr.push(ArrCoor[curIndex]);
            currentCor = ArrCoor[curIndex];
            delete ArrCoor[curIndex];
            curIndex = -1;

        }
        var resCoordsStr = resultArr.join(", ");
        resCoordsStr += "...";
        return resCoordsStr;

    }
    function parseAndPasteCoords() {
        var tableMission = document.getElementsByClassName("tbl6 tbl_r_bottom");
        var missionLength = tableMission[0].children[0].children.length;
        if(missionLength > 0) {
            for(var i = 0; i < missionLength; i++) {
                var missionHTML = tableMission[0].children[0].children[i].children[1].children[1].innerHTML;
                var tempHTML = missionHTML.split("<br>");
                for(var j = 0; j < tempHTML.length; j++) {
                    var regExpCoords = /сектора: /;
                    if(regExpCoords.test(tempHTML[j])) {
                        var editArr = tempHTML[j].split(": ");
                        editArr[1] = findBetterPath(editArr[1]);
                        tempHTML[j] = editArr.join(": ");
                    }
                }
                tableMission[0].children[0].children[i].children[1].children[1].innerHTML = tempHTML.join("<br>");
            }
        }
    }
    //-- FIELDS
    var isFillCurrentCoords = false;
    var startCor = 0;
    //-- New Event Handler
    var header = unsafeWindow.document.querySelector(".header");
    if(header != null) {
        var MissionElement = (header.children[1].children[4].innerText.trimEnd() == "Миссии" ? header.children[1].children[4]
                              : header.children[1].children[3]);
        MissionElement.onclick = function(event) {
            unsafeWindow.data_send('quest_pl', '&smenu=1', []);
            setTimeout(function() {parseAndPasteCoords()}, 1000);
        };
    }

})();