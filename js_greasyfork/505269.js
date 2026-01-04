// ==UserScript==
// @name         美化扣子
// @namespace    http://tampermonkey.net/
// @version      2024-08-26.0.0.8
// @description  美化扣子界面，去除左侧页面
// @author       loszhang
// @match        https://www.coze.cn/space/**
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505269/%E7%BE%8E%E5%8C%96%E6%89%A3%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/505269/%E7%BE%8E%E5%8C%96%E6%89%A3%E5%AD%90.meta.js
// ==/UserScript==
let intervalId;
let onboardingEditor;
let hasReloaded = false;  // 新增一个标志变量

function waitForDiv() {
    var divs = document.getElementsByClassName('semi-spin-children');
    if (divs.length > 0) {
        // 找到了元素，执行相关操作
        var secondChild = divs[0].children[1];
        if (secondChild && secondChild.children.length > 0) {
            var firstGrandChild = secondChild.children[0];
            // 在此处对获取到的元素进行操作
            firstGrandChild.children[0].remove()
            // 找到了就停止检查
            clearInterval(intervalId);
        }
    }
}

function removeOnboarding() {
    var ele = document.getElementById('onboarding-editor');
    if (ele) {
        ele.remove();
        clearInterval(onboardingEditor);
    }
}

function handleReload() {
    if (!hasReloaded) {  // 如果还没有刷新过
      location.reload();
        hasReloaded = true;  // 设置为已刷新
    }
}

window.onload = function () {
    intervalId = setInterval(waitForDiv, 500);
    onboardingEditor = setInterval(removeOnboarding, 500);
};