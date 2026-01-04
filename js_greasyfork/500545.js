// ==UserScript==
// @name         南京大学快速查看GPA
// @namespace    http://tampermonkey.net/
// @version      2025-01-12
// @description  在南大交换生系统首页直接显示GPA和排名，而无需点开申请页面
// @author       Coxine
// @match        http://elite.nju.edu.cn/exchangesystem/
// @match        http://elite.nju.edu.cn/exchangesystem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nju.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500545/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8BGPA.user.js
// @updateURL https://update.greasyfork.org/scripts/500545/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8BGPA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const loginDiv = document.querySelector('.login-in');
    if (isLogin(loginDiv)) {
        console.log('Login, display rank');
        loginDiv.removeChild(loginDiv.lastChild);
        loginDiv.removeChild(loginDiv.lastChild);
        calcRank().then(data => addRank(data, loginDiv));
    }
})();

function isLogin(loginDiv) {
    return loginDiv !== null;
}

async function calcRank() {
    // fetch
    const url = "http://elite.nju.edu.cn/exchangesystem/index/create?pid=380"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const gpaElement = doc.querySelector('body > div > div:nth-child(4) > div:nth-child(11) > div:nth-child(3) > div.xm_text_span > span');
        const gpa = parseFloat(gpaElement.innerHTML);
        const rankPercent = doc.querySelector('input[name="data.pmbfb"]').value;
        const rankPercentVal = parseFloat(rankPercent.substring(0, rankPercent.length - 1));
        const total = parseInt(doc.querySelector('input[name="data.zyzrs"]').value);
        const rank = Math.round(rankPercentVal * total / 100);
        return [gpa, rank, total];
    } catch (error) {
        console.error('Failed to fetch the title:', error);
        return null;
    }
}

function addRank(data, loginDiv) {
    const GPADiv = document.createElement('p');
    GPADiv.innerText = `GPA: ${data[0]}`;
    const rankDiv = document.createElement('p');
    rankDiv.innerText = `排名: ${data[1]}/${data[2]}`;
    loginDiv.appendChild(GPADiv);
    loginDiv.appendChild(rankDiv);
}


