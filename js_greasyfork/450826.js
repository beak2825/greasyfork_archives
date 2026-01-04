// ==UserScript==
// @name         自动提交
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  123
// @author       YJP
// @match        https://www.wenjuan.com/s/UZBZJvMMIM2/*
// @match        https://m.cat-happy.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wenjuan.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450826/%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/450826/%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    let gui = {
        '1': [1, 3, 5, 3, 2, [1, 2], 4, 1, [2, 3, 4], 3, 1, 2, 2, 3, 4, 3],
        '2': [2, 3, 5, 3, 2, [1, 2, 3], 4, 2, 2, 2, 1, 2, 3, 3, 1, 3],
    }
    let timer = setInterval(function () {
        if (isLife('.question') && !getE('#continue-anwser-bg')) {
            let questions = document.querySelectorAll(".question");
            let k = Math.floor(Math.random() * Object.keys(gui).length + 1);
            gui[k].forEach((s, i) => {
                if (typeof s === 'object') {
                    questions.forEach((q, index) => {
                        if (i === index) {
                            s.forEach(j => {
                                q.children[2].children[1].children[0].children[j - 1].children[0].children[0].checked = true
                            })
                            return
                        }
                    })
                } else {
                    questions.forEach((q, index) => {
                        if (i === index) {
                            q.children[2].children[1].children[0].children[gui[k][index] - 1].children[0].children[0].checked = true
                            return
                        }
                    })
                }
            })
            getE('.wj_color').click()
        } else {
            if (isLife('.dc-luck-img')) {
                getE('.dc-luck-img').click()
            }
            if (window.location.href.includes('https://m.cat-happy.cn/')) {
                window.history.back()
            }
            if (isLife('.restart-survey')) {
                getE('.restart-survey').click()
            }
            if (isLife('.reset-answer')) {
                getE('.reset-answer').click()
            }
        }
    }, 1500)
    function isLife(element) {
        return getE(element) && getComputedStyle(getE(element)).getPropertyValue('display') !== 'none'
    }
    function getE(element) {
        return document.querySelector(element);
    }
})();