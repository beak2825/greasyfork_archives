// ==UserScript==
// @name         HWM_CommitMultipleTransfers
// @namespace    Небылица
// @version      1.28
// @description  Отправить несколько переводов золота за раз
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/transfer\.php.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/35548/HWM_CommitMultipleTransfers.user.js
// @updateURL https://update.greasyfork.org/scripts/35548/HWM_CommitMultipleTransfers.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Настройки – указание времени ожидания между запросами в мс
    var delay = 1000;
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
    function encodeCP1251(text){ // Перекодирует русский текст так, чтобы при отправке запроса не выходили кракозябры (на базе функции из кода Gradient'a)
        var result = "",
            CP1251toUTF8 = {
                "А": "%C0",
                "Б": "%C1",
                "В": "%C2",
                "Г": "%C3",
                "Д": "%C4",
                "Е": "%C5",
                "Ж": "%C6",
                "З": "%C7",
                "И": "%C8",
                "Й": "%C9",
                "К": "%CA",
                "Л": "%CB",
                "М": "%CC",
                "Н": "%CD",
                "О": "%CE",
                "П": "%CF",

                "Р": "%D0",
                "С": "%D1",
                "Т": "%D2",
                "У": "%D3",
                "Ф": "%D4",
                "Х": "%D5",
                "Ц": "%D6",
                "Ч": "%D7",
                "Ш": "%D8",
                "Щ": "%D9",
                "Ъ": "%DA",
                "Ы": "%DB",
                "Ь": "%DC",
                "Э": "%DD",
                "Ю": "%DE",
                "Я": "%DF",

                "а": "%E0",
                "б": "%E1",
                "в": "%E2",
                "г": "%E3",
                "д": "%E4",
                "е": "%E5",
                "ж": "%E6",
                "з": "%E7",
                "и": "%E8",
                "й": "%E9",
                "к": "%EA",
                "л": "%EB",
                "м": "%EC",
                "н": "%ED",
                "о": "%EE",
                "п": "%EF",

                "р": "%F0",
                "с": "%F1",
                "т": "%F2",
                "у": "%F3",
                "ф": "%F4",
                "х": "%F5",
                "ц": "%F6",
                "ч": "%F7",
                "ш": "%F8",
                "щ": "%F9",
                "ъ": "%FA",
                "ы": "%FB",
                "ь": "%FC",
                "э": "%FD",
                "ю": "%FE",
                "я": "%FF",

                "Ё": "%A8",
                "ё": "%B8",

                " ": "%20",
                "!": "%21",
                "(": "%28",
                ")": "%29",
                "*": "%2A",
                "+": "%2B",
                ",": "%2C",
                "-": "%2D",
                ".": "%2E",
                "/": "%2F"
            };

        var i,
            maxI = text.length;
        for (i=0;i<maxI;i++){
            if (CP1251toUTF8[text[i]] !== undefined){
                result += CP1251toUTF8[text[i]];
            } else{
                result += text[i];
            }
        }

        return result;
    }
    function isNaturalNumber(n){ // Проверка натуральности числа
        n = n.toString();
        var n1 = Math.abs(n),
            n2 = parseInt(n);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n && n1 !== 0;
    }
    function queryWrapper(nicknames, amounts, descriptions, i, sign, delay, urlAfter, event){ // Обёртка для цикличного отправщика запросов
        i++;
        if (i < nicknames.length){
            sendPOSTRequest("transfer.php",
                            "text/html; charset=windows-1251",
                            "nick=" + encodeCP1251(nicknames[i]) + "&gold=" + amounts[i] + "&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&desc=" + encodeCP1251(descriptions[i]) + "&sign=" + sign);
            event.target.innerHTML = "Отправляем... " + (i+1).toString() + "/" + nicknames.length.toString();
            window.setTimeout(function(){queryWrapper(nicknames, amounts, descriptions, i, sign, delay, urlAfter, event);}, delay);
        } else{ // закончили отправку, открываем страницу urlAfter
            window.open(urlAfter, "_self");
        }
    }
    function getSign(plId){ // Определение sign персонажа
        // отправляем запрос к странице магазина с зельями
        sendGETRequest("shop.php?cat=other", "text/html; charset=windows-1251", function(){
            // получаем ответ в виде текста и достаём sign из кода страницы
            var responseHTMLString = this.responseText,
                signExec = /cat=other&sign=(.+?)['"&]/.exec(responseHTMLString);

            if (signExec){ // при успехе записываем его в хранилище
                GM_setValue("sign|#" + plId, signExec[1]);
            } else{ // если на странице зелий недоступно, делаем то же самое с домашней страницы
                sendGETRequest("home.php", "text/html; charset=windows-1251", function(){
                    // получаем ответ в виде HTML и достаём sign из ссылки на сброс параметров при её наличии
                    var parser = new DOMParser(),
                        responseHTML = parser.parseFromString(this.responseText, "text/html"),

                        signLink = responseHTML.querySelector("a[href^='shop.php?b=reset_tube&reset=2&sign=']"),
                        sign = "";

                    if (signLink){
                        sign = signLink.getAttribute("href").split("sign=")[1];
                        // и записываем его в хранилище
                        GM_setValue("sign|#" + plId, sign);
                    } else{ // иначе выбрасываем уведомление
                        alert("Не удалось записать sign, убедитесь, что на счету персонажа есть деньги, на домашней странице нет непрочитанных новостей или вы не находитесь в заявке.");
                    }
                });
            }
        });
    }
    //


    // Вывод формы
    var transferForm = document.getElementsByName("f")[0].parentNode;
    transferForm.innerHTML =
        "<br>" +

        "<textarea id='nicknames' cols='20' rows='10' placeholder='Ники'></textarea>" +
        "<textarea id='amounts' cols='8' rows='10' placeholder='Суммы'></textarea>" +
        "<textarea id='descriptions' cols='50' rows='10' placeholder='Подписи'></textarea>" +

        "<br>" +

        "<form id='mode'>" +
        "<input type='radio' name='mode' value='fromtop' checked>Сверху вниз</input>" +
        "<br>" +
        "<input type='radio' name='mode' value='frombottom'>Снизу вверх</input>" +
        "</form>" +

        "<button type='button' id='submit'>Отправить</button>";
    transferForm.style = "text-align: center;";

    // Определение id персонажа и его sign (в случае отсутствия сохранённого значения)
    var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1];
    if (GM_getValue("sign|#" + plId) === undefined){
        // после исполнения запроса к ключу "sign|#" + plId будет приписан sign, кнопку отправки не следует нажимать ранее
        getSign(plId);
    }

    // Обработка данных формы
    var submitButton = document.getElementById("submit");
    submitButton.onclick = function(event){
        // выключаем для подстраховки дефолтное действие кнопки, ставим ей стили состояния отправки
        event.preventDefault();
        event.target.innerHTML = "Отправляем...";
        event.target.disabled = true;

        // берём из хранилища sign персонажа
        var sign = GM_getValue("sign|#" + plId);

        // вытаскиваем из страницы заполненные поля формы и собираем адрес для перехода после отправки переводов
        var nicknames = document.getElementById("nicknames").value.split(/\r?\n/),
            amounts = document.getElementById("amounts").value.split(/\r?\n/),
            descriptions = document.getElementById("descriptions").value.split(/\r?\n/),
            mode = document.querySelector("input[name='mode']:checked").value,

            urlAfter = "https://" + location.hostname + "/pl_transfers.php?id=" + plId;

        // проверка одинаковости количества строк в полях
        if (nicknames.length === amounts.length && amounts.length === descriptions.length){
            // проверка того, что все указанные суммы золота – натуральные числа
            var amountsCorrect = true,
                i,
                maxI = amounts.length;
            for (i=0;i<maxI;i++){
                if (!isNaturalNumber(amounts[i])){
                    // если встречаем некорректное значение, то прекращаем обработку данных и выбрасываем сообщение об ошибке
                    event.target.innerHTML = "Отправить";
                    event.target.disabled = false;

                    amountsCorrect = false;
                    alert("Суммы золота для переводов должны быть натуральными числами!");

                    break;
                }
            }
            // если всё норм, идём дальше
            if (amountsCorrect){
                // переворачиваем массивы, если выбран вариант "снизу вверх"
                if (mode === "frombottom") {
                    nicknames.reverse();
                    amounts.reverse();
                    descriptions.reverse();
                }

                // делаем POST-запросы по количеству строк в полях и переходим на заданную страницу после
                queryWrapper(nicknames, amounts, descriptions, -1, sign, delay, urlAfter, event);
            }

        } else{ // если кол-во строк не равно, то возвращаем кнопку в прежнее состояние и выбрасываем сообщение об ошибке
            event.target.innerHTML = "Отправить";
            event.target.disabled = false;

            alert("Не совпадает количество строк в полях!");
        }
    };
})();