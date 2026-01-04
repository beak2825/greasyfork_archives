// ==UserScript==
// @name         SetUserName
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  set username
// @author       Minilong
// @match        https://*.tswjs.org/log/view/*
// @exclude      https://*.tswjs.org/log/view/xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417302/SetUserName.user.js
// @updateURL https://update.greasyfork.org/scripts/417302/SetUserName.meta.js
// ==/UserScript==

(function() {
    'use strict';
    app();
})();

// 创建元素插入
function app() {
    const root = document.createElement('div');
    setElement(root);
    root.innerHTML = `
    <a>修改测试号码</a>
  `
  const viewTitle = document.querySelector('.view-title');
    viewTitle.insertBefore(root, viewTitle.firstChild);
}

// 设置元素
function setElement(element) {
    let userName, url;
    Object.assign(element.style, getRootStyle());
    element.setAttribute('class', 'button r');
    element.addEventListener("click", function(){
        userName = saveUserName();
        if(!userName) return;
        url = getTargetURL(userName);
        redirectToMyLog(url);
    })
}

// 获取根元素样式
function getRootStyle() {
    return {
        cursor: 'pointer',
    }
}

// 设置用户名
function saveUserName() {
    const userName = prompt('输入测试号码', '');
    if(!userName) return;
    localStorage.setItem("tUserName",userName);
    return userName;
}

// 获取目标url
function getTargetURL(username) {
    const curURL = `${window.location.origin}/log/view/${username}`
  return curURL
}

// 重定向到目标url
function redirectToMyLog(url) {
    window.location.replace(url)
}