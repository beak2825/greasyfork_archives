// ==UserScript==
// @name         RentArtsFromProtocol
// @namespace    nexterot
// @version      1.0.9
// @description  Подсчет аренды за арты
// @license      none
// @include      *heroeswm.ru/pl_transfers.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @homepage     https://greasyfork.org/ru/scripts/525368-rentartsfromprotocol
// @downloadURL https://update.greasyfork.org/scripts/525368/RentArtsFromProtocol.user.js
// @updateURL https://update.greasyfork.org/scripts/525368/RentArtsFromProtocol.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prices = {
        // пухи
        'Глефа повелителя тьмы [I12E12A12W12F12]': 1000,
        'Ятаган авантюриста [I12E12A12W12F12]': 1100,
        'Великий посох времён': 700,
        'Великий посох времён [A2]': 700,
        'Великий посох времён [I11E11A11W11F11]': 1250,
        'Кинжал авантюриста [I12E12A12W12F12]': 1100,
        // юва
        'Мифриловый перстень времён': 750,
        'Мифриловый перстень времён [E12A12]': 1150,
        'Мифриловый перстень времён [N12E12A12W12F12]': 1350,
        'Кулон сингулярности [N12E12A12W12F12]': 1300,
        'Мифриловый амулет времён [N10E12A12W10F10]': 1000,
        'Великое кольцо аномалий [E12A12W12F12]': 1150,
        'Великое кольцо аномалий [N12E12A12W12F12]': 1250,
        'Кольцо пирата-капитана [E12A12]': 1150,
        'Кольцо пирата-капитана [E12A12W12F12]': 1250,
        'Кольцо пирата-капитана [N12E12A12W12F12]': 1300,
        'Великий плащ армады [N12E12A12W12F12]': 1100,
        'Мантия сурвилурга [N10E12A12W12F12]': 1200,
        // бронь
        'Великий капюшон ловчего [D12E12A12W12F12]': 1200,
        'Броня авантюриста [D12E12A12W12F12]': 1050,
        'Великий доспех ловчего [D12E12A12W12F12]': 1150,
        'Магический доспех сурвилурга [D12E12A12W12F12]': 1100,
        'Сапоги авантюриста [D12E10A10W10F10]': 1100,
        'Великие туфли времён [D12E12A12W12F12]': 1000,
        'Сапоги разбойника [D12E12A12W12F12]': 1300,
        'Шлем авантюриста [[D12E10A10W10F10]]': 1100,
        'Магический шлем сурвилурга [D12E12A12W12F12]': 1100,
        'Тяжёлый щит предводителя [D12E10A12W10F12]': 650,
        'Щит сурвилурга [D12E12A12W12F12]': 1000,
        // рюкзак
        'Великая сфера времён': 600,
        'Великая сфера времён [A1D1I1]': 950,
        'Великий аркан ловчего [A1D1I1P1K1]': 750,
        'Статуэтка кэнсэя': 350,
        'Статуэтка кэнсэя [D1P1K1]': 550,
        // сеты
        'Амулет некроманта-ученика [N12E12A12W12F12]': 1750,
        'Капюшон некроманта-ученика [D12E12A12W12F12]': 1750,
        'Посох некроманта-ученика [I12E12A12W12F12]': 1750,
        'Халат некроманта-ученика [N12E12A12W12F12]': 1750,

    };

    const playerId = get('id');

    let ErrorText = '<text style="color: red;">ОШИБКА</text>';
    let Sep = '________________________<br><br>';

    var cacheSend = {};
    var cacheReturn = {};

    var stopped = true;
    var resultString = '';

    var protocolTable = document.querySelector('#set_mobile_max_width > div:nth-child(2) > div');

    var regexTime = /(?:<!--\d+-->)? ?&nbsp;&nbsp;(?<date>\d\d-\d\d-\d\d) (?<time>\d\d:\d\d):.+/
    var regexpReturn = /(?:<!--\d+-->)? ?&nbsp;&nbsp;(?<date>\d\d-\d\d-\d\d) (?<time>\d\d:\d\d): <a (?:class=pi )?href=['"]pl_info\.php\?id=(?<playerId>\d+)['"]><b>(?<playerNick>.+)<\/b><\/a> вернул предмет \"(?<artName>.+)\" \[(?<artFrom>\d+)\/(?<artTo>\d+)\]/
    var regexpMyReturn = /(?:<!--\d+-->)? ?&nbsp;&nbsp;(?<date>\d\d-\d\d-\d\d) (?<time>\d\d:\d\d): Забран предмет \"(?<artName>[^"]+)\" \[(?<artFrom>\d+)\/(?<artTo>\d+)\] у <a (?:class=['"]?pi['"]? )?href=['"]pl_info\.php\?id=(?<playerId>\d+)['"]><b>(?<playerNick>.+)<\/b><\/a>.*/
    var regexpSend = /(?:<!--\d+-->)? ?&nbsp;&nbsp;(?<date>\d\d-\d\d-\d\d) (?<time>\d\d:\d\d): Передан предмет \"(?<artName>[^"]+)\" \[(?<artFrom>\d+)\/(?<artTo>\d+)\] c возвратом до .+ на \d+ боев для <a (?:class=pi )?href=['"]pl_info\.php\?id=(?<playerId>\d+)['"]><b>(?<playerNick>.+)<\/b><\/a> за \d+ Золото, комиссия \d+/


    setTimeout(function(){
        var base = document.querySelector("#set_mobile_max_width > div.global_container_block_header.global_a_hover");
        base.innerHTML += `  <span id="run" style="cursor: pointer; text-decoration: underline">Посчитать аренду</span>`;

        $('run').addEventListener("click", run);
    }, 400);
    function run() {
        stopped = false;
        var args = {last_page: 0, last_date: null};
        request(`pl_transfers.php?id=${playerId}&page=0`, onResponseCallback, args);
        $('run').removeEventListener("click", run);
        $('run').addEventListener("click", stop);
    }
    function stop() {
        stopped = true;
        $('run').removeEventListener("click", stop);
        $('run').addEventListener("click", run);
    }
    function onResponseCallback(objXMLHttpReq, args){
        if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {
            var base = document.querySelector("#set_mobile_max_width > div:nth-child(2) > div");
            if (resultString) {
                base.innerHTML = resultString;
            }
            if (stopped) {
                resultString = "";
                return;
            }
            var dateStr = '';
            var page = objXMLHttpReq.responseText;
            var divPosStart = page.indexOf('<div class="global_a_hover">');
            var divPosEnd = page.indexOf('</div>', divPosStart);
            var divHTML = page.substring(divPosStart + '<div class="global_a_hover">'.length, divPosEnd);
            var lines = divHTML.split('<BR>');

            var lastDate = args.last_date;

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (!line.trim()) {
                    continue;
                }

                var resDate = line.match(regexTime);
                if (!resDate) {
                    resultString += `ОШИБКА: не найдена дата! "${line}"<br>`;
                    continue;
                }

                let {date, time} = resDate.groups;
                if ((lastDate != date) && lastDate) {
                    var totalCount = 0;

                    let byPlayerTotalPrice = {};

                    for (var [key, val] of Object.entries(cacheSend).sort()) {
                        var battlesCountDone = val;
                        var [nickName, artName] = key.split(',')
                        if (cacheReturn[key] === undefined) {
                            resultString += `${ErrorText}: <b>${nickName}</b> не вернул <b>${artName}</b> !<br>`;
                            continue;
                        }

                        battlesCountDone -= cacheReturn[key];

                        if (battlesCountDone == 0) {
                            resultString += `<b>${nickName}</b> не сточил <b>${artName}</b><br>`;
                            continue;
                        }
                        else if (battlesCountDone < 0) {
                            resultString += `${ErrorText}: <b>${nickName}</b> <b>${artName}</b> якобы боёв: ${battlesCountDone}<br>`;
                            continue;
                        }

                        var price = prices[artName]
                        if (price === undefined) {
                            resultString += `${ErrorText}: не найдена цена для ${artName}!<br>`;
                        }
                        else
                        {
                            var totalPrice = price * battlesCountDone
                            resultString += `<b>${nickName}</b> сточил <b>${artName}</b> боёв: ${battlesCountDone} * ${price} = <b>${totalPrice}</b><br>`; //  (${val}->${cacheReturn[key]})
                            totalCount += totalPrice
                            byPlayerTotalPrice[nickName] = (byPlayerTotalPrice[nickName] == undefined) ? totalPrice : byPlayerTotalPrice[nickName]+totalPrice;
                        }
                    }

                    resultString += `${Sep}`;
                    for (var [_nickName, _totalPrice] of Object.entries(byPlayerTotalPrice).sort((a, b) => b[1] - a[1])) {
                        resultString += `${_nickName}: ${_totalPrice}<br>`;
                    }

                    if (totalCount > 0) {
                        resultString += `${Sep}<b>Всего: <text style="color: blue;">${totalCount}</text></b><br>`;
                    }
                    resultString += `<br>`;

                    cacheReturn = {};
                    cacheSend = {};
                }

                if (lastDate != date) {
                    resultString += `<hr><b>Дата: ${date}</b><br>`;
                    lastDate = date;
                }

                var res;
                if (res = line.match(regexpSend)) {
                    let {date, time, artName, artFrom, artTo, playerId, playerNick} = res.groups;
                    //console.log('send', date, playerId, playerNick, artName, artFrom, artTo);

                    if (!cacheSend[[playerNick, artName]]) {
                        cacheSend[[playerNick, artName]] = 0
                    }
                    cacheSend[[playerNick, artName]] += Number(artFrom)
                } else if ((res = line.match(regexpMyReturn))
                          || (res = line.match(regexpReturn))) {
                    let {date, time, playerId, playerNick, artName, artFrom, artTo} = res.groups;
                    //console.log('return', date, playerId, playerNick, artName, artFrom, artTo);

                    if (!cacheReturn[[playerNick, artName]]) {
                        cacheReturn[[playerNick, artName]] = 0
                    }
                    cacheReturn[[playerNick, artName]] += Number(artFrom)
                }
            }

            var newArgs = {last_page: args.last_page+1, last_date: lastDate};
            request(`pl_transfers.php?id=${playerId}&page=${args.last_page+1}`, onResponseCallback, newArgs);
        }
    }
    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
    function request(url_req, callback, args){
        var objXMLHttpReq = createXMLHttpReq();
        try{
            objXMLHttpReq.open('GET', url_req, true);
            setXMLHttpReqHeaders(objXMLHttpReq);
            objXMLHttpReq.onreadystatechange = function() { callback(objXMLHttpReq, args); }
            objXMLHttpReq.send(null);
        }catch(e){console.log(e);alert("request failed with error=" + e);}
    }
    function createXMLHttpReq(){
        var objXMLHttpReq;
        if (window.XMLHttpRequest){
            objXMLHttpReq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE
            objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            alert('Can\'t create XMLHttpRequest!');
        }
        return objXMLHttpReq;
    }
    function setXMLHttpReqHeaders(objXMLHttpReq){
        objXMLHttpReq.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if(objXMLHttpReq.overrideMimeType)
            objXMLHttpReq.overrideMimeType('text/html; charset=windows-1251');
    }
    function get(name){
        if(name = (new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }
    }
})();