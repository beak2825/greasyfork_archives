// ==UserScript==
// @name         【TGU】查询暂存成绩
// @namespace    https://jwxs.tiangong.edu.cn/
// @version      2025-06
// @description  URP教务系统查询暂存成绩
// @author       tiny_fish
// @match        https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/thisTermScores/index
// @icon         https://jwxs.tiangong.edu.cn/img/icon/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499899/%E3%80%90TGU%E3%80%91%E6%9F%A5%E8%AF%A2%E6%9A%82%E5%AD%98%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499899/%E3%80%90TGU%E3%80%91%E6%9F%A5%E8%AF%A2%E6%9A%82%E5%AD%98%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

function sol(key) {
    GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/' + key + '/thisTermScores/data',
            onload: function(re) {
                let scores = JSON.parse(re.responseText)[0].list;
                let table = document.evaluate('/html/body/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/table',document).iterateNext();
                let oth = document.createElement('th'); oth.innerHTML = '预估（仅暂存状态可用）';
                let thead = document.evaluate('thead/tr', table).iterateNext(); thead.append(oth);
                console.log(scores);
                for(let i = 0; i < scores.length; i++) {
                    let tbody = document.evaluate('tbody/tr[' + (i+1) + ']', table).iterateNext();
                    let val = document.createElement('td');
                    if(scores[i].inputStatusCode === '03') {
                        if(scores[i].levlePoint == '-100') val.innerHTMML = '[100, 100]';
                        else if(scores[i].levlePoint === '-95') val.innerHTML = '[95, 100)';
                        else if(scores[i].levlePoint === '-60') val.innerHTML = '[60, 75)';
                        else val.innerHTML = '[' + scores[i].levlePoint.split('-')[1] + ', ' + (parseInt(scores[i].levlePoint.split('-')[1]) + 10) + ')';
                    } else {
                        val.innerHTML = '--';
                    }
                    tbody.append(val);
                }
            }
    });
}

(function() {
    'use strict';
    let key = document.documentElement.outerHTML.split('/student/integratedQuery/scoreQuery/')[1].split('/thisTermScores/data\";')[0];
    sol(key);
    console.log(key);
})();