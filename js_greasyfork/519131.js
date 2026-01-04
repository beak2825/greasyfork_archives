// ==UserScript==
// @name         TEMU Seller Buttons
// @namespace    http://tampermonkey.net/
// @version      2025/2/25_1.0
// @description  Temu按钮
// @author       xx99czj
// @license      GPL-3.0
// @match        *://seller.temu.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519131/TEMU%20Seller%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/519131/TEMU%20Seller%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';
// --------------------------------  不用改动【start】  --------------------------------
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
    // 获取https://ldp.lifewit.cn/webroot/decision 数据字符串
    function getBaseUrl(url) {
        // 找到 '#' 的位置
        const hashIndex = url.indexOf('#');

        // 如果 '#' 存在，返回 '#' 之前的部分；否则返回完整 URL
        return hashIndex !== -1 ? url.substring(0, hashIndex) : url;
    }

    // ================== 使用示例 ==================
    // 初始化数据库 (自动创建对象存储)
    const db = new IndexedDBWrapper('MyDatabase', 1, 'myStore');

    // 模型函数
    function onClickModuleFun(key) {
        if (key == 'menu') {
            // showOrHiddenBar()
            return 'menu'
        } else if (key == 'full') {
            // fullScreen()
            return 'full'
        } else if (key == 'modal') {
            removeDivs()
            return 'modal'
        } else {
            const data = dataFormat(key, ObjectModlue.tables[key])
            copyTextToClipboard(data)
            return 'dataFormat'
        }
    }


    // 取最后一个pathname
    function getLastPathname(txt) {
        // 定义URL
        const url = new URL(txt);
        // 获取URL的最后一个路径部分
        const lastPathSegment = url.pathname.split('/').pop();
        return lastPathSegment
    }

    // 拦截fetch请求
    const originalFetch = window.unsafeWindow.fetch;
    window.unsafeWindow.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];
        // 判断是否需要监听
        if (ObjectModlue.monitorUrl.hasOwnProperty(getBaseUrl(window.location.href))) {
            const urls = ObjectModlue.monitorUrl[getBaseUrl(window.location.href)]
            if (urls.includes(url)) {
                const clone = response.clone();
                clone.json().then(async (data)=> {
                    console.log('拦截到的fetch响应: ', data);
                    // 如有需要, 可以将拦截到的数据存储在localStorage中
                    // localStorage.setItem('data', JSON.stringify(data));

                    await db.set('data', data);
                    console.log('数据存储成功');

                }).catch(err => {
                    console.error('解析fetch响应失败:', err);
                });

                return response;
            } else {
                return response
            }
        } else {
            return response
        }
    };
    // 通过遍历数组来检查字符串是否包含数组中的某一项
    function containsMatchingString(array, str) {
        return array.some(item => str.startsWith(item));
    }

    // 拦截XMLHttpRequest
    const originalOpen = window.unsafeWindow.XMLHttpRequest.prototype.open;
    window.unsafeWindow.XMLHttpRequest.prototype.open = function (...args) {
        this._url = args[1];
        originalOpen.apply(this, args);
    };

    const originalSend = window.unsafeWindow.XMLHttpRequest.prototype.send;
    window.unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', async function () {
            // 判断是否需要监听
            if (ObjectModlue.monitorUrl.hasOwnProperty(getBaseUrl(window.location.href))) {
                const urls = ObjectModlue.monitorUrl[getBaseUrl(window.location.href)]
               // const targetString = "804cc5a9501d788d";
              //  console.log('--------', this._url, this._url.includes(targetString))
                if (containsMatchingString(urls, this._url)) {
                    console.log('XMLHttpRequest加载事件URL:', this._url);
                    const response = this.responseText;
                    try {
                        const data = JSON.parse(response);

                        console.log('拦截到的XMLHttpRequest响应:', data);
                        // 如有需要, 可以将拦截到的数据存储在localStorage中
                        //localStorage.setItem('data', JSON.stringify(data));

                        await db.set('data', data);
                        console.log('数据存储成功');

                    } catch (e) {
                        console.error('解析XMLHttpRequest响应失败:', e);
                    }
                }
            }
        });
        originalSend.apply(this, args);
    };


    // 等待页面完全加载
    window.addEventListener('load', () => {
        console.log('页面已完全加载');
        // removeDivs();

        // 如果在初始加载后动态加载元素, 使用MutationObserver
        const observer = new MutationObserver(() => {
           // removeDivs();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 5秒后停止观察
        setTimeout(() => {
            observer.disconnect();
            console.log('停止观察DOM变动');
        }, 2000);
        setTimeout(initFixedButton, 1000);

    });
    // 删除特定div的函数
    function removeDivs() {
        const selectors = [
            'body > div[data-testid="beast-core-modal-mask"]',
            'body > div[data-testid="beast-core-modal"]',
            'div.sold-out-goods-list_container__1zO49',
            'div.MDL_mask_5-114-0',
            'div.MDL_modal_5-114-0',
            'div.MDL_outerWrapper_5-114-0',
           // ''
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    // 定义点击事件的处理函数
    function copyTextToClipboard(res) {
        // 在这里编写复制文本到剪贴板的逻辑
        res.then((text) => {
            // 示例：复制文本 "示例文本" 到剪贴板
            navigator.clipboard.writeText(text).then(() => {
                showToast('文本已复制到剪贴板');
            }).catch(err => {
                showToast('复制失败:', err);
            });
        })
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
        const items = ObjectModlue.menus.hasOwnProperty(window.location.href)?ObjectModlue.menus[window.location.href]:ObjectModlue.menus.default
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

            menuItem.addEventListener('click', () => {
                onClickModuleFun(ObjectModlue.actionsKey[item])
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
        toggleButton.click()
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
        console.log('URL changed:', window.location.href);
        const bts = document.querySelector('#my-buttons')
        if (bts) {
            bts.remove();
        }
        initFixedButton ();
    });
// --------------------------------  不用改动 【end】  --------------------------------


// --------------------------------  需要调整 【start】  --------------------------------


    const defaultItems = ["close"]
    // 模型数据
    const ObjectModlue = {
        menus: {
            default: defaultItems,
            'https://seller.temu.com/price-health.html': [].concat(['核价']).concat(defaultItems),
            'https://seller.temu.com/products.html': [].concat(['流量']).concat(defaultItems),
        },

        monitorUrl: {
            'https://seller.temu.com/price-health.html': [
                "/mms/marigold/price/price_order_search"
            ],
            'https://seller.temu.com/products.html': [
                "/mms/marigold/goods/v2/search"
            ],
        },
        actionsKey: {
            "核价": "price",
            "流量": "abnormal",
            "close": "modal",
        },
        tables: {
            price: ["goods_id","SKUID","SPUID","MSKU","PRICE","REPRICE","mallid","STATE"],
            abnormal: ["goods_id"],
        }
    }

    // 数据结构格式处理
    async function dataFormat(key, tem) {
        let arr = []
        if (key == "price") {
            // const data = JSON.parse(localStorage.getItem('price_order_search'))||{result:{price_order_base_dtolist:[]}};
            const data = await db.get('data');
            data.result.price_order_base_dtolist.forEach(row => {
                row.price_order_sku_base_dtolist.forEach(column => {
                    arr.push({
                        goods_id: row.goods_id,
                        SKUID: column.sku_id,
                        MSKU: column.out_sku_sn,
                        PRICE: (row.target_supplier_price_original/100).toFixed(2),
                        REPRICE: (row.suggest_supplier_price_original/100).toFixed(2),
                    })
                })
            })
        } else if (key == "abnormal") {
           // const data = JSON.parse(localStorage.getItem('search'))||{result:{goods_list:[]}};
            const data = await db.get('data');
            data.result.goods_list.forEach(row => {
                if (row.hasOwnProperty('goods_to_be_upgrade_info')) {
                    arr.push({
                        goods_id: row.goods_id,
                    })
                }

            })

        }
        return arr.map(e => tem.map(kk =>e[kk]).join("\t")).join("\n")
    }

// --------------------------------  需要调整 【end】  --------------------------------

})();