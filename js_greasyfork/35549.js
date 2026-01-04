// ==UserScript==
// @name         HWM_AutoReportMGTasks
// @namespace    Небылица
// @version      1.34
// @description  Автосдача заданий ГН
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(map|mercenary_guild|home)\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/35549/HWM_AutoReportMGTasks.user.js
// @updateURL https://update.greasyfork.org/scripts/35549/HWM_AutoReportMGTasks.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function sendGETRequest(url, mimeType, callback){ // Универсалка для отправки GET-запроса к url с выставлением заданного MIME Type и исполнением функции callback при получении ответа
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        if (typeof mimeType === "string"){
            xhr.overrideMimeType(mimeType);
        }

        if (typeof callback === "function"){
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    callback.apply(xhr);
                }
            };
        }

        xhr.send();
    }
    function reportTask(){ // Сдача задания с проверкой успешности и переходом на страницу гильдии для показа награды
        // отправляем запрос к странице ГН
        sendGETRequest("mercenary_guild.php", "text/html; charset=windows-1251", function(){
            // получаем ответ и проверяем, было ли задание сдано
            var response = this.responseText;

            if (response.indexOf("мин.") !== -1){
                // запоминаем текст награды и переходим в ГН
                var rewardArr = response.match(/<Br><br>([\S\s]+?)<table\sborder=0\scellspacing=0\scellpadding=0>/);
                if (rewardArr !== null){
                    GM_setValue("reward", rewardArr[1]);
                }

                window.open("mercenary_guild.php", "_self");
            }
        });
    }
    //

    switch (location.pathname){
        // Код для страницы карты
        case "/map.php":
            // проверяем наличие активного задания ГН и нахождение в секторе гильдии
            if (GM_getValue("taskActive") && document.querySelector("img[src*='merc.gif'][title='Гильдия Наемников']") !== null){
                // запускаем функцию сдачи задания
                reportTask();
            }
            break;

        // Код для страницы ГН
        case "/mercenary_guild.php":
            var documentInnerHTHL = document.documentElement.innerHTML;

            // если имеется сохранённый текст награды за только что сданное задание и ещё идёт отсчёт времени до нового, то вставляем текст в страницу
            if (GM_getValue("reward") !== "-1"){
                if (documentInnerHTHL.indexOf("мин.") !== -1){
                    var tdRowspan2 = document.querySelector("td[rowspan='2']");
                    tdRowspan2.innerHTML = tdRowspan2.innerHTML.split("</b><br><br><table")[0] + "</b><br><br>" + GM_getValue("reward") + "<table" + tdRowspan2.innerHTML.split("</b><br><br><table")[1];
                }

                // убираем прежнее значение
                GM_setValue("reward", "-1");
            }

            // проверяем, нет ли принятого задания, и запоминаем ответ
            if (documentInnerHTHL.indexOf("минут") !== -1 && documentInnerHTHL.indexOf("Принять") === -1 && documentInnerHTHL.indexOf("Вы еще не приняли это задание") === -1){
                GM_setValue("taskActive", true);

                // запоминаем, не разбойники ли это
                GM_setValue("ifBrigands", documentInnerHTHL.indexOf("разбойники {") !== -1);

                // проверяем сектор задания, и запоминаем, совпадает ли он с секторами отделений ГН
                var taskLocaleId = document.querySelector("img[title='Отправиться в путь']").parentNode.getAttribute("href").replace("move_sector.php?id=", "");
                GM_setValue("ifSameLocale", taskLocaleId === "2" || taskLocaleId === "6" || taskLocaleId === "16" || taskLocaleId === "21");
            } else{ // если принятого нет, убираем флаги активного задания, района и разбойников
                GM_setValue("taskActive", false);
                GM_setValue("ifSameLocale", false);
                GM_setValue("ifBrigands", false);
            }
            break;

        // Код для домашней страницы
        case "/home.php":
            // проверяем наличие активного задания
            if (GM_getValue("taskActive")){
                // проверяем, не разбойники ли это
                if (GM_getValue("ifBrigands")){
                    // запрашиваем страницу карты
                    sendGETRequest("map.php", "text/html; charset=windows-1251", function(){
                        // проверяем, имеется ли плашка для сдачи груза
                        if (this.responseText.indexOf("<center><a href=\"/map.php?action=accept_merc_task3\">Отдать груз.</a></center>") !== -1){
                            // сдаём груз
                            window.open("map.php?action=accept_merc_task3", "_self");
                        }
                    });
                } else if (GM_getValue("ifSameLocale")){ // проверяем, не было ли задание дано в сектор с отделением ГН
                    // запускаем функцию сдачи задания
                    reportTask();
                }
            }
            break;
    }
})();