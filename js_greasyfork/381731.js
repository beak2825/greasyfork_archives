// ==UserScript==
// @name         HWM_FastNanoartsRepair
// @namespace    Небылица
// @version      1.0
// @description  Ремонт артефактов существ без перезагрузки страницы
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/arts_for_monsters\.php/
// @downloadURL https://update.greasyfork.org/scripts/381731/HWM_FastNanoartsRepair.user.js
// @updateURL https://update.greasyfork.org/scripts/381731/HWM_FastNanoartsRepair.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function sendPOSTRequest(url, mimeType, params, callback){ // Универсалка для отправки POST-запроса к url с выставлением заданного MIME Type, параметрами params и исполнением функции callback при получении ответа
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        if (typeof mimeType === "string"){
            xhr.overrideMimeType(mimeType);
        }
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (typeof callback === "function"){
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    callback.apply(xhr);
                }
            };
        }

        xhr.send(params);
    }
    //

    // пробегаемся по всем кнопкам и переопределяем поведение при клике
    var repairButtons = document.querySelectorAll("input[type='submit'][value^='ремонт за']"),
        form0 = repairButtons[0].parentElement.children,
        race = form0[1].value,
        sign = form0[2].value;

    repairButtons.forEach(function(repairButton){
        repairButton.onclick = function(event){
            event.preventDefault();

            sendPOSTRequest("arts_for_monsters.php", "text/html; charset=windows-1251",
                            "na_id=" + event.target.parentElement.firstChild.value +
                            "&race=" + race +
                            "&sign=" + sign);

            event.target.disabled = true;
            };
    });;
})();