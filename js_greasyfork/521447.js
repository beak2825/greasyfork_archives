// ==UserScript==
// @name         孔夫子旧书网无水印图片下载助手
// @description  一键批量下载孔夫子旧书网商品图片(无水印版本)
// @version      1.0.5
// @author       骄阳哥
// @namespace    jyg
// @match        *://search.kongfz.com/product_result/*
// @match        *://book.kongfz.com/*
// @match        *://item.kongfz.com/book/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      www0.kfzimg.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521447/%E5%AD%94%E5%A4%AB%E5%AD%90%E6%97%A7%E4%B9%A6%E7%BD%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521447/%E5%AD%94%E5%A4%AB%E5%AD%90%E6%97%A7%E4%B9%A6%E7%BD%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前页面URL
    const currentUrl = window.location.href;

    // 在顶部添加常量定义
    const STORAGE_KEY = 'kfz_crop_height';
    const DEFAULT_CROP_HEIGHT = 110;

    // 获取裁剪高度设置
    function getCropHeight() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved) : DEFAULT_CROP_HEIGHT;
    }

    // 移除图片水印
    function removeImageWatermark(imgUrl) {
        return imgUrl.replace(/(_water|_n|_p|_b|_s)/g, '');
    }

    // 创建商品详情页下载按钮
    function createDetailPageButton(images) {
        const container = document.createElement('div');
        container.id = 'kfz-download-container';

        // 创建设置区域
        const settingDiv = document.createElement('div');
        settingDiv.className = 'crop-setting';

        const label = document.createElement('label');
        label.innerText = '裁剪高度(px):';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = getCropHeight();
        input.className = 'crop-height-input';

        input.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if(value >= 0) {
                localStorage.setItem(STORAGE_KEY, value);
            }
        });

        settingDiv.appendChild(label);
        settingDiv.appendChild(input);

        // 创建下载按钮
        const btn = document.createElement('button');
        btn.innerText = `📥 下载全部图片(${images.length}张)`;
        btn.id = 'kfz-download-btn';
        btn.style.backgroundColor = '#1890ff';
        btn.style.color = 'white';

        container.appendChild(settingDiv);
        container.appendChild(btn);
        document.body.appendChild(container);
        return btn;
    }

    // 创建索页面下载按钮
    function createSearchPageButton(doc, item) {
        const btn = doc.createElement('button');
        btn.innerText = '📥 下载图片';
        btn.className = 'kfz-search-download-btn';
        btn.style.backgroundColor = '#1890ff';
        const cartBtn = item.querySelector('div.add-cart-btn');
        cartBtn.parentNode.insertBefore(btn, cartBtn);
        return btn;
    }

    // 创建书籍列表页下载按钮
    function createListPageButton(doc, item) {
        const btn = doc.createElement('button');
        btn.innerText = '📥 下载图片';
        btn.className = 'kfz-list-download-btn';
        btn.style.backgroundColor = '#1890ff';
        const cartBtn = item.querySelector('a.con-btn-cart');
        cartBtn.parentNode.insertBefore(btn, cartBtn.nextSibling);
        return btn;
    }

    // 获取商品图片列表
    function getBookImages(doc) {
        const imgItems = doc.querySelectorAll('ul#figure-info-box > li');
        return Array.from(imgItems, item => {
            const img = item.querySelector('img');
            const imgSrc = img ? img.getAttribute('_viewsrc') : null;
            return removeImageWatermark(imgSrc);
        });
    }

    // 修改本地图片裁剪函数
    function cropLocalImage(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // 允许跨域

            img.onload = () => {
                // 创建 canvas 进行裁剪
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 使用保存的裁剪高度
                const cropHeight = getCropHeight();
                canvas.width = img.width;
                canvas.height = img.height - cropHeight;

                // 绘制裁剪后的图片
                ctx.drawImage(img, 0, 0);

                // 转换为 blob
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/jpeg', 0.95);
            };

            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    // 添加延时函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 下载图片
    function downloadImages(doc, btn) {
        const images = getBookImages(doc);
        if(images.length === 0) {
            console.warn('未找到可下载的图片');
            btn.innerText = '😅 暂无可下载的图片';
            btn.style.backgroundColor = '#999';
            btn.disabled = true;
            return;
        }

        console.log(`找到${images.length}张图片待下载:`, images);
        btn.innerText = '下载中...';
        btn.disabled = true;
        btn.style.backgroundColor = '#1890ff';

        let successCount = 0;
        let failCount = 0;

        // 获取书名和ISBN
        const bookName = doc.querySelector('h1')?.innerText || '未知书名';
        const isbnInfo = doc.querySelector('meta[name="description"]').getAttribute('content').match(/ISBN：([0-9]*)/);
        const isbn = isbnInfo?.[1] || '';

        console.log('书籍信息:', {
            bookName,
            isbn
        });

        // 串行下载图片,添加重试和延迟
        async function downloadWithRetry(url, retryCount = 1, hasWatermark = false) {
            const ext = url.split('.').pop()?.toLowerCase() || 'jpg';
            const watermarkText = hasWatermark ? '-裁剪' : '';
            const fileName = `${bookName.trim()}-${isbn.trim()}-${successCount + 1}${watermarkText}.${ext}`;

            try {
                if(!hasWatermark) {
                    // 尝试下载无水印版本
                    await new Promise((resolve, reject) => {
                        GM_download({
                            url,
                            name: fileName,
                            onload: resolve,
                            onerror: reject
                        });
                    });
                    successCount++;
                    console.log(`无水印图片下载成功:`, {url, fileName});
                } else {
                    // 下载并裁剪带水印版本
                    const blob = await cropLocalImage(url);
                    const downloadUrl = URL.createObjectURL(blob);

                    await new Promise((resolve, reject) => {
                        GM_download({
                            url: downloadUrl,
                            name: fileName,
                            onload: () => {
                                URL.revokeObjectURL(downloadUrl);
                                resolve();
                            },
                            onerror: (err) => {
                                URL.revokeObjectURL(downloadUrl);
                                reject(err);
                            }
                        });
                    });

                    successCount++;
                    console.log(`裁剪图片下载成功:`, {url, fileName});
                }
            } catch(err) {
                console.warn(`图片下载失败 (${retryCount}次重试机会):`, {url, error: err});

                if(retryCount > 0) {
                    const delay = 1000 + Math.random() * 2000;
                    await sleep(delay);

                    if(!hasWatermark) {
                        const watermarkUrl = url.replace(/\.([^.]*)$/, '_b.$1');
                        return downloadWithRetry(watermarkUrl, retryCount - 1, true);
                    } else {
                        const otherWatermarkUrl = url.replace(/_b\./, '_p.');
                        return downloadWithRetry(otherWatermarkUrl, retryCount - 1, true);
                    }
                } else {
                    failCount++;
                    console.error('图片下载失败:', {url, error: err});
                }
            }

            // 更新按钮状态
            btn.innerText = `下载中...(${successCount}/${images.length})`;
            if(successCount + failCount === images.length) {
                if(failCount === 0) {
                    btn.innerText = `✅ ${successCount}张图片已下载`;
                    btn.style.backgroundColor = '#52c41a';
                } else {
                    btn.innerText = `⚠️ ${successCount}张成功, ${failCount}张失败`;
                    btn.style.backgroundColor = '#faad14';
                }
                btn.disabled = false;
            }
        }

        // 串行下载所有图片
        (async () => {
            for(const imgUrl of images) {
                if(!imgUrl) {
                    failCount++;
                    continue;
                }
                await downloadWithRetry(imgUrl);
                // 添加随机延迟
                await sleep(500 + Math.random() * 1000);
            }
        })();
    }

    // 从URL获取并下载图片
    function downloadFromUrl(url, btn) {
        btn.addEventListener('click', () => {
            console.log('开始获取页面:', url);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: response => {
                    console.log('页面获取成功:', {
                        url,
                        status: response.status
                    });

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    downloadImages(doc, btn);
                },
                onerror: err => {
                    console.error('页面获取失败:', {
                        url,
                        error: err
                    });
                    btn.innerText = '❌ 获取图片失败';
                }
            });
        });
    }

    // 处理搜索页面
    function handleSearchPage(item) {
        const link = item.querySelector('.item-info > .title > a');
        const btn = createSearchPageButton(document, item);
        downloadFromUrl(link.href, btn);
    }

    // 处理列表页面
    function handleListPage(item) {
        const link = item.querySelector('div.list-con-title > a');
        const btn = createListPageButton(document, item);
        downloadFromUrl(link.href, btn);
    }

    // 初始化页面
    let checkInterval;

    if(currentUrl.includes('book.kongfz.com')) {
        const btn = createDetailPageButton(getBookImages(document));
        btn.addEventListener('click', () => downloadImages(document, btn));
    }
    else if(currentUrl.includes('search.kongfz.com/product_result')) {
        checkInterval = setInterval(() => {
            const listBox = document.querySelector('#listBox');
            if(listBox) {
                clearInterval(checkInterval);
                document.querySelectorAll('#listBox .item')
                    .forEach(item => handleSearchPage(item));
            }
        }, 1000);
    }
    else if(currentUrl.includes('item.kongfz.com/book')) {
        checkInterval = setInterval(() => {
            const listBox = document.querySelector('ul.itemList');
            if(listBox) {
                clearInterval(checkInterval);
                document.querySelectorAll('ul.itemList > li')
                    .forEach(item => handleListPage(item));
            }
        }, 1000);
    }

    // 注入样式
    GM_addStyle(`
        #kfz-download-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s;
            width: 100%;
        }

        #kfz-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .kfz-search-download-btn,
        .kfz-list-download-btn {
            padding: 4px 12px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin: 0 8px;
            transition: all 0.3s;
        }

        .kfz-search-download-btn:hover,
        .kfz-list-download-btn:hover {
            opacity: 0.8;
        }

        button:disabled {
            background-color: #999 !important;
            cursor: not-allowed;
            opacity: 0.7;
        }

        #kfz-download-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            z-index: 9999;
            min-width: 200px;
        }

        .crop-setting {
            background: white;
            padding: 8px 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }

        .crop-height-input {
            width: 60px;
            padding: 4px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
        }

        .crop-height-input:focus {
            border-color: #1890ff;
            outline: none;
        }
    `);

})();
