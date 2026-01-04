(function() {// ==UserScript==
// @name           hwm_clan_activity_ratings_new
// @description    Рейтинг членов клана в ГВД по боевой активности
// @homepage       http://userscripts.org/scripts/show/399631
// @author        Рианти
// @version        1.1
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/clan_info\.php/
// @namespace https://greasyfork.org/users/86830
// @downloadURL https://update.greasyfork.org/scripts/376174/hwm_clan_activity_ratings_new.user.js
// @updateURL https://update.greasyfork.org/scripts/376174/hwm_clan_activity_ratings_new.meta.js
// ==/UserScript==

//===Настройки===//

var _dateEnd = '22/12/18'; // Конец отрезка времени когда собираем статистику. Хронологически ПОЗЖЕ даты ниже.

var _dateBegin = '01/12/18'; // Начало отрезка времени когда собираем статистику. Хронологически РАНЬШЕ даты выше.

var _MinParsedHeroLevel = 1;

// Множитель прибавки рейтинга в зависимости от времени боя. Т.е. если базовая прибавка +2, а бой проведен в 18 часов (множитель 0.5) то прибавлено к рейтингу будет +2*0.5 = +1
var _ratingByHour = { 0: 0.6, 1: 0.7, 2: 0.8, 3: 0.9, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 0.9, 14: 0.9, 15: 0.8, 16: 0.8, 17: 0.7, 18: 0.6, 19: 0.5, 20: 0.5, 21: 0.5, 22: 0.5, 23: 0.5 }

// Типы боёв в которых используется почасовой рейтинг (в остальных не будет зависимости от времени). Добавлять в формате [Код боя]: 1, [Код боя]: 1
var _fightsToEvalHour = { 80: 1 };

var _pendTime = 10; // Время пассивного ожидания между отправкой запросов на сервер(в миллисекундах, 1000мс = 1с). Чем ниже данный параметр, тем более интенсивной будет нагрузка на сервер и быстрее скорость сбора данных.

// Ниже задаём какие бои влияют на рейтинг и как. Запись в формате 'код типа боя' : [ очки за этот тип боя ]
// Коды придумал не я, а администрация ГВД, каждому типу боя в игре соответствует свой код.
// Код любого интересующего вас типа боя можно узнать выделив в протоколе боёв строку с подобным боем, щелкнув ПКМ, в выпадающем меню
// выбрав: "Исходный код выделенного фрагмента". В самом конце выделенной строчки найти информацию в формате <!--#-->, где # - релевантный код.
//
// Примеры кодов: 0 - охота, 80 - защита от сурвов, 81 - атака на сурвов, 88 - ПВЕ перехват, 89 - ПВП атака, 40 - бой ГТ. Налог - 104

// стандартые настройки
var _participationScores = { // Очки начисляемые за участие в бою. Напирмер '80' : [ 0.7 ] значит что за участие в каждой защите будет начислено 0.7 очков.
    '0' : [ 0.7 ], '129' : [ 0 ], '66' : [ 0 ], '95' : [ 0 ], '29' : [ 0 ], '21' : [ 0 ], '40' : [ 0 ]
};

var _winScores = { // Очки начисляемые за победу в бою. Напирмер '40' : [ 0.3 ] значит что за победу в ГТ будет начислено 0.3 очков.
    '80' : [ 0.3 ], '81' : [ 0 ], '88' : [ 0.5 ], '89' : [ 0 ], '104' : [ 0 ]
};
//===============//

//==Date&Time functions==//
Date.parseDate = function(input, separator)
{
    var parts = input.split(separator);
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(20+parts[2], parts[1]-1, parts[0]); // Note: months are 0-based
}

Date.daysBetween = function(date1, date2)
{
    var one_day = 86400000; //1000*60*60*24
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = date2_ms - date1_ms;
    return Math.round(difference_ms/one_day);
}

function stopThread(ms)
{
    ms += new Date().getTime();
    while (new Date() < ms){}
}
//=======================//

//====AJAX functions====//
function getPageContent(url)
{
    try {
        console.log('loading: ', url);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', url, false);
        xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
        xmlhttp.send(null);
        if(xmlhttp.status == 200)
            return xmlhttp.responseText;
        return '';
    } catch ( e ) {
        return getPageContent(url);
    }
}
//======================//

//===Parsing functions===//
function parseWLPage(inputStr, data, player)
{
    var fightPattern = /<a href="warlog\.php\?warid=[0-9]+">([0-9-]+) ([0-9]{2}):(.*)<!--([0-9]{1,})-->/g;
    var winPattern = new RegExp('<font color=(red|"red")>'+player+'\\[[0-9]{1,}\\]<\/font><\/a><\/b>');

    var match;
    var date, hour, type, win;
    var result = data.result, resultTotal = data.resultTotal;
    while (match = fightPattern.exec(inputStr))
    {
        date = Date.parseDate(match[1], '-');
        if(date > _dateEnd) continue;
        if(date < _dateBegin) break;
        hour = parseInt(match[2]);
        win = winPattern.test(match[3]);
        type = match[4];
        if(hour in result == false) { result[hour] = {}; }
        if(type in result[hour] == false) { result[hour][type] = {}; }
        if(win in result[hour][type] == false) { result[hour][type][win] = 1; }
        else { result[hour][type][win]++; }
        resultTotal++;
    }
    return {
        result: result,
        resultTotal: resultTotal,
        lastDate: date
    }
}

function parsePlayer(plID, plNick)
{
    var link, input, curPage= 0, date = new Date();
    var data = {
        result: {},
        resultTotal: 0
    }
    while(date >= _dateBegin){
        link = "https://www.heroeswm.ru/pl_warlog.php?id="+plID; if(curPage>0) link = link + "&page=" + curPage;
        stopThread(_pendTime);
        input = getPageContent(link);
        data = parseWLPage(input, data, plNick);
        date = data.lastDate;
        curPage++;
    }
    return data;
}
//=======================//

//====MISC functions====//

function round(num){
    return Math.round(num * 10) / 10;
}

function presentWithPercent(num, outOf){
    if(outOf == 0) return 0;
    return outOf + "(" + Math.round(100 * (num / outOf)) + "%)";
}

function downloadCSV(twoDArray){
    //var csvContent = "data:text/csv;charset=utf-8,";
    var csvContent = "";
    for(var row in twoDArray){
        csvContent += twoDArray[row].join("|").replace(/\./g, ',') + "\n";
    }
    //var encodedUri = encodeURI(csvContent);
    //alert('Сейчас вам будет предложено загрузить файл со статистикой. При сохранении установите расширешие .csv\nВ дальнейшем, вы сможете открыть его для работы в Экселе или аналогах.');
    //window.open(encodedUri);
    //console.log(encodedUri);
    saveToFile(csvContent, "Клановая статистика активности.csv", "text/plain");
}

function presentToConsole(){
    var msg = ' hwm_clan_activity_ratings_new: ';
    console.log(Array(20).join('-') + msg + Array(20).join('-'));
    for(var i = 0; i < arguments.length; i++){
        console.log(arguments[i]);
    }
    console.log(Array(40 + msg.length - 1).join('-'));
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
//=======================//

//====Business Logic====//

function ratePlayer(plID, plNick, plLVL)
{
    var data = parsePlayer(plID, plNick);
    var rating = 0;

    var temp, survDef = 0, survAttk = 0, survIntercept = 0, survPVP = 0, GT = 0, tax;
    var survDefWon = 0, survAttkWon = 0, survInterceptWon = 0, survPVPWon = 0, GTWon = 0, taxWon;

    for (var hour in data.result){
        rating += RateParticipation(data.result[hour], hour) + RateWin(data.result[hour], hour);

        temp = fightTypeInfo(data.result[hour], 80); survDef += temp.total; survDefWon += temp.won;
        temp = fightTypeInfo(data.result[hour], 81); survAttk += temp.total; survAttkWon += temp.won;
        temp = fightTypeInfo(data.result[hour], 88); survIntercept += temp.total; survInterceptWon += temp.won;
        temp = fightTypeInfo(data.result[hour], 89); survPVP += temp.total; survPVPWon += temp.won;
        temp = fightTypeInfo(data.result[hour], 40); GT += temp.total; GTWon += temp.won;
        temp = fightTypeInfo(data.result[hour], 104); tax += temp.total; taxWon += temp.won;
    }

    var output = round(rating) + ": Боёв: " + data.resultTotal;
    output += ", Защит: " + presentWithPercent(survDefWon, survDef);
    output += ", Атак: " + presentWithPercent(survAttkWon + survInterceptWon, survAttk + survIntercept);
    output += ", КБО: " + presentWithPercent(survPVPWon, survPVP);
    output += ", ГТ: " + presentWithPercent(GTWon, GT);
    output += ", Налог: " + presentWithPercent(taxWon, tax);

    var accurateScore = Math.max(survDefWon / survDef - 0.3, 0) * (rating - (survIntercept * 0.5 + survInterceptWon * 1.5 + survPVP * 2 + survPVPWon * 3)) * (1/(0.73-0.3)) + (survIntercept * 0.5 + survInterceptWon * 1.5 + survPVP * 2 + survPVPWon * 3);
    if (!accurateScore) accurateScore = 0;

    var outArr = [plNick, plLVL, round(rating), data.resultTotal, survDef, survDefWon, (survDef == 0 ? 0 : Math.floor(survDefWon/survDef * 100)), survAttk, survAttkWon, survIntercept, survInterceptWon, survPVP, survPVPWon, GT, GTWon, tax, taxWon, accurateScore.toFixed(2)];

    return {
        string: output,
        array: outArr
    }
}

function RateParticipation(resByHour, hour){
    var score = 0;
    for(var fType in _participationScores){
        score += _participationScores[fType] * fightTypeInfo(resByHour, fType, hour).total;
    }

    return score;
}

function RateWin(resByHour, hour){
    var score = 0;
    for(var fType in _winScores){
        score += _winScores[fType] * fightTypeInfo(resByHour, fType, hour).won;
    }

    return score;
}

function fightTypeInfo(resByHour, fType, hour){
    var won = 0;
    var lost = 0;
    if(resByHour[fType] != null){
        if (resByHour[fType][true] != null) won = 0 + resByHour[fType][true];
        if (resByHour[fType][false] != null) lost = 0 + resByHour[fType][false];
    }
    if(hour != null && _fightsToEvalHour[parseInt(fType)]){
        won *= _ratingByHour[hour];
        lost *= _ratingByHour[hour];
    }
    var total = won+lost;
    return {
        won: won,
        lost: lost,
        total: total
    }
}

function ratePlayers(e)
{
    var outputArray = {};
    try {
        stopCollecting = 0;
        e.target.value = "Идет сбор статистики...";
        e.target.onclick = function (e){
            e.target.value = "Останавливаем...";
            stopCollecting = 1;
        };

        var p = document.querySelectorAll('a[href*="pl_info.php?id="]');
        var dataTable = p[p.length-1].parentElement.parentElement.parentElement;    
        presentToConsole(dataTable);
        var cells = dataTable.querySelectorAll("td"); //relevant cells are 3, 5 in each row
        var rows =cells.length/5;
        var tmp,plID,plNick,plLVL;

        //outputArray[0] = ["Ник", "Всего боёв", "Рейтинг", "Защит всего", "Побед в защитах", "Атак всего", "Побед в атаках", "Перехватов всего", "Побед в перехватах", "КБО всего", "Побед в КБО", "ГТ всего", "Побед в ГТ"];
        outputArray[0] = ["Ник", "БУ", "Рейтинг", "Бои", "Дефы", "ПДефы", "%Дефы", "Атаки", "ПАтаки", "П", "ПП", "КБО", "ПКБО", "ГТ", "ПГТ", "Налог", "ПНалог", "Очки по формуле"];
        for (var i = 0; i < rows; i++) {
            plLVL = parseInt(cells[i * 5 + 3].innerHTML);
            if(stopCollecting) break;
            if(plLVL <= _MinParsedHeroLevel) continue;
            tmp = cells[i * 5 + 2].getElementsByClassName('pi')[0];
            plID = tmp.href.split('=')[1];
            plNick = tmp.innerHTML;
            tmp = ratePlayer(plID, plNick, plLVL);
            cells[i * 5 + 4].innerHTML = tmp.string;
            outputArray[i + 1] = tmp.array;
            //addFormula(outputArray);
            console.log(outputArray, JSON.stringify(outputArray));
        }
        //outputArray = addFormula(outputArray);
        downloadCSV(outputArray);

        e.target.value = "Сбор статистики завершен";
        e.target.onclick = function(){downloadCSV(outputArray);};
    } catch (e) {
        presentToConsole (e);
        alert('Во время работы скрипта произошла обишка. Вам будет предложено сохранить уже собранные данные.');
        alert('Для устранения ошибки, нажмите ctrl+shift+K для открытия консоли, в ней перемотайте вниз и сделайте скрин.');
        downloadCSV(outputArray);
    }
}
//======================//

function addFormula(arr){
    console.log('adding formula to', arr);
    var percentWinCol = arr[0].indexOf("%Дефы");
    var ratingCol = arr[0].indexOf("Рейтинг");
    var interceptCol = arr[0].indexOf("П");
    var interceptWinCol = arr[0].indexOf("ПП");
    var KBOCol = arr[0].indexOf("КБО");
    var KBOWinCol = arr[0].indexOf("ПКБО");
    var scoreCol = arr[0].indexOf("Очки по формуле");

    var percentSum = 0, avgPercent;

    for (var i = 1; i < Object.keys(arr).length; i++){
        percentSum += arr[i][percentWinCol];
    }

    avgPercent = 0.01 * Math.floor(percentSum / (Object.keys(arr).length - 1));
    console.log('avg perc:', avgPercent);

    for (var i = 1; i < Object.keys(arr).length; i++){

        console.log('first multiply', Math.max(0, arr[i][percentWinCol]/100 - 0.3));
        arr[i][scoreCol] = Math.max(0, arr[i][percentWinCol]/100 - 0.3);

        console.log('second multiply', (arr[i][ratingCol] - (0.5 * arr[i][interceptCol] + 1.5 * arr[i][interceptWinCol] + 2 * arr[i][KBOCol] + 3 * arr[i][KBOWinCol])));
        arr[i][scoreCol] *= (arr[i][ratingCol] - (0.5 * arr[i][interceptCol] + 1.5 * arr[i][interceptWinCol] + 2 * arr[i][KBOCol] + 3 * arr[i][KBOWinCol]));

        console.log('third multiply', (1 / (avgPercent - 0.3)) + (0.5 * arr[i][interceptCol] + 1.5 * arr[i][interceptWinCol] + 2 * arr[i][KBOCol] + 3 * arr[i][KBOWinCol]));
        arr[i][scoreCol] *= (1 / (avgPercent - 0.3)) + (0.5 * arr[i][interceptCol] + 1.5 * arr[i][interceptWinCol] + 2 * arr[i][KBOCol] + 3 * arr[i][KBOWinCol]);

        arr[i][scoreCol] = arr[i][scoreCol].toFixed(2);
    }
    console.log('added:', arr, JSON.stringify(arr));
    return arr;
}

//=====UI functions=====//
function addActivationButton()
{
    var buttonParentTable = document.querySelector('body > center:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1)');
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Рейтинг игроков";
    button.onclick = ratePlayers;
    var div = document.createElement("div");
    div.align = "center";
    div.appendChild(button);
    buttonParentTable.appendChild(div);
}
//======================//

_dateEnd = Date.parseDate(_dateEnd, '/');
_dateBegin = Date.parseDate(_dateBegin, '/');

var stopCollecting;

addActivationButton();
    'use strict';

    // Your code here...
})();