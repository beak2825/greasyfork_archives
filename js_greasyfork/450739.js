/* jshint esversion: 6 */
// ==UserScript==
// @name         去他妈的知乎盲水印 | Fuck Zhihu Blind Watermark
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除知乎网页端的全屏盲水印
// @author       You
// @match        *://*.zhihu.com/
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450739/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%9B%B2%E6%B0%B4%E5%8D%B0%20%7C%20Fuck%20Zhihu%20Blind%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/450739/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%9B%B2%E6%B0%B4%E5%8D%B0%20%7C%20Fuck%20Zhihu%20Blind%20Watermark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    const WATERMARK_ELEMENT_SELECTOR = 'div[class^="css-"]'
    const WATERMARK_ELEMENT_RULES = [
        {
            type: "style",
            mode: "equal",
            attr: "pointerEvents",
            values: ["none"]
        },
        {
            type: "style",
            mode: "equal",
            attr: "position",
            values: ["fixed"]
        },
        {
            type: "style",
            mode: "startsWith",
            attr: "backgroundImage",
            values: ['url("data:image']
        },
    ]
    const WATERMARK_ELEMENT_AT_LEAST_RULE_COUNT = 3

    function log(message, ...data) {
        console.log(...[`[去他妈的知乎盲水印] ${message}`, ...data])
    }

    function checkIsWatermark(element) {
        let ruleCount = 0
        WATERMARK_ELEMENT_RULES.forEach(rule => {
            switch (rule.type) {
                case "style":
                    if (checkStyleRule(element, rule)) {
                        ruleCount++
                    }
                    break;
            }
        })
        return ruleCount >= WATERMARK_ELEMENT_AT_LEAST_RULE_COUNT
    }

    function checkStyleRule(element, rule) {
        let computedStyle = window.getComputedStyle(element)
        let attrVal = computedStyle[rule.attr]
        if (rule.mode == "equal" || rule.mode == "=") {
            return rule.values.includes(attrVal)
        }
        if (rule.mode == "startsWith" || rule.mode == "^=") {
            let result = false
            rule.values.forEach(value => {
                if (attrVal.startsWith(value)) {
                    result = true;
                }
            })
            return result
        }
    }

    function checkElementsAndRemove() {
        document.querySelectorAll(WATERMARK_ELEMENT_SELECTOR).forEach(ele => {
            checkElementAndRemove(ele)
        })
    }

    function checkElementAndRemove(element) {
        if (checkIsWatermark(element)) {
            element.remove()
            log("干掉了疑似水印元素", element)
        }
    }

    log("开始运行")

    checkElementsAndRemove()

    let config = {
        attributes: true,
        childList: true,
        characterData: false,
        subtree: true,
    }
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            checkElementAndRemove(mutation.target)
        })
    })
    observer.observe(document, config)
})();