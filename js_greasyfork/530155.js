// ==UserScript==
// @name         Temu-广告数据下载
// @namespace    http://tampermonkey.net/
// @version      2025-03-18
// @description  下载Temu-广告数据，作为报表基础表
// @author       xx99czj
// @license      GPL-3.0
// @match        https://us.ads.temu.com/ad-list.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530155/Temu-%E5%B9%BF%E5%91%8A%E6%95%B0%E6%8D%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/530155/Temu-%E5%B9%BF%E5%91%8A%E6%95%B0%E6%8D%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 创建样式
    const style = document.createElement('style');
    function toStyle () {
        style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 16px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index:10001;
        }
        .topBar {
            position: fixed;
            right: 20px;
            z-index: 10001;
            top: 30px;
            cursor:pointer;
        }
        body {position: relative;}
    `;

    }
    toStyle()
    document.head.appendChild(style);
    class IndexedDBWrapper {
        constructor(dbName, version = 1, storeName = 'dataStore') {
            this.dbName = dbName;
            this.version = version;
            this.storeName = storeName;
            this.db = null;
        }

        // 打开数据库连接
        async open() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.version);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this.db);
                };

                request.onerror = (event) => {
                    reject(`打开数据库失败: ${event.target.error}`);
                };
            });
        }

        // 存储数据
        async set(key, value) {
            if (!this.db) await this.open();

            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                const request = store.put(value, key);

                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(`存储失败: ${event.target.error}`);
            });
        }

        // 读取数据
        async get(key) {
            if (!this.db) await this.open();

            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);
                const request = store.get(key);

                request.onsuccess = (event) => resolve(event.target.result);
                request.onerror = (event) => reject(`读取失败: ${event.target.error}`);
            });
        }

        // 关闭数据库连接
        close() {
            if (this.db) {
                this.db.close();
                this.db = null;
            }
        }
    }

    // ================== 使用示例 ==================
    // 初始化数据库 (自动创建对象存储)
    const db = new IndexedDBWrapper('AdDatabase', 1, 'adStore');



    function showToast(message) {
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // 将 toast 添加到文档
        document.body.appendChild(toast);

        // 显示 toast
        requestAnimationFrame(() => {
            toast.style.opacity = '1'; // 显示
        });

        // 隐藏 toast
        setTimeout(() => {
            toast.style.opacity = '0'; // 隐藏
            // 移除 toast 元素
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // 等待过渡结束后再移除
        }, 3000); // 3秒后隐藏
    }


    // 拦截fetch请求
    const originalFetch = window.unsafeWindow.fetch;
    window.unsafeWindow.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];
        // 判断是否需要监听
            if (url == '/api/v1/coconut/ad/ads_detail') {
                const clone = response.clone();
                clone.json().then(async (data)=> {
                    console.log('拦截到的fetch响应: ', data);
                    await db.set('data', data);
                    console.log('数据存储成功');

                }).catch(err => {
                    console.error('解析fetch响应失败:', err);
                });

                return response;
            } else {
                return response
            }
    };
    // 拦截 XMLHttpRequest 的 open 方法以捕获 URL
    const originalOpen = window.unsafeWindow.XMLHttpRequest.prototype.open;
    window.unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
        this._url = args[1]; // 保存 URL
        originalOpen.apply(this, args);
    };

    // 拦截 XMLHttpRequest 的 send 方法
    const originalSend = window.unsafeWindow.XMLHttpRequest.prototype.send;
    window.unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        // 判断是否需要监听
        if (this._url === '/api/v1/coconut/ad/ads_detail') {
            // 修改请求 body（如果需要）
            if (args[0]) {
                try {
                    const body = JSON.parse(args[0]);
                    if (body.page_size) {
                        body.page_size = 50; // 将 page_size 改为 50
                    }
                    args[0] = JSON.stringify(body); // 重新设置 body
                } catch (err) {
                    console.error('解析或修改 body 失败:', err);
                }
            }

            // 监听请求完成事件
            this.addEventListener('load', async function () {
                console.log('XMLHttpRequest 加载事件 URL:', this._url);
                try {
                    const response = this.responseText;
                    const data = JSON.parse(response); // 解析响应
                    console.log('拦截到的 XMLHttpRequest 响应:', data);

                    // 存储数据到 IndexedDB
                    await db.set('data', data);
                    console.log('数据存储成功');
                } catch (e) {
                    console.error('解析 XMLHttpRequest 响应失败:', e);
                }
            });
        }

        // 发送请求
        originalSend.apply(this, args);
    };

    // 等待页面完全加载
    window.addEventListener('load', () => {
        console.log('页面已完全加载');

        // 如果在初始加载后动态加载元素, 使用MutationObserver
        const observer = new MutationObserver(() => {

        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 5秒后停止观察
        setTimeout(() => {
            observer.disconnect();
            console.log('停止观察DOM变动');
        }, 2000);

        // 检查页面URL并在特定页面添加按钮
        if (window.location.href.startsWith('https://us.ads.temu.com/ad-list.html')) {
            console.log('在指定页面, 1秒后添加按钮');
            setTimeout(initFixedButton, 1000);
        }

    });
    // 定义点击事件的处理函数
    function downloadTextJson(text) {
        // 创建一个 Blob 对象，指定类型为 JSON
        const blob = new Blob([text], { type: "application/json" });

        // 创建一个指向 Blob 的 URL
        const url = window.URL.createObjectURL(blob);

        // 创建一个隐藏的 <a> 标签用于下载
        const a = document.createElement("a");
        a.href = url; // 设置下载链接
        const storeName = localStorage.mall_id;
        // 创建一个 Date 对象，表示当前日期和时间
        const now = new Date();

        // 获取当前的月份（0-11，0 表示 1 月，1 表示 2 月，以此类推）
        const month = now.getMonth() + 1; // 加 1 是因为 getMonth() 返回的月份是从 0 开始的

        // 获取当前的日期（1-31）
        const date = now.getDate();

        // 如果需要格式化为两位数（例如：03 表示 3 月，08 表示 8 日）
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDate = String(date).padStart(2, '0');

        a.download = `${storeName}-${formattedMonth}/${formattedDate}.json`; // 设置下载文件名
        a.click(); // 触发点击事件，开始下载
        a.remove(); // 下载完成后移除 <a> 标签
        window.URL.revokeObjectURL(url); // 释放 URL 对象
    }


    // 初始化按钮
    function initFixedButton() {
        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.setAttribute('id', 'my-buttons');
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '18px';
        menuContainer.style.right = '2px';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'flex-end';
        menuContainer.style.transition = 'opacity 0.3s';
        menuContainer.style.opacity = '0'; // 初始隐藏
        menuContainer.style.pointerEvents = 'none'; // 初始不可点击
        menuContainer.style.zIndex = '10001';

        // 创建菜单项
        const items = ['data']
        // 菜单栏
        const bar = document.querySelector(`.index-module__sidebarContainer___2EGa_`)||document.querySelector(`.index-module__sidebarContainer___1HGOI`)||document.querySelector(`._14PJGk-N`);
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.zIndex = '10001';
            menuItem.innerText = item;
            menuItem.style.padding = '10px';
            menuItem.style.backgroundColor = '#007BFF';
            menuItem.style.color = 'white';
            menuItem.style.borderRadius = '50%';
            menuItem.style.margin = '5px 0';
            menuItem.style.width = '50px';
            menuItem.style.height = '50px';
            menuItem.style.display = 'flex';
            menuItem.style.alignItems = 'center';
            menuItem.style.justifyContent = 'center';
            menuItem.style.transition = 'transform 0.3s';
            menuItem.style.transform = 'scale(0)'; // 初始隐藏
            menuItem.style.cursor = 'pointer';

            menuItem.addEventListener('click', async () => {
                const res = await db.get('data')
                const jsonString = JSON.stringify(res, null, 2); // 使用缩进格式化 JSON 字符串
                downloadTextJson(jsonString)
            })

            menuContainer.appendChild(menuItem);
        });

        // 创建切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.style.width = '0';
        toggleButton.style.height = '0';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.border = '10px solid #FB7701';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.position = 'fixed';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.bottom = '0px';
        toggleButton.style.right = '0px';

        // 切换菜单显示效果
        toggleButton.addEventListener('click', () => {
            const isVisible = menuContainer.style.opacity === '1';
            menuContainer.style.opacity = isVisible ? '0' : '1';
            menuContainer.style.pointerEvents = isVisible ? 'none' : 'auto';

            // 显示/隐藏菜单项
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transform = isVisible ? 'scale(0)' : 'scale(1)';
            }
        });

        toggleButton.click();

        // 添加元素到文档
        document.body.appendChild(menuContainer);
        document.body.appendChild(toggleButton);

        // 逐个显示菜单项
        setTimeout(() => {
            const menuItems = menuContainer.children;
            for (let i = 0; i < menuItems.length; i++) {
                menuItems[i].style.transitionDelay = `${i * 100}ms`;
            }
        }, 0);
    }

    window.addEventListener('popstate', (event) => {
        const bts = document.querySelector('#my-buttons')
        if (bts) {
            bts.remove();
        }
        initFixedButton ();
    });
})();