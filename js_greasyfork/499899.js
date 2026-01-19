// ==UserScript==
// @name         【TGU】ExURP
// @namespace    https://jwxs.tiangong.edu.cn/
// @version      2026-01-18
// @description  拓展 URP 教务系统的功能
// @author       tiny_fish
// @match        https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/thisTermScores/index
// @match        https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/allPassingScores/index
// @match        https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/coursePropertyScores/index
// @icon         https://jwxs.tiangong.edu.cn/img/icon/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499899/%E3%80%90TGU%E3%80%91ExURP.user.js
// @updateURL https://update.greasyfork.org/scripts/499899/%E3%80%90TGU%E3%80%91ExURP.meta.js
// ==/UserScript==

function thisTermScores(key) {
    GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/' + key + '/thisTermScores/data',
            onload: function(re) {
                let scores = JSON.parse(re.responseText)[0].list;
                let table = document.evaluate('/html/body/div[4]/div[2]/div[2]/div/div/div/div/div/div/div/table',document).iterateNext();
                let oth = document.createElement('th'); oth.innerHTML = '预估（仅暂存状态可用）';
                let thead = document.evaluate('thead/tr', table).iterateNext(); thead.append(oth);
                console.log(scores);
                let sumCredit = 0;
                let sumCreditScore = 0;
                for(let i = 0; i < scores.length; i++) {
                    if (scores[i].coursePropertyName == "必修" && scores[i].courseScore != "") {
                        sumCredit += 1.0 * scores[i].credit;
                        sumCreditScore += 1.0 * scores[i].courseScore * scores[i].credit;
                    }
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
                console.log("Average Credit Score:", sumCreditScore / sumCredit);
            }
    });
}

function allPassingScores(key) {
    GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/' + key + '/allPassingScores/callback',
            onload: function(re) {
                let data = JSON.parse(re.responseText).lnList;
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i]);
                    let scores = data[i].cjList;
                    let sumCredit = 0;
                    let sumCreditScore = 0;
                    for (let j = 0; j < scores.length; j++) {
                        if (scores[j].courseAttributeName != "任选") {
                            sumCredit += 1.0 * scores[j].credit;
                            sumCreditScore += 1.0 * scores[j].courseScore * scores[j].credit;
                        }
                    }
                    console.log("Average Credit Score:", sumCreditScore / sumCredit);
                    $('#tab' + (i+1) + ' h4').append(' <span class="label label-danger" style="border-radius: 10px;"><font style="color:white;">'+(sumCreditScore / sumCredit)+'</font></span>')
                }
            }
    });
}

function coursePropertyScores(key) {
    GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jwxs.tiangong.edu.cn/student/integratedQuery/scoreQuery/' + key + '/coursePropertyScores/callback',
            onload: function(re) {
                let data = JSON.parse(re.responseText).lnList;
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i]);
                    // console.log(document.getElementById("id_"+(i+1)));
                    let scores = data[i].cjList;
                    let sumCredit = 0;
                    let sumCreditScore = 0;
                    for (let j = 0; j < scores.length; j++) {
                        sumCredit += 1.0 * scores[j].credit;
                        sumCreditScore += 1.0 * scores[j].courseScore * scores[j].credit;
                    }
                    console.log("Average Credit Score:", sumCreditScore / sumCredit);
                    $('#id_' + (i+1) + ' h4').append(' <span class="label label-danger" style="border-radius: 10px;"><font style="color:white;">'+(sumCreditScore / sumCredit)+'</font></span>')
                }
            }
    });
}

(function() {
    'use strict';
    console.log(document.location.pathname);
    if (document.location.pathname === "/student/integratedQuery/scoreQuery/thisTermScores/index") {
        thisTermScores(document.documentElement.outerHTML.split('/student/integratedQuery/scoreQuery/')[1].split('/thisTermScores/data\";')[0]);
    }
    if (document.location.pathname === "/student/integratedQuery/scoreQuery/allPassingScores/index") {
        allPassingScores(document.documentElement.outerHTML.split('/student/integratedQuery/scoreQuery/')[1].split('/allPassingScores/callback\";')[0]);
    }
    if (document.location.pathname === "/student/integratedQuery/scoreQuery/coursePropertyScores/index") {
        coursePropertyScores(document.documentElement.outerHTML.split('/student/integratedQuery/scoreQuery/')[1].split('/coursePropertyScores/callback\";')[0]);
    }
})();