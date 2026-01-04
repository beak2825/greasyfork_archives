// ==UserScript==
// @name         SNH48海砂积分卡批量兑换
// @version      0.2
// @description  SNH48海砂积分卡批量兑换脚本
// @author       @MikuZZ
// @match        https://ceremony.ckg48.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/548282
// @downloadURL https://update.greasyfork.org/scripts/447330/SNH48%E6%B5%B7%E7%A0%82%E7%A7%AF%E5%88%86%E5%8D%A1%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/447330/SNH48%E6%B5%B7%E7%A0%82%E7%A7%AF%E5%88%86%E5%8D%A1%E6%89%B9%E9%87%8F%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

const batchActivateCode = (codesArray) => {
    console.info(codesArray);
    resetErrorLog();
    updateSucceedCount(0);
    updateFailedCount(0);
    codesArray = codesArray.filter((code) => code.match(/[0-9a-z]{15}/));
    const numCodes = codesArray.length;
    if (numCodes === 0) {
        alert(`没有检测到正确的记分码`);
        return;
    }
    const activateConfirm = confirm(`共检测到${numCodes}个积分卡，确认兑换？`);
    if (!activateConfirm) {
        return;
    }

    activateCode(codesArray, 0);
};

const getSucceedCount = () => {
    const text = document.querySelector('#succeedCountField').innerHTML.split('：')[1];
    return parseInt(text);
}

const updateSucceedCount = (value) => {
    const field = document.querySelector('#succeedCountField');
    field.textContent = `成功：${value}`;
}

const getFailedCount = () => {
    const text = document.querySelector('#failedCountField').innerHTML.split('：')[1];
    return parseInt(text);
}

const updateFailedCount = (value) => {
    const field = document.querySelector('#failedCountField');
    field.textContent = `失败：${value}`;
}

const appendErrorLog = (text) => {
    const field = document.querySelector('#failedCodesDisplay');
    const logTextElement = document.createElement('div');
    logTextElement.textContent = text;
    field.appendChild(logTextElement);
}

const resetErrorLog = () => {
    const field = document.querySelector('#failedCodesDisplay');
    field.innerHTML = '';
    field.textContent = '兑换失败记录：';
}

const activateCode = (codesArray, idx) => {
    if (idx >= codesArray.length) {
        console.info('done');
        alert('批量兑换完成。')
        return;
    }

    var code = codesArray[idx];

    ActiveCode(code, function(response) {
        updateSucceedCount(getSucceedCount() + 1);

        var total = Number(GetCookie('vote_total'));
        var rest = Number(GetCookie('vote_rest'));
        var add = Number(response.addTp);
        total = total + add;
        rest = rest + add;
        SetCookie('vote_total', total);
        SetCookie('vote_rest', rest);

        setTimeout(() => activateCode(codesArray, idx + 1), 2000);
    }, function(response) {
        console.info(response);
        appendErrorLog(`${code} ${response.message}`);
        updateFailedCount(getFailedCount() + 1);
        setTimeout(() => activateCode(codesArray, idx + 1), 2000);
    });
}

(function() {
    'use strict';

    const textarea = document.createElement('textarea');
    const inputBox = document.querySelector('#code');
    textarea.style = inputBox.style;
    textarea.style.color = 'black';
    textarea.style.width = '100%';
    inputBox.replaceWith(textarea);

    const succeedCount = document.createElement('div');
    succeedCount.id = 'succeedCountField';
    succeedCount.innerHTML = '成功：0';
    const failedCount = document.createElement('div');
    failedCount.id = 'failedCountField';
    failedCount.innerHTML = '失败：0';
    const failedCodesDisplay = document.createElement('div');
    failedCodesDisplay.id = 'failedCodesDisplay';
    failedCodesDisplay.textContent = '兑换失败记录：';
    failedCodesDisplay.style.width = '100%';
    failedCodesDisplay.style.height = '100px';
    failedCodesDisplay.style.overflow = 'auto'
    failedCodesDisplay.style.background = '#ffffff6F';
    failedCodesDisplay.style.borderRadius = '5px';
    failedCodesDisplay.style.padding = '5px';

    const inputParentElement = document.querySelector('.layer-activate-box .content .end')
    inputParentElement.appendChild(succeedCount);
    inputParentElement.appendChild(failedCount);
    inputParentElement.appendChild(failedCodesDisplay);

    const oldActiveButton = document.querySelector('#activeBtn');
    const newActiveButton = oldActiveButton.cloneNode();
    newActiveButton.innerHTML = oldActiveButton.innerHTML;
    oldActiveButton.replaceWith(newActiveButton);
    newActiveButton.addEventListener('click', () => {
        const codes = document.querySelector('textarea').value.split('\n');
        batchActivateCode(codes);
    });

})();