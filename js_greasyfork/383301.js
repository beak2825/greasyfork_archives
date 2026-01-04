// ==UserScript==
// @name         批量cas转中文名
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  批量输入cas导出中文名
// @author       BY_Dark_wind
// @match        https://www.chemicalbook.com/Search.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383301/%E6%89%B9%E9%87%8Fcas%E8%BD%AC%E4%B8%AD%E6%96%87%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/383301/%E6%89%B9%E9%87%8Fcas%E8%BD%AC%E4%B8%AD%E6%96%87%E5%90%8D.meta.js
// ==/UserScript==

function main() {
    buttonEvent();
}

function buttonEvent() {//数据按钮
    let getMsds = document.createElement('div');
    getMsds.id = 'getMsds';
    document.body.appendChild(getMsds);
    createButton("输入cas导出中文名", "showName", 150);
    document.getElementById("showName").addEventListener('click', function (e) {
        let arrCompounds = [], resultNumber = [0];
        //处理输入字符串，去首尾空格，去除错误输入
        let arr = prompt("输入cas").trim().split(/\s+/), arrCas = [], allCas;
        for (var i = 0; i < arr.length; i++) {
            if (/\d+-\d+-\d+/.test(arr[i])) arrCas.push(arr[i]);
        }
        allCas = arrCas.join("+");
        let url = "Search.aspx?keyword=" + allCas;
        ajax(url, arrCompounds, resultNumber);
        let page = Math.floor(resultNumber[0] / 10);
        for (let i = 1; i <= page; i++) {
            url = "Search.aspx?keyword=" + allCas + "&start=" + i * 10;
            ajax(url, arrCompounds, resultNumber);
        }
        let strArr = [], find, t = false;
        for (let i = 0; i < arr.length; i++) {
            find = false;
            for (let j = 0; j < arrCompounds.length; j++) {
                if (arr[i] === arrCompounds[j].cas) {
                    strArr.push(arrCompounds[j]);
                    t = true;
                    find = true;
                    break;
                }
            }
            if (!find) strArr.push({cas: arr[i], name: "not found"});
        }
        //创建csv文档
        if (t) {
            let strCsv = "";
            for (let i = 0; i < strArr.length; i++) {
                strCsv = strCsv + "\"" + strArr[i].cas + "\",\"" + strArr[i].name + "\"\n";
            }
            let casData = document.createElement('a');
            casData.id = 'casData';
            casData.download = 'casData.csv';
            casData.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent("\uFEFF" + strCsv);
            document.body.appendChild(casData);
            document.getElementById('casData').click();
            document.getElementById('casData').parentNode.removeChild(document.getElementById('casData'));
        }
    });
}

function getNameAndCAS(str, arrCompounds) {//获取数据
    let temp;
    let nameArr = str.match(/&postData3=CN&SYMBOL_Type=D'\);">(.*)<\/a><\/td>/g);
    let casArr = str.match(/CAS：<\/font><\/td>\D+<td>(.*)<\/td>/g);
    for (var i = 0; i < nameArr.length; i++) {
        temp = {cas: null, name: null};
        temp.cas = casArr[i].replace(/\n/, "").match(/<td>(.*)<\/td>/)[1];
        temp.name = nameArr[i].match(/&postData3=CN&SYMBOL_Type=D'\);">(.*)<\/a><\/td>/)[1];
        if (!(temp.cas === " ")) arrCompounds.push(temp);
    }
}

function ajax(url, arrCompounds, resultNumber) {//ajax
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.onreadystatechange = function () {
        if (/^2\d{2}$/.test(xhr.status)) {
            if (xhr.readyState === 4) {
                let val = xhr.responseText;
                getNameAndCAS(val, arrCompounds);
                val = val.match(/LabelSummary">Results <b>\d+ - \d+<\/b> of <b>(\d+)<\/b>/)[1];
                if (!resultNumber[0] && !(val === null)) resultNumber[0] = val;
            }
        }
    };
    xhr.send(null);
}

function createButton(btnName, btnId, left) {//创建按钮
    let but = document.createElement('button');
    but.type = 'button';
    but.innerHTML = btnName;
    but.id = btnId;
    but.setAttribute("style", "top:160px; left:" + (50 + left) + "px; position:absolute; font-weight:bold; z-css:1;");
    document.getElementById("getMsds").appendChild(but);
}

main();