// ==UserScript==
// @name         LDP Buttons
// @namespace    http://tampermonkey.net/
// @version      2025/2/6
// @description  Temu按钮
// @author       xx99czj
// @license      GPL-3.0
// @match        *://ldp.lifewit.cn/webroot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lifewit.cn
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523592/LDP%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/523592/LDP%20Buttons.meta.js
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
    const db = new IndexedDBWrapper('MyDatabase', 1, 'myStore');


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

    // 模型函数
    function onClickModuleFun(key) {
        if (key == 'copy') {
            const res = dataFormat(key, ObjectModlue.tables[key])
            res.then(data => {
                copyTextToClipboard(data)
            })
            return 'copy'
        } else if (key == 'goods') {
            const res = dataFormat(key, ObjectModlue.tables[key])
            res.then(data => {
                copyTextToClipboard(data)
            })
            return 'goods'
        } else {
            const res = dataFormat(key, ObjectModlue.tables[key])
            res.then(data => {
                copyTextToClipboard(data)
            })
            return 'all'
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

    // 排除特定URL
    const excludedUrlPrefix = 'https://lbp.lifewit.cn/sso/dashboard';
    if (window.location.href.startsWith(excludedUrlPrefix)) {
        console.log('当前URL被排除, 脚本终止执行');
        return;
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
    // 存储数据
    function saveLargeData(key, data, chunkSize = 1024 * 1024) { // 默认每块1MB
        const dataStr = JSON.stringify(data);
        const totalChunks = Math.ceil(dataStr.length / chunkSize);

        localStorage.setItem(`${key}_total`, totalChunks);
        for (let i = 0; i < totalChunks; i++) {
            const chunk = dataStr.substr(i * chunkSize, chunkSize);
            localStorage.setItem(`${key}_${i}`, chunk);
        }
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
        if (window.location.href.startsWith('https://ldp.lifewit.cn/')) {
            console.log('在指定页面, 1秒后添加按钮');
            setTimeout(initFixedButton, 1000);
        } 

    });
    // 定义点击事件的处理函数
    function copyTextToClipboard(text) {
        // 在这里编写复制文本到剪贴板的逻辑
        console.log('复制按钮被点击');
        // 示例：复制文本 "示例文本" 到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            showToast('文本已复制到剪贴板');
        }).catch(err => {
            showToast('复制失败:', err);
        });
    }
    //时间格式函数
    function dateDateFormat(timestamp) {
        const date = new Date(timestamp);

        // 获取年、月、日
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    // 获取https://ldp.lifewit.cn/webroot/decision 数据字符串
    function getBaseUrl(url) {
        // 找到 '#' 的位置
        const hashIndex = url.indexOf('#');

        // 如果 '#' 存在，返回 '#' 之前的部分；否则返回完整 URL
        return hashIndex !== -1 ? url.substring(0, hashIndex) : url;
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
        const items = ObjectModlue.menus.hasOwnProperty(getBaseUrl(window.location.href))?ObjectModlue.menus[getBaseUrl(window.location.href)]:ObjectModlue.menus.default
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
        console.log('URL changed:', window.location.href);
        const bts = document.querySelector('#my-buttons')
        if (bts) {
            bts.remove();
        }
        initFixedButton ();
    });
// --------------------------------  不用改动 【end】  --------------------------------


// --------------------------------  需要调整 【start】  --------------------------------


    const defaultItems = []
    // 模型数据
    const ObjectModlue = {
        // https://ldp.lifewit.cn/webroot/decision/v5/design/widget/data
        menus: {
            default: defaultItems,
            'https://ldp.lifewit.cn/webroot/decision': [].concat(['出单', "商品"]).concat(defaultItems),
            'https://ldp.lifewit.cn/webroot/decision/v5/design/report/f734a76f2a6343409a0ec446ec00fb1c/view?form=true': [].concat(["映射"]).concat(defaultItems),


        },
        monitorUrl: {
            'https://ldp.lifewit.cn/webroot/decision': [
                "/webroot/decision/v5/design/widget/data"
            ],
            'https://ldp.lifewit.cn/webroot/decision/v5/design/report/f734a76f2a6343409a0ec446ec00fb1c/view?form=true': [
                "/webroot/decision/v5/design/widget/data"
            ],
        },
        actionsKey: {
            "出单": "copy",
            "商品": "goods",
            "映射": "reflact",
        },
        tables: {
            // 平均单价 销售额 平均零售价
            copy: ["SKU","销量"],
            goods: ["SKU", "一级品类", "二级品类", "三级品类", "SKU中文名称"],
            reflact: ['msku','店铺', '销售渠道编码', '', '账号', '','', '', '', '', '', '站点', '', '', '', '', '', 'status','', '', '', '', '', 'source_of_data'], // , '是否匹配', '销售渠道名称'
        }
    }

    // 数据结构格式处理
    async function dataFormat(key, tem) {
        try {
            let arr = []
            if (key == "copy") {
                //const res = JSON.parse(localStorage.getItem('data'))||{data:{}};
                const res = await db.get('data');
                let headers = {}
                res.data.header.forEach(e => {
                    Object.assign(headers, {[e.dId]: e.text})
                })
                let datas = res.data.items[0].children.map(e => ({
                    key: e.dId,
                    value: e.text,
                    "销量": e.values.filter(k => tem.includes(headers[k.dId])).map(r => r.formatText)
                    //e.values.filter(k => tem.includes(headers[k.dId])).map(r => r.formatText).join("\t")
                }))
                datas.forEach(e => {
                    arr.push({[headers[e.key]]:e.value, "销量": e["销量"]})
                })
                return arr.map(e => tem.map(kk =>e[kk]).join("\t")).join("\n")
            }
            else if (key == "goods") {
                const res = await db.get('data');
                let headers = {}
                res.data.header.forEach(e => {
                    Object.assign(headers, {[e.dId]: e.text})
                })

                let datas = res.data.items.map(e => e.map(o => ({
                    key: o.dId,
                    value: o.text,

                })))
                let sarr = []
                datas.forEach(e => {
                    const oo = e.map(g => ({[headers[g.key]]:g.value}))
                    sarr.push(oo)
                })

                // 提取逻辑
                arr = sarr.map(product => {
                    // 将产品数组转为对象 {字段名: 值}
                    const productObj = product.reduce((acc, item) => {
                        const key = Object.keys(item)[0];
                        acc[key] = item[key];
                        return acc;
                    }, {});

                    // 按 tem 顺序提取字段值（注意字段名需严格匹配）
                    return tem.map(field => {
                        return productObj[field] ?? null; // 未找到时返回 null
                    });
                });

                return arr.map(e => e.join("\t")).join("\n")
            }
             else if (key == "reflact") {
                const res = await db.get('data');
                let headers = {}
                res.data.header.forEach(e => {
                    Object.assign(headers, {[e.dId]: e.text})
                })

                 console.log('headers', Object.values(headers))

                let datas = res.data.items.map(e => e.map(o => ({
                    key: o.dId,
                    value: o.text,

                })))
                let sarr = []
                datas.forEach(e => {
                    const oo = e.map(g => ({[headers[g.key]]:g.value}))
                    sarr.push(oo)
                })

                // 提取逻辑
                arr = sarr.map(product => {
                    // 将产品数组转为对象 {字段名: 值}
                    const productObj = product.reduce((acc, item) => {
                        const key = Object.keys(item)[0];
                        acc[key] = item[key];
                        return acc;
                    }, {});

                    // 按 tem 顺序提取字段值（注意字段名需严格匹配）
                    return tem.map(field => {
                        return productObj[field] ?? null; // 未找到时返回 null
                    });
                });

                return arr.map(e => e.join("\t")).join("\n")

             }
        } catch(err) {
            console.err(err)
        } finally {
            db.close(); // 可选关闭
        }

    }

// --------------------------------  需要调整 【end】  --------------------------------

})();