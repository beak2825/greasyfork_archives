// ==UserScript==
// @name         小雅做做做
// @version      1.3
// @description  🚀 一键管理小雅平台任务，智能跟踪作业进度！✨ 支持自主学习任务的便捷提交，直观展示任务状态，帮你更高效完成学习目标！ 📈
// @author       Yi
// @license       MIT
// @match        https://*.ai-augmented.com/*
// @icon           https://www.ai-augmented.com/static/logo3.1dbbea8f.png
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *.ai-augmented.com
// @homepageURL https://zygame1314.site
// @namespace https://greasyfork.org/users/1268039
// @downloadURL https://update.greasyfork.org/scripts/516837/%E5%B0%8F%E9%9B%85%E5%81%9A%E5%81%9A%E5%81%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/516837/%E5%B0%8F%E9%9B%85%E5%81%9A%E5%81%9A%E5%81%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const domain = window.location.hostname;
    let xiaoYaRecorder = null;

    function getGroupIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/mycourse\/(\d+)/);
        return match ? match[1] : null;
    }

    function getResourceIdFromUrl() {
        const resourceElement = document.querySelector('#xy_app_content > div.ta-frame > div.ta_panel.ta_panel_group.ta_group > section > section > main > div > div.group-resource-body > div');
        if (!resourceElement) {
            return null;
        }

        const url = window.location.href;
        const match = url.match(/resource\/\d+\/(\d+)$/);
        return match ? match[1] : null;
    }

    const userInfoCache = {
        data: null,
        timestamp: 0,
        ttl: 5 * 60 * 1000,

        set(data) {
            this.data = data;
            this.timestamp = Date.now();
        },

        get() {
            if (!this.data) return null;
            if (Date.now() - this.timestamp > this.ttl) {
                this.clear();
                return null;
            }
            return this.data;
        },

        clear() {
            this.data = null;
            this.timestamp = 0;
        }
    };

    async function getUserInfo() {
        const cachedInfo = userInfoCache.get();
        if (cachedInfo) {
            return cachedInfo;
        }

        try {
            const token = getCookie('prd-access-token');
            if (!token) {
                console.error("未找到访问令牌");
                return null;
            }

            const response = await fetch(`https://${domain}/api/jx-auth/oauth2/info`, {
                headers: {
                    "accept": "/",
                    "content-type": "application/json; charset=utf-8",
                    "authorization": `Bearer ${token}`
                },
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (data.success) {
                const userId = data.data.info.id;
                userInfoCache.set(userId);
                return userId;
            }
        } catch (error) {
            console.error("获取用户信息失败:", error);
            return null;
        }
    }

    function getCookie(keyword = 'prd-access-token') {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.includes(keyword)) {
                return value;
            }
        }
        return null;
    }

    function getAuthToken() {
        return new Promise((resolve, reject) => {
            const token = getCookie();
            if (token) {
                resolve(token);
            } else {
                reject('未找到授权令牌');
            }
        });
    }

    function fetchTaskList(authToken) {
        const GROUP_ID = getGroupIdFromUrl();
        if (!GROUP_ID) {
            console.log('当前页面不是课程页面');
            return Promise.resolve([]);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://${domain}/api/jx-stat/group/task/queryTaskNotices?group_id=${GROUP_ID}&role=1`,
                headers: {
                    "authorization": "Bearer " + authToken
                },
                onload: function (response) {
                    if (response.status === 200) {
                        let data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve(data.data.student_tasks);
                        } else {
                            reject(data.message);
                        }
                    } else {
                        reject('获取任务列表失败');
                    }
                }
            });
        });
    }

    function fetchResourceList(authToken) {
        const GROUP_ID = getGroupIdFromUrl();
        if (!GROUP_ID) {
            return Promise.resolve([]);
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://${domain}/api/jx-iresource/resource/queryCourseResources?group_id=${GROUP_ID}`,
                headers: {
                    "authorization": "Bearer " + authToken
                },
                onload: function (response) {
                    if (response.status === 200) {
                        let data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve(data.data);
                        } else {
                            reject(data.message);
                        }
                    } else {
                        reject('获取资源列表失败');
                    }
                }
            });
        });
    }

    let isFreedomMode = false;

    function createModal(title, message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(8px);
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.innerHTML = `
            <style>
                @keyframes modalShow {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes modalHide {
                    from { transform: scale(1); opacity: 1; }
                    to { transform: scale(0.95); opacity: 0; }
                }

                .modal-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .modal-btn::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 120%;
                    height: 120%;
                    background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%);
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                    transition: transform 0.5s, opacity 0.3s;
                }

                .modal-btn:hover::after {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }

                .modal-btn:active {
                    transform: scale(0.98);
                }
            </style>
            <div style="
                background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(249,250,251,0.98));
                border-radius: 20px;
                min-width: 600px;
                max-width: 90%;
                padding: 28px;
                box-shadow:
                    0 20px 25px -5px rgba(0,0,0,0.1),
                    0 10px 10px -5px rgba(0,0,0,0.04),
                    inset 0 1px 0 rgba(255,255,255,0.8);
                border: 1px solid rgba(255,255,255,0.5);
                animation: modalShow 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #FEF3C7, #FDE68A);
                    opacity: 0.8;
                "></div>

                <div style="
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        border-radius: 16px;
                        background: linear-gradient(145deg, #FEF3C7, #FDE68A);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        box-shadow:
                            0 4px 12px rgba(251,191,36,0.2),
                            inset 0 1px 0 rgba(255,255,255,0.6);
                        transform-origin: center;
                        animation: wiggle 1s ease-in-out infinite;
                    ">⚠️</div>
                    <h3 style="
                        margin: 0;
                        color: #92400E;
                        font-size: 20px;
                        font-weight: 600;
                        text-shadow: 0 1px 0 rgba(255,255,255,0.8);
                    ">${title}</h3>
                </div>

                <div style="
                    color: #92400E;
                    line-height: 1.7;
                    margin-bottom: 28px;
                    font-size: 15px;
                    background: linear-gradient(145deg, rgba(254,243,199,0.5), rgba(253,230,138,0.5));
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(251,191,36,0.2);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                ">${message}</div>

                <div style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                ">
                    <button class="modal-btn modal-cancel" style="
                        background: #F3F4F6;
                        color: #374151;
                        box-shadow:
                            0 2px 4px rgba(0,0,0,0.05),
                            inset 0 1px 0 rgba(255,255,255,0.8);
                    ">我再看看</button>
                    <button class="modal-btn modal-confirm" style="
                        background: linear-gradient(145deg, #DC2626, #B91C1C);
                        color: white;
                        box-shadow:
                            0 4px 12px rgba(220,38,38,0.3),
                            inset 0 1px 0 rgba(255,255,255,0.1);
                    ">包开的</button>
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });

        const closeModal = () => {
            const modalContent = content.firstElementChild;
            modalContent.style.animation = 'modalHide 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            modal.style.opacity = '0';

            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                onCancel?.();
            }
        });

        content.querySelector('.modal-cancel').onclick = () => {
            closeModal();
            onCancel?.();
        };

        content.querySelector('.modal-confirm').onclick = () => {
            closeModal();
            onConfirm?.();
        };

        return modal;
    }

    function showTaskList(container, tasks, resources) {
        const fragment = document.createDocumentFragment();

        const freedomModeToggle = document.createElement('div');
        freedomModeToggle.innerHTML = `
            <div style="
                margin-bottom: 24px;
                padding: 16px;
                background: linear-gradient(145deg, #FEF3C7, #FDE68A);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                box-shadow: 0 4px 12px rgba(251,191,36,0.1);
            ">
                <div style="flex: 1">
                    <div style="
                        font-weight: 600;
                        color: #92400E;
                        margin-bottom: 4px;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="font-size: 18px">⚠️</span>
                        自由模式
                    </div>
                    <div style="
                        color: #B45309;
                        font-size: 13px;
                        font-weight: bold;
                        line-height: 1.5;
                    ">
                        开启后可以自由选择任务，但也伴随着各种风险。
                    </div>
                </div>
                <label class="freedom-mode-switch" style="
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                    flex-shrink: 0;
                ">
                    <input type="checkbox" style="
                        opacity: 0;
                        width: 0;
                        height: 0;
                    " ${isFreedomMode ? 'checked' : ''}>
                    <span style="
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: ${isFreedomMode ? '#92400E' : '#D1D5DB'};
                        transition: .4s;
                        border-radius: 34px;
                    ">
                        <span style="
                            position: absolute;
                            content: '';
                            height: 20px;
                            width: 20px;
                            left: 3px;
                            bottom: 3px;
                            background-color: white;
                            transition: .4s;
                            border-radius: 50%;
                            transform: ${isFreedomMode ? 'translateX(24px)' : 'translateX(0)'};
                        "></span>
                    </span>
                </label>
            </div>
        `;

        const toggleSwitch = freedomModeToggle.querySelector('input[type="checkbox"]');
        toggleSwitch.addEventListener('change', function () {
            if (this.checked) {
                createModal(
                    '开启自由模式 🎭',
                    `<div style="font-size: 15px;">
                        <div style="margin-bottom: 20px;">
                            自由模式允许你快捷提交和补交部分作业。但请注意以下风险：
                        </div>

                        <div style="
                            background: rgba(251,191,36,0.1);
                            padding: 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            border: 1px dashed rgba(251,191,36,0.3);
                        ">
                            <div style="margin-bottom: 12px;">❌ 盲目使用可能会出现以下情况：</div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 上传了空作业被老师点名批斗 😅
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 显示"已完成"但仍处于"正在答题"的量子叠加态 😢
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 被系统标记为异常行为，账号被小雅制裁 💀
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 作业造假导致平时分太低，期末在天台凌乱 😭
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 老师发现异常:"为什么2秒看完2小时的视频?" 🤔
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 提前完成后发现后续无法再次提交 😱
                            </div>
                        </div>

                        <div style="
                            background: rgba(16,185,129,0.1);
                            padding: 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            border: 1px dashed rgba(16,185,129,0.3);
                        ">
                            <div style="margin-bottom: 12px;">✅ 建议使用场景：</div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 补交错过的自主观看任务
                            </div>
                            <div style="padding-left: 20px; margin-bottom: 8px;">
                                • 完成一些不计分也没人管的水课作业
                            </div>
                            <div style="
                                padding-left: 20px;
                                margin-top: 12px;
                                color: #059669;
                                font-size: 13px;
                                font-weight: bold;
                            ">
                                ⚠️ 注意：对于已截止的作业，需要老师开启"允许补交"才能提交
                            </div>
                        </div>

                        <div style="
                            text-align: center;
                            color: #92400E;
                            font-weight: bold;
                        ">确认要开启自由模式吗？</div>
                    </div>`,
                    () => {
                        isFreedomMode = true;
                        toggleSwitch.parentElement.querySelector('span').style.backgroundColor = '#92400E';
                        toggleSwitch.parentElement.querySelector('span > span').style.transform = 'translateX(24px)';
                        getAuthToken().then(authToken => {
                            Promise.all([
                                fetchTaskList(authToken),
                                fetchResourceList(authToken)
                            ]).then(([tasks, resources]) => {
                                showTaskList(container, tasks, resources);
                            });
                        });
                    },
                    () => {
                        this.checked = false;
                    }
                );
            } else {
                isFreedomMode = false;
                toggleSwitch.parentElement.querySelector('span').style.backgroundColor = '#D1D5DB';
                toggleSwitch.parentElement.querySelector('span > span').style.transform = 'translateX(0)';
                getAuthToken().then(authToken => {
                    Promise.all([
                        fetchTaskList(authToken),
                        fetchResourceList(authToken)
                    ]).then(([tasks, resources]) => {
                        showTaskList(container, tasks, resources);
                    });
                });
            }
        });

        fragment.appendChild(freedomModeToggle);

        const resourceMap = new Map();
        resources.forEach(resource => {
            if (resource.is_task) {
                resourceMap.set(resource.task_id, resource);
            }
        });

        let title = document.createElement('h3');
        title.innerText = '选择要完成的任务';
        Object.assign(title.style, {
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px',
            textAlign: 'center',
            position: 'relative',
            padding: '0 0 12px'
        });

        title.innerHTML += `
            <div style="
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #3B82F6, #60A5FA);
                border-radius: 2px;
            "></div>
        `;
        fragment.appendChild(title);

        const stats = document.createElement('div');
        Object.assign(stats.style, {
            marginBottom: '24px',
            padding: '24px',
            borderRadius: '20px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(249,250,251,0.95))',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        const toggleIcon = document.createElement('div');
        toggleIcon.innerHTML = `
            <div class="stats-toggle-icon" style="
                position: absolute;
                top: 24px;
                right: 24px;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(145deg, rgba(59,130,246,0.12), rgba(37,99,235,0.12));
                border: 1px solid rgba(59,130,246,0.15);
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(37,99,235,0.08);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: #3b82f6;
                backdrop-filter: blur(4px);
                ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="transform: rotate(0deg); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
            </div>
        `;
        stats.appendChild(toggleIcon);

        const statsContent = document.createElement('div');
        statsContent.style.maxHeight = '130px';
        statsContent.style.overflow = 'hidden';
        statsContent.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        const now = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const autoSubmitTasks = tasks.filter(task => {
            const deadline = new Date(task.end_time);
            return task.task_type === 1 && task.finish !== 2 && deadline > now;
        });

        const manualTasks = tasks.filter(task => {
            const deadline = new Date(task.end_time);
            return task.task_type !== 1 && task.finish !== 2 && deadline > now;
        });

        const deadlineTasks = tasks.filter(task => {
            const deadline = new Date(task.end_time);
            return task.finish !== 2 && deadline > now && deadline <= threeDaysLater;
        });

        const completedTasks = tasks.filter(task => task.finish === 2);
        const overdueTasks = tasks.filter(task =>
            task.finish !== 2 && new Date(task.end_time) <= now
        );

        const typeStats = {
            document: tasks.filter(t => t.task_type === 1).length,
            homework: tasks.filter(t => t.task_type === 2).length,
            exercise: tasks.filter(t => t.task_type === 3).length,
            quiz: tasks.filter(t => t.task_type === 4).length,
            survey: tasks.filter(t => t.task_type === 5).length,
            discussion: tasks.filter(t => t.task_type === 6).length
        };

        const completionRate = (completedTasks.length / tasks.length * 100).toFixed(1);

        const completedPercent = (+Math.max(0, (completedTasks.length / tasks.length * 100)).toFixed(1)) || 0;
        const overduePercent = (+Math.max(0, (overdueTasks.length / tasks.length * 100)).toFixed(1)) || 0;
        const ongoingPercent = (+Math.max(0, (100 - completedPercent - overduePercent)).toFixed(1)) || 0;

        const content = document.createElement('div');
        content.style.position = 'relative';
        content.style.zIndex = '1';

        const cardHTML = `
            <div style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 24px;
            ">
                <div class="stat-card" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15));
                    border: 1px solid rgba(16,185,129,0.2);
                    cursor: pointer;
                ">
                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        color: #059669;
                        margin-bottom: 8px;
                    ">${autoSubmitTasks.length}</div>
                    <div style="
                        font-size: 14px;
                        color: #065f46;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span style="font-size: 16px">🚀</span>
                        可自动提交
                    </div>
                </div>

                <div class="stat-card" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.15));
                    border: 1px solid rgba(59,130,246,0.2);
                    cursor: pointer;
                ">
                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        color: #2563eb;
                        margin-bottom: 8px;
                    ">${manualTasks.length}</div>
                    <div style="
                        font-size: 14px;
                        color: #1e40af;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span style="font-size: 16px">✍️</span>
                        需手动完成
                    </div>
                </div>

                <div class="stat-card" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.15));
                    border: 1px solid rgba(239,68,68,0.2);
                    cursor: pointer;
                ">
                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        color: #dc2626;
                        margin-bottom: 8px;
                    ">${deadlineTasks.length}</div>
                    <div style="
                        font-size: 14px;
                        color: #991b1b;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span style="font-size: 16px">⏰</span>
                        即将截止
                    </div>
                </div>
            </div>

            <div style="
                background: rgba(255,255,255,0.8);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 24px;
                border: 1px solid rgba(0,0,0,0.05);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <div style="
                            width: 40px;
                            height: 40px;
                            border-radius: 12px;
                            background: linear-gradient(135deg, #3b82f6, #2563eb);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 18px;
                        ">📊</div>
                        <div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937">总体进度</div>
                            <div style="font-size: 13px; color: #6b7280">已完成 ${completedTasks.length} / ${tasks.length} 个任务</div>
                        </div>
                    </div>
                    <div style="
                        background: ${parseFloat(completionRate) >= 80 ? '#dcfce7' : '#fee2e2'};
                        color: ${parseFloat(completionRate) >= 80 ? '#166534' : '#991b1b'};
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 600;
                    ">
                        ${completionRate}%
                    </div>
                </div>

                <div style="
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    margin-bottom: 8px;
                ">
                    <div style="
                        width: ${completedPercent}%;
                        height: 100%;
                        background: linear-gradient(90deg, #22c55e, #16a34a);
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(
                                90deg,
                                transparent 0%,
                                rgba(255,255,255,0.3) 50%,
                                transparent 100%
                            );
                            animation: shimmer 2s infinite;
                        "></div>
                    </div>
                    <div style="
                        width: ${ongoingPercent}%;
                        height: 100%;
                        background: linear-gradient(90deg, #fbbf24, #f59e0b);
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(
                                90deg,
                                transparent 0%,
                                rgba(255,255,255,0.3) 50%,
                                transparent 100%
                            );
                            animation: shimmer 2s infinite;
                        "></div>
                    </div>
                    <div style="
                        width: ${overduePercent}%;
                        height: 100%;
                        background: linear-gradient(90deg, #ef4444, #dc2626);
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(
                                90deg,
                                transparent 0%,
                                rgba(255,255,255,0.3) 50%,
                                transparent 100%
                            );
                            animation: shimmer 2s infinite;
                        "></div>
                    </div>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #6b7280;
                ">
                    <div>已完成: ${completedPercent}%</div>
                    <div>进行中: ${ongoingPercent}%</div>
                    <div>已截止: ${overduePercent}%</div>
                </div>

            <div style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
            ">
                ${Object.entries({
            "自主观看": [typeStats.document, "👁️"],
            "作业": [typeStats.homework, "✍️"],
            "课堂练习": [typeStats.exercise, "📚"],
            "测验": [typeStats.quiz, "💯"],
            "问卷": [typeStats.survey, "📋"],
            "讨论": [typeStats.discussion, "💭"]
        }).map(([name, [count, icon]]) => `
                    <div style="
                        background: rgba(255,255,255,0.8);
                        border-radius: 12px;
                        padding: 16px;
                        text-align: center;
                        border: 1px solid rgba(0,0,0,0.05);
                        transition: all 0.3s ease;
                    ">
                        <div style="font-size: 20px; margin-bottom: 4px">${icon}</div>
                        <div style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 4px">
                            ${count}
                        </div>
                        <div style="font-size: 13px; color: #6b7280">${name}</div>
                    </div>
                `).join('')}
            </div>
        `;

        content.innerHTML = cardHTML;
        statsContent.appendChild(content);
        stats.appendChild(statsContent);

        let isExpanded = false;
        stats.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                statsContent.style.maxHeight = statsContent.scrollHeight + 'px';
                toggleIcon.querySelector('svg').style.transform = 'rotate(180deg)';
                stats.style.boxShadow = '0 12px 36px rgba(0,0,0,0.1)';
            } else {
                statsContent.style.maxHeight = '130px';
                toggleIcon.querySelector('svg').style.transform = 'rotate(0deg)';
                stats.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
            }

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: ${event.offsetY}px;
                left: ${event.offsetX}px;
                width: 5px;
                height: 5px;
                background: rgba(59,130,246,0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(1);
                opacity: 1;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            stats.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(100)';
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 500);
            });
        });

        stats.addEventListener('mouseenter', () => {
            toggleIcon.querySelector('.stats-toggle-icon').style.background = 'rgba(59,130,246,0.2)';
            stats.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        });

        stats.addEventListener('mouseleave', () => {
            toggleIcon.querySelector('.stats-toggle-icon').style.background = 'rgba(59,130,246,0.1)';
            stats.style.boxShadow = 'none';
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        `;

        stats.appendChild(style);
        fragment.appendChild(stats);

        const documentTasks = tasks.filter(task => task.task_type === 1);
        const exerciseTasks = tasks.filter(task => task.task_type === 2);
        const paperTasks = tasks.filter(task => task.task_type === 3);
        const quizTasks = tasks.filter(task => task.task_type === 4);
        const surveyTasks = tasks.filter(task => task.task_type === 5);
        const discussionTasks = tasks.filter(task => task.task_type === 6);

        if (documentTasks.length > 0) {
            let docnotice = document.createElement('div');
            docnotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(220,252,231,0.8), rgba(187,247,208,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(34,197,94,0.1);
                ">
                    <span style="font-size: 18px">📺</span>
                    <span style="
                        color: #166534;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">自主观看可以自动提交，但不会记录时长</span>
                </div>
            `;
            fragment.appendChild(docnotice);
        }

        if (exerciseTasks.length > 0) {
            let excrcisenotice = document.createElement('div');
            excrcisenotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(254,226,226,0.8), rgba(254,202,202,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(239,68,68,0.1);
                ">
                    <span style="font-size: 18px">✍️</span>
                    <span style="
                        color: #991B1B;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">作业需要手动完成，无法自动提交答案</span>
                </div>
            `;
            fragment.appendChild(excrcisenotice);
        }

        if (paperTasks.length > 0) {
            let paperNotice = document.createElement('div');
            paperNotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(219,234,254,0.8), rgba(191,219,254,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(59,130,246,0.1);
                ">
                    <span style="font-size: 18px">📚</span>
                    <span style="
                        color: #1e40af;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">课堂练习由课堂动态发布，请进入相应页面作答</span>
                </div>
            `;
            fragment.appendChild(paperNotice);
        }

        if (quizTasks.length > 0) {
            let quizNotice = document.createElement('div');
            quizNotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(243,232,255,0.8), rgba(233,213,255,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(147,51,234,0.1);
                ">
                    <span style="font-size: 18px">💯</span>
                    <span style="
                        color: #6B21A8;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">测验需要亲自作答，脚本无法自动完成</span>
                </div>
            `;
            fragment.appendChild(quizNotice);
        }

        if (surveyTasks.length > 0) {
            let surveyNotice = document.createElement('div');
            surveyNotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(253,230,138,0.8), rgba(252,211,77,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(217,119,6,0.1);
                ">
                    <span style="font-size: 18px">📋</span>
                    <span style="
                        color: #92400E;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">问卷需要手动填写，无法自动提交</span>
                </div>
            `;
            fragment.appendChild(surveyNotice);
        }

        if (discussionTasks.length > 0) {
            let discussionNotice = document.createElement('div');
            discussionNotice.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, rgba(236,254,255,0.8), rgba(199,246,249,0.8));
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 2px 6px rgba(6,182,212,0.1);
                ">
                    <span style="font-size: 18px">💭</span>
                    <span style="
                        color: #155E75;
                        font-size: 13px;
                        font-weight: bold;
                        flex: 1;
                    ">讨论需要发表评论或回复他人才能完成</span>
                </div>
            `;
            fragment.appendChild(discussionNotice);
        }

        const separator = document.createElement('div');
        separator.innerHTML = `
            <div style="
                margin: 32px 0;
                padding: 16px 20px;
                background: linear-gradient(145deg, rgba(249,250,251,0.97), rgba(243,244,246,0.97));
                border-radius: 16px;
                border: 1px solid rgba(0,0,0,0.05);
                box-shadow: 0 4px 16px rgba(0,0,0,0.03);
                backdrop-filter: blur(8px);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                        background: linear-gradient(145deg, #FEF3C7, #FDE68A);
                        border-radius: 10px;
                        color: #92400E;
                        font-size: 18px;
                    ">💡</div>
                    <div style="flex: 1;">
                        <div style="
                            font-weight: 600;
                            color: #92400E;
                            margin-bottom: 4px;
                            font-size: 15px;
                        ">在以下区域勾选作业</div>
                        <div style="
                            color: #B45309;
                            font-size: 13px;
                            line-height: 1.5;
                        ">只有自主观看作业可以自动提交，其它作业请手动完成</div>
                    </div>
                </div>
            </div>
        `;
        fragment.appendChild(separator);

        const createSectionTitle = (text, count, defaultExpanded = false) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '28px';
            wrapper.style.marginTop = '28px';
            wrapper.style.position = 'relative';

            const header = document.createElement('div');
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            header.style.transition = 'transform 0.3s ease';
            header.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    padding: 12px 16px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(249,250,251,0.95));
                    border-radius: 16px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.03);
                    border: 1px solid rgba(0,0,0,0.05);
                    backdrop-filter: blur(8px);
                    transform-origin: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    <span class="expand-icon" style="
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        width: 28px;
                        height: 28px;
                        background: ${defaultExpanded ?
                    'linear-gradient(145deg, #3B82F6, #2563EB)' :
                    'linear-gradient(145deg, #f3f4f6, #e5e7eb)'};
                        border-radius: 8px;
                        color: ${defaultExpanded ? '#fff' : '#6B7280'};
                        font-size: 14px;
                        font-weight: bold;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        transform: rotate(${defaultExpanded ? '90' : '0'}deg);
                        box-shadow: ${defaultExpanded ?
                    '0 4px 12px rgba(59,130,246,0.2)' :
                    '0 2px 6px rgba(0,0,0,0.05)'};
                    ">▶</span>
                    <h4 style="
                        font-size: 16px;
                        font-weight: 600;
                        color: #374151;
                        margin: 0;
                        flex: 1;
                        transition: all 0.3s ease;
                    ">${text}</h4>
                    <span style="
                        background: ${defaultExpanded ?
                    'linear-gradient(145deg, #EFF6FF, #DBEAFE)' :
                    'linear-gradient(145deg, #F3F4F6, #E5E7EB)'};
                        color: ${defaultExpanded ? '#3B82F6' : '#6B7280'};
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        border: 1px solid ${defaultExpanded ?
                    'rgba(59,130,246,0.1)' :
                    'rgba(107,114,128,0.1)'};
                        ">${count}个任务</span>
                </div>
            `;

            const contentWrapper = document.createElement('div');
            contentWrapper.style.position = 'relative';
            contentWrapper.style.overflow = 'hidden';
            contentWrapper.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            contentWrapper.style.marginBottom = '8px';
            contentWrapper.style.paddingLeft = '20px';
            contentWrapper.style.paddingRight = '20px';

            const content = document.createElement('div');
            content.style.position = 'relative';
            content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

            contentWrapper.appendChild(content);

            let isAnimating = false;

            const updateExpandState = (expanded) => {
                if (isAnimating) return;
                isAnimating = true;

                const headerDiv = header.querySelector('div');
                const icon = header.querySelector('.expand-icon');
                const title = header.querySelector('h4');
                const badge = header.querySelector('span:last-child');

                if (expanded) {
                    contentWrapper.style.display = 'block';
                    contentWrapper.style.height = 'auto';
                    const targetHeight = contentWrapper.scrollHeight;
                    contentWrapper.style.height = '0px';

                    requestAnimationFrame(() => {
                        contentWrapper.style.height = targetHeight + 'px';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';

                        headerDiv.style.background = 'linear-gradient(145deg, #EFF6FF, #DBEAFE)';
                        headerDiv.style.borderColor = 'rgba(59,130,246,0.1)';

                        icon.style.transform = 'rotate(90deg)';
                        icon.style.background = 'linear-gradient(145deg, #3B82F6, #2563EB)';
                        icon.style.color = '#fff';
                        icon.style.boxShadow = '0 4px 12px rgba(59,130,246,0.2)';

                        title.style.color = '#2563EB';

                        badge.style.background = 'linear-gradient(145deg, #EFF6FF, #DBEAFE)';
                        badge.style.color = '#3B82F6';
                        badge.style.borderColor = 'rgba(59,130,246,0.1)';
                    });
                } else {
                    contentWrapper.style.height = contentWrapper.scrollHeight + 'px';

                    requestAnimationFrame(() => {
                        contentWrapper.style.height = '0';
                        content.style.opacity = '0';
                        content.style.transform = 'translateY(-10px)';

                        headerDiv.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(249,250,251,0.95))';
                        headerDiv.style.borderColor = 'rgba(0,0,0,0.05)';

                        icon.style.transform = 'rotate(0deg)';
                        icon.style.background = 'linear-gradient(145deg, #f3f4f6, #e5e7eb)';
                        icon.style.color = '#6B7280';
                        icon.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';

                        title.style.color = '#374151';

                        badge.style.background = 'linear-gradient(145deg, #F3F4F6, #E5E7EB)';
                        badge.style.color = '#6B7280';
                        badge.style.borderColor = 'rgba(107,114,128,0.1)';
                    });
                }

                contentWrapper.addEventListener('transitionend', function handler() {
                    if (expanded) {
                        contentWrapper.style.height = 'auto';
                    } else {
                        contentWrapper.style.display = 'none';
                    }
                    isAnimating = false;
                    contentWrapper.removeEventListener('transitionend', handler);
                }, { once: true });
            };

            if (defaultExpanded) {
                contentWrapper.style.display = 'block';
                contentWrapper.style.height = 'auto';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            } else {
                contentWrapper.style.display = 'none';
                contentWrapper.style.height = '0';
                content.style.opacity = '0';
                content.style.transform = 'translateY(-10px)';
            }

            header.addEventListener('click', () => {
                const isExpanded = contentWrapper.style.display !== 'none';
                updateExpandState(!isExpanded);
            });

            header.addEventListener('mouseenter', () => {
                const headerDiv = header.querySelector('div');
                headerDiv.style.transform = 'scale(1.01)';
                headerDiv.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
            });

            header.addEventListener('mouseleave', () => {
                const headerDiv = header.querySelector('div');
                headerDiv.style.transform = 'scale(1)';
                headerDiv.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
            });

            wrapper.appendChild(header);
            wrapper.appendChild(contentWrapper);
            return { wrapper, content };
        };

        function createTaskSubTitle(title, count) {
            const subTitleWrapper = document.createElement('div');
            Object.assign(subTitleWrapper.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: '12px',
                marginTop: '16px',
                marginLeft: '12px',
                marginRight: '12px'
            });

            const subTitle = document.createElement('div');
            subTitle.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <h5 style="
                        font-size: 14px;
                        font-weight: 500;
                        color: #6B7280;
                        margin: 0;
                    ">${title}</h5>
                    <span style="
                        background: #F3F4F6;
                        color: #9CA3AF;
                        padding: 1px 6px;
                        border-radius: 10px;
                        font-size: 12px;
                    ">${count}</span>
                </div>
            `;

            subTitleWrapper.appendChild(subTitle);
            return subTitleWrapper;
        }

        if (documentTasks.length > 0) {
            const { wrapper: docWrapper, content: docContent } = createSectionTitle('自主观看 (可自动提交)', documentTasks.length, true);
            fragment.appendChild(docWrapper);

            const ongoingDocTasks = documentTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedDocTasks = documentTasks.filter(task =>
                task.finish === 2
            );
            const overdueDocTasks = documentTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingDocTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingDocTasks.length, true);
                docContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingDocTasks.length);
                Object.assign(subTitleWrapper.style, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    marginTop: '16px',
                    marginLeft: '12px',
                    marginRight: '12px'
                });

                const selectAllWrapper = document.createElement('div');
                selectAllWrapper.style.order = '-1';
                selectAllWrapper.style.display = 'flex';
                selectAllWrapper.style.alignItems = 'center';
                selectAllWrapper.style.gap = '6px';

                const selectAllCheckbox = document.createElement('input');
                selectAllCheckbox.type = 'checkbox';
                selectAllCheckbox.className = 'select-all-checkbox';
                Object.assign(selectAllCheckbox.style, {
                    appearance: 'none',
                    '-webkit-appearance': 'none',
                    width: '18px',
                    height: '18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff',
                    position: 'relative',
                    margin: '0'
                });

                const selectAllLabel = document.createElement('span');
                selectAllLabel.textContent = '全选';
                selectAllLabel.style.fontSize = '12px';
                selectAllLabel.style.color = '#6B7280';
                selectAllLabel.style.cursor = 'pointer';

                selectAllCheckbox.addEventListener('change', function () {
                    const taskCheckboxes = container.querySelectorAll('.task-checkbox:not(:disabled)[data-node-id]');
                    taskCheckboxes.forEach(checkbox => {
                        checkbox.checked = this.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    });
                });

                const observer = new MutationObserver(() => {
                    const taskCheckboxes = container.querySelectorAll('.task-checkbox:not(:disabled)');
                    const checkedCount = container.querySelectorAll('.task-checkbox:checked').length;
                    selectAllCheckbox.checked = checkedCount === taskCheckboxes.length && taskCheckboxes.length > 0;
                });
                observer.observe(container, { childList: true, subtree: true });

                selectAllCheckbox.addEventListener('change', function () {
                    if (this.checked) {
                        this.style.backgroundColor = '#4CAF50';
                        this.style.borderColor = '#4CAF50';
                        this.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E\")";
                        this.style.backgroundSize = '14px';
                        this.style.backgroundPosition = 'center';
                        this.style.backgroundRepeat = 'no-repeat';
                    } else {
                        this.style.backgroundColor = '#fff';
                        this.style.borderColor = '#e2e8f0';
                        this.style.backgroundImage = 'none';
                    }
                });

                selectAllWrapper.appendChild(selectAllCheckbox);
                selectAllWrapper.appendChild(selectAllLabel);
                subTitleWrapper.appendChild(selectAllWrapper);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingDocTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, true));
            }

            if (completedDocTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedDocTasks.length, false);
                docContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedDocTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedDocTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overdueDocTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overdueDocTasks.length, false);
                docContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overdueDocTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overdueDocTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        if (exerciseTasks.length > 0) {
            const { wrapper: exerciseWrapper, content: exerciseContent } = createSectionTitle('作业 (需手动完成)', exerciseTasks.length, false);
            fragment.appendChild(exerciseWrapper);

            const ongoingExerciseTasks = exerciseTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedExerciseTasks = exerciseTasks.filter(task =>
                task.finish === 2
            );
            const overdueExerciseTasks = exerciseTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingExerciseTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingExerciseTasks.length, true);
                exerciseContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingExerciseTasks.length);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingExerciseTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, false));
            }

            if (completedExerciseTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedExerciseTasks.length, false);
                exerciseContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedExerciseTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedExerciseTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overdueExerciseTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overdueExerciseTasks.length, false);
                exerciseContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overdueExerciseTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overdueExerciseTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        if (paperTasks.length > 0) {
            const { wrapper: paperWrapper, content: paperContent } = createSectionTitle('课堂练习 (需手动完成)', paperTasks.length, false);
            fragment.appendChild(paperWrapper);

            const ongoingPaperTasks = paperTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedPaperTasks = paperTasks.filter(task =>
                task.finish === 2
            );
            const overduePaperTasks = paperTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingPaperTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingPaperTasks.length, true);
                paperContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingPaperTasks.length);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingPaperTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, false));
            }

            if (completedPaperTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedPaperTasks.length, false);
                paperContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedPaperTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedPaperTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overduePaperTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overduePaperTasks.length, false);
                paperContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overduePaperTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overduePaperTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        if (quizTasks.length > 0) {
            const { wrapper: quizWrapper, content: quizContent } = createSectionTitle('测验 (需手动完成)', quizTasks.length, false);
            fragment.appendChild(quizWrapper);

            const ongoingQuizTasks = quizTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedQuizTasks = quizTasks.filter(task =>
                task.finish === 2
            );
            const overdueQuizTasks = quizTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingQuizTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingQuizTasks.length, true);
                quizContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingQuizTasks.length);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingQuizTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, false));
            }

            if (completedQuizTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedQuizTasks.length, false);
                quizContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedQuizTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedQuizTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overdueQuizTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overdueQuizTasks.length, false);
                quizContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overdueQuizTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overdueQuizTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        if (surveyTasks.length > 0) {
            const { wrapper: surveyWrapper, content: surveyContent } = createSectionTitle('问卷 (需手动完成)', surveyTasks.length, false);
            fragment.appendChild(surveyWrapper);

            const ongoingSurveyTasks = surveyTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedSurveyTasks = surveyTasks.filter(task =>
                task.finish === 2
            );
            const overdueSurveyTasks = surveyTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingSurveyTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingSurveyTasks.length, true);
                surveyContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingSurveyTasks.length);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingSurveyTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, false));
            }

            if (completedSurveyTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedSurveyTasks.length, false);
                surveyContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedSurveyTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedSurveyTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overdueSurveyTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overdueSurveyTasks.length, false);
                surveyContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overdueSurveyTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overdueSurveyTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        if (discussionTasks.length > 0) {
            const { wrapper: discussionWrapper, content: discussionContent } = createSectionTitle('讨论 (需手动完成)', discussionTasks.length, false);
            fragment.appendChild(discussionWrapper);

            const ongoingDiscussionTasks = discussionTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) > now
            );
            const completedDiscussionTasks = discussionTasks.filter(task =>
                task.finish === 2
            );
            const overdueDiscussionTasks = discussionTasks.filter(task =>
                task.finish !== 2 && new Date(task.end_time) <= now
            );

            if (ongoingDiscussionTasks.length > 0) {
                const { wrapper: ongoingWrapper, content: ongoingContent } = createSectionTitle('进行中', ongoingDiscussionTasks.length, true);
                discussionContent.appendChild(ongoingWrapper);

                const subTitleWrapper = createTaskSubTitle('进行中', ongoingDiscussionTasks.length);
                ongoingContent.appendChild(subTitleWrapper);

                ongoingDiscussionTasks.forEach(task => createTaskElement(task, resourceMap, ongoingContent, false));
            }

            if (completedDiscussionTasks.length > 0) {
                const { wrapper: completedWrapper, content: completedContent } = createSectionTitle('已完成', completedDiscussionTasks.length, false);
                discussionContent.appendChild(completedWrapper);

                const subTitleWrapper = createTaskSubTitle('已完成', completedDiscussionTasks.length);
                completedContent.appendChild(subTitleWrapper);

                completedDiscussionTasks.forEach(task => createTaskElement(task, resourceMap, completedContent, false));
            }

            if (overdueDiscussionTasks.length > 0) {
                const { wrapper: overdueWrapper, content: overdueContent } = createSectionTitle('已截止', overdueDiscussionTasks.length, false);
                discussionContent.appendChild(overdueWrapper);

                const subTitleWrapper = createTaskSubTitle('已截止', overdueDiscussionTasks.length);
                overdueContent.appendChild(subTitleWrapper);

                overdueDiscussionTasks.forEach(task => createTaskElement(task, resourceMap, overdueContent, false));
            }
        }

        const recorderComponent = createRecorderComponent();
        fragment.appendChild(recorderComponent);

        let buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            position: 'sticky',
            bottom: '20px',
            left: '0',
            right: '0',
            padding: '0 20px',
            marginTop: '30px',
            zIndex: '1002',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            paddingTop: '20px'
        });

        let submitButton = document.createElement('button');
        submitButton.innerHTML = `
            <span style="margin-right: 8px">📤</span>
            提交完成状态
        `;
        Object.assign(submitButton.style, {
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(37,99,235,0.1)'
        });

        submitButton.onmouseenter = () => {
            submitButton.style.transform = 'translateY(-2px)';
            submitButton.style.boxShadow = '0 6px 12px rgba(37,99,235,0.2)';
        };
        submitButton.onmouseleave = () => {
            submitButton.style.transform = 'translateY(0)';
            submitButton.style.boxShadow = '0 4px 6px rgba(37,99,235,0.1)';
        };

        submitButton.onmousedown = () => {
            submitButton.style.transform = 'translateY(1px)';
        };
        submitButton.onmouseup = () => {
            submitButton.style.transform = 'translateY(-2px)';
        };

        submitButton.onclick = () => {
            let selectedTasks = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'));
            if (selectedTasks.length > 0) {
                submitButton.style.opacity = '0.7';
                submitButton.innerHTML = `
                    <span style="margin-right: 8px">⏳</span>
                    正在提交...
                `;
                submitTasks(selectedTasks);
                setTimeout(() => {
                    submitButton.style.opacity = '1';
                    submitButton.innerHTML = `
                        <span style="margin-right: 8px">📤</span>
                        提交完成状态
                    `;
                }, 1000);
            } else {
                showNotification('请至少选择一个任务', { type: 'warning', keywords: ['选择', '任务'] });
            }
        };

        buttonContainer.appendChild(submitButton);
        fragment.appendChild(buttonContainer);
        container.replaceChildren(fragment);
    }

    function createTaskElement(task, resourceMap, fragment, enableCheckbox) {
        const resourceInfo = resourceMap.get(task.task_id);
        let taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        Object.assign(taskItem.style, {
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: enableCheckbox ? '#fff' : '#f8f9fa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid rgba(238,240,242,0.8)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'flex-start',
            cursor: enableCheckbox ? 'pointer' : 'default',
            position: 'relative',
            overflow: 'hidden'
        });

        if (enableCheckbox) {
            taskItem.style.background = `
                linear-gradient(135deg,
                    rgba(255,255,255,1) 0%,
                    rgba(250,252,255,0.95) 100%)
            `;
        }

        taskItem.onmouseenter = () => {
            if (enableCheckbox) {
                taskItem.style.transform = 'translateY(-3px) scale(1.01)';
                taskItem.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                taskItem.style.borderColor = 'rgba(66,153,225,0.2)';
            }
        };

        taskItem.onmouseleave = () => {
            taskItem.style.transform = 'translateY(0) scale(1)';
            taskItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
            taskItem.style.borderColor = 'rgba(238,240,242,0.8)';
        };

        let checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginRight = '16px';
        checkboxWrapper.style.position = 'relative';

        let checkbox = document.createElement('input');
        checkbox.className = 'task-checkbox';
        checkbox.type = 'checkbox';
        checkbox.value = task.task_id;
        checkbox.dataset.nodeId = task.node_id;

        const shouldEnableCheckbox = enableCheckbox || isFreedomMode;
        checkbox.disabled = !shouldEnableCheckbox;

        Object.assign(checkbox.style, {
            appearance: 'none',
            '-webkit-appearance': 'none',
            width: '22px',
            height: '22px',
            border: '2px solid ' + (isFreedomMode && !enableCheckbox ? '#ef4444' : '#e2e8f0'),
            borderRadius: '6px',
            cursor: shouldEnableCheckbox ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            backgroundColor: '#fff',
            position: 'relative',
            margin: '0',
            zIndex: '1'
        });

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                this.style.backgroundColor = '#4CAF50';
                this.style.borderColor = '#4CAF50';
                this.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E\")";
                this.style.backgroundSize = '16px';
                this.style.backgroundPosition = 'center';
                this.style.backgroundRepeat = 'no-repeat';
            } else {
                this.style.backgroundColor = '#fff';
                this.style.borderColor = isFreedomMode && !enableCheckbox ? '#DC2626' : '#e2e8f0';
                this.style.backgroundImage = 'none';
            }
        });

        let taskInfo = document.createElement('div');
        taskInfo.style.flex = '1';

        const deadlineDate = new Date(task.end_time);
        const isOverdue = deadlineDate < new Date();

        const statusStyles = {
            completed: {
                color: '#10B981',
                bg: '#ECFDF5',
                border: '#A7F3D0'
            },
            overdue: {
                color: '#EF4444',
                bg: '#FEF2F2',
                border: '#FECACA'
            },
            ongoing: {
                color: '#3B82F6',
                bg: '#EFF6FF',
                border: '#BFDBFE'
            }
        };

        const getStatusStyle = () => {
            if (task.finish === 2) return statusStyles.completed;
            return isOverdue ? statusStyles.overdue : statusStyles.ongoing;
        };

        const statusStyle = getStatusStyle();
        const status = `
            <span style="
                display: inline-flex;
                align-items: center;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                color: ${statusStyle.color};
                background: ${statusStyle.bg};
                border: 1px solid ${statusStyle.border};
            ">
                ${task.finish === 2 ? '✓ 已完成' : (isOverdue ? '⚠️ 已截止' : '⏳ 进行中')}
            </span>
        `;

        const taskTypeText = {
            1: '自主观看',
            2: '作业',
            3: '课堂练习',
            4: '测验',
            5: '问卷',
            6: '讨论'
        }[task.task_type];

        taskInfo.innerHTML = `
            <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start">
                <div style="font-size: 16px; font-weight: 600; color: #1a1a1a; flex: 1; padding-right: 12px">
                    ${resourceInfo ? resourceInfo.name : '未知作业名称'}
                </div>
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0">
                    ${isFreedomMode && !enableCheckbox ? `
                        <div style="
                            padding: 4px 8px;
                            background: linear-gradient(145deg, #fecacA, #fca5a5);
                            color: #991b1b;
                            border-radius: 6px;
                            font-size: 12px;
                            font-weight: 600;
                            white-space: nowrap;
                        ">高风险操作</div>
                    ` : ''}
                    ${status}
                </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px">
                <span style="display: inline-flex; align-items: center; color: #666">
                    <span style="margin-right: 6px; opacity: 0.7">📝</span>
                    ${taskTypeText}
                </span>
                <span style="display: inline-flex; align-items: center; color: #666">
                    <span style="margin-right: 6px; opacity: 0.7">⏰</span>
                    ${new Date(task.start_time).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                </span>
                <span style="display: inline-flex; align-items: center; color: #666">
                    <span style="margin-right: 6px; opacity: 0.7">🔚</span>
                    ${new Date(task.end_time).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                </span>
            </div>
            ${task.finish_time ?
                `<div style="font-size: 13px; color: #10B981; margin-top: 8px; display: flex; align-items: center">
                    <span style="margin-right: 6px">✅</span>
                    完成于: ${new Date(task.finish_time).toLocaleString('zh-CN')}
                </div>` : ''}
            ${task.task_type === 2 || task.task_type === 3 || task.task_type === 4 || task.task_type === 5 || task.task_type === 6 ?
                `<div style="color: #EF4444; font-size: 13px; margin-top: 8px; display: flex; align-items: center">
                    <span style="margin-right: 6px">⚠️</span>
                    需要手动完成
                </div>` : ''}
        `;

        checkboxWrapper.appendChild(checkbox);
        taskItem.appendChild(checkboxWrapper);
        taskItem.appendChild(taskInfo);
        fragment.appendChild(taskItem);

        const deadline = new Date(task.end_time);
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        if (deadline <= threeDaysFromNow && deadline > now && task.finish !== 2) {
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            taskInfo.innerHTML += `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(239,68,68,0.1);
                    color: #dc2626;
                    font-size: 13px;
                    font-weight: bold;
                    margin-top: 8px;
                    padding: 6px 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(239,68,68,0.2);
                ">
                    <span style="font-size: 16px">❗</span>
                    <span>还剩 ${daysLeft} 天截止</span>
                </div>
            `;
        }
    }

    function submitTasks(selectedTasks) {
        const validTasks = selectedTasks.filter(task => task.dataset.nodeId && task.value);

        if (validTasks.length === 0) {
            showNotification('没有有效的任务可提交', { type: 'warning' });
            return;
        }

        getAuthToken().then(authToken => {
            fetchResourceList(authToken).then(resources => {
                const resourceMap = new Map();
                resources.forEach(resource => {
                    if (resource.is_task) {
                        resourceMap.set(resource.task_id, resource);
                    }
                });

                validTasks.forEach(taskElement => {
                    const GROUP_ID = getGroupIdFromUrl();
                    const taskId = taskElement.value;
                    const nodeId = taskElement.dataset.nodeId;
                    const resource = resourceMap.get(taskId);

                    if (!resource) {
                        showNotification(`未找到任务 ${taskId} 的资源信息`, {
                            type: 'warning',
                            keywords: ['未找到', '资源']
                        });
                        return;
                    }

                    const taskName = resource.name;

                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `https://${domain}/api/jx-iresource/resource/finishActivity`,
                        headers: {
                            "authorization": "Bearer " + authToken,
                            "Content-Type": "application/json; charset=UTF-8"
                        },
                        data: JSON.stringify({
                            "group_id": GROUP_ID,
                            "node_id": nodeId,
                            "task_id": taskId
                        }),
                        onload: function (response) {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                if (data.success) {
                                    showNotification(`"${taskName}" 已完成`, {
                                        type: 'success',
                                        keywords: [taskName, '完成']
                                    });

                                    setTimeout(() => {
                                        location.reload();
                                    }, 1500);

                                } else {
                                    showNotification(`"${taskName}" 完成失败：${data.message}`, {
                                        type: 'error',
                                        keywords: [taskName, '失败']
                                    });
                                }
                            } else {
                                showNotification(`"${taskName}" 提交失败`, {
                                    type: 'error',
                                    keywords: [taskName, '失败']
                                });
                            }
                        }
                    });
                });
            }).catch(error => {
                showNotification('获取资源列表失败：' + error, {
                    type: 'error',
                    keywords: ['获取', '失败']
                });
            });
        }).catch(error => {
            showNotification('获取认证令牌失败：' + error, {
                type: 'error',
                keywords: ['认证', '失败']
            });
        });
    }

    function getNotificationContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';
            container.style.zIndex = '10000';
            container.style.width = '400px';
            container.style.maxHeight = 'calc(100vh - 40px)';
            container.style.overflowY = 'auto';
            container.style.pointerEvents = 'none';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            document.body.appendChild(container);
        }
        return container;
    }

    function showNotification(message, options = {}) {
        const {
            type = 'info',
            duration = 3000,
            keywords = [],
        } = options;

        if (!globalThis._notificationCache) {
            globalThis._notificationCache = new Map();
        }

        const notificationKey = `${message}-${type}`;

        const existingNotification = globalThis._notificationCache.get(notificationKey);
        if (existingNotification) {
            const now = Date.now();
            if (now - existingNotification < 1500) {
                return;
            }
        }

        globalThis._notificationCache.set(notificationKey, Date.now());

        const CACHE_CLEANUP_DELAY = 10000;
        setTimeout(() => {
            globalThis._notificationCache.delete(notificationKey);
        }, CACHE_CLEANUP_DELAY);

        const highlightColors = {
            success: '#ffba08',
            error: '#14b8a6',
            warning: '#8b5cf6',
            info: '#f472b6'
        };

        const highlightColor = highlightColors[type] || highlightColors.info;

        const highlightStyle = `
            color: ${highlightColor};
            font-weight: bold;
            border-bottom: 2px solid ${highlightColor}50;
            transition: all 0.3s ease;
            border-radius: 3px;
        `;

        const highlightedMessage = keywords.reduce((msg, keyword) => {
            if (keyword && keyword.trim()) {
                const regex = new RegExp(keyword.trim(), 'g');
                return msg.replace(regex, `<span style="${highlightStyle}"
                onmouseover="this.style.backgroundColor='${highlightColor}15'; this.style.borderBottomColor='${highlightColor}'"
                onmouseout="this.style.backgroundColor='transparent'; this.style.borderBottomColor='${highlightColor}50'"
            >${keyword}</span>`);
            }
            return msg;
        }, message);

        const notification = document.createElement('div');
        notification.style.position = 'relative';
        notification.style.marginBottom = '10px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '12px';
        notification.style.color = '#333';
        notification.style.fontSize = '16px';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.06)';
        notification.style.pointerEvents = 'auto';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.backdropFilter = 'blur(8px)';

        const typeStyles = {
            success: {
                background: 'linear-gradient(145deg, rgba(104, 214, 156, 0.95), rgba(89, 186, 134, 0.95))',
                icon: '🎉'
            },
            error: {
                background: 'linear-gradient(145deg, rgba(248, 113, 113, 0.95), rgba(220, 38, 38, 0.95))',
                icon: '❌'
            },
            warning: {
                background: 'linear-gradient(145deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))',
                icon: '⚠️'
            },
            info: {
                background: 'linear-gradient(145deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.95))',
                icon: 'ℹ️'
            }
        };

        const currentType = typeStyles[type] || typeStyles.info;
        notification.style.background = currentType.background;
        notification.style.color = type === 'info' || type === 'success' ? '#fff' : '#000';

        const progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '4px';
        progressBar.style.width = '100%';
        progressBar.style.background = 'rgba(255, 255, 255, 0.3)';
        progressBar.style.borderRadius = '0 0 12px 12px';
        progressBar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        const icon = document.createElement('span');
        icon.style.marginRight = '12px';
        icon.style.fontSize = '20px';
        icon.textContent = currentType.icon;
        icon.style.filter = 'saturate(1.2)';

        const messageContainer = document.createElement('div');
        messageContainer.innerHTML = highlightedMessage;
        messageContainer.style.flex = '1';
        messageContainer.style.fontWeight = 'bold';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.marginLeft = '12px';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.opacity = '0.8';
        closeBtn.style.transition = 'opacity 0.2s';
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.opacity = '1';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.opacity = '0.8';
        });

        notification.addEventListener('mouseenter', () => {
            notification.style.transform = 'translateY(0) scale(1.02)';
            progressBar.style.transition = 'none';
        });

        notification.addEventListener('mouseleave', () => {
            notification.style.transform = 'translateY(0) scale(1)';
            progressBar.style.transition = `width ${duration}ms linear`;
        });

        notification.appendChild(icon);
        notification.appendChild(messageContainer);
        notification.appendChild(closeBtn);
        notification.appendChild(progressBar);

        const container = getNotificationContainer();

        container.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
            requestAnimationFrame(() => {
                progressBar.style.width = '0';
            });
        });

        function hideNotification(notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                container.removeChild(notification);
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }, 300);
        }

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideNotification(notification);
        });

        notification.addEventListener('click', () => {
            hideNotification(notification);
        });

        if (duration > 0) {
            setTimeout(() => {
                if (container.contains(notification)) {
                    hideNotification(notification);
                }
            }, duration);
        }
    }

    class LearnRecorder {
        constructor() {
            this.apiUrl = `https://${domain}/api/jx-iresource/learnLength/learnRecord`;
            this.interval = 30000;
            this.timer = null;
            this.recordCount = 0;
            this.lastRecordTime = null;
            this.totalTime = 0;
            this.isFirstRecord = true;
            this.realTimer = null;
            this.realTimeSeconds = 0;
            this.destroy = () => {
                this.stop();
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                if (this.realTimer) {
                    clearInterval(this.realTimer);
                    this.realTimer = null;
                }
            };

            setTimeout(() => {
                this.updateStatus('info', '记录器已就绪，点击开始记录按钮开始记录学习时长');
            }, 500);
        }

        async createSignature(message) {
            const encoded = encodeURIComponent(message);
            const msgBuffer = new TextEncoder().encode(encoded);
            const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        async sendRecord() {
            try {
                const params = await this.getCurrentPageParams();
                if (!params || !params.userId || !params.groupId || !params.resourceId) {
                    console.log('缺少必要参数:', params);
                    this.updateStatus('error', '记录失败：缺少必要参数');
                    return;
                }

                const message = JSON.stringify({
                    user_id: params.userId,
                    group_id: params.groupId,
                    clientType: 1,
                    roleType: 1,
                    resourceId: params.resourceId
                });

                const token = getCookie('prd-access-token');

                if (!token) {
                    console.error('未找到认证令牌');
                    return;
                }

                const body = {
                    message: message,
                    signature: await this.createSignature(message),
                    timestamp: Date.now().toString(),
                    nonce: crypto.randomUUID()
                };

                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(body)
                });

                const result = await response.json();
                if (result.code === 200 || result.success) {
                    this.recordCount++;
                    this.lastRecordTime = new Date();
                    if (!this.isFirstRecord) {
                        this.totalTime += 30;
                    }
                    this.isFirstRecord = false;

                    this.updateStatus('success', '记录成功');
                } else {
                    this.updateStatus('error', '记录失败：' + (result.message || '未知错误'));
                }
            } catch (error) {
                console.error('记录失败:', error);
                this.updateStatus('error', '记录失败：' + (error.message || '未知错误'));

                this.failureCount = (this.failureCount || 0) + 1;
                if (this.failureCount >= 3) {
                    this.stop();
                    this.updateStatus('error', '由于连续记录失败,已自动停止记录');
                }
            }
        }

        async getCurrentPageParams() {
            const userId = await getUserInfo();
            return {
                userId: userId,
                groupId: getGroupIdFromUrl(),
                resourceId: getResourceIdFromUrl()
            };
        }

        updateStatus(type, message) {
            const event = new CustomEvent('recordStatus', {
                detail: {
                    type,
                    message,
                    count: this.recordCount,
                    time: this.lastRecordTime,
                    totalTime: this.totalTime,
                    realTimeSeconds: this.realTimeSeconds
                }
            });
            document.dispatchEvent(event);
        }

        reset() {
            this.recordCount = 0;
            this.lastRecordTime = null;
            this.totalTime = 0;
            this.isFirstRecord = true;
            this.realTimeSeconds = 0;
            this.updateStatus('info', '记录已重置');
        }

        startRealTimer() {
            if (this.realTimer) return;
            this.realTimer = setInterval(() => {
                this.realTimeSeconds++;
                const event = new CustomEvent('timeUpdate', {
                    detail: {
                        realTimeSeconds: this.realTimeSeconds
                    }
                });
                document.dispatchEvent(event);
            }, 1000);
        }

        stopRealTimer() {
            if (this.realTimer) {
                clearInterval(this.realTimer);
                this.realTimer = null;
            }
            this.realTimeSeconds = 0;
        }

        async start() {
            try {
                const params = await this.getCurrentPageParams();
                if (!params || !params.userId || !params.groupId || !params.resourceId) {
                    this.updateStatus('error', '无法开始记录：缺少必要参数');
                    return false;
                }

                const token = getCookie('prd-access-token');
                if (!token) {
                    this.updateStatus('error', '无法开始记录：未找到访问令牌');
                    return false;
                }

                if (this.timer) return true;
                await this.sendRecord();
                this.timer = setInterval(() => this.sendRecord(), this.interval);
                this.startRealTimer();
                console.log('开始记录学习时长');
                return true;
            } catch (error) {
                this.updateStatus('error', '启动记录器失败：' + error.message);
                return false;
            }
        }

        stop() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
                this.stopRealTimer();
                this.reset();
                console.log('停止记录学习时长');
            }
        }
    }

    function createRecorderComponent() {
        const recorderSection = document.createElement('div');
        const recorder = xiaoYaRecorder;

        if (!recorder) {
            console.error('未找到全局记录器实例');
            return recorderSection;
        }

        recorderSection.innerHTML = `
            <div style="
                margin: 32px 0;
                padding: 20px;
                background: linear-gradient(145deg, rgba(249,250,251,0.97), rgba(243,244,246,0.97));
                border-radius: 20px;
                border: 1px solid rgba(59,130,246,0.1);
                box-shadow: 0 4px 16px rgba(0,0,0,0.03);
                backdrop-filter: blur(8px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            ">
                <div class="pulse-bg" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                "></div>

                <div style="
                    display: flex;
                    height: 60px;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    ">
                        <div class="timer-icon" style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(145deg, #3B82F6, #2563EB);
                            border-radius: 16px;
                            color: white;
                            font-size: 24px;
                            transform-origin: center;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            box-shadow: 0 4px 12px rgba(37,99,235,0.2);
                        ">⏱️</div>
                        <div style="flex: 1;">
                            <div style="
                                font-weight: 600;
                                color: #2563eb;
                                margin-bottom: 6px;
                                font-size: 16px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            ">
                                学习时长记录
                                <span class="record-status" style="
                                    font-size: 12px;
                                    padding: 3px 5px;
                                    background: linear-gradient(145deg, rgba(59,130,246,0.1), rgba(37,99,235,0.1));
                                    border-radius: 12px;
                                    color: #2563eb;
                                    display: none;
                                ">记录中</span>
                            </div>
                            <div style="
                                color: #6b7280;
                                font-size: 13px;
                                line-height: 1.5;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            ">
                                <span class="dot-pulse" style="
                                    width: 6px;
                                    height: 6px;
                                    border-radius: 50%;
                                    background: #D1D5DB;
                                    display: inline-block;
                                    margin-right: 2px;
                                "></span>
                                每30秒自动记录一次
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button id="start-record" class="record-btn" style="
                            padding: 10px 20px;
                            border: none;
                            border-radius: 12px;
                            background: linear-gradient(145deg, #3B82F6, #2563EB);
                            color: white;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            box-shadow: 0 4px 12px rgba(37,99,235,0.2);
                        ">
                            <span class="btn-icon">▶</span>
                            开始记录
                        </button>
                        <button id="stop-record" class="record-btn" style="
                            padding: 10px 20px;
                            border: none;
                            border-radius: 12px;
                            background: linear-gradient(145deg, #EF4444, #DC2626);
                            color: white;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            box-shadow: 0 4px 12px rgba(239,68,68,0.2);
                            opacity: 0.5;
                        " disabled>
                            <span class="btn-icon">■</span>
                            停止记录
                        </button>
                    </div>
                </div>
                <div class="status-info" style="
                    margin-top: 12px;
                    padding: 16px;
                    border-radius: 12px;
                    background: linear-gradient(145deg, rgba(59,130,246,0.05), rgba(37,99,235,0.05));
                    font-size: 13px;
                    color: #4B5563;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    position: relative;
                    overflow: hidden;
                ">
                    <div class="record-count" style="
                        flex: 1;
                        min-width: 140px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <div style="
                            background: linear-gradient(145deg, #3B82F6, #2563EB);
                            color: white;
                            width: 24px;
                            height: 24px;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                        ">📊</div>
                        <div>
                            <div style="color: #6B7280; margin-bottom: 2px;">请求次数</div>
                            <div style="
                                font-size: 18px;
                                font-weight: 600;
                                color: #2563EB;
                                transition: all 0.3s ease;
                            "><span>0</span> 次</div>
                        </div>
                    </div>

                    <div class="last-record-time" style="
                        flex: 2;
                        min-width: 200px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <div style="
                            background: linear-gradient(145deg, #3B82F6, #2563EB);
                            color: white;
                            width: 24px;
                            height: 24px;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                        ">🕒</div>
                        <div>
                            <div style="color: #6B7280; margin-bottom: 2px;">上次记录时间</div>
                            <div style="
                                font-size: 15px;
                                font-weight: 500;
                                color: #1F2937;
                                transition: all 0.3s ease;
                            "><span>暂无记录</span></div>
                        </div>
                    </div>

                    <div class="record-status-message" style="
                        width: 100%;
                        padding: 8px 12px;
                        margin-top: 4px;
                        border-radius: 8px;
                        background: rgba(59,130,246,0.05);
                        color: #3B82F6;
                        font-weight: 500;
                        transition: all 0.3s ease;
                        opacity: 0;
                        transform: translateY(10px);
                    "></div>

                    <div class="total-study-time" style="
                        flex: 2;
                        min-width: 200px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        position: relative;
                    ">
                        <div style="
                            background: linear-gradient(145deg, #3B82F6, #2563EB);
                            color: white;
                            width: 24px;
                            height: 24px;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                        ">📚</div>
                        <div style="flex: 1;">
                            <div style="color: #6B7280; margin-bottom: 2px;">有效时长</div>
                            <div style="
                                font-size: 18px;
                                font-weight: 600;
                                color: #2563EB;
                                transition: all 0.3s ease;
                                font-variant-numeric: tabular-nums;
                            "><span>0:00</span></div>
                        </div>
                            <div class="real-time" style="
                            flex: 2;
                            min-width: 200px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            position: relative;
                        ">
                            <div style="
                                background: linear-gradient(145deg, #3B82F6, #2563EB);
                                color: white;
                                width: 24px;
                                height: 24px;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 12px;
                            ">⏱️</div>
                            <div style="flex: 1;">
                                <div style="color: #6B7280; margin-bottom: 2px;">实际计时</div>
                                <div style="
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #2563EB;
                                    transition: all 0.3s ease;
                                    font-variant-numeric: tabular-nums;
                                "><span>0:00:00</span></div>
                            </div>
                        </div>
                        <div class="progress-container" style="
                            width: 120px;
                            height: 8px;
                            background: rgba(59,130,246,0.1);
                            border-radius: 4px;
                            overflow: hidden;
                            margin-left: auto;
                            align-self: center;
                            position: relative;
                            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                        ">
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes dot-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes pulse-bg {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
                }

                @keyframes countChange {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }

                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes timeUpdate {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-10px);
                        opacity: 0;
                    }
                    51% {
                        transform: translateY(10px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }

                @keyframes progress-glow {
                    0% {
                        background-position: 0% 50%;
                        filter: brightness(1);
                    }
                    50% {
                        background-position: 100% 50%;
                        filter: brightness(1.2);
                    }
                    100% {
                        background-position: 0% 50%;
                        filter: brightness(1);
                    }
                }

                @keyframes progress-shine {
                    0% {
                        transform: translateX(-100%) skewX(-15deg);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateX(200%) skewX(-15deg);
                        opacity: 0;
                    }
                }

                .record-btn:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(37,99,235,0.3);
                }

                .record-btn:not(:disabled):active {
                    transform: translateY(1px);
                }

                .recording .timer-icon {
                    animation: pulse 2s infinite ease-in-out;
                }

                .recording .dot-pulse {
                    animation: dot-pulse 2s infinite ease-in-out;
                    background-color: #3B82F6 !important;
                    transition: background-color 0.3s ease;
                }

                .recording .pulse-bg {
                    opacity: 1;
                }

                .pulse-bg::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    border-radius: inherit;
                    animation: pulse-bg 2s infinite;
                    transform-origin: center;
                    pointer-events: none;
                    will-change: transform;
                }

                .status-info .record-count span {
                    display: inline-block;
                }

                .count-update {
                    animation: countChange 0.3s ease-out;
                }

                .message-show {
                    animation: messageSlideIn 0.3s ease-out forwards;
                }

                .time-update {
                    animation: timeUpdate 0.5s ease-out;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        #3B82F6,
                        #2563EB,
                        #4F46E5,
                        #2563EB,
                        #3B82F6
                    );
                    background-size: 200% auto;
                    transform-origin: left;
                    border-radius: 4px;
                    position: relative;
                }

                .progress-bar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.4),
                        transparent
                    );
                    transform: translateX(-100%) skewX(-15deg);
                }

                .recording .progress-bar {
                    animation:
                        progress 30s linear infinite,
                        progress-glow 2s ease-in-out infinite;
                }

                .recording .progress-bar::after {
                    animation: progress-shine 3s ease-in-out infinite;
                }

                .progress-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.3),
                        transparent
                    );
                }
            </style>
        `;

        const container = recorderSection.querySelector('div');
        const timerIcon = recorderSection.querySelector('.timer-icon');
        const recordStatus = recorderSection.querySelector('.record-status');
        const startBtn = recorderSection.querySelector('#start-record');
        const stopBtn = recorderSection.querySelector('#stop-record');

        startBtn.onclick = async () => {
            const success = await recorder.start();
            if (!success) {
                return;
            }

            startBtn.style.opacity = '0.5';
            startBtn.disabled = true;
            stopBtn.style.opacity = '1';
            stopBtn.disabled = false;
            container.classList.add('recording');
            recordStatus.style.display = 'inline-block';

            timerIcon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                timerIcon.style.transition = 'transform 1s linear';
                timerIcon.style.transform = 'rotate(0deg)';
            }, 300);
        };

        stopBtn.onclick = () => {
            recorder.stop();
            startBtn.style.opacity = '1';
            startBtn.disabled = false;
            stopBtn.style.opacity = '0.5';
            stopBtn.disabled = true;
            container.classList.remove('recording');
            recordStatus.style.display = 'none';

            const statusInfo = recorderSection.querySelector('.status-info');
            const countElement = statusInfo.querySelector('.record-count span');
            const timeElement = statusInfo.querySelector('.last-record-time span');

            countElement.textContent = '0';
            timeElement.textContent = '暂无记录';

            timerIcon.style.transform = 'scale(0.8)';
            setTimeout(() => {
                timerIcon.style.transform = 'scale(1)';
            }, 200);
        };

        function formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        document.addEventListener('timeUpdate', (e) => {
            const { realTimeSeconds } = e.detail;
            const realTimeElement = recorderSection.querySelector('.real-time span');
            realTimeElement.textContent = formatTime(realTimeSeconds);
        });

        document.addEventListener('recordStatus', (e) => {
            const { type, message, count, time, totalTime, realTimeSeconds } = e.detail;
            const statusInfo = recorderSection.querySelector('.status-info');
            const countElement = statusInfo.querySelector('.record-count span');
            const timeElement = statusInfo.querySelector('.last-record-time span');
            const messageElement = statusInfo.querySelector('.record-status-message');
            const timeStudiedElement = statusInfo.querySelector('.total-study-time span');
            const realTimeElement = statusInfo.querySelector('.real-time span');
            timeStudiedElement.textContent = formatTime(totalTime);
            realTimeElement.textContent = formatTime(realTimeSeconds);

            if (type === 'success') {
                const progressBar = statusInfo.querySelector('.progress-bar');
                progressBar.style.animation = 'none';
                void progressBar.offsetWidth;
                progressBar.style.animation = null;
            }

            countElement.classList.remove('count-update');
            void countElement.offsetWidth;
            countElement.classList.add('count-update');
            countElement.textContent = count;

            timeElement.textContent = time ? time.toLocaleString() : '暂无记录';

            messageElement.textContent = message;
            messageElement.style.color = (() => {
                switch (type) {
                    case 'success':
                        return '#10B981';
                    case 'error':
                        return '#EF4444';
                    case 'info':
                    default:
                        return '#3B82F6';
                }
            })();

            messageElement.style.background = (() => {
                switch (type) {
                    case 'success':
                        return 'rgba(16,185,129,0.05)';
                    case 'error':
                        return 'rgba(239,68,68,0.05)';
                    case 'info':
                    default:
                        return 'rgba(59,130,246,0.05)';
                }
            })();

            messageElement.classList.remove('message-show');
            void messageElement.offsetWidth;
            messageElement.classList.add('message-show');
        });

        return recorderSection;
    }

    async function fetchUnfinishedTasks() {
        try {
            const token = getCookie('prd-access-token');
            const response = await fetch(`https://${domain}/api/jx-stat/group/task/un_finish`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "content-type": "application/json; charset=UTF-8"
                }
            });

            const data = await response.json();
            if (data.success) {
                renderUnfinishedTasks(data.data);
            }
        } catch (error) {
            console.error('获取未完成任务失败:', error);
            showEmptyFallback();
        }
    }

    function getTaskWeight(endTime) {
        const now = new Date();
        const endDate = new Date(endTime);
        const daysLeft = (endDate - now) / (1000 * 60 * 60 * 24);

        if (endDate < now) return -1;
        if (daysLeft < 1) return 100;
        if (daysLeft < 3) return 50;
        return 10;
    }

    function renderUnfinishedTasks(tasks) {
        const container = document.getElementById('unfinished-tasks');
        if (!tasks?.length) {
            showEmptyFallback();
            return;
        }

        const sortedTasks = [...tasks].sort((a, b) => {
            const weightA = getTaskWeight(a.end_time);
            const weightB = getTaskWeight(b.end_time);
            return weightB - weightA;
        });

        const groupedTasks = sortedTasks.reduce((acc, task) => {
            if (!acc[task.group_name]) {
                acc[task.group_name] = [];
            }
            acc[task.group_name].push(task);
            return acc;
        }, {});

        container.innerHTML = Object.entries(groupedTasks).map(([courseName, tasks]) => `
            <div class="course-tasks" style="
                background: white;
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border: 1px solid #e5e7eb;
                transition: all 0.2s ease;
            ">
                <div class="course-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f3f4f6;
                    cursor: pointer;
                ">
                    <h3 style="
                        font-size: 18px;
                        color: #1f2937;
                        margin: 0;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span class="course-icon" style="
                            background: #eef2ff;
                            color: #4f46e5;
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 8px;
                            font-size: 16px;
                        ">📑</span>
                        ${courseName}
                    </h3>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="
                            background: #eef2ff;
                            color: #4f46e5;
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-size: 13px;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        ">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            ${tasks.length} 个待完成
                        </span>
                        <div class="expand-icon" style="
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            background: #f3f4f6;
                            transition: transform 0.3s ease;
                        ">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="task-list" style="
                    display: grid;
                    gap: 12px;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    max-height: 1000px;
                ">
                    ${tasks.map(task => `
                        <div class="task-item"
                            style="
                                display: flex;
                                align-items: center;
                                gap: 16px;
                                padding: 16px;
                                background: #f9fafb;
                                border-radius: 12px;
                                transition: all 0.2s;
                                cursor: pointer;
                                border: 1px solid transparent;
                            "
                            onmouseenter="this.style.background='white'; this.style.borderColor='#e5e7eb'; this.style.transform='scale(1.01)'"
                            onmouseleave="this.style.background='#f9fafb'; this.style.borderColor='transparent'; this.style.transform='none'"
                            onclick="window.location.href='/app/jx-web/mycourse/${task.group_id}/resource/${task.resource_id || '_'}/${task.node_id || ''}'"
                        >
                            <div style="
                                width: 40px;
                                height: 40px;
                                border-radius: 10px;
                                background: ${getTaskTypeColor(task.task_type)};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 18px;
                                box-shadow: 0 2px 8px ${getTaskTypeColor(task.task_type)}40;
                            ">${getTaskTypeIcon(task.task_type)}</div>
                            <div style="flex: 1">
                                <div style="
                                    font-size: 15px;
                                    font-weight: 600;
                                    color: #374151;
                                    margin-bottom: 6px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    gap: 8px;
                                ">
                                    ${task.name}
                                    <span style="
                                        font-size: 12px;
                                        padding: 2px 8px;
                                        white-space: nowrap;
                                        border-radius: 4px;
                                        background: ${getTaskUrgencyBg(task.end_time)};
                                        color: ${getTaskUrgencyColor(task.end_time)};
                                    ">${getTaskUrgencyText(task.end_time)}</span>
                                </div>
                                <div style="
                                    font-size: 13px;
                                    color: #6b7280;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                ">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                        <path stroke-linecap="round" d="M12 6v6l4 2"/>
                                    </svg>
                                    截止时间: ${new Date(task.end_time).toLocaleString('zh-CN')}
                                </div>
                            </div>
                            <div style="
                                width: 32px;
                                height: 32px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 8px;
                                background: #f3f4f6;
                                color: #9ca3af;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.course-tasks').forEach(courseEl => {
            const header = courseEl.querySelector('.course-header');
            const taskList = courseEl.querySelector('.task-list');
            const expandIcon = courseEl.querySelector('.expand-icon');
            let isExpanded = true;
            let isAnimating = false;

            header.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                isExpanded = !isExpanded;

                if (isExpanded) {
                    taskList.style.maxHeight = 'none';
                    const actualHeight = taskList.scrollHeight;

                    taskList.style.maxHeight = '0';
                    requestAnimationFrame(() => {
                        taskList.style.maxHeight = actualHeight + 'px';
                    });
                } else {
                    taskList.style.maxHeight = taskList.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        taskList.style.maxHeight = '0';
                    });
                }

                expandIcon.style.transform = isExpanded ? 'rotate(0)' : 'rotate(-180deg)';

                taskList.addEventListener('transitionend', () => {
                    isAnimating = false;
                    if (isExpanded) {
                        taskList.style.maxHeight = 'none';
                    }
                }, { once: true });
            });

            header.addEventListener('mouseenter', () => {
                expandIcon.style.background = '#eef2ff';
                expandIcon.querySelector('svg').style.stroke = '#4f46e5';
            });

            header.addEventListener('mouseleave', () => {
                expandIcon.style.background = '#f3f4f6';
                expandIcon.querySelector('svg').style.stroke = 'currentColor';
            });
        });
    }

    function getTaskTypeColor(type) {
        const colors = {
            1: '#22c55e',
            2: '#ef4444',
            3: '#3b82f6',
            4: '#a855f7',
            5: '#f97316',
            6: '#06b6d4'
        };
        return colors[type] || '#9ca3af';
    }

    function getTaskTypeIcon(type) {
        const icons = {
            1: '📺',
            2: '✍️',
            3: '📚',
            4: '💯',
            5: '📋',
            6: '💭'
        };
        return icons[type] || '📌';
    }

    function getTaskUrgencyBg(endTime) {
        const now = new Date();
        const endDate = new Date(endTime);
        if (endDate < now) return '#f3f4f6';
        const daysLeft = (endDate - now) / (1000 * 60 * 60 * 24);
        if (daysLeft < 1) return '#fee2e2';
        if (daysLeft < 3) return '#fff7ed';
        return '#ecfdf5';
    }

    function getTaskUrgencyColor(endTime) {
        const now = new Date();
        const endDate = new Date(endTime);
        if (endDate < now) return '#6b7280';
        const daysLeft = (endDate - now) / (1000 * 60 * 60 * 24);
        if (daysLeft < 1) return '#ef4444';
        if (daysLeft < 3) return '#f59e0b';
        return '#10b981';
    }

    function getTaskUrgencyText(endTime) {
        const now = new Date();
        const endDate = new Date(endTime);
        if (endDate < now) return '已过期';

        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysLeft < 1) {
            const hoursLeft = Math.ceil((endDate - now) / (1000 * 60 * 60));
            if (hoursLeft <= 0) return '即将截止';
            return `剩余 ${hoursLeft} 小时`;
        }
        return `剩余 ${daysLeft} 天`;
    }

    function showEmptyFallback() {
        document.getElementById('unfinished-tasks').innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
                border-radius: 24px;
                padding: 48px 24px;
                text-align: center;
                box-shadow: 0 4px 24px rgba(59, 130, 246, 0.08);
                border: 1px solid #e5e7eb;
                max-width: 480px;
                margin: 40px auto;
                transition: all 0.3s ease;
            "
            onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 32px rgba(59, 130, 246, 0.12)'"
            onmouseleave="this.style.transform='none'; this.style.boxShadow='0 4px 24px rgba(59, 130, 246, 0.08)'"
            >
                <div style="
                    width: 160px;
                    height: 160px;
                    margin: 0 auto 24px;
                    background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: float 3s ease-in-out infinite;
                ">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h3 style="
                    font-size: 24px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 0 12px;
                ">太棒了！任务全部完成</h3>
                <p style="
                    font-size: 16px;
                    color: #6b7280;
                    margin: 0;
                    line-height: 1.6;
                ">你已经完成了所有学习任务，好好放松一下吧！ ✨</p>
                <style>
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                </style>
            </div>
        `;
    }

    function initTaskList() {
        let container = document.getElementById('task-container');
        let controller = document.getElementById('task-controller');

        if (xiaoYaRecorder) {
            xiaoYaRecorder.stop();
            xiaoYaRecorder = null;
        }

        xiaoYaRecorder = new LearnRecorder();

        if (!controller) {
            controller = document.createElement('div');
            controller.id = 'task-controller';
            Object.assign(controller.style, {
                position: 'fixed',
                right: '20px',
                top: '10%',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                cursor: 'pointer',
                zIndex: '1001',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(0)',
            });

            controller.innerHTML = `
                <div class="controller-icon" style="
                    width: 24px;
                    height: 24px;
                    position: relative;
                    transition: transform 0.3s ease;
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </div>
            `;

            document.body.appendChild(controller);
            requestAnimationFrame(() => controller.style.transform = 'scale(1)');
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'task-container';
            controller.title = '展开任务列表';

            Object.assign(container.style, {
                position: 'fixed',
                top: '10%',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '20px',
                zIndex: '1000',
                maxHeight: '80vh',
                width: '600px',
                overflowY: 'auto',
                scrollbarGutter: 'stable',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: 'translateX(450px)',
                opacity: '0',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                pointerEvents: 'none'
            });

            container.innerHTML = `
                <div class="empty-container" style="
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding: 20px;
                ">
                    <div class="section-header" style="
                        text-align: center;
                        margin-bottom: 12px;
                    ">
                        <h2 style="
                            font-size: 24px;
                            font-weight: 600;
                            color: #3b82f6;
                            margin: 0;
                        ">待完成任务总览</h2>
                        <p style="
                            font-size: 14px;
                            color: #6b7280;
                            margin: 8px 0 0;
                        ">获取所有课程待完成任务</p>
                    </div>

                    <div id="unfinished-tasks" style="
                        display: grid;
                        gap: 16px;
                    ">
                        <div class="loading-state" style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            padding: 32px;
                        ">
                            <div class="spinner" style="
                                width: 40px;
                                height: 40px;
                                border: 3px solid rgba(59,130,246,0.1);
                                border-radius: 50%;
                                border-top-color: #3b82f6;
                                animation: spin 1s linear infinite;
                                margin-bottom: 16px;
                            "></div>
                            <div style="color: #6b7280; font-size: 14px;">
                                正在获取任务信息...
                            </div>
                        </div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;
            document.body.appendChild(container);
        }

        let isExpanded = false;
        controller.onclick = () => {
            isExpanded = !isExpanded;

            controller.style.transform = isExpanded ? 'scale(0.9)' : 'scale(1)';
            controller.querySelector('.controller-icon').style.transform = isExpanded ? 'rotate(-180deg)' : 'rotate(0)';

            if (isExpanded) {
                container.style.transform = 'translateX(0) scale(1)';
                container.style.opacity = '1';
                container.style.pointerEvents = 'auto';

                container.style.animation = 'expandIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                controller.style.right = '640px';
                controller.title = '收起任务列表';
            } else {
                container.style.transform = 'translateX(450px) scale(0.9)';
                container.style.opacity = '0';
                container.style.pointerEvents = 'none';

                container.style.animation = 'expandOut 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                controller.style.right = '20px';
                controller.title = '展开任务列表';
            }
        };

        controller.onmouseenter = () => {
            controller.style.transform = 'scale(1.1)';
            controller.style.boxShadow = '0 6px 16px rgba(37,99,235,0.3)';
        };
        controller.onmouseleave = () => {
            controller.style.transform = isExpanded ? 'scale(0.9)' : 'scale(1)';
            controller.style.boxShadow = '0 4px 12px rgba(37,99,235,0.2)';
        };

        const GROUP_ID = getGroupIdFromUrl();
        if (!GROUP_ID) {
            console.log('不在课程页面，跳过初始化');
            return;
        }

        const recorderComponent = createRecorderComponent();
        container.appendChild(recorderComponent);

        getAuthToken().then(authToken => {
            Promise.all([
                fetchTaskList(authToken),
                fetchResourceList(authToken)
            ]).then(([tasks, resources]) => {
                console.log('任务数量:', tasks.length);
                if (Array.isArray(tasks) && tasks.length > 0) {
                    showTaskList(container, tasks, resources);
                }
            }).catch(error => {
                showNotification('获取数据失败：' + error, {
                    type: 'error',
                    keywords: ['获取', '失败']
                });
            });
        }).catch(error => {
            showNotification('无法获取token，请确保已登录并且cookie中包含prd-access-token', {
                type: 'error',
                keywords: ['token', '登录', 'cookie']
            });
        });

        window.learnRecorder = xiaoYaRecorder;
    }

    function onUrlChange() {
        if (location.href.includes('mycourse')) {
            const now = Date.now();
            if (now - (window.lastUrlChange || 0) < 500) {
                return;
            }
            window.lastUrlChange = now;

            if (xiaoYaRecorder) {
                xiaoYaRecorder.stop();
                xiaoYaRecorder = null;
            }

            const oldContainer = document.getElementById('task-container');
            const oldController = document.getElementById('task-controller');
            if (oldContainer) oldContainer.remove();
            if (oldController) oldController.remove();

            initTaskList();
            fetchUnfinishedTasks();
        }
    }

    (function (history) {
        var pushState = history.pushState;
        history.pushState = function () {
            var ret = pushState.apply(history, arguments);
            onUrlChange();
            return ret;
        };
    })(window.history);

    (function (history) {
        var replaceState = history.replaceState;
        history.replaceState = function () {
            var ret = replaceState.apply(history, arguments);
            onUrlChange();
            return ret;
        };
    })(window.history);

    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);

    onUrlChange();
})();