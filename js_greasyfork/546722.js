// ==UserScript==
// @name         猫猫放置任务刷新
// @namespace    http://tampermonkey.net/
// @version      0.07
// @description  刷新任务到指定类型
// @author       火龙果
// @license      MIT
// @match        **moyu-idle.com/*
// @match        **www.moyu-idle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546722/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E4%BB%BB%E5%8A%A1%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546722/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E4%BB%BB%E5%8A%A1%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //等待返回消息时长 设置长时间以防破财 毫秒
    const waitForMsg = 30 * 1000;

    const allTasks = {
        采集: {
            种植: false,
            种植葡萄: false,
            种植黑麦: false,
            采蘑菇: false,
            采浆果: false,
            采草药: false,
            采集花草: false,
            采蜂蜜: false,
            砍树: false,
            砍竹子: false,
            捡贝壳: false,
            挖沙: false,
            收集云絮: false,
            收集彩虹碎片: false
        },
        钓鱼: {
            钓鱼: false,
            捞鱼: false,
            猫咪捕鱼: false,
            深海捕鱼: false,
            神秘钓鱼: false
        },
        照料家禽: {
            照料小鸡仔: false,
            照料奶牛: false,
            照料绵羊: false,
            养蚕: false
        },
        采矿: {
            挖矿: false,
            矿井采矿: false,
            深度开采: false,
            开采鱼鳞矿: false,
            开采绒毛岩: false,
            开采爪痕矿: false,
            开采魔晶石: false,
            开采猫眼石: false,
            开采琥珀瞳石: false
        },
        烹饪: {
            制作野草沙拉: false,
            制作野果拼盘: false,
            熬制鱼汤: false,
            炖蘑菇汤: false,
            制作猫薄荷饼干: false,
            制作猫咪零食: false,
            烤制浆果派: false,
            制作豪华猫粮: false,
            制作鲜鱼刺身拼盘: false,
            制作蛋奶布丁: false,
            酿造浆果酒: false,
            酿造晨露精酿: false,
            酿造铃语精酿: false,
            制作浆果奶昔: false,
            制作铃语奶昔: false,
            制作金枪鱼罐头: false,
            制作风味虾仁罐头: false,
            制作彩虹鱼干罐头: false,
            制作神秘锦鲤罐头: false

        },
        制造: {
            制作斧头: false,
            制作铁镐: false,
            制作冰镐: false,
            制作铁锅: false,
            制作铁铲: false,
            制作小铁锤: false,
            制作钢锅: false,
            制作钢铲: false,
            制作小钢锤: false,
            制作铁钳: false,
            制作裁缝剪刀: false,
            制作针线包: false,
            制作酿造搅拌器: false,
            制作秘银工匠锤: false,
            制作采矿收纳背篓: false,
            烧制炭: false,
            木浆: false, 制作木剑: false,
            制作铁匕首: false,
            制作剧毒匕首: false,
            制作木质法杖: false,
            制作月光法杖: false,
            制作喵影法杖: false,
            制作魔晶法杖: false,
            制作银项链: false,
            制作银手链: false,
            制作远古鱼骨项链: false,
            制作月光吊坠: false,
            制作月光守护者: false,
            制作猫薄荷手链: false,
            制作余烬庇护: false,
            制作分裂核心: false,
            制作过载核心: false,
            制作伏击吊坠: false,
            制作先击吊坠: false,
            制作兽牙项链: false,
            制作彩虹手链: false,
            制作彩虹项链: false,
            制造玻璃瓶: false,
            制作铁罐头: false,
            制作木钓竿: false,
            制作竹钓竿: false,
            制作竹抄网: false,
            制作竹制捕鱼笼: false,
            制作铁钓竿: false,
            制作铁抄网: false,
            制作铁制捕鱼笼: false,
            制作自动喂食器: false,
            制作猫抓板: false,
            制作书桌: false,
            木浆造纸: false,
            造纸: false,
            封装书: false,
            制作碳笔: false,
        },
        锻造: {
            熔炼钢: false,
            熔炼银: false,
            熔炼秘银: false,
            熔炼鱼鳞合金: false,
            熔炼暗影精铁: false,
            制作铁剑: false,
            锻造铁甲衣: false,
            锻造铁头盔: false,
            锻造铁护手: false,
            锻造铁护腿: false,
            制作钢剑: false,
            锻造钢甲衣: false,
            锻造钢头盔: false,
            锻造钢护手: false,
            锻造钢护腿: false,
            锻造钢制重锤: false,
            锻造银质剑: false,
            锻造银质匕首: false,
            锻造银护甲: false,
            锻造银头盔: false,
            锻造银护手: false,
            锻造银护腿: false,
            锻造哥布林匕首·改: false,
            锻造狼皮甲: false,
            锻造骷髅盾·强化: false,
            锻造巨魔木棒·重型: false,
            锻造巨蝎毒矛: false,
            锻造守护者核心护符: false,
            锻造龙鳞甲: false,
            锻造冰霜匕首: false,
            锻造影之刃: false,
            锻造秘银剑: false,
            锻造秘银匕首: false,
            锻造秘银头盔: false,
            锻造秘银护甲: false,
            锻造秘银护手: false,
            锻造秘银护腿: false,
            锻造鱼鳞合金头盔: false,
            锻造鱼鳞合金盔甲: false,
            锻造鱼鳞合金护手: false,
            锻造鱼鳞合金护腿: false,
            锻造暗影精铁剑: false,
            锻造暗影精铁头盔: false,
            锻造暗影精铁盔甲: false,
            锻造暗影精铁臂甲: false,
            锻造暗影精铁腿甲: false
        },
        缝制: {
            缝制毛毛衣: false,
            缝制毛毛帽: false,
            缝制毛毛手套: false,
            缝制毛毛裤: false,
            缝制羊绒布料: false,
            缝制丝绸布料: false,
            分离绒毛: false,
            缝制绒毛布料: false,
            缝制羊毛衣: false,
            缝制羊毛帽: false,
            缝制羊毛手套: false,
            缝制羊毛裤: false,
            缝制羊毛罩袍: false,
            缝制羊毛法师帽: false,
            缝制羊毛法师手套: false,
            缝制羊毛法师裤子: false,
            缝制羊毛紧身衣: false,
            缝制羊毛裹头巾: false,
            缝制羊毛绑带手套: false,
            缝制羊毛紧身裤: false,
            缝制羊毛可爱帽: false,
            缝制羊毛可爱手套: false,
            缝制羊毛裁缝服: false,
            缝制羊毛裁缝手套: false,
            缝制羊毛工匠服: false,
            缝制羊毛围裙: false,
            缝制羊毛隔热手套: false,
            缝制羊毛探险背包: false,
            缝制园艺手套: false,
            缝制采矿工作服: false,
            缝制钓鱼帽: false,
            缝制钓鱼专注帽: false,
            缝制重型矿工手套: false,
            缝制灵巧采集靴: false,
            缝制厨师帽: false,
            缝制毛毛可爱帽: false,
            缝制毛毛裁缝服: false,
            缝制毛毛裁缝手套: false,
            制作采集手环: false,
            缝制丝质罩袍: false,
            缝制丝质法师帽: false,
            缝制丝质法师手套: false,
            缝制丝质法师裤子: false,
            缝制丝质夜行衣: false,
            缝制丝质裹头巾: false,
            缝制丝质绑带手套: false,
            缝制丝质宽松裤: false,
            缝制丝质可爱帽: false,
            缝制丝质可爱手套: false,
            缝制丝质工匠服: false,
            缝制丝质裁缝服: false,
            缝制丝质裁缝手套: false,
            缝制丝质法师披肩: false,
            缝制丝质夜行斗篷: false,
            缝制丝质战士披风: false,
            缝制丝质活力披风: false,
            缝制雪狼皮披风: false,
            缝制冰羽靴: false,
            缝制虹运飘带: false,
            缝制蝠影斗篷: false,
            缝制云行靴: false,
            缝制云行斗篷: false,
            缝制毛绒玩具: false,
            制作舒适猫窝: false,
            缝制诅咒香囊: false
        }
        ,
        特殊制造: {
            制作幸运猫神像: false,
            制作猫咪护符: false,
            炼制猫薄荷药剂: false,
            拼接猫咪文物: false,
            融合采集戒指: false
        }
        ,
        炼金: {
            猫咪点金术1: false,
            猫咪点金术2: false,
            猫咪点金术3: false,
            基础点金术1: false,
            基础点金术2: false,
            基础点金术3: false,
            制作魔法书: false,
            制作星辰魔法书: false,
            提炼月光精华: false,
            提炼灵质: false,
            提炼纯净精华: false,
            炼制治疗药水: false,
            炼制魔法药水: false,
            附灵影之刃: false,
            附灵守护者核心护符: false,
            净化魂灵之刃: false,
            净化诅咒香囊: false
        }
        ,
        探索: {
            探索: false,
            考古挖掘: false,
            寻宝: false
        }
        ,
        提升自我: {
            跑步: false,
            举重: false,
            读书: false,
            战斗练习: false,
            基础攻击练习: false,
            基础防御练习: false,
            游泳: false,
            搏击训练: false,
            抗打击训练: false,
            瑜伽练习: false,
            "复习战斗知识-力量": false,
            "复习战斗知识-敏捷": false,
            "复习战斗知识-智力": false
        }
    }
    const settings = GM_getValue('refreshTaskSettings', {
        goldLimit: 7000,
        tasks: allTasks
    });

    let isRunning = false;
    let checkInterval = null;
    let taskList = [];
    let startTask = GM_getValue('startTask', false)

    // 拖动相关变量
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY; // 记录拖动开始位置
    let isClick = true; // 判断是否是点击事件

    // 窗口位置和状态
    let windowPosition = {
        x: GM_getValue('windowX', 20) > window.innerWidth - 40 ? window.innerWidth - 40 : GM_getValue('windowX', 20), // 默认右上角
        y: GM_getValue('windowY', 20) > window.innerHeight - 40 ? window.innerHeight - 40 : GM_getValue('windowY', 20),
        isMinimized: GM_getValue('isMinimized', false) // 默认不最小化
    };

    let taskListWsStatus = {
        wait: false, //是否等待
        netx: false //是否下一条消息
    };


    // 全局WebSocket实例引用
    let currentSocket = null;
    let userInfo = null; // ws用户信息

    // 添加控制面板样式
    GM_addStyle(`
        #retask-control-panel {
            position: fixed;
            top: ${windowPosition.y}px;
            left: ${windowPosition.x}px;
            right: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            max-width: 400px;
            font-family: Arial, sans-serif;
            overflow-y: auto;
            max-height: 90vh;
            display: ${windowPosition.isMinimized ? 'none' : 'block'};
        }

        /* 检测Element UI的深色模式类 */
        body.dark #retask-control-panel,
        html.dark #retask-control-panel,
        body.theme-dark #retask-control-panel,
        html.theme-dark #retask-control-panel {
            /* 深色模式样式 */
            background: #18222c; /* 深色背景 */
            color: #ffffff; /* 白色文字 */
        }

        /* 修改后的全局样式，排除特定元素 */
        #retask-control-panel *:not(.no-inherit) {
            color: inherit !important;
            background-color: transparent !important;
        }
            
        #retask-control-panel .retask-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #a4a4a4ff;
            cursor: move; /* 显示拖动光标 */
        }

        #retask-control-panel .toolbar {
            display: flex;
            gap: 10px;
        }

        #retask-control-panel .toolbar-btn {
            background: none;
            border: none;
            color: #333333;
            font-size: 1.5rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        #retask-control-panel .toolbar-btn:hover {
            background: rgba(255,255,255,0.1);
        }

        #retask-control-panel .minimize-btn::before {
            content: '−';
        }
        .task-category {
            margin-bottom: 10px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .category-header {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-bottom: 5px;
        }
        .category-header input {
            margin-right: 5px;
        }
        .category-title {
            font-weight: bold;
        }
        .category-toggle {
            margin-left: 5px;
            font-size: 12px;
            transition: transform 0.2s;
        }
        .category-content {
            padding-left: 15px;
            display: none;
        }
        .task-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .task-item input {
            margin-right: 5px;
        }
        .setting-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        #gold-limit {
            width: 80px;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
        }
        #start-button {
            padding: 5px 12px;
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }
        #start-button:hover {
            background: #3688E6;
        }
        .category-expanded .category-toggle {
            transform: rotate(90deg);
        }
        .category-expanded .category-content {
            display: block;
        }

        .reTaskRestore-btn {
            position: fixed;
            background: rgba(154, 160, 183, 0.95);
            color: white;
            border: 1px solid #ffffffff;
            border-radius: 50%;
            top: ${windowPosition.y}px;
            left: ${windowPosition.x}px;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.2s;
            z-index: 10001;
            display: ${windowPosition.isMinimized ? 'flex' : 'none'};
            cursor: move; /* 显示拖动光标 */
        }

        .reTaskRestore-btn:hover {
            background: rgba(40, 50, 90, 0.95);
            transform: scale(1.05);
            zIndex:999999;
        }

        .highlight-card {
            transition: all 0.3s ease-in-out !important;
            box-shadow: 0 0 0 3px #4caf50 !important;
            outline: none !important; /* 防止可能的outline冲突 */
            border-radius: 2px !important; /* 可选，增加视觉效果 */
        }
    `);


    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'retask-control-panel';

        // 控制面板标题
        const headerHTML = `
            <div class="retask-header" id="refreshTask-header">
                <div >日常任务刷新</div>
                <div class="toolbar">
                    <button class="toolbar-btn minimize-btn" id="retask-minimize-simulator"></button>
                </div>
            </div>
            <div class="setting-group">
                <div>
                    <label for="gold-limit" class="text-sm mr-2">金币限制:</label>
                    <input type="number" id="gold-limit" value="7000" min="0">
                </div>
                <div>
                    <label for="gold-limit" class="text-sm mr-2">任务开始:</label>
                    <input type="checkbox" id="startTask-checkbox" class="startTask-checkbox" ${startTask ? 'checked' : ""}>
                </div>
                <button id="start-button" class="no-inherit">开始</button>
            </div>
        `;

        // 从设置中获取任务列表并生成HTML
        let tasksHTML = '';
        for (const [category, tasks] of Object.entries(allTasks)) {
            // 跳过空的分类
            if (Object.keys(tasks).length === 0) continue;

            let taskItemsHTML = '';
            for (const [taskName, isChecked] of Object.entries(tasks)) {
                taskItemsHTML += `
                <div class="task-item">
                    <input type="checkbox" id="task-${taskName}" class="task-checkbox">
                    <label for="task-${taskName}">${taskName}</label>
                </div>
            `;
            }

            tasksHTML += `
            <div class="task-category" data-category="${category}">
                <div class="category-header">
                    <input type="checkbox" id="category-${category}" class="category-checkbox">
                    <span class="category-title">${category}</span>
                    <span class="category-toggle">▶</span>
                </div>
                <div class="category-content">
                    ${taskItemsHTML}
                </div>
            </div>
        `;
        }

        panel.innerHTML = headerHTML + tasksHTML;
        document.body.appendChild(panel);

        // 添加还原按钮
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'reTaskRestore-btn';
        restoreBtn.id = 'reTaskRestore-simulator';
        restoreBtn.innerHTML = '📝';
        document.body.appendChild(restoreBtn);

        //拖动
        initDrag(panel)
        initRestoreBtnDrag(restoreBtn);
        // 添加最小化事件监听器
        const minimizeBtn = document.getElementById('retask-minimize-simulator')
        minimizeBtn.addEventListener('click', minimizeSimulator);
        minimizeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            minimizeSimulator();
        });

        // 修改还原按钮事件，只在点击时恢复，拖动时不恢复
        restoreBtn.addEventListener('click', function (e) {
            // 只有当没有发生拖动时才执行恢复操作
            if (isClick) {
                restoreSimulator();
            }
            // 重置点击状态
            isClick = true;
        });
        restoreBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // 只有当没有发生拖动时才执行恢复操作
            if (isClick) {
                restoreSimulator();
            }
            // 重置点击状态
            isClick = true;
        });

        // 绑定事件
        document.getElementById('gold-limit').addEventListener('change', saveSettings);
        document.getElementById('start-button').addEventListener('click', startAutomation);
        document.getElementById('startTask-checkbox').addEventListener('change', () => {
            startTask = document.getElementById('startTask-checkbox').checked;
            GM_setValue('startTask', startTask);
        });
        // 为分类添加展开/折叠功能
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function (e) {
                if (e.target.type !== 'checkbox') {
                    const categoryEl = this.parentElement;
                    categoryEl.classList.toggle('category-expanded');
                }
            });
        });

        // 为分类复选框添加全选/取消全选功能
        document.querySelectorAll('.category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const categoryEl = this.closest('.task-category');
                const taskCheckboxes = categoryEl.querySelectorAll('.task-checkbox');

                taskCheckboxes.forEach(taskCheckbox => {
                    taskCheckbox.checked = this.checked;
                });

                saveSettings();
            });
        });

        // 为任务复选框添加事件监听
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            // 任务勾选
            const categoryEl = checkbox.closest('.task-category');
            const categoryName = categoryEl.dataset.category;
            checkbox.addEventListener('change', () => {
                saveSettings()
                document.getElementById(`category-${categoryName}`).checked = Object.values(settings.tasks[categoryName]).every(isChecked => isChecked);
            });
        });

        // // 默认展开第一个分类
        // const firstCategory = document.querySelector('.task-category');
        // if (firstCategory) {
        //     firstCategory.classList.add('category-expanded');
        // }

        // 加载保存的设置
        loadSettings();
    }

    // 最小化模拟器
    function minimizeSimulator(e) {

        const container = document.getElementById('retask-control-panel');
        const restoreBtn = document.getElementById('reTaskRestore-simulator');
        const minimizeBtn = document.getElementById('retask-minimize-simulator');

        // 获取最小化按钮的位置
        const minimizeBtnRect = minimizeBtn.getBoundingClientRect();

        // 设置还原按钮的位置为最小化按钮的位置
        restoreBtn.style.left = `${windowPosition.x}px`; // 居中调整
        restoreBtn.style.top = `${windowPosition.y}px`;  // 居中调整

        container.style.display = 'none';
        restoreBtn.style.display = 'flex';

        windowPosition.isMinimized = true;
        saveWindowState();
    }

    // 还原
    function restoreSimulator() {
        const container = document.getElementById('retask-control-panel');
        const restoreBtn = document.getElementById('reTaskRestore-simulator');

        container.style.display = 'block';
        restoreBtn.style.display = 'none';

        windowPosition.isMinimized = false;
        saveWindowState();
    }

    // 保存设置到本地存储
    function saveSettings() {

        settings['goldLimit'] = document.getElementById('gold-limit').value
        // 收集所有任务的勾选状态
        document.querySelectorAll('.task-category').forEach(categoryEl => {
            const categoryName = categoryEl.dataset.category;
            settings.tasks[categoryName] = {};

            categoryEl.querySelectorAll('.task-item input').forEach(taskInput => {
                const taskName = taskInput.id.replace('task-', '');
                settings.tasks[categoryName][taskName] = taskInput.checked;
            });
        });

        GM_setValue('refreshTaskSettings', settings);
    }

    // 从本地存储加载设置
    function loadSettings() {

        document.getElementById('gold-limit').value = settings.goldLimit;

        // 恢复任务勾选状态
        document.querySelectorAll('.task-category').forEach(categoryEl => {
            const categoryName = categoryEl.dataset.category;
            //类型的勾选
            document.getElementById(`category-${categoryName}`).checked = settings.tasks[categoryName] ? Object.values(settings.tasks[categoryName]).every(isChecked => isChecked) : false;

            categoryEl.querySelectorAll('.task-item input').forEach(taskInput => {
                const taskName = taskInput.id.replace('task-', '');
                if (settings.tasks[categoryName] && settings.tasks[categoryName].hasOwnProperty(taskName)) {
                    taskInput.checked = settings.tasks[categoryName][taskName];
                }
            });
        });

        console.log('刷新任务设置已加载');
    }


    // 开始自动化操作
    function startAutomation() {

        const startButton = document.getElementById('start-button')
        if (isRunning) {
            clearInterval(checkInterval);
            toStartStatus()
        } else {
            // 开始自动化
            isRunning = true;
            startButton.textContent = '停止';
            startButton.classList.remove('start');
            startButton.classList.add('stop');
            startButton.style.backgroundColor = 'red';
            sendGetTaskListMsg()
            taskListWsStatus.wait = true;
            setTimeout(() => queueMicrotask(startRefishTask), 100);
        }
    }

    async function startRefishTask() {
        console.log('===== 开始执行自动化检查 =====');
        //等待返回消息
        const taskListCallback = await waitTaskListCallback()

        if (!taskListCallback) {
            toStartStatus()
            console.error('未找到任务列表！');
            return;
        }

        // 获取设置值
        const goldLimit = settings.goldLimit;
        //console.log(`当前设置: 金币限制=${goldLimit}`);

        // 查找游戏卡片
        let lastIndex = 0;
        console.log(`找到 ${taskList.length} 个游戏卡片，开始分析...`);

        while (isRunning && !isEmptyOrNonNumber(lastIndex) && lastIndex < taskList.length) {
            if (taskListWsStatus.wait) {
                //如果是wait 就等待吧
                await waitTaskListCallback()
                await sleep(1000)
            }
            console.log(`正在处理第 ${lastIndex + 1} 个游戏卡片...`);
            try {
                lastIndex = await handleTaskList(lastIndex);
            } catch (e) {
                console.error('处理失败', e)
                lastIndex++;
            }
        }

        if (isRunning && startTask) {
            console.log('开始执行任务...');
            // 最大次数
            const taskMaxTimes = {}
            const selectedTasks = settings.tasks
            taskList.forEach((card, index) => {
                const { category, subCategory, count, unit } = getCardInfo(card);
                if (count > 0 && selectedTasks[category] && selectedTasks[category][subCategory]) {
                    const key = category + '-' + subCategory;
                    const info = taskMaxTimes[key]
                    if (!info || info[0] < count) {
                        taskMaxTimes[key] = [count, card]
                    }
                }
            });

            // 点击开始
            for (let [key, value] of Object.entries(taskMaxTimes)) {
                console.log('开始执行任务:', value[1]['title']);
                if (!isRunning) break;
                sendStartTaskMessage(value[1])
                await sleep(2000)
            }
        } else {
            console.log('任务不执行');
        }

        toStartStatus()

        console.log('刷新任务结束');

    }

    function toStartStatus() {
        isRunning = false;
        const startButton = document.getElementById('start-button')
        startButton.textContent = '开始';
        startButton.classList.remove('stop');
        startButton.classList.add('start');
        startButton.style.backgroundColor = '#3688E6';
    }

    function getCardInfo(card) {

        const titleText = card.title

        // 解析标题
        const titleParts = titleText.match(/^(\S+)：([^0-9]+?)(\d+)(\D+)$/);
        if (!titleParts) {
            console.warn('标题格式不符合预期，无法解析');
            return;
        }

        const category = titleParts[1].trim().replace(" ", '');
        const subCategory = titleParts[2].trim().replace(" ", '');
        const count = card.target.count - card.target.current
        const unit = titleParts[4].trim().replace(" ", '');
        return { category, subCategory, count, unit };
    }

    async function handleTaskList(nextIndex) {
        // 处理每个卡片
        const card = taskList[nextIndex]
        if (!card) {
            console.log('所有卡片已处理完毕');
            return;
        }
        const btn = document.querySelector('.el-menu-item:has(.iconify.i-material-symbols\\:format-list-bulleted)')
        if (btn && btn.classList.contains('is-active')) {
            // 高亮卡片
            const cards = document.querySelectorAll('.el-card.is-always-shadow.mb-4');
            if (cards.length > 0) {
                cards.forEach(card => {
                    card.classList.remove('highlight-card');
                });
                cards[nextIndex].classList.add('highlight-card');
            }
        }

        const { category, subCategory, count, unit } = getCardInfo(card)
        console.log(`处理卡片: ${card.title}`);
        if (count <= 0) {
            console.log('任务已完成，跳过处理');
            return nextIndex + 1;
        }
        const goldLimit = settings.goldLimit
        const selectedTasks = settings.tasks
        // 检查是否匹配选中项
        if (selectedTasks[category] && selectedTasks[category][subCategory]) {
            console.log('符合条件，跳过处理');
            return nextIndex + 1;
        }

        // 获取金币数量
        const goldAmount = (card.rerollCount + 1) * 250;
        //console.log(`当前金币数量: ${goldAmount}, 限制: ${settings.goldLimit}`);

        // 检查金币是否小于限制并点击重随
        if (goldAmount < goldLimit) {
            console.log(`所需金币(${goldAmount} < ${goldLimit})，执行重随操作`);
            sendRerollMsg(card.uuid)
            taskListWsStatus.wait = true
            console.log('重随按钮已点击');
            return nextIndex;
        } else {
            console.log(`金币超过限制(${goldAmount} ≥ ${goldLimit})，无需操作`);
            return nextIndex + 1;
        }

    }

    async function sleep(time) {
        await new Promise(resolve => setTimeout(resolve, time));
    }

    function isEmptyOrNonNumber(value) {
        // 或者使用 isNaN(value) 但要注意其对字符串的处理
        return value === null || value === undefined || value === '' || Number.isNaN(value);
    }

    // 等待任务列表返回
    async function waitTaskListCallback() {
        const now = Date.now();
        while (Date.now() - now < waitForMsg && taskListWsStatus.wait) {
            await sleep(100);
        }
        if (taskListWsStatus.wait) {
            taskListWsStatus.wait = false;
            taskListWsStatus.netx = false;
            console.log('任务列表返回超时');
            return false;
        }
        console.log('任务列表返回成功');
        taskListWsStatus.wait = false;
        taskListWsStatus.netx = false;
        return true
    };

    function handleTaskListMessage(date) {
        if (taskListWsStatus.wait) {
            taskList = date.data || [];
            taskListWsStatus.wait = false;
        }
    }

    // 修改初始化拖动功能函数，添加触摸事件支持
    function initDrag(element) {
        const header = document.getElementById('refreshTask-header');

        // 鼠标事件
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // 触摸事件
        header.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        function startDrag(e) {
            // 阻止默认行为，防止页面滚动
            e.preventDefault();

            isDragging = true;

            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;

            // 提高z-index，确保拖动时在最上层
            element.style.zIndex = 10001;
        }

        function drag(e) {
            if (!isDragging) return;

            // 阻止默认行为，防止页面滚动
            e.preventDefault();

            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];

            // 计算新位置
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;

            // 限制在视口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - 40));
            newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

            // 更新位置
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;

            // 保存位置
            windowPosition.x = newX;
            windowPosition.y = newY;
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            element.style.zIndex = 10000;

            // 保存窗口位置
            saveWindowState();
        }
    }

    // 同样修改还原按钮的拖动功能，添加触摸支持
    function initRestoreBtnDrag(element) {
        // 鼠标事件
        element.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // 触摸事件
        element.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        function startDrag(e) {
            // 阻止默认行为，防止页面滚动
            e.preventDefault();

            isDragging = true;

            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;
            startX = touch.clientX;
            startY = touch.clientY;

            // 提高z-index，确保拖动时在最上层
            element.style.zIndex = 10002;

            // 阻止事件冒泡，防止触发点击事件
            e.stopPropagation();
        }

        function drag(e) {
            if (!isDragging) return;

            // 阻止默认行为，防止页面滚动
            e.preventDefault();

            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];

            // 计算新位置
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;

            // 限制在视口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));

            // 更新位置
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto'; // 清除右侧定位

            // 保存还原按钮位置
            windowPosition.restoreBtnX = newX;
            windowPosition.restoreBtnY = newY;

            // 如果拖动距离超过阈值，则认为不是点击事件
            if (Math.abs(touch.clientX - startX) > 5 || Math.abs(touch.clientY - startY) > 5) {
                isClick = false;
            }
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            element.style.zIndex = 10001;

            // 保存还原按钮位置
            saveWindowState();
        }
    }

    // 保存窗口状态
    function saveWindowState() {
        GM_setValue('windowX', windowPosition.x);
        GM_setValue('windowY', windowPosition.y);
        GM_setValue('isMinimized', windowPosition.isMinimized);
    }

    // =================================================================================
    // == 核心：WebSocket 拦截器 (原型链拦截)
    // =================================================================================
    //console.log('[WS工具] 准备部署WebSocket拦截器');

    // 拦截send方法
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        currentSocket = this;
        handleSendMessage(data);
        return originalSend.apply(this, arguments);
    };

    // 拦截onmessage事件
    const onmessageDescriptor = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');
    if (onmessageDescriptor) {
        Object.defineProperty(WebSocket.prototype, 'onmessage', {
            ...onmessageDescriptor,
            set: function (callback) {
                const wsInstance = this;
                currentSocket = this;
                // 包装回调函数以拦截消息
                const wrappedCallback = (event) => {
                    handleReceivedMessage(event.data, wsInstance);
                    if (typeof callback === 'function') {
                        callback.call(wsInstance, event);
                    }
                };
                onmessageDescriptor.set.call(this, wrappedCallback);
            }
        });
    }

    console.log('[任务刷新工具] WebSocket拦截器部署完成');
    // =================================================================================

    // —— 消息处理核心函数 ——
    /**
     * 处理发送的WebSocket消息
     * @param {string|ArrayBuffer} data - 发送的消息数据
     */
    function handleSendMessage(data) {
        if (!userInfo) {
            userInfo = getUserInfo(data);
        }
        // 可在此处添加发送消息的自定义处理逻辑
    }

    // —— 解析用户数据 ——
    function getUserInfo(data) {
        try {
            if (typeof data === 'string' && data.length > 2) {

                const payload = JSON.parse(data.substring(2, data.length));
                if (payload[1] && payload[1]['user'] && payload[1]['user']['name']) {
                    return payload[1]['user'];
                }
            }
        } catch (e) {
            // 解析失败，忽略
        }
        return null;
    }

    /**
     * 处理接收的WebSocket消息
     * @param {string|ArrayBuffer} messageData - 接收的消息数据
     * @param {WebSocket} ws - WebSocket实例
     */
    function handleReceivedMessage(messageData, ws) {
        if (messageData instanceof ArrayBuffer) {
            try {
                // 检测压缩格式并解压
                const format = detectCompression(messageData);
                const text = pako.inflate(new Uint8Array(messageData), { to: 'string' });
                let parsed = '';
                try {
                    parsed = JSON.parse(text);
                    //console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', `(已解压 ${format})`, parsed);
                } catch {
                    parsed = text;
                    //console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', `(已解压 ${format}, 非JSON)`, text);
                }
                if (taskListWsStatus.netx) {
                    taskListWsStatus.netx = false;
                    setTimeout(() => {
                        handleTaskListMessage(parsed);
                    }, 1);
                }
            } catch (err) {
                //console.error('%c[WS错误]', 'color: #f44336;', '消息解压失败:', err);
            }
        } else {
            // 文本消息直接打印
            //console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', '(文本消息)', messageData);
            if (messageData.includes('quest:list') && taskListWsStatus.wait) {
                taskListWsStatus.netx = true;
            } else if (messageData.includes('quest:reroll:error')) {
                taskListWsStatus.wait = false;
                console.log('任务刷新失败');
            }
        }
    }

    /**
     * 检测数据压缩格式
     * @param {ArrayBuffer} buf - 二进制数据
     * @returns {string} 压缩格式 ('gzip'|'zlib'|'deflate')
     */
    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length < 2) return 'deflate';
        if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
        if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        return 'deflate';
    }

    function sendGetTaskListMsg() {
        let msg = `42["quest:list",{"user":${JSON.stringify(userInfo)},"data":null}]`
        sendCustomWsMessage(msg)
    }

    function sendRerollMsg(questUuid) {
        let msg = `42["quest:reroll",{"user":${JSON.stringify(userInfo)},"data":{"questUuid":"${questUuid}"}}]`
        sendCustomWsMessage(msg)
    }

    function sendStartTaskMessage(task) {
        const msg = `42["task:immediatelyStart",{"user":${JSON.stringify(userInfo)},"data":{"actionId":"${task.target.actionId}","repeatCount":${task.target.count},"currentRepeat":${task.target.current},"createTime":${Date.now()}}}]`
        sendCustomWsMessage(msg)
    }

    // —— 自定义发送消息接口 ——
    /**
     * 发送自定义WebSocket消息
     * @param {string|object} data - 要发送的消息数据（对象会自动转为JSON字符串）
     * @param {string} [type='custom'] - 消息类型标识
     * @returns {boolean} 是否发送成功
     */
    function sendCustomWsMessage(message) {
        if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
            console.error('%c[WS发送失败]', 'color: #f44336;', 'WebSocket未连接或已关闭');
            return false;
        }

        try {
            currentSocket.send(message);
            //console.log('%c[自定义发送]', 'color: #FF9800; font-weight: bold;', message);
            return true;
        } catch (error) {
            console.error('%c[自定义发送失败]', 'color: #f44336;', error);
            return false;
        }
    };

    // 等待页面加载完成
    window.addEventListener('load', function () {
        setTimeout(() => {
            createControlPanel()
        }, 1000);
    })
})();