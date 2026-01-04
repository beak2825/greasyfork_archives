// ==UserScript==
// @name         人大自动教评（含终止功能）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动教评所有“未评教”课程，评分+提交+确认，总分100后确认提交。支持一键开始，中途终止。修复评教后流程中断问题。
// @author       you
// @match        *://yjs2.ruc.edu.cn/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539853/%E4%BA%BA%E5%A4%A7%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%EF%BC%88%E5%90%AB%E7%BB%88%E6%AD%A2%E5%8A%9F%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539853/%E4%BA%BA%E5%A4%A7%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84%EF%BC%88%E5%90%AB%E7%BB%88%E6%AD%A2%E5%8A%9F%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let stopFlag = false;

    function waitForIframeAndInject() {
        const iframe = document.querySelector('#iframeContent_wspjappwspj');
        if (iframe && iframe.contentDocument?.readyState === 'complete') {
            injectButtons(iframe);
        } else {
            setTimeout(waitForIframeAndInject, 500);
        }
    }

    function injectButtons(iframe) {
        const doc = iframe.contentDocument;
        if (doc.getElementById('auto-eval-btn')) return;

        const startBtn = doc.createElement('button');
        startBtn.id = 'auto-eval-btn';
        startBtn.textContent = '一键教评';
        Object.assign(startBtn.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        });
        startBtn.addEventListener('click', () => {
            stopFlag = false;
            startAutoEval(iframe);
        });

        const stopBtn = doc.createElement('button');
        stopBtn.textContent = '停止教评';
        Object.assign(stopBtn.style, {
            position: 'fixed',
            top: '60px',
            right: '20px',
            zIndex: 9999,
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        });
        stopBtn.addEventListener('click', () => {
            stopFlag = true;
            alert('❌ 教评已中止');
        });

        doc.body.appendChild(startBtn);
        doc.body.appendChild(stopBtn);
    }

    async function startAutoEval(iframe) {
        const doc = iframe.contentDocument;

        while (!stopFlag) {
            // 获取“未评教”课程卡片
            const cards = Array.from(doc.querySelectorAll('.bh-card[data-action="评教"]')).filter(card =>
                card.textContent.includes('未评教')
            );

            if (cards.length === 0) {
                alert('✅ 所有课程教评已完成');
                break;
            }

            // 点击第一门未评课程
            cards[0].click();

            await waitForEvalPage(iframe);
            await doEvaluation(iframe);
            await waitForReturnToList(iframe); // 关键修复：等待课程列表页面加载完成
        }
    }

    function waitForEvalPage(iframe) {
        return new Promise(resolve => {
            const check = () => {
                const doc = iframe.contentDocument;
                if (doc.querySelectorAll('input[type="radio"]').length > 0) resolve();
                else setTimeout(check, 500);
            };
            check();
        });
    }

    function waitForReturnToList(iframe) {
        return new Promise(resolve => {
            const check = () => {
                const doc = iframe.contentDocument;
                const cards = doc.querySelectorAll('.bh-card[data-action="评教"]');
                const foundUnrated = Array.from(cards).some(card => card.textContent.includes('未评教'));
                if (foundUnrated) resolve();
                else setTimeout(check, 500);
            };
            check();
        });
    }

    function doEvaluation(iframe) {
        return new Promise(resolve => {
            const doc = iframe.contentDocument;
            const groups = {};

            doc.querySelectorAll('input[type="radio"]').forEach(input => {
                const name = input.name;
                if (!groups[name]) groups[name] = [];
                groups[name].push(input);
            });

            Object.values(groups).forEach(group => {
                let selected = false;
                for (let input of group) {
                    const label = input.closest('label');
                    const text = label?.querySelector('.paper_dxnr')?.textContent.trim();
                    if (input.value === '5' || text === '5分') {
                        input.checked = true;
                        selected = true;
                        break;
                    }
                }
                if (!selected) {
                    for (let input of group) {
                        const label = input.closest('label');
                        const text = label?.querySelector('.paper_dxnr')?.textContent.trim();
                        if (input.value === '10' || text === '10分') {
                            input.checked = true;
                            break;
                        }
                    }
                }
            });

            const submitBtn = doc.querySelector('[data-action="提交"]');
            if (submitBtn) {
                submitBtn.click();
                setTimeout(() => {
                    const score = doc.querySelector('b.bh-color-info')?.textContent.trim();
                    if (score === '100') {
                        const confirmBtn = doc.querySelector('.bh-dialog-btn.bh-bg-primary');
                        confirmBtn?.click();
                    }
                    setTimeout(resolve, 1500); // 等待跳转完成
                }, 1000);
            } else {
                setTimeout(resolve, 1000);
            }
        });
    }

    waitForIframeAndInject();
})();
