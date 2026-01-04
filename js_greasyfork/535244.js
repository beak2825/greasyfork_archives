// ==UserScript==
// @name         MWI-Hit-Tracker-More-Animation
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  战斗过程中实时显示攻击命中目标，增加了更多的特效和玩家自定义图片弹道功能等等等（更多功能请自行探索）。（想扔什么直接上传图片就行，支持文件上传和剪贴板）
// @author       Artintel (Artintel), Yuk111
// @license MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535244/MWI-Hit-Tracker-More-Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/535244/MWI-Hit-Tracker-More-Animation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 状态变量，存储战斗相关信息
    const battleState = {
        monstersHP: [],
        monstersMP: [],
        playersHP: [],
        playersMP: []
    };

    // 存储是否已添加窗口大小改变监听器
    let isResizeListenerAdded = false;

    // 标记脚本是否暂停
    let isPaused = false;

    // 粒子对象池
    const particlePool = [];

    // 标记按钮是否已添加
    let isCustomColorButtonAdded = false;

    // 用于存储自定义弹道图片
    let customProjectileImage = null;
    // 弹道图片状态（是否启用）
    let useCustomProjectileImage = false;
    // 新增：各玩家的自定义弹道图片
    let playerProjectileImages = [null, null, null, null, null];
    // 新增：各玩家是否使用自定义弹道
    let playerUseProjectile = [false, false, false, false, false];

    // 颜色配置 - 使用单一来源的颜色定义
    const colorConfig = {
        // 定义基础颜色，这是唯一需要修改的地方
        baseColors: [
            "rgba(255, 99, 132, 1)",  // 浅粉色 - 玩家一
            "rgba(54, 162, 235, 1)",  // 浅蓝色 - 玩家二
            "rgba(255, 206, 86, 1)",  // 浅黄色 - 玩家三
            "rgba(75, 192, 192, 1)",  // 浅绿色 - 玩家四
            "rgba(153, 102, 255, 1)", // 浅紫色 - 玩家五
            "rgba(255, 0, 0, 1)"      // 红色 - 敌人攻击颜色
        ],

        // 获取线条颜色
        getLineColors() {
            return [...this.baseColors];
        },

        // 获取滤镜颜色，自动从基础颜色生成
        getFilterColors() {
            return this.baseColors.map(color => color.replace('1)', '0.8)'));
        },

        // 重置颜色数组
        resetColors(lineColorArray, filterColorArray) {
            lineColorArray.splice(0, lineColorArray.length, ...this.getLineColors());
            filterColorArray.splice(0, filterColorArray.length, ...this.getFilterColors());
        }
    };

    // 存储每个玩家的勾选状态，默认全部勾选
    const playerDrawEnabled = new Array(6).fill(true);
    // 存储特效的勾选状态，默认全勾选
    // 索引含义：0-伤害数字，1-线条绘制，2-粒子拖尾，3-击中特效，4-震动特效，5-隐藏数字，6-浮动数字
    const effectDrawEnabled = new Array(7).fill(true);
    // 设置隐藏数字默认为不勾选
    effectDrawEnabled[5] = false;

    // 定义线条颜色数组，用于不同角色的攻击线条颜色
    const lineColor = colorConfig.getLineColors();
    // 定义滤镜颜色数组，用于线条的外发光效果颜色
    const filterColor = colorConfig.getFilterColors();

    // 从 localStorage 加载保存的设置
    function readSettings() {
        const ls = localStorage.getItem("MWI_Hit_Tracker_Settings");
        if (ls) {
            try {
                const lsObj = JSON.parse(ls);
                lineColor.splice(0, lineColor.length, ...lsObj.lineColor);
                filterColor.splice(0, filterColor.length, ...lsObj.filterColor);
                playerDrawEnabled.splice(0, playerDrawEnabled.length, ...lsObj.playerDrawEnabled);
                
                // 读取自定义弹道图片设置
                if (lsObj.customProjectileImage) {
                    customProjectileImage = lsObj.customProjectileImage;
                }
                if (lsObj.useCustomProjectileImage !== undefined) {
                    useCustomProjectileImage = lsObj.useCustomProjectileImage;
                }
                
                // 读取各玩家自定义弹道图片设置
                if (lsObj.playerProjectileImages) {
                    playerProjectileImages = lsObj.playerProjectileImages;
                }
                if (lsObj.playerUseProjectile) {
                    playerUseProjectile = lsObj.playerUseProjectile;
                }
            } catch (e) {
                console.error('解析基本设置失败:', e);
                // 如果解析失败，使用colorConfig重置颜色
                colorConfig.resetColors(lineColor, filterColor);
            }
        }

        // 读取特效设置
        const effectLs = localStorage.getItem("MWI_Hit_Tracker_Effect_Settings");
        if (effectLs) {
            try {
                const effectLsObj = JSON.parse(effectLs);
                // 确保数组长度足够存储所有特效设置，包括浮动数字选项
                if (effectLsObj.effectDrawEnabled) {
                    // 如果长度不足以存储浮动数字选项，则扩展数组
                    while (effectLsObj.effectDrawEnabled.length < 7) {
                        // 对于索引5(隐藏数字)，默认为false，其他默认为true
                        const defaultValue = effectLsObj.effectDrawEnabled.length === 5 ? false : true;
                        effectLsObj.effectDrawEnabled.push(defaultValue);
                    }
                    effectDrawEnabled.splice(0, effectDrawEnabled.length, ...effectLsObj.effectDrawEnabled);
                }
                
                // 如果设置了隐藏数字，应用隐藏效果
                if (effectDrawEnabled[5]) {
                    toggleDamageNumbers(true);
                }
            } catch (e) {
                console.error('解析特效设置失败:', e);
            }
        }
    }

    // 保存设置到 localStorage
    function saveSettings() {
        const settings = {
            lineColor: lineColor,
            filterColor: filterColor,
            playerDrawEnabled: playerDrawEnabled,
            customProjectileImage: customProjectileImage,
            useCustomProjectileImage: useCustomProjectileImage,
            playerProjectileImages: playerProjectileImages,
            playerUseProjectile: playerUseProjectile
        };
        localStorage.setItem("MWI_Hit_Tracker_Settings", JSON.stringify(settings));

        // 保存特效设置
        const effectSettings = {
            effectDrawEnabled: effectDrawEnabled
        };
        localStorage.setItem("MWI_Hit_Tracker_Effect_Settings", JSON.stringify(effectSettings));
    }

    // 在初始化时加载设置
    readSettings();

    // 创建自定义颜色按钮
    /**
     * 创建自定义颜色设置按钮，用于打开设置弹出窗口，可设置玩家攻击线条颜色和显示状态。
     */
    function createCustomColorButton() {
        // 使用选择器，查找按钮的父元素
        const tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
        // 获取参考标签，如果 tabsContainer 存在，则取其第二个子元素
        const referenceTab = tabsContainer ? tabsContainer.children[1] : null;

        // 检查是否找到目标元素，如果未找到则输出提示信息并返回
        if (!tabsContainer || !referenceTab) {
            console.log('未找到目标元素，请检查选择器是否正确。');
            return;
        }
        // 检查是否已经存在自定义颜色按钮，如果存在则返回
        if (tabsContainer.querySelector('.Button_customColor__custom')) return;

        // 创建自定义颜色设置按钮
        const customColorButton = document.createElement('button');
        // 为按钮设置自定义类名
        customColorButton.className = 'Button_customColor__custom css-1q2h7u5';
        // 设置按钮的显示文本
        customColorButton.textContent = 'Hit自定义';

        // 获取标签容器中的最后一个标签
        const lastTab = tabsContainer.children[tabsContainer.children.length - 1];

        // 遍历标签容器中的所有标签，检查是否存在文本内容为"商品列表"的标签，如果存在则返回
        for (let i = 0; i < tabsContainer.children.length; i++) {
            if (tabsContainer.children[i].textContent === "商品列表") {
                return;
            }
        }

        // 将自定义颜色设置按钮插入到最后一个标签之后
        lastTab.insertAdjacentElement('afterend', customColorButton);

        // 创建样式元素，用于设置按钮和弹出窗口相关的样式
        const style = document.createElement('style');
        // 设置样式内容
        style.innerHTML = `
            .Button_customColor__custom {
                background-color: #546ddb;
                color: white;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .Button_customColor__custom:hover {
                background-color: #131419;
            }
            .expandable-section {
                cursor: pointer;
                padding: 10px;
                background-color: #e0e0e0;
                margin-bottom: 10px;
                border-radius: 5px;
            }
            .expandable-content {
                display: none;
                padding-left: 20px;
            }
            .expandable-content.show {
                display: block;
            }
            .draggable {
                cursor: move;
            }
            .inner-expandable-section {
                transition: background-color 0.3s;
            }
            .inner-expandable-section:hover {
                background-color: #d8d8d8;
            }
            .param-slider-container {
                margin-bottom: 12px;
            }
            input[type="range"] {
                height: 5px;
                border-radius: 5px;
                background: #d3d3d3;
                outline: none;
            }
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #546ddb;
                cursor: pointer;
            }
        `;
        // 将样式元素添加到文档头部
        document.head.appendChild(style);

        // 为自定义颜色设置按钮添加点击事件监听器
        customColorButton.addEventListener('click', () => {
            // 检查文档中是否已存在类名为 "自定义菜单" 的元素，如果有则销毁它
            const customMenu = document.querySelector('.自定义菜单');
            const customMask = document.querySelector('.自定义菜单遮罩');
            if (customMenu) {
                if (customMask) document.body.removeChild(customMask);
                document.body.removeChild(customMenu);
                return;
            }

            // ===== 新增：创建遮罩层 =====
            const mask = document.createElement('div');
            mask.className = '自定义菜单遮罩';
            mask.style.position = 'fixed';
            mask.style.top = '0';
            mask.style.left = '0';
            mask.style.width = '100vw';
            mask.style.height = '100vh';
            mask.style.background = 'rgba(0,0,0,0)'; // 完全透明
            mask.style.zIndex = '9998';
            document.body.appendChild(mask);

            // 创建弹出窗口元素并添加类名 "自定义菜单"
            const popup = document.createElement('div');
            popup.classList.add('自定义菜单');
            // 设置弹出窗口的定位方式为固定定位
            popup.style.position = 'fixed';
            
            // 添加响应式样式，使菜单适应不同设备
            popup.style.maxWidth = '80vw'; // 最大宽度不超过视口宽度的80%
            popup.style.maxHeight = '80vh'; // 最大高度不超过视口高度的80%
            popup.style.width = 'min(350px, 80vw)'; // 宽度取350px和80vw中的较小值
            popup.style.overflowY = 'auto'; // 内容过多时可滚动
            popup.style.overflowX = 'hidden'; // 防止水平方向滚动
            
            // 动态计算居中位置，考虑视口尺寸
            const positionMenu = () => {
                const menuWidth = Math.min(350, window.innerWidth * 0.8); // 计算实际宽度
                const menuHeight = Math.min(popup.scrollHeight, window.innerHeight * 0.8); // 计算实际高度
                popup.style.left = `calc(50% - ${menuWidth/2}px)`;
                popup.style.top = `calc(50% - ${menuHeight/2}px)`;
                
                // 从本地存储读取之前保存的位置
                const savedPos = localStorage.getItem('MWI_Hit_Tracker_Menu_Pos');
                if (savedPos) {
                    try {
                        const pos = JSON.parse(savedPos);
                        // 确保位置合理，不超出屏幕
                        const maxLeft = window.innerWidth - menuWidth;
                        const maxTop = window.innerHeight - menuHeight;
                        if (pos.left >= 0 && pos.left <= maxLeft && 
                            pos.top >= 0 && pos.top <= maxTop) {
                            popup.style.left = `${pos.left}px`;
                            popup.style.top = `${pos.top}px`;
                        }
                    } catch (e) {
                        console.error('解析菜单位置失败:', e);
                    }
                }
            };
            
            // 设置弹出窗口的背景颜色
            popup.style.backgroundColor = '#f9f9f9';
            // 设置弹出窗口的内边距
            popup.style.padding = '30px';
            // 设置弹出窗口的边框样式
            popup.style.border = '2px solid #ddd';
            // 设置弹出窗口的边框圆角
            popup.style.borderRadius = '10px';
            // 设置弹出窗口的阴影效果
            popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            // 设置弹出窗口的层级，确保其显示在最上层
            popup.style.zIndex = '9999';

            // ====== 菜单标题（风格与 MWI-Hit-Tracker-More-Animation.js 一致）======
            const titleBar = document.createElement('div');
            titleBar.style.position = 'absolute';
            titleBar.style.top = '0';
            titleBar.style.left = '0';
            titleBar.style.right = '0';
            titleBar.style.height = '36px';
            titleBar.style.backgroundColor = '#546ddb';
            titleBar.style.borderTopLeftRadius = '8px';
            titleBar.style.borderTopRightRadius = '8px';
            titleBar.style.cursor = 'move';
            titleBar.style.userSelect = 'none';
            titleBar.style.display = 'flex';
            titleBar.style.alignItems = 'center';
            titleBar.style.justifyContent = 'center';
            titleBar.style.padding = '0 10px';
            titleBar.style.color = 'white';
            titleBar.style.fontWeight = 'bold';
            titleBar.style.fontSize = '20px';
            titleBar.textContent = customColorButton.textContent;

            // 调整弹出窗口的内边距，为标题栏留出空间
            popup.style.paddingTop = '46px';

            // 将标题栏添加到弹出窗口
            popup.insertBefore(titleBar, popup.firstChild);

            // 修改窗口拖动处理逻辑，确保在移动设备上也能正常工作
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            // 判断是否为可拖动区域（标题栏或背景）
            function isDraggableArea(target) {
                // 标题栏或弹窗本身允许拖动
                if (target === titleBar || target.closest('.expandable-section') || target === popup) return true;
                // 交互元素禁止拖动
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'BUTTON' || tag === 'SELECT' || tag === 'LABEL') return false;
                // 滑块等自定义控件可加 class 判断
                if (target.classList.contains('no-drag')) return false;
                return true;
            }

            // 鼠标按下事件
            popup.addEventListener('mousedown', (e) => {
                if (!isDraggableArea(e.target)) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = popup.offsetLeft;
                initialTop = popup.offsetTop;
                document.body.style.userSelect = 'none';
            });

            // 鼠标移动事件
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    let newLeft = initialLeft + dx;
                    let newTop = initialTop + dy;
                    // 限制不超出窗口
                    const maxLeft = window.innerWidth - popup.offsetWidth;
                    const maxTop = window.innerHeight - popup.offsetHeight;
                    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                    newTop = Math.max(0, Math.min(newTop, maxTop));
                    popup.style.left = newLeft + 'px';
                    popup.style.top = newTop + 'px';
                }
            });

            // 鼠标释放事件
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.userSelect = '';
                    // 保存当前位置
                    localStorage.setItem('MWI_Hit_Tracker_Menu_Pos', JSON.stringify({
                        left: popup.offsetLeft,
                        top: popup.offsetTop
                    }));
                }
            });

            // 鼠标离开窗口也结束拖动
            document.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.userSelect = '';
                    localStorage.setItem('MWI_Hit_Tracker_Menu_Pos', JSON.stringify({
                        left: popup.offsetLeft,
                        top: popup.offsetTop
                    }));
                }
            });

            // 添加窗口大小改变监听器，确保菜单不超出屏幕
            window.addEventListener('resize', () => {
                if (popup.parentNode) {
                    // 重新计算位置
                    const maxLeft = window.innerWidth - popup.offsetWidth;
                    const maxTop = window.innerHeight - popup.offsetHeight;
                    let newLeft = popup.offsetLeft;
                    let newTop = popup.offsetTop;
                    // 如果菜单超出屏幕，调整位置
                    if (newLeft > maxLeft) newLeft = maxLeft;
                    if (newTop > maxTop) newTop = maxTop;
                    popup.style.left = `${newLeft}px`;
                    popup.style.top = `${newTop}px`;
                }
            });

            // 在DOM添加后调整位置
            setTimeout(positionMenu, 0);

            // 封装创建可展开部分的函数
            function createExpandableSection(title, contentGenerator = null) {
                // 创建可展开区域元素
                const expandableSection = document.createElement('div');
                // 为可展开区域元素设置类名
                expandableSection.className = 'expandable-section draggable';
                // 初始化展开状态为未展开
                let isExpanded = false;

                // 根据展开状态设置可展开区域的显示文本
                function updateExpandableSectionText() {
                    expandableSection.textContent = isExpanded ? `${title}          ▼` : `${title}           ▶`;
                }

                // 初始设置文本
                updateExpandableSectionText();

                // 创建可展开内容元素
                const expandableContent = document.createElement('div');
                // 为可展开内容元素设置类名
                expandableContent.className = 'expandable-content';

                // 如果有内容生成函数，则调用该函数生成内容
                if (contentGenerator) {
                    contentGenerator(expandableContent);
                }

                // 修改点击事件监听器，更新展开状态并更新文本，同时切换可展开内容的显示状态
                expandableSection.addEventListener('click', () => {
                    isExpanded = !isExpanded;
                    expandableContent.classList.toggle('show');
                    updateExpandableSectionText();
                });

                return { expandableSection, expandableContent };
            }

            // 生成玩家和颜色部分内容的函数
            function generatePlayerColorContent(expandableContent) {
                // 定义玩家名称数组，明确表示只控制线条绘制
                const players = ['玩家一线条', '玩家二线条', '玩家三线条', '玩家四线条', '玩家五线条', '敌人线条'];

                // 封装创建勾选框和标签的通用函数
                function createCheckboxAndLabel(container, labelText, checked, changeHandler) {
                    // 创建勾选框元素
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = checked;
                    checkbox.addEventListener('change', changeHandler);
                    container.appendChild(checkbox);

                    // 创建标签元素
                    const label = document.createElement('span');
                    label.textContent = labelText;
                    label.style.flex = '1';
                    label.style.fontSize = '14px';
                    label.style.marginLeft = '10px';
                    container.appendChild(label);
                }

                // 遍历玩家名称数组，为每个玩家创建颜色选择器和预览
                players.forEach((player, index) => {
                    // 创建容器元素，用于包裹勾选框、标签、颜色选择器和预览
                    const container = document.createElement('div');
                    container.style.marginBottom = '15px';
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';

                    // 创建勾选框和标签
                    createCheckboxAndLabel(container, `${player}: `, playerDrawEnabled[index], (e) => {
                        playerDrawEnabled[index] = e.target.checked;
                        
                        // 保存设置，但不影响自定义弹道勾选框状态
                        saveSettings();
                    });

                    // 创建颜色选择器元素
                    const colorInput = document.createElement('input');
                    colorInput.type = 'color';
                    colorInput.value = lineColor[index];
                    colorInput.addEventListener('input', (e) => {
                        if (playerDrawEnabled[index]) {
                            lineColor[index] = e.target.value;
                            filterColor[index] = e.target.value.replace('1)', '0.8)');
                            saveSettings(); // 保存设置
                        }
                    });
                    colorInput.style.marginRight = '10px';

                    // 创建颜色预览元素
                    const preview = document.createElement('div');
                    preview.style.width = '30px';
                    preview.style.height = '30px';
                    preview.style.border = '1px solid #ccc';
                    preview.style.borderRadius = '4px';
                    preview.style.backgroundColor = lineColor[index];
                    colorInput.addEventListener('input', (e) => {
                        preview.style.backgroundColor = e.target.value;
                    });

                    // 将颜色选择器和预览元素添加到容器元素中
                    container.appendChild(colorInput);
                    container.appendChild(preview);

                    // 将容器元素添加到可展开内容元素中
                    expandableContent.appendChild(container);
                    
                    // 不为"敌人"创建自定义弹道选项
                    if (index < 5) {
                        // 创建自定义弹道图片控制区域
                        const projectileContainer = document.createElement('div');
                        projectileContainer.style.marginBottom = '15px';
                        projectileContainer.style.display = 'flex';
                        projectileContainer.style.alignItems = 'center';
                        projectileContainer.style.marginLeft = '30px'; // 缩进以表示从属关系
                        projectileContainer.style.padding = '6px 8px';
                        projectileContainer.style.borderRadius = '6px';
                        projectileContainer.style.transition = 'background-color 0.2s ease';
                        
                        // 添加粘贴事件监听，允许直接粘贴图片
                        projectileContainer.setAttribute('tabindex', '0'); // 使容器可以获取焦点
                        projectileContainer.style.outline = 'none'; // 去除获取焦点时的轮廓
                        
                        // 添加提示获取焦点的样式
                        projectileContainer.addEventListener('mouseenter', () => {
                            projectileContainer.style.backgroundColor = 'rgba(84, 109, 219, 0.1)';
                            // 添加提示边框
                            projectileContainer.style.border = '1px dashed rgba(84, 109, 219, 0.5)';
                            // 设置光标为可点击状态
                            projectileContainer.style.cursor = 'pointer';
                        });
                        
                        projectileContainer.addEventListener('mouseleave', () => {
                            projectileContainer.style.backgroundColor = 'transparent';
                            // 移除边框
                            projectileContainer.style.border = '1px solid transparent';
                            // 恢复默认光标
                            projectileContainer.style.cursor = 'default';
                        });
                        
                        // 获取焦点时的特效
                        projectileContainer.addEventListener('focus', () => {
                            projectileContainer.style.backgroundColor = 'rgba(84, 109, 219, 0.15)';
                            projectileContainer.style.border = '1px dashed rgba(84, 109, 219, 0.7)';
                        });
                        
                        projectileContainer.addEventListener('blur', () => {
                            projectileContainer.style.backgroundColor = 'transparent';
                            projectileContainer.style.border = '1px solid transparent';
                        });
                        
                        // 点击容器自动获取焦点
                        projectileContainer.addEventListener('click', (e) => {
                            // 只有当点击的不是按钮和勾选框时才设置焦点
                            if (e.target === projectileContainer || e.target === pasteHint || 
                                e.target.tagName.toLowerCase() === 'span') {
                                projectileContainer.focus();
                            }
                        });
                        
                        // 添加粘贴事件处理
                        projectileContainer.addEventListener('paste', (e) => {
                            // 检查剪贴板是否包含图片
                            const items = e.clipboardData.items;
                            let imageFile = null;
                            
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].type.indexOf('image') !== -1) {
                                    imageFile = items[i].getAsFile();
                                    break;
                                }
                            }
                            
                            if (imageFile) {
                                e.preventDefault(); // 阻止默认粘贴行为
                                // 高亮容器表示成功粘贴
                                const originalBg = projectileContainer.style.backgroundColor;
                                projectileContainer.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
                                projectileContainer.style.border = '1px solid rgba(75, 192, 192, 0.5)';
                                
                                // 处理图片
                                processPlayerImage(imageFile, index, imagePreview, null);
                                
                                // 设置定时器，恢复原始颜色
                                setTimeout(() => {
                                    projectileContainer.style.backgroundColor = originalBg;
                                    projectileContainer.style.border = '1px solid transparent';
                                }, 1000);
                            }
                        });
                        
                        // 创建自定义弹道勾选框
                        let projectileCheckbox = null;
                        if (customProjectileImage || playerProjectileImages[index]) {
                            projectileCheckbox = document.createElement('input');
                            projectileCheckbox.type = 'checkbox';
                            projectileCheckbox.checked = playerUseProjectile[index];
                            // 移除禁用逻辑，让自定义弹道勾选框始终可用
                            // projectileCheckbox.disabled = !playerDrawEnabled[index];
                            
                            projectileCheckbox.addEventListener('change', (e) => {
                                playerUseProjectile[index] = e.target.checked;
                                saveSettings();
                            });
                            
                            projectileContainer.appendChild(projectileCheckbox);
                            
                            // 创建标签
                            const projectileLabel = document.createElement('span');
                            projectileLabel.textContent = '使用自定义弹道';
                            projectileLabel.style.flex = '1';
                            projectileLabel.style.fontSize = '14px';
                            projectileLabel.style.marginLeft = '10px';
                            projectileContainer.appendChild(projectileLabel);
                            
                            // 将类名添加到勾选框便于引用
                            projectileCheckbox.classList.add('使用自定义弹道');
                            
                            // 创建图片预览区域
                            const imagePreview = document.createElement('div');
                            imagePreview.style.width = '28px';
                            imagePreview.style.height = '28px';
                            imagePreview.style.border = '1px solid #ccc';
                            imagePreview.style.borderRadius = '4px';
                            imagePreview.style.overflow = 'hidden';
                            imagePreview.style.display = 'flex';
                            imagePreview.style.alignItems = 'center';
                            imagePreview.style.justifyContent = 'center';
                            imagePreview.style.marginLeft = '10px';
                            imagePreview.style.backgroundColor = '#f8f8f8';
                            imagePreview.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            imagePreview.style.position = 'relative'; // 为悬停提示添加
                            
                            // 判断使用哪个图片
                            const imageUrl = playerProjectileImages[index] || customProjectileImage;
                            
                            if (imageUrl) {
                                // 创建图片元素
                                const img = document.createElement('img');
                                img.src = imageUrl;
                                img.style.maxWidth = '100%';
                                img.style.maxHeight = '100%';
                                
                                imagePreview.appendChild(img);
                            } else {
                                // 如果没有图片，显示提示文本
                                const placeholderText = document.createElement('span');
                                placeholderText.textContent = '?';
                                placeholderText.style.color = '#aaa';
                                placeholderText.style.fontSize = '14px';
                                placeholderText.style.fontWeight = 'bold';
                                
                                imagePreview.appendChild(placeholderText);
                                
                                // 添加悬停提示
                                imagePreview.title = '点击右侧按钮上传图片或粘贴图片';
                            }
                            
                            // 添加图片预览悬停效果
                            imagePreview.addEventListener('mouseenter', () => {
                                imagePreview.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                                imagePreview.style.borderColor = '#546ddb';
                            });
                            
                            imagePreview.addEventListener('mouseleave', () => {
                                imagePreview.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                imagePreview.style.borderColor = '#ccc';
                            });
                            
                            projectileContainer.appendChild(imagePreview);
                            
                            // 创建按钮组容器
                            const buttonGroup = document.createElement('div');
                            buttonGroup.style.display = 'flex';
                            buttonGroup.style.marginLeft = '8px';
                            
                            // 设置按钮样式的通用函数
                            const styleButton = (btn, text, tooltip) => {
                                btn.textContent = text;
                                btn.title = tooltip;
                                btn.style.width = '28px';
                                btn.style.height = '28px';
                                btn.style.padding = '0';
                                btn.style.backgroundColor = '#546ddb';
                                btn.style.color = 'white';
                                btn.style.border = 'none';
                                btn.style.borderRadius = '4px';
                                btn.style.cursor = 'pointer';
                                btn.style.fontSize = '12px';
                                btn.style.fontWeight = 'bold';
                                btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
                                btn.style.transition = 'all 0.2s ease';
                                
                                // 添加悬停效果
                                btn.addEventListener('mouseenter', () => {
                                    btn.style.backgroundColor = '#4056a1';
                                    btn.style.transform = 'translateY(-1px)';
                                    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                                });
                                
                                btn.addEventListener('mouseleave', () => {
                                    btn.style.backgroundColor = '#546ddb';
                                    btn.style.transform = 'translateY(0)';
                                    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
                                });
                                
                                // 添加点击效果
                                btn.addEventListener('mousedown', () => {
                                    btn.style.transform = 'translateY(1px)';
                                    btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
                                });
                                
                                btn.addEventListener('mouseup', () => {
                                    btn.style.transform = 'translateY(-1px)';
                                    btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
                                });
                                
                                return btn;
                            };
                            
                            // 添加上传专属图片按钮
                            const uploadButton = styleButton(
                                document.createElement('button'),
                                '+',
                                '为该玩家上传专属图片'
                            );
                            
                            uploadButton.addEventListener('click', () => {
                                // 打开图片上传器，不自动修改勾选框状态
                                openPlayerImageUploader(index, imagePreview, null);
                            });
                            
                            buttonGroup.appendChild(uploadButton);
                            
                            // 添加从剪贴板获取图片的按钮
                            const clipboardButton = styleButton(
                                document.createElement('button'),
                                '剪',
                                '从剪贴板获取图片'
                            );
                            clipboardButton.style.marginLeft = '5px';
                            
                            clipboardButton.addEventListener('click', async () => {
                                try {
                                    // 检查是否支持剪贴板API
                                    if (!navigator.clipboard || !navigator.clipboard.read) {
                                        alert('您的浏览器不支持直接访问剪贴板。请使用上传按钮或Ctrl+V粘贴图片。');
                                        return;
                                    }
                                    
                                    // 获取剪贴板内容
                                    const clipboardItems = await navigator.clipboard.read();
                                    let imageFound = false;
                                    
                                    for (const clipboardItem of clipboardItems) {
                                        // 检查剪贴板是否包含图片
                                        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                                        if (imageTypes.length > 0) {
                                            // 获取图片的Blob
                                            const imageBlob = await clipboardItem.getType(imageTypes[0]);
                                            // 处理图片
                                            processPlayerImage(imageBlob, index, imagePreview, null);
                                            imageFound = true;
                                            break;
                                        }
                                    }
                                    
                                    if (!imageFound) {
                                        alert('剪贴板中未找到图片。请复制一张图片后重试。');
                                    }
                                } catch (err) {
                                    console.error('获取剪贴板内容失败:', err);
                                    alert('获取剪贴板内容失败。请尝试使用上传按钮。');
                                }
                            });
                            
                            buttonGroup.appendChild(clipboardButton);
                            projectileContainer.appendChild(buttonGroup);

                        }
                        
                        expandableContent.appendChild(projectileContainer);
                    }
                });
                
                // 添加重置按钮
                const resetButton = document.createElement('button');
                resetButton.textContent = '重置为默认颜色';
                resetButton.style.marginTop = '15px';
                resetButton.style.padding = '5px 10px';
                resetButton.style.backgroundColor = '#546ddb';
                resetButton.style.color = 'white';
                resetButton.style.border = 'none';
                resetButton.style.borderRadius = '4px';
                resetButton.style.cursor = 'pointer';

                resetButton.addEventListener('click', () => {
                    // 使用colorConfig重置颜色数组，只重置颜色相关的设置
                    colorConfig.resetColors(lineColor, filterColor);

                    // 重置玩家显示状态数组，全部设置为勾选状态
                    playerDrawEnabled.fill(true);
                    
                    // 保存重置后的设置
                    saveSettings();

                    // 更新颜色选择器和预览
                    // 获取玩家和颜色可展开内容中的所有颜色选择器元素
                    const colorInputs = expandableContent.querySelectorAll('input[type="color"]');
                    // 获取玩家和颜色可展开内容中的所有颜色预览元素
                    const previews = expandableContent.querySelectorAll('div:last-child');
                    // 遍历颜色选择器和预览元素，更新其值和背景颜色
                    colorInputs.forEach((input, index) => {
                        input.value = lineColor[index];
                        previews[index].style.backgroundColor = lineColor[index];
                    });

                    // 更新玩家勾选框状态
                    const playerCheckboxes = expandableContent.querySelectorAll('input[type="checkbox"]:not(.使用自定义弹道)');
                    playerCheckboxes.forEach(checkbox => {
                        checkbox.checked = true;
                    });
                });

                expandableContent.appendChild(resetButton);
            }

            // 生成特效自定义部分内容的函数
            function generateEffectCustomContent(expandableContent) {
                // 封装创建勾选框和标签的通用函数
                function createCheckboxAndLabel(container, labelText, checked, changeHandler) {
                    // 创建勾选框元素
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = checked;
                    checkbox.addEventListener('change', changeHandler);
                    container.appendChild(checkbox);

                    // 创建标签元素
                    const label = document.createElement('span');
                    label.textContent = labelText;
                    label.style.flex = '1';
                    label.style.fontSize = '14px';
                    label.style.marginLeft = '10px';
                    container.appendChild(label);
                }

                // 创建特效勾选框的函数
                function createEffectCheckbox(effectName, index) {
                    const container = document.createElement('div');
                    container.style.marginBottom = '15px';
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';

                    // 创建勾选框和标签
                    createCheckboxAndLabel(container, effectName, effectDrawEnabled[index], (e) => {
                        effectDrawEnabled[index] = e.target.checked;
                        saveSettings(); // 保存设置

                        // 同步更新参数菜单中的特效显示状态
                        updateEffectParamSection(index, e.target.checked);
                        
                        // 如果是隐藏数字选项，立即应用隐藏/显示效果
                        if (index === 5) {
                            toggleDamageNumbers(e.target.checked);
                        }
                    });

                    return container;
                }

                // 更新参数菜单中特效显示状态的函数
                function updateEffectParamSection(effectIndex, isEnabled) {
                    // 获取参数菜单的展开内容
                    const paramMenuContainer = document.querySelector('.自定义菜单');
                    if (!paramMenuContainer) return;
                    
                    // 找到特效参数面板，查找在所有可展开内容中
                    const paramSections = paramMenuContainer.querySelectorAll('.expandable-content');
                    let effectParamsContent = null;
                    
                    // 遍历找到特效参数的内容区域
                    paramSections.forEach(section => {
                        // 寻找包含"特效参数"标题的展开区
                        const sectionHeader = section.previousElementSibling;
                        if (sectionHeader && sectionHeader.textContent.includes('特效参数')) {
                            effectParamsContent = section;
                        }
                    });
                    
                    if (!effectParamsContent) return;
                    
                    // 映射effectIndex到效果名称
                    const effectNames = {
                        0: '伤害数字',
                        1: '路径绘制',
                        2: '粒子拖尾',
                        3: '击中特效',
                        4: '震动',
                        5: '隐藏数字区域',
                        6: '浮动数字'
                    };
                    
                    const effectName = effectNames[effectIndex];
                    if (!effectName) return;
                    
                    // 查找对应的参数区域
                    const allParamSections = effectParamsContent.querySelectorAll('.inner-expandable-section');
                    let targetSection = null;
                    
                    allParamSections.forEach(section => {
                        const titleElement = section.querySelector('span');
                        if (titleElement && titleElement.textContent === `${effectName}参数`) {
                            targetSection = section;
                        }
                    });
                    
                    // 如果找到了目标区域
                    if (targetSection) {
                        if (isEnabled) {
                            // 如果启用特效，显示参数区域
                            targetSection.style.display = 'block';
                        } else {
                            // 如果禁用特效，隐藏参数区域
                            targetSection.style.display = 'none';
                        }
                    } else if (isEnabled) {
                        // 如果启用了特效但没找到对应的参数区域，可能需要重新生成整个参数菜单
                        // 清空并重新生成参数菜单内容
                        effectParamsContent.innerHTML = '';
                        generateEffectParamsContent(effectParamsContent);
                    }
                }

                // 创建两列布局容器
                const columnContainer = document.createElement('div');
                columnContainer.style.display = 'flex';
                columnContainer.style.flexWrap = 'wrap';
                columnContainer.style.gap = '10px';
                
                // 创建左列和右列
                const leftColumn = document.createElement('div');
                leftColumn.style.flex = '1';
                leftColumn.style.minWidth = '120px';
                
                const rightColumn = document.createElement('div');
                rightColumn.style.flex = '1';
                rightColumn.style.minWidth = '120px';
                
                // 创建线条绘制特效勾选框
                const lineDrawContainer = createEffectCheckbox('路径绘制', 1);
                leftColumn.appendChild(lineDrawContainer);

                // 创建伤害数字特效勾选框
                const damageNumberContainer = createEffectCheckbox('伤害数字', 0);
                leftColumn.appendChild(damageNumberContainer);

                // 创建粒子拖尾特效勾选框（作为伤害数字的子菜单）
                const particleTrailContainer = createEffectCheckbox('粒子拖尾', 2);
                particleTrailContainer.style.marginLeft = '20px'; // 缩进，表示是子菜单
                leftColumn.appendChild(particleTrailContainer);

                // 创建击中特效勾选框
                const hitEffectContainer = createEffectCheckbox('击中特效', 3);
                leftColumn.appendChild(hitEffectContainer);
                
                // 创建浮动数字勾选框
                const floatingNumberContainer = createEffectCheckbox('浮动数字', 6);
                rightColumn.appendChild(floatingNumberContainer);
                
                // 创建震动特效勾选框
                const shakeEffectContainer = createEffectCheckbox('震动', 4);
                rightColumn.appendChild(shakeEffectContainer);

                // 创建隐藏数字勾选框
                const hideDamageContainer = createEffectCheckbox('隐藏数字区域', 5);
                rightColumn.appendChild(hideDamageContainer);
                
                // 添加列到容器
                columnContainer.appendChild(leftColumn);
                columnContainer.appendChild(rightColumn);
                
                // 将列容器添加到主容器
                expandableContent.appendChild(columnContainer);
            }

            // 生成特效参数自定义部分内容的函数
            function generateEffectParamsContent(expandableContent) {
                // 定义特效参数配置
                const effectParams = {
                    '路径绘制': {
                        enabled: effectDrawEnabled[1],
                        params: [
                            { name: '显示时间(ms)', id: 'lineDuration', min: 100, max: 3000, value: 1000, step: 100 },
                            { name: '随机弯曲方向', id: 'randomCurve', type: 'checkbox', value: true },
                            { name: '最小弯曲程度', id: 'minCurveIntensity', min: 1, max: 15, value: 3, step: 0.5 },
                            { name: '最大弯曲程度', id: 'maxCurveIntensity', min: 0.5, max: 10, value: 7, step: 0.5 }
                        ]
                    },
                    '击中特效': {
                        enabled: effectDrawEnabled[3],
                        params: [
                            { name: '粒子数量', id: 'particleCount', min: 5, max: 50, value: 20, step: 1 },
                            { name: '粒子半径', id: 'particleRadius', min: 1, max: 5, value: 2, step: 0.5 },
                            { name: '最大距离', id: 'maxDistance', min: 5, max: 40, value: 20, step: 1 },
                            { name: '批次数量', id: 'batchCount', min: 1, max: 8, value: 4, step: 1 }
                        ]
                    },
                    '粒子拖尾': {
                        enabled: effectDrawEnabled[2],
                        params: [
                            { name: '粒子数量', id: 'trailParticleCount', min: 3, max: 20, value: 6, step: 1 },
                            { name: '持续时间(ms)', id: 'trailDuration', min: 100, max: 1000, value: 500, step: 50 },
                            { name: '扩散范围', id: 'trailSpreadRange', min: 5, max: 30, value: 8, step: 1 }
                        ]
                    },
                    '伤害数字': {
                        enabled: effectDrawEnabled[0],
                        params: [
                            { name: '显示时间(ms)', id: 'damageDisplayDuration', min: 500, max: 5000, value: 1350, step: 50 },
                            { name: '动画帧数', id: 'damageFrames', min: 10, max: 120, value: 30, step: 5 },
                            { name: '描边宽度', id: 'damageStrokeWidth', min: 0, max: 5, value: 1.5, step: 0.5 },
                            { name: '描边颜色', id: 'damageStrokeColor', type: 'color', value: '#FFFFFF' },
                            { name: '结束缩放比例', id: 'damageEndScale', min: 1, max: 3, value: 1.5, step: 0.1 },
                            { name: '淡出时间(ms)', id: 'damageEndFadeDuration', min: 100, max: 1000, value: 200, step: 50 }
                        ]
                    },
                    '浮动数字': {
                        enabled: effectDrawEnabled[6],
                        params: [
                            { name: '显示时间(ms)', id: 'floatingDuration', min: 500, max: 5000, value: 1000, step: 100 },
                            { name: '字号大小', id: 'floatingFontSize', min: 10, max: 50, value: 30, step: 1 },
                            { name: '描边宽度', id: 'floatingStrokeWidth', min: 0, max: 5, value: 2, step: 0.5 },
                            { name: '描边颜色', id: 'floatingStrokeColor', type: 'color', value: '#FFFFFF' },
                            { name: '上升高度(px)', id: 'floatingRiseHeight', min: 10, max: 100, value: 20, step: 1 },
                            { name: '透明度延迟(%)', id: 'floatingOpacityDelay', min: 0, max: 100, value: 50, step: 5 }
                        ]
                    },
                    '自定义弹道': {
                        enabled: useCustomProjectileImage && customProjectileImage !== null,
                        params: [
                            { name: '飞行时间(ms)', id: 'projectileDuration', min: 500, max: 3000, value: 1000, step: 100 },
                            { name: '是否旋转图片', id: 'rotateProjectile', type: 'checkbox', value: true },
                            { name: '发射延迟(ms)', id: 'projectileDelay', min: 0, max: 500, value: 50, step: 10 },
                            { name: '淡出时间(ms)', id: 'projectileFadeDuration', min: 100, max: 1000, value: 500, step: 50 },
                            { name: '图片大小(px)', id: 'projectileSize', min: 20, max: 100, value: 40, step: 5, description: '图片最短边的长度，图片将按等比例缩放' },
                            { name: '敌人使用图片', id: 'enemyProjectile', type: 'checkbox', value: true },
                            { name: '启用弹道拖尾', id: 'projectileTrailEnabled', type: 'checkbox', value: true },
                            { name: '拖尾数量', id: 'projectileTrailCount', min: 1, max: 20, value: 5, step: 1 },
                            { name: '拖尾淡出时间(ms)', id: 'projectileTrailFadeTime', min: 100, max: 1000, value: 300, step: 50 },
                            { name: '拖尾生成间隔(ms)', id: 'projectileTrailInterval', min: 10, max: 200, value: 50, step: 10 }
                        ]
                    },
                    '震动': {
                        enabled: effectDrawEnabled[4],
                        params: [
                            { name: '震动强度', id: 'shakeIntensity', min: 1, max: 10, value: 5, step: 1 },
                            { name: '震动时间(ms)', id: 'shakeDuration', min: 100, max: 500, value: 300, step: 50 }
                        ]
                    }
                };

                // 从localStorage读取已保存的参数设置
                const savedParams = localStorage.getItem('MWI_Hit_Tracker_Effect_Params');
                let effectParamsValues = {};

                if (savedParams) {
                    try {
                        effectParamsValues = JSON.parse(savedParams);
                    } catch (e) {
                        console.error('解析保存的特效参数失败:', e);
                        effectParamsValues = {};
                    }
                }

                // 全局参数对象，用于存储当前参数值
                window.hitTrackerEffectParams = window.hitTrackerEffectParams || {};

                // 创建内部可展开区域的函数
                function createInnerExpandableSection(title, isEnabled, effectIndex) {
                    const section = document.createElement('div');
                    section.className = 'inner-expandable-section';
                    section.style.backgroundColor = '#e8e8e8';
                    section.style.padding = '8px';
                    section.style.borderRadius = '4px';
                    section.style.marginBottom = '10px';
                    section.style.cursor = 'pointer';
                    section.dataset.effectIndex = effectIndex;

                    const headerDiv = document.createElement('div');
                    headerDiv.style.display = 'flex';
                    headerDiv.style.justifyContent = 'space-between';
                    headerDiv.style.alignItems = 'center';

                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = `${title}参数`;
                    titleSpan.style.fontWeight = 'bold';

                    const arrowSpan = document.createElement('span');
                    arrowSpan.textContent = '▶';
                    arrowSpan.style.transition = 'transform 0.3s';

                    headerDiv.appendChild(titleSpan);
                    headerDiv.appendChild(arrowSpan);
                    section.appendChild(headerDiv);

                    const content = document.createElement('div');
                    content.className = 'inner-expandable-content';
                    content.style.display = 'none';
                    content.style.marginTop = '10px';
                    content.style.paddingLeft = '10px';
                    section.appendChild(content);

                    // 点击展开/收起
                    section.addEventListener('click', (e) => {
                        // 防止点击内部控件时触发展开/收起
                        if (e.target.tagName === 'INPUT' ||
                            e.target.closest('.param-slider-container') !== null) {
                            return;
                        }

                        const isExpanded = content.style.display !== 'none';
                        content.style.display = isExpanded ? 'none' : 'block';
                        arrowSpan.textContent = isExpanded ? '▶' : '▼';
                        arrowSpan.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
                    });

                    return { section, content };
                }

                // 为每个特效创建参数调整区域
                Object.keys(effectParams).forEach(effectName => {
                    // 检查特效是否启用
                    let effectEnabled = false;
                    let effectIndex = -1;
                    if (effectName === '击中特效') {
                        effectEnabled = effectDrawEnabled[3];
                        effectIndex = 3;
                    } else if (effectName === '粒子拖尾') {
                        effectEnabled = effectDrawEnabled[2];
                        effectIndex = 2;
                    } else if (effectName === '伤害数字') {
                        effectEnabled = effectDrawEnabled[0];
                        effectIndex = 0;
                    } else if (effectName === '自定义弹道') {
                        effectEnabled = useCustomProjectileImage && customProjectileImage !== null;
                        effectIndex = 5; // 使用新的索引
                    } else if (effectName === '震动') {
                        effectEnabled = effectDrawEnabled[4];
                        effectIndex = 4;
                    } else if (effectName === '路径绘制') {
                        effectEnabled = effectDrawEnabled[1];
                        effectIndex = 1;
                    } else if (effectName === '浮动数字') {
                        effectEnabled = effectDrawEnabled[6];
                        effectIndex = 6;
                    }

                    // 如果特效被禁用，则不显示该特效的参数区域
                    if (!effectEnabled) {
                        return;
                    }

                    // 创建特效参数组
                    const { section, content } = createInnerExpandableSection(effectName, effectEnabled, effectIndex);
                    section.id = `effect-param-section-${effectIndex}`;
                    
                    // 如果特效被禁用，则隐藏该特效的参数区域
                    if (!effectEnabled) {
                        section.style.display = 'none';
                    }
                    
                    expandableContent.appendChild(section);

                    // 为每个参数创建滑块控制
                    effectParams[effectName].params.forEach(param => {
                        // 从保存的设置中读取值，如果没有则使用默认值
                        const savedValue = effectParamsValues[param.id];
                        param.value = savedValue !== undefined ? savedValue : param.value;

                        // 保存到全局参数对象
                        window.hitTrackerEffectParams[param.id] = param.value;

                        // 创建参数容器
                        const paramContainer = document.createElement('div');
                        paramContainer.className = 'param-slider-container';
                        paramContainer.style.marginBottom = '10px';

                        // 创建参数名称和当前值显示
                        const paramLabel = document.createElement('div');
                        paramLabel.style.display = 'flex';
                        paramLabel.style.justifyContent = 'space-between';
                        paramLabel.style.marginBottom = '5px';

                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = param.name;
                        paramLabel.appendChild(nameSpan);

                        const valueSpan = document.createElement('span');
                        if (param.type !== 'color') {
                            valueSpan.textContent = param.value;
                        } else {
                            valueSpan.textContent = '';
                        }
                        valueSpan.id = `${param.id}-value`;
                        paramLabel.appendChild(valueSpan);

                        paramContainer.appendChild(paramLabel);
                        
                        // 如果有描述信息，添加描述文本
                        if (param.description) {
                            const descriptionDiv = document.createElement('div');
                            descriptionDiv.style.fontSize = '12px';
                            descriptionDiv.style.color = '#666';
                            descriptionDiv.style.marginBottom = '5px';
                            descriptionDiv.style.fontStyle = 'italic';
                            descriptionDiv.textContent = param.description;
                            paramContainer.appendChild(descriptionDiv);
                        }

                        // 根据参数类型创建不同的控件
                        if (param.type === 'color') {
                            // 创建颜色选择器
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.value = param.value;
                            colorInput.style.width = '100%';
                            colorInput.className = 'no-drag';

                            // 添加颜色选择器事件监听
                            colorInput.addEventListener('input', (e) => {
                                const newValue = e.target.value;
                                window.hitTrackerEffectParams[param.id] = newValue;

                                // 保存参数设置
                                saveEffectParams();
                            });

                            paramContainer.appendChild(colorInput);
                        } else if (param.type === 'checkbox') {
                            // 创建复选框控件
                            const checkboxContainer = document.createElement('div');
                            checkboxContainer.style.display = 'flex';
                            checkboxContainer.style.alignItems = 'center';
                            checkboxContainer.style.width = '100%';
                            
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.id = param.id;
                            checkbox.checked = param.value;
                            checkbox.className = 'no-drag';
                            
                            const checkboxLabel = document.createElement('label');
                            checkboxLabel.htmlFor = param.id;
                            checkboxLabel.textContent = '开启';
                            checkboxLabel.style.marginLeft = '10px';
                            
                            // 添加复选框事件监听
                            checkbox.addEventListener('change', (e) => {
                                const newValue = e.target.checked;
                                window.hitTrackerEffectParams[param.id] = newValue;
                                
                                // 更新显示值
                                valueSpan.textContent = newValue ? '是' : '否';
                                
                                // 保存参数设置
                                saveEffectParams();
                            });
                            
                            // 设置初始显示值
                            valueSpan.textContent = param.value ? '是' : '否';
                            
                            checkboxContainer.appendChild(checkbox);
                            checkboxContainer.appendChild(checkboxLabel);
                            paramContainer.appendChild(checkboxContainer);
                        } else {
                            // 创建滑块控制容器，用于布局滑块和上下箭头
                            const sliderControlContainer = document.createElement('div');
                            sliderControlContainer.style.display = 'flex';
                            sliderControlContainer.style.alignItems = 'center';
                            sliderControlContainer.style.width = '100%';

                            // 创建滑块
                            const slider = document.createElement('input');
                            slider.type = 'range';
                            slider.min = param.min;
                            slider.max = param.max;
                            slider.step = param.step;
                            slider.value = param.value;
                            slider.style.flex = '1'; // 让滑块占据主要空间
                            slider.style.marginRight = '10px'; // 与微调按钮保持一定距离
                            slider.className = 'no-drag'; // 防止拖动滑块时拖动整个菜单

                            // 创建微调按钮容器
                            const adjustButtonsContainer = document.createElement('div');
                            adjustButtonsContainer.style.display = 'flex';
                            adjustButtonsContainer.style.flexDirection = 'column';
                            adjustButtonsContainer.style.width = '20px';

                            // 创建上箭头按钮
                            const upButton = document.createElement('button');
                            upButton.innerHTML = '▲';
                            upButton.style.fontSize = '10px';
                            upButton.style.padding = '0';
                            upButton.style.height = '16px';
                            upButton.style.border = '1px solid #999';
                            upButton.style.borderRadius = '3px';
                            upButton.style.backgroundColor = '#546ddb'; // 使用脚本中已有的主题蓝色
                            upButton.style.color = 'white'; // 白色文字
                            upButton.style.cursor = 'pointer';
                            upButton.style.marginBottom = '2px';
                            upButton.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                            upButton.className = 'no-drag';

                            // 添加悬停效果
                            upButton.addEventListener('mouseover', () => {
                                upButton.style.backgroundColor = '#4056a1'; // 深一点的蓝色
                            });
                            upButton.addEventListener('mouseout', () => {
                                upButton.style.backgroundColor = '#546ddb';
                            });

                            // 创建下箭头按钮
                            const downButton = document.createElement('button');
                            downButton.innerHTML = '▼';
                            downButton.style.fontSize = '10px';
                            downButton.style.padding = '0';
                            downButton.style.height = '16px';
                            downButton.style.border = '1px solid #999';
                            downButton.style.borderRadius = '3px';
                            downButton.style.backgroundColor = '#546ddb'; // 使用脚本中已有的主题蓝色
                            downButton.style.color = 'white'; // 白色文字
                            downButton.style.cursor = 'pointer';
                            downButton.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                            downButton.className = 'no-drag';

                            // 添加悬停效果
                            downButton.addEventListener('mouseover', () => {
                                downButton.style.backgroundColor = '#4056a1'; // 深一点的蓝色
                            });
                            downButton.addEventListener('mouseout', () => {
                                downButton.style.backgroundColor = '#546ddb';
                            });

                            // 添加箭头按钮功能
                            function adjustValue(increment) {
                                // 获取当前值
                                let currentValue = parseFloat(slider.value);
                                // 根据步长调整值
                                let step = parseFloat(param.step);
                                // 计算新值
                                let newValue = increment ? currentValue + step : currentValue - step;
                                // 确保新值在范围内
                                newValue = Math.max(parseFloat(param.min), Math.min(parseFloat(param.max), newValue));
                                // 更新滑块值
                                slider.value = newValue;
                                // 更新显示值
                                valueSpan.textContent = newValue;
                                // 更新存储的参数值
                                window.hitTrackerEffectParams[param.id] = newValue;
                                // 保存参数设置
                                saveEffectParams();
                            }

                            // 点击上箭头增加值
                            upButton.addEventListener('click', (e) => {
                                e.stopPropagation(); // 防止触发父元素点击事件
                                adjustValue(true);
                            });

                            // 点击下箭头减少值
                            downButton.addEventListener('click', (e) => {
                                e.stopPropagation(); // 防止触发父元素点击事件
                                adjustValue(false);
                            });

                            // 添加到微调按钮容器
                            adjustButtonsContainer.appendChild(upButton);
                            adjustButtonsContainer.appendChild(downButton);

                            // 添加滑块事件监听
                            slider.addEventListener('input', (e) => {
                                const newValue = parseFloat(e.target.value);
                                valueSpan.textContent = newValue;
                                window.hitTrackerEffectParams[param.id] = newValue;

                                // 保存参数设置
                                saveEffectParams();
                            });

                            // 组装控件
                            sliderControlContainer.appendChild(slider);
                            sliderControlContainer.appendChild(adjustButtonsContainer);
                            paramContainer.appendChild(sliderControlContainer);
                        }
                        content.appendChild(paramContainer);
                    });
                });

                // 添加重置按钮
                const resetButton = document.createElement('button');
                resetButton.textContent = '重置为默认值';
                resetButton.style.marginTop = '15px';
                resetButton.style.padding = '5px 10px';
                resetButton.style.backgroundColor = '#546ddb';
                resetButton.style.color = 'white';
                resetButton.style.border = 'none';
                resetButton.style.borderRadius = '4px';
                resetButton.style.cursor = 'pointer';

                resetButton.addEventListener('click', () => {
                    // 重置所有参数为默认值
                    Object.keys(effectParams).forEach(effectName => {
                        effectParams[effectName].params.forEach(param => {
                            const defaultValue = param.defaultValue || param.value; // 使用预定义的默认值
                            window.hitTrackerEffectParams[param.id] = defaultValue;

                            // 更新UI
                            const valueSpan = document.getElementById(`${param.id}-value`);
                            if (valueSpan && param.type !== 'color') {
                                valueSpan.textContent = defaultValue;
                            }

                            // 更新控件值
                            if (param.type === 'color') {
                                // 更新颜色选择器
                                const colorInput = document.querySelector(`input[type="color"][value="${window.hitTrackerEffectParams[param.id]}"]`);
                                if (colorInput) colorInput.value = defaultValue;
                            } else {
                                // 更新滑块
                                const paramLabel = document.getElementById(`${param.id}-value`);
                                if (paramLabel) {
                                    const sliderContainer = paramLabel.closest('.param-slider-container');
                                    if (sliderContainer) {
                                        const slider = sliderContainer.querySelector('input[type="range"]');
                                        if (slider) slider.value = defaultValue;
                                    }
                                }
                            }
                        });
                    });

                    // 保存参数设置
                    saveEffectParams();
                });

                expandableContent.appendChild(resetButton);
            }

            // 保存特效参数设置
            function saveEffectParams() {
                localStorage.setItem('MWI_Hit_Tracker_Effect_Params', JSON.stringify(window.hitTrackerEffectParams));
            }
    
            // 生成自定义弹道内容的函数
            function generateCustomProjectileContent(expandableContent) {
                // 创建容器
                const container = document.createElement('div');
                container.style.padding = '10px 0';
                
                // 创建标题
                const title = document.createElement('h3');
                title.textContent = '上传自定义弹道图片';
                title.style.margin = '0 0 10px 0';
                title.style.fontSize = '14px';
                container.appendChild(title);
                
                // 创建说明文字
                const description = document.createElement('p');
                description.textContent = '此处上传的是通用弹道图片，您也可以在"玩家和颜色"菜单中为每个玩家单独设置专属弹道图片。';
                description.style.margin = '0 0 15px 0';
                description.style.fontSize = '12px';
                description.style.color = '#666';
                container.appendChild(description);
                
                // 创建启用自定义弹道的复选框
                const enableContainer = document.createElement('div');
                enableContainer.style.display = 'flex';
                enableContainer.style.alignItems = 'center';
                enableContainer.style.marginBottom = '15px';
                
                const enableCheckbox = document.createElement('input');
                enableCheckbox.type = 'checkbox';
                enableCheckbox.checked = useCustomProjectileImage;
                enableCheckbox.id = 'enable-custom-projectile';
                
                const enableLabel = document.createElement('label');
                enableLabel.textContent = '启用自定义弹道图片';
                enableLabel.htmlFor = 'enable-custom-projectile';
                enableLabel.style.marginLeft = '10px';
                
                enableContainer.appendChild(enableCheckbox);
                enableContainer.appendChild(enableLabel);
                container.appendChild(enableContainer);
                
                // 添加复选框事件监听
                enableCheckbox.addEventListener('change', (e) => {
                    useCustomProjectileImage = e.target.checked;
                    saveSettings();
                    
                    // 同步更新特效参数菜单中的自定义弹道显示状态
                    const paramMenuContainer = document.querySelector('.自定义菜单');
                    if (paramMenuContainer) {
                        // 找到特效参数面板
                        const paramSections = paramMenuContainer.querySelectorAll('.expandable-content');
                        let effectParamsContent = null;
                        
                        // 遍历找到特效参数的内容区域
                        paramSections.forEach(section => {
                            const sectionHeader = section.previousElementSibling;
                            if (sectionHeader && sectionHeader.textContent.includes('特效参数')) {
                                effectParamsContent = section;
                            }
                        });
                        
                        if (effectParamsContent) {
                            // 查找自定义弹道参数区域
                            const allParamSections = effectParamsContent.querySelectorAll('.inner-expandable-section');
                            let targetSection = null;
                            
                            allParamSections.forEach(section => {
                                const titleElement = section.querySelector('span');
                                if (titleElement && titleElement.textContent === '自定义弹道参数') {
                                    targetSection = section;
                                }
                            });
                            
                            // 根据启用状态和图片状态显示或隐藏参数区域
                            if (targetSection) {
                                const isEnabled = useCustomProjectileImage && customProjectileImage !== null;
                                targetSection.style.display = isEnabled ? 'block' : 'none';
                            } else if (useCustomProjectileImage && customProjectileImage !== null) {
                                // 如果启用了特效但没找到对应的参数区域，重新生成菜单
                                effectParamsContent.innerHTML = '';
                                generateEffectParamsContent(effectParamsContent);
                            }
                        }
                    }
                });
                
                // 创建图片预览区域
                const previewContainer = document.createElement('div');
                previewContainer.style.marginBottom = '15px';
                previewContainer.style.textAlign = 'center';
                
                const previewTitle = document.createElement('div');
                previewTitle.textContent = '图片预览:';
                previewTitle.style.marginBottom = '5px';
                previewTitle.style.textAlign = 'left';
                previewContainer.appendChild(previewTitle);
                
                const previewArea = document.createElement('div');
                previewArea.style.width = '100px';
                previewArea.style.height = '100px';
                previewArea.style.border = '1px dashed #ccc';
                previewArea.style.borderRadius = '4px';
                previewArea.style.display = 'flex';
                previewArea.style.alignItems = 'center';
                previewArea.style.justifyContent = 'center';
                previewArea.style.margin = '0 auto';
                previewArea.style.backgroundColor = '#f5f5f5';
                previewArea.style.position = 'relative';
                
                // 添加预览图片
                const previewImage = document.createElement('img');
                previewImage.style.maxWidth = '40px';
                previewImage.style.maxHeight = '40px';
                previewImage.style.display = 'none';
                
                // 如果已有自定义图片，则显示
                if (customProjectileImage) {
                    previewImage.src = customProjectileImage;
                    previewImage.style.display = 'block';
                }
                
                // 默认提示文字
                const previewText = document.createElement('span');
                previewText.textContent = '无图片';
                previewText.style.color = '#999';
                previewText.style.fontSize = '12px';
                
                // 添加缩放后的图片尺寸显示
                const sizeInfo = document.createElement('div');
                sizeInfo.style.position = 'absolute';
                sizeInfo.style.bottom = '2px';
                sizeInfo.style.right = '2px';
                sizeInfo.style.fontSize = '10px';
                sizeInfo.style.color = '#666';
                sizeInfo.style.backgroundColor = 'rgba(255,255,255,0.7)';
                sizeInfo.style.padding = '1px 3px';
                sizeInfo.style.borderRadius = '2px';
                
                // 根据是否有图片决定显示预览图或提示文字
                if (customProjectileImage) {
                    previewText.style.display = 'none';
                    sizeInfo.textContent = '40×40px';
                } else {
                    sizeInfo.style.display = 'none';
                }
                
                previewArea.appendChild(previewImage);
                previewArea.appendChild(previewText);
                previewArea.appendChild(sizeInfo);
                previewContainer.appendChild(previewArea);
                container.appendChild(previewContainer);
                
                // 创建文件上传按钮
                const uploadContainer = document.createElement('div');
                uploadContainer.style.display = 'flex';
                uploadContainer.style.flexDirection = 'column';
                uploadContainer.style.gap = '10px';
                uploadContainer.style.marginBottom = '15px';
                
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';
                fileInput.id = 'projectile-file-input';
                
                // 创建按钮容器
                const buttonRow = document.createElement('div');
                buttonRow.style.display = 'flex';
                buttonRow.style.gap = '10px';
                
                const uploadButton = document.createElement('button');
                uploadButton.textContent = '上传图片';
                uploadButton.style.padding = '6px 12px';
                uploadButton.style.backgroundColor = '#546ddb';
                uploadButton.style.color = 'white';
                uploadButton.style.border = 'none';
                uploadButton.style.borderRadius = '4px';
                uploadButton.style.cursor = 'pointer';
                uploadButton.style.flex = '1';
                uploadButton.onclick = () => fileInput.click();
                
                // 创建获取剪贴板按钮
                const clipboardButton = document.createElement('button');
                clipboardButton.textContent = '获取剪贴板';
                clipboardButton.style.padding = '6px 12px';
                clipboardButton.style.backgroundColor = '#546ddb';
                clipboardButton.style.color = 'white';
                clipboardButton.style.border = 'none';
                clipboardButton.style.borderRadius = '4px';
                clipboardButton.style.cursor = 'pointer';
                clipboardButton.style.flex = '1';
                
                // 处理图片上传
                function processImage(file) {
                    if (!file || !file.type.startsWith('image/')) {
                        alert('请选择有效的图片文件!');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.onload = function() {
                            // 获取自定义图片大小参数
                            const params = window.hitTrackerEffectParams || {};
                            const targetSize = params.projectileSize || 40; // 默认40px
                            
                            // 创建canvas来调整图片大小
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            // 计算等比例缩放尺寸
                            let width = img.width;
                            let height = img.height;
                            let scale;
                            
                            // 确定哪个边是最短的，并根据最短边计算缩放比例
                            if (width < height) {
                                // 宽度是最短边
                                scale = targetSize / width;
                                width = targetSize;
                                height = Math.round(height * scale);
                            } else {
                                // 高度是最短边或宽高相等
                                scale = targetSize / height;
                                height = targetSize;
                                width = Math.round(width * scale);
                            }
                            
                            // 设置画布尺寸为缩放后的尺寸
                            canvas.width = width;
                            canvas.height = height;
                            
                            // 绘制并调整图片大小
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // 转换为dataURL
                            const dataURL = canvas.toDataURL('image/png');
                            
                            // 更新预览
                            previewImage.src = dataURL;
                            previewImage.style.display = 'block';
                            previewText.style.display = 'none';
                            sizeInfo.style.display = 'block';
                            sizeInfo.textContent = `${width}×${height}px`;
                            
                            // 保存到设置
                            customProjectileImage = dataURL;
                            saveSettings();
                            
                            // 自动启用自定义图片
                            enableCheckbox.checked = true;
                            useCustomProjectileImage = true;
                            saveSettings();
                            
                            // 同步更新特效参数菜单
                            updateCustomProjectileParamSection();
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
                
                // 定义更新特效参数菜单的函数，方便重复调用
                function updateCustomProjectileParamSection() {
                    const paramMenuContainer = document.querySelector('.自定义菜单');
                    if (!paramMenuContainer) return;
                    
                    // 找到特效参数面板
                    const paramSections = paramMenuContainer.querySelectorAll('.expandable-content');
                    let effectParamsContent = null;
                    
                    // 遍历找到特效参数的内容区域
                    paramSections.forEach(section => {
                        const sectionHeader = section.previousElementSibling;
                        if (sectionHeader && sectionHeader.textContent.includes('特效参数')) {
                            effectParamsContent = section;
                        }
                    });
                    
                    if (!effectParamsContent) return;
                    
                    // 查找自定义弹道参数区域
                    const allParamSections = effectParamsContent.querySelectorAll('.inner-expandable-section');
                    let targetSection = null;
                    
                    allParamSections.forEach(section => {
                        const titleElement = section.querySelector('span');
                        if (titleElement && titleElement.textContent === '自定义弹道参数') {
                            targetSection = section;
                        }
                    });
                    
                    // 根据启用状态和图片状态显示或隐藏参数区域
                    if (targetSection) {
                        const isEnabled = useCustomProjectileImage && customProjectileImage !== null;
                        targetSection.style.display = isEnabled ? 'block' : 'none';
                    } else if (useCustomProjectileImage && customProjectileImage !== null) {
                        // 如果启用了特效但没找到对应的参数区域，重新生成菜单
                        effectParamsContent.innerHTML = '';
                        generateEffectParamsContent(effectParamsContent);
                    }
                }
                
                // 替换先前的事件监听器，使用共享的更新函数
                enableCheckbox.addEventListener('change', (e) => {
                    useCustomProjectileImage = e.target.checked;
                    saveSettings();
                    
                    // 同步更新特效参数菜单
                    updateCustomProjectileParamSection();
                });
                
                // 点击事件 - 获取剪贴板图片
                clipboardButton.addEventListener('click', async () => {
                    try {
                        // 检查是否支持剪贴板API
                        if (!navigator.clipboard || !navigator.clipboard.read) {
                            alert('您的浏览器不支持直接访问剪贴板。请使用Ctrl+V粘贴或上传图片。');
                            return;
                        }
                        
                        // 获取剪贴板内容
                        const clipboardItems = await navigator.clipboard.read();
                        let imageFound = false;
                        
                        for (const clipboardItem of clipboardItems) {
                            // 检查剪贴板是否包含图片
                            const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                            if (imageTypes.length > 0) {
                                // 获取图片的Blob
                                const imageBlob = await clipboardItem.getType(imageTypes[0]);
                                // 处理图片
                                processImage(imageBlob);
                                imageFound = true;
                                break;
                            }
                        }
                        
                        if (!imageFound) {
                            alert('剪贴板中未找到图片。请复制一张图片后重试。');
                        }
                    } catch (err) {
                        console.error('获取剪贴板内容失败:', err);
                        alert('获取剪贴板内容失败。请尝试使用上传图片或直接粘贴(Ctrl+V)。');
                    }
                });
                
                // 添加按钮到行容器
                buttonRow.appendChild(uploadButton);
                buttonRow.appendChild(clipboardButton);
                
                uploadContainer.appendChild(fileInput);
                uploadContainer.appendChild(buttonRow);
                
                // 创建粘贴提示
                const pasteHint = document.createElement('div');
                pasteHint.textContent = '提示: 也可以直接粘贴剪贴板中的图片 (Ctrl+V)';
                pasteHint.style.fontSize = '12px';
                pasteHint.style.color = '#666';
                pasteHint.style.marginTop = '5px';
                pasteHint.style.textAlign = 'center';
                
                uploadContainer.appendChild(pasteHint);
                container.appendChild(uploadContainer);
                
                // 文件上传事件
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files[0]) {
                        processImage(e.target.files[0]);
                    }
                });
                
                // 增强粘贴事件捕获能力 - 使整个容器都能响应粘贴事件
                container.setAttribute('tabindex', '0'); // 使容器可以获取焦点
                container.style.outline = 'none'; // 去除获取焦点时的轮廓
                
                // 增加点击时自动获取焦点，以便捕获粘贴事件
                container.addEventListener('click', () => {
                    container.focus();
                });
                
                // 为整个容器添加粘贴事件
                container.addEventListener('paste', (e) => {
                    // 检查是否包含图片
                    const items = e.clipboardData.items;
                    let imageFile = null;
                    
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            imageFile = items[i].getAsFile();
                            break;
                        }
                    }
                    
                    if (imageFile) {
                        e.preventDefault();
                        processImage(imageFile);
                    }
                });
                
                expandableContent.appendChild(container);
                
                // 为面板本身也添加粘贴事件
                expandableContent.addEventListener('paste', (e) => {
                    // 检查是否包含图片
                    const items = e.clipboardData.items;
                    let imageFile = null;
                    
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            imageFile = items[i].getAsFile();
                            break;
                        }
                    }
                    
                    if (imageFile) {
                        e.preventDefault();
                        processImage(imageFile);
                    }
                });
            }

            // 创建特效自定义可展开部分
            const { expandableSection: effectCustomSection, expandableContent: effectCustomContent } = createExpandableSection('启动特效', generateEffectCustomContent);
            popup.appendChild(effectCustomSection);
            popup.appendChild(effectCustomContent);

            // 创建玩家和颜色可展开部分
            const { expandableSection: playerColorSection, expandableContent: playerColorContent } = createExpandableSection('玩家和颜色', generatePlayerColorContent);
            popup.appendChild(playerColorSection);
            popup.appendChild(playerColorContent);
            
            // 创建自定义弹道可展开部分
            const { expandableSection: customProjectileSection, expandableContent: customProjectileContent } = createExpandableSection('自定义弹道', generateCustomProjectileContent);
            popup.appendChild(customProjectileSection);
            popup.appendChild(customProjectileContent);

            // 创建特效参数可展开部分
            const { expandableSection: effectParamsSection, expandableContent: effectParamsContent } = createExpandableSection('特效参数', generateEffectParamsContent);
            popup.appendChild(effectParamsSection);
            popup.appendChild(effectParamsContent);

            // 创建重置按钮元素
            const resetButton = document.createElement('button');
            // 设置重置按钮的显示文本
            resetButton.textContent = '重置';
            // 设置重置按钮的背景颜色
            resetButton.style.backgroundColor = '#ff4444';
            // 设置重置按钮的文本颜色
            resetButton.style.color = 'white';
            // 设置重置按钮无边框
            resetButton.style.border = 'none';
            // 设置重置按钮的边框圆角
            resetButton.style.borderRadius = '4px';
            // 设置重置按钮的内边距
            resetButton.style.padding = '8px 15px';
            // 设置重置按钮的右外边距
            resetButton.style.marginRight = '10px';
            // 设置重置按钮的鼠标指针样式
            resetButton.style.cursor = 'pointer';
            // 为重置按钮添加点击事件监听器，点击时重置所有设置
            resetButton.addEventListener('click', () => {
                // 添加确认对话框
                const confirmReset = confirm('确定要重置所有设置吗？这将恢复所有默认值。');

                // 如果用户取消，则不执行重置操作
                if (!confirmReset) {
                    return;
                }

                // 使用colorConfig重置颜色数组
                colorConfig.resetColors(lineColor, filterColor);

                // 重置玩家显示状态数组，全部设置为勾选状态
                playerDrawEnabled.fill(true);
                // 重置特效选项数组，全部设置为勾选状态
                effectDrawEnabled.fill(true);

                // 保存重置后的设置
                saveSettings();

                // 清空特效参数，强制重新使用默认值
                localStorage.removeItem('MWI_Hit_Tracker_Effect_Params');
                window.hitTrackerEffectParams = {};

                // 更新颜色选择器和预览
                // 获取玩家和颜色可展开内容中的所有颜色选择器元素
                const colorInputs = playerColorContent.querySelectorAll('input[type="color"]');
                // 获取玩家和颜色可展开内容中的所有颜色预览元素
                const previews = playerColorContent.querySelectorAll('div:last-child');
                // 遍历颜色选择器和预览元素，更新其值和背景颜色
                colorInputs.forEach((input, index) => {
                    input.value = lineColor[index];
                    previews[index].style.backgroundColor = lineColor[index];
                });

                // 更新特效选项的勾选状态
                // 获取所有效果设置部分的勾选框
                const effectCheckboxes = effectCustomContent.querySelectorAll('input[type="checkbox"]');
                // 遍历所有勾选框，将其设置为勾选状态
                effectCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;

                    // 如果这是子菜单项，确保它是启用的
                    if (checkbox.disabled) {
                        checkbox.disabled = false;
                    }
                });

                // 更新玩家勾选框状态
                const playerCheckboxes = playerColorContent.querySelectorAll('input[type="checkbox"]:not(.使用自定义弹道)');
                playerCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });

                //关闭菜单后再打开新的菜单
                document.body.removeChild(popup);
                //点击customColorButton
                customColorButton.click();
            });

            // 创建保存按钮元素
            const closeButton = document.createElement('button');
            // 设置保存按钮的显示文本
            closeButton.textContent = '保存';
            // 设置保存按钮的背景颜色
            closeButton.style.backgroundColor = '#2196F3';
            // 设置保存按钮的文本颜色
            closeButton.style.color = 'white';
            // 设置保存按钮无边框
            closeButton.style.border = 'none';
            // 设置保存按钮的边框圆角
            closeButton.style.borderRadius = '4px';
            // 设置保存按钮的内边距
            closeButton.style.padding = '8px 15px';
            // 设置保存按钮的鼠标指针样式
            closeButton.style.cursor = 'pointer';
            // 为保存按钮添加点击事件监听器，点击时保存设置并关闭弹出窗口
            closeButton.addEventListener('click', () => {
                saveSettings();
                document.body.removeChild(popup);
                const mask = document.querySelector('.自定义菜单遮罩');
                if (mask) document.body.removeChild(mask);
            });

            // 创建按钮容器元素
            const buttonContainer = document.createElement('div');
            // 设置按钮容器元素的顶部外边距
            buttonContainer.style.marginTop = '20px';
            // 设置按钮容器元素的显示方式为弹性布局
            buttonContainer.style.display = 'flex';
            // 设置按钮容器元素内子元素的水平靠右对齐
            buttonContainer.style.justifyContent = 'flex-end';
            // 将重置按钮添加到按钮容器元素中
            buttonContainer.appendChild(resetButton);
            // 将保存按钮添加到按钮容器元素中
            buttonContainer.appendChild(closeButton);

            // 将按钮容器元素添加到弹出窗口中
            popup.appendChild(buttonContainer);

            // 将弹出窗口添加到文档主体中
            document.body.appendChild(popup);

            // 遮罩点击事件：保存设置并关闭菜单
            mask.addEventListener('click', () => {
                saveSettings();
                document.body.removeChild(popup);
                document.body.removeChild(mask);
            });
        });

        // 标记自定义颜色设置按钮已添加
        isCustomColorButtonAdded = true;
        // 输出提示信息，表示自定义颜色按钮已成功添加
        console.log('自定义颜色按钮已成功添加。');
    }

    // 循环检查按钮是否创建成功
    function checkAndCreateButton() {
        const created = createCustomColorButton();
        if (!created) {
            setTimeout(checkAndCreateButton, 500); // 每 500 毫秒检查一次
        }
    }

    // 修改初始化函数添加弹道拖尾参数
    function init() {
        console.log('初始化函数已调用。');
        // 先加载设置
        readSettings();
        
        // 初始化特效参数全局对象
        window.hitTrackerEffectParams = window.hitTrackerEffectParams || {};

        // 设置所有参数的默认值
        // 这部分参数值来自 generateEffectParamsContent 函数中的定义
        const defaultParams = {
            // 击中特效参数
            'particleCount': 20,
            'particleRadius': 2,
            'maxDistance': 20,
            'batchCount': 4,
            // 粒子拖尾参数
            'trailParticleCount': 6,
            'trailDuration': 500,
            'trailSpreadRange': 8,
            // 伤害数字参数
            'damageDisplayDuration': 1350,
            'damageFrames': 30,
            'damageStrokeWidth': 1.5,
            'damageStrokeColor': '#FFFFFF',
            'damageEndScale': 1.5,
            'damageEndFadeDuration': 200,
            // 浮动数字参数
            'floatingDuration': 1000,
            'floatingFontSize': 30,
            'floatingStrokeWidth': 2,
            'floatingStrokeColor': '#FFFFFF',
            'floatingRiseHeight': 20,
            'floatingOpacityDelay': 50,
            // 自定义弹道参数
            'projectileDuration': 1000,
            'rotateProjectile': true,
            'projectileDelay': 50,
            'projectileFadeDuration': 500,
            'projectileSize': 40,
            'enemyProjectile': true, // 是否允许敌人发射自定义弹道
            'projectileTrailEnabled': true, // 是否启用弹道拖尾
            'projectileTrailCount': 5, // 拖尾数量
            'projectileTrailFadeTime': 300, // 拖尾淡出时间(ms)
            'projectileTrailInterval': 50, // 拖尾生成间隔(ms)
            // 震动参数
            'shakeIntensity': 5,
            'shakeDuration': 300,
            // 路径绘制参数
            'lineDuration': 1000, // 线条显示时间(ms)
            'randomCurve': true, // 是否启用随机弯曲方向
            'minCurveIntensity': 3, // 最小弯曲程度(0.5-10)
            'maxCurveIntensity': 7 // 最大弯曲程度(1-15)
        };

        // 从localStorage读取已保存的特效参数设置
        const savedParams = localStorage.getItem('MWI_Hit_Tracker_Effect_Params');
        
        if (savedParams) {
            try {
                const effectParamsValues = JSON.parse(savedParams);
                // 将保存的参数值合并到默认值中
                Object.keys(defaultParams).forEach(key => {
                    // 只有当保存的参数中存在且不为undefined时才使用保存的值
                    if (effectParamsValues[key] !== undefined) {
                        window.hitTrackerEffectParams[key] = effectParamsValues[key];
                    } else {
                        // 否则使用默认值
                        window.hitTrackerEffectParams[key] = defaultParams[key];
                    }
                });
                console.log('特效参数加载成功:', window.hitTrackerEffectParams);
            } catch (e) {
                console.error('解析保存的特效参数失败:', e);
                // 解析失败时使用所有默认值
                Object.assign(window.hitTrackerEffectParams, defaultParams);
                console.log('使用默认特效参数');
            }
        } else {
            // 如果没有保存过参数，则使用所有默认值
            Object.assign(window.hitTrackerEffectParams, defaultParams);
            console.log('未找到保存的特效参数，使用默认值');
        }
        
        // 初始化时将 effectDrawEnabled[5]（隐藏数字）设为 false，其他保持默认为 true
        if (effectDrawEnabled.length < 7) {
            // 确保数组长度足够
            while (effectDrawEnabled.length < 7) {
                effectDrawEnabled.push(true);
            }
            // 设置隐藏数字默认为不勾选
            effectDrawEnabled[5] = false;
        }
        
        // 劫持 WebSocket 消息，以便处理战斗相关的消息
        hookWS();
        // 添加网页可见性变化监听器，当网页从后台恢复时进行清理操作
        addVisibilityChangeListener();
        // 创建动画样式，用于攻击路径的闪烁效果和目标震动效果
        createAnimationStyle();
        // 调用循环检查函数
        checkAndCreateButton();
        
        // 初始化完成后应用隐藏数字设置
        if (effectDrawEnabled[5]) {
            setTimeout(() => toggleDamageNumbers(true), 500);
        }
    }

    // 创建动画样式，包括路径闪烁和目标震动效果
    function createAnimationStyle() {
        // console.log('动画样式函数已调用。');
        const style = document.createElement('style');
        style.textContent = `
            @keyframes lineFlash {
                0% { stroke-opacity: 0.7; }
                50% { stroke-opacity: 0.3; }
                100% { stroke-opacity: 0.7; }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(-1px); } /* 减小震动幅度 */
            }

            .mwht-shake {
                animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) forwards; /* 固定0.2秒持续时间 */
                transform-origin: center;
                position: relative;
                z-index: 200;
            }
        `;
        document.head.appendChild(style);
    }

    // 劫持 WebSocket 消息，拦截并处理战斗相关的消息
    function hookWS() {
        // console.log('劫持函数已调用。');
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            if (isPaused) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            return handleMessage(message);
        };

        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    // 计算元素中心点坐标
    function getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        if (element.innerText.trim() === '') {
            return {
                x: rect.left + rect.width / 2,
                y: rect.top
            };
        }
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // 创建抛物线路径，用于攻击动画的路径显示
    function createParabolaPath(startElem, endElem, reversed = false) {
        const start = getElementCenter(startElem);
        const end = getElementCenter(endElem);

        // 获取用户设置的参数
        const params = window.hitTrackerEffectParams || {};
        const randomCurve = params.randomCurve || false;
        const minCurveIntensity = params.minCurveIntensity || 3;
        const maxCurveIntensity = params.maxCurveIntensity || 7;
        
        // 在最小和最大弯曲程度之间随机选择一个值
        const curveIntensity = minCurveIntensity + Math.random() * (maxCurveIntensity - minCurveIntensity);
        
        // 根据弯曲程度计算弯曲系数
        // 原始弯曲系数为reversed ? 4 : 2.5，现在根据用户设置的强度调整
        // curveIntensity范围是1-10，我们把基础比率映射到范围1.5-7
        const baseRatio = 1.5 + ((curveIntensity - 1) / 9) * 5.5;
        const curveRatio = reversed ? baseRatio * 1.5 : baseRatio;
        
        // 计算弯曲高度
        let curveHeight = -Math.abs(start.x - end.x) / curveRatio;
        
        // 如果启用随机弯曲，随机决定向上或向下弯曲
        if (randomCurve) {
            // 使用随机数决定弯曲方向，50%概率向上弯曲，50%概率向下弯曲
            if (Math.random() < 0.5) {
                curveHeight = -curveHeight; // 反转弯曲方向
            }
        }

        const controlPoint = {
            x: (start.x + end.x) / 2,
            y: Math.min(start.y, end.y) + curveHeight
        };

        if (reversed) {
            return `M ${end.x} ${end.y} Q ${controlPoint.x} ${controlPoint.y}, ${start.x} ${start.y}`;
        }
        return `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y}, ${end.x} ${end.y}`;
    }

    // 为目标元素的第三个父级元素添加震动效果，根据第五个父级元素决定震动方向
    function shakeTarget(element) {
        if (!element || isPaused) return;

        // 检查震动特效是否启用
        if (!effectDrawEnabled[4]) return;

        // 获取参数，如果未设置则使用默认值
        const params = window.hitTrackerEffectParams || {};
        const intensity = params.shakeIntensity || 5;
        const duration = params.shakeDuration || 200;

        // 向上查找第三个父级元素（用于实际震动）
        let shakeElement = element;
        for (let i = 0; i < 3 && shakeElement; i++) {
            shakeElement = shakeElement.parentElement;
        }

        // 向上查找第五个父级元素（用于判断震动方向）
        let directionElement = element;
        for (let i = 0; i < 5 && directionElement; i++) {
            directionElement = directionElement.parentElement;
        }

        // 如果找到了相应的父级元素，应用震动效果
        if (shakeElement && directionElement) {
            const className = directionElement.className;
            // 根据震动强度计算位移值
            const pixelIntensity = intensity * 0.4; // 将强度值转换为像素值
            let transformValue = 'translate(0, 0)';

            // 根据第五个父级元素的类名决定震动方向
            if (className.includes('playersArea')) {
                transformValue = `translate(-${pixelIntensity}px, ${pixelIntensity}px)`;
            } else if (className.includes('monstersArea')) {
                transformValue = `translate(${pixelIntensity}px, ${pixelIntensity}px)`;
            }

            // 添加震动类并设置动画
            shakeElement.classList.add('mwht-shake');

            // 使用自定义动画实现不同方向的震动
            shakeElement.style.animation = `customShake ${duration/1000}s cubic-bezier(.36,.07,.19,.97) forwards`;
            shakeElement.style.transformOrigin = 'center';
            shakeElement.style.willChange = 'transform';

            // 存储原始transform值，动画结束后恢复
            const originalTransform = shakeElement.style.transform;

            // 动画帧函数
            let startTime = null;

            function animate(currentTime) {
                if (isPaused) return;

                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 计算动画曲线
                const easeOut = 1 - Math.pow(1 - progress, 3);

                // 应用变换
                if (progress < 0.5) {
                    // 前半段：从0到目标偏移
                    const scale = easeOut * 2;
                    shakeElement.style.transform = `translate(${parseFloat(transformValue.split('(')[1]) * scale}px, ${parseFloat(transformValue.split(',')[1]) * scale}px)`;
                } else {
                    // 后半段：从目标偏移回到0
                    const scale = 2 - (easeOut * 2);
                    shakeElement.style.transform = `translate(${parseFloat(transformValue.split('(')[1]) * scale}px, ${parseFloat(transformValue.split(',')[1]) * scale}px)`;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 动画结束，恢复原始transform
                    shakeElement.style.transform = originalTransform;
                    shakeElement.classList.remove('mwht-shake');
                    shakeElement.style.animation = '';
                }
            }

            // 启动动画
            requestAnimationFrame(animate);
        }
    }

    // 创建动画效果，包括攻击路径和伤害数字的动画
    function createEffect(startElem, endElem, hpDiff, index, reversed = false) {
        if (isPaused) return;
        
        // 修改检查逻辑，让玩家勾选框只控制线条绘制
        // 如果是反向攻击或玩家索引超出范围，依然使用玩家勾选框
        // 但对于普通玩家攻击，只有当线条绘制效果启用且玩家启用了线条绘制时，
        // 或者当玩家启用了自定义弹道时，才会显示线条/弹道效果
        // 其他特效不再受玩家勾选框影响
        let showLineOrProjectile = true; // 默认显示线条或弹道
        
        if (reversed || index >= 5) {
            // 对于敌人攻击或索引超出范围的情况，仍依赖玩家勾选框
            if (!playerDrawEnabled[index]) {
                showLineOrProjectile = false;
            }
        } else {
            // 对于玩家攻击的情况，检查是否显示线条或弹道
            // 只有当线条绘制特效启用且玩家绘制启用，或者玩家启用了自定义弹道时，才显示
            if (!(playerDrawEnabled[index] && effectDrawEnabled[1]) && !playerUseProjectile[index]) {
                showLineOrProjectile = false;
            }
        }

        if (reversed) {
            const dmgDivs = startElem.querySelector('.CombatUnit_splatsContainer__2xcc0')?.querySelectorAll('div') || [];
            for (const div of dmgDivs) {
                if (div.innerText.trim() === '') {
                    startElem = div;
                    break;
                }
            }
        } else {
            const dmgDivs = endElem.querySelector('.CombatUnit_splatsContainer__2xcc0')?.querySelectorAll('div') || [];
            for (const div of dmgDivs) {
                if (div.innerText.trim() === '') {
                    endElem = div;
                    break;
                }
            }
        }

        const svg = document.getElementById('svg-container');
        const frag = document.createDocumentFragment();


        // 根据reversed参数决定目标元素
        const targetElem = reversed ? startElem : endElem;
        // 存储需要在结束时触发击中特效的位置
        const effectPosition = {
            x: 0,
            y: 0
        };

        let path = null;
        let text = null;
        let pathLength = 0;
        let hasTextOrPath = false;
        
        // 修改条件：仅在showLineOrProjectile为true且线条绘制特效启用时创建路径
        // 这确保玩家勾选框只影响线条绘制，不影响其他特效
        if (showLineOrProjectile && playerDrawEnabled[index] && effectDrawEnabled[1]) {
            hasTextOrPath = true;
            
            // 创建默认线条
            // 原始线条逻辑
            let strokeWidth = '1px';
            let filterWidth = '1px';
            if (hpDiff >= 1000) {
                strokeWidth = '5px';
                filterWidth = '6px';
            } else if (hpDiff >= 700) {
                strokeWidth = '4px';
                filterWidth = '5px';
            } else if (hpDiff >= 500) {
                strokeWidth = '3px';
                filterWidth = '4px';
            } else if (hpDiff >= 300) {
                strokeWidth = '2px';
                filterWidth = '3px';
            } else if (hpDiff >= 100) {
                filterWidth = '2px';
            }

            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            if (reversed) index = 5;
            Object.assign(path.style, {
                stroke: lineColor[index],
                strokeWidth,
                fill: 'none',
                strokeLinecap: 'round',
                filter: `drop-shadow(0 0 ${filterWidth} ${filterColor[index]})`,
                willChange: 'stroke-dashoffset, opacity'
            });
            path.setAttribute('d', createParabolaPath(startElem, endElem, reversed));
            pathLength = path.getTotalLength();
            path.style.strokeDasharray = pathLength;
            path.style.strokeDashoffset = pathLength;

            // 计算路径终点位置，用于后续触发击中特效
            const endPoint = path.getPointAtLength(pathLength);
            effectPosition.x = endPoint.x;
            effectPosition.y = endPoint.y;

            frag.appendChild(path);
        }
        
        // 获取当前索引对应玩家是否使用自定义弹道
        // 只有非反向攻击(玩家攻击怪物)且是玩家索引时才检查自定义弹道设置
        let usePlayerProjectile = false;
        let projectileImgToUse = null;
        
        // 获取特效参数
        const params = window.hitTrackerEffectParams || {};
        
        // 检查是否使用自定义弹道图片
        if (!reversed && index < 5) {
            // 如果玩家勾选了使用自定义弹道且有专属图片
            if (playerUseProjectile[index] && playerProjectileImages[index]) {
                usePlayerProjectile = true;
                projectileImgToUse = playerProjectileImages[index];
            }
            // 如果玩家勾选了使用自定义弹道但没有专属图片，使用通用图片
            else if (playerUseProjectile[index] && useCustomProjectileImage && customProjectileImage) {
                usePlayerProjectile = true;
                projectileImgToUse = customProjectileImage;
            }
        } 
        // 如果是敌人攻击且允许敌人使用自定义弹道
        else if (reversed && useCustomProjectileImage && customProjectileImage) {
            const enemyProjectileEnabled = params.enemyProjectile !== undefined ? params.enemyProjectile : true;
            if (enemyProjectileEnabled) {
                usePlayerProjectile = true;
                projectileImgToUse = customProjectileImage;
            }
        }
        
        // 修改条件：仅在showLineOrProjectile为true且线条绘制特效启用时创建弹道图片
        if (showLineOrProjectile && usePlayerProjectile && effectDrawEnabled[1]) {
            hasTextOrPath = true;
            
            // 创建自定义弹道图片
            const startPoint = getElementCenter(startElem);
            const endPoint = getElementCenter(endElem);
            
            // 如果没有线条路径，创建一个用于计算的临时路径
            if (!path) {
                const tempCalcPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                tempCalcPath.setAttribute('d', createParabolaPath(startElem, endElem, reversed));
                pathLength = tempCalcPath.getTotalLength();
                
                // 计算路径终点位置，用于后续触发击中特效
                const endPoint = tempCalcPath.getPointAtLength(pathLength);
                effectPosition.x = endPoint.x;
                effectPosition.y = endPoint.y;
            }
            
            // 获取参数，如果未设置则使用默认值
            const duration = params.projectileDuration || 1000; // 默认1秒
            const rotateProjectile = params.rotateProjectile !== undefined ? params.rotateProjectile : true;
            const fadeOutDuration = params.projectileFadeDuration || 500; // 默认0.5秒淡出
            const startDelay = params.projectileDelay || 50; // 默认50ms延迟
            const imageSize = params.projectileSize || 40; // 默认图片大小40px
            const halfSize = imageSize / 2; // 计算图片半尺寸，用于居中定位
            
            // 创建图片元素
            const projectileImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
            projectileImage.setAttribute("href", projectileImgToUse);
            projectileImage.setAttribute("width", imageSize);
            projectileImage.setAttribute("height", imageSize);
            // 设置初始位置为起点，并偏移以使图片中心对准起点
            projectileImage.setAttribute("x", startPoint.x - halfSize);
            projectileImage.setAttribute("y", startPoint.y - halfSize);
            
            // 计算起点到终点的路径
            const pathD = createParabolaPath(startElem, endElem, reversed);
            const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            tempPath.setAttribute('d', pathD);
            // 使用已存在的pathLength变量，路径长度应该与线条相同
            
            // 添加到文档片段
            frag.appendChild(projectileImage);
            
            // 设置动画
            let startTime = null;
            let lastProgress = 0;
            let lastTrailTime = 0; // 记录上次创建拖尾的时间
            let angle = 0; // 用于存储当前旋转角度
            
            const originalAnimateProjectile = function(currentTime) {
                if (isPaused) return;
                
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 计算路径上的当前位置
                const point = tempPath.getPointAtLength(progress * pathLength);
                
                // 更新图片位置
                projectileImage.setAttribute("x", point.x - halfSize);
                projectileImage.setAttribute("y", point.y - halfSize);
                
                // 如果需要旋转图片，计算旋转角度
                if (rotateProjectile) {
                    // 只有当进度有明显变化时才重新计算角度，提高性能
                    if (progress - lastProgress > 0.01 || progress === 1) {
                        lastProgress = progress;
                        
                        // 获取当前点和下一点，计算角度
                        const nextPoint = tempPath.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
                        angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
                        
                        // 应用旋转
                        projectileImage.setAttribute("transform", `rotate(${angle}, ${point.x}, ${point.y})`);
                    }
                }
                
                // 添加拖尾效果
                const trailEnabled = params.projectileTrailEnabled !== undefined ? params.projectileTrailEnabled : true;
                
                if (trailEnabled) {
                    // 获取当前时间戳，用于控制拖尾生成频率
                    const now = Date.now();
                    // 获取拖尾生成间隔参数
                    const trailInterval = params.projectileTrailInterval || 50;
                    
                    // 根据时间间隔创建拖尾
                    if (!lastTrailTime || now - lastTrailTime >= trailInterval) {
                        createProjectileTrail(point.x, point.y, halfSize, imageSize, projectileImgToUse, rotateProjectile ? angle : 0);
                        lastTrailTime = now;
                    }
                }
                
                // 继续动画或结束
                if (progress < 1) {
                    requestAnimationFrame(animateProjectile);
                } else {
                    // 动画结束，添加淡出效果
                    projectileImage.style.transition = `opacity ${fadeOutDuration}ms`;
                    projectileImage.style.opacity = 0;
                    
                    setTimeout(() => {
                        projectileImage.remove();
                        // 弹道动画完成时触发效果
                        if (triggerHitEffects) {
                            triggerHitEffects();
                        } else {
                            // 如果没有传入回调函数，直接触发效果
                            if (effectDrawEnabled[3] && !hasTriggeredParticle) {
                                createParticleEffect(effectPosition.x, effectPosition.y, lineColor[index]);
                            }
                            if (effectDrawEnabled[4] && !hasTriggeredShake) {
                                shakeTarget(targetElem);
                                hasTriggeredShake = true;
                            }
                        }
                    }, fadeOutDuration);
                }
            };
            
            // 使用新的动画函数
            const animateProjectile = originalAnimateProjectile;
            
            // 启动动画，应用延迟参数
            setTimeout(() => {
                requestAnimationFrame(animateProjectile);
            }, startDelay);
        }

        // 只有当伤害数字特效启用时才创建文本，不再依赖玩家勾选框
        if (effectDrawEnabled[0]) {
            hasTextOrPath = true;
            text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = hpDiff;
            const baseFontSize = 5;
            const fontSize = Math.floor(200 * Math.pow(hpDiff / (20000 + hpDiff), 0.45)) - baseFontSize;
            text.setAttribute('font-size', fontSize);
            text.setAttribute('fill', lineColor[index]);

            // 获取参数，如果未设置则使用默认值
            const damageStrokeWidth = params.damageStrokeWidth || 0.5;
            const strokeColor = params.damageStrokeColor || '#000000';

            // 添加描边效果
            if (damageStrokeWidth > 0) {
                text.setAttribute('stroke', strokeColor);
                text.setAttribute('stroke-width', damageStrokeWidth);
                text.setAttribute('paint-order', 'stroke fill');
            }

            Object.assign(text.style, {
                opacity: 0,
                filter: `drop-shadow(0 0 5px ${lineColor[index]})`,
                transformOrigin: 'center',
                fontWeight: 'bold',
                willChange: 'transform, opacity, x, y'
            });
            frag.appendChild(text);
        }

        // 如果没有任何可视化效果但仍然需要处理伤害，直接触发震动和击中特效
        // 所有特效现在都不再依赖玩家勾选框
        if (!hasTextOrPath) {
            // 获取目标元素的位置用于粒子效果
            const targetCenter = getElementCenter(targetElem);
            effectPosition.x = targetCenter.x;
            effectPosition.y = targetCenter.y;

            // 独立触发震动和击中特效，只检查特效是否启用
            if (effectDrawEnabled[3]) {
                createParticleEffect(effectPosition.x, effectPosition.y, lineColor[index]);
            }

            if (effectDrawEnabled[4]) {
                shakeTarget(targetElem);
            }
            
            // 添加浮动数字效果，只检查特效是否启用
            if (effectDrawEnabled[6]) {
                createFloatingNumber(effectPosition.x, effectPosition.y, hpDiff, lineColor[index]);
            }
            
            return;
        }

        svg.appendChild(frag);

        // 记录是否启用了弹道图片
        const hasProjectile = usePlayerProjectile && projectileImgToUse;
        // 创建计数器跟踪完成的动画数量
        let animationCompletedCount = 0;
        // 需要完成的动画总数(线条+弹道)
        const totalAnimations = path && hasProjectile ? 2 : 1;
        // 添加一个标记，表示是否已触发震动效果
        let hasTriggeredShake = false;
        // 添加一个标记，表示是否已触发粒子效果
        let hasTriggeredParticle = false;
        // 添加一个标记，表示是否已触发浮动数字效果
        let hasTriggeredFloating = false;
        
        // 延迟执行击中效果的函数
        const triggerHitEffects = () => {
            animationCompletedCount++;
            
            // 任何特效到达终点时就触发震动效果，但只触发一次
            if (effectDrawEnabled[4] && !hasTriggeredShake) {
                shakeTarget(targetElem);
                hasTriggeredShake = true;
            }
            
            // 任何特效到达终点时就触发粒子效果，但只触发一次
            if (effectDrawEnabled[3] && !hasTriggeredParticle) {
                createParticleEffect(effectPosition.x, effectPosition.y, lineColor[index]);
                hasTriggeredParticle = true;
            }
            
            // 添加浮动数字效果
            if (effectDrawEnabled[6] && !hasTriggeredFloating) {
                createFloatingNumber(effectPosition.x, effectPosition.y, hpDiff, lineColor[index]);
                hasTriggeredFloating = true;
            }
        };

        // 如果创建了路径，设置路径动画
        if (path) {
            // 获取用户自定义的路径动画持续时间，默认为1000ms
            const params = window.hitTrackerEffectParams || {};
            const lineDuration = params.lineDuration || 1000;
            // 计算半程时间，用于第一阶段和第二阶段的动画
            const halfDuration = lineDuration / 2;
            
            setTimeout(() => {
                requestAnimationFrame(() => {
                    path.style.transition = `stroke-dashoffset ${halfDuration}ms linear`;
                    path.style.strokeDashoffset = '0';
                });
            }, 100);

            setTimeout(() => {
                requestAnimationFrame(() => {
                    path.style.transition = `stroke-dashoffset ${halfDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${halfDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                    path.style.strokeDashoffset = -pathLength;
                    path.style.opacity = 0;

                    const removePath = () => {
                        path.remove();

                        // 如果没有启用伤害数字特效且没有弹道图片，在路径移除后触发击中特效
                        if (!text) {
                            triggerHitEffects();
                        }
                    };
                    path.addEventListener('transitionend', removePath, { once: true });
                });
            }, 100 + halfDuration);
        }

        // 如果创建了文本，设置文本动画
        if (text) {
            // 获取自定义显示时间参数
            const displayDuration = params.damageDisplayDuration || 1350;

            // 如果同时有路径和文本，让文本沿着路径移动
            if (path) {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        // 传递显示时间参数和triggerHitEffects函数给动画函数
                        animateText(path, text, pathLength, lineColor[index], targetElem, {
                            duration: displayDuration,
                            triggerHitEffects: triggerHitEffects
                        });
                    });
                }, 100);
            } else {
                // 如果只有文本没有路径，创建一个虚拟路径用于文本动画
                const virtualPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                virtualPath.setAttribute('d', createParabolaPath(startElem, endElem, reversed));
                const virtualPathLength = virtualPath.getTotalLength();

                // 计算虚拟路径终点位置，用于后续触发击中特效
                const endPoint = virtualPath.getPointAtLength(virtualPathLength);
                effectPosition.x = endPoint.x;
                effectPosition.y = endPoint.y;

                // 直接设置文本动画，不添加虚拟路径到DOM
                // 传递显示时间参数和triggerHitEffects函数给动画函数
                animateText(virtualPath, text, virtualPathLength, lineColor[index], targetElem, {
                    duration: displayDuration,
                    triggerHitEffects: triggerHitEffects
                });
            }
        }
    }

    // 从对象池获取粒子元素
    function getParticleFromPool() {
        if (particlePool.length > 0) {
            return particlePool.pop();
        }
        return document.createElementNS("http://www.w3.org/2000/svg", "circle");
    }

    // 将粒子元素返回对象池
    function returnParticleToPool(particle) {
        particle.removeAttribute('r');
        particle.removeAttribute('fill');
        particle.removeAttribute('cx');
        particle.removeAttribute('cy');
        particle.style.opacity = 1;
        particle.style.transform = 'none';
        particle.removeEventListener('transitionend', () => {});
        particlePool.push(particle);
    }

    // 创建击中粒子特效，在伤害数字消失时显示
    /**
     * 创建粒子爆炸特效
     * @param {number} x - 粒子爆炸的x坐标
     * @param {number} y - 粒子爆炸的y坐标
     * @param {string} color - 粒子的颜色
     */
    function createParticleEffect(x, y, color) {
        // 如果动画暂停则直接返回
        if (isPaused) return;
        // 如果击中特效未启用，则直接返回
        if (!effectDrawEnabled[3]) return;

        // 获取SVG容器
        const svg = document.getElementById('svg-container');
        if (!svg) return;

        // 获取参数，如果未设置则使用默认值
        const params = window.hitTrackerEffectParams || {};
        const numParticles = params.particleCount || 20;
        const batchCount = params.batchCount || 4;
        const particleRadius = params.particleRadius || 2;
        const maxDistance = params.maxDistance || 20;

        // 创建文档片段用于批量添加粒子
        const frag = document.createDocumentFragment();

        // 计算每批创建的粒子数量（向上取整确保所有粒子都被创建）
        const batchSize = Math.ceil(numParticles / batchCount);
        // 批次计数器
        let currentBatch = 0;

        /**
         * 分批创建粒子
         */
        function createBatch() {
            // 计算当前批次应创建的粒子起始索引和结束索引
            const startIndex = currentBatch * batchSize;
            const endIndex = Math.min(startIndex + batchSize, numParticles);

            // 遍历创建当前批次的粒子
            for (let i = startIndex; i < endIndex; i++) {
                // 从对象池获取粒子
                const particle = getParticleFromPool();
                // 设置粒子基本属性
                particle.setAttribute('r', particleRadius.toString());
                particle.setAttribute('fill', color);
                particle.setAttribute('cx', x);
                particle.setAttribute('cy', y);
                particle.style.opacity = 1;
                particle.style.transformOrigin = 'center';
                particle.style.willChange = 'transform, opacity';

                // 计算粒子的运动轨迹
                // 随机生成0~2π之间的角度
                const angle = Math.random() * 2 * Math.PI;

                // 使用更强的随机数生成方式计算距离
                let distance;
                if (window.crypto && window.crypto.getRandomValues) {
                    const array = new Uint32Array(1);
                    window.crypto.getRandomValues(array);
                    distance = (array[0] / 0xffffffff) * (maxDistance - 10) + 10;
                } else {
                    // 添加额外的随机性扰动
                    for (let j = 0; j < (Date.now() % 5) + 1; j++) {
                        Math.random();
                    }
                    distance = Math.random() * (maxDistance - 10) + 10;
                }

                const endX = parseFloat(x) + distance * Math.cos(angle);
                const endY = parseFloat(y) + distance * Math.sin(angle);

                // 将粒子添加到文档片段
                frag.appendChild(particle);

                // 在下一帧开始粒子动画
                requestAnimationFrame(() => {
                    // 设置过渡动画
                    particle.style.transition = 'all 0.3s ease-out';
                    particle.setAttribute('cx', endX);
                    particle.setAttribute('cy', endY);
                    particle.style.opacity = 0;

                    // 设置安全清理定时器
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                            returnParticleToPool(particle);
                        }
                    }, 500); // 减少回收时间，提高性能
                });
            }

            // 增加批次计数
            currentBatch++;

            // 如果还有未创建的批次，继续创建下一批
            if (currentBatch < batchCount) {
                setTimeout(createBatch, 50);
            } else {
                // 所有粒子创建完成，将文档片段添加到SVG容器
                svg.appendChild(frag);
            }
        }

        // 开始创建第一批粒子
        createBatch();
    }


    /**
     * 创建粒子拖尾效果
     * @param {number} x - 粒子起始x坐标
     * @param {number} y - 粒子起始y坐标
     * @param {string} color - 粒子颜色
     */
    function createParticleTrail(x, y, color) {
        // 如果动画暂停则直接返回
        if (isPaused) return;
        // 如果粒子拖尾特效未启用，则直接返回
        if (!effectDrawEnabled[2]) return;

        // 获取SVG容器
        const svg = document.getElementById('svg-container');
        if (!svg) return;

        // 获取参数，如果未设置则使用默认值
        const params = window.hitTrackerEffectParams || {};
        const particleCount = params.trailParticleCount || 2;
        const duration = params.trailDuration || 500;
        const spreadRange = params.trailSpreadRange || 10;

        // 创建文档片段用于批量添加粒子
        const frag = document.createDocumentFragment();

        // 创建指定数量的粒子
        for (let i = 0; i < particleCount; i++) {
            // 从对象池获取粒子或创建新粒子
            let particle;
            if (particlePool.length > 0) {
                particle = particlePool.pop();
                // 重置粒子属性
                particle.style.opacity = 1;
            } else {
                particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                particle.setAttribute('r', '2');
            }

            // 设置粒子颜色
            particle.setAttribute('fill', color);

            // 计算粒子的随机位置偏移
            const randomSpread = Math.random() * spreadRange;
            const angle = Math.random() * 2 * Math.PI;
            const offsetX = randomSpread * Math.cos(angle);
            const offsetY = randomSpread * Math.sin(angle);

            // 设置粒子位置
            particle.setAttribute('cx', parseFloat(x) + offsetX);
            particle.setAttribute('cy', parseFloat(y) + offsetY);

            // 添加到文档片段
            frag.appendChild(particle);

            // 设置粒子动画
            const fadeOutDuration = duration + Math.random() * 200; // 添加一些随机性

            // 使用CSS过渡动画
            particle.style.transition = `opacity ${fadeOutDuration}ms ease-out`;

            // 延迟一帧开始动画，确保过渡效果生效
            requestAnimationFrame(() => {
                particle.style.opacity = 0;

                // 动画结束后回收粒子
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                        particlePool.push(particle);
                    }
                }, fadeOutDuration);
            });
        }

        // 将所有粒子一次性添加到SVG
        svg.appendChild(frag);
    }

    // 文本动画函数 - 使用 requestAnimationFrame 实现更流畅的动画
    /**
     * 执行文本动画，让文本沿着指定路径移动，并在移动过程中产生粒子效果。
     *
     * @param {SVGPathElement} path - 文本移动的路径元素。
     * @param {SVGTextElement} text - 要进行动画的文本元素。
     * @param {number} pathLength - 路径的总长度。
     * @param {string} color - 文本和粒子的颜色。
     * @param {HTMLElement} targetElem - 目标元素，用于震动效果。
     */
    function animateText(path, text, pathLength, color, targetElem, config = {}) {
        // 动画配置对象，包含动画持续时间、淡入开始和结束时间、粒子生成间隔
        const animationConfig = {
            duration: config.duration || 1350, // 动画总持续时间，单位为毫秒
            fadeInStart: config.fadeInStart || 0.0, // 淡入开始的进度比例
            fadeInEnd: config.fadeInEnd || 0.3, // 淡入结束的进度比例
            particleInterval: config.particleInterval || 3, // 粒子生成的间隔百分比
            frameRate: config.frameRate || 60, // 动画帧率
            endScale: config.endScale || 1.5, // 结束时的缩放比例
            endFadeDuration: config.endFadeDuration || 200, // 结束淡出动画持续时间
            particleSize: config.particleSize || 2, // 粒子大小
            particleSpread: config.particleSpread || 10, // 粒子扩散范围
            triggerHitEffects: config.triggerHitEffects || null // 触发击中效果的回调函数
        };

        // 获取用户在参数菜单中配置的伤害数字参数
        const params = window.hitTrackerEffectParams || {};
        if (params.damageDisplayDuration) {
            animationConfig.duration = params.damageDisplayDuration;
        }

        // 添加动画结束时的缩放比例和淡出时间配置
        if (params.damageEndScale) {
            animationConfig.endScale = params.damageEndScale;
        }
        if (params.damageEndFadeDuration) {
            animationConfig.endFadeDuration = params.damageEndFadeDuration;
        }

        let startTime = null; // 动画开始的时间戳
        let lastParticleFrame = 0; // 上一次生成粒子时的进度百分比
        let lastFrameTime = 0; // 上一帧的时间戳

        /**
         * 动画循环函数，使用 requestAnimationFrame 不断更新文本和粒子的状态。
         *
         * @param {number} currentTime - 当前的时间戳。
         */
        function animate(currentTime) {
            // 如果脚本处于暂停状态，则停止动画
            if (isPaused) return;

            // 如果动画还未开始，记录当前时间为开始时间
            if (!startTime) startTime = currentTime;

            // 计算帧间隔
            const frameInterval = 1000 / animationConfig.frameRate;

            // 如果距离上一帧的时间间隔小于目标帧间隔，跳过这一帧
            if (currentTime - lastFrameTime < frameInterval) {
                requestAnimationFrame(animate);
                return;
            }

            // 更新上一帧时间戳
            lastFrameTime = currentTime;

            // 计算从动画开始到现在经过的时间
            const elapsed = currentTime - startTime;
            // 计算动画的进度，取值范围为 0 到 1
            const progress = Math.min(elapsed / animationConfig.duration, 1);

            // 根据进度获取路径上的点
            const point = path.getPointAtLength(progress * pathLength);

            // 更新文本的位置
            text.setAttribute('x', point.x);
            text.setAttribute('y', point.y);

            let opacity = 1; // 文本的透明度
            // 如果进度小于淡入开始时间，文本完全透明
            if (progress < animationConfig.fadeInStart) {
                opacity = 0;
            }
            // 如果进度在淡入开始和结束时间之间，计算透明度的渐变值
            else if (progress < animationConfig.fadeInEnd) {
                opacity = 0.7 + 0.3 * ((progress - animationConfig.fadeInStart) / (animationConfig.fadeInEnd - animationConfig.fadeInStart));
            }
            // 更新文本的透明度
            text.style.opacity = opacity;

            // 检查是否达到粒子生成的间隔，并且上次生成粒子的进度不同
            if (Math.floor(progress * 100) % animationConfig.particleInterval === 0 && lastParticleFrame !== Math.floor(progress * 100)) {
                // 记录当前生成粒子的进度
                lastParticleFrame = Math.floor(progress * 100);
            }

            // 如果动画进度小于 1，继续请求下一帧动画
            if (progress < 1) {
                requestAnimationFrame(animate);

                // 只在粒子拖尾特效启用时才创建粒子
                if (effectDrawEnabled[2]) {
                    createParticleTrail(point.x, point.y, color);
                }
            }
            // 动画进度达到 1，执行结束动画
            else {
                text.style.transition = `all ${animationConfig.endFadeDuration/1000}s ease-out`;
                text.style.transform = `scale(${animationConfig.endScale})`;
                text.style.opacity = 0;

                const finalX = text.getAttribute('x');
                const finalY = text.getAttribute('y');

                setTimeout(() => {
                    text.remove();

                    if (animationConfig.triggerHitEffects) {
                        // 如果传入了triggerHitEffects回调，则使用它
                        animationConfig.triggerHitEffects();
                    } else {
                        // 否则使用原来的代码
                        if (effectDrawEnabled[3] && !hasTriggeredParticle) {
                            createParticleEffect(finalX, finalY, color);
                        }

                        if (effectDrawEnabled[4] && !hasTriggeredShake) {
                            shakeTarget(targetElem);
                            hasTriggeredShake = true;
                        }
                        
                        // 添加浮动数字效果
                        if (effectDrawEnabled[6]) {
                            createFloatingNumber(finalX, finalY, text.textContent, color);
                        }
                    }
                }, animationConfig.endFadeDuration);
            }
        }

        // 启动动画循环
        requestAnimationFrame(animate);
    }
    // 创建线条动画，根据攻击信息创建攻击路径和伤害数字动画
    /**
     * 创建从一个角色到另一个角色的攻击线条，并触发相应的特效。
     *
     * @param {number} from - 攻击发起者的索引。
     * @param {number} to - 攻击目标的索引。
     * @param {number} hpDiff - 伤害值，即生命值的差值。
     * @param {boolean} [reversed=false] - 指示攻击是否是反向的，默认为 false。
     */
    function createLine(from, to, hpDiff, reversed = false) {
        // 如果脚本处于暂停状态，则直接返回，不执行后续操作
        if (isPaused) return;
        // 查找玩家区域元素
        const playerArea = document.querySelector(".BattlePanel_playersArea__vvwlB");
        // 查找怪物区域元素
        const monsterArea = document.querySelector(".BattlePanel_monstersArea__2dzrY");
        // 查找游戏主面板元素
        const gamePanel = document.querySelector(".GamePage_mainPanel__2njyb");

        // 如果任何一个必要元素未找到，则直接返回，不执行后续操作
        if (!playerArea || !monsterArea || !gamePanel) return;

        // 获取玩家区域的第一个子元素，作为玩家容器
        const playersContainer = playerArea.firstElementChild;
        // 获取怪物区域的第一个子元素，作为怪物容器
        const monsterContainer = monsterArea.firstElementChild;

        // 获取攻击发起者的元素
        const effectFrom = playersContainer?.children[from];
        // 获取攻击目标的元素
        const effectTo = monsterContainer?.children[to];

        // 如果攻击发起者或目标元素未找到，则直接返回，不执行后续操作
        if (!effectFrom || !effectTo) return;

        // 查找 SVG 容器元素
        let svgContainer = document.getElementById('svg-container');

        // 如果 SVG 容器元素不存在，则创建一个新的 SVG 容器
        if (!svgContainer) {
            // 定义 SVG 的命名空间
            const svgNS = 'http://www.w3.org/2000/svg';
            // 创建 SVG 元素
            svgContainer = document.createElementNS(svgNS, 'svg');
            // 设置 SVG 元素的 ID
            svgContainer.id = 'svg-container';

            // 设置 SVG 元素的样式
            Object.assign(svgContainer.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
                zIndex: '190'
            });

            // 定义一个函数，用于设置 SVG 的 viewBox 属性
            const setViewBox = () => {
                // 获取窗口的宽度
                const width = window.innerWidth;
                // 获取窗口的高度
                const height = window.innerHeight;
                // 设置 SVG 的 viewBox 属性
                svgContainer.setAttribute('viewBox', `0 0 ${width} ${height}`);
            };

            // 首次调用 setViewBox 函数，设置 SVG 的 viewBox 属性
            setViewBox();
            // 设置 SVG 的 preserveAspectRatio 属性
            svgContainer.setAttribute('preserveAspectRatio', 'none');
            // 将 SVG 元素添加到游戏主面板中
            gamePanel.appendChild(svgContainer);

            // 如果窗口大小改变监听器还未添加，则添加该监听器
            if (!isResizeListenerAdded) {
                // 监听窗口大小改变事件，当窗口大小改变时调用 setViewBox 函数
                window.addEventListener('resize', setViewBox);
                // 标记窗口大小改变监听器已添加
                isResizeListenerAdded = true;
            }
        }

        // 根据攻击是否反向，确定攻击发起者的索引
        const originIndex = reversed ? to : from;
        // 调用 createEffect 函数，创建攻击特效
        createEffect(effectFrom, effectTo, hpDiff, originIndex, reversed);
    }

    // 处理伤害信息，根据新旧生命值计算伤害差值并创建动画
    /**
     * 处理伤害数据，根据旧的生命值数组和新的实体映射，计算生命值差值，并在满足条件时创建攻击线条。
     *
     * @param {Array} oldHPArr - 旧的生命值数组，存储每个实体的旧生命值。
     * @param {Object} newMap - 新的实体映射，键为实体索引，值为包含当前生命值（cHP）的实体对象。
     * @param {number} castIndex - 施法者的索引。
     * @param {Array} attackerIndices - 攻击者的索引数组。
     * @param {boolean} [isReverse=false] - 可选参数，指示攻击方向是否反转。
     */
    function processDamage(oldHPArr, newMap, castIndex, attackerIndices, isReverse = false) {
        // 遍历旧的生命值数组
        oldHPArr.forEach((oldHP, index) => {
            // 从新的实体映射中获取对应索引的实体
            const entity = newMap[index];
            // 如果实体不存在，则跳过当前循环
            if (!entity) return;

            // 计算旧生命值和当前生命值的差值
            const hpDiff = oldHP - entity.cHP;
            // 更新旧生命值数组中的值为当前生命值
            oldHPArr[index] = entity.cHP;

            // 如果生命值差值大于 0 且攻击者索引数组不为空
            if (hpDiff > 0 && attackerIndices.length > 0) {
                // 如果攻击者索引数组长度大于 1
                if (attackerIndices.length > 1) {
                    // 遍历攻击者索引数组
                    attackerIndices.forEach(attackerIndex => {
                        // 如果攻击者索引等于施法者索引
                        if (attackerIndex === castIndex) {
                            // 调用 createLine 函数创建攻击线条
                            createLine(attackerIndex, index, hpDiff, isReverse);
                        }
                    });
                } else {
                    // 如果攻击者索引数组长度为 1，直接调用 createLine 函数创建攻击线条
                    createLine(attackerIndices[0], index, hpDiff, isReverse);
                }
            }
        });
    }

    // 检测施法者，通过比较新旧魔法值找出施法者索引
    function detectCaster(oldMPArr, newMap) {
        let casterIndex = -1;
        Object.keys(newMap).forEach(index => {
            const newMP = newMap[index].cMP;
            if (newMP < oldMPArr[index]) {
                casterIndex = index;
            }
            oldMPArr[index] = newMP;
        });
        return casterIndex;
    }

    // 处理 WebSocket 消息，根据消息类型更新战斗状态并创建攻击动画
    function handleMessage(message) {
        if (isPaused) {
            return message;
        }

        let obj;
        try {
            obj = JSON.parse(message);
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            return message;
        }

        if (obj && obj.type === "new_battle") {
            battleState.monstersHP = obj.monsters.map((monster) => monster.currentHitpoints);
            battleState.monstersMP = obj.monsters.map((monster) => monster.currentManapoints);
            battleState.playersHP = obj.players.map((player) => player.currentHitpoints);
            battleState.playersMP = obj.players.map((player) => player.currentManapoints);

            const svg = document.getElementById('svg-container');
            if (svg) {
                while (svg.firstChild) {
                    svg.removeChild(svg.firstChild);
                }
            }
            particlePool.length = 0;
            
            // 在新战斗开始时应用隐藏数字设置
            if (effectDrawEnabled[5]) {
                setTimeout(() => toggleDamageNumbers(true), 100);
            }
        } else if (obj && obj.type === "battle_updated" && battleState.monstersHP.length) {
            const mMap = obj.mMap;
            const pMap = obj.pMap;
            const monsterIndices = Object.keys(obj.mMap);
            const playerIndices = Object.keys(obj.pMap);

            const castMonster = detectCaster(battleState.monstersMP, mMap);
            const castPlayer = detectCaster(battleState.playersMP, pMap);

            processDamage(battleState.monstersHP, mMap, castPlayer, playerIndices, false);
            processDamage(battleState.playersHP, pMap, castMonster, monsterIndices, true);
            
            // 在战斗更新时应用隐藏数字设置
            if (effectDrawEnabled[5]) {
                toggleDamageNumbers(true);
            } else {
                toggleDamageNumbers(false);
            }
        }

        return message;
    }

    // 检测网页是否从后台恢复，当网页从后台恢复时清理 SVG 容器中的元素
    function addVisibilityChangeListener() {
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                isPaused = true;
            } else if (document.visibilityState === 'visible') {
                isPaused = false;
                const svg = document.getElementById('svg-container');
                if (svg) {
                    while (svg.firstChild) {
                        svg.removeChild(svg.firstChild);
                    }
                }
                document.querySelectorAll('[id^="mwi-hit-tracker-"]').forEach(el => {
                    if (el) {
                        el.remove();
                    }
                });
                document.querySelectorAll('circle[fill^="rgba"]').forEach(el => {
                    if (el.parentNode === svg) {
                        el.parentNode.removeChild(el);
                    }
                });
            }
        });
    }

    // 启动初始化函数
    init();

    // 添加弹道拖尾创建函数
    /**
     * 创建弹道拖尾效果
     * @param {number} x - 拖尾图片的x坐标
     * @param {number} y - 拖尾图片的y坐标
     * @param {number} halfSize - 图片半尺寸，用于居中定位
     * @param {number} size - 图片尺寸
     * @param {string} imageUrl - 图片URL
     * @param {number} angle - 旋转角度
     */
    function createProjectileTrail(x, y, halfSize, size, imageUrl, angle) {
        if (isPaused) return;
        
        // 获取SVG容器
        const svg = document.getElementById('svg-container');
        if (!svg) return;
        
        // 获取参数
        const params = window.hitTrackerEffectParams || {};
        const fadeTime = params.projectileTrailFadeTime || 300; // 默认300ms
        const trailCount = params.projectileTrailCount || 5; // 默认拖尾数量
        
        // 创建克隆的图片元素作为拖尾
        const trailImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
        trailImage.setAttribute("href", imageUrl);
        trailImage.setAttribute("width", size);
        trailImage.setAttribute("height", size);
        trailImage.setAttribute("x", x - halfSize);
        trailImage.setAttribute("y", y - halfSize);
        
        // 应用相同的旋转
        if (angle !== 0) {
            trailImage.setAttribute("transform", `rotate(${angle}, ${x}, ${y})`);
        }
        
        // 控制拖尾数量
        const existingTrails = svg.querySelectorAll('.projectile-trail');
        if (existingTrails.length >= trailCount) {
            // 如果拖尾数量超过设定值，移除最早创建的拖尾
            const oldestTrail = existingTrails[0];
            if (oldestTrail && oldestTrail.parentNode) {
                oldestTrail.parentNode.removeChild(oldestTrail);
            }
        }
        
        // 添加类名以便管理
        trailImage.classList.add('projectile-trail');
        
        // 设置初始透明度
        trailImage.style.opacity = '0.7';
        
        // 添加到SVG
        svg.appendChild(trailImage);
        
        // 设置淡出效果
        setTimeout(() => {
            trailImage.style.transition = `opacity ${fadeTime}ms linear`;
            trailImage.style.opacity = '0';
            
            // 淡出后移除
            setTimeout(() => {
                if (trailImage.parentNode) {
                    trailImage.parentNode.removeChild(trailImage);
                }
            }, fadeTime);
        }, 10);
    }

    // 打开玩家专属图片上传器
    function openPlayerImageUploader(playerIndex, previewElement, checkboxElement) {
        // 创建文件输入框
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // 处理文件选择
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                // 处理图片上传，不更改勾选框状态
                processPlayerImage(file, playerIndex, previewElement, null);
            }
            // 移除文件输入框
            document.body.removeChild(fileInput);
        });
        
        // 处理取消选择
        fileInput.addEventListener('cancel', () => {
            document.body.removeChild(fileInput);
        });
        
        // 触发文件选择对话框
        fileInput.click();
    }
    
    // 处理玩家专属图片
    function processPlayerImage(file, playerIndex, previewElement, checkboxElement) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 获取自定义图片大小参数
                const params = window.hitTrackerEffectParams || {};
                const targetSize = params.projectileSize || 40; // 默认40px
                
                // 创建canvas来调整图片大小
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 计算等比例缩放尺寸
                let width = img.width;
                let height = img.height;
                let scale;
                
                // 确定哪个边是最短的，并根据最短边计算缩放比例
                if (width < height) {
                    // 宽度是最短边
                    scale = targetSize / width;
                    width = targetSize;
                    height = Math.round(height * scale);
                } else {
                    // 高度是最短边或宽高相等
                    scale = targetSize / height;
                    height = targetSize;
                    width = Math.round(width * scale);
                }
                
                // 设置画布尺寸为缩放后的尺寸
                canvas.width = width;
                canvas.height = height;
                
                // 绘制并调整图片大小
                ctx.drawImage(img, 0, 0, width, height);
                
                // 转换为dataURL
                const dataURL = canvas.toDataURL('image/png');
                
                // 保存到玩家设置
                playerProjectileImages[playerIndex] = dataURL;
                
                // 更新预览
                if (previewElement) {
                    const previewImg = previewElement.querySelector('img');
                    if (previewImg) {
                        previewImg.src = dataURL;
                    } else {
                        const newImg = document.createElement('img');
                        newImg.src = dataURL;
                        newImg.style.maxWidth = '100%';
                        newImg.style.maxHeight = '100%';
                        previewElement.appendChild(newImg);
                    }
                }
                
                // 保存设置，但不修改勾选框状态
                saveSettings();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 创建浮动伤害数字效果
    function createFloatingNumber(x, y, damage, color) {
        if (isPaused || !effectDrawEnabled[6]) return;
        
        const svg = document.getElementById('svg-container');
        if (!svg) return;
        
        // 获取自定义参数
        const params = window.hitTrackerEffectParams || {};
        const duration = params.floatingDuration || 1000; // 默认1000ms
        const fontSize = params.floatingFontSize || 30; // 默认字号30px
        const strokeWidth = params.floatingStrokeWidth || 2; // 默认描边宽度2px
        const strokeColor = params.floatingStrokeColor || '#FFFFFF'; // 默认描边颜色白色
        const riseHeight = params.floatingRiseHeight || 20; // 默认上升高度20px
        const opacityDelay = params.floatingOpacityDelay || 50; // 默认透明度延迟50%
        
        // 创建文本元素
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = damage; // 设置伤害数值
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle'); // 文本居中对齐
        text.setAttribute('font-size', fontSize);
        text.setAttribute('font-weight', 'bold'); // 添加字体加粗
        text.setAttribute('fill', color);
        
        // 设置描边
        if (strokeWidth > 0) {
            text.setAttribute('stroke', strokeColor);
            text.setAttribute('stroke-width', strokeWidth);
            text.setAttribute('paint-order', 'stroke fill');
        }
        
        svg.appendChild(text);
        
        // 动画
        let startTime = null;
        
        function animateFloating(timestamp) {
            if (isPaused) return;
            
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 计算当前位置（上升效果）
            const currentY = y - (progress * riseHeight);
            text.setAttribute('y', currentY);
            
            // 计算不透明度（后半段渐渐消失）
            let opacity = 1;
            // 使用不透明度延迟参数，例如：50%表示动画进行到50%时才开始降低不透明度
            const opacityDelayPoint = opacityDelay / 100;
            if (progress > opacityDelayPoint) {
                // 重新映射进度以实现延迟效果
                const fadeProgress = (progress - opacityDelayPoint) / (1 - opacityDelayPoint);
                opacity = 1 - fadeProgress;
            }
            text.setAttribute('opacity', opacity);
            
            if (progress < 1) {
                requestAnimationFrame(animateFloating);
            } else {
                text.remove();
            }
        }
        
        requestAnimationFrame(animateFloating);
    }

    // 切换伤害数字显示/隐藏
    function toggleDamageNumbers(hide) {
        const splatsContainers = document.querySelectorAll('.CombatUnit_splatsContainer__2xcc0');
        splatsContainers.forEach(container => {
            container.style.visibility = hide ? 'hidden' : 'visible';
        });
    }

})();

