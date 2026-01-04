// ==UserScript==
// @name         Automatic Order Acceptance1
// @namespace    http://tampermonkey.net/
// @version      2024-03-14
// @description  自动接单
// @author       LiChao
// @match        http://*/*admin/order/index.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489783/Automatic%20Order%20Acceptance1.user.js
// @updateURL https://update.greasyfork.org/scripts/489783/Automatic%20Order%20Acceptance1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于存储定时器ID的变量
    let intervalId;
    // 函数用于启动或停止自动点击
    function toggleAutoClick() {
        const buttonText = localStorage.getItem('buttonText') || '自动接单';
        if (buttonText === '停止接单') {
            if (!intervalId) {
                intervalId = setInterval(function() {
                    document.querySelector('#getticket').click();
                }, 1000);
            }
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    }

    // 创建按钮并添加到页面上
    function createButton() {
        const secondNavUl = document.querySelector('ul.nav:nth-child(2)');
        if (secondNavUl) {
            const button = document.createElement("button");
            button.innerHTML = localStorage.getItem('buttonText') || '自动接单';
            button.classList.add("btn", "btn-primary");
            const newLi = document.createElement("li");
            newLi.style.float = "right";
            newLi.style.display = "flex";
            newLi.style.alignItems = "center";
            newLi.appendChild(button);
            secondNavUl.appendChild(newLi);
            // 给按钮绑定点击事件
            button.addEventListener('click', function() {
                if (button.innerHTML === '自动接单') {
                    button.innerHTML = '停止接单';
                    localStorage.setItem('buttonText', '停止接单');
                } else {
                    button.innerHTML = '自动接单';
                    localStorage.setItem('buttonText', '自动接单');
                }
                toggleAutoClick(); // 切换自动点击状态
            });
        } else {
            console.log('页面中没有找到符合条件的第二个<ul>元素。');
        }
    }

    createButton(); // 创建按钮
    toggleAutoClick(); // 根据localStorage的值启动或停止自动点击



})();