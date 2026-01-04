// ==UserScript==
// @name         Luogu看主页
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  删除洛谷用户主页维护消息，并在用户页面上显示隐藏的介绍
// @author       dreaum
// @license      GPL-3.0-or-later
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494554/Luogu%E7%9C%8B%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/494554/Luogu%E7%9C%8B%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

async function change() {
    // 删除具有特定样式和文本的 div 元素
    var elements = document.querySelectorAll('div');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.style && element.style.backgroundColor === 'rgb(255, 235, 236)' &&
            element.style.borderRadius === '5px' &&
            element.style.border === '1px solid rgb(225, 50, 56)' &&
            element.style.padding === '1em' &&
            element.style.fontStyle === 'italic' &&
            element.textContent.includes('系统维护，该内容暂不可见')) {
            element.remove();
        }
    }
    var elementToShow = document.querySelector(".introduction.marked");
    if (elementToShow) {
        elementToShow.style.display = "block";
    }
    var targetElement = document.querySelector("#app > div.main - container > main > div > div.full - container > section.main > div > div:nth - child(2)");
    if (targetElement && targetElement.textContent.indexOf("系统维护，该内容暂不可见")!== -1) {
        targetElement.remove();
    }
}
window.addEventListener('load', function() {
    change();
});