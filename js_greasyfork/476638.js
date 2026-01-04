// ==UserScript==
// @name         HWM: Статистика выпадения существ
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Сбор статистики по присоединению существ ГЛ в протоколе боёв.
// @author       D-i-a-b-l-O
// @include        *://*.heroeswm.ru/pl_warlog.php*
// @include        *://178.248.235.15/pl_warlog.php*
// @include        *://*.lordswm.com/pl_warlog.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476638/HWM%3A%20%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B2%D1%8B%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%81%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/476638/HWM%3A%20%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B2%D1%8B%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%81%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2.meta.js
// ==/UserScript==

var rarity = {
    // Рыцари
    "Крестьяне": 0, "Лучники": 0,
    "Ополченцы": 1,"Головорезы": 1,"Арбалетчики": 1,"Стрелки": 1,"Пехотинцы": 1,"Грифоны":1,
    "Латники": 2, "Защитники веры": 2,"Имперские грифоны": 2, "Штурмовые грифоны": 2,"Монахи": 2,"Рыцари": 2,
    "Чемпионы": 3,"Адепты":3,"Инквизиторы":3,"Ангелы": 3,
    // Маги
    "Гремлины": 0, "Каменные горгульи": 0,
    "Старшие гремлины": 1,"Гремлины-вредители": 1,"Обсидиановые горгульи": 1,"Стихийные горгульи": 1,"Железные големы": 1,"Маги": 1,
    "Стальные големы":2,"Магнитные големы": 2,"Боевые маги": 2,"Джинны": 2,
    "Принцессы ракшас": 3,"Кшатрии ракшасы": 3,"Раджи ракшас": 3,"Архимаги":3,"Визири джиннов": 3,"Джинны-султаны": 3,
    "Колоссы":3,
    // Некры
    "Скелеты": 0, "Зомби": 0, "Скелеты-арбалетчики": 0,
    "Скелеты-лучники": 1, "Чумные зомби": 1,"Гниющие зомби": 1,"Скелеты-воины": 1,"Привидения": 1,
    "Призраки": 2,"Духи": 2,"Вампиры": 2,"Личи": 2, "Умертвия": 2,
    "Высшие вампиры": 3,"Князья вампиров": 3,"Архиличи": 3,"Высшие личи": 3,"Баньши": 3,"Вестники смерти": 3,"Костяные драконы":3,
    // Варвары
    "Гоблины": 0, "Наездники на волках": 0,
    "Хобгоблины": 1,"Гоблины-лучники": 1,"Гоблины-маги": 1,"Налётчики на волках": 1,"Наездники на кабанах": 1,"Наездники на гиенах": 1,"Орки": 1,"Огры": 1,
    "Орки-вожди":2,"Орки-тираны": 2, "Орки-шаманы": 2, "Огры-маги": 2, "Огры-ветераны": 2, "Огры-шаманы": 2, "Роки": 2, "Циклопы": 2,
    "Птицы грома":3,"Огненные птицы":3,"Птицы тьмы":3,"Циклопы-короли": 3,"Циклопы-генералы":3,"Циклопы-шаманы":3,"Бегемоты":3,
    // СЭ
    "Феи": 0, "Танцующие с клинками": 0,
    "Дриады": 1,"Нимфы": 1,"Танцующие со смертью": 1,"Танцующие с ветром": 1,"Эльфийские лучники": 1,"Друиды": 1,
    "Мастера лука":2,"Лесные снайперы": 2,"Старшие друиды": 2,"Верховные друиды":2, "Единороги": 2,
    "Боевые единороги": 3,"Светлые единороги": 3,"Энты": 3,"Древние энты": 3,"Дикие энты":3,"Зеленые драконы":3,
    // ТЭ
    "Лазутчики": 0, "Бестии": 0,
    "Ассасины": 1,"Ловчие": 1,"Фурии": 1,"Мегеры": 1,"Минотавры": 1,"Наездники на ящерах": 1,
    "Минотавры-стражи": 2, "Минотавры-надсмотрщики": 2,"Проворные наездники": 2,"Гидры": 2,"Сумеречные ведьмы": 2,
    "Пещерные гидры": 3,"Тёмные гидры": 3,"Хозяйки ночи":3,"Сумеречные драконы": 3,
    // Демоны
    "Бесы": 0, "Рогатые демоны": 0,
    "Черти": 1,"Дьяволята": 1,"Огненные демоны": 1,"Старшие демоны": 1,"Адские псы": 1,"Суккубы": 1,
    "Церберы": 2, "Огненные гончие": 2,"Демонессы" : 2, "Искусительницы": 2, "Адские жеребцы": 2, "Пещерные демоны": 2,
    "Кошмары": 3,"Кони преисподней": 3,"Пещерные владыки": 3,"Пещерные отродья": 3,"Дьяволы":3,
    // Гномы
    "Защитники гор": 0, "Метатели копья": 0,
    "Воители": 1,"Горные стражи": 1,"Мастера копья": 1,"Гарпунеры": 1,"Наездники на медведях": 1,"Костоломы": 1,
    "Хозяева медведей": 2,"Берсерки":2,"Жрецы рун": 2, "Таны": 2,
    "Старейшины рун":3,"Громовержцы":3,"Огненные драконы":3,
    // СВ
    "Степные гоблины": 0, "Кентавры": 0,
    "Гоблины-трапперы": 1,"Кочевые кентавры": 1,"Боевые кентавры": 1,"Степные воины": 1,"Шаманки": 1,
    "Степные бойцы": 2, "Вармонгеры": 2, "Дочери неба": 2, "Дочери земли": 2, "Убийцы": 2, "Виверны": 2,
    "Палачи": 3, "Вожаки": 3,"Тёмные виверны": 3,
    //--------------------------
    // Причал
    "Никсы": 1,
    "Матросы-чужеземцы": 2,"Буканиры": 2, "Жрицы моря" : 2,"Духи океана": 2,
    "Флибустьеры": 3,"Ассиды":3,"Никсы-воины":3,
    // Пираты
    "Пиратки": 1,"Корсарки":2,"Толстяки": 2,
    "Скелеты-пираты": 2,"Скелеты-моряки": 2,"Скелеты-корсары": 2,
    "Морские дьяволы": 3,
    // Подземелье
    "Троглодиты": 0,"Адские троглодиты": 1,"Гарпии": 2,"Медузы": 2,"Гарпии-ведьмы":3,"Медузы королевы": 3,
    "Пауки": 1,"Ядовитые пауки": 2,"Тролли": 3,"Черные тролли":4,
    "Черные вдовы": 2,
    "Камнееды": 1,"Камнегрызы":2,
    "Мантикоры": 3,
    // Элементали
    "Огненные элементали": 2, "Воздушные элементали": 2, "Водные элементали": 2, "Земные элементали": 2,
    // Разбойники
    "Рубаки": 0, "Колдуны-ренегаты": 0, "Молотобойцы": 0, "Лесные хоббиты": 0,
    "Лазутчицы": 2,"Чародеи-ренегаты": 2, "Пустынные налетчики": 2, "Кочевники": 2, "Тэнгу":2,
    "Мобильные баллисты": 3,
    "Великаны": 3,"Великаны-лучники": 3,
    // Нейтралы
    "Гоги": 0, "Магоги": 1,
    "Кабаны": 1,"Медведи": 1,
    "Дозорные": 1,"Вышибалы": 1,
    "Мятежники": 1,"Стрелки-наёмники": 1,
    "Воины-наёмники": 2, "Боевые грифоны" : 2,
    "Воры-разведчики": 2, "Воры-убийцы": 2,"Воры-колдуны":3,
    "Лепреконы": 2, "Сатиры": 2,"Пегасы": 2,
    "Ведьмы-призраки":3,
    "Мумии": 3,
    "Рыцари тьмы": 3,
    "Гигантские пауки": 3,
    "Големы смерти": 3,
    "Алмазные големы": 3,
    "Серебряные пегасы": 3,
    "Снежные волки": 3,
    "Хищные растения": 3,
    "Проклятые энты":3,
    "Ифриты": 3,"Рогатые жнецы":3,
    "Крестоносцы": 3,
};

function getRarity(k)
{
    if (rarity[k] === undefined) return -1;
    return rarity[k];
}

function message(text)
{
    var msg = document.getElementById('sc-lg-creatures-messages');
    if ( typeof text == "object" ) {
        msg.innerHTML = "";
        msg.appendChild( text );
    } else {
        msg.innerHTML = text;
    }
}

function parseNick()
{
    var nickRegex = /Протокол боев\s+<a.+?><b>([A-Za-zА-Яа-яЁё0-9\-_ ]+?)<\/b><\/a>/;
    return nickRegex.exec(document.body.innerHTML)[1];
}

function getScriptData() {
    var data = GM_getValue("creatures-script-data");
    if (!data) {
        data = "{}";
    }
    return JSON.parse(data);
}

function setScriptData(data) {
    var json = JSON.stringify(data);
    GM_setValue("creatures-script-data", json);
}


function deleteData()
{
    if (confirm('Удалить все данные безвозвратно?')) {
        GM_setValue("creatures-script-data", "");
        message('Данные удалены.');
    }
}

function makeCell(text)
{
    var cell = document.createElement("td");
    var cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    return cell;
}

function makeTable(list)
{
    let table = document.createElement('table');
    table.setAttribute('class', 'sc-lg-table');
    let thead = document.createElement('thead');
    let tr1 = document.createElement('tr');
    tr1.appendChild(makeCell("Существо"));
    tr1.appendChild(makeCell("В обычных боях"));
    tr1.appendChild(makeCell("Апы ГЛ"));
    tr1.appendChild(makeCell("Ивенты"));
    tr1.appendChild(makeCell("Суммарное количество"));
    thead.appendChild(tr1);
    table.appendChild(thead);
    let tbody = document.createElement('tbody');
    tbody.style.textAlign = "right";
    Object.keys(list).sort(function(a,b){
        if (getRarity(a) == getRarity(b)){
            return a.localeCompare(b)
        } else if (getRarity(a) < getRarity(b)) {
            return 1;
        } else {
            return -1;
        }
    }).forEach(k => {
        let tr = document.createElement('tr');
        let name = makeCell(k);
        name.style.textAlign = "left";
        if (getRarity(k)==-1) {
            name.style.fontStyle = "italic";
        }else if (getRarity(k)==1) {
            name.style.fontWeight = "bold";
            name.style.color = "brown";
        }else if(getRarity(k) == 2) {
            name.style.fontWeight = "bold";
            name.style.color = "blue";
        }else if(getRarity(k) == 3) {
            name.style.fontWeight = "bold";
            name.style.color = "goldenrod";
        }else if(getRarity(k) == 4) {
            name.style.fontWeight = "bold";
            name.style.color = "red";
        }
        tr.appendChild(name);
        tr.appendChild(makeCell(list[k].normal));
        tr.appendChild(makeCell(list[k].lg));
        tr.appendChild(makeCell(list[k].event));
        tr.appendChild(makeCell(list[k].amount));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function showData()
{
    var data = window.sclg.data;
    var nick = window.sclg.nick;
    var player = data[nick];
    if (!player) {
        message("Нет данных");
        return;
    }

    var creatureList = { };

    var prop = "";
    var add = function(k) {
        if ( creatureList[k] === undefined ) {
            creatureList[k] = { normal: 0, lg: 0, event: 0, amount: 0 };
        }
        creatureList[k][prop] = player[prop][k].count;
        creatureList[k].amount += player[prop][k].totalAmount;
    }


    if (player.normal){
        prop = "normal"
        Object.keys(player.normal).forEach(add);
    }

    if (player.lg){
        prop = "lg"
        Object.keys(player.lg).forEach(add);
    }

    if (player.event){
        prop = "event"
        Object.keys(player.event).forEach(add);
    }


    message(makeTable(creatureList));
}


function parseBattleResult(text)
{
    if (/#bt[0-9]+restricted/.test(text)) {
        return undefined;
    }
    var winner = /Победившая сторона:<\/b><\/font><br \/>.*<font size="18"><b>Проигравшая сторона:/
    var loser = /Проигравшая сторона:<\/b><\/font><br \/>.*\|#/

    text = text.replace(/<BR>/g, '<br />')

    var side1 = winner.exec(text)[0];
    var side2 = loser.exec(text)[0];

    var line = /<b><font.+?<br \/>/g;

    var participants = []
    do {
        var m = line.exec(side1);
        if (m) { participants.push(m[0]); }
    } while (m);
    do {
        m = line.exec(side2);
        if (m) { participants.push(m[0]); }
    } while (m);

    let type = "normal";


    var results = [];
    for ( let p of participants ) {
        let name = /<b><font color="#.+?">(.+?)<\/font><\/b>/.exec(p)[1];
        let result = /<b><font color="#.+?">[A-Za-zА-Яа-яЁё0-9\-_ ]+?<\/font><\/b> получает (.+?)<br \/>/.exec(p);

        if (/очк.+? ГЛ/.test(p)) {
            type = "lg";
        }

        if (!result) {
            if (/.+ \(([0-9]+)\)/.test(name)) {
                type = "event";
            } else {
                results.push([name,[]]);
            }
            continue;
        }

        var creaturesRegex = /([А-ЯЁ][а-яё\- ]+?) \(\+([0-9]+?) шт.\) в резерв/g;

        var creatures = [];
        do {
            m = creaturesRegex.exec(result[1]);
            if (m) {
                creatures.push([ m[1], m[2] ]);
            }
        } while (m);

        results.push([name,creatures]);
    }
    return {type:type, drops:results};
}

var inProgress = false;


function analyzeWarids( warids )
{
    var data = window.sclg.data;
    var playerNick = window.sclg.nick;
    var player = data[playerNick];

    var mreq = warids.length;
    var nreq = mreq;
    var navail = 0;
    var nerr = 0;

    if (mreq == 0) {
        message('Все бои проанализированы.');
        inProgress = false;
        return;
    }

    var done = function( )
    {
        --nreq;
        if (nreq == 0) {
            //console.log(data);
            //console.log(JSON.stringify(data));
            setScriptData(data);
            var msg = 'Проанализировано ' + (mreq-navail-nerr) + ' боёв.';
            if (navail > 0) {
                msg += ' Недоступно: '+(navail)+'.';
            };
            if (nerr > 0) {
                msg += ' <i>Не удалось проанализировать '+(nerr)+' боёв из-за ошибок запроса. Попробуйте ещё раз.</i>';
            };
            message(msg);
            inProgress = false;
        } else {
            message('Анализ боёв [ ' + (mreq-nreq) + '/' + mreq + ' ]');
        }
    }

    var processResult = function(responce) {
        if (responce.status == 200 || responce.status == 304) {
            let warid = /warid=([0-9]+)/.exec(responce.finalUrl)[1];
            let result = parseBattleResult(responce.responseText);

            if (!result) {
                ++navail;
                return done();
            }

            for ( let r of result.drops ) {
                let nick = r[0];
                let creatures = r[1];
                if (playerNick != nick) continue;
                data[nick][warid] = creatures;
                for ( let c of creatures ) {
                    let name = c[0];
                    if (data[nick][result.type] === undefined) {
                        data[nick][result.type] = {}
                    }
                    let table = data[nick][result.type];
                    if (table[name] === undefined) {
                        table[name] = { count:0, totalAmount:0 };
                    }
                    let creatureStat = table[name];
                    creatureStat.count ++;
                    creatureStat.totalAmount += Number(c[1]);
                }
            }
        }

        done();
    }

    var processError = function(responce) {
        ++nerr;
        done();
    }

    for ( let w of warids ) {
        var base_url = window.location.origin;
        var url = base_url + "/battle.php?lastturn=-3&warid=" + w[0];
        if (w[1]) {
            url += "&show_for_all=" + w[1];
        }

        GM_xmlhttpRequest ( {
            method:         "GET",
            url:            url,
            onload:     processResult,
            onerror:    processError,
            ontimeout: processError,
            timeout: 30000 + 100 * warids.length
        } );
    }
}

function extractWarids(text, ignore)
{
    var warids = [];

    var warlogRegex = /warlog.php\?warid=([0-9]+)(?:&amp;show_for_all=([a-z0-9]+))?/g
    do {
        var m = warlogRegex.exec(text);
        if (m) {
            var warid = m[1];
            if (ignore[warid]) {
                continue;
            }
            var crc = m[2];
            warids.push([ warid, crc ]);
        }
    } while (m);

    return warids;
}

function collectWarids(id, page, n)
{
    var s = document.body.innerHTML;

    var collectedWarids = [];

    var nreq = n;
    var done = function( )
    {
        --nreq;
        if (nreq == 0) {
            analyzeWarids( collectedWarids );
        } else {
            message('Сбор ссылок [ ' + (n-nreq) + '/' + n + ' ]');
        }
    }

    var data = window.sclg.data;
    var playerNick = window.sclg.nick;
    var player = data[playerNick];

    var processResult = function(responce) {
        if (responce.status == 200 || responce.status == 304) {
            let result = extractWarids(responce.responseText, player);
            collectedWarids.push.apply(collectedWarids, result);
        }
        done();
    };

    for (var i = 0; i < n; ++i) {
        var base_url = window.location.origin;
        var url = base_url + "/pl_warlog.php?id="+ id +"&page=" + (page-1+i);
        GM_xmlhttpRequest ( {
            method:   "GET",
            url:            url,
            onload:    processResult,
            onerror:  done,
            ontimeout: done,
            timeout: 60000
        } );
    }
}

function analyze()
{
    if (inProgress) return;
    inProgress = true;

    var numpages = document.getElementById('sc-lg-numpages');
    var n = numpages.value;
    var id = /id=([0-9]+)/.exec(window.location.href)[1];
    var page = /page=([0-9]+)/.exec(window.location.href);
    if (page) {
        page = page[1];
    } else {
        page = 1;
    }

    if (n) {
        collectWarids(id,page,n);
    } else {
        analyzeWarids(extractWarids(document.body.innerHTML));
    }
}

function createLink(text, href, listener) {
    var a = document.createElement('a');
    var linkText = document.createTextNode(text);
    a.appendChild(linkText);
    //a.title = "";
    a.href = href;
    a.addEventListener("click", listener, false);
    return a;
}

function createNumberInput(id) {
    var input = document.createElement("input");
    input.type = "number";
    input.style = "width: 4em;";
    input.value = "1";
    input.id = id;
    return input;
}
function createSeparator() {
    return document.createTextNode(" | ");
}

(function() {
    'use strict';

    // document.getElementById('main_top_table')
    var center = document.body.querySelector('center');

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.sc-lg-table {     border: 1px #5D413A solid; background-color: #F5F3EA; border-spacing: 10px }';
    document.getElementsByTagName('head')[0].appendChild(style);

    var div = document.createElement('div');
    div.id = 'sc-lg-creatures-controls';
    var link1 = createLink( "Собрать", "javascript:void(0)", analyze );
    var link2 = createLink( "Отобразить", "javascript:void(0)", showData );
    var link3 = createLink( "Удалить", "javascript:void(0)", deleteData );
    div.appendChild(document.createTextNode("Статистика по существам ГЛ: "));
    div.appendChild(link1);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(createNumberInput('sc-lg-numpages'));
    div.appendChild(createSeparator());
    div.appendChild(link2);
    div.appendChild(createSeparator());
    div.appendChild(link3);

    div.style.marginTop = '1em';
    div.style.marginBottom = '1em';

    var pbar = document.createElement('div');
    pbar.id = 'sc-lg-creatures-messages';

    center.appendChild(div);
    center.appendChild(pbar);

    var data = getScriptData();

    let playerNick = parseNick();
    let player = data[playerNick];
    if (!player) {
        data[playerNick] = { normal: {}, lg: {}, event: {} }
        player = data[playerNick];
    }

    window.sclg = {};
    window.sclg.data = data;
    window.sclg.nick = playerNick;

    //link1.click();
})();