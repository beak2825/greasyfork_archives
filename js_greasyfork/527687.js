// ==UserScript==
// @name         B站循环助手-增强版
// @namespace    bilibili-replayer
// @version      1.64
// @description  稳定可靠的AB点循环工具，适配最新B站页面结构
// @author       lily
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://www.bilibili.com/medialist/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/527687/B%E7%AB%99%E5%BE%AA%E7%8E%AF%E5%8A%A9%E6%89%8B-%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527687/B%E7%AB%99%E5%BE%AA%E7%8E%AF%E5%8A%A9%E6%89%8B-%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储管理
    const Storage = {
        savePoint: (index, value) => {
            try {
                GM_setValue(`Point_${index}`, value);
                return true;
            } catch (e) {
                console.error('保存点位失败:', e);
                return false;
            }
        },
        getPoint: (index) => {
            try {
                return GM_getValue(`Point_${index}`, null);
            } catch (e) {
                console.error('获取点位失败:', e);
                return null;
            }
        },
        savePreset: (name, points) => {
            const prefixedName = name.startsWith('AB_') ? name : `AB_${name}`;
            GM_setValue(prefixedName, [...points]);
        },
        renamePreset: (oldName, newName) => {
            // 获取旧预设的数据
            const oldPrefixedName = `AB_${oldName}`;
            const points = GM_getValue(oldPrefixedName);
            if (points) {
                // 保存新名称的预设
                const newPrefixedName = `AB_${newName}`;
                GM_setValue(newPrefixedName, points);
                // 删除旧预设
                GM_deleteValue(oldPrefixedName);
                return true;
            }
            return false;
        },
        getAllPresets: () => {
            const allKeys = GM_listValues().filter(k => k.startsWith('AB_'));
            return allKeys.map(k => ({
                name: k.replace('AB_', ''),
                value: GM_getValue(k)
            }));
        },
        deletePreset: (name) => GM_deleteValue(`AB_${name}`),
        getNextPresetName: () => {
            const presets = Storage.getAllPresets();
            const existingNumbers = presets
               .map(p => parseInt(p.name.replace('AB', '')))
               .sort((a, b) => a - b);

            // 从1开始查找第一个不存在的数字
            let i = 1;
            while (existingNumbers.includes(i)) {
                i++;
            }
            return `AB${i}`;
        }
    };

    // 工具函数
    const Utils = {
        createButton(text, className, parent) {
            const button = document.createElement('div');
            className.split(' ').forEach(c => button.classList.add(c));
            button.innerText = text;
            parent.appendChild(button);
            return button;
        },

        showNotification(text, duration = 2000) {
            // 创建或获取提示容器
            let container = document.querySelector('.bilibili-ab-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'bilibili-ab-toast-container';
                document.querySelector('#bilibili-player').appendChild(container);
            }

            // 创建新的提示
            const toast = document.createElement('div');
            toast.className = 'bilibili-ab-toast';
            toast.textContent = text;

            // 添加到容器
            container.appendChild(toast);

            // 触发动画
            setTimeout(() => toast.classList.add('show'), 10);

            // 延迟后移除
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        },
        createPresetPanel(controller, saveBtn) {
            const panel = document.createElement('div');
            panel.className = 'bilibili-ab-preset-panel';
            panel.style.cssText = `
                position: absolute;
                bottom: 25px;
                left: 0;
                background: rgba(0,0,0,0.8);
                border-radius: 4px;
                padding: 8px;
                min-width: 120px;
                display: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            `;

            const toolbar = document.querySelector('.ab-loop-toolbar');
            toolbar.appendChild(panel);

            let isHoveringPanel = false;
            panel.addEventListener('mouseenter', () => isHoveringPanel = true);
            panel.addEventListener('mouseleave', () => {
                isHoveringPanel = false;
                panel.style.display = 'none';
            });

            // 当前选中的预设
            let currentPreset = null;
            let isRenaming = false;
            let renamingPreset = null;

            // 使用事件委托处理双击
            panel.addEventListener('dblclick', (e) => {
                const nameSpan = e.target.closest('.preset-name');
                if (!nameSpan || isRenaming) return;

                e.stopPropagation();
                isRenaming = true;
                renamingPreset = nameSpan.dataset.name;

                const input = document.createElement('input');
                input.type = 'text';
                input.value = renamingPreset;
                input.className = 'rename-input';
                input.style.cssText = `
                    background: transparent;
                    border: none;
                    color: white;
                    width: 60px;
                    padding: 0;
                    font-size: inherit;
                    outline: none;
                    border-bottom: 1px solid #00a1d6;
                `;

                // 替换原有内容
                nameSpan.textContent = '';
                nameSpan.appendChild(input);
                input.focus();

                // 处理输入框事件
                input.addEventListener('blur', finishRenaming);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        finishRenaming(e);
                    } else if (e.key === 'Escape') {
                        isRenaming = false;
                        updateList();
                    }
                });
            });

            // 更新预设列表，移除独立的双击事件绑定
            const updateList = () => {
                panel.innerHTML = Storage.getAllPresets().map(preset => `
                    <div class="preset-item ${currentPreset === preset.name ? 'active-preset' : ''}" 
                         data-name="${preset.name}">
                        <span class="preset-name" data-name="${preset.name}">${preset.name}</span>
                        <span class="delete-btn" data-name="${preset.name}">×</span>
                    </div>
                `).join('');
            };

            const finishRenaming = (e) => {
                if (!isRenaming) return;

                const input = e.target;
                const newName = input.value.trim();
                if (newName && newName !== renamingPreset) {
                    if (Storage.renamePreset(renamingPreset, newName)) {
                        if (currentPreset === renamingPreset) {
                            currentPreset = newName;
                        }
                        Utils.showNotification(`已重命名为 ${newName}`);
                    }
                }
                isRenaming = false;
                renamingPreset = null;
                updateList();
            };

            // 处理预设点击事件
            panel.addEventListener('click', (e) => {
                const presetItem = e.target.closest('.preset-item');
                const deleteBtn = e.target.closest('.delete-btn');

                if (deleteBtn) {
                    const presetName = deleteBtn.dataset.name;
                    Storage.deletePreset(presetName);
                    if (currentPreset === presetName) {
                        currentPreset = null;
                        controller.resetPoints(); // 重置点位
                    }
                    updateList();
                    Utils.showNotification(`已删除 ${presetName}`);
                } else if (presetItem) {
                    const presetName = presetItem.dataset.name;
                    const preset = Storage.getAllPresets().find(p => p.name === presetName);

                    if (currentPreset === presetName) {
                        // 如果再次点击当前选中的预设，则取消选中
                        currentPreset = null;
                        controller.resetPoints(); // 重置点位
                    } else if (preset) {
                        // 选中新的预设
                        currentPreset = presetName;
                        // 直接使用预设中保存的点位数据
                        controller.points = [...preset.value];
                        // 激活AB点按钮
                        controller.pointButtons.forEach((btn, index) => {
                            if (preset.value[index] !== null && preset.value[index] !== undefined) {
                                btn.classList.add('active-button');
                            } else {
                                btn.classList.remove('active-button');
                            }
                        });
                    }
                    updateList();
                }
            });

            // 显示/隐藏面板
            saveBtn.addEventListener('mouseenter', () => {
                panel.style.display = 'block';
            });

            saveBtn.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    if (!isHoveringPanel) {
                        panel.style.display = 'none';
                    }
                }, 200);
            });

            // 初始化更新
            updateList();
            return { panel, updateList };
        }
    };

    class VideoController {
        constructor(video) {
            this.video = video;
            this.points = [0, video.duration - 1];
            this.pointButtons = [];
            this.intervalId = null;
        }

        setPoint(index, value) {
            if (this.pointButtons[index].classList.contains('active-button')) {
                this.points[index] = index ? this.video.duration - 1 : 0;
                this.pointButtons[index].classList.remove('active-button');
                Storage.savePoint(index, null);
            } else {
                this.points[index] = value;
                this.pointButtons[index].classList.add('active-button');
                Storage.savePoint(index, this.points[index]);
            }
        }

        startLoop(button) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                button.innerText = '⯈循环';
                return;
            }

            // 确定 A、B 点的正确顺序
            const A = this.points[0] <= this.points[1] ? this.points[0] : this.points[1];
            const B = this.points[0] > this.points[1] ? this.points[0] : this.points[1];

            // 开始循环前检查当前位置
            if (this.video.currentTime < A || this.video.currentTime >= B) {
                this.video.currentTime = A;
            }

            button.innerText = '⯀停止';
            this.intervalId = setInterval(() => {
                if (this.video.currentTime >= B) {
                    this.video.currentTime = A;
                }
            }, 200);
        }

        resetPoints() {
            this.points = [0, this.video.duration - 1];
            this.pointButtons.forEach(btn => btn.classList.remove('active-button'));
        }
    }

    const createToolbar = () => {
        let retryCount = 0;
        const maxRetries = 50;

        const tryCreate = () => {
            const video = document.querySelector('#bilibili-player video');
            const controlBar = document.querySelector('.bpx-player-control-bottom, .bpx-player-control-wrap');

            if (!video || !controlBar || getComputedStyle(controlBar).visibility === 'hidden') {
                retryCount++;
                if (retryCount < maxRetries) {
                    setTimeout(tryCreate, 300);
                }
                return;
            }

            const controller = new VideoController(video);

            // 创建工具栏容器
            const toolbarbox = document.createElement('div');
            toolbarbox.className = 'ab-loop-toolbar';

            // 设置基础样式
            toolbarbox.style.cssText = `
                display: -webkit-flex; /* Safari */
                display: flex;
                align-items: center;
                height: 12px;
                background-color: rgba(0, 0, 0, 0.35);
                border-radius: 4px;
                padding: 0 5px;
                box-sizing: border-box;
                margin-top: 5px;
                z-index: 99999 !important;
            `;

            // 创建自定义样式
            const style = document.createElement('style');
            style.textContent = `
                .tool-item {
                    padding: 0 6px;
                    margin: 0 1px;
                    height: 12px;
                    line-height: 12px;
                    color: #ffffff;
                    cursor: pointer;
                    opacity: 0.85;
                    transition: all 0.2s ease;
                    border-radius: 2px;
                    user-select: none;
                }
                .tool-button:hover {
                    opacity: 1;
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .active-button {
                    background-color: #00a1d6 !important;
                    color: white !important;
                    opacity: 1 !important;
                }
                .preset-panel::-webkit-scrollbar {
                    width: 4px;
                    background: transparent;
                }
                .preset-panel::-webkit-scrollbar-thumb {
                    background: #555;
                }
                .delete-btn:hover {
                    color: #ff0000 !important;
                }
                .ab-loop-toolbar {
                    position: relative !important;
                }
                .bilibili-ab-preset-panel {
                    z-index: 10000 !important;
                }
                .preset-item {
                    display: flex;
                    align-items: center;
                    padding: 6px 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .preset-item:hover {
                    background: rgba(255,255,255,0.05);
                }
                .delete-btn {
                    margin-left: auto;
                    padding-left: 15px;
                    color: #ff5555;
                    opacity: 0.7;
                }
                .delete-btn:hover {
                    opacity: 1;
                }
                .active-preset {
                    background-color: #00a1d6 !important;
                    color: white !important;
                }
                .preset-name {
                    flex-grow: 1;
                    min-width: 60px;
                    cursor: pointer;
                }
                .rename-input {
                    background: transparent;
                    border: none;
                    color: white;
                    width: 60px;
                    padding: 0;
                    font-size: inherit;
                    outline: none;
                    border-bottom: 1px solid #00a1d6;
                }
                .bilibili-ab-toast-container {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 100000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    pointer-events: none;
                }

                .bilibili-ab-toast {
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.3s ease;
                }

                .bilibili-ab-toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);

                        // 将工具栏添加到播放栏中
            controlBar.appendChild(toolbarbox);

            // 创建按钮
            const pointA = Utils.createButton('🄰', 'tool-item tool-button', toolbarbox);
            const toA = Utils.createButton('跳A', 'tool-item tool-button', toolbarbox);

            Utils.createButton('|', 'tool-item tool-text', toolbarbox);
            const pointB = Utils.createButton('🄱', 'tool-item tool-button', toolbarbox);
            const toB = Utils.createButton('跳B', 'tool-item tool-button', toolbarbox);

            Utils.createButton('|', 'tool-item tool-text', toolbarbox);
            const Start = Utils.createButton('⯈循环', 'tool-item tool-button', toolbarbox);

            const saveBtn = Utils.createButton('存', 'tool-item tool-button', toolbarbox);
            const { panel, updateList } = Utils.createPresetPanel(controller, saveBtn);

            controller.pointButtons = [pointA, pointB];

            // 事件监听
            pointA.addEventListener('click', () => {
                controller.setPoint(0, video.currentTime);
            });

            pointB.addEventListener('click', () => {
                controller.setPoint(1, video.currentTime);
            });

            Start.addEventListener('click', () => controller.startLoop(Start));
            toA.addEventListener('click', () => { video.currentTime = controller.points[0]; });
            toB.addEventListener('click', () => { video.currentTime = controller.points[1]; });

            // 修改存储按钮的点击处理逻辑
            saveBtn.addEventListener('click', () => {
                const newName = Storage.getNextPresetName();
                Storage.savePreset(newName, [...controller.points]);
                updateList();
                Utils.showNotification(`已保存为 ${newName}`);
            });

            // 处理视频暂停和播放事件
            controller.video.addEventListener('pause', () => {
                if (controller.intervalId) {
                    clearInterval(controller.intervalId);
                    controller.intervalId = null;
                    Start.innerText = '⯈循环';
                }
            });

            controller.video.addEventListener('play', () => {
                if (!controller.intervalId && Start.innerText === '⯀停止') {
                    controller.startLoop(Start);
                }
            });
        };

        tryCreate();
    };

    // 检查页面加载状态
    if (document.readyState === 'complete') {
        createToolbar();
    } else {
        window.addEventListener('load', createToolbar);
    }
})();