// ==UserScript==
// @name         办公网相关
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  办公网相关PIF页面优化
// @author       WZW
// @match        https://my.awspaas.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475820/%E5%8A%9E%E5%85%AC%E7%BD%91%E7%9B%B8%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/475820/%E5%8A%9E%E5%85%AC%E7%BD%91%E7%9B%B8%E5%85%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.extendOpenNewPage = true;

    function getDates(n) {
        // 创建一个空数组 dates，用来存放日期字符串
        var dates = [];
        // 创建一个 Date 对象 today，表示今天的日期
        var today = new Date();
        // 使用一个 for 循环，从 0 到 n-1，遍历每一天
        for (var i = 0; i < n; i++) {
            const year = today.getFullYear(); // 获取年份
            const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，并转换为两位数的字符串
            const dayd = today.getDate().toString().padStart(2, '0'); // 获取日期，并转换为两位数的字符串
            const dateString = `${year}-${month}-${dayd}`; // 使用模板字符串拼接成所需的格式

            dates.push(dateString);
            // 使用 getDate() 方法获取 today 的日期，并加上 1，得到明天的日期
            var day = today.getDate() + 1;
            // 使用 setDate() 方法设置 today 的日期为 day，得到明天的日期对象
            // 这里不需要担心月份和年份的变化，因为 setDate() 方法会自动调整
            today.setDate(day);
        }
        // 返回 dates 数组
        return dates;
    }

    const setColorDate = () => {
        // 调用 getDates 函数，传入 5，表示要返回今天及后 4 天的日期字符串
        var result = getDates(5);
        const colors = ["#e57373", "#64b5f6", "#ffeb3b", "#ffa726", "#66bb6a"];

        const setDayColor = (dateDom) => {
            const dateStr = dateDom.innerText.trim();
            const minDate = result[0];
            const maxDate = result[result.length - 1];
            const index = result.findIndex(item => item == dateStr);
            if (index > -1) {
                dateDom.style.background = colors[index]
            } else if (dateStr <= minDate) {
                dateDom.style.background = colors[0]
            } else if (dateStr >= maxDate) {
                dateDom.style.background = colors[colors.length - 1]
            }

        }
        const trs = document.querySelectorAll(".vxe-body--row");
        if (trs && trs.length > 0) {

            for (const dom of document.querySelectorAll(".vxe-body--row")) {
                if (!dom.classList.contains("row-agent-class")) {
                    const dateDom = dom.querySelector(".cell-title-child-type-default");
                    if (dateDom) {
                        setDayColor(dateDom);
                    }
                }
            }
        }
    }

    setTimeout(setColorDate, 500);
    setInterval(setColorDate, 2000);



    function addSelectWithDates() {
        // 获取表单
        const form = document.querySelector('.el-form');

        // 创建 select 元素
        const select = document.createElement('select');
        select.id = 'dateSelect';
        select.className = 'el-select';

        // 获取当前日期
        const today = new Date();
        const todayValue = today.toISOString().slice(5, 10); // 获取 MM-DD 格式

        // 获取昨天的日期
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yesterdayValue = yesterday.toISOString().slice(5, 10); // 获取 MM-DD 格式

        // 生成前后两周的日期
        for (let i = -14; i <= 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const value = date.toISOString().slice(5, 10); // 获取 MM-DD 格式
            const day = date.toLocaleDateString('zh-CN', { weekday: 'short' }); // 获取星期
            const option = document.createElement('option');
            option.value = value;

            // 设置显示内容
            if (value === todayValue) {
                option.textContent = `${value}(${day})[今天]`;
            } else {
                option.textContent = `${value}(${day})`;
            }

            // 设置默认选中项为昨天
            if (value === yesterdayValue) {
                option.selected = true;
            }
            select.appendChild(option);
        }
        // 插入到表单中
        form.insertBefore(select, form.firstChild);

        // 绑定 change 事件，给 input 赋值并触发回车事件
        select.addEventListener('change', function() {
            const input = document.getElementById('searchTitle');
            // 给 input 赋值 select 的内容
            input.value = select.value;
            // 触发 input 的回车事件
            const event = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(event);

            // 触发第一个 i 标签的 click 事件
            const firstIcon = document.querySelector('.el-input__prefix-inner i');
            if (firstIcon) {
                firstIcon.click();
            }
        });
    }
    // 调用函数添加 select 元素
    setTimeout(addSelectWithDates, 500);

})();