// ==UserScript==
// @name         南宁师范大学评教自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @license Common
// @description  自动填写选项并提交
// @author       木木
// @match        *://*./jsxsd/*
// @match        http://jw-nnnu-edu-cn.atrust.nnnu.edu.cn/jsxsd/xspj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nnnu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456400/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/456400/%E5%8D%97%E5%AE%81%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const originalAlert = window.alert;

    //去除弹窗，但貌似不起作用
    window.alert = function (message) {
        console.log(`Alert called with message: "${message}"`); // 可选：记录调用信息
    };

    //表面上没有刷新页面，但实际上嵌入了一个新的页面，通过新页面网址判断当前处于什么页面
    let now_url = document.location.href;
    // 填写评分界面
    if (now_url.indexOf("edit.do") !== -1) {
        fillAll();
        const originalConfirm = window.confirm;
        //去除是否提交，写在这里是因为，只需要修改当前嵌入的iframe，不改变其他页面的弹出
        window.confirm = function (message) {
            console.log(`Confirm called with message: "${message}"`);
            return true;
        };
        const tj_button = document.querySelector('#tj');
        if (tj_button) {
            tj_button.click();
        }

    }

    // 评教列表界面
    if (now_url.indexOf("list.do") !== -1) {
        //找出所有的评价链接
        const a_link_list = document.querySelectorAll('a');
        let do_not_need_pj = true; // 不需要评价
        for (let a_link of a_link_list) {
            if (a_link.textContent.trim() === '评价') {
                //点击第一个需要评价/提交链接
                a_link.click();
                do_not_need_pj = false;
                break;
            }
        }
        if (do_not_need_pj) {
            originalAlert("没有需要评价的课程");
        }
    }


    // 填写当前评教界面所有分数和建议
    function fillAll() {
        // 获取所有 tr 元素
        const allRows = document.querySelectorAll('tr');
        // 遍历所有 tr 元素
        allRows.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length !== 4) return; // 如果不是4个td，判断应该不是需要填分数的列，则跳过当前tr行
            // 获取第二个 td，即满评分数值
            const secondTd = tds[1];
            if (!secondTd) return; // 如果没有第二个 td，则跳过当前tr行
            const value = secondTd.innerText.trim(); // 获取第二个 td 的文本内容并去除空格
            const floatValue = parseFloat(value); // 尝试解析为浮点数
            if (isNaN(floatValue)) return; // 如果无法解析为浮点数，则跳过
            const input = tds[3].querySelector('input'); // 查找最后一个 td 中的 input
            if (input) {
                input.value = (Math.floor(floatValue * 10) / 10).toString(); // 舍弃小数点后一位（教务系统逆天bug，提交时只能保留一位小数，但分配的最高分数可能有两位小数，如8.05，但只能填8.0，要不然交不了）
            }
        });
        document.querySelector('textarea[name="jynr"]').value = '无'; // 填写建议
    }
})();
