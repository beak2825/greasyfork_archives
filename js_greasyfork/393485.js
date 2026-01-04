// ==UserScript==
// @name         chaturbate自动选择最高清
// @namespace    http://tampermonkey.net/
// @description  自动选择最高清
// @version      0.1
// @author       You
// @homeurl     https://greasyfork.org/zh-CN/scripts/393485
// @match        https://zh.chaturbate.com/*
// @match        https://www.privatecams.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393485/chaturbate%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/393485/chaturbate%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractNumber (str) {
        let reg = /\d+/;
        let match = reg.exec(str)
        return match ? parseInt(match[0]) : null;
    }

    let maxNode = null
    let maxNumber = 0
    setInterval(function () {
        let vjsMenuNodes = document.getElementsByClassName('vjs-menu-content');
        if (vjsMenuNodes) {
            let vjsMenuNode = vjsMenuNodes[vjsMenuNodes.length - 1];
            let vjsMenus = vjsMenuNode.querySelectorAll('.vjs-menu-item');
            if (vjsMenus) {
                vjsMenus.forEach((node) => {
                    if (node) {
                        const number = extractNumber(node.textContent)
                        if (number > maxNumber) {
                            maxNumber = number
                            maxNode = node
                        }
                    }
                })
            }
            let selected = vjsMenuNode.querySelector('.vjs-menu-item.vjs-selected');
            if (selected) {
                if (maxNode) {
                    if (maxNode.textContent !== selected.textContent) {
                        console.log("当前最高清的是", maxNode.textContent)
                        console.log("当前选中的是", selected.textContent)
                        maxNode.click()
                        console.log("自动选择到", maxNode.textContent)
                    }
                }
            }
        }
    }, 1000)
})();
