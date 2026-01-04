// ==UserScript==
// @name         AHC_ScoreInfo
// @namespace    https://twitter.com/merom686
// @version      1.0
// @description  長期AHCのシステムテストの得点の最小値などを表示
// @author       merom686
// @match        https://atcoder.jp/contests/*/submissions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432383/AHC_ScoreInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/432383/AHC_ScoreInfo.meta.js
// ==/UserScript==

(function() {
    let div = document.getElementsByClassName('table-responsive')[0];
    let tds = div.getElementsByTagName('tr')[1].getElementsByTagName('td');
    let n = 0, s1 = 0, s2 = 0;
    let ma = 0, mi = 1e+100, ze = 0;
    for (let td of tds){
        let s = parseInt(td.innerText);
        if (s > 0){
            ma = Math.max(ma, s);
            mi = Math.min(mi, s);
            s1 += s;
            s2 += s * s;
            n++;
        } else {
            ze++;
        }
    }
    if (n + ze < 50) return;
    if (n == 0) n = 1, mi = 0;
    let p = document.createElement('p');
    p.setAttribute('style', 'border: 1px solid; border-color: #ddd; padding: 4px');
    let sd = Math.round(Math.sqrt((s2 - s1 * s1 / n) / (n - 1.5)));
    p.innerHTML = 'max : ' + ma + '<br>avg : ' + Math.round(s1 / n) + '<br>min : ' + mi + '<br>SD : ' + sd + '<br>zero : ' + ze;
    div.parentNode.parentNode.insertBefore(p, div.parentNode);
})();