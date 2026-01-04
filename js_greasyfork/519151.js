// ==UserScript==
// @name         预发映射警告
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  辅助工具
// @author       mocobk
// @match        *://tmesaas-pre.tencentmusic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tencentmusic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519151/%E9%A2%84%E5%8F%91%E6%98%A0%E5%B0%84%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519151/%E9%A2%84%E5%8F%91%E6%98%A0%E5%B0%84%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

const isDebugger = false;
function log(...message){
    if (isDebugger){
        console.log(...message);
    }
}

function getElementBySelector(selector, parentNode = null) {
    log("getElementBySelector", selector, parentNode);
    return (parentNode || document).querySelector(selector);
}

function findElement(callback, timeout = 10000, interval = 500) {
    const startTime = Date.now();
    return new Promise(function (resolve, reject) {
        const intervalHandler = setInterval(function () {
            const el = callback();
            if (el) {
                resolve(el);
                clearInterval(intervalHandler);
            }
            if (Date.now() - startTime >= timeout) {
                resolve(null);
                clearInterval(intervalHandler);
            }
        }, interval);
    });
}

async function findElementBySelector(selector, parentNode = null, timeout = 10000, interval = 500) {
    log("findElementBySelector", selector);
    const result = await findElement(() => getElementBySelector(selector, parentNode), timeout, interval);
    if (result) {
        return result;
    } else {
        log("Error: findElementBySelector failed", selector);
        return null;
    }
}

async function addWarningBlock() {
    const warningBlock = document.querySelector('#warningBlock');
    if (warningBlock){
        return
    }

    const logo = await findElementBySelector('.ant-pro-global-header-logo');
    if(logo){
        log('添加警告');
        const div = document.createElement('div');
        div.setAttribute('id', 'warningBlock');
        div.innerHTML = `<div style="padding: 10px;display: flex;height: 40px;color: #fe4a4a;font-size: 20px;background: #fcd6d6;border-radius: 20px;align-items: center;">当前预发环境存在映射，请勿操作写数据！</div>`;
        logo.after(div);
    }
}

async function removeWarningBlock() {
    const warningBlock = document.querySelector('#warningBlock');
    if (warningBlock){
        warningBlock.remove();
    }
}



async function hasUserMapping() {
    const token = localStorage.getItem('tme-header-token')
    if (!token) {
        return false
    }
    const response = await fetch('https://tmesaas-pre.tencentmusic.com/openapi/musician/companySaas/user/getMyUserInfo', {
        headers: { 'content-type': 'application/json', 'tme-header-token':  token}
    })
    const data = await response.json()
    const departmentTreeName = data?.data?.departmentTreeName
    log('预发环境saas ->', departmentTreeName)
    return !departmentTreeName.startsWith('预发环境saas')
}

async function handleWarning() {
    const isMapping = await hasUserMapping();
    if (!isMapping){
        log('账号无有映射');
        await removeWarningBlock();
        return
    }
    log('账号有映射');
    await addWarningBlock();

}

(async function() {
    'use strict';

    // Your code here...
    log('==============SaaS 预发映射警告==============');
    handleWarning();
    setInterval(handleWarning, 10000)
})();