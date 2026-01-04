// ==UserScript==
// @name         1688 搜索结果商品信息提取
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  根据 URL 匹配规则，分别提取不同页面的商品信息，去重并确保数据追加，新增删除/撤回按钮功能
// @author       Richard Ren
// @match        *://s.1688.com/selloffer/offer_search.htm*
// @match        *://*.1688.com/page/offerlist.htm*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520491/1688%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520491/1688%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================
    // 1. 注入渐变样式
    // =============================
    const styleContent = `
    /* 按钮容器 */
    #my-button-container {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      z-index: 10000;
    }

    /* 通用按钮 */
    #my-button-container button {
      color: #fff;
      padding: 10px;
      margin-bottom: 8px;
      border: none;
      cursor: pointer;
      width: 70px;
      text-align: center;
      border-radius: 20px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    /* 渐变背景 */
    #extract-btn {
      background: linear-gradient(45deg, #ff5959, #ffad86);
    }
    #extract-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255,89,89,0.4);
    }

    #next-btn {
      background: linear-gradient(45deg, #67e6dc, #63cdda);
    }
    #next-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(103,230,220,0.4);
    }

    #show-btn {
      background: linear-gradient(45deg, #2ecc71, #55efc4);
    }
    #show-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(46,204,113,0.4);
    }

    #clear-btn {
      background: linear-gradient(45deg, #fbc531, #f5cd79);
    }
    #clear-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(251,197,49,0.4);
    }

    /* 弹窗 */
    .my-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fffdfc;
      border: 1px solid #ccc;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      padding: 0; /* 去除原本 padding，转而在内部自行控制布局 */
      width: 80%;
      max-width: 800px;
      z-index: 10001;
      max-height: 80%;
      overflow: hidden; /* 隐藏外层滚动，改为内部滚动 */
      display: flex;
      flex-direction: column;
    }

    /* 弹窗顶部按钮容器（始终可见） */
    .my-popup-header {
      position: sticky;
      top: 0;
      background-color: #fffdfc;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      z-index: 10002;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 复制、关闭按钮 */
    .my-popup-header button {
      border: none;
      cursor: pointer;
      color: #fff;
      border-radius: 14px;
      transition: background-color 0.3s;
      padding: 6px 12px;
      margin-left: 8px;
    }
    /* 复制按钮 */
    .copy-button {
      background-color: #0097e6;
    }
    .copy-button:hover {
      background-color: #40739e;
    }
    /* 关闭按钮 */
    .close-button {
      background-color: #e55039;
    }
    .close-button:hover {
      background-color: #c23616;
    }

    /* 弹窗内容区：可滚动 */
    .my-popup-content {
      flex: 1;
      overflow: auto;
      padding: 20px;
    }

    /* 表格 */
    .my-popup-content table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 6px;
      overflow: hidden;
    }

    .my-popup-content th,
    .my-popup-content td {
      border: 1px solid #eee;
      padding: 8px;
    }

    .my-popup-content th {
      background-color: #fafafa;
      font-weight: bold;
    }

    /* 删除/撤回按钮 */
    .action-button {
      background-color: #ff4757;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .action-button.revert {
      background-color: #2ed573;
    }

    /* 被删除行的样式 */
    .marked-row {
        background-color: rgba(241, 242, 246, 0.8); /* 浅灰色背景，带透明度 */
        background-image: linear-gradient(
            45deg, /* 斜线角度 */
            rgba(153, 153, 153, 0.3) 25%, /* 浅灰色斜线，透明度 */
            transparent 25%, /* 透明间隔 */
            transparent 50%, /* 透明间隔 */
            rgba(153, 153, 153, 0.3) 50%, /* 浅灰色斜线，透明度 */
            rgba(153, 153, 153, 0.3) 75%, /* 浅灰色斜线，透明度 */
            transparent 75%, /* 透明间隔 */
            transparent /* 透明间隔 */
        );
        background-size: 12px 12px; /* 斜线图案的大小 */
        color: rgba(0, 0, 0, 0.6); /* 文字颜色变浅，带透明度 */
    }
    `;

    const style = document.createElement('style');
    style.textContent = styleContent;
    document.head.appendChild(style);

    // =============================
    // 2. 通用工具函数
    // =============================
    // 创建并返回一个按钮，可自定义 ID、文字、点击事件
    function createButton(id, text, onClick) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 使用 XPath 获取元素数组
    function getElementsByXPath(xpath) {
        const result = [];
        const nodesSnapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
            result.push(nodesSnapshot.snapshotItem(i));
        }
        return result;
    }

    // 按钮淡出动画
    function fadeOutButton(button, successText = '提取成功', originalText = '提取') {
        button.textContent = successText;
        button.style.transition = 'opacity 1s';
        button.style.opacity = '0';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.opacity = '1';
        }, 1000);
    }

    // 去重函数：根据 productLink 判定是否重复
    // 若有需要，可改用 title 或其他字段进行判定
    function deduplicateData(dataArray) {
        const seen = new Set();
        const result = [];
        for (const item of dataArray) {
            // 这里以 productLink 作为唯一判断标准
            const key = item.productLink || `${item.title}-${item.price}`;
            if (!seen.has(key)) {
                seen.add(key);
                result.push(item);
            }
        }
        return result;
    }

    // =============================
    // 3. 创建按钮容器并放置按钮
    // =============================
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'my-button-container';
    document.body.appendChild(buttonContainer);

    let extractedData = [];

    // 判断当前页面类型
    const isOfferListPage = window.location.href.includes('/page/offerlist.htm');
    const isSearchPage = window.location.href.includes('/selloffer/offer_search.htm');

    // =============================
    // 4. 定义不同页面的提取逻辑
    // =============================
    function handleOfferListExtraction() {
        // 缓存原始 window.open
        const originalWindowOpen = window.open;

        // 拦截 window.open
        function interceptWindowOpen() {
            window.open = function(url) {
                const currentProduct = extractedData.find(product => !product.productLink);
                if (currentProduct) {
                    currentProduct.productLink = url.split('?')[0];
                }
                return null;
            };
        }

        // 恢复 window.open
        function restoreWindowOpen() {
            window.open = originalWindowOpen;
        }

        // Xpath 定位商品元素
        const xpath = "//*[@id='bd_1_container_0']/div/div[2]/div[6]/div";
        const productElements = getElementsByXPath(xpath);

        productElements.forEach(product => {
            const title = product.querySelector('div:nth-child(2) > p')?.getAttribute('title') || '无标题';

            let priceText = product.querySelector('div:nth-child(3)');
            priceText = priceText.querySelector('div')?.textContent?.trim() || '无价格';
            const price = parseFloat(priceText.replace('¥', '')) || null;

            let salesText = product.querySelector('div:nth-child(3) > span')?.textContent?.trim() || '无销量';
            let sales = 0;
            if (salesText === '已售<10件') {
                sales = 0;
            } else if (salesText !== '无销量') {
                salesText = salesText.replace('已售', '');
                if (salesText.includes('万')) {
                    sales = parseFloat(salesText.replace('万', '')) * 10000;
                } else {
                    sales = parseFloat(salesText.replace(/\+|件/g, ''));
                }
            }

            const imageLink = product.querySelector('div:nth-child(1) > div > img')?.src || '无图片链接';

            extractedData.push({
                title,
                price,
                sales,
                productLink: null,
                imageLink,
                markedForDeletion: false // 新增标记字段
            });
        });

        interceptWindowOpen();
        productElements.forEach(el => el.click());
        restoreWindowOpen();

        // 提取完成后进行去重
        extractedData = deduplicateData(extractedData);
        console.log('已提取商品信息：', extractedData);
    }

    function handleSearchPageExtraction() {
        const xpath = "//*[@id='app']/div/div/div[2]/div[5]/div[1]/div/div/div/a";
        const productElements = getElementsByXPath(xpath);

        productElements.forEach(product => {
            const title = product.querySelector('.offer-title-row .title-text')?.textContent?.trim() || '无标题';

            let priceText = product.querySelector('.offer-price-row .col-desc .price-item')?.textContent?.trim() || '无价格';
            let price = null;
            if (priceText !== '无价格') {
                price = parseFloat(priceText.replace('¥', ''));
            }

            let salesText = product.querySelector('.offer-price-row .col-desc_after .desc-text')?.textContent?.trim() || '无销量';
            let sales = 0;
            if (salesText !== '无销量') {
                salesText = salesText.replace('全网', '').replace(/\+|件/g, '');
                if (salesText.includes('万')) {
                    sales = parseFloat(salesText.replace('万', '')) * 10000;
                } else {
                    sales = parseFloat(salesText);
                }
            }

            const productLink = product.href || '无商品链接';
            const imageLink = product.querySelector('.offer-img-inner .main-img')?.src || '无图片链接';

            extractedData.push({ title, price, sales, productLink, imageLink, markedForDeletion: false }); // 新增标记字段
        });

        // 提取完成后进行去重
        extractedData = deduplicateData(extractedData);
        console.log('已提取商品信息：', extractedData);
    }

    // =============================
    // 5. 创建并绑定所有按钮
    // =============================
    // 提取按钮
    const extractButton = createButton('extract-btn', '提取', () => {
        if (isOfferListPage) {
            handleOfferListExtraction();
        } else if (isSearchPage) {
            handleSearchPageExtraction();
        } else {
            console.log('当前页面不符合提取逻辑');
        }
        fadeOutButton(extractButton);
    });
    buttonContainer.appendChild(extractButton);

    // 下一页按钮
    const nextPageButton = createButton('next-btn', '下一页', () => {
        if (isOfferListPage) {
            const nextPageXPath = "//*[@id='bd_1_container_0']/div/div[2]/div[7]/div/button[2]";
            const nextPageElement = document.evaluate(
                nextPageXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            if (nextPageElement) {
                nextPageElement.click();
            } else {
                console.log('未找到下一页按钮');
            }
        } else if (isSearchPage) {
            const nextPageElement = document.querySelector('.fui-arrow.fui-next');
            if (nextPageElement) {
                nextPageElement.click();
            } else {
                console.log('未找到翻页元素');
            }
        }
    });
    buttonContainer.appendChild(nextPageButton);

    // 展示按钮
    const showButton = createButton('show-btn', '展示', () => {
        // 弹窗
        const popup = document.createElement('div');
        popup.classList.add('my-popup');

        // 弹窗顶部（包含统计信息及按钮）
        const header = document.createElement('div');
        header.classList.add('my-popup-header');

        // 左侧统计信息
        const totalCount = document.createElement('div');
        totalCount.textContent = `当前共提取了 ${extractedData.length} 个商品`;
        totalCount.style.fontWeight = 'bold';
        header.appendChild(totalCount);

        // 右侧按钮容器（复制、关闭）
        const headerButtons = document.createElement('div');

        // 复制按钮
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        copyButton.textContent = '复制';
        headerButtons.appendChild(copyButton);

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.textContent = '关闭';
        headerButtons.appendChild(closeButton);

        header.appendChild(headerButtons);
        popup.appendChild(header);

        // 弹窗内容（可滚动）
        const content = document.createElement('div');
        content.classList.add('my-popup-content');

        // 表格
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        // 添加新的列：操作
        ['序号', '图片', '标题', '价格', '销量', '操作'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        extractedData.forEach((data, index) => {
            const row = document.createElement('tr');
            if (data.markedForDeletion) {
                row.classList.add('marked-row');
            }

            // 序号
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            row.appendChild(indexCell);

            // 图片
            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = data.imageLink;
            image.style.width = '100px';
            image.style.height = '100px';
            image.style.borderRadius = '8px';
            image.style.cursor = 'pointer';
            image.addEventListener('click', () => {
                if (data.productLink) {
                    window.open(data.productLink, '_blank');
                }
            });
            imageCell.appendChild(image);
            row.appendChild(imageCell);

            // 标题
            const titleCell = document.createElement('td');
            const titleLink = document.createElement('a');
            titleLink.href = data.productLink;
            titleLink.textContent = data.title;
            titleLink.target = '_blank';
            titleLink.style.textDecoration = 'none';
            titleLink.style.color = 'blue';
            titleCell.appendChild(titleLink);
            row.appendChild(titleCell);

            // 价格
            const priceCell = document.createElement('td');
            priceCell.textContent = data.price ?? '无价格';
            row.appendChild(priceCell);

            // 销量
            const salesCell = document.createElement('td');
            salesCell.textContent = data.sales ?? 0;
            row.appendChild(salesCell);

            // 操作（删除/撤回按钮）
            const actionCell = document.createElement('td');
            const actionButton = document.createElement('button');
            actionButton.classList.add('action-button');
            actionButton.textContent = data.markedForDeletion ? '撤回' : '删除';
            if (data.markedForDeletion) {
                actionButton.classList.add('revert');
            }
            actionButton.addEventListener('click', () => {
                if (actionButton.textContent === '删除') {
                    // 标记该行
                    row.classList.add('marked-row');
                    actionButton.textContent = '撤回';
                    actionButton.classList.add('revert');
                    data.markedForDeletion = true;
                } else {
                    // 取消标记
                    row.classList.remove('marked-row');
                    actionButton.textContent = '删除';
                    actionButton.classList.remove('revert');
                    data.markedForDeletion = false;
                }
            });
            actionCell.appendChild(actionButton);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        content.appendChild(table);
        popup.appendChild(content);

        document.body.appendChild(popup);

        // 复制事件
        copyButton.addEventListener('click', () => {
            const dataToCopy = extractedData
                .filter(item => !item.markedForDeletion) // 过滤掉被标记的行
                .map((item, index) => {
                    return [
                        index + 1,
                        item.title,
                        item.price,
                        item.sales,
                        item.productLink,
                        item.imageLink
                    ].join('\t');
                }).join('\n');
            navigator.clipboard.writeText(dataToCopy).then(() => {
                // 改变按钮文字和样式
                copyButton.textContent = '已复制';
                copyButton.style.backgroundColor = '#2ecc71'; // 绿色背景
                copyButton.style.borderColor = '#27ae60'; // 绿色边框

                // 1秒后恢复原始状态
                setTimeout(() => {
                    copyButton.textContent = '复制';
                    copyButton.style.backgroundColor = '#0097e6'; // 原始背景色
                    copyButton.style.borderColor = '#0097e6'; // 原始边框色
                }, 1000);
            });
        });

        // 关闭事件
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    });
    buttonContainer.appendChild(showButton);

    // 清空按钮
    const clearButton = createButton('clear-btn', '清空', () => {
        extractedData = [];
        console.log('已清空数据');
    });
    buttonContainer.appendChild(clearButton);

})();
