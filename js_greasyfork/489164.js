// ==UserScript==
// @name         Статистика по кузнецам
// @license      MIT
// @namespace    nexterot
// @homepage     https://greasyfork.org/ru/scripts/489164-%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0-%D0%BF%D0%BE-%D0%BA%D1%83%D0%B7%D0%BD%D0%B5%D1%86%D0%B0%D0%BC
// @version      2.0.2
// @description  Статистика по клановым кузнецам
// @author       nexterot
// @include      *heroeswm.ru/sklad_info.php?id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/489164/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%BA%D1%83%D0%B7%D0%BD%D0%B5%D1%86%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/489164/%D0%A1%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BF%D0%BE%20%D0%BA%D1%83%D0%B7%D0%BD%D0%B5%D1%86%D0%B0%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sklad_id = 32;
    var stop = false;

    setTimeout(main, 300);

    function main() {
        sklad_id = get('id');
        var buttonTr = getElemenByXPath("/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]");
        if (buttonTr == null) {
            buttonTr = getElemenByXPath(`//*[@id="android_container"]/table[1]/tbody/tr[1]`);
        }
        buttonTr.innerHTML += '<td width="90" class="wblight" align="right"><span id="show_smith_statistics" style="cursor: pointer; text-decoration: underline">Статистика по кузнецам</span></td>';

        var table = getElemenByXPath("/html/body/center/table/tbody/tr/td/table[1]");
        if (table == null) {
            table = getElemenByXPath(`//*[@id="android_container"]/table[1]`);
        }
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (col.colSpan >= 3){
                    col.colSpan = table.rows[0].cells.length;
                }
            }
        }

        $('show_smith_statistics').addEventListener('click', e => {
            showStats(table);
        });
    }
    function showStats(table) {
        var cell = $("stats_cell");
        if (cell == null)
        {
            var statsRow = table.insertRow(2);
            cell = statsRow.insertCell();
            cell.colSpan = table.rows[0].cells.length;
            cell.id = "stats_cell";
            cell.innerHTML += `<span id="run" style="cursor: pointer; text-decoration: underline"> Запросить</span> статистику с: <input id="date_from" type="date" value="2017-06-01"> по: <input id="date_to" type="date"> `;
            cell.innerHTML += `(страница, с которой начинать поиск: <input type="number" min="1" id="start_page" value="1" width="6" style="width: 80px">) `;
            cell.innerHTML += `<span id="stop" style="cursor: pointer; text-decoration: underline">Стоп</span><br>`;
            var resultWindow = document.createElement('span');
            resultWindow.id = 'result';
            cell.appendChild(resultWindow);
            $('run').addEventListener("click", run);
            $('stop').addEventListener("click", forceStop);
            var fromDate = new Date();
            $('date_from').valueAsDate = new Date();
            $('date_to').valueAsDate = new Date();
        }
    }
    function onResponseCallback(objXMLHttpReq, args){
        if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {
            if (stop) {
                return;
            }
            var dateStr = '';
            var page = objXMLHttpReq.responseText;
            var resultWindow = $("result");
            var stopDateFound = false;
            if (page.includes('Клан участвует в боевых действиях')) {
                resultWindow.innerHTML = 'Клан участвует в боевых действиях. Протокол склада cейчас скрыт.';
                return;
            }
            var divPosStart = page.indexOf('<div class="global_a_hover">');
            var divPosEnd = page.indexOf('</div>', divPosStart);
            var divHTML = page.substring(divPosStart + '<div class="global_a_hover">'.length, divPosEnd);
            var lines = divHTML.split('<BR>');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var regexpFastCheckDates = /&nbsp;&nbsp;(\d\d-\d\d-\d\d \d\d:\d\d): .+/
                var res = line.match(regexpFastCheckDates);
                if (res) {
                    dateStr = res[1];
                    var datePts = dateStr.split(' ');
                    var dateDays = datePts[0].split('-');
                    var dStr = dateDays[1] + '-' + dateDays[0] + '-' + dateDays[2];
                    var d = new Date(dStr);
                    var dateDay = dateStr.substring(0, 2);
                    if (d < args.date_from) {
                        console.log('fast skip');
                        stopDateFound = true;
                        break;
                    }
                }
                var regexp = /&nbsp;&nbsp;(\d\d-\d\d-\d\d \d\d:\d\d): <a href=\"pl_info\.php\?id=(\d+)\"><b>(.+)<\/b><\/a> взял в ремонт .+/
                res = line.match(regexp);
                if (res) {
                    if (d <= args.date_to) {
                        var nick = res[3];
                        if (!args.map.get(nick)) {
                            args.map.set(nick, 1);
                        } else {
                            args.map.set(nick, args.map.get(nick) + 1);
                        }
                    }
                }
            }
            if (lines.length == 0) {
                console.log('ClanSmithsStatistics: no lines found');
                stopDateFound = true;
            }
            var result = `<br>Обработка страницы №${args.page_id}, дата ${dateStr}<br><br>`;
            if (stopDateFound) {
                result = `<br>Обработка завершена (поиск закончен на странице №${args.page_id+1}).<br><br>`;
            }
            bySortedValue(args.map, function(key, value) {
                result += `${key}: ${value}<br>`;
            });
            resultWindow.innerHTML = result;
            if (stopDateFound) return;
            var newArgs = {page_id:args.page_id+1,date_from:args.date_from,date_to:args.date_to,map:args.map};
            request(`sklad_log.php?id=${sklad_id}&page=${args.page_id+1}`, onResponseCallback, newArgs);
        }
    }
    function request(url_req, callback, args){
        var objXMLHttpReq = createXMLHttpReq();
        try{
            objXMLHttpReq.open('GET', url_req, true);
            setXMLHttpReqHeaders(objXMLHttpReq);
            objXMLHttpReq.onreadystatechange = function() { callback(objXMLHttpReq, args); }
            objXMLHttpReq.send(null);
        }catch(e){console.log(e);alert("ClanSmithsStatistics: request failed with error=" + e);}
    }
    function run() {
        stop = false;
        var dateFrom = $('date_from').valueAsDate;
        dateFrom.setHours(0,0,0);
        var dateTo = $('date_to').valueAsDate;
        dateTo.setHours(23,59,59);
        var start_page_id = Number($('start_page').value) - 1;
        var map = new Map();
        var args = {page_id:start_page_id,date_from:dateFrom,date_to:dateTo,map:map};
        request(`sklad_log.php?id=${sklad_id}&page=${start_page_id}`, onResponseCallback, args);
    }
    function forceStop() {
        stop = true;
    }
    function bySortedValue(obj, callback, context) {
        var tuples = [];

        for (var [key,val] of obj) tuples.push([key, val]);

        tuples.sort(function(a, b) {
            return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
        });

        var length = tuples.length;
        while (length--) callback.call(context, tuples[length][0], tuples[length][1]);
    }
    function getElemenByXPath(xPath) {
        return document.evaluate(
            xPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue;
    }
    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
    function get(name){
        if(name = (new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }
    }
    function createXMLHttpReq(){
        var objXMLHttpReq;
        if (window.XMLHttpRequest){
            objXMLHttpReq = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // IE
            objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            alert('ClanSmithsStatistics: Can\'t create XMLHttpRequest!');
        }
        return objXMLHttpReq;
    }
    function setXMLHttpReqHeaders(objXMLHttpReq){
        objXMLHttpReq.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
        if(objXMLHttpReq.overrideMimeType)
            objXMLHttpReq.overrideMimeType('text/html; charset=windows-1251');
    }
})();