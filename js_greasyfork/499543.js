// ==UserScript==
// @name         editor html
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Enoch
// @match        https://www.oppo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhinan.tech
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499543/editor%20html.user.js
// @updateURL https://update.greasyfork.org/scripts/499543/editor%20html.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const textNodes = [];
    // 遍历 DOM 树，寻找只包含文本的节点
    function findTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            textNodes.push(node);
        } else {
            for (const childNode of node.childNodes) {
                findTextNodes(childNode);
            }
        }
    }
    // 查找只包含文本的节点
    findTextNodes(document.body);
    // 给满足条件的文本节点的父级元素添加背景颜色
    for (const textNode of textNodes) {
        const parentElement = textNode.parentElement;
        const {width,height} = parentElement.getBoundingClientRect();
        parentElement.style.backgroundColor = '#7ea864';
        parentElement.style.width = `${width}px`;
        parentElement.style.height = `${height}px`;

    }

    // 创建一个开关元素
    const switchElement = document.createElement('input');
    switchElement.type = 'checkbox';
    Object.assign(switchElement.style, {
        marginRight: '5px'
    });

    const labelElement = document.createElement('label');
    labelElement.textContent = '开启编辑模式';
    Object.assign(labelElement.style, {
        cursor: 'pointer',
        contentEditable: 'false'
    });

    const topBar = document.createElement('div');
    Object.assign(topBar.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        backgroundColor: '#f7f7f7',
        padding: '10px',
        zIndex: '100'
    });
    labelElement.appendChild(switchElement);
    topBar.appendChild(labelElement);
    document.body.appendChild(topBar);

    // 处理开关按钮的点击事件
    switchElement.addEventListener('change', function() {
        const bodyEditable = switchElement.checked;
        if(bodyEditable){
          labelElement.textContent='关闭编辑模式';
        }else{
          labelElement.textContent='开启编辑模式';
        }
        document.body.contentEditable = bodyEditable;
    });
})();