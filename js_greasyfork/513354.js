// ==UserScript==
// @name         TEMU Buttons
// @namespace    http://tampermonkey.net/
// @version      2024/10/21
// @description  Temu按钮
// @author       xx99czj
// @license      GPL-3.0
// @match        *://seller.kuajingmaihuo.com/*
// @match        *://agentseller.temu.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513354/TEMU%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/513354/TEMU%20Buttons.meta.js
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
            if (urls.includes(url)) {
                const clone = response.clone();
                clone.json().then(data => {
                    console.log('拦截到的fetch响应: ' + getLastPathname(url), data);
                    // 如有需要, 可以将拦截到的数据存储在localStorage中
                    localStorage.setItem( getLastPathname(url), JSON.stringify(data));
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
        this.addEventListener('load', function () {
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
                        localStorage.setItem(getLastPathname(this._url), JSON.stringify(data));
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

    // 全屏显示
    const hiddenCells = [3,4,6,7,8,9,10,12,13,14,15,16];
    function fullScreen() {
        const headers = document.querySelectorAll('table.TB_tableWrapper_5-113-0')
        const ths = headers[0].querySelectorAll('th')
        Array.from(ths).forEach((column, index) => {
            if (hiddenCells.includes(index)) {
                column.style.display = column.style.display == 'none'?'block':'none'
            }
        })
        const trs = headers[1].querySelectorAll('tr')
        Array.from(trs).forEach((row) => {
            Array.from(row.querySelectorAll('td')).forEach((column, index) => {
                if (hiddenCells.includes(index)) {
                    column.style.display = column.style.display == 'none'?'block':'none'
                }
            })
        })
    }

    // 菜单栏显隐
    function showOrHiddenBar() {
        // 菜单栏
        const bar = document.querySelector(`.index-module__sidebarContainer___2EGa_`)
        || document.querySelector(`.index-module__sidebarContainer___3AIp7`)
        || document.querySelector(`.index-module__sidebarContainer___1HGOI`);
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


    const defaultItems = ['弹窗','菜单']
    // 模型数据
    const ObjectModlue = {
        abb: {"美国站": "cs", "加拿大站": "加拿大文鼎仓库", "英国站": "Lifewit Limited"},
        menus: {
            default: defaultItems,
            'https://seller.kuajingmaihuo.com/goods/product/list': [].concat(['商品', '库存', '建单']).concat(defaultItems), // ,'全屏'
            'https://seller.kuajingmaihuo.com/main/product/seller-select': [].concat(['核价']).concat(defaultItems),
            'https://seller.kuajingmaihuo.com/main/product/material': [].concat(['图片']).concat(defaultItems)
        },
        // https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/xmen/select/searchForSemiSupplier
        monitorUrl: {
            'https://seller.kuajingmaihuo.com/goods/product/list': [
                "https://seller.kuajingmaihuo.com/bg-visage-mms/product/skc/pageQuery"
            ],
            'https://seller.kuajingmaihuo.com/main/product/seller-select': [
                "https://seller.kuajingmaihuo.com/marvel-mms/cn/api/kiana/magnus/price/bargain-no-bom/batch/info/query"
            ],
            'https://seller.kuajingmaihuo.com/main/product/material': [
                "https://seller.kuajingmaihuo.com/marvel-gmp/api/phoenix/picture/page-query-task-agg"
            ]
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
            "全屏": "full",
        },
        tables: {
            task: ["SPUID", "IMAGE", "TAGS", "STATUS"],
            stock: ["SKUID", "MSKU","SEND","STOCK"],
            goods: ["SKCID","SKUID","SPUID","MSKU","STATE","PRICE","CREATETIME","STATUS", "BRAND"], //,"SEND", "MAINIMAGE"
            price: ["SKCID","SKUID","SPUID","MSKU","PRICE","REPRICE"],
            createGood: ["LEAFCAT","MSKU"],
        }
    }

    // 数据结构格式处理
    function dataFormat(key, tem) {
        let arr = []
        if (key == "price") {
            const data = JSON.parse(localStorage.getItem('query'))||{result:{priceReviewItemList:[]}};
            data.result.priceReviewItemList.forEach(row => {
                row.skuInfoList.forEach(column => {
                    arr.push({
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
        } else if (key == "createGood") {
            const data = JSON.parse(localStorage.getItem('pageQuery'))||{result:{pageItems:[]}};
            const status = document.querySelector('.TAB_active_5-109-0')
            data.result.pageItems.forEach(row => {
                let cats = Object.keys(row.categories).map(e => row.categories[e].catName).filter(e => e).join("/")
                row.productSkuSummaries.forEach(column => {
                    arr.push({
                        MSKU: column.extCode,
                        LEAFCAT: cats,
                        STATE: row.productSemiManaged.bindSites[0].siteName,
                        PRICE: (column.supplierPrice/100).toFixed(2),
                        // STOCK: column.virtualStock,
                        // MAINIMAGE: row.mainImageUrl,
                    })
                })
            })
        } else if (key == "task") {
            const data = JSON.parse(localStorage.getItem('page-query-task-agg'))||{result:{detailList:[]}};
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
        } else if (key == "goods" || key == "stock") {

            const data = JSON.parse(localStorage.getItem('pageQuery'))||{result:{pageItems:[]}};
            const status = document.querySelector('.TAB_active_5-109-0') || document.querySelector('.TAB_active_5-113-0')
            data.result.pageItems.forEach(row => {
                row.productSkuSummaries.forEach(column => {
                    arr.push({
                        SKCID: row.productSkcId,
                        SKUID: column.productSkuId,
                        SPUID: row.productId,
                        MSKU: column.extCode,
                        SEND: ObjectModlue.abb[row.productSemiManaged.bindSites[0].siteName],
                        STATE: row.productSemiManaged.bindSites[0].siteName,
                        PRICE: (column.supplierPrice/100).toFixed(2),
                        STOCK: column.virtualStock,
                        CREATETIME: dateDateFormat(row.createdAt),
                        STATUS: status.innerText.split(' ')[0],
                        MAINIMAGE: row.mainImageUrl,
                        BRAND: row.productProperties.find(e => e.propName === "品牌名")?.propValue,
                    })
                })
            })
        }
        return arr.map(e => tem.map(kk =>e[kk]).join("\t")).join("\n")
    }

// --------------------------------  需要调整 【end】  --------------------------------

})();