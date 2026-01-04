// ==UserScript==
// @name         微软Bing 必应积分自动脚本（Microsoft Bing Rewards Script）
// @version      1.0.7
// @description  使用Edge搜索，生成高度仿真的人类搜索词。修复“跳转中”卡死问题，增加强制跳转机制，确保脚本不会卡在搜索页面。
// @author       BABAlala (原作者 yclown, 修改自其项目)
// @match        https://cn.bing.com/
// @match        https://cn.bing.com/?*
// @match        https://www.bing.com/
// @match        https://www.bing.com/?*
// @match        https://cn.bing.com/search?*
// @match        https://www.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPL-3.0
// @namespace    https://greasyfork.org/users/1413398
// @downloadURL https://update.greasyfork.org/scripts/532315/%E5%BE%AE%E8%BD%AFBing%20%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%EF%BC%88Microsoft%20Bing%20Rewards%20Script%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532315/%E5%BE%AE%E8%BD%AFBing%20%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%EF%BC%88Microsoft%20Bing%20Rewards%20Script%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const DEFAULT_CONFIG = {
        max_pc: 40,        // PC端最大搜索次数
        max_ph: 30,        // 移动端最大搜索次数
        min_interval: 10,  // 最小间隔(秒)
        max_interval: 30  // 最大间隔(秒)
    };

    // 状态变量
    let isRunning = false;
    let timer = null;
    let countdownTimer = null;

    // === 1. 样式隔离 ===
    GM_addStyle(`
        #br_reward_tool {
            position: fixed; right: 30px; bottom: 30px; left:auto; top:auto;
            background: #fff; padding: 0; border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15); width: 240px;
            font-family: "Segoe UI", Arial, sans-serif; z-index: 9999999;
            transition: box-shadow 0.2s, opacity 0.2s;
            cursor: default; user-select: none;
            border: 1px solid #dcdcdc; box-sizing: border-box;
            text-align: left; line-height: 1.5; color: #333;
        }
        #br_reward_tool * { box-sizing: border-box; }
        #br_reward_tool .br_header {
            position: relative; height: 40px;
            border-top-left-radius: 8px; border-top-right-radius: 8px;
            background: #f5f5f5; border-bottom: 1px solid #e0e0e0;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 12px; cursor: move; width: 100%;
        }
        #br_reward_tool .br_title { font-size: 14px; font-weight: 600; color: #444; }
        #br_reward_tool .br_minimize-btn {
            border: none; background: none; cursor: pointer;
            font-size: 20px; color: #666; padding: 0;
            width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
        }
        #br_reward_tool .br_minimize-btn:hover { color: #0078d4; background: #e0e0e0; border-radius: 4px; }

        #br_reward_tool .br_panel-content { padding: 15px; background: #fff; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;}

        /* 按钮组 */
        #br_reward_tool .br_btn {
            display: block; width: 100%; margin: 8px 0; padding: 8px 0;
            color: #fff; border-radius: 4px; text-align: center; font-weight: 600;
            text-decoration: none; font-size: 14px; cursor: pointer;
            transition: all 0.2s; border: none; outline: none;
        }
        .br_btn_start { background: #0078d4; }
        .br_btn_start:hover { background: #005bb5; }
        .br_btn_stop { background: #d63031; }
        .br_btn_stop:hover { background: #c0392b; }
        .br_btn_reset { background: #f0f0f0; color: #333 !important; border: 1px solid #ccc !important; font-weight: normal !important; }
        .br_btn_reset:hover { background: #e0e0e0; }

        /* 统计文本 */
        #br_reward_tool p { margin: 8px 0; color: #444; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
        #br_reward_tool .br_count { font-weight: bold; color: #0078d4; font-size: 14px; }
        #br_reward_tool #br_status_text { color: #666; font-size: 12px; margin-top: 12px; text-align: center; display: block; background: #f9f9f9; padding: 4px; border-radius: 4px;}
        #br_reward_tool #br_countdown { color: #e67e22; font-weight: bold; }

        /* 最小化球体 */
        #br_reward_tool.br_minimized {
            width: 50px !important; height: 50px !important; padding: 0 !important;
            background: transparent !important; box-shadow: none !important; border: none !important;
            right: 30px !important; bottom: 30px !important;
        }
        #br_reward_tool .br_mini-icon {
            width: 50px; height: 50px; border-radius: 50%; background: #0078d4;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 20px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: bold;
            border: 2px solid #fff;
        }
        #br_reward_tool .br_mini-icon:hover { transform: scale(1.05); background: #005bb5; }
    `);

    // === 2. 初始化 UI ===
    const countInfo = GetConfig();
    const toolHtml = `
        <div id="br_reward_tool">
            <div class="br_header">
                <span class="br_title">必应积分助手 v1.1.1</span>
                <button class="br_minimize-btn" title="最小化">–</button>
            </div>
            <div class="br_panel-content">
                <button id="br_toggle_btn" class="br_btn br_btn_start">▶ 开始搜索</button>
                <div style="border-top: 1px solid #eee; margin: 10px 0;"></div>
                <p>电脑搜索: <span><span class="br_count" id="pc_count">${countInfo.pc_count}</span> / ${DEFAULT_CONFIG.max_pc}</span></p>
                <p>手机搜索: <span><span class="br_count" id="ph_count">${countInfo.ph_count}</span> / ${DEFAULT_CONFIG.max_ph}</span></p>
                <p>下次搜索: <span id="br_countdown">--</span></p>
                <span id="br_status_text">等待开始...</span>
                <button id="br_reset_btn" class="br_btn br_btn_reset" style="margin-top:10px;">↺ 重置今日计数</button>
            </div>
            <div class="br_mini-icon" style="display:none;">Bing</div>
        </div>
    `;

    if(document.body) {
        document.body.insertAdjacentHTML('beforeend', toolHtml);
    } else {
        window.onload = function() { document.body.insertAdjacentHTML('beforeend', toolHtml); }
    }

    // === 3. 交互逻辑 ===
    setTimeout(() => {
        const toolBox = document.getElementById('br_reward_tool');
        const toggleBtn = document.getElementById('br_toggle_btn');
        const resetBtn = document.getElementById('br_reset_btn');

        if(!toolBox) return;

        toggleBtn.onclick = ToggleScript;
        resetBtn.onclick = CleanCount;

        const minBtn = toolBox.querySelector('.br_minimize-btn');
        const miniIcon = toolBox.querySelector('.br_mini-icon');
        const panelContent = toolBox.querySelector('.br_panel-content');
        const header = toolBox.querySelector('.br_header');

        minBtn.onclick = (e) => {
            e.stopPropagation();
            toolBox.classList.add('br_minimized');
            panelContent.style.display = 'none';
            header.style.display = 'none';
            miniIcon.style.display = 'flex';
            toolBox.style.right = '30px'; toolBox.style.bottom = '30px'; toolBox.style.left = 'auto'; toolBox.style.top = 'auto';
        };

        miniIcon.onclick = (e) => {
            e.stopPropagation();
            toolBox.classList.remove('br_minimized');
            panelContent.style.display = 'block';
            header.style.display = 'flex';
            miniIcon.style.display = 'none';
            toolBox.style.right = '30px'; toolBox.style.bottom = '30px'; toolBox.style.left = 'auto'; toolBox.style.top = 'auto';
        };

        let isDragging = false, dragX = 0, dragY = 0;
        header.onmousedown = (e) => {
            isDragging = true;
            dragX = e.clientX - toolBox.offsetLeft;
            dragY = e.clientY - toolBox.offsetTop;
            toolBox.style.transition = 'none';
        };
        document.onmousemove = (e) => {
            if(!isDragging) return;
            e.preventDefault();
            let l = e.clientX - dragX;
            let t = e.clientY - dragY;
            l = Math.max(0, Math.min(window.innerWidth - toolBox.offsetWidth, l));
            t = Math.max(0, Math.min(window.innerHeight - toolBox.offsetHeight, t));
            toolBox.style.left = l + 'px';
            toolBox.style.top = t + 'px';
            toolBox.style.right = 'auto';
            toolBox.style.bottom = 'auto';
        };
        document.onmouseup = () => { isDragging = false; toolBox.style.transition = ''; };

        // 自动恢复检查
        const shouldAutoRun = GM_getValue("br_auto_run", false);
        if (shouldAutoRun) {
            UpdateCountdownUI("准备中...");
            UpdateStatus("正在初始化...", "#e67e22");
            setTimeout(() => {
                const cfg = GetConfig();
                if ((!IsPhone() && cfg.pc_count < DEFAULT_CONFIG.max_pc) || (IsPhone() && cfg.ph_count < DEFAULT_CONFIG.max_ph)) {
                    ToggleScript();
                } else {
                    GM_setValue("br_auto_run", false);
                    UpdateCountdownUI("已完成");
                    UpdateStatus("今日任务已完成 (Auto Stop)", "#27ae60");
                }
            }, 1200);
        }
    }, 500);

    // === 4. 核心控制 ===

    function ToggleScript() {
        const btn = document.getElementById('br_toggle_btn');

        if (isRunning) {
            isRunning = false;
            GM_setValue("br_auto_run", false);
            clearInterval(timer);
            clearInterval(countdownTimer);
            btn.textContent = "▶ 继续搜索";
            btn.className = "br_btn br_btn_start";
            UpdateStatus("已暂停", "#666");
            UpdateCountdownUI("--");
        } else {
            const config = GetConfig();
            if (CheckFinished(config)) return;

            isRunning = true;
            GM_setValue("br_auto_run", true);
            btn.textContent = "⏸ 暂停搜索";
            btn.className = "br_btn br_btn_stop";
            UpdateStatus("脚本运行中...", "#e67e22");
            StartSearchLoop();
        }
    }

    function CheckFinished(config) {
        if ((!IsPhone() && config.pc_count >= DEFAULT_CONFIG.max_pc) || (IsPhone() && config.ph_count >= DEFAULT_CONFIG.max_ph)) {
             UpdateStatus(IsPhone() ? "手机端任务已达标" : "PC端任务已达标", "#27ae60");
             alert(IsPhone() ? "手机端搜索任务已完成！" : "PC端搜索任务已完成！");
             GM_setValue("br_auto_run", false);
             return true;
        }
        return false;
    }

    function StartSearchLoop() {
        if(!isRunning) return;
        const interval = GetRandomInterval();
        let remaining = interval / 1000;
        UpdateCountdownUI(remaining);

        countdownTimer = setInterval(() => {
            if(!isRunning) { clearInterval(countdownTimer); return; }
            remaining--;
            UpdateCountdownUI(remaining);
            if (remaining <= 0) {
                clearInterval(countdownTimer);
                UpdateCountdownUI("正在跳转...");
                PerformSearch();
            }
        }, 1000);
    }

    // === 关键修复：PerformSearch 强制跳转机制 ===
    function PerformSearch() {
        if(!isRunning) return;

        const config = GetConfig();
        if ((!IsPhone() && config.pc_count >= DEFAULT_CONFIG.max_pc) || (IsPhone() && config.ph_count >= DEFAULT_CONFIG.max_ph)) {
            ToggleScript();
            alert("任务达标，停止运行");
            return;
        }

        const keyword = GetRandomSearchTerm();

        // 1. 尝试填入搜索词
        try {
            let input = document.getElementById("sb_form_q") || document.querySelector("input[name='q']");
            let btn = document.getElementById("sb_form_go") || document.querySelector("label[for='sb_form_go']") || document.querySelector("#sb_form_search");
            let form = document.getElementById("sb_form");

            if (input) {
                // 模拟真实输入
                input.focus();
                input.value = keyword;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();
            }

            UpdateStatus(`正在搜索: ${keyword}`, "#0078d4");

            // 更新计数 (先保存，因为跳转后页面就销毁了)
            if (IsPhone()) config.ph_count++; else config.pc_count++;
            GM_setValue("bing_reward", JSON.stringify(config));

            // 2. 优先尝试点击按钮 (稍微延迟让输入生效)
            setTimeout(() => {
                try {
                    if (btn) btn.click();
                    else if (form) form.submit();
                    else if (input) input.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
                } catch(e) { console.log("点击失败，准备强制跳转"); }
            }, 300);

        } catch (e) {
            console.error("准备搜索出错:", e);
        }

        // 3. 【看门狗】强制跳转机制
        // 如果3.5秒后页面还在(说明点击无效)，直接强制修改URL跳转
        setTimeout(() => {
            if (isRunning) { // 再次检查运行状态
                UpdateStatus("强制跳转中...", "#e74c3c");
                const targetUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(keyword);
                window.location.href = targetUrl;
            }
        }, 3500);
    }

    // === 辅助函数 ===
    function IsPhone() {
        return /mobile|android|iphone|ipad|touch/i.test(navigator.userAgent.toLowerCase()) || window.innerWidth < 768;
    }

    function GetConfig() {
        let config = GM_getValue("bing_reward");
        const today = new Date().toISOString().split("T")[0];
        if (!config || JSON.parse(config).date !== today) {
            config = { date: today, pc_count: 0, ph_count: 0 };
        } else {
            config = JSON.parse(config);
        }
        return config;
    }

    function UpdateStatus(text, color) {
        const el = document.getElementById("br_status_text");
        if(el) {
            el.textContent = text;
            el.style.color = color || "#333";
        }
    }

    function UpdateCountdownUI(content) {
        const el = document.getElementById("br_countdown");
        if(!el) return;
        if (typeof content === 'string') el.textContent = content;
        else el.textContent = content > 0 ? `${Math.floor(content)}秒` : '跳转中...';
    }

    function CleanCount() {
        if(confirm("确定要重置今日的搜索计数吗？")) {
            const today = new Date().toISOString().split("T")[0];
            GM_setValue("bing_reward", JSON.stringify({ date: today, pc_count: 0, ph_count: 0 }));
            GM_setValue("br_auto_run", false);
            location.reload();
        }
    }

    function GetRandomInterval() {
        const min = DEFAULT_CONFIG.min_interval * 1000;
        const max = DEFAULT_CONFIG.max_interval * 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // === 搜索词生成器 ===
    function GetRandomSearchTerm() {
        const currentYear = new Date().getFullYear();
        const dict = {
            tech: ['iPhone 16', 'RTX 5090', '华为 Mate 70', '小米 15', 'MacBook Pro', 'PS5 Pro', 'Switch 2', 'iPad Air', '机械键盘', '降噪耳机', '智能手表', '无人机', '4K显示器', '扫地机器人', '洗地机', '智能门锁'],
            coding: ['Python 教程', 'Java 环境变量', 'Linux 常用命令', 'Docker 部署', 'React vs Vue', 'ChatGPT API', 'Github Copilot', 'SQL 优化', '正则表达式', 'C++ 指针', 'Rust 入门', 'Unity 游戏开发', 'VS Code 插件', 'Python 爬虫'],
            life: ['感冒吃什么药', '番茄炒蛋做法', '近视眼手术', '社保怎么转', '公积金提取', '护照办理流程', '高铁带酒规定', '减肥食谱', '失眠怎么办', '甲流症状', '体检注意事项', '装修除甲醛', '怎么选窗帘', '车辆年检'],
            fun: ['豆瓣高分电影', 'Netflix 推荐', '奥斯卡获奖名单', '热门美剧', '必玩Steam游戏', '周杰伦演唱会', '海贼王最新话', '三体电视剧', '原神攻略', '英雄联盟 符文', '黑神话悟空', 'Switch 游戏推荐'],
            travel: ['三亚旅游攻略', '迪士尼门票', '川藏线自驾', '日本签证材料', '马尔代夫 价格', '故宫 预约', '环球影城 排队', '特价机票', '周边游推荐', '古镇旅游'],
            money: ['今日金价', '美元汇率', '贵州茅台 股价', '纳斯达克 指数', '房贷利率', '个税计算器', '理财产品 推荐', '比特币 走势', '美联储 加息', '黄金回收价格'],
            prefix: ['如何', '怎么', '为什么', '哪里可以', '什么时候', '新手怎么', '最好的', '便宜的'],
            suffix: ['教程', '攻略', '评测', '下载', '价格', '安装包', '排行榜', '好不好', '最新消息', '解决办法', '参数对比', '官网', '论坛']
        };

        const templates = [
            () => `${getRandom(dict.tech)} ${getRandom(dict.suffix)}`,
            () => `${getRandom(dict.prefix)} ${getRandom(dict.life)}`,
            () => getRandom(dict.coding),
            () => `${currentYear}年 ${getRandom(dict.fun)}`,
            () => `${getRandom(dict.tech)} ${getRandom(['价格', '多少钱', '参数', '发布时间'])}`,
            () => `${getRandom(dict.travel)}`,
            () => getRandom(dict.money),
            () => `${currentYear}年 ${getRandom(['十大','最好的','性价比高的'])} ${getRandom(dict.tech)}`
        ];

        function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
        return templates[Math.floor(Math.random() * templates.length)]();
    }
})();