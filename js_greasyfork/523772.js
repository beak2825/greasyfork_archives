// ==UserScript==
// @name         影刀自动刷课增强版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  影刀自动刷课增强版 - 支持自动做选择题、操作题，自动考试，全流程刷课
// @author       Claude
// @match        https://www.yingdao.com/*
// @match        https://college.yingdao.com/*
// @match        https://college.yingdao.com
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.32/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523772/%E5%BD%B1%E5%88%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523772/%E5%BD%B1%E5%88%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 加载样式
    GM_addStyle(GM_getResourceText('element-plus/dist/index.css'));
    
    // 配置项
    const config = {
        autoAnswer: true,      // 自动答题
        autoOperation: true,   // 自动做操作题
        autoExam: true,       // 自动考试
        autoNext: true,       // 自动下一节
        speed: 1.5,           // 视频播放速度
        delay: 1000,          // 操作间隔(毫秒)
    };

    // 题库缓存
    let questionBank = GM_getValue('questionBank', {});

    // 创建UI
    function createUI() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            right: '20px',
            top: '20px',
            zIndex: '9999',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            width: '250px'
        });

        const title = document.createElement('h3');
        title.textContent = '影刀刷课助手';
        title.style.marginTop = '0';
        container.appendChild(title);

        // 添加控制开关
        const controls = [
            { id: 'autoAnswer', text: '自动答题' },
            { id: 'autoOperation', text: '自动操作题' },
            { id: 'autoExam', text: '自动考试' },
            { id: 'autoNext', text: '自动下一节' }
        ];

        controls.forEach(ctrl => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = ctrl.id;
            checkbox.checked = config[ctrl.id];
            checkbox.onchange = (e) => {
                config[ctrl.id] = e.target.checked;
                GM_setValue('config', config);
            };
            
            const label = document.createElement('label');
            label.htmlFor = ctrl.id;
            label.textContent = ctrl.text;
            label.style.marginLeft = '5px';
            
            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        });

        // 速度控制
        const speedDiv = document.createElement('div');
        speedDiv.style.marginBottom = '10px';
        
        const speedLabel = document.createElement('label');
        speedLabel.textContent = '播放速度：';
        
        const speedSelect = document.createElement('select');
        [1, 1.25, 1.5, 2].forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.textContent = speed + 'x';
            if(speed === config.speed) option.selected = true;
            speedSelect.appendChild(option);
        });
        speedSelect.onchange = (e) => {
            config.speed = parseFloat(e.target.value);
            GM_setValue('config', config);
            setVideoSpeed(config.speed);
        };
        
        speedDiv.appendChild(speedLabel);
        speedDiv.appendChild(speedSelect);
        container.appendChild(speedDiv);

        // 状态显示
        const status = document.createElement('div');
        status.id = 'status';
        status.style.marginTop = '10px';
        status.style.padding = '5px';
        status.style.backgroundColor = '#f0f0f0';
        status.style.borderRadius = '4px';
        container.appendChild(status);

        document.body.appendChild(container);
    }

    // 设置视频播放速度
    function setVideoSpeed(speed) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.playbackRate = speed;
        });
    }

    // 自动答题功能
    async function autoAnswer() {
        const questions = document.querySelectorAll('.question-item');
        if (!questions.length) return;

        for (const question of questions) {
            const questionText = question.querySelector('.question-text').textContent.trim();
            const options = question.querySelectorAll('.option-item');
            
            // 从题库中查找答案
            let answer = questionBank[questionText];
            
            if (!answer) {
                // 如果题库中没有，尝试分析题目
                const optionsText = Array.from(options).map(opt => opt.textContent.trim());
                answer = await analyzeQuestion(questionText, optionsText);
                
                // 保存到题库
                questionBank[questionText] = answer;
                GM_setValue('questionBank', questionBank);
            }
            
            // 选择答案
            options.forEach(opt => {
                if (opt.textContent.trim().includes(answer)) {
                    opt.click();
                }
            });
            
            await sleep(config.delay);
        }
    }

    // 自动做操作题
    async function autoOperation() {
        const operationSteps = document.querySelectorAll('.operation-step');
        if (!operationSteps.length) return;

        for (const step of operationSteps) {
            const stepText = step.querySelector('.step-text').textContent.trim();
            const buttons = step.querySelectorAll('button');
            
            // 分析操作步骤
            const action = await analyzeOperation(stepText);
            
            // 执行操作
            buttons.forEach(btn => {
                if (btn.textContent.trim().includes(action)) {
                    btn.click();
                }
            });
            
            await sleep(config.delay);
        }
    }

    // 自动考试
    async function autoExam() {
        const examQuestions = document.querySelectorAll('.exam-question');
        if (!examQuestions.length) return;

        for (const question of examQuestions) {
            const questionText = question.querySelector('.question-text').textContent.trim();
            const options = question.querySelectorAll('.option-item');
            
            // 优先从题库查找
            let answer = questionBank[questionText];
            
            if (!answer) {
                // 分析题目
                const optionsText = Array.from(options).map(opt => opt.textContent.trim());
                answer = await analyzeQuestion(questionText, optionsText);
                
                questionBank[questionText] = answer;
                GM_setValue('questionBank', questionBank);
            }
            
            // 选择答案
            options.forEach(opt => {
                if (opt.textContent.trim().includes(answer)) {
                    opt.click();
                }
            });
            
            await sleep(config.delay);
        }
        
        // 提交考试
        const submitBtn = document.querySelector('.submit-exam');
        if (submitBtn) submitBtn.click();
    }

    // 自动下一节
    function autoNext() {
        const nextBtn = document.querySelector('.next-lesson');
        if (nextBtn) nextBtn.click();
    }

    // 分析题目，返回最可能的答案
    async function analyzeQuestion(question, options) {
        // 这里可以实现更复杂的题目分析逻辑
        // 示例：选择最长的选项作为答案
        return options.reduce((a, b) => a.length > b.length ? a : b);
    }

    // 分析操作步骤
    async function analyzeOperation(stepText) {
        // 这里可以实现更复杂的操作步骤分析逻辑
        // 示例：返回步骤文本中最后一个动词
        const verbs = ['点击', '选择', '拖动', '输入'];
        return verbs.find(v => stepText.includes(v)) || '点击';
    }

    // 工具函数：延时
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 更新状态显示
    function updateStatus(text) {
        const status = document.getElementById('status');
        if (status) status.textContent = text;
    }

    // 主循环
    async function mainLoop() {
        while (true) {
            try {
                if (config.autoAnswer) {
                    updateStatus('正在自动答题...');
                    await autoAnswer();
                }
                
                if (config.autoOperation) {
                    updateStatus('正在做操作题...');
                    await autoOperation();
                }
                
                if (config.autoExam) {
                    updateStatus('正在自动考试...');
                    await autoExam();
                }
                
                if (config.autoNext) {
                    updateStatus('准备进入下一节...');
                    autoNext();
                }
                
                setVideoSpeed(config.speed);
                
                await sleep(config.delay);
                
            } catch (error) {
                console.error('自动刷课出错:', error);
                updateStatus('出错了，正在重试...');
                await sleep(config.delay * 2);
            }
        }
    }

    // 初始化
    function init() {
        createUI();
        mainLoop();
    }

    // 启动
    window.addEventListener('load', init);
})(); 