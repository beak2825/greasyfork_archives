// ==UserScript==
// @name         B站全量取关助手
// @namespace    https://greasyfork.org/users/1383389
// @version      1.2
// @description  一键取消全部关注，失败自动重试
// @author       deepseek
// @match        https://space.bilibili.com/*/relation/follow
// @require      https://cdn.jsdelivr.net/npm/axios@1.7.3/dist/axios.min.js
// @grant        GM_addStyle
// @icon         https://static.hdslb.com/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525099/B%E7%AB%99%E5%85%A8%E9%87%8F%E5%8F%96%E5%85%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/525099/B%E7%AB%99%E5%85%A8%E9%87%8F%E5%8F%96%E5%85%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    class BulkUnfollow {
        constructor() {
            this.CSRF = document.cookie.split('; ').find(row => row.startsWith('bili_jct='))?.split('=')[1];
            this.UID = window.location.pathname.split('/')[1];
            this.DELAY = 150; // 基础延迟
            this.RETRY_LIMIT = 3; // 失败重试次数
            this.isRunning = false;
            this.taskQueue = [];
            this.failedList = [];
            this.stats = {
                total: 0,
                success: 0,
                failed: 0
            };
        }

        // 获取全部关注列表
        async fetchAllFollowers() {
            try {
                let list = [];
                let page = 1;
                
                while(true) {
                    const { data } = await axios.get(
                        `https://api.bilibili.com/x/relation/followings?vmid=${this.UID}&pn=${page}&ps=100`,
                        { withCredentials: true }
                    );
                    
                    if (!data.data || !data.data.list || data.data.list.length === 0) break;
                    
                    list = list.concat(data.data.list);
                    if (list.length >= data.data.total) break;
                    page++;
                }
                return list;
            } catch (error) {
                console.error('获取关注列表失败:', error);
                return [];
            }
        }

        // 执行取消关注
        async executeUnfollow(mid, retryCount = 0) {
            try {
                const params = new URLSearchParams();
                params.append('fid', mid);
                params.append('act', 2);
                params.append('re_src', 11);
                params.append('csrf', this.CSRF);

                const { data } = await axios.post(
                    'https://api.bilibili.com/x/relation/modify',
                    params,
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        withCredentials: true,
                        timeout: 3000
                    }
                );
                
                if (data.code === 0) return true;
                throw new Error(data.message);
            } catch (error) {
                if (retryCount < this.RETRY_LIMIT) {
                    await new Promise(r => setTimeout(r, 500 * (retryCount + 1)));
                    return this.executeUnfollow(mid, retryCount + 1);
                }
                return false;
            }
        }

        // 主流程控制
        async processAll() {
            this.isRunning = true;
            this.stats = { total: 0, success: 0, failed: 0 };
            
            try {
                // 获取全部关注
                const users = await this.fetchAllFollowers();
                this.stats.total = users.length;
                this.updateProgress();

                // 执行取消操作
                for (const user of users) {
                    if (!this.isRunning) break;
                    
                    const result = await this.executeUnfollow(user.mid);
                    result ? this.stats.success++ : this.stats.failed++;
                    
                    this.updateProgress();
                    await new Promise(r => setTimeout(r, this.DELAY));
                }

                // 自动重试失败项
                if (this.stats.failed > 0) {
                    this.retryFailed();
                } else {
                    this.showFinalResult();
                }
            } finally {
                this.isRunning = false;
            }
        }

        // 失败自动重试
        async retryFailed() {
            let retryCount = 0;
            while (this.stats.failed > 0 && retryCount < 2) {
                this.stats.failed = 0;
                const failedCopy = [...this.failedList];
                this.failedList = [];
                
                for (const user of failedCopy) {
                    if (!this.isRunning) break;
                    
                    const result = await this.executeUnfollow(user.mid);
                    result ? this.stats.success++ : this.stats.failed++;
                    
                    this.updateProgress();
                    await new Promise(r => setTimeout(r, this.DELAY));
                }
                retryCount++;
            }
            this.showFinalResult();
        }

        // 界面更新
        updateProgress() {
            const progress = document.getElementById('bulk-progress');
            if (progress) {
                progress.innerHTML = `
                    <div>总进度：${this.stats.success + this.stats.failed}/${this.stats.total}</div>
                    <div>成功：${this.stats.success} | 失败：${this.stats.failed}</div>
                    <div>剩余重试次数：${this.RETRY_LIMIT - this.failedList.length}</div>
                `;
            }
        }

        // 最终结果显示
        showFinalResult() {
            const result = `操作完成！<br>
                成功：${this.stats.success}<br>
                失败：${this.stats.failed}<br>
                ${this.stats.failed > 0 ? '失败项已自动重试' : ''}`;
            
            this.showPopup('操作结果', result, true);
            window.location.reload();
        }

        // 通用弹窗
        showPopup(title, content, showClose = true) {
            const popup = document.createElement('div');
            popup.className = 'bulk-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3>${title}</h3>
                    <div class="popup-body">${content}</div>
                    ${showClose ? '<button class="popup-close">关闭</button>' : ''}
                </div>
            `;
            
            document.body.appendChild(popup);
            popup.querySelector('.popup-close')?.addEventListener('click', () => popup.remove());
        }

        // 创建控制面板
        createControlPanel() {
            const panel = document.createElement('div');
            panel.className = 'bulk-control';
            panel.innerHTML = `
                <div class="control-box">
                    <button id="start-unfollow">一键取消全部关注</button>
                    <div id="bulk-progress"></div>
                    <button id="stop-unfollow" style="display:none">停止操作</button>
                </div>
            `;

            // 插入到页面合适位置
            const container = document.querySelector('#page-follow') || document.body;
            container.prepend(panel);

            // 事件绑定
            panel.querySelector('#start-unfollow').addEventListener('click', () => {
                panel.querySelector('#start-unfollow').disabled = true;
                panel.querySelector('#stop-unfollow').style.display = 'inline-block';
                this.processAll();
            });

            panel.querySelector('#stop-unfollow').addEventListener('click', () => {
                this.isRunning = false;
                panel.querySelector('#start-unfollow').disabled = false;
                panel.querySelector('#stop-unfollow').style.display = 'none';
            });
        }
    }

    // 样式注入
    GM_addStyle(`
        .bulk-control {
            margin: 20px;
            padding: 15px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }
        
        #start-unfollow {
            padding: 10px 20px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        #start-unfollow:hover {
            background: #0088b3;
        }
        
        #start-unfollow:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        
        #bulk-progress {
            margin: 15px 0;
            padding: 10px;
            background: #f5f6f7;
            border-radius: 5px;
            font-size: 14px;
            color: #666;
        }
        
        #stop-unfollow {
            padding: 8px 15px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .bulk-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        }
        
        .popup-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            min-width: 300px;
            text-align: center;
        }
        
        .popup-close {
            margin-top: 15px;
            padding: 8px 20px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `);

    // 初始化
    const unfollow = new BulkUnfollow();
    unfollow.createControlPanel();
})();