// ==UserScript==
// @name         定位墨刀侧边栏元素
// @namespace    https://www.cnfschool.com/
// @version      0.8
// @description  修复墨刀不能定位侧边栏的问题
// @author       Air
// @match        https://modao.cc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485244/%E5%AE%9A%E4%BD%8D%E5%A2%A8%E5%88%80%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/485244/%E5%AE%9A%E4%BD%8D%E5%A2%A8%E5%88%80%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scrollToElement() {
        var screenValue = window.location.hash.substring(8);
        var element = document.querySelector('[data-cid="' + screenValue + '"]');
        if (element) {
            var scrollEle = document.getElementsByClassName('screen-list-container literal')[0];
            scrollEle.scrollTo({
                top: element.offsetTop - 300,
                behavior: "smooth"
            });
        }
    }

    function addButton() {
        var button = document.createElement('button');
        button.innerHTML = '定位侧边栏元素';
        button.style.height = '32px';
        button.style.width = '160px';
        button.style.border = 'none';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '99999999';
        button.style.transition = 'background 0.3s ease';
        button.addEventListener('click', scrollToElement);
        button.addEventListener('mouseover', function() {
            button.style.background = '#45a049';
        });
        button.addEventListener('mouseout', function() {
            button.style.background = '#4CAF50';
        });
        var bar = document.getElementsByClassName("toolbar-right")[0];
        bar.appendChild(button);
    }

    function checkAndAddButton() {
        var targetNode = document.querySelector('.toolbar-right');
        if (targetNode) {
            addButton();
            observer.disconnect(); // 停止监听
        }
    }

    // 创建一个观察器实例并传入回调函数
    var observer = new MutationObserver(checkAndAddButton);
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();