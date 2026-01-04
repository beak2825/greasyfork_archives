// ==UserScript==
// @name         鲁东大学学生教务信息网自动评教
// @version      1.14
// @description  鲁东大学自动评教脚本
// @author       Panjy
// @icon         https://img.phb123.com/uploads/allimg/220704/810-220F40923220-L.png
// @match        https://xsjw.ldu.edu.cn/student/teachingEvaluation/newEvaluation/index
// @match        https://vpn.ldu.edu.cn/https/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1318564
// @downloadURL https://update.greasyfork.org/scripts/498069/%E9%B2%81%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E6%95%99%E5%8A%A1%E4%BF%A1%E6%81%AF%E7%BD%91%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/498069/%E9%B2%81%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E6%95%99%E5%8A%A1%E4%BF%A1%E6%81%AF%E7%BD%91%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

// 点击评估按钮的轮询函数（每2秒尝试一次，直到成功）
function clickAssessmentButton() {
    const interval = setInterval(() => {
        const buttons = document.getElementsByTagName('button');
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if (button.textContent.trim() === '评估') {
                button.click();
                console.log('Clicked the "评估" button.');
                clearInterval(interval); // 停止轮询
                return;
            }
        }
        console.log('未找到“评估”按钮，2秒后重试...');
    }, 2000); // 每2000毫秒（2秒）检查一次
}

// 页面加载完成后执行主逻辑
window.addEventListener('load', function () {
    clickTab('ktjs');
    console.log("开始休眠");

    setTimeout(function () {
        console.log("休眠结束");
        var selectElement = document.getElementById("pagination_pageSize_urppagebar");

        if (!selectElement) {
            console.warn("未找到分页下拉框，跳过设置“全部”选项");
            clickAssessmentButton(); // 直接开始轮询按钮
            return;
        }

        // 遍历所有选项，找到值为"100000000_sl"的选项（代表“全部”）
        for (var i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === "100000000_sl") {
                selectElement.selectedIndex = i;
                var event = new Event('change');
                selectElement.dispatchEvent(event);
                console.log("已选择“全部”选项");
                break;
            }
        }

        // 无论是否成功设置“全部”，都开始轮询点击“评估”
        setTimeout(clickAssessmentButton, 1000); // 稍等1秒让页面响应 change 事件

    }, 1000);
});

// （可选）DOMContentLoaded 中也可以启动轮询，作为兜底
window.addEventListener('DOMContentLoaded', function () {
    // 不再立即点击，而是交给轮询机制处理，避免重复点击
    // 所以这里可以留空，或也调用 clickAssessmentButton()
    // 但为了避免冲突，我们只在 load 后处理
});