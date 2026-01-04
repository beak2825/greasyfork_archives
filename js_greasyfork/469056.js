// ==UserScript==
// @name         Shared Zhile GPT4
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  筛选出gpt4账号 user plus class flag
// @author       ZGR
// @match        https://*.zhile.io/shared.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469056/Shared%20Zhile%20GPT4.user.js
// @updateURL https://update.greasyfork.org/scripts/469056/Shared%20Zhile%20GPT4.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // delete non account-list
    let containerDivs = document.querySelectorAll(".container > div:not(.account-list)");
    containerDivs.forEach((div) => {
        div.remove();
    });
 
    // 获取包含特定 class 的父级 <div> 元素
    var ulElement = document.querySelector('div.account-list ul');
 
    // 如果找到了 <ul> 元素
    if (ulElement) {
        // 获取所有的 <li> 元素
        var listItems = ulElement.getElementsByTagName('li');
        var allLength = listItems.length;
 
        // plus清单
        var content = [
            '2144'
        ];
 
        // 循环遍历 <li> 元素
        for (var i = listItems.length - 1; i >= 0; i--) {
            var listItem = listItems[i];
            var listItemText = listItem.textContent.trim();
            // 如果 <li> 元素的文本内容在销号清单中或者子元素 <a> 的 class 属性没有 "plus"，则删除该元素
            var anchorElement = listItem.querySelector('a.plus');
            if (content.includes(listItemText) || !anchorElement) {
                listItem.parentNode.removeChild(listItem);
            } else {
                // 删除子元素 <a> 的 class 属性为 "plus"
                anchorElement.classList.remove('plus');
            }
        }
    }
 
    var plusLength = listItems.length;
 
    // 获取所有的<h1>元素
    var headings = document.getElementsByTagName("h1");
    // 遍历每个<h1>元素并替换内容(假设只有一个)
    var heading = headings[0];
    // 替换内容为指定文本
    heading.innerHTML = "本页面中包含一些免费的共享ChatGPT4账号 (" + plusLength + ")";


    // 替换为弹窗关闭按钮的class
    var closeButtonClass = "swal2-confirm";

    // 使用MutationObserver监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var closeButton = document.querySelector("." + closeButtonClass);
                if (closeButton) {
                    closeButton.click();
                    observer.disconnect();  // 如果你只想关闭第一个弹窗，可以在此断开观察器
                }
            }
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();