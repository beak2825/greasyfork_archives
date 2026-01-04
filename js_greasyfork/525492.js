// ==UserScript==
// @name         网页特定文本屏蔽器 
// @version      1.0.0
// @description  网页特定文本屏蔽器 ，被屏蔽的文本会被划上黑线
// @author       WildXBird
// @match        https://www.tampermonkey.net/scripts.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT 
// @match        *://*/*
// @namespace https://greasyfork.org/users/1066035
// @downloadURL https://update.greasyfork.org/scripts/525492/%E7%BD%91%E9%A1%B5%E7%89%B9%E5%AE%9A%E6%96%87%E6%9C%AC%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525492/%E7%BD%91%E9%A1%B5%E7%89%B9%E5%AE%9A%E6%96%87%E6%9C%AC%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockedList = new Set()
    const operation = () => {
        //修改这里为你要屏蔽的文本
        const blockTexts = ["deepseek"]

        let walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (blockedList.has(node)) {
                continue
            }

            const text = node.textContent.trim().toLowerCase();
            for (let target of blockTexts) {
                if (text.includes(target.toLowerCase())) {
                    blockedList.add(node)
                    console.log("blocked=>", node)
                    const element = node.parentElement
                    element.style.backgroundColor = "black"
                    element.style.color = "black"
                    element.style.pointerEvents = "none"
                    element.style.userSelect = "none"
                    element.style.filter = `brightness(0)`
                }
            }
        }
    }
    operation()
    setInterval(operation, 2500)
})();