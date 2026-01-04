// ==UserScript==
// @name         网页操作录制器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  记录并回放鼠标点击操作
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/520143/%E7%BD%91%E9%A1%B5%E6%93%8D%E4%BD%9C%E5%BD%95%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520143/%E7%BD%91%E9%A1%B5%E6%93%8D%E4%BD%9C%E5%BD%95%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let recording = false;
    let actions = [];
    let startTime;
    let isRunning = false;
    let stopRunning = false;
    let abortController = null;
    let editModeRecording = false;

    // 设置选项
    const settings = {
        opacity: parseFloat(localStorage.getItem('recorder_opacity')) || 0.8,
        useBlur: localStorage.getItem('recorder_use_blur') !== 'false',
        showClickAnimation: localStorage.getItem('recorder_show_click_animation') !== 'false',
        maxAnimations: parseInt(localStorage.getItem('recorder_max_animations')) || 10
    };

    const COLORS = {
        NORMAL: '#1890ff',
        NEW_ACTION: '#52c41a',
        ACTIVE: '#ff4d4f',
        TEXT: '#000' // 固定文字颜色
    };

    const CONSTANTS = {
        DRAG_DELAY: 200,
        Z_INDEX: {
            BASE: 2147483645,
            ACTIVE: 2147483646,
            EDIT_PANEL: 2147483647
        }
    };

    // 样式初始化
    function initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .top-edit-panel {
                position: fixed;
                top: 20px;
                left: 25%;
                background: rgba(255, 255, 255, ${settings.opacity});
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                z-index: ${CONSTANTS.Z_INDEX.EDIT_PANEL};
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                width: 50vw;
                max-height: 80vh;
                overflow-y: auto;
                cursor: move;
                resize: none;
                color: ${COLORS.TEXT}; // 固定文字颜色
                ${settings.useBlur ? 'backdrop-filter: blur(4px);' : ''}
            }

            .point-item {
                display: flex;
                align-items: center;
                padding: 8px 10px;
                background: rgba(245, 245, 245, 0.7);
                border-radius: 4px;
                cursor: pointer;
                width: 170px;
                color: ${COLORS.TEXT}; // 固定文字颜色
            }

            .point-item.active {
                background: rgba(23, 144, 255, 0.7);
            }

            .edit-point {
                width: 24px;
                height: 24px;
                min-width: 24px;
                background: ${COLORS.NORMAL};
                border-radius: 50%;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .point-item.active .edit-point {
                background: ${COLORS.ACTIVE};
            }

            .point-data {
                display: flex;
                align-items: center;
                margin: 4px 0;
                cursor: pointer;
            }

            .point-input {
                width: 60px;
                padding: 4px 6px;
                margin: 0 4px;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                font-size: 12px;
                cursor: pointer;
            }

            .point-input:focus {
                outline: none;
            }

            .click-point {
                position: fixed;
                width: 20px;
                height: 20px;
                background: #1890ff;
                border: 1px solid #000;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: ${CONSTANTS.Z_INDEX.BASE};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
                font-weight: bold;
                cursor: move;
                user-select: none;
                opacity: 0.8;
            }

            .click-point.active {
                background: #ff4d4f;
                z-index: ${CONSTANTS.Z_INDEX.ACTIVE};
                opacity: 1;
                box-shadow: 0 0 12px rgba(255, 77, 79, 0.8);
            }

            .click-point:hover {
                opacity: 1;
            }

            .click-effect {
                position: fixed;
                pointer-events: none;
                width: 20px;
                height: 20px;
                background: rgba(255, 77, 79, 0.8);
                border: 2px solid rgba(255, 77, 79, 0.9);
                border-radius: 50%;
                z-index: ${CONSTANTS.Z_INDEX.BASE - 1};
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
                display: none;
                left: var(--x);
                top: var(--y);
            }

            .click-effect.active {
                display: block;
                animation: clickEffect 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
            }

            @keyframes clickEffect {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.3);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(2);
                }
            }

            .toast-message {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                z-index: ${CONSTANTS.Z_INDEX.EDIT_PANEL};
                pointer-events: none;
                animation: fadeOut 1.5s ease-in-out forwards;
            }

            .custom-checkbox {
                appearance: none;
                width: 14px;
                height: 14px;
                border: 2px solid ${COLORS.NORMAL};
                border-radius: 2px;
                margin: 0;
                cursor: pointer;
                position: relative;
                transition: background-color 0.2s;
                pointer-events: all;
            }

            .custom-checkbox:checked {
                background: ${COLORS.NORMAL};
            }

            .custom-checkbox:checked::after {
                content: '';
                position: absolute;
                left: 2px;
                top: 0px;
                width: 3px;
                height: 7px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            .checkbox-wrapper {
                width: 14px;
                height: 14px;
                position: relative;
                pointer-events: none;
            }

            .checkbox-wrapper input {
                pointer-events: all;
            }

            .checkbox-wrapper + span {
                pointer-events: none;
            }

            .click-point.dragging {
                cursor: grabbing;
                opacity: 0.8;
                box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.8), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 16px rgba(0, 0, 0, 0.5);
            }

            .scheme-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 13px;
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 2px;
                color: ${COLORS.TEXT}; // 固定文字颜色
            }

            .scheme-name:hover {
                background: rgba(0, 0, 0, 0.05);
            }

            .scheme-name-input {
                width: 100%;
                font-size: 13px;
                padding: 2px 4px;
                border: 1px solid #1890ff;
                border-radius: 2px;
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    // 点击效果管理器
    const ClickEffectManager = {
        activeEffects: new Set(),
        effectPool: [],
        poolSize: 20, // 对象池大小

        init() {
            // 初始化对象池
            for (let i = 0; i < this.poolSize; i++) {
                const effect = this.createEffectElement();
                const innerEffect = this.createEffectElement(true);
                this.effectPool.push({
                    effect,
                    innerEffect,
                    inUse: false
                });
            }
        },

        createEffectElement(isInner = false) {
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            if (isInner) {
                effect.style.animation = 'clickEffect 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards';
                effect.style.background = 'rgba(255, 77, 79, 0.4)';
                effect.style.border = '2px solid rgba(255, 77, 79, 0.6)';
            }
            effect.style.display = 'none';
            document.body.appendChild(effect);
            return effect;
        },

        getFromPool() {
            // 从池中获取可用的效果元素
            let poolItem = this.effectPool.find(item => !item.inUse);

            // 如果池中没有可用元素，创建新的
            if (!poolItem) {
                const effect = this.createEffectElement();
                const innerEffect = this.createEffectElement(true);
                poolItem = {
                    effect,
                    innerEffect,
                    inUse: false
                };
                this.effectPool.push(poolItem);
            }

            poolItem.inUse = true;
            return poolItem;
        },

        returnToPool(poolItem) {
            // 重置元素状态并返回池中
            const { effect, innerEffect } = poolItem;
            effect.style.display = 'none';
            effect.classList.remove('active');
            innerEffect.style.display = 'none';
            innerEffect.classList.remove('active');
            poolItem.inUse = false;
            this.activeEffects.delete(effect);
            this.activeEffects.delete(innerEffect);
        },

        show(x, y) {
            if (!settings.showClickAnimation) return;

            // 检查是否超过最大动画数量限制
            if (settings.maxAnimations > 0 && this.activeEffects.size >= settings.maxAnimations) {
                const oldestEffect = this.activeEffects.values().next().value;
                if (oldestEffect) {
                    const poolItem = this.effectPool.find(item =>
                        item.effect === oldestEffect || item.innerEffect === oldestEffect
                    );
                    if (poolItem) {
                        this.returnToPool(poolItem);
                    }
                }
            }

            // 从对象池获取效果元素
            const poolItem = this.getFromPool();
            const { effect, innerEffect } = poolItem;

            // 设置位置
            effect.style.setProperty('--x', `${x}px`);
            effect.style.setProperty('--y', `${y}px`);
            innerEffect.style.setProperty('--x', `${x}px`);
            innerEffect.style.setProperty('--y', `${y}px`);

            // 显示效果
            effect.style.display = 'block';
            innerEffect.style.display = 'block';
            this.activeEffects.add(effect);
            this.activeEffects.add(innerEffect);

            // 启动动画
            requestAnimationFrame(() => {
                effect.classList.add('active');
                innerEffect.classList.add('active');
            });

            // 动画结束后回收到对象池
            effect.addEventListener('animationend', () => {
                this.returnToPool(poolItem);
            }, { once: true });
        },

        cleanup() {
            // 清理所有效果元素
            this.effectPool.forEach(({ effect, innerEffect }) => {
                effect.remove();
                innerEffect.remove();
            });
            this.effectPool = [];
            this.activeEffects.clear();
        }
    };

    // 点击点管理器
    const ClickPointManager = {
        points: new Map(),
        activePoint: null,

        init() {
            // 初始化全局点击事件监听
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.click-point')) {
                    this.clearActivePoint();
                }
            });
        },

        createPoints(actions) {
            this.cleanup();
            actions.forEach((action, index) => {
                const point = this.createSinglePoint(action, index);
                this.points.set(index, point);
                document.body.appendChild(point);
            });
        },

        createSinglePoint(action, index) {
            const point = document.createElement('div');
            point.className = 'click-point edit-mode';
            point.setAttribute('data-point-index', index);
            point.textContent = index + 1;
            point.style.left = action.x + 'px';
            point.style.top = action.y + 'px';

            this.initDragEvents(point);
            return point;
        },

        initDragEvents(point) {
            let offsetX, offsetY;

            const onMouseMove = (e) => {
                e.preventDefault();
                requestAnimationFrame(() => {
                    point.style.left = (e.clientX - offsetX) + 'px';
                    point.style.top = (e.clientY - offsetY) + 'px';
                });
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.handleDragEnd();
            };

            const onMouseDown = (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();

                const rect = point.getBoundingClientRect();
                offsetX = e.clientX - rect.left - rect.width / 2;
                offsetY = e.clientY - rect.top - rect.height / 2;

                this.setActivePoint(point);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            point.addEventListener('mousedown', onMouseDown);
            point.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setActivePoint(point);
            });
        },

        handleDragEnd() {
            if (!this.activePoint) return;
            const index = parseInt(this.activePoint.getAttribute('data-point-index'));
            if (index >= 0 && index < actions.length) {
                actions[index].x = parseInt(this.activePoint.style.left);
                actions[index].y = parseInt(this.activePoint.style.top);
                EditManager.markAsChanged();
            }
        },

        setActivePoint(point) {
            this.clearActivePoint();
            this.activePoint = point;
            point.classList.add('active');

            // 高亮编辑界面对应的点
            const index = parseInt(point.getAttribute('data-point-index'));
            document.querySelectorAll('.point-item').forEach((item) => {
                const itemIndex = parseInt(item.getAttribute('data-point-index'));
                item.classList.toggle('active', itemIndex === index);
            });
        },

        clearActivePoint() {
            if (this.activePoint) {
                this.activePoint.classList.remove('active');
                this.activePoint = null;
            }
            document.querySelectorAll('.point-item').forEach(item => {
                item.classList.remove('active');
            });
        },

        cleanup() {
            this.points.forEach(point => point.remove());
            this.points.clear();
            this.activePoint = null;
        },

        addNewPoint(action, index) {
            const point = this.createSinglePoint(action, index);
            this.points.set(index, point);
            document.body.appendChild(point);
            return point;
        }
    };

    // 存储管理器
    const StorageManager = {
        STORAGE_KEY: 'recordSchemes',
        cache: null,
        saveTimeout: null,
        initialized: false,

        // 初始化缓存
        init() {
            if (this.initialized) return;
            this.cache = this.loadFromStorage();
            this.initialized = true;
        },

        // 从localStorage加载数据
        loadFromStorage() {
            try {
                return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            } catch (error) {
                console.error('Failed to load schemes from storage:', error);
                return {};
            }
        },

        // 将缓存保存到localStorage
        saveToStorage() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cache));
                return true;
            } catch (error) {
                console.error('Failed to save schemes to storage:', error);
                return false;
            }
        },

        // 延迟保存，防止频繁写入
        debounceSave() {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }
            this.saveTimeout = setTimeout(() => {
                this.saveToStorage();
                this.saveTimeout = null;
            }, 300); // 300ms延迟
        },

        // 获取所有方案
        getAllSchemes() {
            this.init();
            return this.cache;
        },

        // 获取单个方案
        getScheme(name) {
            this.init();
            return this.cache[name];
        },

        // 保存单个方案
        saveScheme(name, scheme) {
            this.init();
            this.cache[name] = scheme;
            this.debounceSave();
        },

        // 批量保存方案
        saveSchemeBatch(schemes) {
            this.init();
            Object.assign(this.cache, schemes);
            this.debounceSave();
        },

        // 删除方案
        deleteScheme(name) {
            this.init();
            delete this.cache[name];
            this.debounceSave();
        },

        // 重命名方案
        renameScheme(oldName, newName) {
            this.init();
            if (this.cache[oldName]) {
                this.cache[newName] = this.cache[oldName];
                delete this.cache[oldName];
                this.debounceSave();
                return true;
            }
            return false;
        },

        // 更新方案的特定字段
        updateSchemeField(name, field, value) {
            this.init();
            const scheme = this.cache[name];
            if (scheme) {
                scheme[field] = value;
                this.debounceSave();
                return true;
            }
            return false;
        },

        // 创建新方案
        createScheme(name, data) {
            this.init();
            const scheme = {
                actions: data.actions || [],
                timestamp: Date.now(),
                site: window.location.hostname,
                infiniteLoop: data.infiniteLoop || false,
                loopCount: data.loopCount || 1,
                loopDelay: data.loopDelay || 0,
                ...data
            };
            this.cache[name] = scheme;
            this.debounceSave();
            return scheme;
        },

        // 强制立即保存
        forceSave() {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
                this.saveTimeout = null;
            }
            return this.saveToStorage();
        },

        // 清除缓存
        clearCache() {
            this.cache = null;
            this.initialized = false;
        }
    };

    // 录制管理器
    const RecorderManager = {
        start() {
            actions = [];
            startTime = Date.now();
            recording = true;
            const recordToggleBtn = document.getElementById('recordToggle');
            recordToggleBtn.textContent = '停止录制';
            recordToggleBtn.style.background = '#ff4d4f';
            document.getElementById('record-status').style.background = '#ff0000';
        },

        stop() {
            recording = false;
            const recordToggleBtn = document.getElementById('recordToggle');
            recordToggleBtn.textContent = '开始录制';
            recordToggleBtn.style.background = '#52c41a';
            document.getElementById('record-status').style.background = '#ccc';
            if (actions.length > 0) {
                this.save();
                StorageManager.forceSave(); // 确保立即保存
            }
        },

        save() {
            const now = new Date();
            const defaultName = now.getFullYear() +
                        String(now.getMonth() + 1).padStart(2, '0') +
                        String(now.getDate()).padStart(2, '0') +
                        '_' +
                        String(now.getHours()).padStart(2, '0') +
                        ':' +
                        String(now.getMinutes()).padStart(2, '0') +
                        ':' +
                        String(now.getSeconds()).padStart(2, '0');

            StorageManager.createScheme(defaultName, { actions });
            updateSchemeList();
            showToast('保存成功');
        }
    };

    // 编辑管理器
    const EditManager = {
        currentPanelPosition: null,
        hasUnsavedChanges: false,
        initialState: null,

        enter(name, editBtn) {
            this.exit();
            this.hasUnsavedChanges = false;

            editBtn.textContent = '退出';
            editBtn.style.background = '#ff4d4f';
            editBtn.setAttribute('data-editing', 'true');

            const scheme = StorageManager.getScheme(name);
            actions = [...scheme.actions];

            this.initialState = {
                infiniteLoop: scheme.infiniteLoop,
                loopCount: scheme.loopCount,
                loopDelay: scheme.loopDelay,
                actions: JSON.stringify(actions)
            };

            this.createTopEditPanel(name, scheme);
            ClickPointManager.createPoints(actions);
        },

        markAsChanged() {
            this.hasUnsavedChanges = true;
        },

        exit() {
            const editBtn = document.querySelector('.edit-btn[data-editing="true"]');
            if (!editBtn) return;

            // 检查是否有实际改动
            const currentState = this.getCurrentState();
            const hasChanges = this.initialState && (
                currentState.infiniteLoop !== this.initialState.infiniteLoop ||
                currentState.loopCount !== this.initialState.loopCount ||
                currentState.loopDelay !== this.initialState.loopDelay ||
                currentState.actions !== this.initialState.actions
            );

            if (hasChanges) {
                this.saveEditState();
                StorageManager.forceSave(); // 确保立即保存
                showToast('已保存编辑');
            }

            // 保存当前面板位置
            const panel = document.querySelector('.top-edit-panel');
            if (panel) {
                this.currentPanelPosition = {
                    left: panel.style.left,
                    top: panel.style.top
                };
            }

            ClickPointManager.cleanup();
            document.querySelector('.top-edit-panel')?.remove();
            editBtn.textContent = '编辑';
            editBtn.style.background = '#52c41a';
            editBtn.removeAttribute('data-editing');
            editModeRecording = false;
            this.hasUnsavedChanges = false;
            this.initialState = null;
        },

        getCurrentState() {
            const infiniteLoop = document.querySelector('#infiniteLoop');
            const loopCount = document.querySelector('#loopCount');
            const loopDelay = document.querySelector('#loopDelay');

            return {
                infiniteLoop: infiniteLoop ? infiniteLoop.checked : false,
                loopCount: loopCount ? parseInt(loopCount.value) || 1 : 1,
                loopDelay: loopDelay ? parseInt(loopDelay.value) || 0 : 0,
                actions: JSON.stringify(actions)
            };
        },

        // 新增：更新点击点位置的通用方法
        updateClickPoints() {
            document.querySelectorAll('.click-point').forEach((point, index) => {
                if (index < actions.length) {
                    actions[index].x = parseInt(point.style.left);
                    actions[index].y = parseInt(point.style.top);
                }
            });
        },

        // 新增：保存方案的通用方法
        saveSchemeWithPoints(name, scheme) {
            this.updateClickPoints();
            scheme.actions = actions;
            StorageManager.saveScheme(name, scheme);
        },

        saveEditState() {
            const editBtn = document.querySelector('.edit-btn[data-editing="true"]');
            if (!editBtn) return;

            const name = editBtn.closest('[data-scheme]').getAttribute('data-scheme');
            const scheme = StorageManager.getScheme(name);

            // 更新循环设置
            const infiniteLoop = document.querySelector('#infiniteLoop');
            const loopCount = document.querySelector('#loopCount');
            const loopDelay = document.querySelector('#loopDelay');

            if (infiniteLoop && loopCount && loopDelay) {
                scheme.infiniteLoop = infiniteLoop.checked;
                scheme.loopCount = parseInt(loopCount.value) || 1;
                scheme.loopDelay = parseInt(loopDelay.value) || 0;
            }

            this.saveSchemeWithPoints(name, scheme);
        },

        createTopEditPanel(name, scheme) {
            const topPanel = document.createElement('div');
            topPanel.className = 'top-edit-panel';

            // 如果有保存的位置，应用它
            if (this.currentPanelPosition) {
                topPanel.style.left = this.currentPanelPosition.left;
                topPanel.style.top = this.currentPanelPosition.top;
            }

            // 应用全局设置的样式
            topPanel.style.background = `rgba(255, 255, 255, ${settings.opacity})`;
            topPanel.style.backdropFilter = settings.useBlur ? 'blur(4px)' : 'none';

            // 添加标题和按钮
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = `
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            `;

            const exitBtn = document.createElement('button');
            exitBtn.textContent = '退出编辑';
            exitBtn.style.cssText = `
                padding: 4px 12px;
                background: #ff4d4f;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            `;
            exitBtn.onclick = this.exit.bind(this);

            const addActionBtn = document.createElement('button');
            addActionBtn.textContent = '添加操作';
            addActionBtn.style.cssText = `
                padding: 4px 12px;
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 8px;
            `;

            addActionBtn.onclick = (e) => {
                e.stopPropagation();
                if (!editModeRecording) {
                    editModeRecording = true;
                    startTime = Date.now();
                    addActionBtn.textContent = '停止添加';
                    addActionBtn.style.background = '#ff4d4f';
                } else {
                    editModeRecording = false;
                    addActionBtn.textContent = '添加操作';
                    addActionBtn.style.background = '#1890ff';
                    if (actions.length > 0) {
                        this.markAsChanged();
                        // 保存当前面板位置
                        const panel = document.querySelector('.top-edit-panel');
                        if (panel) {
                            this.currentPanelPosition = {
                                left: panel.style.left,
                                top: panel.style.top
                            };
                        }
                        this.mergeActionsIntoScheme(name);
                    }
                }
            };

            headerDiv.appendChild(exitBtn);
            headerDiv.appendChild(addActionBtn);
            topPanel.appendChild(headerDiv);

            // 添加循环设置面板
            const loopSettingsDiv = document.createElement('div');
            loopSettingsDiv.style.cssText = `
                width: 100%;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 4px;
                margin-bottom: 10px;
            `;

            loopSettingsDiv.innerHTML = `
                <div style="font-size: 14px; margin-bottom: 8px;">循环设置</div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                        <input type="checkbox" id="infiniteLoop" class="custom-checkbox"
                            ${scheme.infiniteLoop ? 'checked' : ''}>
                        <span style="user-select: none;">无限循环</span>
                    </label>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span>循环次数:</span>
                        <input type="number" id="loopCount" value="${scheme.loopCount || 1}" min="1"
                            style="width: 60px; padding: 2px 4px;" ${scheme.infiniteLoop ? 'disabled' : ''}>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span>循环间隔:</span>
                        <input type="number" id="loopDelay" value="${scheme.loopDelay || 0}" min="0"
                            style="width: 60px; padding: 2px 4px;">
                        <span>ms</span>
                    </div>
                </div>
            `;

            topPanel.appendChild(loopSettingsDiv);

            // 添加点击点列表
            scheme.actions.forEach((action, index) => {
                const pointItem = this.createPointItem(action, index, name);
                topPanel.appendChild(pointItem);
            });

            document.body.appendChild(topPanel);
            this.addLoopSettingsListeners(name);
            makeElementDraggable(topPanel);
        },

        createPointItem(action, index, name) {
            const pointItem = document.createElement('div');
            pointItem.className = `point-item${action.isNewAction ? ' new-action' : ''}`;
            pointItem.setAttribute('data-point-index', index);
            pointItem.innerHTML = `
                <div class="edit-point">${index + 1}</div>
                <div style="display: flex; flex-direction: column; font-size: 12px; flex-grow: 1;">
                    <div class="point-data" data-point-index="${index}">
                        <span>次数: </span>
                        <input type="text" class="point-input" data-field="clickCount" value="${action.clickCount || 1}">
                    </div>
                    <div class="point-data" data-point-index="${index}">
                        <span>延迟: </span>
                        <input type="text" class="point-input" data-field="preDelay" value="${action.preDelay || 0}">
                        <span>ms</span>
                    </div>
                </div>
            `;

            // 添加输入框事件监听
            const inputs = pointItem.querySelectorAll('.point-input');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                });

                input.addEventListener('blur', (e) => {
                    if (e.target.value === '') {
                        e.target.value = '0';
                    }
                    const value = parseInt(e.target.value) || 0;
                    actions[index][input.dataset.field] = value;
                });
            });

            // 为每point-data添加点击事件
            const pointDatas = pointItem.querySelectorAll('.point-data');
            pointDatas.forEach(pointData => {
                pointData.addEventListener('click', handlePointClick);
                pointData.addEventListener('mousedown', handlePointClick);
            });

            // 为整point-item添加点击事件
            pointItem.addEventListener('click', handlePointClick);
            pointItem.addEventListener('mousedown', handlePointClick);

            function handlePointClick(e) {
                e.stopPropagation();
                const pointData = e.target.closest('.point-data') || e.target.closest('.point-item');
                if (!pointData) return;

                const index = parseInt(pointData.getAttribute('data-point-index'));
                const clickPoint = document.querySelector(`.click-point[data-point-index="${index}"]`);
                if (clickPoint) {
                    // 清除其他点位的高亮
                    document.querySelectorAll('.click-point').forEach(point => {
                        point.classList.remove('active');
                        point.style.zIndex = CONSTANTS.Z_INDEX.BASE;
                    });

                    // 高亮并置顶当前点位
                    clickPoint.classList.add('active');
                    clickPoint.style.zIndex = CONSTANTS.Z_INDEX.ACTIVE;

                    // 高亮编辑窗口中的点位
                    document.querySelectorAll('.point-item').forEach(item => {
                        const itemIndex = parseInt(item.getAttribute('data-point-index'));
                        item.classList.toggle('active', itemIndex === index);
                    });
                }
            }

            // 为输入框添加点击事件
            inputs.forEach(input => {
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                input.addEventListener('focus', (e) => {
                    const pointData = e.target.closest('.point-data');
                    if (pointData) {
                        handlePointClick(e);
                    }
                });
            });

            return pointItem;
        },

        mergeActionsIntoScheme(name) {
            const scheme = StorageManager.getScheme(name);

            // 清除新添加标记
            actions.forEach(action => {
                delete action.isNewAction;
            });

            this.saveSchemeWithPoints(name, scheme);
            showToast('操作已保存');

            // 重新进入编辑模式刷新界面
            const editBtn = document.querySelector(`[data-scheme="${name}"] .edit-btn`);
            this.exit();
            this.enter(name, editBtn);
        },

        addLoopSettingsListeners(name) {
            const infiniteLoop = document.querySelector('#infiniteLoop');
            const loopCount = document.querySelector('#loopCount');
            const loopDelay = document.querySelector('#loopDelay');

            infiniteLoop.addEventListener('change', (e) => {
                loopCount.disabled = e.target.checked;
                StorageManager.updateSchemeField(name, 'infiniteLoop', e.target.checked);
            });

            [loopCount, loopDelay].forEach(input => {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                });

                input.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    e.target.value = value;
                    StorageManager.updateSchemeField(name, e.target.id, value);
                });
            });
        }
    };

    // 运行管理器
    const RunManager = {
        async run(name, runBtn) {
            if (isRunning) {
                await this.stop(runBtn);
                return;
            }

            await this.saveEditState(name);
            EditManager.exit();

            const scheme = await this.start(name, runBtn);
            if (!scheme) return;

            try {
                await this.execute(scheme);
            } catch (error) {
                if (error.message !== 'Delay aborted') {
                    console.error('运行出错:', error);
                }
            } finally {
                await this.resetState(runBtn);
            }
        },

        async stop(runBtn) {
            stopRunning = true;
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
            isRunning = false;
            runBtn.textContent = '运行';
            runBtn.style.background = '#1890ff';
        },

        async start(name, runBtn) {
            const scheme = StorageManager.getScheme(name);
            if (!scheme) return null;

            isRunning = true;
            stopRunning = false;
            abortController = new AbortController();
            runBtn.textContent = '停止';
            runBtn.style.background = '#ff4d4f';

            return scheme;
        },

        async execute(scheme) {
            let loopCount = 0;
            while (!stopRunning && (scheme.infiniteLoop || loopCount < (scheme.loopCount || 1))) {
                if (loopCount > 0 && scheme.loopDelay) {
                    await this.interruptibleDelay(scheme.loopDelay);
                }

                await this.executeActions(scheme.actions);
                loopCount++;
            }
        },

        async executeActions(actions) {
            for (let action of actions) {
                if (stopRunning) break;
                await this.executeAction(action);
            }
        },

        async executeAction(action) {
            if (action.preDelay > 0) {
                await this.interruptibleDelay(action.preDelay);
            }

            const clickCount = action.clickCount || 1;
            for (let i = 0; i < clickCount; i++) {
                if (stopRunning) break;

                ClickEffectManager.show(action.x, action.y);
                const element = document.elementFromPoint(action.x, action.y);
                if (element) {
                    // 使用更底层的事件触发方法
                    const event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    element.dispatchEvent(event);
                }

                if (i < clickCount - 1) {
                    await this.interruptibleDelay(100);
                }
            }
        },

        async saveEditState(name) {
            const editBtn = document.querySelector(`[data-scheme="${name}"] .edit-btn`);
            if (editBtn?.textContent !== '退出') return;

            const topPanel = document.querySelector('.top-edit-panel');
            if (!topPanel) return;

            const scheme = StorageManager.getScheme(name);
            scheme.infiniteLoop = topPanel.querySelector('#infiniteLoop').checked;
            scheme.loopCount = parseInt(topPanel.querySelector('#loopCount').value) || 1;
            scheme.loopDelay = parseInt(topPanel.querySelector('#loopDelay').value) || 0;

            // 更新点击点位置
            document.querySelectorAll('.click-point').forEach((point, index) => {
                if (index < actions.length) {
                    actions[index].x = parseInt(point.style.left);
                    actions[index].y = parseInt(point.style.top);
                }
            });

            scheme.actions = actions;
            StorageManager.saveScheme(name, scheme);
        },

        async resetState(runBtn) {
            isRunning = false;
            stopRunning = false;
            abortController = null;
            runBtn.textContent = '运行';
            runBtn.style.background = '#1890ff';
        },

        interruptibleDelay(ms) {
            if (!abortController) {
                abortController = new AbortController();
            }
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(resolve, ms);
                abortController.signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    reject(new Error('Delay aborted'));
                });
            });
        }
    };

    // 工具函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
    }

    // 创建录制界面
    function createRecorderPanel() {
        console.log('创建录制界面');
        // 先移除可能存在的旧面板
        const oldPanel = document.getElementById('recorder-panel');
        if (oldPanel) {
            oldPanel.remove();
        }

        const recorder = document.createElement('div');
        recorder.id = 'recorder-panel';

        // 根据设置应用样式
        function applyPanelStyles(panel) {
            // 保存当前位置
            const currentStyles = {
                left: panel.style.left,
                top: panel.style.top,
                right: panel.style.right
            };

            // 应用新样式时保持原有置
            const newStyles = `
                position: fixed;
                top: ${currentStyles.top || '20px'};
                ${currentStyles.left ? `left: ${currentStyles.left};` : `right: ${currentStyles.right || '20px'};`}
                background: rgba(255, 255, 255, ${settings.opacity});
                border: 1px solid rgba(204, 204, 204, 0.3);
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.08);
                z-index: ${CONSTANTS.Z_INDEX.EDIT_PANEL};
                width: 280px;
                cursor: move;
                color: ${COLORS.TEXT}; // 固定文字颜色
                ${settings.useBlur ? 'backdrop-filter: blur(4px);' : ''}
            `;
            panel.style.cssText = newStyles;
        }
        applyPanelStyles(recorder);

        recorder.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div id="record-status" style="
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #ccc;
                    display: inline-block;
                    margin-right: 5px;
                "></div>
                <button id="recordToggle" style="
                    padding: 4px 12px;
                    background: #52c41a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                ">开始录制</button>
                <div style="flex-grow: 1"></div>
                <button id="settingsToggle" style="
                    padding: 4px 8px;
                    background: #1890ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-left: 8px;
                ">设置</button>
            </div>
            <div id="settingsPanel" style="
                display: none;
                padding: 10px;
                background: rgba(245, 245, 245, 0.7);
                border-radius: 4px;
                margin-bottom: 10px;
            ">
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <span>透明度:</span>
                        <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
                            <input type="range" id="opacitySlider" min="0" max="100" value="${settings.opacity * 100}"
                                style="flex: 1; min-width: 0;">
                            <span id="opacityValue" style="min-width: 36px; text-align: right;">${Math.round(settings.opacity * 100)}%</span>
                        </div>
                    </label>
                </div>
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <label class="checkbox-wrapper" style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="useBlurToggle" class="custom-checkbox" ${settings.useBlur ? 'checked' : ''}>
                        </label>
                        <span style="user-select: none;">启用毛玻璃效果</span>
                    </div>
                </div>
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <label class="checkbox-wrapper" style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="showAnimationToggle" class="custom-checkbox" ${settings.showClickAnimation ? 'checked' : ''}>
                        </label>
                        <span style="user-select: none;">显示点击动画</span>
                    </div>
                </div>
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; align-items: center; justify-content: space-between;">
                        <span>动画数量限制:</span>
                        <input type="number" id="maxAnimationsInput" value="${settings.maxAnimations}" min="0" max="50"
                            style="width: 60px; padding: 2px 4px; border: 1px solid #d9d9d9; border-radius: 2px;">
                        <span style="font-size: 12px; color: #666;">(0为不限制)</span>
                    </label>
                    <div style="font-size: 11px; color: #999; margin-top: 4px;">
                        点击频率过高时动画太多可能造成卡顿
                    </div>
                </div>
            </div>
            <div id="rightPanelSchemeList" style="
                max-height: 300px;
                overflow-y: auto;
            "></div>
        `;

        document.body.appendChild(recorder);
        console.log('录制界面已创建');

        // 初始化拖拽
        makeElementDraggable(recorder);

        // 初始化事件
        const recordToggleBtn = document.getElementById('recordToggle');
        const settingsToggleBtn = document.getElementById('settingsToggle');
        const settingsPanel = document.getElementById('settingsPanel');
        const opacitySlider = document.getElementById('opacitySlider');
        const opacityValue = document.getElementById('opacityValue');
        const useBlurToggle = document.getElementById('useBlurToggle');
        const showAnimationToggle = document.getElementById('showAnimationToggle');
        const maxAnimationsInput = document.getElementById('maxAnimationsInput');

        if (recordToggleBtn) {
            recordToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isEditing = editModeRecording || document.querySelector('.edit-btn[data-editing="true"]');
                if (isEditing) {
                    // 保存编辑状态
                    const editBtn = document.querySelector('.edit-btn[data-editing="true"]');
                    if (editBtn) {
                        const name = editBtn.closest('[data-scheme]').getAttribute('data-scheme');
                        const scheme = StorageManager.getScheme(name);

                        // 保存循环设置
                        const infiniteLoop = document.querySelector('#infiniteLoop');
                        const loopCount = document.querySelector('#loopCount');
                        const loopDelay = document.querySelector('#loopDelay');
                        if (infiniteLoop && loopCount && loopDelay) {
                            scheme.infiniteLoop = infiniteLoop.checked;
                            scheme.loopCount = parseInt(loopCount.value) || 1;
                            scheme.loopDelay = parseInt(loopDelay.value) || 0;
                        }

                        // 保存点击点的位置
                        document.querySelectorAll('.click-point').forEach((point, index) => {
                            if (index < actions.length) {
                                actions[index].x = parseInt(point.style.left);
                                actions[index].y = parseInt(point.style.top);
                            }
                        });

                        scheme.actions = actions;
                        StorageManager.saveScheme(name, scheme);
                    }

                    // 退出编辑模式
                    EditManager.exit();
                    editModeRecording = false;
                    recordToggleBtn.textContent = '开始录制';
                    recordToggleBtn.style.background = '#52c41a';
                    showToast('已保存编辑');
                } else if (recording) {
                    RecorderManager.stop();
                } else {
                    RecorderManager.start();
                }
            });
        }

        // 设置面板切换
        settingsToggleBtn.addEventListener('click', () => {
            const isHidden = settingsPanel.style.display === 'none';
            settingsPanel.style.display = isHidden ? 'block' : 'none';
            settingsToggleBtn.style.background = isHidden ? '#ff4d4f' : '#1890ff';
        });

        // 透明度滑块
        opacitySlider.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            settings.opacity = value;
            opacityValue.textContent = `${Math.round(value * 100)}%`;
            localStorage.setItem('recorder_opacity', value);
            applyPanelStyles(recorder);
            updateEditPanelStyles();
        });

        // 毛玻璃效果切换
        useBlurToggle.addEventListener('change', (e) => {
            settings.useBlur = e.target.checked;
            localStorage.setItem('recorder_use_blur', e.target.checked);
            applyPanelStyles(recorder);
            updateEditPanelStyles();
        });

        // 点击动画开关
        showAnimationToggle.addEventListener('change', (e) => {
            settings.showClickAnimation = e.target.checked;
            localStorage.setItem('recorder_show_click_animation', e.target.checked);
        });

        // 动画数量限制
        maxAnimationsInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value) || 0;
            // 限制输入范围
            if (value < 0) value = 0;
            if (value > 50) value = 50;
            e.target.value = value;
            settings.maxAnimations = value;
            localStorage.setItem('recorder_max_animations', value);
        });

        // 更新方案列表
        updateSchemeList();
    }

    // 更新编辑面板样式
    function updateEditPanelStyles() {
        const editPanels = document.querySelectorAll('.top-edit-panel');
        editPanels.forEach(panel => {
            panel.style.background = `rgba(255, 255, 255, ${settings.opacity})`;
            panel.style.backdropFilter = settings.useBlur ? 'blur(4px)' : 'none';
        });
    }

    // 更新方案列表
    function updateSchemeList() {
        const savedSchemes = StorageManager.getAllSchemes();
        const rightPanelList = document.getElementById('rightPanelSchemeList');
        rightPanelList.innerHTML = '';

        if (Object.keys(savedSchemes).length === 0) {
            const emptyTip = document.createElement('div');
            emptyTip.style.cssText = `
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 13px;
            `;
            emptyTip.textContent = '无录制方案';
            rightPanelList.appendChild(emptyTip);
            return;
        }

        Object.entries(savedSchemes)
            .sort(([, a], [, b]) => b.timestamp - a.timestamp)
            .forEach(([name, scheme]) => {
                const schemeDiv = document.createElement('div');
                schemeDiv.setAttribute('data-scheme', name);
                schemeDiv.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 2px;
                    transition: all 0.2s;
                `;

                schemeDiv.innerHTML = `
                    <div style="display: flex; flex-direction: column; flex: 1; min-width: 0; margin-right: 8px;">
                        <span class="scheme-name" data-original-name="${name}">
                            ${name}
                        </span>
                        <span style="font-size: 11px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                            ${scheme.site || '未知网站'}
                        </span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button class="edit-btn" style="padding: 3px 8px; background: #52c41a; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; transition: all 0.2s;">编辑</button>
                        <button class="run-btn" style="padding: 3px 8px; background: #1890ff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; transition: all 0.2s;">运行</button>
                        <button class="delete-btn" style="padding: 3px 8px; background: #ff4d4f; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; transition: all 0.2s;">删除</button>
                    </div>`;

                // 添加双击重命名功能
                const schemeName = schemeDiv.querySelector('.scheme-name');
                schemeName.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    const originalName = schemeName.getAttribute('data-original-name');
                    const input = document.createElement('input');
                    input.className = 'scheme-name-input';
                    input.value = originalName;
                    schemeName.replaceWith(input);
                    input.focus();
                    input.select();

                    const handleRename = () => {
                        const newName = input.value.trim();
                        if (newName && newName !== originalName) {
                            if (StorageManager.renameScheme(originalName, newName)) {
                                showToast('重命名成功');
                                updateSchemeList();
                            } else {
                                showToast('该名称已存在');
                                input.replaceWith(schemeName);
                            }
                        } else {
                            input.replaceWith(schemeName);
                        }
                    };

                    input.addEventListener('blur', handleRename);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleRename();
                        } else if (e.key === 'Escape') {
                            e.preventDefault();
                            input.replaceWith(schemeName);
                        }
                    });
                });

                // 添加按钮悬停效果
                const buttons = schemeDiv.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.addEventListener('mouseover', () => {
                        btn.style.opacity = '0.8';
                    });
                    btn.addEventListener('mouseout', () => {
                        btn.style.opacity = '1';
                    });
                });

                // 绑定按钮事件
                const editBtn = schemeDiv.querySelector('.edit-btn');
                const runBtn = schemeDiv.querySelector('.run-btn');
                const deleteBtn = schemeDiv.querySelector('.delete-btn');

                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (editBtn.textContent === '退出') {
                        EditManager.exit();
                    } else {
                        EditManager.enter(name, editBtn);
                    }
                };
                runBtn.onclick = () => RunManager.run(name, runBtn);
                deleteBtn.onclick = () => handleDelete(name, deleteBtn);

                // 添加方案悬停效果
                schemeDiv.addEventListener('mouseover', () => {
                    schemeDiv.style.backgroundColor = '#f5f5f5';
                });
                schemeDiv.addEventListener('mouseout', () => {
                    schemeDiv.style.backgroundColor = 'transparent';
                });

                rightPanelList.appendChild(schemeDiv);
            });
    }

    // 删除功能
    function handleDelete(name, deleteBtn) {
        if (deleteBtn.textContent === '删除') {
            deleteBtn.textContent = '取消';
            deleteBtn.style.background = '#8c8c8c';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = '确定';
            confirmBtn.style.cssText = `
                padding: 3px 8px;
                background: #ff4d4f;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;

            confirmBtn.onclick = () => {
                StorageManager.deleteScheme(name);
                updateSchemeList();
                showToast('已删除');
            };

            deleteBtn.parentElement.insertBefore(confirmBtn, deleteBtn);

            deleteBtn.onclick = () => {
                confirmBtn.remove();
                deleteBtn.textContent = '删除';
                deleteBtn.style.background = '#ff4d4f';
                deleteBtn.onclick = () => handleDelete(name, deleteBtn);
            };
        }
    }

    // 初始化
    function init() {
        console.log('初始化开始');
        // 确保只初始化一次
        if (window.recorderInitialized) {
            return;
        }
        window.recorderInitialized = true;

        try {
            // 初始化各个组件
            console.log('初始化样式');
            initStyles();

            console.log('初始化点击效果');
            ClickEffectManager.init();

            console.log('初始化点击点管理器');
            ClickPointManager.init();

            // 创建录制界面
            console.log('创建录制界面');
            createRecorderPanel();

            // 初始化事件监听器
            console.log('初始化事件监听器');
            initializeEventListeners();

            // 确保录制界面存在
            setInterval(() => {
                const panel = document.getElementById('recorder-panel');
                if (!panel) {
                    console.log('重新创建录制界面');
                    createRecorderPanel();
                }
            }, 1000);

            console.log('初始化完成');
        } catch (error) {
            console.error('初始化出错:', error);
        }
    }

    // 初始化事件监听
    function initializeEventListeners() {
        // 记录点击事件
        document.addEventListener('click', (e) => {
            // 检查是否点击在面板或按钮上
            const isOnPanel = e.target.closest('#recorder-panel') ||
                            e.target.closest('.top-edit-panel') ||
                            e.target.closest('.click-point') ||
                            e.target.closest('button');

            if (isOnPanel) return;

            if (editModeRecording) {
                const currentTime = Date.now();
                const lastAction = actions[actions.length - 1];
                const newAction = {
                    type: 'click',
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: currentTime - startTime,
                    clickCount: 1,
                    preDelay: actions.length === 0 ? 1000 : Math.max(0, currentTime - (lastAction ? lastAction.timestamp + startTime : startTime)),
                    isNewAction: true
                };
                actions.push(newAction);

                // 实时显示点击点
                ClickPointManager.addNewPoint(newAction, actions.length - 1);
                ClickEffectManager.show(e.clientX, e.clientY);
            } else if (recording) {
                const currentTime = Date.now() - startTime;
                actions.push({
                    type: 'click',
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: currentTime,
                    clickCount: 1,
                    preDelay: actions.length === 0 ? 0 : currentTime - actions[actions.length - 1].timestamp
                });
                ClickEffectManager.show(e.clientX, e.clientY);
            }
        }, true); // 使用捕获阶段来确保能捕获到所有点击
    }

    // 可拖动元素功能
    function makeElementDraggable(element) {
        let isDragging = false;
        let startX, startY;
        let elementX, elementY;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                return;
            }

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            elementX = element.offsetLeft;
            elementY = element.offsetTop;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            element.style.left = `${elementX + deltaX}px`;
            element.style.top = `${elementY + deltaY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 等待页面加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded');
            setTimeout(init, 0);
        });
    } else {
        console.log('直接初始化');
        setTimeout(init, 0);
    }

    // 修改页面卸载事件，确保数据保存
    window.addEventListener('beforeunload', () => {
        StorageManager.forceSave();
    });

})();