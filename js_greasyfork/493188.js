// ==UserScript==
// @name         屏蔽 Steam 垃圾评测
// @namespace    https://store.steampowered.com/
// @version      2024-04-22
// @description  屏蔽 Steam 上的各种包含 ASCII 字符画的垃圾评测
// @author       Mirus
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493188/%E5%B1%8F%E8%94%BD%20Steam%20%E5%9E%83%E5%9C%BE%E8%AF%84%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493188/%E5%B1%8F%E8%94%BD%20Steam%20%E5%9E%83%E5%9C%BE%E8%AF%84%E6%B5%8B.meta.js
// ==/UserScript==

/**
 * @param {string} text
 * @param {string} char
 * @returns {number}
 */
function getCharCount(text, char) {
    let count = 0;
    for (let i = 0; i < text.length; i += 1) {
        if (text[i] === char) {
            count += 1;
        }
    }
    return count;
}

(function() {
    'use strict';
    const interval = setInterval(() => {
        const reviewBoxes = document.querySelectorAll(".review_box");
        if (reviewBoxes.length === 0) {
            return;
        } else if (reviewBoxes.length === 1) {
            const reviewBox = reviewBoxes[0];
            if (reviewBox.children[0].className === "noReviewsYetTitle") {
                return;
            } else {
                clearInterval(interval);
                console.log(`共 ${reviewBoxes.length} 条评测`);
            }
        } else {
            clearInterval(interval);
            console.log(`共 ${reviewBoxes.length} 条评测`);
        }
        let spamCount = 0;
        for (let i = 0; i < reviewBoxes.length; i++) {
            const contentElement = reviewBoxes[i].querySelector("div.content");
            const content = contentElement.innerText;
            if (
                getCharCount(content, '⣿') > 10 ||
                content.includes("喜欢黄油的可以看看我下面的强烈推荐O(∩_∩)O哈哈~")
            ) {
                reviewBoxes[i].remove();
                spamCount += 1;
            }
        }
        console.log(`已屏蔽掉 ${spamCount} 条垃圾评测`)
    }, 500)

    // Your code here...
})();