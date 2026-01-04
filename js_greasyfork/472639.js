// ==UserScript==
// @name         dgut 勤工打卡计算器（有效工时）
// @version      1
// @description  自动计算勤工签到的有效总工时，去除因超时打卡需要老师确认的部分
// @author       剑轩
// @match        https://stu.dgut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dgut.edu.cn
// @grant        none
// @license       MIT
// @namespace https://greasyfork.org/users/1139522
// @downloadURL https://update.greasyfork.org/scripts/472639/dgut%20%E5%8B%A4%E5%B7%A5%E6%89%93%E5%8D%A1%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E6%9C%89%E6%95%88%E5%B7%A5%E6%97%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472639/dgut%20%E5%8B%A4%E5%B7%A5%E6%89%93%E5%8D%A1%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E6%9C%89%E6%95%88%E5%B7%A5%E6%97%B6%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取所有总计工时的单元格
    const totalHoursTds = document.querySelectorAll('td:nth-child(2)');

    // 存储总工时
    let totalHours = 0;

    // 遍历单元格,提取并相加小时数
    totalHoursTds.forEach(td => {
        //console.log("开始打印")
        const hours = (td.textContent.match(/\d+\.\d+/) || [0])[0]; // 如果正则匹配为空，则表示是未确认的考勤时间，加上了默认值0
        console.log("时间是"+hours)
        totalHours += parseFloat(hours);
    });

    // 创建显示总工时的 DOM 元素
    const totalSpan = document.createElement('span');
    totalSpan.innerText = `总计工时:${totalHours}小时`;
    //console.log("总计工时:${totalHours}小时")

    // 插入这个元素到表格之后
    const table = document.querySelector('table');
    table.after(totalSpan);

    // Your code here...
})();
