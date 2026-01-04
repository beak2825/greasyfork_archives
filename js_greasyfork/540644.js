// ==UserScript==
// @name         韩师(HSTC)自动评教
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  优化Log日志系统，修复执行逻辑矛盾，UI深度优化
// @author       Dlany-Cohhh 
// @match        *://jw.hstc*
// @match        *://webvpn.hstc.edu.cn/http-80*
// @match        *://jw.hstc.edu.cn/*
// @match        *://*.hstc.edu.cn/*
// @match        *://webvpn.hstc.edu.cn/*
// @match        file:///*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540644/%E9%9F%A9%E5%B8%88%28HSTC%29%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/540644/%E9%9F%A9%E5%B8%88%28HSTC%29%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.self !== window.top) return;

    // --- 配置与库 ---
    const COMMENT_LIB = [
        "老师讲课认真，教学效果优秀，受益匪浅！",
        "教学内容丰富，讲解深入浅出，课堂氛围好。",
        "准备充分，条理清晰，是很棒的听课体验。",
        "教学严谨且不失幽默，能有效调动学生积极性。",
        "老师非常负责，课后耐心解答问题，点赞！",
        "对学生要求严格，对待教学工作认真负责，非常敬业。",
        "备课极其用心，资料准备齐全，是位扎实的好老师。",
        "课堂互动多，老师专业素养高，非常推荐。",
        "老师擅长举例，枯燥的理论变得易于理解，效率很高。",
        "教学节奏把握得很好，重难点突出，听课过程顺畅。"
    ];

    // --- 深度优化后的日志对象 ---
    const log = {
        _print: (tag, msg, color) => {
            console.log(
                `%c[评教助手] %c${tag}%c ${msg}`, 
                "color: #999; font-size: 10px;", 
                `background: ${color}; color: #fff; padding: 1px 5px; border-radius: 3px; font-weight: bold;`, 
                `color: ${color};`
            );
        },
        info: (msg) => log._print("INFO", msg, "#0078d7"),
        success: (msg) => log._print("DONE", msg, "#28a745"),
        warn: (msg) => log._print("WARN", msg, "#f39c12"),
        error: (msg) => log._print("FAIL", msg, "#e74c3c"),
        step: (num, msg) => {
            console.log(
                `%c Step ${num} %c ${msg}`, 
                "background: #34495e; color: #fff; border-radius: 3px 0 0 3px; padding: 1px 6px;", 
                "background: #ecf0f1; color: #34495e; border-radius: 0 3px 3px 0; padding: 1px 6px; font-weight: bold;"
            );
        },
        group: (name) => console.group(`%c🚀 评教任务执行: ${name}`, "color: #0078d7; font-weight: bold; font-size: 12px;"),
        groupEnd: () => console.groupEnd()
    };

    // --- 核心逻辑 ---
    function autoSelectByStrategy(strategy) {
        let radios = document.querySelectorAll('input[type="radio"]');
        let grouped = {};
        radios.forEach(radio => {
            if (!grouped[radio.name]) grouped[radio.name] = [];
            grouped[radio.name].push(radio);
        });

        let groupKeys = Object.keys(grouped);
        if (groupKeys.length === 0) {
            log.warn("未发现可评分的单选框项目");
            return false;
        }

        log.step(1, `识别到 ${groupKeys.length} 个评分项，开始填充...`);
        let randomIndexForGood = (strategy === "excellent") ? Math.floor(Math.random() * groupKeys.length) : -1;

        groupKeys.forEach((name, index) => {
            let group = grouped[name];
            let targetValue = "0"; // 默认优秀
            if (strategy === "good") targetValue = "1";
            else if (strategy === "excellent") targetValue = (index === randomIndexForGood) ? "1" : "0";
            else if (strategy === "random") targetValue = Math.random() > 0.15 ? "0" : "1";

            let targetOption = group.find(r => r.value === targetValue) || group[0];
            targetOption.checked = true;
            targetOption.dispatchEvent(new Event('change', { bubbles: true }));
        });
        return true;
    }

    function startProcess() {
        const btn = document.getElementById('auto-eval-btn');
        const strategy = document.getElementById('score-strategy').value;
        const enableSubmit = document.getElementById('auto-submit-toggle').checked;
        const customComment = document.getElementById('auto-eval-comment').value.trim();
        const startTime = performance.now();

        log.group(strategy.toUpperCase());
        
        // UI 状态更新
        btn.classList.add('processing');
        btn.style.setProperty('--progress', '0%');
        btn.innerText = "正在处理...";
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 25;
            btn.style.setProperty('--progress', `${progress}%`);
            if (progress >= 100) clearInterval(interval);
        }, 100);

        // 执行单选逻辑
        const hasRadios = autoSelectByStrategy(strategy);
        
        if (hasRadios) {
            // 执行评语逻辑
            const finalComment = customComment || COMMENT_LIB[Math.floor(Math.random() * COMMENT_LIB.length)];
            const inputs = document.querySelectorAll('textarea, input[type="text"]');
            inputs.forEach(el => {
                el.value = finalComment;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            });
            log.step(2, `评语填充完成: "${finalComment.substring(0, 12)}..."`);
            
            setTimeout(() => {
                const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                log.success(`页面填充成功! 耗时: ${duration}s`);
                btn.innerText = "处理完成 ✓";
                btn.style.background = "#e8f5e9";

                if (enableSubmit) {
                    log.info("检测到自动提交开启，准备触发提交按钮...");
                    window.confirm = () => true;
                    window.alert = () => true;
                    const submitBtn = document.querySelector('button[type="submit"], input[value*="提交"], .btn-submit, #submit, a.btn-primary[onclick*="save"]');
                    if (submitBtn) {
                        setTimeout(() => submitBtn.click(), 500);
                    } else {
                        log.warn("未找到提交按钮，请手动提交");
                    }
                }
                resetButton(btn);
            }, 600);
        } else {
            // 失败逻辑
            log.error("未发现可操作的评分项，任务中止");
            btn.innerText = "未发现项目";
            btn.style.background = "#ffebee";
            resetButton(btn);
        }
    }

    function resetButton(btn) {
        setTimeout(() => {
            btn.style.setProperty('--progress', '0%');
            btn.innerText = "开始执行";
            btn.style.background = "#eee";
            btn.classList.remove('processing');
            log.groupEnd();
        }, 1000);
    }

    // --- 界面构建 ---
    function createPopup() {
        if (document.getElementById('auto-eval-popup')) return;
        
        let popup = document.createElement('div');
        popup.id = 'auto-eval-popup';
        Object.assign(popup.style, {
            position: 'fixed', top: '15%', right: '20px',
            background: '#ffffff', borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)', zIndex: '2147483647', width: '300px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden'
        });

        popup.innerHTML = `
            <style>
                #auto-eval-btn {
                    position: relative; background: #eee; color: #333; border: none;
                    padding: 12px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 14px; overflow: hidden;
                    z-index: 1; transition: all 0.3s; width: 100%;
                }
                #auto-eval-btn::before {
                    content: ''; position: absolute; top: 0; left: 0; bottom: 0;
                    width: var(--progress, 0%); background: linear-gradient(90deg, #0078d7, #00c6ff);
                    transition: width 0.3s ease; z-index: -1;
                }
                #auto-eval-btn.processing { color: #fff; }
                #auto-eval-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                #popup-header { cursor:move; background: linear-gradient(135deg, #0078d7, #005a9e); color:#fff; padding:15px; font-weight:600; display:flex; justify-content:space-between; align-items:center; }
            </style>
            <div id="popup-header">
                <span>🚀 评教助手 V2.3.1</span>
                <span id="auto-eval-close" style="cursor:pointer; font-size:20px;">&times;</span>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; gap:15px;">
                <select id="score-strategy" style="width:100%; padding:8px; border-radius:8px; border:1px solid #eee; background:#f9f9f9;">
                    <option value="excellent">🌟 几乎全优 (规避拦截)</option>
                    <option value="random">🎲 随机比例 (优/良)</option>
                    <option value="good">👍 全是良好 (稳健)</option>
                </select>
                <textarea id="auto-eval-comment" style="width:100%; height:50px; padding:8px; border-radius:8px; border:1px solid #eee; font-size:12px; resize:none; background:#f9f9f9;" placeholder="自定义评语 (留空则随机)..."></textarea>
                <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#444;">
                    <input type="checkbox" id="auto-submit-toggle" checked> 自动提交
                </div>
                <button id="auto-eval-btn">开始执行</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('auto-eval-btn').onclick = startProcess;
        document.getElementById('auto-eval-close').onclick = () => popup.remove();

        // 简易拖拽逻辑
        const header = document.getElementById('popup-header');
        let isDragging = false, startX, startY, initialX, initialY;
        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initialX = popup.offsetLeft; initialY = popup.offsetTop;
            popup.style.transition = 'none';
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            popup.style.left = (initialX + (e.clientX - startX)) + 'px';
            popup.style.top = (initialY + (e.clientY - startY)) + 'px';
            popup.style.right = 'auto';
        };
        document.onmouseup = () => isDragging = false;
    }

    // --- 启动引导 ---
    const timer = setInterval(() => {
        if (document.body) {
            clearInterval(timer);
            createPopup();
            log.info("评教助手已就绪，等待操作...");
        }
    }, 500);
})();