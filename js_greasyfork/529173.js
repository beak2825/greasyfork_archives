// ==UserScript==
// @name         四六级成绩修改器
// @name:zh-CN   四六级成绩修改器
// @name:en      CET Score Modifier
// @namespace    https://greasyfork.org/users/1443463
// @version      1.0.1
// @description  四六级成绩查询网站成绩显示修改工具，支持CET4/CET6成绩修改
// @description:zh-CN  用于修改四六级成绩显示的油猴脚本，支持听力、阅读、写作分数修改，适用于全国大学英语四、六级考试成绩查询系统
// @description:en     A userscript to modify CET (College English Test) score display on NEEA website
// @author       昔日初一
// @match        *://cjcx.neea.edu.cn/*
// @match        *://*.neea.edu.cn/cet/*
// @match        *://*.neea.cn/cet/*
// @grant        none
// @license      MIT
// @icon         https://www.neea.edu.cn/favicon.ico
// @keywords     四六级,CET4,CET6,成绩查询,成绩修改,四级,六级,英语考试,四六级成绩修改器,全国大学英语四六级
// @supportURL   https://github.com/xirichuyi/change_the_score_script/issues
// @homepageURL  https://github.com/xirichuyi/change_the_score_script
// @downloadURL https://update.greasyfork.org/scripts/529173/%E5%9B%9B%E5%85%AD%E7%BA%A7%E6%88%90%E7%BB%A9%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529173/%E5%9B%9B%E5%85%AD%E7%BA%A7%E6%88%90%E7%BB%A9%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('readystatechange', function () {
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                onPageLoad();
            }
        });
    } else {
        onPageLoad();
    }

    function onPageLoad() {
        const savedScores = localStorage.getItem('savedScores');

        if (savedScores) {
            const scores = JSON.parse(savedScores);
            updateScoresDisplay(scores.listening, scores.reading, scores.writing);

            setInterval(function () {
                updateScoresDisplay(scores.listening, scores.reading, scores.writing);
            }, 10);

            document.addEventListener('visibilitychange', function () {
                if (!document.hidden) {
                    updateScoresDisplay(scores.listening, scores.reading, scores.writing);
                }
            });

            window.addEventListener('focus', function () {
                updateScoresDisplay(scores.listening, scores.reading, scores.writing);
            });
        } else {
            createInputInterface();
        }
    }

    function updateScoresDisplay(listening, reading, writing) {
        const total_score = document.getElementById('SCORE');
        const total_score_1 = document.getElementById('SCO_LC');
        const total_score_2 = document.getElementById('SCO_RD');
        const total_score_3 = document.getElementById('SCO_WT');
        const out_page_score = document.getElementById('achievement-tbody');

        // 更新表格中的总分
        if (out_page_score) {
            const firstRow = out_page_score.querySelector('tr:first-child');
            if (firstRow) {
                const thirdCell = firstRow.querySelector('td:nth-child(3)');
                if (thirdCell) {
                    thirdCell.innerHTML = String(Number(listening) + Number(reading) + Number(writing));
                }
            }
        }

        if (total_score && total_score_1 && total_score_2 && total_score_3) {
            total_score_1.innerHTML = listening;
            total_score_2.innerHTML = reading;
            total_score_3.innerHTML = writing;
            total_score.innerHTML = String(Number(listening) + Number(reading) + Number(writing));
        }
    }

    function createInputInterface() {
        const inputDiv = document.createElement('div');
        inputDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        `;

        const html = `
            <div style="margin-bottom: 15px; font-weight: bold;">作者微信:zhou01ma</div>
            <div style="margin-bottom: 10px;">
                <label>校验码：</label>
                <input type="text" id="auth_code" style="width: 120px; padding: 5px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>听力成绩：</label>
                <input type="number" id="listening_score" min="0" max="249" style="width: 80px; padding: 5px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>阅读成绩：</label>
                <input type="number" id="reading_score" min="0" max="249" style="width: 80px; padding: 5px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>写作成绩：</label>
                <input type="number" id="writing_score" min="0" max="249" style="width: 80px; padding: 5px;">
            </div>
            <button id="update_score" style="
                margin-top: 10px;
                padding: 8px 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">保存成绩</button>
        `;
        inputDiv.innerHTML = html;
        document.body.appendChild(inputDiv);

        // 验证校验码的函数
        async function validateAuthCode(code) {
            const currentTime = Math.floor(Date.now() / 1000 / 3600);
            const salt = "zhou01ma_toefl_auth";

            // 检查最近36小时内的所有可能的校验码
            for (let i = 0; i < 36; i++) {
                const timeBlock = (currentTime - i) % 36;
                const data = `${timeBlock}${salt}`;
                const hashResult = await sha256(data);
                const shortHash = hashResult.substring(0, 8);
                console.log('Comparing:', shortHash, 'with:', code.toLowerCase());
                if (shortHash === code.toLowerCase()) {
                    return true;
                }
            }
            return false;
        }

        // SHA256哈希函数
        async function sha256(message) {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        document.getElementById('update_score').addEventListener('click', async function () {
            try {
                const authCode = document.getElementById('auth_code').value;
                const isValid = await validateAuthCode(authCode);

                if (!isValid) {
                    alert('校验码无效或已过期！');
                    return;
                }

                const listening = document.getElementById('listening_score').value || "0";
                const reading = document.getElementById('reading_score').value || "0";
                const writing = document.getElementById('writing_score').value || "0";

                const scores = { listening, reading, writing };
                localStorage.setItem('savedScores', JSON.stringify(scores));

                updateScoresDisplay(listening, reading, writing);
                inputDiv.remove();
            } catch (error) {
                console.error('验证过程出错:', error);
                alert('验证过程出错，请重试');
            }
        });
    }
})(); 