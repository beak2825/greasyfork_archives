// ==UserScript==
// @name         Clan members last online
// @namespace    nexterot
// @version      1.0.1
// @license      none
// @description  Поиск афк игроков в клане
// @author       nexterot
// @match        https://www.heroeswm.ru/clan_info.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512969/Clan%20members%20last%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/512969/Clan%20members%20last%20online.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg_last_online = /В последний раз была? [0-9]{2}:[0-9]{2} ([0-9]{2}-[0-9]{2}-[0-9]{2})/g;
    window.onload = function(){
        var buttonTr = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2)");
        if (buttonTr == null) {
            buttonTr = document.querySelector("#android_container > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2)");
        }
        buttonTr.innerHTML += '<td width="90" class="wblight" align="right"><span id="show_players_statistics" style="cursor: pointer; text-decoration: underline">Статистика по игрокам</span></td>';
        var table = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1)");
        if (table == null) {
            table = document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(1)");
        }
        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (col.colSpan >= 2){
                    col.colSpan = table.rows[1].cells.length;
                }
            }
        }
        $('show_players_statistics').addEventListener('click', e => {
            showStats(table);
        });
    };
    function showStats(table) {
        var cell = $("stats_cell");
        if (cell == null)
        {
            var statsRow = table.insertRow(2);
            cell = statsRow.insertCell();
            cell.colSpan = table.rows[1].cells.length;
            cell.id = "stats_cell";
            var resultWindow = document.createElement('span');
            resultWindow.id = 'result';
            cell.appendChild(resultWindow);
            var reg = /pl_info\.php\?id=([0-9]+)/g;
            var tab = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(3)");
            if (tab == null) {
                tab = document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(3)");
            }
            var arr = Array.from(tab.innerHTML.matchAll(reg));
            run(arr);
        }
    }
    function run(arr) {
        var link = arr.shift()[0];
        var args = {arr:arr, link:link, count:1};
        request(link, onResponseCallback, args);
    }
    function onResponseCallback(objXMLHttpReq, args){
        if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {
            var k = args.count;
            var resultWindow = $("result");
            var p = objXMLHttpReq.responseText;
            var strin = `style="font-size:inherit; line-height: 0px;font-weight:inherit;display:inline-block;margin-block-start: inherit;"`;
            var pos = p.indexOf(strin);
            var endpos = p.indexOf('</h1>', pos);
            var nick = p.substring(pos + strin.length + 1, endpos);
            var pl_link = args.link;
            var last_online;
            if (p.includes('<font color="red"><b>(заблокирован)</b></font>')) {
                resultWindow.innerHTML += `${Number(k)}. заблокирован: <a href="${pl_link}">${nick}</a><br>`;
            }
            else if (p.includes('<b>Персонаж сейчас в игре</b>')) {
                resultWindow.innerHTML += `${Number(k)}. Персонаж сейчас в игре: <a href="${pl_link}">${nick}</a><br>`;
            }
            else if (p.includes('>Персонаж сейчас в бою</font>')) {
                resultWindow.innerHTML += `${Number(k)}. Персонаж сейчас в бою: <a href="${pl_link}">${nick}</a><br>`;
            }
            else if (last_online = p.match(reg_last_online)) {
                var dateString = last_online[0].substring(last_online[0].length - 8, last_online[0].length);
                var dateParts = dateString.split('-');
                var s = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                var date = new Date(s);
                var today = new Date();
                let dif = Math.round((today - date) / (1000 * 3600 * 24));
                var c='', ce='';
                if (dif > 10)
                {
                    c = '<font color="red">';
                    ce = '</font>';
                }
                resultWindow.innerHTML += `${c}${Number(k)}. ${last_online[0]}${ce}: <a href="${pl_link}">${nick}</a><br>`;
            }
            if (args.arr.length == 0)
            {
                return;
            }
            var link = args.arr.shift()[0];
            var newArgs = {link:link, arr:args.arr, count:args.count+1};
            request(link, onResponseCallback, newArgs);
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
    function getElementByXPath(xPath) {
        return document.evaluate(
            xPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue;
    }
})();