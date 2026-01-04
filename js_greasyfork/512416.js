// ==UserScript==
// @name         TEMU Buttons
// @namespace    http://tampermonkey.net/
// @version      2025/6/9
// @description  Temu按钮
// @author       xx99czj
// @license      GPL-3.0
// @match        *://agentseller-us.temu.com/*
// @match        *://seller.kuajingmaihuo.com/*
// @match        *://agentseller.temu.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512416/TEMU%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/512416/TEMU%20Buttons.meta.js
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
    // 获取通用SKU
    function removeSuffix(arr, com) {
         let obj = {}
         arr.forEach(item => {
            const parts = item.split('\t'); // 分割键值对
             // 提取主键和值并去掉值中的后缀部分
             const key = parts[0];

             const value = parts[1].replace(/-.*$/, ''); // 使用正则移除 "-" 后的部分
             Object.assign(obj, {[key]: value});

            // return obj; // 如果格式不符合，直接返回原始值
        });
        return com.map(item => obj[item])
    }
//mallid
    // 模型函数
    function onClickModuleFun(key) {
        if (key == 'menu') {
            showOrHiddenBar()
            return 'menu'
        } else if (key == 'full') {
            fullScreen()
            return 'full'
        } else if (key == 'modal') {
            removeDivs()
            return 'modal'
        } else {
            const data = dataFormat(key, ObjectModlue.tables[key])
            if (key=='mapping') {
                let vals = document.querySelector("[data-testid=beast-core-input-htmlInput]")
                const s = data.split("\n")
                let g= vals.value.split(" ")
                let result = removeSuffix(s,g);
                copyTextToClipboard(result.join("\n"))
            } else {
                copyTextToClipboard(data)
            }
            return 'dataFormat'
        }
    }

    // 取最后一个pathname
    function getLastPathname(txt) {
        // 定义URL
       // const url = new URL(txt)|| new URL(location.origin +txt);
        // 获取URL的最后一个路径部分
       // const lastPathSegment = url.pathname.split('/').pop();
         const lastPathSegment = txt.split('/').pop();
        return lastPathSegment
    }

    // 跳转详情页
    function toDetailPage() {
        // 语言 i18nextLng: zh-Hans|en
        // 验证通过 login_verify_resul: 1
        // 国家切换 https://www.temu.com/api/bg/huygens/text/change/lang
        /**
        current_lang_code: "zh-Hans"
        system_lang: "zh"
        to_be_switched_region_id: 211 //211:美国 37:加拿大
        */
         // 查找所有的 div 元素
        const divs = document.querySelectorAll('div[data-testid="beast-core-box"]');

        // 遍历所有的 div 元素
        divs.forEach(div => {
            // 检查 div 是否包含 "在售" 文本
            if (div.textContent.includes('在售')) {
                // 创建一个新的按钮元素
                const button = document.createElement('span');
                button.style.cursor = "pointer";
                button.style.color = "var(--pc-tag-info-color,#f35e00)";
                button.style.backgroundColor= "var(--pc-tag-info-bg-color,#e6f6ff)";
                // 添加点击事件处理函数
                button.addEventListener('click', function() {
                    alert('按钮被点击了！');
                });
                button.textContent = '详情'; // 设置按钮的文本内容

                // 将按钮添加到 span 元素后面
                const span = div.querySelector('span');
                if (span) {
                    span.after(button);
                }
            }
        });
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

    // ================== 使用示例 ==================
    // 初始化数据库 (自动创建对象存储)
    const db = new IndexedDBWrapper('MyDatabase', 1, 'myStore');

    // 排除特定URL
    const excludedUrlPrefix = 'https://seller.kuajingmaihuo.com/login';
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
        if (ObjectModlue.monitorUrl.hasOwnProperty(window.location.href)) {
            const urls = ObjectModlue.monitorUrl[window.location.href]
            if (urls.includes(url.url)) {
               //  if(args[1].headers["mallid"]) {
               //     localStorage.setItem("mallid",args[1].headers["mallid"])
                   // await db.set("mallid",args[1].headers["mallid"]);
               // }
                const clone = response.clone();
                clone.json().then(async (data) => {
                    console.log('拦截到的fetch响应: ' + getLastPathname(url.url), data);
                    // 如有需要, 可以将拦截到的数据存储在localStorage中
                    //localStorage.setItem( getLastPathname(url), JSON.stringify(data));
                    await db.set(getLastPathname(url.url), data);
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
            if (ObjectModlue.monitorUrl.hasOwnProperty(window.location.href)) {
                const urls = ObjectModlue.monitorUrl[window.location.href]
                if (urls.includes(this._url)) {
                    console.log('XMLHttpRequest加载事件URL:', this._url);
                    const response = this.responseText;
                    try {
                        const data = JSON.parse(response);
                        console.log('拦截到的XMLHttpRequest响应:', data);
                        // 如有需要, 可以将拦截到的数据存储在localStorage中
                        //localStorage.setItem(getLastPathname(this._url), JSON.stringify(data));
                        await db.set(getLastPathname(this._url), data);
                    } catch (e) {
                        console.error('解析XMLHttpRequest响应失败:', e);
                    }
                }
            }
        });
        originalSend.apply(this, args);
    };

    // 删除特定div的函数
    function removeDivs() {
        const selectors = [
            'body > div[data-testid="beast-core-modal-mask"]',
            'body > div[data-testid="beast-core-modal"]',
            'div.sold-out-goods-list_container__1zO49',
            'div.MDL_mask_5-114-0',
            'div.MDL_modal_5-114-0',
            'div.MDL_outerWrapper_5-114-0'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

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

        // 检查页面URL并在特定页面添加按钮
        if (window.location.href.startsWith('https://seller.kuajingmaihuo.com/')) {
            console.log('在指定页面, 1秒后添加按钮');
            setTimeout(initFixedButton, 1000);
        } else if (window.location.href.startsWith('https://agentseller.temu.com/')) {
            setTimeout(initFixedButton, 1000);
        } else if (window.location.href.startsWith('https://agentseller-us.temu.com/')) {
            setTimeout(initFixedButton, 1000);
        }

    });

    // 定义点击事件的处理函数
    function copyTextToClipboard(text) {
        // 在这里编写复制文本到剪贴板的逻辑
        console.log('复制按钮被点击');
        // 示例：复制文本 "示例文本" 到剪贴板
        text.then((res) => {
            navigator.clipboard.writeText(res).then(() => {
                showToast('文本已复制到剪贴板');
            }).catch(err => {
                showToast('复制失败:', err);
            });
        })
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

    // 全屏显示
    const thCells = [0,1,2,6,9,16,17,18,19]
    const trCells = [0,1,2,6,9,17,18,19,20]
    const mergeCells = [0,3,11,12]
    function fullScreen() {
        const headers = document.querySelectorAll('table.TB_tableWrapper_5-113-0')
        const ths = headers[0].querySelectorAll('th')
        Array.from(ths).forEach((column, index) => {
            if (!thCells.includes(index)) {
                column.style.display = "none"
                    //column.style.display == 'table-cell'?'none':'table-cell'
            }
        })
        const trs = headers[1].querySelectorAll('tr')
        Array.from(trs).forEach((row) => {
            let cell = row.querySelectorAll('td')
            Array.from(cell).forEach((column, index) => {
                if (cell.length > 13){
                    if (!trCells.includes(index)) {
                        column.style.display = "none"
                    }
                } else {
                    if (!mergeCells.includes(index)) {
                        column.style.display = "none"
                    }
                }
            })
        })
    }

    // 菜单栏显隐
    function showOrHiddenBar() {
        // 菜单栏
        const bar = document.querySelector(`.index-module__sidebarContainer___2EGa_`)
        || document.querySelector(`.index-module__sidebarContainer___3AIp7`)
        || document.querySelector(`.index-module__sidebarContainer___1HGOI`)
        || document.querySelector(`.bg-shell-theme-sidebarContainer`);

        const soldOut = document.querySelector(`.sold-out-goods-list_container__1zO49`)
        if (soldOut) {
            soldOut.style.display = 'none';
        }
        if (bar.style.display == 'none') {
            bar.style.display = 'block';
        }else {
            bar.style.display = 'none';
        }
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


    const defaultItems = ['弹窗'] //,'菜单'
    // 模型数据
    const ObjectModlue = {
        abb: {"美国站": "cs", "加拿大站": "加拿大文鼎仓库", "英国站": "Lifewit Limited"},
        acc: {
            1: "报名成功待开始",
            2: "进行中",
            3: "活动已结束"
        },
        stores: {
            "635517727326234":"EastWest Home",
            "635517728495874":"Secofort",
            "634418216430624":"LEAGLOJOY",
            "634418216449412":"LE JOY Home",
            "634418216664164":"LE JOY Mic",
            "634418216725347":"LE JOY Storage",
            "634418217141933":"LE JOY Household",
            "634418218644342":"LE JOY Furniture",
            "670702092944161":"EastWest Direct",
            "670702092948032":"EastWest Direct Shop",
            "10000013797":"Lifewit Official Store",
            "USLCLUEL3R":"Lifewit Home",
            "USLCUGEHHH":"Lifewit US",
            "Lifewit":"GBLC4LWL27",
            "GBLCMLWL2R":"TONORMIC",
            "GBLCYLLLJK":"Sgile",
        },
        menus: {
            default: defaultItems,
            //, '简化'
            'https://seller.kuajingmaihuo.com/goods/product/list': [].concat(['库存', '建单','简化','映射']).concat(defaultItems), //,'图片' ,'异常','商品', '全屏'
            'https://seller.kuajingmaihuo.com/main/product/seller-select': [].concat(['核价']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/main/product/material': [].concat(['图片']).concat(defaultItems),
            'https://agentseller.temu.com/govern/upload-qualifications': [].concat(['资质']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity': [].concat(['活动']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=5': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=13&thematicId=2411195660775': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=27': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=1': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2409290708139&type=13&productType=0': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2410287408954&type=13&productType=0': [].concat(['报名']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2409290701626&type=13&productType=0': [].concat(['报名']).concat(defaultItems),
            'https://agentseller.temu.com/mmsos/return-refund-list.html': [].concat(['退货']).concat(defaultItems),
            'https://agentseller-us.temu.com/mmsos/return-refund-list.html': [].concat(['退货']).concat(defaultItems),
        },
        // https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/xmen/select/searchForSemiSupplier
        monitorUrl: {
            'https://agentseller.temu.com/mmsos/return-refund-list.html': [
                "/garen/mms/afterSales/queryReturnAndRefundPaList",
            ],
            'https://agentseller-us.temu.com/mmsos/return-refund-list.html': [
                "/garen/mms/afterSales/queryReturnAndRefundPaList",
            ],
            'https://seller.kuajingmaihuo.com/goods/product/list': [
                "https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery"
            ],

            'https://seller.kuajingmaihuo.com/main/product/seller-select': [
                "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/magnus/price/bargain-no-bom/batch/info/query"
            ],
            'https://seller.kuajingmaihuo.com/main/product/material': [
                "https://seller.kuajingmaihuo.com/marvel-gmp/api/phoenix/picture/page-query-task-agg"
            ],
            'https://agentseller.temu.com/govern/upload-qualifications': [
                "/mms/arbok/product_cert/query/list"
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/list',
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/activity/product/applied/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=5': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=13&thematicId=2411195660775': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=27': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/detail-new?type=1': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2409290708139&type=13&productType=0': [
                'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2410287408954&type=13&productType=0': [
                 'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
            'https://seller.kuajingmaihuo.com/activity/marketing-activity/semi-detail?id=2409290701626&type=13&productType=0': [
                 'https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/gambit/marketing/enroll/product/list'
            ],
        },
        actionsKey: {
            "弹窗": "modal",
            "菜单": "menu",
            "商品": "goods",
            "库存": "stock",
            "核价": "price",
            "建单": "createGood",
            "图片": "image",
            "品牌": "brand",
            "简化": "full",
            "资质":"cert",
            "报名": "sign",
            "活动":"actions",
            "异常":"abnormal",
            "映射":"mapping",
            "退货":"backGoods",
        },
        tables: {
            abnormal: ["title","SKCID"],
            task: ["SPUID", "IMAGE", "TAGS", "STATUS"],
            stock: ["SKUID", "MSKU","SEND","STOCK"],
            goods: ["SKCID","SKUID","SPUID","MSKU","STATE","PRICE","CREATETIME","STATUS", "BRAND","mallid"], //,"SEND", "MAINIMAGE"
            image: ["productName","MSKU" ],
            price: ["activityTypeName","SKCID","SKUID","SPUID","MSKU","PRICE","REPRICE","mallid","STATE"],
            createGood: ["LEAFCAT","MSKU","SKCID", "SPUID", "PRICE","mallid","STATE","STATUS", "BRAND","STOCK"],
            cert: ["SPUID","CERTNAME", "STATE"],//,"CATEGORY",,"SHOWNAME"
            actions: ["activityName","mallid","SPUID", "MSKU","DAILYPRICE","ACTIVITYPRICE", "sessionStatus"],
            sign: ["title","mallid","STATE","SPUID", "MSKU","DAILYPRICE","ACTIVITYPRICE"],
            mapping: ["GoodsID","MSKU"],
            backGoods: [ "afterSalesTypeDesc", "afterSalesReasonListDesc", "parentOrderShippingStatusDesc", "parentAfterSalesStatusDesc","请求时间","退款完成时间"],//"parentOrderSn",
        }
    }

    // 数据结构格式处理
    async function dataFormat(key, tem) {
        let arr = []
        try {
            if (key == "price") {
                const data = await db.get('query')||{result:{priceReviewItemList:[]}};
                data.result.priceReviewItemList.forEach(row => {
                    row.skuInfoList.forEach(column => {
                        arr.push({
                            activityTypeName: row.activityTypeName,
                            mallid: ObjectModlue.stores[localStorage.getItem("mallid")],
                            SKCID: row.skcId,
                            SKUID: column.productSkuId,
                            SPUID: row.productId,
                            MSKU: column.productSkuExtCode,
                            SEND: ObjectModlue.abb[row.semiHostedBindSiteNameList[0]],
                            STATE: row.semiHostedBindSiteNameList[0],
                            PRICE: (row.priceBeforeExchange/100).toFixed(2),
                            REPRICE: (row.suggestSupplyPrice/100).toFixed(2),
                            MAINIMAGE: row.image,
                        })
                    })
                })
            } else if (key == "createGood"|| key == "image"|| key=="mapping") {
                const data = await db.get('pageQuery')||{result:{pageItems:[]}};

                // 定义一个正则表达式来匹配类名
                const regex = /TAB_active_\d+-\d+-\d+/;

                // 使用 querySelectorAll 获取所有可能的元素
                const elements = document.querySelectorAll('*');

                // 遍历所有元素，找到第一个匹配的元素
                let activeTab = null;
                for (const element of elements) {
                    if (element.classList && Array.from(element.classList).some(className => regex.test(className))) {
                        activeTab = element;
                        break; // 找到后退出循环
                    }
                }

                const mallid = ObjectModlue.stores[localStorage.getItem("mallid")]
                data.result.pageItems.forEach(row => {
                    let cats = Object.keys(row.categories).map(e => row.categories[e].catName).filter(e => e).join("/")
                    row.productSkuSummaries.forEach(column => {
                        arr.push({
                            mallid: mallid,
                            MSKU: column.extCode,
                            LEAFCAT: cats,
                            STATE: row.productSemiManaged.bindSites[0].siteName,
                            PRICE: (column.siteSupplierPrices[0].supplierPrice/100).toFixed(2),
                            SKCID: row.productSkcId,
                            GoodsID: column.productSkuId,
                            SPUID: row.productId,
                            productName: row.productName,
                            STATUS: activeTab.innerText.split(' ')[0],
                            BRAND: row.productProperties.find(e => e.propName === "品牌名")?.propValue,
                            STOCK: column.productSkuSemiManagedStock.skuStockQuantity,
                            // MAINIMAGE: row.mainImageUrl,
                        })
                    })
                })
            } else if (key == "task") {
                const data = await db.get('page-query-task-agg')||{result:{detailList:[]}};
                const status = document.querySelector('.TAB_active_5-111-0')
                data.result.detailList.forEach(row => {
                    row.taskList.forEach(column => {
                        arr.push({
                            SPUID: row.productId,
                            IMAGE: row.mainUrl,
                            TAGS: column.tagList.map(e => e.desc).join(' '),
                            STATUS: status.innerText.split(' ')[0],
                        })
                    })
                })
            } else if (key == "goods" || key == "stock"||key == "abnormal") {

                const data = await db.get('pageQuery')||{result:{pageItems:[]}};
                const status = document.querySelector('.TAB_active_5-109-0') || document.querySelector('.TAB_active_5-113-0')
                data.result.pageItems.forEach(row => {
                    row.productSkuSummaries.forEach(column => {
                        arr.push({
                            mallid: ObjectModlue.stores[localStorage.getItem("mallid")],
                            goodsId: row.goodsId,
                            title: row.productName,
                            SKCID: row.productSkcId,
                            SKUID: column.productSkuId,
                            SPUID: row.productId,
                            MSKU: column.extCode,
                            SEND: ObjectModlue.abb[row.productSemiManaged.bindSites[0].siteName],
                            STATE: row.productSemiManaged.bindSites[0].siteName,
                            PRICE: (column.siteSupplierPrices[0].supplierPrice/100).toFixed(2),
                            STOCK: column.virtualStock,
                            CREATETIME: dateDateFormat(row.createdAt),
                            STATUS: status.innerText.split(' ')[0],
                            MAINIMAGE: row.mainImageUrl,
                            BRAND: row.productProperties.find(e => e.propName === "品牌名")?.propValue,
                        })
                    })
                })
            } else if (key == "cert") {
                let oob = {1:"待上传",3:"失败", 4:"成功"}
                const data = await db.get('list')||{result:{product_with_cert_list:[]}};
                data.result.product_with_cert_list.forEach(row => {
                    row.product_cert_info_list.forEach(column => {
                        arr.push({
                            SPUID: row.product_base_info.product_id,
                            CATEGORY:row.product_base_info.leaf_category_name,
                            STATE: oob[column.audit_status],
                            CERTNAME: column.cert_name,
                            SHOWNAME: column.show_name,
                        })
                    })
                })
            } else if (key == "actions") {
                const data = await db.get('list')||{result:{list:[]}};
                data.result.list.forEach(row => {
                    row.skcList.map(e=> e.skuList).forEach(e => e.forEach(column => {
                        arr.push({
                            activityName: row.activityTypeName,
                            mallid: ObjectModlue.stores[localStorage.getItem("mallid")],
                            STATE: row.sites[0].siteName,
                            SPUID: row.productId,
                            MSKU: column.extCode,
                            DAILYPRICE: (column.sitePriceList[0].dailyPrice/100).toFixed(2),
                            ACTIVITYPRICE: (column.sitePriceList[0].activityPrice/100).toFixed(2),
                            sessionStatus: ObjectModlue.acc[row.sessionStatus],
                        })
                    }))

                })
            }else if (key == "sign") {
                const data = await db.get('list')||{result:{list:[]}};
                data.result.list.forEach(row => {
                    row.skcList.forEach(e=> {
                        e.skuList.forEach(column => {
                            arr.push({
                                title: document.querySelector(".block-title-module__title___3zgCB").textContent,
                                mallid: ObjectModlue.stores[localStorage.getItem("mallid")],
                                STATE: row.sites[0].siteName,
                                SPUID: row.productId,
                                MSKU: column.extCode,
                                DAILYPRICE: (column.sitePriceList[0].dailyPrice/100).toFixed(2),
                                ACTIVITYPRICE: (column.sitePriceList[0].suggestActivityPrice/100).toFixed(2),
                            })
                        })
                    })

                })
            } else if (key == "backGoods") {
                const data = await db.get('queryReturnAndRefundPaList')||{result:{mmsPageVO:{}}};
                data.result.mmsPageVO.data.forEach(row => {

                    arr.push({
                        parentOrderSn: row.parentOrderSn,
                        afterSalesTypeDesc: row.afterSalesTypeDesc,
                        afterSalesReasonListDesc: row.afterSalesReasonListDesc,
                        parentOrderShippingStatusDesc: row.parentOrderShippingStatusDesc,
                        parentAfterSalesStatusDesc: row.parentAfterSalesStatusDesc,
                        "退款完成时间":row.operateNodeVOList[1].operateTimeStr,
                        "请求时间":row.operateNodeVOList[0].operateTimeStr,
                    })
                })
            }
        } catch(err) {console.error(err)} finally {
            db.close(); // 可选关闭
        }
        return arr.map(e => tem.map(kk =>e[kk]).join("\t")).join("\n")
    }

// --------------------------------  需要调整 【end】  --------------------------------

})();