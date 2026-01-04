// ==UserScript==
// @name         HWM_MGRewardsStats
// @namespace    Небылица
// @version      1.06
// @description  Статистика золота и элементов, полученных в ГН
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/mercenary_guild\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/36802/HWM_MGRewardsStats.user.js
// @updateURL https://update.greasyfork.org/scripts/36802/HWM_MGRewardsStats.meta.js
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
    function saveToFile(data, filename, type){ // Сохраняет данные data в файл с именем filename, используя blob-объект с типом type (на базе https://stackoverflow.com/a/30832210)
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob){ // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else{ // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
    function addLeadingZero(string){ // Вставляет ведущий ноль в строку с элементом даты/времени, если в ней только 1 цифра
        string = string.toString();
        if (string.length === 1){string = "0" + string;}
        return string;
    }
    //


    // получаем id текущего персонажа и кусок ключа по нему
    var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1],
        plIdSubKey = "|#" + plId;
    // Забиваем в хранилище дефолтные значения для текущего персонажа (при наличии id-неспецифичных значений из версий 1.03- берём их и затем удаляем, иначе как обычно)
    if (GM_getValue("dataCollectionSince" + plIdSubKey) === undefined){ // дата начала сбора статистики
        if (GM_getValue("dataCollectionSince") === undefined){
            var currentMoment = new Date(),
                currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000);

            GM_setValue("dataCollectionSince" + plIdSubKey,
                        addLeadingZero(currentMomentOnServer.getDate()) + "." +
                        addLeadingZero((currentMomentOnServer.getMonth() + 1)) + "." +
                        currentMomentOnServer.getFullYear().toString().slice(2, 4) + " " +
                        addLeadingZero(currentMomentOnServer.getHours()) + ":" +
                        addLeadingZero(currentMomentOnServer.getMinutes())
                       );
        } else{
            GM_setValue("dataCollectionSince" + plIdSubKey, GM_getValue("dataCollectionSince"));
            GM_deleteValue("dataCollectionSince");
        }
    }
    if (GM_getValue("currentTask" + plIdSubKey) === undefined){ // текущее задание
        if (GM_getValue("currentTask") === undefined){
            GM_setValue("currentTask" + plIdSubKey, "-1");
        } else{
            GM_setValue("currentTask" + plIdSubKey, GM_getValue("currentTask"));
            GM_deleteValue("currentTask");
        }
    }
    if (GM_getValue("rewardsList" + plIdSubKey) === undefined){ // полный список наград
        if (GM_getValue("rewardsList") === undefined){
            GM_setValue("rewardsList" + plIdSubKey, "");
        } else{
            GM_setValue("rewardsList" + plIdSubKey, GM_getValue("rewardsList"));
            GM_deleteValue("rewardsList");
        }
    }

    if (GM_getValue("tasksTotal" + plIdSubKey) === undefined){ // общее число заданий
        if (GM_getValue("tasksTotal") === undefined){
            GM_setValue("tasksTotal" + plIdSubKey, 0);
        } else{
            GM_setValue("tasksTotal" + plIdSubKey, GM_getValue("tasksTotal"));
            GM_deleteValue("tasksTotal");
        }
    }
    if (GM_getValue("tasksAccomplished" + plIdSubKey) === undefined){ // успешно выполненных
        if (GM_getValue("tasksAccomplished") === undefined){
            GM_setValue("tasksAccomplished" + plIdSubKey, 0);
        } else{
            GM_setValue("tasksAccomplished" + plIdSubKey, GM_getValue("tasksAccomplished"));
            GM_deleteValue("tasksAccomplished");
        }
    }
    if (GM_getValue("tasksFailed" + plIdSubKey) === undefined){ // проваленных
        if (GM_getValue("tasksFailed") === undefined){
            GM_setValue("tasksFailed" + plIdSubKey, 0);
        } else{
            GM_setValue("tasksFailed" + plIdSubKey, GM_getValue("tasksFailed"));
            GM_deleteValue("tasksFailed");
        }
    }

    if (GM_getValue("goldTotal" + plIdSubKey) === undefined){ // всего золота получено
        if (GM_getValue("goldTotal") === undefined){
            GM_setValue("goldTotal" + plIdSubKey, 0);
        } else{
            GM_setValue("goldTotal" + plIdSubKey, GM_getValue("goldTotal"));
            GM_deleteValue("goldTotal");
        }
    }
    if (GM_getValue("elementsTotal" + plIdSubKey) === undefined){ // всего элементов получено
        if (GM_getValue("elementsTotal") === undefined){
            GM_setValue("elementsTotal" + plIdSubKey, 0);
        } else{
            GM_setValue("elementsTotal" + plIdSubKey, GM_getValue("elementsTotal"));
            GM_deleteValue("elementsTotal");
        }
    }
    if (GM_getValue("elementsDouble" + plIdSubKey) === undefined){ // двойных выпадений
        if (GM_getValue("elementsDouble") === undefined){
            GM_setValue("elementsDouble" + plIdSubKey, 0);
        } else{
            GM_setValue("elementsDouble" + plIdSubKey, GM_getValue("elementsDouble"));
            GM_deleteValue("elementsDouble");
        }
    }

    // счётчики полученного золота по типам заданий
    if (GM_getValue("goldFromArmies" + plIdSubKey) === undefined){ // армии
        if (GM_getValue("goldFromArmies") === undefined){
            GM_setValue("goldFromArmies" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromArmies" + plIdSubKey, GM_getValue("goldFromArmies"));
            GM_deleteValue("goldFromArmies");
        }
    }
    if (GM_getValue("goldFromConspirators" + plIdSubKey) === undefined){ // заговорщики
        if (GM_getValue("goldFromConspirators") === undefined){
            GM_setValue("goldFromConspirators" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromConspirators" + plIdSubKey, GM_getValue("goldFromConspirators"));
            GM_deleteValue("goldFromConspirators");
        }
    }
    if (GM_getValue("goldFromInvaders" + plIdSubKey) === undefined){ // захватчики
        if (GM_getValue("goldFromInvaders") === undefined){
            GM_setValue("goldFromInvaders" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromInvaders" + plIdSubKey, GM_getValue("goldFromInvaders"));
            GM_deleteValue("goldFromInvaders");
        }
    }
    if (GM_getValue("goldFromMonsters" + plIdSubKey) === undefined){ // монстры
        if (GM_getValue("goldFromMonsters") === undefined){
            GM_setValue("goldFromMonsters" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromMonsters" + plIdSubKey, GM_getValue("goldFromMonsters"));
            GM_deleteValue("goldFromMonsters");
        }
    }
    if (GM_getValue("goldFromRaids" + plIdSubKey) === undefined){ // набеги
        if (GM_getValue("goldFromRaids") === undefined){
            GM_setValue("goldFromRaids" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromRaids" + plIdSubKey, GM_getValue("goldFromRaids"));
            GM_deleteValue("goldFromRaids");
        }
    }
    if (GM_getValue("goldFromVanguards" + plIdSubKey) === undefined){ // отряды
        if (GM_getValue("goldFromVanguards") === undefined){
            GM_setValue("goldFromVanguards" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromVanguards" + plIdSubKey, GM_getValue("goldFromVanguards"));
            GM_deleteValue("goldFromVanguards");
        }
    }
    if (GM_getValue("goldFromBrigands" + plIdSubKey) === undefined){ // разбойники
        if (GM_getValue("goldFromBrigands") === undefined){
            GM_setValue("goldFromBrigands" + plIdSubKey, 0);
        } else{
            GM_setValue("goldFromBrigands" + plIdSubKey, GM_getValue("goldFromBrigands"));
            GM_deleteValue("goldFromBrigands");
        }
    }

    // счётчики выполненных заданий по типам
    if (GM_getValue("accomplishedArmies" + plIdSubKey) === undefined){ // армии
        if (GM_getValue("accomplishedArmies") === undefined){
            GM_setValue("accomplishedArmies" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedArmies" + plIdSubKey, GM_getValue("accomplishedArmies"));
            GM_deleteValue("accomplishedArmies");
        }
    }
    if (GM_getValue("accomplishedConspirators" + plIdSubKey) === undefined){ // заговорщики
        if (GM_getValue("accomplishedConspirators") === undefined){
            GM_setValue("accomplishedConspirators" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedConspirators" + plIdSubKey, GM_getValue("accomplishedConspirators"));
            GM_deleteValue("accomplishedConspirators");
        }
    }
    if (GM_getValue("accomplishedInvaders" + plIdSubKey) === undefined){ // захватчики
        if (GM_getValue("accomplishedInvaders") === undefined){
            GM_setValue("accomplishedInvaders" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedInvaders" + plIdSubKey, GM_getValue("accomplishedInvaders"));
            GM_deleteValue("accomplishedInvaders");
        }
    }
    if (GM_getValue("accomplishedMonsters" + plIdSubKey) === undefined){ // монстры
        if (GM_getValue("accomplishedMonsters") === undefined){
            GM_setValue("accomplishedMonsters" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedMonsters" + plIdSubKey, GM_getValue("accomplishedMonsters"));
            GM_deleteValue("accomplishedMonsters");
        }
    }
    if (GM_getValue("accomplishedRaids" + plIdSubKey) === undefined){ // набеги
        if (GM_getValue("accomplishedRaids") === undefined){
            GM_setValue("accomplishedRaids" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedRaids" + plIdSubKey, GM_getValue("accomplishedRaids"));
            GM_deleteValue("accomplishedRaids");
        }
    }
    if (GM_getValue("accomplishedVanguards" + plIdSubKey) === undefined){ // отряды
        if (GM_getValue("accomplishedVanguards") === undefined){
            GM_setValue("accomplishedVanguards" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedVanguards" + plIdSubKey, GM_getValue("accomplishedVanguards"));
            GM_deleteValue("accomplishedVanguards");
        }
    }
    if (GM_getValue("accomplishedBrigands" + plIdSubKey) === undefined){ // разбойники
        if (GM_getValue("accomplishedBrigands") === undefined){
            GM_setValue("accomplishedBrigands" + plIdSubKey, 0);
        } else{
            GM_setValue("accomplishedBrigands" + plIdSubKey, GM_getValue("accomplishedBrigands"));
            GM_deleteValue("accomplishedBrigands");
        }
    }

    // счётчики полученных элементов по типам
    if (GM_getValue("gainedAbrasives" + plIdSubKey) === undefined){ // арбазивы
        if (GM_getValue("gainedAbrasives") === undefined){
            GM_setValue("gainedAbrasives" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedAbrasives" + plIdSubKey, GM_getValue("gainedAbrasives"));
            GM_deleteValue("gainedAbrasives");
        }
    }
    if (GM_getValue("gainedViperVenoms" + plIdSubKey) === undefined){ // змеиные яды
        if (GM_getValue("gainedViperVenoms") === undefined){
            GM_setValue("gainedViperVenoms" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedViperVenoms" + plIdSubKey, GM_getValue("gainedViperVenoms"));
            GM_deleteValue("gainedViperVenoms");
        }
    }
    if (GM_getValue("gainedTigerClaws" + plIdSubKey) === undefined){ // клыки тигра
        if (GM_getValue("gainedTigerClaws") === undefined){
            GM_setValue("gainedTigerClaws" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedTigerClaws" + plIdSubKey, GM_getValue("gainedTigerClaws"));
            GM_deleteValue("gainedTigerClaws");
        }
    }
    if (GM_getValue("gainedIceCrystals" + plIdSubKey) === undefined){ // ледяные кристаллы
        if (GM_getValue("gainedIceCrystals") === undefined){
            GM_setValue("gainedIceCrystals" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedIceCrystals" + plIdSubKey, GM_getValue("gainedIceCrystals"));
            GM_deleteValue("gainedIceCrystals");
        }
    }
    if (GM_getValue("gainedMoonstones" + plIdSubKey) === undefined){ // лунные камни
        if (GM_getValue("gainedMoonstones") === undefined){
            GM_setValue("gainedMoonstones" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedMoonstones" + plIdSubKey, GM_getValue("gainedMoonstones"));
            GM_deleteValue("gainedMoonstones");
        }
    }
    if (GM_getValue("gainedFireCrystals" + plIdSubKey) === undefined){ // огненные кристаллы
        if (GM_getValue("gainedFireCrystals") === undefined){
            GM_setValue("gainedFireCrystals" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedFireCrystals" + plIdSubKey, GM_getValue("gainedFireCrystals"));
            GM_deleteValue("gainedFireCrystals");
        }
    }
    if (GM_getValue("gainedMeteoriteShards" + plIdSubKey) === undefined){ // осколки метеорита
        if (GM_getValue("gainedMeteoriteShards") === undefined){
            GM_setValue("gainedMeteoriteShards" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedMeteoriteShards" + plIdSubKey, GM_getValue("gainedMeteoriteShards"));
            GM_deleteValue("gainedMeteoriteShards");
        }
    }
    if (GM_getValue("gainedWitchBlooms" + plIdSubKey) === undefined){ // цветки ведьм
        if (GM_getValue("gainedWitchBlooms") === undefined){
            GM_setValue("gainedWitchBlooms" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedWitchBlooms" + plIdSubKey, GM_getValue("gainedWitchBlooms"));
            GM_deleteValue("gainedWitchBlooms");
        }
    }
    if (GM_getValue("gainedWindflowers" + plIdSubKey) === undefined){ // цветки ветров
        if (GM_getValue("gainedWindflowers") === undefined){
            GM_setValue("gainedWindflowers" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedWindflowers" + plIdSubKey, GM_getValue("gainedWindflowers"));
            GM_deleteValue("gainedWindflowers");
        }
    }
    if (GM_getValue("gainedFernFlowers" + plIdSubKey) === undefined){ // цветки папоротника
        if (GM_getValue("gainedFernFlowers") === undefined){
            GM_setValue("gainedFernFlowers" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedFernFlowers" + plIdSubKey, GM_getValue("gainedFernFlowers"));
            GM_deleteValue("gainedFernFlowers");
        }
    }
    if (GM_getValue("gainedToadstools" + plIdSubKey) === undefined){ // ядовитые грибы
        if (GM_getValue("gainedToadstools") === undefined){
            GM_setValue("gainedToadstools" + plIdSubKey, 0);
        } else{
            GM_setValue("gainedToadstools" + plIdSubKey, GM_getValue("gainedToadstools"));
            GM_deleteValue("gainedToadstools");
        }
    }
    //


    // задаём некоторые глобальные переменные
    var documentInnerHTHL = document.documentElement.innerHTML,
        currentTask = GM_getValue("currentTask" + plIdSubKey),
        rewardsList = GM_getValue("rewardsList" + plIdSubKey);
    // Код для страницы принятого задания
    if (documentInnerHTHL.indexOf("минут") !== -1 && documentInnerHTHL.indexOf("Принять") === -1 && documentInnerHTHL.indexOf("Вы еще не приняли это задание") === -1){
        // получаем и запоминаем текущее задание
        var currentTaskArr = documentInnerHTHL.match(/'<b>(.+?)<\/b>/);
        if (currentTaskArr !== null){
            GM_setValue("currentTask" + plIdSubKey, currentTaskArr[1]);
        }
    } else if (documentInnerHTHL.indexOf("мин.") === -1){ // если ни принятого, ни сданного (но ещё не обсчитанного) задания нет, то стираем сохранённое значение
        GM_setValue("currentTask" + plIdSubKey, "-1");
    }


    // Код для страницы сданного задания (с защитой от двойного прогона при обновлении страницы до появления нового)
    if (documentInnerHTHL.indexOf("мин.") !== -1 && currentTask !== "-1"){
        // увеличиваем счётчик сданных заданий
        GM_setValue("tasksTotal" + plIdSubKey, GM_getValue("tasksTotal" + plIdSubKey) + 1);

        // получаем текст награды (без статуса)
        var rewardArr = documentInnerHTHL.match(/<b>Вы\sполучаете\s(.+?)<\/b>/);
        if (rewardArr !== null){ // если награда есть
            var reward = rewardArr[1];

            // увеличиваем счётчик успешно выполненных заданий
            GM_setValue("tasksAccomplished" + plIdSubKey, GM_getValue("tasksAccomplished" + plIdSubKey) + 1);

            // увеличиваем кол-во полученного золота
            var gainedGold = parseInt(reward.match(/([\d]+?)\sзолота/)[1]);
            GM_setValue("goldTotal" + plIdSubKey, GM_getValue("goldTotal" + plIdSubKey) + gainedGold);

            // получаем тип задания
            var taskTypeArr = (currentTask !== undefined) ? currentTask.match(/(Армия|заговорщики|захватчики|монстр|набеги|Отряд|разбойники)/) : null,
                subKey = "";

            if (taskTypeArr !== null){
                // выставляем кусок ключа в зависимости от типа задания
                switch (taskTypeArr[1]){
                    case "Армия": subKey = "Armies";
                        break;

                    case "заговорщики": subKey = "Conspirators";
                        break;

                    case "захватчики": subKey = "Invaders";
                        break;

                    case "монстр": subKey = "Monsters";
                        break;

                    case "набеги": subKey = "Raids";
                        break;

                    case "Отряд": subKey = "Vanguards";
                        break;

                    case "разбойники": subKey = "Brigands";
                }

                // увеличиваем пару переменных (сумму полученного золота и счётчик выполненных), соответствующих типу задания
                if (subKey !== ""){
                    GM_setValue("goldFrom" + subKey + plIdSubKey, GM_getValue("goldFrom" + subKey + plIdSubKey) + gainedGold);
                    GM_setValue("accomplished" + subKey + plIdSubKey, GM_getValue("accomplished" + subKey + plIdSubKey) + 1);
                }
            }

            // получаем выпавшие элементы
            var gainedElementsArr = reward.match(/(абразив|змеиный\sяд|клык\sтигра|ледяной\sкристалл|лунный\sкамень|огненный\sкристалл|осколок\sметеорита|цветок\sведьм|цветок\sветров|цветок\sпапоротника|ядовитый\sгриб)/g);
            if (gainedElementsArr !== null){ // если элементы есть
                var gainedElementsNumber = gainedElementsArr.length;
                // увеличиваем общий счётчик выпавших элементов
                GM_setValue("elementsTotal" + plIdSubKey, GM_getValue("elementsTotal" + plIdSubKey) + gainedElementsNumber);

                // если выпало 2 элемента, то увеличиваем счётчик двойных
                if (gainedElementsNumber === 2){
                    GM_setValue("elementsDouble" + plIdSubKey, GM_getValue("elementsDouble" + plIdSubKey) + 1);
                }

                // цикл по массиву с элементами
                var i,
                    maxI = gainedElementsNumber;
                subKey = "";
                for (i=0;i<maxI;i++){
                    // выставляем кусок ключа в зависимости от типа элемента
                    switch (gainedElementsArr[i]){
                        case "абразив": subKey = "Abrasives";
                            break;

                        case "змеиный яд": subKey = "ViperVenoms";
                            break;

                        case "клык тигра": subKey = "TigerClaws";
                            break;

                        case "ледяной кристалл": subKey = "IceCrystals";
                            break;

                        case "лунный камень": subKey = "Moonstones";
                            break;

                        case "огненный кристалл": subKey = "FireCrystals";
                            break;

                        case "осколок метеорита": subKey = "MeteoriteShards";
                            break;

                        case "цветок ведьм": subKey = "WitchBlooms";
                            break;

                        case "цветок ветров": subKey = "Windflowers";
                            break;

                        case "цветок папоротника": subKey = "FernFlowers";
                            break;

                        case "ядовитый гриб": subKey = "Toadstools";
                    }

                    // увеличиваем счётчик выпадений соответствующего элемента
                    if (subKey !== ""){
                        GM_setValue("gained" + subKey + plIdSubKey, GM_getValue("gained" + subKey + plIdSubKey) + 1);
                    }
                }
            }

            // записываем в хранилище строчку для очередной награды (без номера задания)
            if (rewardsList !== ""){
                GM_setValue("rewardsList" + plIdSubKey, ": " + reward + " за '" + currentTask + "'" + "&#10;" + rewardsList);
            } else{
                GM_setValue("rewardsList" + plIdSubKey, ": " + reward + " за '" + currentTask + "'");
            }
            rewardsList = GM_getValue("rewardsList" + plIdSubKey); // обновляем переменную после перезаписи хранилища

            // запрашиваем страницу персонажа
            sendGETRequest("pl_info.php?id=" + plId, "text/html; charset=windows-1251", function(){
                // получаем номер выполненного задания
                var taskNumberArr = this.responseText.match(/Гильдия\sНаемников:\s[\d]{1,2}\s\((.+?)\)\s<font\sstyle=/),
                    taskNumber = (taskNumberArr !== null) ? taskNumberArr[1] : "";

                // добавляем в хранилище номер задания
                GM_setValue("rewardsList" + plIdSubKey, taskNumber + rewardsList);
            });
        } else{ // если награды нет и есть красный статус
            if (documentInnerHTHL.indexOf("<b>Статус</b>: <font color=\"red\"><b>") !== -1){
                // увеличиваем счётчик проваленных заданий
                GM_setValue("tasksFailed" + plIdSubKey, GM_getValue("tasksFailed" + plIdSubKey) + 1);
            }
        }

        // забываем текущее задание
        GM_setValue("currentTask" + plIdSubKey, "-1");
    }


    // Код отображения статистики
    var MGRewardsStatsHeaderDiv = document.createElement("div"); // создаём элемент для вставки
    MGRewardsStatsHeaderDiv.setAttribute("id", "MGRewardsStatsHeaderDiv"); // задаём ему id

    // вводим переменные для доступа к значениям из хранилища
    var tasksTotal = GM_getValue("tasksTotal" + plIdSubKey),
        tasksAccomplished = GM_getValue("tasksAccomplished" + plIdSubKey),
        tasksFailed = GM_getValue("tasksFailed" + plIdSubKey),

        goldTotal = GM_getValue("goldTotal" + plIdSubKey),
        elementsTotal = GM_getValue("elementsTotal" + plIdSubKey),
        elementsDouble = GM_getValue("elementsDouble" + plIdSubKey),

        goldFromArmies = GM_getValue("goldFromArmies" + plIdSubKey),
        goldFromConspirators = GM_getValue("goldFromConspirators" + plIdSubKey),
        goldFromInvaders = GM_getValue("goldFromInvaders" + plIdSubKey),
        goldFromMonsters = GM_getValue("goldFromMonsters" + plIdSubKey),
        goldFromRaids = GM_getValue("goldFromRaids" + plIdSubKey),
        goldFromVanguards = GM_getValue("goldFromVanguards" + plIdSubKey),
        goldFromBrigands = GM_getValue("goldFromBrigands" + plIdSubKey),

        accomplishedArmies = GM_getValue("accomplishedArmies" + plIdSubKey),
        accomplishedConspirators = GM_getValue("accomplishedConspirators" + plIdSubKey),
        accomplishedInvaders = GM_getValue("accomplishedInvaders" + plIdSubKey),
        accomplishedMonsters = GM_getValue("accomplishedMonsters" + plIdSubKey),
        accomplishedRaids = GM_getValue("accomplishedRaids" + plIdSubKey),
        accomplishedVanguards = GM_getValue("accomplishedVanguards" + plIdSubKey),
        accomplishedBrigands = GM_getValue("accomplishedBrigands" + plIdSubKey),

        gainedAbrasives = GM_getValue("gainedAbrasives" + plIdSubKey),
        gainedViperVenoms = GM_getValue("gainedViperVenoms" + plIdSubKey),
        gainedTigerClaws = GM_getValue("gainedTigerClaws" + plIdSubKey),
        gainedIceCrystals = GM_getValue("gainedIceCrystals" + plIdSubKey),
        gainedMoonstones = GM_getValue("gainedMoonstones" + plIdSubKey),
        gainedFireCrystals = GM_getValue("gainedFireCrystals" + plIdSubKey),
        gainedMeteoriteShards = GM_getValue("gainedMeteoriteShards" + plIdSubKey),
        gainedWitchBlooms = GM_getValue("gainedWitchBlooms" + plIdSubKey),
        gainedWindflowers = GM_getValue("gainedWindflowers" + plIdSubKey),
        gainedFernFlowers = GM_getValue("gainedFernFlowers" + plIdSubKey),
        gainedToadstools = GM_getValue("gainedToadstools" + plIdSubKey);

    // собираем строчки с дополнительной информацией в скобках при различных показателях
    var tasksAccomplishedPercentageString = (tasksTotal !== 0) ? " (" + Math.round(tasksAccomplished/tasksTotal*100) + "%)" : "",
        tasksFailedPercentageString = (tasksTotal !== 0) ? " (" + (100 - Math.round(tasksAccomplished/tasksTotal*100)) + "%)" : "",
        goldTotalPerTaskString = (tasksAccomplished !== 0) ? " (" + Math.round(goldTotal/tasksAccomplished) + "/зад.)" : "",
        elementsTotalPercentageString = (tasksAccomplished !== 0) ? " (<span title='Шанс на получение хотя бы одного элемента с задания'>" + Math.round((elementsTotal-elementsDouble)/tasksAccomplished*100) + "%</span>; <span title='Среднее количество элементов на задание (с учётом двойных)'>" + (elementsTotal/tasksAccomplished).toFixed(2) + "</span>)" : "",
        elementsDoublePercentageString = (tasksAccomplished !== 0) ? " (<span title='Шанс на двойное выпадение элементов в расчёте на задание'>" + (elementsDouble/tasksAccomplished*100).toFixed(2) + "%</span>)" : "",

        goldFromArmiesPerTaskString = (accomplishedArmies !== 0) ? " (" + Math.round(goldFromArmies/accomplishedArmies) + "/зад.)" : "",
        goldFromConspiratorsPerTaskString = (accomplishedConspirators !== 0) ? " (" + Math.round(goldFromConspirators/accomplishedConspirators) + "/зад.)" : "",
        goldFromInvadersPerTaskString = (accomplishedInvaders !== 0) ? " (" + Math.round(goldFromInvaders/accomplishedInvaders) + "/зад.)" : "",
        goldFromMonstersPerTaskString = (accomplishedMonsters !== 0) ? " (" + Math.round(goldFromMonsters/accomplishedMonsters) + "/зад.)" : "",
        goldFromRaidsPerTaskString = (accomplishedRaids !== 0) ? " (" + Math.round(goldFromRaids/accomplishedRaids) + "/зад.)" : "",
        goldFromVanguardsPerTaskString = (accomplishedVanguards !== 0) ? " (" + Math.round(goldFromVanguards/accomplishedVanguards) + "/зад.)" : "",
        goldFromBrigandsPerTaskString = (accomplishedBrigands !== 0) ? " (" + Math.round(goldFromBrigands/accomplishedBrigands) + "/зад.)" : "",

        gainedAbrasivesPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedAbrasives/elementsTotal*100) + "%)" : "",
        gainedViperVenomsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedViperVenoms/elementsTotal*100) + "%)" : "",
        gainedTigerClawsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedTigerClaws/elementsTotal*100) + "%)" : "",
        gainedIceCrystalsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedIceCrystals/elementsTotal*100) + "%)" : "",
        gainedMoonstonesPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedMoonstones/elementsTotal*100) + "%)" : "",
        gainedFireCrystalsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedFireCrystals/elementsTotal*100) + "%)" : "",
        gainedMeteoriteShardsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedMeteoriteShards/elementsTotal*100) + "%)" : "",
        gainedWitchBloomsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedWitchBlooms/elementsTotal*100) + "%)" : "",
        gainedWindflowersPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedWindflowers/elementsTotal*100) + "%)" : "",
        gainedFernFlowersPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedFernFlowers/elementsTotal*100) + "%)" : "",
        gainedToadstoolsPercentageString = (elementsTotal !== 0) ? " (" + Math.round(gainedToadstools/elementsTotal*100) + "%)" : "";

    // задаём код элемента для вставки
    MGRewardsStatsHeaderDiv.innerHTML =
        "<style>" +

        "#MGRewardsStatsHeaderDiv{" +
        "margin: 7px 0px 5px 0px;" +
        "text-align: center;" +
        "}" +

        "#MGRewardsStatsHeaderTitleShowHide, #MGRewardsStatsInnerDiv2TitleShowHide, #MGRewardsStatsInnerDiv3TitleShowHide, #MGRewardsStatsInnerDiv4TitleShowHide, #MGRewardsStatsInnerDiv4TitleExportToFile{" +
        "color: blue;" +
        "cursor: pointer;" +
        "}" +

        "#MGRewardsStatsInnerDiv1{" +
        "margin: 5px 0px 15px 0px;" +
        "}" +

        "#MGRewardsStatsInnerDiv2InnerContainer, #MGRewardsStatsInnerDiv3InnerContainer, #MGRewardsStatsInnerDiv4InnerContainer{" +
        "margin: 5px 0px 5px 0px;" +
        "}" +

        "#MGRewardsStatsInnerDiv4InnerContainer{" +
        "padding: 0% 20% 0% 20%;" +
        "text-align: left;" +
        "white-space: pre-wrap;" +
        "}" +

        ".MGRewardsStatsInnerSpanLeft{" +
        "display: inline-block;" +
        "width: 53%;" +
        "text-align: right;" +
        "}" +

        ".MGRewardsStatsInnerSpanRight{" +
        "display: inline-block;" +
        "width: 47%;" +
        "text-align: left;" +
        "}" +

        "</style>" +


        "<hr width='90%'>" +
        "<div id='MGRewardsStatsHeaderTitle'>" +

        "<b>Статистика наград ГН</b>: " +
        "<font id='MGRewardsStatsHeaderTitleShowHide'>" +
        "показать информацию" +
        "</font>" +

        "</div>" +

        "<div id='MGRewardsStatsInnerContainer'>" +


        "<div id='MGRewardsStatsInnerDiv1'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Сдано заданий: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + tasksTotal + "</b></span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Выполнено: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + tasksAccomplished + "</b>" + tasksAccomplishedPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Провалено: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + tasksFailed + "</b>" + tasksFailedPercentageString + "</span><br>" +
        "<br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Золота получено: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldTotal + "</b>" + goldTotalPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Элементов: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + elementsTotal + "</b>" + elementsTotalPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Двойных: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + elementsDouble + "</b>" + elementsDoublePercentageString + "</span><br>" +
        "<br>" +
        "<font size='1'>Сбор данных идёт с " + GM_getValue("dataCollectionSince" + plIdSubKey) + "</font>" +
        "</div>" +


        "<div id='MGRewardsStatsInnerDiv2'>" +

        "<div id='MGRewardsStatsInnerDiv2Title'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'><b>Золото по заданиям</b>: </span><span class='MGRewardsStatsInnerSpanRight'>" + "<font id='MGRewardsStatsInnerDiv2TitleShowHide'>" +
        "показать" +
        "</font></span>" +
        "</div>" +

        "<div id='MGRewardsStatsInnerDiv2InnerContainer'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Армии: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromArmies + "</b>" + goldFromArmiesPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Заговорщики: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromConspirators + "</b>" + goldFromConspiratorsPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Захватчики: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromInvaders + "</b>" + goldFromInvadersPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Монстры: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromMonsters + "</b>" + goldFromMonstersPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Набеги: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromRaids + "</b>" + goldFromRaidsPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Отряды: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromVanguards + "</b>" + goldFromVanguardsPerTaskString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Разбойники: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + goldFromBrigands + "</b>" + goldFromBrigandsPerTaskString + "</span><br>" +
        "</div>" +

        "</div>" +


        "<div id='MGRewardsStatsInnerDiv3'>" +

        "<div id='MGRewardsStatsInnerDiv3Title'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'><b>Элементы по видам</b>: </span><span class='MGRewardsStatsInnerSpanRight'>" + "<font id='MGRewardsStatsInnerDiv3TitleShowHide'>" +
        "показать" +
        "</font></span>" +
        "</div>" +

        "<div id='MGRewardsStatsInnerDiv3InnerContainer'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Абразив: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedAbrasives + "</b>" + gainedAbrasivesPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Змеиный яд: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedViperVenoms + "</b>" + gainedViperVenomsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Клык тигра: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedTigerClaws + "</b>" + gainedTigerClawsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Ледяной кристалл: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedIceCrystals + "</b>" + gainedIceCrystalsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Лунный камень: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedMoonstones + "</b>" + gainedMoonstonesPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Огненный кристалл: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedFireCrystals + "</b>" + gainedFireCrystalsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Осколок метеорита: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedMeteoriteShards + "</b>" + gainedMeteoriteShardsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Цветок ведьм: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedWitchBlooms + "</b>" + gainedWitchBloomsPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Цветок ветров: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedWindflowers + "</b>" + gainedWindflowersPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Цветок папоротника: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedFernFlowers + "</b>" + gainedFernFlowersPercentageString + "</span><br>" +
        "<span class='MGRewardsStatsInnerSpanLeft'>Ядовитый гриб: </span><span class='MGRewardsStatsInnerSpanRight'><b>" + gainedToadstools + "</b>" + gainedToadstoolsPercentageString + "</span><br>" +
        "</div>" +

        "</div>" +


        "<div id='MGRewardsStatsInnerDiv4'>" +

        "<div id='MGRewardsStatsInnerDiv4Title'>" +
        "<span class='MGRewardsStatsInnerSpanLeft'><b>Полный список наград</b>: </span><span class='MGRewardsStatsInnerSpanRight'>" +
        "<font id='MGRewardsStatsInnerDiv4TitleShowHide'>" +
        "показать" +
        "</font>" +
        " / " +
        "<font id='MGRewardsStatsInnerDiv4TitleExportToFile'>" +
        "сохранить в файл" +
        "</font>" +
        "</span>" +
        "</div>" +

        "<div id='MGRewardsStatsInnerDiv4InnerContainer'>" +
        "</div>" +

        "</div>" +


        "</div>";

    // увеличиваем отступ на странице сданного задания и при наличии доступного, но не просмотренного задания и нахождении в другом районе
    if (documentInnerHTHL.indexOf("мин.") !== -1 || documentInnerHTHL.indexOf("Для Вас есть задание") !== -1){
        MGRewardsStatsHeaderDiv.style.margin = "20px 0px 5px 0px";
    }
    // убираем дублирование горизонтальной линии при просмотре из другого района страницы сданного задания (без награды, с таймером до нового)
    if (documentInnerHTHL.indexOf("Вы находитесь в другом районе") !== -1 && documentInnerHTHL.indexOf("минут") === -1 && documentInnerHTHL.indexOf("Для Вас есть задание") === -1){
        var hr = document.querySelector("hr[width='90%']");
        hr.parentNode.removeChild(hr);
    }

    // вставляем элемент в страницу
    document.querySelector("td[rowspan='2']").appendChild(MGRewardsStatsHeaderDiv);

    // задаём переменные для доступа к добавленным элементам
    var MGRewardsStatsInnerContainer = document.getElementById("MGRewardsStatsInnerContainer"),
        MGRewardsStatsHeaderTitleShowHide = document.getElementById("MGRewardsStatsHeaderTitleShowHide"),

        MGRewardsStatsInnerDiv2InnerContainer = document.getElementById("MGRewardsStatsInnerDiv2InnerContainer"),
        MGRewardsStatsInnerDiv2TitleShowHide = document.getElementById("MGRewardsStatsInnerDiv2TitleShowHide"),

        MGRewardsStatsInnerDiv3InnerContainer = document.getElementById("MGRewardsStatsInnerDiv3InnerContainer"),
        MGRewardsStatsInnerDiv3TitleShowHide = document.getElementById("MGRewardsStatsInnerDiv3TitleShowHide"),

        MGRewardsStatsInnerDiv4InnerContainer = document.getElementById("MGRewardsStatsInnerDiv4InnerContainer"),
        MGRewardsStatsInnerDiv4TitleShowHide = document.getElementById("MGRewardsStatsInnerDiv4TitleShowHide"),
        MGRewardsStatsInnerDiv4TitleExportToFile = document.getElementById("MGRewardsStatsInnerDiv4TitleExportToFile");

    // по умолчанию скрываем внутренние блоки
    MGRewardsStatsInnerContainer.style.display = "none";
    MGRewardsStatsInnerDiv2InnerContainer.style.display = "none";
    MGRewardsStatsInnerDiv3InnerContainer.style.display = "none";
    MGRewardsStatsInnerDiv4InnerContainer.style.display = "none";

    // вешаем событие по клику на "показать/скрыть информацию" в заголовке главного информационного блока статистики
    MGRewardsStatsHeaderTitleShowHide.onclick = function(){
        // если скрыто, то показываем; если открыто, то скрываем; ставим соответствующий текст на кнопке
        if (MGRewardsStatsInnerContainer.style.display === "none"){
            MGRewardsStatsInnerContainer.style.display = "block";
            MGRewardsStatsHeaderTitleShowHide.innerHTML = "скрыть информацию";
        } else{
            MGRewardsStatsInnerContainer.style.display = "none";
            MGRewardsStatsHeaderTitleShowHide.innerHTML = "показать информацию";
        }
    };

    // задаём события по клику на "показать/скрыть" в заголовках внутренних блоков
    MGRewardsStatsInnerDiv2TitleShowHide.onclick = function(){
        // если скрыто, то показываем; если открыто, то скрываем; ставим соответствующий текст на кнопке
        if (MGRewardsStatsInnerDiv2InnerContainer.style.display === "none"){
            MGRewardsStatsInnerDiv2InnerContainer.style.display = "block";
            MGRewardsStatsInnerDiv2TitleShowHide.innerHTML = "скрыть";
        } else{
            MGRewardsStatsInnerDiv2InnerContainer.style.display = "none";
            MGRewardsStatsInnerDiv2TitleShowHide.innerHTML = "показать";
        }
    };

    MGRewardsStatsInnerDiv3TitleShowHide.onclick = function(){
        // если скрыто, то показываем; если открыто, то скрываем; ставим соответствующий текст на кнопке
        if (MGRewardsStatsInnerDiv3InnerContainer.style.display === "none"){
            MGRewardsStatsInnerDiv3InnerContainer.style.display = "block";
            MGRewardsStatsInnerDiv3TitleShowHide.innerHTML = "скрыть";
        } else{
            MGRewardsStatsInnerDiv3InnerContainer.style.display = "none";
            MGRewardsStatsInnerDiv3TitleShowHide.innerHTML = "показать";
        }
    };

    MGRewardsStatsInnerDiv4TitleShowHide.onclick = function(){
        rewardsList = GM_getValue("rewardsList" + plIdSubKey);
        // задаём код элемента; если скрыт, то показываем; если открыт, то скрываем; ставим соответствующий текст на кнопке
        if (MGRewardsStatsInnerDiv4InnerContainer.style.display === "none"){
            if (rewardsList !== ""){ // вставляем плейсхолдер при отсутствии сохранённых наград
                MGRewardsStatsInnerDiv4InnerContainer.innerHTML = rewardsList;
            } else{
                MGRewardsStatsInnerDiv4InnerContainer.style.padding = "0px";
                MGRewardsStatsInnerDiv4InnerContainer.innerHTML = "<center>(пока не сохранено ни одной награды)</center>";
            }

            MGRewardsStatsInnerDiv4InnerContainer.style.display = "block";
            MGRewardsStatsInnerDiv4TitleShowHide.innerHTML = "скрыть";
        } else{
            MGRewardsStatsInnerDiv4InnerContainer.style.display = "none";
            MGRewardsStatsInnerDiv4TitleShowHide.innerHTML = "показать";
        }
    };

    // вешаем событие по клику на "сохранить в файл" в заголовке блока с полным списком наград
    MGRewardsStatsInnerDiv4TitleExportToFile.onclick = function(){
        rewardsList = GM_getValue("rewardsList" + plIdSubKey);
        sendGETRequest("pl_info.php?id=" + plId, "text/html; charset=windows-1251", function(){
            // получаем ник персонажа, текущую дату в формате dd-mm-yy и сохраняем список наград в txt-файл
            var currentMoment = new Date(),
                currentMomentOnServer = new Date(Date.now() + currentMoment.getTimezoneOffset()*60000 + 10800000),
                plNickArr = this.responseText.match(/alt=""\salign=absmiddle>(.+?)&nbsp;&nbsp;\[\d+\]&nbsp;<img/),
                plNick = (plNickArr !== null) ? plNickArr[1] : "персонажа #" + plId,

                filename =
                "Статистика наград ГН " +
                plNick + " " +
                addLeadingZero(currentMomentOnServer.getDate()) + "-" +
                addLeadingZero(currentMomentOnServer.getMonth() + 1) + "-" +
                currentMomentOnServer.getFullYear().toString().slice(2, 4) +
                ".txt";

            saveToFile(rewardsList.replace(/&#10;/g, "\r\n"), filename, "text/plain");
        });
    };
})();