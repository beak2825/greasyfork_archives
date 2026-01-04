// ==UserScript==
// @name         店小蜜黏贴按钮
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  数据黏贴
// @author       xx99czj
// @match        https://www.dianxiaomi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dianxiaomi.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513356/%E5%BA%97%E5%B0%8F%E8%9C%9C%E9%BB%8F%E8%B4%B4%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/513356/%E5%BA%97%E5%B0%8F%E8%9C%9C%E9%BB%8F%E8%B4%B4%E6%8C%89%E9%92%AE.meta.js
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

    // 取最后一个pathname
    function getLastPathname(txt) {
        // 定义URL
        const url = new URL(txt);
        // 获取URL的最后一个路径部分
        const lastPathSegment = url.pathname.split('/').pop();
        return lastPathSegment
    }


    // 模型数据
    const ObjectModlue = {
        menus: {
            'https://www.dianxiaomi.com/popTemuProduct/offline.htm?dxmState=offline&dxmOfflineState=publishFail&shopId=6072559': ["黏贴"],
            'https://www.dianxiaomi.com/crawl/index.htm?type=banjia': ["黏贴"],
            'https://www.dianxiaomi.com/popTemuProduct/draft.htm?dxmState=draft': ["黏贴","商品"],
            'https://www.dianxiaomi.com/popTemuProduct/index.htm?dxmState=online&productStatus=1': ["黏贴","建单"],
        },
        monitorUrl: {
            'https://www.dianxiaomi.com/crawl/index.htm?type=banjia': [
                "https://www.dianxiaomi.com/popTemuProduct/moveData/pageList.htm"
            ],
            'https://www.dianxiaomi.com/popTemuProduct/draft.htm?dxmState=draft': [
                "https://www.dianxiaomi.com/popTemuProduct/pageList.htm"
            ],
            'https://www.dianxiaomi.com/popTemuProduct/index.htm?dxmState=online&productStatus=1': [
                "https://www.dianxiaomi.com/popTemuProduct/pageList.htm"
            ],
            'https://www.dianxiaomi.com/popTemuProduct/index.htm?dxmState=online&productStatus=1': [
                "https://www.dianxiaomi.com/popTemuProduct/pageList.htm"
            ]
        },
        actionsKey: {
            "黏贴": "paste",
            "商品": "copy",
            "建单": "create",
        },
        tables: {
            copy: ["ID", "店铺", "站点", "SKU货号", "价格"],
            create: ["SKCID", "店铺", "站点", "SKU货号", "价格"],
        }
    }

    // 数据结构格式处理
    function dataFormat(key, tem) {
        let arr = []
        if (key == "copy") {

            // 使用DOMParser解析HTML字符串
            const parser = new DOMParser();
            const doc = parser.parseFromString(localStorage.getItem('pageList.htm'), 'text/html');
            const table = doc.querySelector('table');

            // 获取<thead>元素
            const thead = table.querySelector('thead');
            // 获取<tr>元素
            const trs = table.querySelectorAll('tr.content');

            // 提取<th>元素的文本内容
            const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());

            Array.from(trs).forEach(tr => {

                Array.from(tr.querySelectorAll('td.skuTdInfo')).forEach((td, index) => {
                        Array.from(td.querySelectorAll('tr')).forEach(column => {
                            arr.push({
                                ID: tr.getAttribute("data-id"),
                                "店铺": tr.querySelectorAll('td')[2].querySelector('.fColor2').textContent.trim(),
                                "站点": tr.querySelectorAll('td')[3].textContent.trim(),
                                "SKU货号": column.querySelectorAll('td')[0].textContent.trim(),
                                "价格": column.querySelectorAll('td')[1].textContent.trim(),
                            })
                        })
                })


            })
        } else if (key == "create") {

            // 使用DOMParser解析HTML字符串
            const parser = new DOMParser();
            const doc = parser.parseFromString(localStorage.getItem('pageList.htm'), 'text/html');
            const table = doc.querySelector('table');

            // 获取<thead>元素
            const thead = table.querySelector('thead');
            // 获取<tr>元素
            const trs = table.querySelectorAll('tr.content');

            // 提取<th>元素的文本内容
            const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());

            Array.from(trs).forEach(tr => {

                Array.from(tr.querySelectorAll('td.skuTdInfo')).forEach((td, index) => {
                        Array.from(td.querySelectorAll('tr')).forEach(column => {
                            arr.push({
                                SKCID: column.querySelectorAll('td')[0].textContent.trim(),
                                "店铺": tr.querySelectorAll('td')[2].querySelector('.fColor2').textContent.trim(),
                                "站点": tr.querySelectorAll('td')[3].textContent.trim(),
                                "SKU货号": column.querySelectorAll('td')[3].textContent.trim(),
                                "价格": column.querySelectorAll('td')[4].textContent.trim(),
                            })
                        })
                })

            })
        }
        return arr.map(e => tem.map(kk =>e[kk]).join("\t")).join("\n")
    }

    let cp = "";
    // 黏贴数据处理函数
    async function pasteText(input) {
        try {
            // 请求读取剪贴板内容的权限
            await navigator.clipboard.readText().then(
                clipText => {
                    cp = clipText;
                    input.value = clipText.replace(/\n/g, ',');;
                }
            );
        } catch (err) {
            console.error('无法读取剪贴板内容: ', err);
        }
    }

    // 黏贴按钮
    function clickPaste() {
        // 获取文本框
        let input = document.querySelector('#searchValue')
        pasteText(input)
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
                console.log('拦截到的fetch响应: ' + getLastPathname(url));
                // 如有需要, 可以将拦截到的数据存储在localStorage中
                localStorage.setItem(getLastPathname(url), response.replace(/\n|\t|USD/g, ''));

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
                        const data = response;
                        //console.log('拦截到的XMLHttpRequest响应:', data);
                        // 如有需要, 可以将拦截到的数据存储在localStorage中
                        localStorage.setItem(getLastPathname(this._url), data.replace(/\n|\t|USD/g, ''));
                    } catch (e) {
                        console.error('解析XMLHttpRequest响应失败:', e);
                    }
                }
            }
        });
        originalSend.apply(this, args);
    };

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

    // 模型函数
    function onClickModuleFun(key) {
        if (key == 'paste') {
            clickPaste()
            return 'menu'
        } else if (key == 'copy') {
            const data = dataFormat(key, ObjectModlue.tables[key])
            copyTextToClipboard(data)
            return 'dataFormat'
        } else if (key == 'create') {
            const data = dataFormat(key, ObjectModlue.tables[key])
            copyTextToClipboard(data)
            return 'dataFormat'
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

    // 等待页面完全加载
    window.addEventListener('load', () => {
        console.log('页面已完全加载');

        // function getMeathods
        initFixedButton()
    })

    window.addEventListener('popstate', (event) => {
        console.log('URL changed:', window.location.href);
        initFixedButton();
    });
})();