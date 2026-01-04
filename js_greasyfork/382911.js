// ==UserScript==
// @name         HWM_RepairAssistant
// @namespace    Небылица
// @version      1.1
// @description  Помощник для ремонта через новый интерфейс
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(art_transfer|pl_transfers)\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382911/HWM_RepairAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/382911/HWM_RepairAssistant.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function validateNick(nick){ // Возвращает массив ["результат валидации (true/false)", "строка с тем, что не так (либо ник, если верен)"]
        if (nick.length < 3 || nick.length > 18){
            return [false, "Ник должен быть не длиннее 18 символов и не короче 3"];
        }
        if (nick.match(/^\d+$/)){
            return [false, "Ник не может содержать только цифры"];
        }
        if (nick.match(/[^\W_\d]/) && nick.match(/[а-яА-ЯёЁ]/)){ // _ и цифры могут сочетаться с кириллицей
            return [false, "Ник может быть либо целиком из русских букв, либо целиком из английских (смешивать нельзя)"];
        }
        if (!nick.match(/^[a-zA-zа-яА-ЯёЁ\d\s_-]+$/)){
            return [false, "Ник не должен содержать символов помимо русских или английских букв, цифр, знака подчёркивания, дефиса и пробела"];
        }
        return [true, nick];
    }
    function validatePrice(price){ // Возвращает цену в формате "2/3 цифры и знак %", либо false при невозможности обработки
        if (price.match(/^\d{2,3}%$/)){return price;}
        if (price.match(/^\d{2,3}$/)){return price + "%";}
        return false;
    }
    function drawSmithsTable(smiths, smithsDiv){ // Принимает массив кузнецов и рабочий элемент, отрисовывает в него таблицу и вяжет события удаления
        if (smiths.length > 0){
            var smithsDivInnerHTML =
                "<style>" +
                ".RA_smithsTr:hover{background: #DCDCDC;}" +
                ".RA_smithsTdNick{font-weight: bold;}" +
                ".RA_smithsTdDelete{font-size: 11px;}" +
                "</style>";

            smithsDivInnerHTML += "<table style='text-align: center;'><tbody>";
            maxI = smiths.length;
            for (i=0;i<maxI;i++){
                smithsDivInnerHTML += "<tr class='RA_smithsTr' title='" + smiths[i][3] + "'>";
                smithsDivInnerHTML += "<td class='RA_smithsTdNick' width='119px'><a href='pl_info.php?nick="+ encodeCP1251(smiths[i][0]) + "' target='_blank'>" + smiths[i][0] + "</a></td>";
                smithsDivInnerHTML += "<td class='RA_smithsTdEfficiency' width='55px'>" + smiths[i][1] + "</td>";
                smithsDivInnerHTML += "<td class='RA_smithsTdPrice' width='55px'>" + smiths[i][2] + "</td>";
                smithsDivInnerHTML += "<td class='RA_smithsTdDelete' id='RA_smithsTdDeleteSmith" + i + "' width='16px' title='Удалить кузнеца'>x</td>";
                smithsDivInnerHTML += "</tr>";
            }
            smithsDivInnerHTML += "</tbody></table>";

            smithsDiv.innerHTML = smithsDivInnerHTML;
            setStylesByMode();
            setDeleteSmithEvents();
            if (repairRadio){setFillSmithEvents();}
        } else{
            smithsDiv.innerHTML = "<center>Кузнецов пока нет</center>";
        }
    }
    function setDeleteSmithEvents(){ // Вяжет события к кнопкам удаления
        var deleteButtons = document.querySelectorAll("td.RA_smithsTdDelete");
        if (deleteButtons.length > 0){
            var maxI = deleteButtons.length;
            for (i=0;i<maxI;i++){
                deleteButtons[i].onclick = function(event){
                    smiths.splice(parseInt(event.target.getAttribute("id").replace("RA_smithsTdDeleteSmith", "")), 1);
                    setSmiths(smiths);
                    drawSmithsTable(smiths, document.getElementById("RA_smithsDiv"));
                }
            }
        } else{window.setTimeout(function(){setDeleteSmithEvents()}, 50);}
    }
    function setFillSmithEvents(){ // Вяжет события подстановки кузнецов
        var smithsTds = document.querySelectorAll("td.RA_smithsTdNick, td.RA_smithsTdEfficiency, td.RA_smithsTdPrice");
        if (smithsTds.length > 0){
            var maxI = smithsTds.length;
            for (i=0;i<maxI;i++){
                smithsTds[i].onclick = function(event){
                    if (repairRadio.checked){
                        var thisSmithTds = event.target.parentElement.childNodes,
                            nickInput = document.querySelector("input[name='nick']"),
                            finalPrice = Math.ceil(parseInt(baseGoldPrice)*priceToFloat(thisSmithTds[2].innerText));
                        nickInput.value = thisSmithTds[0].innerText;

                        var a = document.createElement("a");
                        a.href = "#";
                        a.setAttribute("onclick", "set_price(" + finalPrice + ");");
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function(){document.body.removeChild(a);}, 0);
                    }
                }
            }
        } else{window.setTimeout(function(){setFillSmithEvents()}, 50);}
    }
    function clearNewSmith(){ // Очистка полей в newSmithDiv
        newSmithNick.value = "";
        newSmithEfficiency.value = "90%";
        newSmithPrice.value = "100%";
        newSmithNote.value = "";
    }
    function setSmiths(smiths){ // Принимает массив кузнецов, формирует и записывает в хранилище строку
        var newSmithsString = "";
        maxI = smiths.length;
        for (i=0;i<maxI;i++){
            newSmithsString += smiths[i].join(":");
            if (i !== (smiths.length - 1)){newSmithsString += "|";}
        }
        GM_setValue("smiths" + plIdSubKey, newSmithsString);
    }
    function priceToFloat(price){ // Переводит цену из строки в число (100% --> 1)
        return parseFloat(price.replace("%", "")/100);
    }
    function calculateRepairTime(baseGoldPrice, repairBeginningMomentOnServer){ // Принимает базовую цену и момент начала ремонта, возвращает массив ["время ремонта (A ч. B мин.)", "время окончания (xx:yy)", "объект времени окончания"]
        var repairHoursFull = baseGoldPrice/4000,
            repairHours = Math.trunc(repairHoursFull),
            repairMinutes = Math.ceil(60*(repairHoursFull - Math.trunc(repairHoursFull))),
            repairEndMomentOnServer = new Date(repairBeginningMomentOnServer.getTime() + Math.ceil(repairHoursFull*60*60*1000));
        return [repairHours + " ч. " + repairMinutes + " мин.",
                addLeadingZero(repairEndMomentOnServer.getHours()) + ":" +
                addLeadingZero(repairEndMomentOnServer.getMinutes()),
                repairEndMomentOnServer];
    }
    function setStylesByMode(){ // Показ/скрытие строки с ценой арта и выставление стиля курсора на кузнецах в зависимости от режима
        var repairMode = (repairRadio) ? repairRadio.checked : false,
            artPriceTrDisplay = (repairMode) ? "none" : "table-row",
            smithsTdsCursor = (repairMode) ? "pointer" : "auto";
        artPriceTr.style.display = artPriceTrDisplay;

        var smithsTds = document.querySelectorAll("td.RA_smithsTdNick, td.RA_smithsTdEfficiency, td.RA_smithsTdPrice");
        if (smithsTds.length > 0){
            var maxI = smithsTds.length;
            for (i=0;i<maxI;i++){
                smithsTds[i].style.cursor = smithsTdsCursor;
            }
        }
    }
    function getBaseGoldPrice(){ // Возвращает базовую цену ремонта
        var baseGoldPriceMatch = document.documentElement.innerHTML.match(/repair_price\s=\s(\d+);/),
            baseGoldPrice =
            (baseGoldPriceMatch) ? baseGoldPriceMatch[1] :
        document.getElementById("rep").childNodes[4].childNodes[0].childNodes[6].childNodes[3].innerText.replace(",", "");
        return baseGoldPrice;
    }
    function encodeCP1251(text){ // Перекодирует русский текст так, чтобы при отправке запроса не выходили кракозябры
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
    function insertAfter(newNode, referenceNode){ // Вставка newNode после referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function setupObserver(target, config, callback){ // Привязка к target observer'а с параметрами config и вызовом callback при срабатывании c передачей observer внутрь
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){callback.apply(observer);});
        });
        observer.observe(target, config);
    }
    function addLeadingZero(string){ // Вставляет ведущий ноль в строку с элементом даты/времени, если в ней только 1 цифра
        string = string.toString();
        if (string.length === 1){string = "0" + string;}
        return string;
    }
    //

    var i,
        maxI,
        currentMoment,
        currentMomentOnServer,
        repairTimeArr,
        baseGoldPrice;
    if (location.pathname.indexOf("art_transfer") !== -1){ // передача арта
        // создаём дублированную кнопку
        var artTableTrs = document.querySelector("table.wb[width='600'][cellpadding='4'][align='center']").childNodes[1].childNodes,
            artPriceTr = artTableTrs[8],
            artSendModeTr = artTableTrs[10],
            artSendButtonTr2 = artTableTrs[12],
            artSendButtonTr1 = artSendButtonTr2.cloneNode(true),

            repairRadio = document.querySelector("input[type='radio'][name='sendtype'][value='5']"),
            noTransferRadio = document.querySelector("input[type='radio'][name='sendtype'][value='0']"),
            ownershipRadio = document.querySelector("input[type='radio'][name='sendtype'][value='1']"),
            rentRadio = document.querySelector("input[type='radio'][name='sendtype'][value='2']");

        artSendButtonTr1.children[1].innerHTML = " <input type='button' value='Передать' id='tr_button_clone'>";
        artSendButtonTr1.style.display = "table-row";
        artSendButtonTr2.style.display = "none";
        insertAfter(artSendButtonTr1, artPriceTr);

        var tr_button = document.getElementById("tr_button"),
            tr_button_clone = document.getElementById("tr_button_clone");
        tr_button_clone.onclick = function(){tr_button.click();};
        tr_button_clone.disabled = tr_button.disabled;
        setupObserver(tr_button, {attributes : true, attributeFilter : ['disabled']}, function(){
            tr_button_clone.disabled = tr_button.disabled;
        });

        // получаем id текущего персонажа и кусок ключа по нему
        var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1],
            plIdSubKey = "|#" + plId;

        // задаём дефолтный/получаем список кузнецов
        if (GM_getValue("smiths" + plIdSubKey) === undefined){GM_setValue("smiths" + plIdSubKey, "");}
        var smithsString = GM_getValue("smiths" + plIdSubKey),
            smiths = (smithsString) ? smithsString.split("|") : [];
        maxI = smiths.length;
        for (i=0;i<maxI;i++){
            smiths[i] = smiths[i].split(":");
        }

        // создаём элемент под таблицу кузнецов
        var containerDiv = document.createElement("div"),
            smithsDiv = document.createElement("div"),
            containerTd = document.querySelector("td.wbwhite[valign='top'][align='right']");

        containerDiv.setAttribute("id", "RA_containerDiv");
        smithsDiv.setAttribute("id", "RA_smithsDiv");

        drawSmithsTable(smiths, smithsDiv);

        containerTd.innerHTML = "";
        containerTd.appendChild(containerDiv);
        containerDiv.appendChild(smithsDiv);
        containerDiv.innerHTML += "<hr width='100%'>";
        containerTd.nextSibling.nextSibling.setAttribute("valign", "top");

        // создаём элемент под панель добавления нового кузнеца
        var newSmithDiv = document.createElement("div");
        newSmithDiv.setAttribute("id", "RA_newSmithDiv");
        newSmithDiv.innerHTML =
            "<center><b>Добавить нового кузнеца</b><br>" +
            "<table><tbody><tr>" +
            "<td width='122px'>" +
            "<input type='text' id='RA_newSmithNick' style='width: 120px; padding-left: 3px;' placeholder='Ник'>" +
            "</td>" +
            "<td width='55px'>" +
            "<select id='RA_newSmithEfficiency' style='height: 21px;'>" +
            "<option value='90%'>90%</option>" +
            "<option value='80%'>80%</option>" +
            "<option value='70%'>70%</option>" +
            "<option value='60%'>60%</option>" +
            "<option value='50%'>50%</option>" +
            "<option value='40%'>40%</option>" +
            "<option value='30%'>30%</option>" +
            "<option value='20%'>20%</option>" +
            "<option value='10%'>10%</option>" +
            "</select></td>" +
            "<td width='55px'>" +
            "<input type='text' id='RA_newSmithPrice' style='width: 53px; padding-left: 3px;' placeholder='Цена' value='100%'>" +
            "</td></tr>" +
            "<tr><td colspan='3'><input type='text' id='RA_newSmithNote' style='width: 232px; padding-left: 3px;' placeholder='Примечание (опционально)'>" +
            "</td></tr></tbody><table>" +
            "<input type='button' id='RA_newSmithButton' value='Добавить'></center>";
        containerDiv.appendChild(newSmithDiv);

        var newSmithNick = document.getElementById("RA_newSmithNick"),
            newSmithEfficiency = document.getElementById("RA_newSmithEfficiency"),
            newSmithPrice = document.getElementById("RA_newSmithPrice"),
            newSmithNote = document.getElementById("RA_newSmithNote"),
            newSmithButton = document.getElementById("RA_newSmithButton"),
            defaultPrices = {
                "90%": "100%",
                "80%": "80%",
                "70%": "70%",
                "60%": "60%",
                "50%": "50%",
                "40%": "40%",
                "30%": "30%",
                "20%": "20%",
                "10%": "10%"
            };

        // автоподстановка цены по эффективности
        newSmithEfficiency.onchange = function(){
            newSmithPrice.value = defaultPrices[newSmithEfficiency.value];
        };

        // запись нового кузнеца
        newSmithButton.onclick = function(){
            var newSmithNickValue = validateNick(newSmithNick.value),
                newSmithPriceValue = validatePrice(newSmithPrice.value);
            if (newSmithNickValue[0]){ // проверка ника
                if (newSmithPriceValue){ // проверка цены
                    smiths.push([newSmithNickValue[1], newSmithEfficiency.value, newSmithPriceValue, newSmithNote.value]);

                    // сортировка массива кузнецов: по эффективности по убыванию, затем по цене по возрастанию
                    smiths.sort(function(smith1, smith2){
                        if (smith1[1] < smith2[1]){return 1;}
                        if (smith1[1] > smith2[1]){return -1;}
                        if (smith1[1] === smith2[1]){
                            if (priceToFloat(smith1[2]) < priceToFloat(smith2[2])){return -1;}
                            if (priceToFloat(smith1[2]) > priceToFloat(smith2[2])){return 1;}
                            return 0;
                        }
                    });

                    // сохраняем кузнецов и перерисовывем таблицу
                    setSmiths(smiths);
                    drawSmithsTable(smiths, document.getElementById("RA_smithsDiv"));
                    clearNewSmith();
                } else{
                    window.alert("Цена должна представлять из себя 2 или 3 цифры с/без знака %");
                }
            } else{ // если ник неверен, показываем, что не так
                alert(newSmithNickValue[1]);
            }
        };

        // если арт сломанный
        if (repairRadio){
            // вешаем скрытие/показ строки с ценой арта и выставление стиля курсора на кузнецах в зависимости от режима
            repairRadio.addEventListener("click", function(){setStylesByMode();});
            if (noTransferRadio){noTransferRadio.addEventListener("click", function(){setStylesByMode();});}
            if (ownershipRadio){ownershipRadio.addEventListener("click", function(){setStylesByMode();});}
            if (rentRadio){rentRadio.addEventListener("click", function(){setStylesByMode();});}

            repairRadio.click(); // автовыбираем режим ремонта

            // показываем время ремонта
            var priceInput = document.getElementById("rep_price"),
                repairTimeSpan = document.createElement("span");
            currentMoment = new Date();
            currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000);
            baseGoldPrice = getBaseGoldPrice();
            repairTimeArr = calculateRepairTime(baseGoldPrice, currentMomentOnServer);

            repairTimeSpan.setAttribute("id", "RA_repairTimeSpan");
            repairTimeSpan.style.marginLeft = "5px";
            repairTimeSpan.innerHTML = "(" + repairTimeArr[0] + ", >=" + repairTimeArr[1] + ")";
            insertAfter(repairTimeSpan, priceInput);

            // заменяем кнопку "+10%" на -1%
            var addPrice10Button = document.querySelector("input[type='submit'][onclick*='add_price(10)']");
            addPrice10Button.setAttribute("onclick", "add_price(-1); return false;");
            addPrice10Button.value = "-1%";
        }
    } else{ // протокол передач
        var protocolTd = document.querySelector("table[cellpadding='0'][border='0'][cellspacing='0'][width='95%'] > tbody > tr > td"),
            repairsMatch = protocolTd.innerHTML.match(/\d{2}-\d{2}-\d{2}\s\d{2}:\d{2}:.+?\sза\sремонт:\s\d+\s\(\d+%\)(?:,\sдоп\.\sкомиссия:\s\d+)?/g),
            repairBeginningTime,
            repairBeginningTimeParts,
            repairRealGoldPrice,
            repairPercent,
            oldSubstring,
            newSubstring,
            repairBeginningMomentOnServer;
        currentMoment = new Date();
        currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000);

        maxI = repairsMatch.length;
        for (i=0;i<maxI;i++){
            oldSubstring = repairsMatch[i];
            repairBeginningTime = oldSubstring.match(/(\d{2}-\d{2}-\d{2}\s\d{2}:\d{2}):/)[1];
            repairBeginningTimeParts = repairBeginningTime.split(/[\s-:]/);
            repairRealGoldPrice = oldSubstring.match(/\sза\sремонт:\s(\d+)\s/)[1];
            repairPercent = oldSubstring.match(/\sза\sремонт:\s\d+\s\((\d+)%\)/)[1];

            repairBeginningMomentOnServer = new Date("20" + repairBeginningTimeParts[2],
                                                     (parseInt(repairBeginningTimeParts[1])-1),
                                                     repairBeginningTimeParts[0],
                                                     repairBeginningTimeParts[3],
                                                     repairBeginningTimeParts[4]);
            baseGoldPrice = Math.floor(repairRealGoldPrice/(repairPercent/100));
            repairTimeArr = calculateRepairTime(baseGoldPrice, repairBeginningMomentOnServer);

            if (repairTimeArr[2] > currentMomentOnServer){
                newSubstring = oldSubstring + ". <i>В ремонте до " + repairTimeArr[1] + ".</i>";
                protocolTd.innerHTML = protocolTd.innerHTML.replace(oldSubstring, newSubstring);
            }
        }
    }
})();