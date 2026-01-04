// ==UserScript==
// @name         AtCoderAverageResult
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  実行時間とメモリの平均を表示する
// @author       merom686
// @match        https://atcoder.jp/contests/*/submissions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429155/AtCoderAverageResult.user.js
// @updateURL https://update.greasyfork.org/scripts/429155/AtCoderAverageResult.meta.js
// ==/UserScript==

(function(){
    let tables = document.getElementsByTagName('table');
    if (tables.length < 5) return;

    let tbody = tables[tables.length - 1].getElementsByTagName('tbody')[0];
    let tds = tbody.getElementsByTagName('td');
    let n = tds.length;
    if (n % 4 != 0 || n <= 4) return;
    n /= 4;

    let a = [0, 0, 0, 0];
    let tle = 0;
    for (let i = 0; i < n * 4; i++){
        let t = tds[i].innerText;
        a[i % 4] += i % 4 < 2 ? t == 'AC' : parseInt(t);
        if (i % 4 == 1 && t == 'TLE') tle = 1;
    }
    let ms = ' ms';
    if (tle) ms = '+' + ms;

    let tr = document.createElement('tr');
    for (let i = 0; i < 4; i++){
        let td = document.createElement('td');
        if (i < 2){
            td.className = 'text-center';
            let s = '';
            let ac = [0x5c, 0xb8, 0x5c];
            let wa = [0xf0, 0xad, 0x4e];
            for (let j = 0; j < 3; j++){
                s += ('0' + Math.round((ac[j] * a[i] + wa[j] * (n - a[i])) / n).toString(16)).substr(-2);
            }
            td.innerHTML = i == 0 ? '<b>avg.</b>' : '<span class="label" style="background-color: #' + s + ';">' + a[i] + '/' + n + '</span>';
        } else {
            td.className = 'text-right';
            let t = i == 2 ? 10 : 1;
            td.innerHTML = Math.round(a[i] / n * t) / t + (i == 2 ? ms : ' KB');
        }
        tr.appendChild(td);
    }
    tbody.insertBefore(tr, tbody.firstChild);
})();