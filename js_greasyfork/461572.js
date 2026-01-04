// ==UserScript==
// @name         Nowcoder Quiz Snatcher
// @namespace    https://www.nowcoder.com/
// @version      0.1
// @description  自动化抓取牛客网上一些免费题库，并以CSV格式导出下载
// @author       Yifei Zhow
// @match        https://www.nowcoder.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461572/Nowcoder%20Quiz%20Snatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/461572/Nowcoder%20Quiz%20Snatcher.meta.js
// ==/UserScript==

// 以此页面举例：https://www.nowcoder.com/exam/intelligent?questionJobId=2&tagId=21029
const gKeywords = ['用户研究','原型设计','数据分析','产品常识','产品设计','产品规划','需求分析','竞品研究','文档撰写'];
// 针对某一题库，每次点击出题具有随机性，抓取到达一定的阈值后停止
const gThresholdLvl = 85;

/* JSON Object looks like:
 {"用户研究":{"claim_to_have": 56, "already_grabbed": 30, content: [{
   "id": 1261504920, "type": "单选题", "info": "题干", "options": ["A.甲甲甲","B.乙乙乙","C.丙丙丙","D.丁丁丁"]
 }, ..., {...}]}}
 */
const kNowWorkingKey = 'TM_NOWCODER_WORKING_KEY';
const kQuestionDictKey = 'TM_NOWCODER_QUESTION_DICT_KEY';
const kClaimToHave = 'claim_to_have';
const kAlreadyGrabbed = 'already_grabbed';


// Utilities
function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}

function hashCode(s) {
    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        if (!Array.isArray(row)) {
            // Mapping
            const mappedRow = [row['id'], row['type'], row['info']];
            Array.prototype.forEach.call(row['options'], function(el) {
                mappedRow.push(el);
            });
            row = mappedRow; // Deep copy preferred
        }
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// Sub-process
function storeQuestionIfNecessary(key, id, type, info, options = []) {
    let dict;
    try {
        dict = JSON.parse(window.localStorage.getItem(kQuestionDictKey) || '{}');
    } catch (error) {
        // JSON parse error!
        dict = {};
    }
    const keyDict = dict[key] || {};
    const keyContent = keyDict['content'] || [];
    for (let c of keyContent) {
        if (c['id'] == id) { return false; }
    }
    keyContent.push({
        id,
        type,
        info,
        options
    });
    // Write-back
    keyDict['content'] = keyContent;
    keyDict[kAlreadyGrabbed] = (keyDict[kAlreadyGrabbed] || 0) + 1;
    dict[key] = keyDict;
    window.localStorage.setItem(kQuestionDictKey, JSON.stringify(dict));
    return true;
}

function willJumpToNextWords(workingKey) {
    let dict;
    try {
        dict = JSON.parse(window.localStorage.getItem(kQuestionDictKey) || '{}');
    } catch (error) {
        return { 'next': false, 'final-word': false };
    }
    const keyDict = dict[workingKey] || {};
    const total = keyDict[kClaimToHave] || 0;
    const portion = keyDict[kAlreadyGrabbed] || 0;
    if (total == 0) {
        console.err('Now working percent: ', 'Unable to calculate.');
        alert('Total count missing!');
        return { 'next': false, 'final-word': false };
    } else {
        console.log('Now working percent: ', ((portion/total) * 100).toFixed(2) + '%');
    }

    if ((portion/total) * 100 > gThresholdLvl) {
        // Reach Threshold Level
        var idx = gKeywords.indexOf(workingKey);
        idx += 1;
        if (idx < gKeywords.length) {
            // Has next word
            workingKey = gKeywords[idx];
            window.localStorage.setItem(kNowWorkingKey, workingKey);
            return { 'next': true, 'final-word': false };
        } else {
            // Current is final word
            return { 'next': false, 'final-word': true };
        }
    } else {
        // Not reached
        return { 'next': false, 'final-word': false };
    }
}

function init() {
    let key = window.localStorage.getItem(kNowWorkingKey);
    if (!key) {
        key = gKeywords[0];
    }
    window.localStorage.setItem(kNowWorkingKey, key);
}

function reset() {
    window.localStorage.removeItem(kNowWorkingKey);
    window.localStorage.removeItem(kQuestionDictKey);
}

function storeClaim(workingKey, claim) {
    let dict;
    try {
        dict = JSON.parse(window.localStorage.getItem(kQuestionDictKey) || '{}');
    } catch (error) {
        return false;
    }
    const keyDict = dict[workingKey] || {};
    const total = keyDict[kClaimToHave];
    if (!total || total < 0 || total < claim) {
        // Write-back
        keyDict[kClaimToHave] = claim;
        dict[workingKey] = keyDict;
        window.localStorage.setItem(kQuestionDictKey, JSON.stringify(dict));
    }
}
// Main
(function() {
    'use strict';
    init();

    const h = getLocation(window.location.href);
    const workingKey = window.localStorage.getItem(kNowWorkingKey);

    let els;
    if (!h || h.hostname != "www.nowcoder.com") return;
    if (h.pathname == "/exam/intelligent") {
        // Index Page
        els = document.getElementsByClassName("exercise-card") || [];
        Array.prototype.forEach.call(els, function(el) {
            const title = el.querySelector(".exercises-card-title").innerText;
            const score = el.querySelector(".tw-text-gray-500").innerText;
            if (title.indexOf(workingKey) != -1) {
                // Extract kClaimToHave and Save
                const mth = score.match(/已做(\d+)\/(\d+)题/);
                if (mth && mth[2]) {
                    storeClaim(workingKey, parseInt(mth[2], 10));
                    setTimeout(function() {
                        el.click();
                    }, 2000);
                }
            }
        });
    } else if (h.pathname.indexOf('/exam/test/') != -1) {
        els = document.querySelectorAll(".test-paper .paper-question");
        Array.prototype.forEach.call(els, function(el) {
            const qType = el.querySelector(".question-desc-header").innerText;
            const qInfo = el.querySelector(".question-info").innerText;
            let qOptions = [];
            Array.prototype.forEach.call(el.querySelectorAll(".question-select .option-item"), function(e) { qOptions.push(e.innerText); });
            const qID = hashCode(qInfo);
            const isStored = storeQuestionIfNecessary(workingKey, qID, qType, qInfo, qOptions);
            console.log('Is Stored: ', isStored, qType);
        });
        // Exam Page
        let result = willJumpToNextWords(workingKey);
        if (result['final-word']) {
            if (confirm("Scnatched completed, export as CSV?")) {
                 var dict = JSON.parse(window.localStorage.getItem(kQuestionDictKey));
                Array.prototype.forEach.call(gKeywords, function(k) {
                    exportToCsv(k+'.csv', dict[k]['content']);
                });
                // reset();
            }
        } else {
             setTimeout(function() {
                 history.back();
             }, 2000);
        }
    }
})();