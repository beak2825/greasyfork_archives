// ==UserScript==
// @name         查找账号下店铺名称
// @namespace    http://your-namespace.com/
// @version      1.8
// @description  更新app_id大小写匹配规则
// @author       Barrylou
// @match        *://admin.xiaoe-tech.com/t/account/muti_index*
// @match        *://admin.xiaoe-tech.com/login*
// @match        *://admin.xiaoe-tech.com/t/login*
// @match        *://admin.xiaoe-tech.com/muti_index*
// @match        *://admin.xiaoe-tech.com/*/*?app_id=*
// @match        *://admin.elink.ai/t/account/muti_index*
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530352/%E6%9F%A5%E6%89%BE%E8%B4%A6%E5%8F%B7%E4%B8%8B%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/530352/%E6%9F%A5%E6%89%BE%E8%B4%A6%E5%8F%B7%E4%B8%8B%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function () {
    // 自动勾选阅读协议
    autoCheckAgreement();
    // 移除绑定微信弹窗
    removeWxTips();
    // 重定向到列表页
    directionToListPage();

    // 添加搜索框样式
    GM_addStyle(`
        #custom-search-container {
            position: fixed;
            top: 60px;
            right: 5px;
            z-index: 99999 !important; /* 提高层级 */
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        #custom-search-input {
            width: 160px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #custom-search-button {
            margin-left: 10px;
            padding: 5px 10px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #custom-search-button:hover {
            background: #1976D2;
        }
        .custom-highlight {
            background: yellow !important;
            border: 2px solid red !important;
        }
    `);



function autoCheckAgreement() {
    const checkbox = document.querySelector('input[type="checkbox"][id="agree"]');
    if (checkbox) {
        checkbox.checked = true; // 勾选
        console.log('已自动勾选同意框');
        // 如果需要触发相关事件（如 change 事件）
        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
    } else {
        console.warn('未找到同意复选框，请检查页面元素');
    }
}


function genStyle(bgc, color) {
    return `
    min-width:120px;
    height:35px;
    line-height:50px;
    text-align:center;
    cursor: pointer;
    font-size: 16px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0px 10px;
    margin-bottom:10px;
    border-radius:5px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;background:` + bgc + `;color:` + color + ";";
}

function directionToListPage() {
    if (window.location.href.indexOf("/xe.merchant-serve.shop_list.shop.choose/1.0.0?app_id=") !== -1) {
        let url = window.location.origin;
        url = url + "/live#/list?resource_type=4"
        window.location.href = url;
    }
}

function removeWxTips() {
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = "bind_wx_tips=1; expires=" + expirationDate.toUTCString() + "; path=/";
}

    // 创建搜索框
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.id = 'custom-search-container';

        const searchInput = document.createElement('input');
        searchInput.id = 'custom-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = '输入搜索条件';

        const searchButton = document.createElement('button');
        searchButton.id = 'custom-search-button';
        searchButton.textContent = '搜索';

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        document.body.appendChild(searchContainer);

        // 搜索功能
        searchButton.addEventListener('click', () => {
        const searchText = searchInput.value.trim();
        if (!searchText) {
            alert('请输入搜索条件');
        return;
    }

    // 清除之前的高亮
    const previousHighlights = document.querySelectorAll('.shop-item-content.custom-highlight');
    previousHighlights.forEach(element => {
        element.classList.remove('custom-highlight');
    });

    // 创建不区分大小写的正则表达式
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // 遍历页面元素
    const elements = document.querySelectorAll('.shop-item-content');
    let found = false;

    elements.forEach(element => {
        if (regex.test(element.textContent)) {
            // 高亮匹配元素
            element.classList.add('custom-highlight');

            // 滚动到元素位置
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            found = true;
        }
    });

    if (!found) {
        alert('未找到匹配的元素');
    }
        });
    }

    // 监听页面变化
    function waitForPageLoad() {
        const observer = new MutationObserver((mutations, obs) => {
            const searchContainer = document.getElementById('custom-search-container');
            if (document.body && !searchContainer) {
                // 页面加载完成，插入搜索框
                createSearchBox();
                obs.disconnect(); // 停止监听
            }
        });

        // 监听整个文档的变化
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }

    // 启动监听
    waitForPageLoad();
})();