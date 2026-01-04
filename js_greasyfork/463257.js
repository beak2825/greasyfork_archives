// ==UserScript==
// @name         PMP成绩获取器
// @namespace    http://event.chinapmp.cn
// @version      0.1
// @description  -- 略
// @author       tuite
// @match        http://event.chinapmp.cn/PMP/LEAP/pmp/html/personCenter.html#!myExamInfo
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/463257/PMP%E6%88%90%E7%BB%A9%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463257/PMP%E6%88%90%E7%BB%A9%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let getR = () => {
        document.querySelectorAll('.myexam-index table tr.examlist-color').forEach(t => {
            let innerText = t.childNodes[5].innerText;
            if (innerText !== '--') {
                fetch('http://127.0.0.1:8000/api/lzh?r=' + innerText)
                    .then(response => response.json())
                    .then(data => console.log(data));
            } else {
                setTimeout(() => location.reload(), parseInt(Math.random() * 100) * 1000)
                
            }
        })
    }

    setTimeout(getR, 5000)
})();
