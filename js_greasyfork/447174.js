// ==UserScript==
// @name         HIT jwts 表格只保留考试课
// @namespace    http://gnaq.cat/
// @version      0.1
// @description  表格中只保留考试课的学分绩（没有测试多页的情况）
// @author       GNAQ
// @match        http://jwts.hit.edu.cn/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447174/HIT%20jwts%20%E8%A1%A8%E6%A0%BC%E5%8F%AA%E4%BF%9D%E7%95%99%E8%80%83%E8%AF%95%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447174/HIT%20jwts%20%E8%A1%A8%E6%A0%BC%E5%8F%AA%E4%BF%9D%E7%95%99%E8%80%83%E8%AF%95%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var button = document.createElement("input");
    button.type = "button";
    button.value = "学分绩表格过滤考试课";
    button.onclick = function() {
        let inner_iframe = document.getElementById('iframename')
        let docif = inner_iframe.contentWindow.document
        let header = docif.getElementsByClassName('address')[0]

        if (header.childNodes[1].textContent == '学分绩查询') {

            let table1 = docif.getElementsByClassName('bot_line')[0]

            let delarr = new Array()

            for (let row of table1.rows) {
                if (row.cells[6].textContent == '') {
                    delarr.push(row)
                }
            }

            for (let x of delarr) {
                x.remove()
            }
        }
    };

    var topBar = document.getElementsByClassName('top')[0];
    topBar.appendChild(button);

})();