// ==UserScript==
// @name         智联一键list勾选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不合适页面一键勾选所有职位
// @author       Pakeh
// @match        https://rd6.zhaopin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhaopin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485202/%E6%99%BA%E8%81%94%E4%B8%80%E9%94%AElist%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/485202/%E6%99%BA%E8%81%94%E4%B8%80%E9%94%AElist%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

(function init() {
    window.onload = onloadStart()
})()

function onloadStart() {
    console.log('进入脚本');
    const validItems = document.getElementsByClassName( 'km-modal km-modal--open km-modal--normal km-modal--no-icon')
    console.log('validItems', validItems);
    if (validItems.length === 0) {
        console.log('没有元素: 1秒后重试');
        setTimeout(onloadStart, 500)
    }
    else {
        console.log('找到元素');
        button_list()
        console.log('懒加载侦测: 3秒后重试');
        setTimeout(onloadStart, 1500)
    }
}


let promptExist = false


//执行勾选
function button_list() {
    const list_search = document.getElementsByClassName('group-mismatch__list')
    console.log('第一阶段的值', list_search)
    if (list_search.length===0) {
        return;
    };
    const list_check =list_search[0].getElementsByClassName('km-checkbox km-control km-checkbox--checked km-checkbox--primary group-mismatch__item is-last');
    console.log('检查最后一个是否勾上', list_check,list_check.length)
    if (!list_check.length) {
        const check_box = list_search[0].getElementsByClassName('km-icon sati sati-check')
        console.log('第二阶段的值', check_box);
        const j = check_box.length
        if (!check_box) {
            return;
        };
        for (let i = 1; i <= j - 1; i++) {
            check_box[i].click();
        }
        console.log('新的checkbox', check_box);
        return;
    };
}


function getItemUUID(item) {
    let UUID = ''
    const jobItemRight = eleByClass(item, 'job-item__title--jobname')
    if (jobItemRight.length !== 0) {
        UUID = jobItemRight[0].innerText
    }
    return UUID
}

function parseLocal() {
    let l = getLocal()
    return l === null ? {} : JSON.parse(l)
}

function constructLocal(k, v) {
    let l = parseLocal()
    l[k] = v
    setLocal(JSON.stringify(l))
}

function setLocal(v) {
    window.localStorage.setItem('secretMemo', v)
}

function getLocal() {
    return window.localStorage.getItem('secretMemo')
}

function eleByClass(root = null, className) {
    const d = root === null ? document : root
    return d.getElementsByClassName(className)
}
