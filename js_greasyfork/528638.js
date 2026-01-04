// ==UserScript==
// @name         复制元素 Selector
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  选择页面元素并复制其 CSS Selector，可切换模式，按钮可拖动
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528638/%E5%A4%8D%E5%88%B6%E5%85%83%E7%B4%A0%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/528638/%E5%A4%8D%E5%88%B6%E5%85%83%E7%B4%A0%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enableSelectorMode = false;
    let enableCopyMode = false;

    // 创建按钮容器
    let buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = '10000';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '5px';
    document.body.appendChild(buttonContainer);

    // 创建选择模式按钮
    let selectButton = document.createElement('button');
    selectButton.innerText = '开启选择模式';
    styleButton(selectButton);
    buttonContainer.appendChild(selectButton);

    // 创建复制模式按钮
    let copyButton = document.createElement('button');
    copyButton.innerText = '开启复制模式';
    styleButton(copyButton);
    buttonContainer.appendChild(copyButton);

    function styleButton(button) {
        button.style.padding = '8px 12px';
        button.style.background = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
    }

    selectButton.addEventListener('click', function() {
        enableSelectorMode = !enableSelectorMode;
        enableCopyMode = false;
        updateButtonStates();
    });

    copyButton.addEventListener('click', function() {
        enableCopyMode = !enableCopyMode;
        enableSelectorMode = false;
        updateButtonStates();
    });

    function updateButtonStates() {
        selectButton.innerText = enableSelectorMode ? '关闭选择模式' : '开启选择模式';
        selectButton.style.background = enableSelectorMode ? '#DC3545' : '#007BFF';

        copyButton.innerText = enableCopyMode ? '关闭复制模式' : '开启复制模式';
        copyButton.style.background = enableCopyMode ? '#DC3545' : '#007BFF';
    }

    document.addEventListener('mouseover', function(event) {
        if (enableSelectorMode || enableCopyMode) {
            event.target.style.outline = '2px solid red';
        }
    }, false);

    document.addEventListener('mouseout', function(event) {
        if (enableSelectorMode || enableCopyMode) {
            event.target.style.outline = '';
        }
    }, false);

    document.addEventListener('click', function(event) {
        if ((!enableSelectorMode && !enableCopyMode) || event.target.closest('div') === buttonContainer) return;

        event.preventDefault();
        event.stopPropagation();

        let selector = getUniqueSelector(event.target);
        if (enableSelectorMode) {
            let command = `ele = tab.ele('css=${selector}')\nele.click()`;
            GM_setClipboard(command);
        } else if (enableCopyMode) {
            GM_setClipboard(selector);
        }
    }, true);

    function getUniqueSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        let path = [];
        while (element.parentElement) {
            let tag = element.tagName.toLowerCase();
            let siblings = Array.from(element.parentElement.children).filter(el => el.tagName === element.tagName);
            let index = siblings.length > 1 ? `:nth-child(${siblings.indexOf(element) + 1})` : '';
            path.unshift(`${tag}${index}`);
            element = element.parentElement;
        }
        return path.join(' > ');
    }
})();
