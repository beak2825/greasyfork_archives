// ==UserScript==
// @name         评教自动回答
// @namespace    http://your.namespace.com
// @version      1.0
// @icon         https://img.phb123.com/uploads/allimg/220704/810-220F40923220-L.png
// @description  所有单选选择A.优，填空填写无
// @match        https://vpn.ldu.edu.cn/https/*/student/teachingEvaluation/newEvaluation/evaluation/*
// @match        https://xsjw.ldu.edu.cn/student/teachingEvaluation/newEvaluation/evaluation/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498071/%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/498071/%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 记录总睡眠时间的变量
    let totalSleepTime = 0;

    // 等待指定毫秒数的函数，同时更新总睡眠时间
    function sleep(ms) {
        totalSleepTime += ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 主函数，执行自动化操作
    async function main() {
        try {
            console.log('Starting automated evaluation submission...');

            // 填写单选题
            var radioButtons = document.querySelectorAll('.ace');
            var cnt = 0;
            for (const button of radioButtons) {
                if (button.value === 'A_优') {
                    button.checked = true;
                    cnt += 1;
                    console.log('Checked a radio button for "A_优"');
                    await sleep(500); // 每次填写选择题后等待0.5秒
                }
            }

            // 填写文本框
            var textarea = document.querySelector('textarea[name="F65E569B286B33FCE0534A82000AB5F5"]');
            textarea.value = "无";
            console.log('Filled the textarea.');

            // 最少等待11秒钟
            await sleep(5000); // 每次填写选择题后等待0.5秒

            // 提交评估
            var saveButton = document.getElementById('savebutton');
            saveButton.click();
            console.log('Clicked the save button for submission.');

            console.log('Automated submission completed.');
        } catch (error) {
            console.error('Error occurred during automated submission:', error);
        }
    }

    // 执行主函数
    main();

})();
