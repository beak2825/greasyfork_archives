// ==UserScript==
// @name         FC2PPVDB加强
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  Replace class in the specified domain and add search buttons
// @author       夜露死苦
// @match        https://fc2ppvdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2ppvdb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522654/FC2PPVDB%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/522654/FC2PPVDB%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define class names as variables for easy adjustment
    const imgOldClass = 'brightness-50';
    const imgNewClass = 'brightness-100';
    const divOldClass = 'brightness-50';
    const divNewClass = 'brightness-100';

    // Function to replace class names and add search buttons
    function replaceClassAndAddButtons() {
        // Replace class for img elements
        const images = document.querySelectorAll(`img.object-contain.object-center.w-full.max-h-80.rounded-lg.bg-gray-800.${imgOldClass}`);
        images.forEach(img => {
            img.classList.remove(imgOldClass);
            img.classList.add(imgNewClass);
        });

        // Replace class for div elements
        const divs = document.querySelectorAll(`div.relative.${divOldClass}`);
        divs.forEach(div => {
            div.classList.remove(divOldClass);
            div.classList.add(divNewClass);
        });

        // Add search buttons next to the ID numbers
        const idElements = document.querySelectorAll('div'); // 获取所有<div>元素
        idElements.forEach(idDiv => {
            if (idDiv.textContent.includes('ID：')) { // 检查是否包含"ID："
                const idSpan = idDiv.querySelector('span.text-white.ml-2'); // 获取包含数字的<span>
                const idNumber = idSpan.textContent.trim(); // 获取数字

                // 检查是否已经存在搜索按钮
                if (!idDiv.querySelector('button.search-button')) {
                    const searchButton = document.createElement('button');

                    // 设置按钮样式
                    searchButton.textContent = '搜索';
                    searchButton.className = 'search-button'; // 添加类名以便于选择
                    searchButton.style.marginLeft = '10px';
                    searchButton.style.padding = '5px 10px';
                    searchButton.style.backgroundColor = '#4CAF50'; // 绿色背景
                    searchButton.style.color = 'white'; // 白色文字
                    searchButton.style.border = 'none';
                    searchButton.style.borderRadius = '5px';
                    searchButton.style.cursor = 'pointer';

                    // 按钮点击事件
                    searchButton.addEventListener('click', () => {
                        window.open(`https://sukebei.nyaa.si/?f=0&c=0_0&q=${idNumber}`, '_blank');
                    });

                    // 将按钮添加到ID数字旁边
                    idSpan.parentNode.insertBefore(searchButton, idSpan.nextSibling);
                }
            }
        });
    }

    // Run the function after the DOM is fully loaded
    window.addEventListener('load', replaceClassAndAddButtons);
})();
