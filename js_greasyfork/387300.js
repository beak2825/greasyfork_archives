// ==UserScript==
// @name         HWM_UnitsAssessment
// @namespace    Небылица
// @version      1.1
// @description  Оценка силы существ в расчёте на лидерство/стоимость
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(army_info|leader_army)\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387300/HWM_UnitsAssessment.user.js
// @updateURL https://update.greasyfork.org/scripts/387300/HWM_UnitsAssessment.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Настройки – вес стата
    const statWeight = 0.033;
    //

    // Вспомогательные функции
    Number.prototype.roundTo = function(digits){ // Oкругление числа до digits знаков после запятой
        return Math.round(this*(10**digits))/(10**digits);
    }
    function insertAfter(newNode, referenceNode){ // Вставка newNode после referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function assess(){ // Расчёт и вывод показателей для текущего существа
        var params = document.querySelectorAll(".scroll_content_half > div"),
            paramsNumbers = (LGArmyPage) ? [0, 2, 4, 6, 10, 11] : [0, 2, 4, 6, 7, 9], // номера нужных граф на странице ГЛ и на странице существа
            attack = parseInt(params[paramsNumbers[0]].innerText),
            defence = parseInt(params[paramsNumbers[1]].innerText),
            damageArr = params[paramsNumbers[2]].innerText.split("-"),
            damageMin = parseInt(damageArr[0]),
            damageMax = parseInt(damageArr[1]),
            damageBonus = (!LGArmyPage && GM_getValue("BFEnabled")) ? 1 : 0, // учёт урона с ББ на странице отряда при наличии соотв. настройки
            damageAvg = (damageMin+damageMax)/2 + damageBonus,
            HPBonus = (!LGArmyPage && GM_getValue("vitalityEnabled")) ? 2 : 0, // учёт ХП со стойкостью на странице отряда при наличии соотв. настройки
            HP = parseInt(params[paramsNumbers[3]].innerText) + HPBonus,
            ini = parseInt(params[paramsNumbers[4]].innerText),
            leadershipText = params[paramsNumbers[5]].innerText.replace(",", "") || params[paramsNumbers[5]].firstChild.value, // лидерство без и с полем ввода своей цены
            leadership = parseInt(leadershipText) || "?",

            // 1000 – нормировочная константа для получения удобного для восприятия порядка величин
            damage = 1000*(damageAvg*(ini/10)*(1+statWeight*attack)),
            defenceWeight = (!LGArmyPage && GM_getValue("calculateWithoutDef")) ? 0 : statWeight, // расчёт без учёта дефа на странице отряда при наличии соотв. настройки
            vitality = 1000*(HP*(1+defenceWeight*defence)),
            damagePer = (damage/leadership).roundTo(2) || "?",
            vitalityPer = (vitality/leadership).roundTo(2) || "?",
            strength = Math.sqrt(damagePer*vitalityPer).roundTo(2) || "?",
            ECE = (100*(damage/vitality)).roundTo(2);

        damagePerInnerDiv.innerText = damagePer;
        vitalityPerInnerDiv.innerText = vitalityPer;
        strengthInnerDiv.innerText = strength;
        ECEInnerDiv.innerText = ECE;
    }
    function setupReassessment(){ // Привязка перерасчёта параметров к смене юнита на странице ГЛ
        var unitNameDiv = document.getElementById("unit_name"),
            observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation){
                    assess();
                });
            }),
            config = {characterData: false, attributes: false, childList: true, subtree: false};
        observer.observe(unitNameDiv, config);
    }
    function setLeadershipTitle(){ // Замена "Лидерства" на "Стоимость" в зависимости от того, выбран ли ручной ввод
        leadershipTitle = (customPriceCheckbox.checked) ? "Стоимость" : "Лидерство";
        leadershipTitleNode.nodeValue = leadershipTitle;
    }
    function setupLeadershipNumberElement(){ // Отрисовывает элемент со стоимостью стека и вешает событие по изменению кастомной цены в зависимости от сохранённой настройки
        if (GM_getValue("customPriceEnabled")){
            leadershipNumber.innerHTML = "<input type='text' value='" + oldLeadership + "'>";

            var leadershipNumberInput = leadershipNumber.firstChild;
            leadershipNumberInput.setAttribute("id", "unitsAssessmentLeadershipNumberInput");

            leadershipNumberInput.style =
                "width: 50px;" +
                "height: 19px;" +
                "background-image: linear-gradient(rgb(166, 166, 166), rgb(163, 163, 163));" +
                "border: 0px;" +
                "text-align: right;" +
                "font-size: 15.6px;" +
                "font-weight: bold;" +
                "font-family: verdana, geneva, arial cyr;" +
                "color: #000000;";

            // вешаем событие по изменению кастомной цены
            leadershipNumberInput.oninput = function(){
                if (leadershipNumberInput.value.match(/^\d+$/)){ // если лидерство – число, то считаем показатели
                    assess();
                }
            };
        } else{
            leadershipNumber.innerHTML = oldLeadership;
        }
    }
    function imitateCheck(checkbox){ // Имитация нажатия на чекбокс
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(changeEvent);
    }
    //


    const LGArmyPage = location.href.match("/leader_army"),
          emptyImageSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAANSURBVHicY2AYBdQEAAFQAAHr5ijJAAAAAElFTkSuQmCC";

    var damagePerDiv = document.createElement("div"),
        vitalityPerDiv = document.createElement("div"),
        strengthDiv = document.createElement("div"),
        ECEDiv = document.createElement("div"),
        armyInfo = document.getElementsByClassName("info_text_content")[0];

    damagePerDiv.setAttribute("class", "scroll_content_half");
    vitalityPerDiv.setAttribute("class", "scroll_content_half");
    strengthDiv.setAttribute("class", "scroll_content_half");
    ECEDiv.setAttribute("class", "scroll_content_half");

    var rightColPaddingLeft = (LGArmyPage) ? "0.45em" : "0.3em";
    vitalityPerDiv.style.paddingLeft = rightColPaddingLeft;
    ECEDiv.style.paddingLeft = rightColPaddingLeft;

    damagePerDiv.innerHTML =
        "<img src='" + emptyImageSrc + "' width='48' height='48'>Дамажность<div id='unitsAssessmentDamagePerInnerDiv'></div>";
    vitalityPerDiv.innerHTML =
        "<img src='" + emptyImageSrc + "' width='48' height='48'>Живучесть<div id='unitsAssessmentVitalityPerInnerDiv'></div>";
    strengthDiv.innerHTML =
        "<img src='" + emptyImageSrc + "' width='48' height='48'>Сила<div id='unitsAssessmentStrengthInnerDiv'></div>";
    ECEDiv.innerHTML =
        "<img src='" + emptyImageSrc + "' width='48' height='48'>КПД<div id='unitsAssessmentECEInnerDiv'></div>";

    damagePerDiv.title =
        "Чем Дамажность больше, тем больше ДПС (дамага на время) приходится на единицу лидерства. " +
        "Учитываются урон, статы атаки и инициатива (как модификатор при расчёте ДПС, без учёта возможного эффекта от права первого удара). " +
        "Значение ориентировочное, абилки НЕ учитываются. Рассчитано с весом стата = " +
        statWeight + ". Совокупность Дамажности и Живучести составляет Силу. Отношение этих двух показателей – КПД.";
    vitalityPerDiv.title =
        "Чем Живучесть больше, тем больше мяса приходится на единицу лидерства. Учитываются здоровье и статы защиты. " +
        "Значение ориентировочное, абилки НЕ учитываются. Рассчитано с весом стата = " +
        statWeight + ". Совокупность Дамажности и Живучести составляет Силу. Отношение этих двух показателей – КПД.";
    strengthDiv.title =
        "Чем Сила больше, тем больше ДПС и мяса приходится на единицу лидерства (и тем лучше). " +
        "Учитываются урон, здоровье, статы атаки и защиты, инициатива (как модификатор при расчёте ДПС, без учёта возможного эффекта от права первого удара). " +
        "Значение ориентировочное, абилки НЕ учитываются. Рассчитано с весом стата = " +
        statWeight + ". Увеличение/уменьшение лидерства в n раз = синхронное уменьшение/увеличение и урона, и ХП в n раз = уменьшение/увеличение Силы в n раз. " +
        "При досчитывании показателя отдельно по 1 составляющей (для учёта абилок в каждом конкретном сценарии их реализации) " +
        "надо брать корень из модификатора разницы (урон вдвое выше – Сила в 1.41 раза выше).";
    ECEDiv.title =
        "Сколько процентов составляет урон от мяса (актуально не только для ГЛ, лидерство не влияет). " +
        "Чем он больше, тем больше ДПС приходится на единицу ХП (юнит более дамажный и тонкий); чем меньше – тем более мясной. " +
        "Могут быть оптимальны различные показатели в зависимости от стиля игры. " +
        "В общем случае желательна близость всех боевых юнитов в наборе по КПД (за исключением коробочной связки). " +
        "Рассчитано с весом стата = " + statWeight + ".";

    armyInfo.appendChild(damagePerDiv);
    armyInfo.appendChild(vitalityPerDiv);
    armyInfo.appendChild(strengthDiv);
    armyInfo.appendChild(ECEDiv);

    var damagePerInnerDiv = document.getElementById("unitsAssessmentDamagePerInnerDiv"),
        vitalityPerInnerDiv = document.getElementById("unitsAssessmentVitalityPerInnerDiv"),
        strengthInnerDiv = document.getElementById("unitsAssessmentStrengthInnerDiv"),
        ECEInnerDiv = document.getElementById("unitsAssessmentECEInnerDiv");

    // активируем расчёт в зависимости от страницы
    if (LGArmyPage){
        setupReassessment();
    } else{
        assess();

        // рисуем и вставляем чекбоксы с настройками
        var frameDiv = document.getElementsByClassName("army_info")[0],
            showArmyDiv = document.getElementById("show_army"),
            settingsDiv = document.createElement("div");

        if (frameDiv.clientHeight < 410){frameDiv.style.height = "410px";} // растягиваем поле с параметрами при недостаточной высоте

        settingsDiv.setAttribute("id", "unitsAssessmentSettingsDiv");
        settingsDiv.innerHTML =
            "<style>" +
            "#unitsAssessmentSettingsDiv{" +
            "width: 300px;" +
            "height: 40px;" +
            "margin-left: 656px;" +
            "font-size: 10pt;" +
            "font-weight: bold;" +
            "color: #272727;" +
            "}" +

            "#unitsAssessmentSettingsCustomPriceSpan, #unitsAssessmentSettingsCalculateWithoutDefSpan," +
            "#unitsAssessmentSettingsBFSpan, #unitsAssessmentSettingsVitalitySpan{" +
            "display: inline-block;" +
            "width: 48%;" +
            "margin: 2px 0px 0px 4px;" +
            "}" +

            "#unitsAssessmentSettingsCustomPriceTitle, #unitsAssessmentSettingsCalculateWithoutDefTitle," +
            "#unitsAssessmentSettingsBFTitle, #unitsAssessmentSettingsVitalityTitle{" +
            "display: inline-block;" +
            "width: 87%;" +
            "text-align: left;" +
            "}" +

            "#unitsAssessmentSettingsCustomPriceCheckboxSpan, #unitsAssessmentSettingsCalculateWithoutDefCheckboxSpan," +
            "#unitsAssessmentSettingsBFCheckboxSpan, #unitsAssessmentSettingsVitalityCheckboxSpan{" +
            "display: inline-block;" +
            "width: 13%;" +
            "text-align: right;" +
            "}" +
            "</style>" +

            "<span id='unitsAssessmentSettingsCustomPriceSpan'><span id='unitsAssessmentSettingsCustomPriceTitle'>Ручной ввод</span><span id='unitsAssessmentSettingsCustomPriceCheckboxSpan'><input type='checkbox' id='unitsAssessmentSettingsCustomPriceCheckbox'></span></span>" +
            "<span id='unitsAssessmentSettingsCalculateWithoutDefSpan'><span id='unitsAssessmentSettingsCalculateWithoutDefTitle'>Без учёта дефа</span><span id='unitsAssessmentSettingsCalculateWithoutDefCheckboxSpan'><input type='checkbox' id='unitsAssessmentSettingsCalculateWithoutDefCheckbox'></span></span><br>" +
            "<span id='unitsAssessmentSettingsBFSpan'><span id='unitsAssessmentSettingsBFTitle'>Боевое безумие</span><span id='unitsAssessmentSettingsBFCheckboxSpan'><input type='checkbox' id='unitsAssessmentSettingsBFCheckbox'></span></span>" +
            "<span id='unitsAssessmentSettingsVitalitySpan'><span id='unitsAssessmentSettingsVitalityTitle'>Стойкость</span><span id='unitsAssessmentSettingsVitalityCheckboxSpan'><input type='checkbox' id='unitsAssessmentSettingsVitalityCheckbox'></span></span>";

        insertAfter(settingsDiv, showArmyDiv);

        // задаём переменные для созданных элементов
        var customPriceSpan = document.getElementById("unitsAssessmentSettingsCustomPriceSpan"),
            calculateWithoutDefSpan = document.getElementById("unitsAssessmentSettingsCalculateWithoutDefSpan"),
            BFSpan = document.getElementById("unitsAssessmentSettingsBFSpan"),
            vitalitySpan = document.getElementById("unitsAssessmentSettingsVitalitySpan"),

            customPriceTitle = document.getElementById("unitsAssessmentSettingsCustomPriceTitle"),
            calculateWithoutDefTitle = document.getElementById("unitsAssessmentSettingsCalculateWithoutDefTitle"),
            BFTitle = document.getElementById("unitsAssessmentSettingsBFTitle"),
            vitalityTitle = document.getElementById("unitsAssessmentSettingsVitalityTitle"),

            customPriceCheckbox = document.getElementById("unitsAssessmentSettingsCustomPriceCheckbox"),
            calculateWithoutDefCheckbox = document.getElementById("unitsAssessmentSettingsCalculateWithoutDefCheckbox"),
            BFCheckbox = document.getElementById("unitsAssessmentSettingsBFCheckbox"),
            vitalityCheckbox = document.getElementById("unitsAssessmentSettingsVitalityCheckbox"),

            RBCorner = document.querySelector(".corner_rb"); // и для уголка

        customPriceSpan.title =
            "Ручной ввод стоимости (для сравнения юнитов по текущей цене в ивенте, а не по лидерству в рамках ГЛ).";
        calculateWithoutDefSpan.title =
            "Расчёт показателей с нулевым весом дефа (против хаоситов).";
        BFSpan.title =
            "Расчёт показателей с учётом взятия Боевого безумия.";
        vitalitySpan.title =
            "Расчёт показателей с учётом взятия Стойкости.";
        RBCorner.title = vitalitySpan.title;

        // ставим галочки при наличии сохранённых положительных значений
        customPriceCheckbox.checked = GM_getValue("customPriceEnabled");
        calculateWithoutDefCheckbox.checked = GM_getValue("calculateWithoutDef");
        BFCheckbox.checked = GM_getValue("BFEnabled");
        vitalityCheckbox.checked = GM_getValue("vitalityEnabled");

        // сохраняем реальное лидерство
        var leadershipDiv = armyInfo.children[9],
            leadershipTitleNode = leadershipDiv.firstChild.nextSibling.nextSibling,
            leadershipTitle,
            leadershipNumber = leadershipDiv.children[1],
            oldLeadership = leadershipNumber.innerText.replace(",", "");

        // выставляем подпись лидерству, отрисовываем поле ввода цены в соответствии с сохранёнными настройками
        setLeadershipTitle();
        setupLeadershipNumberElement();

        // вешаем события по изменению чекбоксов
        customPriceCheckbox.onchange = function(){
            GM_setValue("customPriceEnabled", customPriceCheckbox.checked);
            setLeadershipTitle();
            setupLeadershipNumberElement();

            if (!customPriceCheckbox.checked){ // при снятии чекбокса пересчитываем показатели (уже по старому лидерству)
                assess();
            }
        };
        calculateWithoutDefCheckbox.onchange = function(){
            GM_setValue("calculateWithoutDef", calculateWithoutDefCheckbox.checked);
            assess();
        };
        BFCheckbox.onchange = function(){
            GM_setValue("BFEnabled", BFCheckbox.checked);
            assess();
        };
        vitalityCheckbox.onchange = function(){
            GM_setValue("vitalityEnabled", vitalityCheckbox.checked);
            assess();
        };

        // имитируем нажатия на чекбоксы по клику на заголовках (для стойкости – и на НП уголке)
        var changeEvent = new Event("change");
        customPriceTitle.onclick = function(){imitateCheck(customPriceCheckbox);};
        calculateWithoutDefTitle.onclick = function(){imitateCheck(calculateWithoutDefCheckbox);};
        BFTitle.onclick = function(){imitateCheck(BFCheckbox);};
        vitalityTitle.onclick = function(){imitateCheck(vitalityCheckbox);};
        RBCorner.onclick = function(){imitateCheck(vitalityCheckbox);};
    }
})();