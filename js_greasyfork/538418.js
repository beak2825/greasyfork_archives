// ==UserScript==
// @name         TJCU 教学评估自动填写
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动完成天津商业大学教学评估问卷，区分普通与学生满意度问卷，倒计时后自动提交并点击“是”，直至全部完成。
// @author       zmq
// @match        http://stu.j.tjcu.edu.cn/student/teachingEvaluation/*
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/538418/TJCU%20%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/538418/TJCU%20%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[评估助手]', ...args);
    let doneShown = false;

    function isSatisfactionSurvey() {
        return document.body.innerText.includes('学生学习满意度调查') || document.body.innerText.includes('学习满意度问卷');
    }

    function fillSatisfactionSurvey() {
        log('🟨 学生满意度问卷，选择“非常满意”/“优秀”...');
        document.querySelectorAll('input[type=radio]').forEach(r => {
            const label = r.nextElementSibling?.nextElementSibling?.innerText?.trim();
            if (label && (label.includes('非常满意') || label.includes('优秀'))) {
                r.checked = true;
                r.click();
            }
        });
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.value = '学校学习氛围良好，老师教学认真，整体体验满意。';
    }

    function fillNormalSurvey() {
        log('🟩 普通课程问卷，选择“10分”...');
        document.querySelectorAll('input[type=radio]').forEach(r => {
            if (r.value?.trim() === '10_1') {
                r.checked = true;
                r.click();
            }
        });
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.value = '课程内容丰富，讲解清晰，收获颇丰。';
    }

    function waitAndSubmit() {
        log('⏳ 等待倒计时结束...');
        let submitted = false;

        const interval = setInterval(() => {
            const min = parseInt(document.getElementById('RemainM')?.innerText || '1');
            const sec = parseInt(document.getElementById('RemainS')?.innerText || '1');

            if (min === 0 && sec === 0 && !submitted) {
                const submitBtn = document.getElementById('buttonSubmit');
                if (submitBtn && !submitBtn.disabled) {
                    log('✅ 倒计时结束，点击提交');
                    submitBtn.click();
                    submitted = true;

                    const confirmCheck = setInterval(() => {
                        const confirmBtn = document.querySelector('.layui-layer-btn0');
                        if (confirmBtn) {
                            log('✅ 点击弹窗“是”');
                            confirmBtn.click();
                            clearInterval(confirmCheck);
                        }
                    }, 300);
                }
            } else {
                log(`⌛ 剩余 ${min}分 ${sec}秒`);
            }
        }, 500);
    }

    function handleEvaluationPage() {
        setTimeout(() => {
            isSatisfactionSurvey() ? fillSatisfactionSurvey() : fillNormalSurvey();
            waitAndSubmit();
        }, 800);
    }

    function handleEvaluationList(retries = 0) {
        if (location.href.includes('evaluationPage')) return;

        const buttons = [...document.querySelectorAll('button')].filter(b => b.innerText.includes('评估'));
        const nextBtn = buttons.find(b => !b.innerText.includes('查看'));

        if (!nextBtn && retries < 3) {
            log(`🔁 页面加载中，重试(${retries + 1}/3)...`);
            setTimeout(() => handleEvaluationList(retries + 1), 1500);
            return;
        }

        if (nextBtn) {
            log('➡️ 点击下一个“评估”按钮');
            nextBtn.click();
        } else if (!doneShown) {
            doneShown = true;
            log('🎉 所有评估已完成');
            alert('🎉 所有课程评估已完成');
        }
    }

    function init() {
        if (location.href.includes('evaluationPage')) {
            handleEvaluationPage();
        } else if (location.href.includes('evaluation/index')) {
            handleEvaluationList();
        }
    }

    new MutationObserver(() => init()).observe(document.body, {
        childList: true,
        subtree: true
    });

    init();
})();
