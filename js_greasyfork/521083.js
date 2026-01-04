// ==UserScript==
// @name         微波MOOC自动互评/自评
// @namespace    https://greasyfork.org/users/1226768-singledog957
// @version      0.2.3
// @description  自动完成中国大学MOOC课程的互评和自评操作，全部满分！
// @author       SingleDog
// @match        https://www.icourse163.org/learn/BUAA-1002534005?tid=1473108463*
// @icon         https://edu-image.nosdn.127.net/32a8dd2a-b9aa-4ec9-abd5-66cd8751befb.png?imageView&quality=100
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/521083-%E5%BE%AE%E6%B3%A2mooc%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84-%E8%87%AA%E8%AF%84
// @homepageURL  https://greasyfork.org/zh-CN/scripts/521083-%E5%BE%AE%E6%B3%A2mooc%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84-%E8%87%AA%E8%AF%84
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521083/%E5%BE%AE%E6%B3%A2MOOC%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%E8%87%AA%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/521083/%E5%BE%AE%E6%B3%A2MOOC%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%E8%87%AA%E8%AF%84.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const contentId = [
        1245523541, 1245522594, 1245527464, 1245524507, 1245527466, 1245526463,
        1245527467, 1245524508, 1245524509, 1245523546, 1245527469, 1245526465,
        1245525504, 1245524513, 1245523548, 1245523549, 1245525505, 1245527473,
        1245526468, 1245523554, 1245527475, 1245522603
    ];
    let userString = "好"; // 自定义评论内容
    const baseUrl = "https://www.icourse163.org/learn/BUAA-1002534005?tid=1473108463#/learn/hw?id=";
    const urlList = contentId.map(id => `${baseUrl}${id}`);
    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;

    // 从 localStorage 中获取 count，如果没有则要求用户输入
    let count = parseInt(localStorage.getItem('count'), 10);
    if (isNaN(count)) {
        // 如果 localStorage 没有 count 值，弹窗要求用户输入
        count = parseInt(prompt("x=0:每次作业只互评5份, \nx>0: 每次作业再多评x份", "0"), 10);
        if (isNaN(count) || count < 0) {
            alert("输入无效，使用默认值 0");
            count = 0;
        }
        // 将 count 存储到 localStorage
        localStorage.setItem('count', count);
    } else {
        console.log(`从 localStorage 获取到的 count 值为: ${count}`);
    }

    // 跳转到指定 URL
    function navigateToUrl(index) {
        if (index < urlList.length) {
            console.log(`即将跳转到 URL: ${urlList[index]}`);
            localStorage.setItem('currentIndex', index);
            window.location.href = urlList[index];
        } else {
            console.log("URL 列表已遍历完毕，脚本结束。");
            localStorage.removeItem('currentIndex');
            localStorage.removeItem('count'); // 清除 count 值
        }
    }

    // 主逻辑函数
    function main() {
        console.log("等待 5 秒后开始执行页面逻辑...");
        setTimeout(() => {
            let hasPerformedSelfEvaluation = false; // 每次进入新页面时重置为 false

            // 查找并匹配“点击自评”按钮
            let selfEvaluationBtn = Array.from(document.querySelectorAll('table.listtable tbody tr a.clickbtn.j-selfevabtn'))
                .find(btn => btn.textContent.trim() === "点击自评"); // 匹配按钮文本为“点击自评”

            if (selfEvaluationBtn && !hasPerformedSelfEvaluation) {
                console.log("找到‘点击自评’按钮，点击并执行自评逻辑...");
                selfEvaluationBtn.click(); // 点击自评按钮
                setTimeout(() => {
                    performEvaluation(true); // 执行评分逻辑（传递 isSelfEvaluation = true）
                    hasPerformedSelfEvaluation = true; // 标记自评已完成
                }, 2000); // 延迟 2 秒执行自评
                return; // 等待自评完成后刷新页面
            }

            // 如果没有找到“点击自评”按钮或已经执行过自评，继续检查后续逻辑
            checkForStudent6AndContinue();
        }, 2000); // 等待 5 秒后开始执行页面逻辑
    }

    // 检查是否存在 student6 并继续后续逻辑
    function checkForStudent6AndContinue() {
        if (count > 0) {
            console.log(`count 值为 ${count}，跳过 student6 检测，直接执行后续流程`);
            continueWorkflow();
            return; // 停止进一步逻辑
        }

        let allCells = document.querySelectorAll('td.l1'); // 查询所有 l1 类的单元格
        let student6Cell = Array.from(allCells).find(cell => cell.textContent.trim() === "student6");

        if (student6Cell) {
            console.log("检测到 student6，等待 5 秒后跳转到下一个 URL");
            currentIndex++; // 更新当前索引
            setTimeout(() => navigateToUrlAndExecuteMain(currentIndex), 2000); // 跳转并继续执行 main
            return; // 停止当前页面操作
        }

        let startEvaluationBtn = Array.from(document.querySelectorAll('a'))
            .find(btn => btn.textContent.trim() === "开始评分");

        if (startEvaluationBtn) {
            startEvaluationBtn.click();
            console.log("已找到并点击‘开始评分’按钮");
            continueWorkflow(); // 继续后续流程
        } else {
            console.log("未找到‘开始评分’按钮，直接尝试其他操作");
            continueWorkflow(); // 防止逻辑卡住
        }
    }

    // 后续流程
    function continueWorkflow() {
        setTimeout(() => {
            let pendingReviewBtn = document.querySelector('a[title="还未提交互评"]');
            if (pendingReviewBtn) {
                pendingReviewBtn.click();
                console.log("已点击‘还未提交互评’按钮");

                setTimeout(() => performEvaluation(false, count), 2000); // 执行非自评
            } else {
                console.log("未找到‘还未提交互评’按钮，直接执行评分操作");
                performEvaluation(false, count); // 执行非自评
            }
        }, 1000);
    }

    // 执行评分、输入文本并提交的逻辑
    function performEvaluation(isSelfEvaluation, remainingCount = 1) {
        let targetInput = document.querySelector('input[type="radio"][value="100"]');
        if (targetInput) {
            let targetLabel = targetInput.closest('label');
            if (targetLabel) {
                targetLabel.click();
                console.log("目标单选按钮已点击");
            } else {
                console.error("未找到与 input 关联的 label");
            }
        } else {
            console.error("未找到 value=100 的单选按钮");
        }

        let textarea = document.querySelector('textarea[name="inputtxt"]');
        if (textarea) {
            textarea.value = userString;
            textarea.dispatchEvent(new Event('input', { bubbles: true })); // 触发 input 事件
            console.log("文本已输入到 textarea");
        } else {
            console.error("未找到目标 textarea");
        }

        let submitButton = document.querySelector('a.u-btn.u-btn-default.j-submitbtn');
        if (submitButton) {
            submitButton.click();
            console.log("提交按钮已点击");

            setTimeout(() => {
                if (isSelfEvaluation) {
                    console.log("自评完成，刷新页面...");
                    location.reload(); // 刷新页面
                } else if (remainingCount > 1) {
                    // 如果还有剩余执行次数，点击“继续评估下一份作业”并递减计数
                    clickNextEvaluation(remainingCount - 1);
                } else {
                    console.log("评分执行次数达到要求,Jump");
                    currentIndex=currentIndex+1;
                    navigateToUrlAndExecuteMain(currentIndex);
                }
            }, 2000); // 延迟 2 秒后执行下一步逻辑
        } else {
            console.error("未找到提交按钮");
        }
    }

    // 跳转到指定 URL 并继续执行 main
    function navigateToUrlAndExecuteMain(index) {
        if (index < urlList.length) {
            console.log(`跳转到 URL: ${urlList[index]} 并继续执行 main`);
            localStorage.setItem('currentIndex', index);
            window.location.href = urlList[index];
            setTimeout(main, 1000); // 跳转后等待 1 秒再执行 main
        } else {
            console.log("URL 列表已遍历完毕，脚本结束。");
            localStorage.removeItem('currentIndex');
            localStorage.removeItem('count'); // 清除 count 值
        }
    }

    // 脚本启动：跳转到第一个 URL 并开始操作
    console.log("等待 1 秒后开始第一个跳转...");
    setTimeout(() => {
        navigateToUrlAndExecuteMain(currentIndex);
    }, 1000); // 初始延迟 1 秒
})();