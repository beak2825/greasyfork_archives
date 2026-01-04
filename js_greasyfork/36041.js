// ==UserScript==
// @name         HWM_InterceptionAlert
// @namespace    Небылица
// @version      1.15
// @description  Оповещение о близящемся перехвате
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/.+/
// @exclude      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|campaign|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/36041/HWM_InterceptionAlert.user.js
// @updateURL https://update.greasyfork.org/scripts/36041/HWM_InterceptionAlert.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Настройки – время до перехвата, за которое показывать оповещение, в минутах
    var alertInterval = 20;
    //

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
    function addAlertImage(interceptionsString){ // Вывод иконки при наличии перехватов в ближайшие alertInterval минут
        // получаем текущее время и массив с перехватами
        var currentTimeFull = document.querySelector("td[align='right'][valign='bottom'][height='17']").innerHTML.match(/(\S*?),/)[1],
            interceptions = interceptionsString.split("|");

        // запускаем цикл по массиву перехватов
        var i,
            maxI = interceptions.length,
            interceptionTime,
            interceptionLocale;
        for (i=0;i<maxI;i++){
            // получаем время перехвата и проверяем, не находится ли оно ближе alertInterval минут
            interceptionTime = interceptions[i].match(/([\d]{2}:[\d]{2})/)[1];
            if ((parseInt(currentTimeFull.split(":")[0])*60 + parseInt(currentTimeFull.split(":")[1]) < parseInt(interceptionTime.split(":")[0])*60 + parseInt(interceptionTime.split(":")[1])) &&
                (parseInt(currentTimeFull.split(":")[0])*60 + parseInt(currentTimeFull.split(":")[1]) + alertInterval >= parseInt(interceptionTime.split(":")[0])*60 + parseInt(interceptionTime.split(":")[1]))
               ){
                // получаем район перехвата
                interceptionLocale = interceptions[i].match(/(East\sRiver|Tiger\sLake|Rogues'\sWood|Wolf\sDale|Peaceful\sCamp|Lizard\sLowland|Green\sWood|Eagle\sNest|Portal's\sRuins|Dragons'\sCaves|Shining\sSpring|Sunny\sCity|Magma\sMines|Bear\sMountain|Fairy\sTrees|Harbour\sCity|Mythril\sCoast|Great\sWall|The\sGreat\sWall|Titans'\sValley|Fishing\sVillage|Kingdom\sCastle|Ungovernable\sSteppe|Crystal\sGarden|The\sWilderness|Sublime\sArbor)/i)[1];
                // определяем и вставляем в страницу иконку
                var alertImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAcUlEQVR42qVS2wnAIAzMVBkyk7iJAzhBfswYloNeqPanoQdiyD18itwYYywzW6q6DfTAyRMRkcQJBkGzJc85V2vttQJ64HIlFhT33jMdNU0MFjQAit0901HTRM1m4AwhjSf3z/BpS+VDl6+1/HDVr3EB28R1qA0hRi8AAAAASUVORK5CYII=",
                    alertImageTd = document.createElement("td");
                alertImageTd.innerHTML = "<a href='mapwars.php'><img align='absmiddle' src='" + alertImage + "' width='12' height='12' border='0' title=\"Близится перехват: " + interceptionTime + " в " + interceptionLocale + "\"></a>";
                document.querySelector("a[href='bselect.php']").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(alertImageTd);

                break;
            }
        }
    }
    //

    // Eсли родного значка активного перехвата нет, то запускаем скрипт
    if (document.querySelector("img[src*='target.gif'") === null){
        // определяем текущий момент времени на сервере и дату в строковом виде без ведущих нулей
        var currentMoment = new Date(),
            currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000),
            currentDateOnServer = currentMomentOnServer.getDate().toString() + "." + (currentMomentOnServer.getMonth() + 1).toString();

        // если c момента последней попытки получения информации о перехватах прошло более 10 минут, то запрашиваем данные
        if (GM_getValue("interceptions") === undefined || GM_getValue("checkMoment") === undefined || currentMomentOnServer.getTime() - GM_getValue("checkMoment") >= 600000){
            sendGETRequest("sms_clans.php", "text/html; charset=windows-1251", function(){
                // получаем страницу кланпочты в виде HTML и вытаскиваем список писем
                var parser = new DOMParser(),
                    responseHTML = parser.parseFromString(this.responseText, "text/html"),
                    letters = responseHTML.querySelectorAll("a[href*='&page=0&read=']");

                // запускаем цикл по массиву писем
                var i,
                    maxI = letters.length;
                for (i=0;i<maxI;i++){
                    // находим первое письмо по перехватам c датой и выходим из цикла
                    if (letters[i].innerHTML.indexOf("Перехват") !== -1 && letters[i].innerHTML.match(/([\d]{1,2}\.[\d]{1,2})/) !== null){
                        // отправляем запрос к странице письма, если оно не то же самое, что в прошлый раз (другая ссылка), и запоминаем адрес
                        if (letters[i].getAttribute("href") !== GM_getValue("dataHref")){
                            GM_setValue("dataHref", letters[i].getAttribute("href"));
                            sendGETRequest(letters[i].getAttribute("href"), function(){
                                // вытаскиваем список перехватов и определяем дату получения информации в строковом виде без ведущих нулей
                                var interceptions = this.responseText.match(/([\d]{2}:[\d]{2}.*?(East\sRiver|Tiger\sLake|Rogues'\sWood|Wolf\sDale|Peaceful\sCamp|Lizard\sLowland|Green\sWood|Eagle\sNest|Portal's\sRuins|Dragons'\sCaves|Shining\sSpring|Sunny\sCity|Magma\sMines|Bear\sMountain|Fairy\sTrees|Harbour\sCity|Mythril\sCoast|Great\sWall|The\sGreat\sWall|Titans'\sValley|Fishing\sVillage|Kingdom\sCastle|Ungovernable\sSteppe|Crystal\sGarden|The\sWilderness|Sublime\sArbor))|((East\sRiver|Tiger\sLake|Rogues'\sWood|Wolf\sDale|Peaceful\sCamp|Lizard\sLowland|Green\sWood|Eagle\sNest|Portal's\sRuins|Dragons'\sCaves|Shining\sSpring|Sunny\sCity|Magma\sMines|Bear\sMountain|Fairy\sTrees|Harbour\sCity|Mythril\sCoast|Great\sWall|The\sGreat\sWall|Titans'\sValley|Fishing\sVillage|Kingdom\sCastle|Ungovernable\sSteppe|Crystal\sGarden|The\sWilderness|Sublime\sArbor).*?[\d]{2}:[\d]{2})/gi),
                                    interceptionsString = "",

                                    currentMoment = new Date(),
                                    currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000),
                                    currentDateOnServer = currentMomentOnServer.getDate().toString() + "." + (currentMomentOnServer.getMonth() + 1).toString();

                                // собираем строчку со списком перехватов для помещения в хранилище
                                if (interceptions !== null){
                                    var i2,
                                        maxI2 = interceptions.length;
                                    if (maxI2 !== 1){
                                        for (i2=0;i2<maxI2;i2++){
                                            if (i2 !== maxI2 - 1){
                                                interceptionsString += interceptions[i2] + "|";
                                            } else{
                                                interceptionsString += interceptions[i2];
                                            }
                                        }
                                    } else{
                                        interceptionsString = interceptions[1];
                                    }
                                }

                                // запоминаем полученный список перехватов в строковом виде, дату их получения и запускаем функцию добавления значка
                                GM_setValue("interceptions", interceptionsString);
                                GM_setValue("dataDate", currentDateOnServer);

                                addAlertImage(interceptionsString);
                            });
                        } else if (GM_getValue("dataDate") !== currentDateOnServer){ // если же первое найденное письмо то же, что и в прошлый раз, то проверяем дату
                            // и стираем список перехватов, если она сменилась (данные устаревшие)
                            GM_setValue("interceptions", "");
                        } else{ // иначе оставляем и используем
                            addAlertImage(GM_getValue("interceptions"));
                        }
                        break;
                    }
                }
                // после выхода из цикла (либо при нахождении первого письма по перехватам с датой, либо при отсутствии таковых) запоминаем момент проверки
                GM_setValue("checkMoment", currentMomentOnServer.getTime());
            });
        } else if (GM_getValue("interceptions") !== ""){ // если есть валидная по времени информация о перехватах, то запускаем функцию добавления значка сразу
            addAlertImage(GM_getValue("interceptions"));
        }
    }
})();