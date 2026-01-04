// ==UserScript==
// @name         奶牛复制助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  银河奶牛放置复制助手，安装后页面会出现一个悬浮按钮，点击可以复制常用短语，然后粘贴到聊天栏中。这些短语可以自行修改。
// @author       XiaoR
// @match        https://www.milkywayidle.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529591/%E5%A5%B6%E7%89%9B%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529591/%E5%A5%B6%E7%89%9B%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const defaultPhrases = ['分解糖（0-10）→苹果（10-20）→橙子（20-35）→竹子/紫茶叶（35-50）→桃子/月亮茶（50-65）→红茶叶（65-80）',
                            '重组海洋精华（炼金1级）→丛林精华（10-23级）→哥布林精华（23-45级）→眼球精华（45-53级）→熊熊精华（53-65级）',
                            '0-35级：鳄鱼背心 35-60级：治疗之书 60-70级：哥布林防御者 70级+ 元素之书',
                            '牛牛新人攻略https://test-ctmd6jnzo6t9.feishu.cn/docx/KG9ddER6Eo2uPoxJFkicsvbEnCe',
                            '社交-推荐 可以看邀请链接',
                            '银河牛牛放置QQ群号：一群(已满) 482088950，二群 1033341911 。进群发送“牛牛手册”获得大佬手写的多篇攻略！两个群只用加一个哦，机器人是两边都有的。',
                            '【银河奶牛放置】欢迎来到中文频道！您可以加QQ群482088950，在群内输入“牛牛手册”获取游戏插件、攻略以及各种自助服务',
                            '公会没有任何加成，暂时也没有计划增加公会增益，目前仅供聊天和冲排行榜',
                            '法师35级前没有副手',
                            '背部装备只有后期才有',
                            '🔥《银河牛牛放置》震撼公测！爆率玄学堪比老板画饼，强化失败自动播放《大悲咒》助你顿悟！点击就送【996福报】，群号482088950，群内基佬南娘过多，需要帮助请发送牛牛手册',
                            '新手不用纠结玩什么，职业强度都是你挂机一年后才能体会到的东西。到时候都变天了，喜欢玩什么玩什么。',
                            '牛牛新手路线图https://pic1.imgdb.cn/item/67d0325a066befcec6e358fd.png',
                            '战斗装备得有4000M左右，收益才能和生活持平。',
                            '技能是释放顺序是从左到右，0cd的要放在右边',
                            '先看游戏指南，再看牛牛手册，然后加群沉淀一个月以上，再来问战斗怎么玩。新手前期不推荐战斗。有任务就换或者删了',
                            '初始100牛铃买队列+离线时间，其他看个人需求： 懒得上线的买离线时间 需要市场挂单的买挂单上限 需要多种动作的开队列 懒得手动换装的买配装槽 要围任务的买任务槽 喜欢外观的买图标名称颜色头像装扮',
                            '火车是某位热心群友（ID：Crazytrain），使用快报命令呼唤“火车报价单”，报价单的价格相对公允，依照报价单在牛牛市场发布买单/卖单，等待市场其他玩家达成交易。'
                           ];
    // 初始化配置
    let config = {
        phrases: GM_getValue('phrases', defaultPhrases),
        position: GM_getValue('position', { x: 30, y: 30 })
    };

    // 创建UI样式
    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
                    /* 新增按钮效果 */
            .mwc-save-btn {
                background: #4f46e5;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .mwc-save-btn:hover {
                background: #4338ca !important;
                transform: translateY(-1px);
            }
            .mwc-save-btn:active {
                transform: translateY(1px) scale(0.98);
            }

            .mwc-cancel-btn {
                background: #f3f4f6;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .mwc-cancel-btn:hover {
                background: #e5e7eb !important;
                transform: translateY(-1px);
            }
            .mwc-cancel-btn:active {
                transform: translateY(1px) scale(0.98);
            }
            .mwc-reset-btn {
                background: #ef4444 !important; /* 添加基础红色 */
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .mwc-reset-btn:hover {
                background: #dc2626 !important;
                transform: translateY(-1px);
            }
            .mwc-reset-btn:active {
                background: #b91c1c !important;
                transform: translateY(1px) scale(0.98);
            }
            .mwc-container {
                position: fixed;
                z-index: 99999;
                transform: translate(-50%, -50%);
            }
            .mwc-menu {
                position: absolute;
                left: 60px;
                top: 0;
                background: rgba(255,255,255,0.95);
                border-radius: 12px;
                padding: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                backdrop-filter: blur(8px);
                min-width: 240px;
                max-height: 60vh;
                overflow-y: auto;
                display: none;
            }

            .mwc-menu-item {
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                color: #374151;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
            }

            /* 交替背景色 */
            .mwc-menu-item:nth-child(even) {
                background: #f1f5f9;
            }

            .mwc-menu-item:hover {
                background: rgba(99,102,241,0.1) !important; /* 保持悬停效果 */
                transform: translateX(4px);
            }

            .mwc-main-btn {
                width: 48px;
                height: 48px;
                border-radius: 24px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                cursor: move;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                transition: all 0.3s, background 0.5s ease;
            }

            .mwc-main-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            }

            .mwc-config {
                background: white;
                padding: 15px; /* 减小内边距 */
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 100000;
                display: none;
                width: 400px;
                max-height: 70vh;
                overflow-y: auto;
            }

            .mwc-config-item {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-bottom: 12px;
            }

            .mwc-config-input {
                flex: 1;
                padding: 8px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
            }

            .mwc-add-btn {
                width: 100%;
                padding: 8px;
                background: #f3f4f6;
                border: 1px dashed #d1d5db;
                border-radius: 8px;
                cursor: pointer;
                color: #6b7280;
                margin-bottom: 16px;
            }

            .mwc-add-btn:hover {
                background: #e5e7eb;
            }

            .mwc-delete-btn {
                color: #ef4444;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }

            .mwc-delete-btn:hover {
                background: #fee2e2;
            }

            .mwc-toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                display: none;
                animation: slideIn 0.3s;
            }
            #mwc-phrases-container {
                max-height: 50vh; /* 短语列表容器高度限制 */
                overflow-y: auto; /* 添加嵌套滚动条 */
                margin-bottom: 10px;
                padding-right: 8px; /* 防止滚动条遮挡内容 */
            }
            @keyframes slideIn {
                from { bottom: -50px }
                to { bottom: 20px }
            }
        `;
        document.head.appendChild(style);
    };

    // 创建配置面板
    const createConfigPanel = (menu) => {
        const panel = document.createElement('div');
        panel.className = 'mwc-config';
        panel.addEventListener('click', e => e.stopPropagation());

        panel.innerHTML = `
        <h3 style="margin:0 0 16px;color:#1f2937">短语管理</h3>
        <div id="mwc-phrases-container"></div>
        <button class="mwc-add-btn">+ 添加新短语</button>
        <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
            <button class="mwc-save-btn" style="flex:1;padding:8px;color:white;border:none;border-radius:8px">保存</button>
            <button class="mwc-cancel-btn" style="flex:1;padding:8px;border:none;border-radius:8px">取消</button>
            <button class="mwc-reset-btn" style="padding:8px 20px;color:white;border:none;border-radius:8px">重置</button>
        </div>
        `;
        const phrasesContainer = panel.querySelector('#mwc-phrases-container');
        const addBtn = panel.querySelector('.mwc-add-btn');

        // 添加新短语
        addBtn.addEventListener('click', () => {
            const item = document.createElement('div');
            item.className = 'mwc-config-item';
            item.innerHTML = `
                <input class="mwc-config-input" placeholder="输入新短语">
                <div class="mwc-delete-btn">🗑️</div>
            `;
            phrasesContainer.appendChild(item);
        });
        panel.querySelector('.mwc-cancel-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        phrasesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('mwc-delete-btn')) {
                e.stopPropagation(); // 阻止事件冒泡
                e.target.closest('.mwc-config-item').remove();
            }
        });
        panel.querySelector('button:first-child').addEventListener('click', () => {
            const inputs = phrasesContainer.querySelectorAll('.mwc-config-input');
            config.phrases = Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
            GM_setValue('phrases', config.phrases);
            updatePhrases(menu);
            panel.style.display = 'none';
            showToast('✅ 配置已保存');
        });
        // 取消
        panel.querySelector('button:last-child').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        panel.querySelector('.mwc-reset-btn').addEventListener('click', () => {
            if (confirm('确定要恢复默认短语吗？当前所有修改将会丢失！')) {
                config.phrases = [...defaultPhrases];
                GM_setValue('phrases', config.phrases);

                const phrasesContainer = panel.querySelector('#mwc-phrases-container');
                phrasesContainer.innerHTML = '';
                config.phrases.forEach(text => {
                    const item = document.createElement('div');
                    item.className = 'mwc-config-item';
                    item.innerHTML = `
                        <input class="mwc-config-input" value="${text}">
                        <div class="mwc-delete-btn">🗑️</div>
                    `;
                    phrasesContainer.appendChild(item);
                });

                updatePhrases(menu);
                showToast('✅ 已恢复默认短语');
            }
        });

        return panel;
    };

    // 更新短语菜单
    const updatePhrases = (menu) => {
        // 先移除所有非配置按钮的菜单项
        const existingItems = menu.querySelectorAll('.mwc-menu-item:not(.mwc-config-btn)');
        existingItems.forEach(n => n.remove());

        // 添加新短语项
        config.phrases.forEach((text) => {
            const btn = document.createElement('div');
            btn.className = 'mwc-menu-item';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(text);
                showToast('✅ 复制成功');
            });
            menu.insertBefore(btn, menu.querySelector('.mwc-config-btn'));
        });
    };

    // 显示Toast提示
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'mwc-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.style.display = 'block';
        setTimeout(() => toast.remove(), 2000);
    };

    // 初始化拖拽功能
    const initDrag = (container) => {
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - container.offsetLeft;
            startY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            container.style.left = `${e.clientX - startX}px`;
            container.style.top = `${e.clientY - startY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            GM_setValue('position', {
                x: parseInt(container.style.left),
                y: parseInt(container.style.top)
            });
        });
    };

    // 主初始化函数
    const init = () => {
        createStyles();

        // 创建主界面
        const container = document.createElement('div');
        container.className = 'mwc-container';
        container.style.left = `${config.position.x}px`;
        container.style.top = `${config.position.y}px`;

        const mainBtn = document.createElement('button');
        mainBtn.className = 'mwc-main-btn';
        mainBtn.textContent = '+';
        container.appendChild(mainBtn);

        const menu = document.createElement('div');
        menu.className = 'mwc-menu';

        const configBtn = document.createElement('div');
        configBtn.className = 'mwc-menu-item mwc-config-btn'; // 添加特殊类名
        configBtn.textContent = '⚙️ 管理短语';
        menu.appendChild(configBtn);

        container.appendChild(menu);
        document.body.appendChild(container);

        // 创建配置面板
        const configPanel = createConfigPanel(menu);
        document.body.appendChild(configPanel);

        // 初始化功能
        initDrag(container);
        updatePhrases(menu);
        // 主按钮点击
        mainBtn.addEventListener('click', () => {
            const isOpen = mainBtn.textContent === '-';
            mainBtn.textContent = isOpen ? '+' : '-';
            menu.style.display = isOpen ? 'none' : 'block';

            // 新增关闭配置面板逻辑
            if (isOpen && configPanel.style.display === 'block') {
                configPanel.style.display = 'none';
            }

            // 添加颜色渐变效果
            mainBtn.style.background = isOpen
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'linear-gradient(135deg, #ef4444, #f97316)';
        });


        // 打开配置面板
        configBtn.addEventListener('click', () => {
            const phrasesContainer = configPanel.querySelector('#mwc-phrases-container');
            phrasesContainer.innerHTML = '';
            config.phrases.forEach(text => {
                const item = document.createElement('div');
                item.className = 'mwc-config-item';
                item.innerHTML = `
                    <input class="mwc-config-input" value="${text}">
                    <div class="mwc-delete-btn">🗑️</div>
                `;
                phrasesContainer.appendChild(item);
            });
            configPanel.style.display = 'block';
        });
    };

    window.addEventListener('load', init);
})();