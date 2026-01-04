// ==UserScript==
// @name         二工大评教助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动评教脚本
// @author       徐文超20211110717 21 自动 c3
// @match        https://jx.sspu.edu.cn/eams/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498928/%E4%BA%8C%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498928/%E4%BA%8C%E5%B7%A5%E5%A4%A7%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to create the status panel
    function createStatusPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.bottom = '10px';
        panel.style.left = '10px';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid black';
        panel.style.padding = '10px';
        panel.style.zIndex = '1000';
        panel.id = 'evaluationStatusPanel';
        document.body.appendChild(panel);
    }

    // Helper function to update the status panel
    function updateStatusPanel(evaluatedCount, notEvaluatedCount, currentCourse, evaluationComplete) {
        const panel = document.getElementById('evaluationStatusPanel');
        panel.innerHTML = `
        <div>开发者：21 自动 c3 徐文超</div>
            <div>已评教: ${evaluatedCount} / 未评教: ${notEvaluatedCount}</div>
            <div>正在评教: ${currentCourse}</div>
            <div>评教完成: ${evaluationComplete ? '是' : '否'}</div>
        `;
    }

    // Function to handle evaluation on the evaluation page
    function evaluateCourse() {
        const radioGroups = document.querySelectorAll('td[name^="td"]');
        let selectedCount = 0;

        radioGroups.forEach(group => {
            const options = group.querySelectorAll('input[type="radio"]');
            if (selectedCount === 0 && Math.random() < 0.3) {
                // Randomly select "比较符合" for one of the groups
                options[1].checked = true;
                selectedCount++;
            } else {
                // Select "非常符合" for the rest
                options[0].checked = true;
            }
        });

        // Delay the save action by 1 second to ensure options are filled
        setTimeout(() => {
            // Override confirm function to automatically accept
            window.confirm = function() { return true; };
            document.getElementById('btnSave').click();
        }, 1000);
    }

    // Function to check and start evaluation process
    function checkAndEvaluate() {
        const rows = document.querySelectorAll('tr');
        let evaluatedCount = 0;
        let notEvaluatedCount = 0;
        let evaluationComplete = false;

        rows.forEach(row => {
            const statusCell = row.querySelector('td:nth-child(5)');
            const evaluateLink = row.querySelector('a[href^="javascript:doEvaluate"]');
            
            if (statusCell && statusCell.innerText.includes('未评教')) {
                notEvaluatedCount++;
                if (!evaluationComplete) {
                    evaluateLink.click();
                    evaluationComplete = true;
                }
            } else if (statusCell && statusCell.innerText.includes('已评教')) {
                evaluatedCount++;
            }
        });

        updateStatusPanel(evaluatedCount, notEvaluatedCount, evaluationComplete ? '正在评教' : '无', evaluationComplete);
    }

    // Initialization
    function initialize() {
        const path = window.location.pathname;

        if (path.includes('evaluateStd!search.action')) {
            createStatusPanel();
            setInterval(checkAndEvaluate, 2000);
        } else if (path.includes('evaluateStd!loadQuestionnaire.action')) {
            evaluateCourse();
        }
    }

    // Run the initialization function every second to handle page changes
    setInterval(initialize, 1000);
})();