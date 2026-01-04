// ==UserScript==
// @name         考试宝试题导出
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.7
// @description  自动导出考试宝试题到文本文件
// @match        *://www.kaoshibao.com/online/?paperId=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/531204/%E8%80%83%E8%AF%95%E5%AE%9D%E8%AF%95%E9%A2%98%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531204/%E8%80%83%E8%AF%95%E5%AE%9D%E8%AF%95%E9%A2%98%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let questionCount = 0;
    let totalToExport = 0;
    let exportData = [];
    
    // 初始化设置
    function initSettings() {
        console.log('initSettings');
        // 自动开启背题模式
        const beitiSwitch = document.querySelector('.el-switch[aria-checked="false"]');
        if (beitiSwitch) {
            beitiSwitch.click();
            console.log('已开启背题模式');
        }
    }

    // 获取题目内容
    function getQuestionData() {
        console.log('getQuestionData');
        return {
            title: document.querySelector('.qusetion-box p')?.innerText.trim() || '',
            answer: document.querySelector('.right-ans span')?.innerText.trim() || '',
            analysis: document.querySelector('.answer-analysis p')?.innerText.trim() || '',
        };
    }

    // 保存数据
    function saveData(data) {
        console.log('saveData');
        exportData.push(`题目：${data.title}\n答案：${data.answer}\n解析：${data.analysis}\n\n`);
    }

    // 导出文件
    function exportToFile() {
        console.log('exportToFile');
        const blob = new Blob(exportData, {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const filename = `考试宝试题_${new Date().toLocaleString().replace(/[\/:]/g,'-')}.txt`;

        GM_download({
            url: url,
            name: filename,
            saveAs: true
        });
    }

    // 主流程控制
    async function startExport() {
        console.log('startExport');
        totalToExport = parseInt(prompt('请输入要导出的题目数量：', '10'));
        if (isNaN(totalToExport)) return;

        initSettings();

        const nextBtn = document.querySelector('button span:contains("下一题")').parentElement;
        
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                const data = getQuestionData();
                saveData(data);
                questionCount++;

                if (questionCount >= totalToExport) {
                    observer.disconnect();
                    exportToFile();
                    alert(`已成功导出${totalToExport}道题目！`);
                } else {
                    nextBtn.click();
                }
            }, 3000); // 3秒等待时间
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 触发第一次抓取
        const data = getQuestionData();
        saveData(data);
        questionCount++;
        nextBtn.click();
    }

    console.log('11111');
    // 添加启动按钮
    const btn = document.createElement('button');
    btn.style = 'position:fixed; top:100px; right:20px; z-index:9999; padding:10px;';
    btn.textContent = '开始导出';
    btn.onclick = startExport;
    document.body.appendChild(btn);
})();
