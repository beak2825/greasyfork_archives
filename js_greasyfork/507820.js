// 脚本使用方法请参考 https://www.tampermonkey.net/faq.php 或 https://greasyfork.org/zh-CN (这行代码不要复制)
// 这俩都是国外网站, 上不去的话直接百度 "油猴脚本使用方法" 就行(这行代码也不要复制)

// ==UserScript==
// @name         有没有人一起从零开始刷力扣
// @namespace    likou-replace
// @version      1.0
// @description  none
// @author       isudox
// @website      https://gist.github.com/isudox/03f39efb5b67375f1ed7fe1617be9a4e
// @match        https://leetcode.cn/circle/discuss/48kq9d/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507820/%E6%9C%89%E6%B2%A1%E6%9C%89%E4%BA%BA%E4%B8%80%E8%B5%B7%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%88%B7%E5%8A%9B%E6%89%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/507820/%E6%9C%89%E6%B2%A1%E6%9C%89%E4%BA%BA%E4%B8%80%E8%B5%B7%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%88%B7%E5%8A%9B%E6%89%A3.meta.js
// ==/UserScript==

/* globals $, jQuery */
'use strict';

let proMap = new Map(),
    transMap = new Map(),
    statusMap = new Map(),
    buildMapComplete = false;

const getProblems = () => {
    $.get("https://leetcode.cn/api/problems/all/").then((response) => {
        getTrans(JSON.parse(response));
    });
}

const getTrans = (picker) => {
    $.ajax({
        method: "POST",
        url: 'https://leetcode.cn/graphql/',
        headers: {
            "content-type": "application/json",
            "x-definition-name": "getQuestionTranslation",
            "x-operation-name": "getQuestionTranslation",
            "x-csrftoken": getCookie("csrftoken"),
            "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        data: JSON.stringify({
            "operationName": "getQuestionTranslation",
            "variables": {},
            "query": "query getQuestionTranslation($lang: String) {translations: allAppliedQuestionTranslations(lang: $lang) {title questionId __typename}}"
        })
    }).then((trans) => {
        buildMap(picker, trans);
    });
}


const buildMap = (picker, trans) => {
    for (let pro of picker.stat_status_pairs) {
        proMap.set(pro.stat.frontend_question_id, pro.stat.question__title_slug);
        statusMap.set(pro.stat.frontend_question_id, pro.status)
    }
    for (let t of trans.data.translations) {
        transMap.set(t.questionId, t.title);
    }
    buildMapComplete = true;
};

const getCookie = (name) => {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(reg);
    if (arr) {
        return unescape(arr[2]);
    } else {
        return null;
    }
};

const replace = () => {
    let even = true;
    for (let problem of $("table tr td")) {
        if (!even) {
            let htmlString = "";
            let normalExit = true;
            for (let id of problem.textContent.split('、')) {
                if (isNaN(parseInt(id))) {
                    normalExit = false;
                    break;
                }
                let color = ''
                if (statusMap.get(id) == 'ac') {
                    color = 'color:#008000'
                }
                htmlString += `<a href = 'https://leetcode.cn/problems/${proMap.get(id)}/' title = '${transMap.get(id)}' target = '_blank' style='${color}'>${id}</a>、`;
            }
            if (normalExit) {
                problem.innerHTML = `<td>${htmlString.substring(0, htmlString.length - 1)}</td>`;
            }
        }
        even = !even;
    }

}

getProblems();

const interval = setInterval(() => {
    if (buildMapComplete && $("table tr td").length !== 0) {
        clearInterval(interval);
        replace();
    }
}, 5e2);