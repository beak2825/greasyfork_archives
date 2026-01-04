// ==UserScript==
// @name         HWM_ShowAvailableExchange
// @namespace    Небылица
// @version      1.6
// @description  Показывает на странице ГЛ, если накопились существа на обмен
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(leader_guild|leader_army_exchange)\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/381778/HWM_ShowAvailableExchange.user.js
// @updateURL https://update.greasyfork.org/scripts/381778/HWM_ShowAvailableExchange.meta.js
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
    function colorLink(){ // Раскрашивает ссылку на обмен
        document.querySelector("a[href='leader_army_exchange.php']").style.color = "blue";
    }
    function checkUnitPresenсe(list, monId){ // Проверка нахождения существа в формате "unit1" в списке юнитов (игнор-листе либо списке на обмен) в формате "unit1|unit2|"
        var monIdRegExp = new RegExp("(\?:\^\|\\|)" + monId + "\\|");
        return list.match(monIdRegExp) !== null;
    }
    function processHTML(exchangePageHTMLString, doColoring){ // Проверяет наличие стеков на обмен, по необходимости раскрашивает ссылку и запоминает результат и время
        var parser = new DOMParser(),
            exchangePageHTML = parser.parseFromString(exchangePageHTMLString, "text/html"),
            monIdInputs = exchangePageHTML.querySelectorAll("input[name='mon_id']");
        if (monIdInputs && exchangePageHTMLString.match(/Обменять\s\d/)){
            var ignoreList = GM_getValue("ignoreList" + plIdSubKey),
                exchangeAvailable = true; // так как кнопки обмена есть, по умолчанию true
            if (ignoreList){ // если игнор-листа нет, то так true и останется
                var monId,
                    i = 0,
                    maxI = monIdInputs.length;
                exchangeAvailable = false; // перед while'ом ставим false
                while (!exchangeAvailable && i<maxI){ // далее при нахождении первого юнита, которого нет в игнор-листе, прерываем цикл и запоминаем true
                    monId = monIdInputs[i].value;
                    if (!checkUnitPresenсe(ignoreList, monId)){
                        exchangeAvailable = true;
                    }
                    i++;
                }
            }

            if (exchangeAvailable && doColoring){
                colorLink();
            }
            GM_setValue("exchangeAvailable" + plIdSubKey, exchangeAvailable);
        } else{ // если кнопок обмена нет, то точно false
            GM_setValue("exchangeAvailable" + plIdSubKey, false);
        }

        GM_setValue("checkMoment" + plIdSubKey, currentMomentOnServer.getTime());
    }
    function checkExchangePage(){ // Отправка и обработка запроса к странице обменов
        sendGETRequest("leader_army_exchange.php", "text/html; charset=windows-1251", function(){
            processHTML(this.responseText, true);
        });
    }
    function recheckExchangePageWrapper(){ // Тайминговая обёртка для перепроверки после открытия свитка
        if (document.documentElement.innerText.match("Вы призвали: ")){
            checkExchangePage();
        } else{
            window.setTimeout(function(){recheckExchangePageWrapper();}, 1000);
        }
    }
    function processLeadershipTbody(ignoreList, monId, leadershipTbody, exchangeButton, HTMLString){ // Оформление и привязка событий на вкл./искл. юнитов из учёта по клику на лидерстве (HTMLString – код страницы обменов для перепроверки)
        if (checkUnitPresenсe(ignoreList, monId)){
            exchangeButton.disabled = true;
            leadershipTbody.title = "Юнит исключён из учёта доступных обменов. Нажмите, чтобы включить обратно.";
            leadershipTbody.firstChild.children[1].children[0].style.color = "red";

            leadershipTbody.onclick = function(){
                ignoreList = GM_getValue("ignoreList" + plIdSubKey).replace(monId + "|", "");
                GM_setValue("ignoreList" + plIdSubKey, ignoreList);
                processLeadershipTbody(ignoreList, monId, leadershipTbody, exchangeButton, HTMLString);
                processHTML(HTMLString, false);
            }
        } else{
            exchangeButton.disabled = false;
            leadershipTbody.title = "Юнит учитывается в числе доступных обменов. Нажмите, чтобы исключить.";
            leadershipTbody.firstChild.children[1].children[0].style.color = "black";

            leadershipTbody.onclick = function(){
                ignoreList = GM_getValue("ignoreList" + plIdSubKey) + monId + "|";
                GM_setValue("ignoreList" + plIdSubKey, ignoreList);
                processLeadershipTbody(ignoreList, monId, leadershipTbody, exchangeButton, HTMLString);
                processHTML(HTMLString, false);
            }
        }
    }
    //


    // получаем id текущего персонажа и кусок ключа по нему
    var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1],
        plIdSubKey = "|#" + plId,
        i,
        maxI,
        // определяем текущий момент времени
        currentMoment = new Date(),
        currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000),
        // и создаём переменную-временной флаг
        checkMoment = GM_getValue("checkMoment" + plIdSubKey) || 0;

    switch (location.pathname){
        case "/leader_guild.php":
            if (currentMomentOnServer.getTime() - checkMoment > 300000){ // если предыдущая проверка была не менее, чем 5 минут назад
                // запрашиваем страницу обменов и обрабатываем результат
                checkExchangePage();

            } else{ // иначе раскрашиваем ссылку сразу при наличии положительного сохранённого значения
                if (GM_getValue("exchangeAvailable" + plIdSubKey)){
                    colorLink();
                }
            }

            // делаем открытие ссылки на обмены в новой вкладке, если есть задания
            if (document.querySelector("input[value='Пропустить']")){
                document.querySelector("a[href='leader_army_exchange.php']").setAttribute("target", "_blank");
            }

            // если есть свитки, то подвешиваем перепроверку при открытии
            maxI = 3;
            for (i=0;i<maxI;i++){
                var scroll = document.getElementById("scroll" + (i+1).toString());
                if (scroll && scroll.getAttribute("onclick")){scroll.addEventListener("click", function(){recheckExchangePageWrapper();});}
            }

            // если только что был собран отряд из частей, то делаем перепроверку
            if (location.href.match("ex_done=") || document.documentElement.innerHTML.match(":\s100\sЧастей\s")){
                checkExchangePage();
            }

            break;

        case "/leader_army_exchange.php":
            // на странице обменов проверяем всё время, без кулдаунов
            var exchangePageInnerHTML = document.documentElement.innerHTML;
            processHTML(exchangePageInnerHTML, false);

            // отрисовываем опцию удаления юнитов из учёта, если есть готовые к обмену
            var monIdInputs = document.querySelectorAll("input[name='mon_id']");
            if (monIdInputs){
                var monId,
                    monIds = "",
                    ignoreList = GM_getValue("ignoreList" + plIdSubKey) || "",
                    leadershipTbody,
                    exchangeButton;
                maxI = monIdInputs.length;

                for (i=0;i<maxI;i++){
                    monId = monIdInputs[i].value;
                    leadershipTbody = monIdInputs[i].parentElement.previousSibling.firstChild.firstChild;
                    exchangeButton = monIdInputs[i].nextSibling;

                    processLeadershipTbody(ignoreList, monId, leadershipTbody, exchangeButton, exchangePageInnerHTML);

                    monIds += (monId + "|"); // записываем все юниты с доступным обменом для последующей чистки игнор-листа
                }
            }

            // удаляем из игнор-листа юниты, которых нет на обмен
            var ignoreListArr = ignoreList.split("|").filter(function(element){return element !== "";});
            maxI = ignoreListArr.length;
            for (i=0;i<maxI;i++){
                monId = ignoreListArr[i];
                if (!checkUnitPresenсe(monIds, monId)){
                    GM_setValue("ignoreList" + plIdSubKey, ignoreList.replace(monId + "|", ""))
                }
            }

            break;
    }
})();