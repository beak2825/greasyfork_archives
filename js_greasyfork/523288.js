// ==UserScript==
// @name         显示或隐藏学习通作业答案
// @version      1.0
// @namespace    https://www.zhengru.top/
// @description  按 `~` 键显示或隐藏学习通作业答案
// @author       dongzhengru
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/view*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523288/%E6%98%BE%E7%A4%BA%E6%88%96%E9%9A%90%E8%97%8F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523288/%E6%98%BE%E7%A4%BA%E6%88%96%E9%9A%90%E8%97%8F%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%BD%9C%E4%B8%9A%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener('keydown', function (event) {
        if (event.key === '`') {
            let answers = document.querySelectorAll('.mark_answer');
            answers.forEach(answer => {
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                } else {
                    answer.style.display = 'none';
                }
            });
        }
    });
})();