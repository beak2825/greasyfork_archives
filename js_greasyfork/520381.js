// ==UserScript==
// @name         干部多开
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  多开窗口,提升学习效率
// @author       You
// @match        http://www.hbgbzx.gov.cn/student/course!list.action*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hbgbzx.gov.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520381/%E5%B9%B2%E9%83%A8%E5%A4%9A%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/520381/%E5%B9%B2%E9%83%A8%E5%A4%9A%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找指定的table元素
    const targetTable = document.querySelector('table.dataTable');
    if (!targetTable) {
        console.log("未找到指定的课程信息表格");
        return;
    }

    // 创建一个按钮元素
    const batchOpenButton = document.createElement('button');
    batchOpenButton.textContent = '批量打开';
    // 设置按钮为相对定位，使其相对于table元素来定位位置（在table内部定位）
    batchOpenButton.style.position = 'relative';
    // 使用float属性让按钮靠右浮动，实现右上角的布局效果
    batchOpenButton.style.float = 'right';
    batchOpenButton.style.marginTop = '5px'; // 可以根据实际情况调整上边距，让按钮位置更合适
    batchOpenButton.style.marginRight = '5px'; // 可以根据实际情况调整右边距，让按钮位置更合适
    // 将按钮添加到表格的表头单元格（caption）内，这样按钮就在table内部了，也可根据实际选择tbody等其他合适位置添加
    const caption = targetTable.querySelector('caption');
    if (caption) {
        caption.appendChild(batchOpenButton);
    } else {
        console.log("表格中未找到caption元素，无法准确放置按钮");
        return;
    }

    // 按钮点击事件处理函数，执行原脚本的主要逻辑
    batchOpenButton.onclick = function() {
        const learnButtons = document.querySelectorAll('a[onclick^="videoList("]');
        const courseIds = [];

        // 遍历每个找到的按钮
        learnButtons.forEach((button) => {
            // 将button.onclick的值先转换为字符串，再使用正则表达式提取课程id
            const onclickStr = button.onclick.toString();
            const courseIdMatch = onclickStr.match(/videoList\((\d+)\)/);
            if (courseIdMatch) {
                const courseId = courseIdMatch[1];
                courseIds.push(courseId);
            }
        });

        // 针对每个课程id，打开对应的学习页面到新tab页
        courseIds.forEach((id) => {
            const url = `http://www.hbgbzx.gov.cn/portal/study!play.action?id=${id}`;
            window.open(url, '_blank');
        });
    };
})();