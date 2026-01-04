// ==UserScript==
// @name         移除LeetCode-CN付费(plus专享)题目与书籍
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除LeetCode-CN付费题目 付费书籍
// @author       SmileYik
// @match        *://leetcode-cn.com/*
// @match        *://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode-cn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442792/%E7%A7%BB%E9%99%A4LeetCode-CN%E4%BB%98%E8%B4%B9%28plus%E4%B8%93%E4%BA%AB%29%E9%A2%98%E7%9B%AE%E4%B8%8E%E4%B9%A6%E7%B1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/442792/%E7%A7%BB%E9%99%A4LeetCode-CN%E4%BB%98%E8%B4%B9%28plus%E4%B8%93%E4%BA%AB%29%E9%A2%98%E7%9B%AE%E4%B8%8E%E4%B9%A6%E7%B1%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const PLUS_TAG_CLASS = "css-mn931f-PlusTag";
    const ANT_TABLE_ROW_CLASS = "ant-table-row";
    const ANT_TABLE_CONTENT = "ant-table-content";
    const PAID_ONLY_ICON_CLASS = "paid-only-icon__hiYO";
    const QUESTION_CLASS = "question__3lUu";
    const REMOVE_TOGETHER_CLASS_1_1 = "ml-2";
    const REMOVE_TOGETHER_CLASS_1_2 = "shrink-0";
    const REMOVE_TOGETHER_CLASS = "odd:bg-layer-1";
    const LEFT_PROBLEM_PANE = "question-picker-detail-menu__3NQq show__3hiR";

    const PRICE_CONTAINER_CLASS = "css-1b13e60-PriceContainer";
    const DISCOUNT_CONTAINER_CLASS = "css-2xg4ff-DiscountContainer";
    const BOOK_CONTAINER_CLASS = "css-1v2lce9-BookContainer";
    const TOP_LEFT_TAG_CLASS = "css-69f4mf-TopLeftTag";
    const KEYWORD_OF_TOP_LEFT_TAG_SRC = "premium-only";

    let removePlugProblemsTickId = 0;
    let removePlugProblemsTickTimes = 60;

    let removePriceBookTickId = 0;
    let removePriceBookTickTimes = 60;

    window.onload = function() {
        removePlugProblemsTickTimes = 60;
        removePlugProblemsTickId = setInterval(removePlugProblemsTick, 1000);

        removePriceBookTickTimes = 60;
        removePriceBookTickId = setInterval(removePriceBookTick, 1000);

        setInterval(function() {
            const element = document.getElementsByClassName(LEFT_PROBLEM_PANE);
            if (element.length > 0) {
                 removePlugProblemsEvent(getPlusProblems());
            }
        }, 1000);

        document.body.onmousewheel = function () {
            const elements = getAllBook();
            removePriceBookEvent(elements);
            removePlugProblemsEvent(getPlusProblems());
        }
    };

    function getPlusProblems() {
        const elements = [];
        let temp = document.getElementsByClassName(PLUS_TAG_CLASS);
        for (let i in temp) {
            elements.push(temp[i]);
        }

        temp = document.getElementsByClassName(PAID_ONLY_ICON_CLASS);
        for (let i in temp) {
            elements.push(temp[i]);
        }

        temp = document.getElementsByClassName(REMOVE_TOGETHER_CLASS_1_1);
        for (let i in temp) {
            if (containsClassName(temp[i], REMOVE_TOGETHER_CLASS_1_2)) {
                elements.push(temp[i]);
            }
        }
        return elements;
    }

    function removePlugProblemsTick() {
        removePlugProblemsTickTimes -= 1;
        const table = document.getElementsByClassName(ANT_TABLE_CONTENT);
        if (table.length <= 0) {
            if (removePlugProblemsTickTimes == 0) {
                clearInterval(removePlugProblemsTickId);
            }
            return;
        }

        const elements = getPlusProblems();
        if (elements.length <= 0) {
             if (removePlugProblemsTickTimes == 0) {
                clearInterval(removePlugProblemsTickId);
            }
            return;
        }
        removePlugProblemsEvent(elements);
        clearInterval(removePlugProblemsTickId);
    }

    function removePlugProblemsEvent(elements) {
        for (let index in elements) {
            let element = elements[index];
            while (element && element.tagName != "BODY") {
                if (element && (containsClassName(element, ANT_TABLE_ROW_CLASS) || containsClassName(element, REMOVE_TOGETHER_CLASS) || containsClassName(element, QUESTION_CLASS))) {
                    element.hidden = "hidden";
                    break;
                }
                element = element.parentElement;
            }
        }
    }

    function getAllBook() {
        const elements1 = document.getElementsByClassName(PRICE_CONTAINER_CLASS);
        const elements2 = document.getElementsByClassName(DISCOUNT_CONTAINER_CLASS);
        const elements3 = document.getElementsByClassName(TOP_LEFT_TAG_CLASS);
        let elements = [];
        for (let index in elements1) {
            elements.push(elements1[index]);
        }
        for (let index in elements2) {
            elements.push(elements2[index]);
        }
        for (let index in elements3) {
            const element = elements3[index];
            if (element && element.src && element.src.indexOf(KEYWORD_OF_TOP_LEFT_TAG_SRC) > 0) {
                elements.push(element);
            }
        }
        return elements;
    }

    function removePriceBookTick() {
        removePriceBookTickTimes -= 1;
        const elements = getAllBook();

        if (elements.length <= 0) {
            if (removePlugProblemsTickTimes == 0) {
                clearInterval(removePriceBookTickId);
                return;
            }
        }
        removePriceBookEvent(elements);
        clearInterval(removePriceBookTickId);
    }

    // give elements and to check which should be remove.
    function removePriceBookEvent(elements) {
        for (let index in elements) {
            let element = elements[index];
            if (element.tagName == "DIV" && element.childElementCount == 0) {
                continue;
            }
            while (element && element.tagName != "BODY") {
                let parent = element.parentElement;
                if (parent && containsClassName(parent, BOOK_CONTAINER_CLASS)) {
                    element.hidden = "hidden";
                    break;
                }
                element = parent;
            }
        }
    }

    // check the element contants aim class name or not.
    function containsClassName(element, className) {
        const list = element.classList;
        for (let index in list) {
            if (list[index] == className) {
                return true;
            }
        }
        return false;
    }

})();