// ==UserScript==
// @name           豆瓣图书多平台资源搜索
// @description    豆瓣图书页显示多平台搜索按钮 + 微信读书推荐值 + Goodreads评分
// @author         bai
// @version        1.9
// @icon           https://book.douban.com/favicon.ico
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://book.douban.com/subject/*
// @run-at         document-end
// @license        Apache-2.0
// @namespace      douban_book_multi_search
// @downloadURL https://update.greasyfork.org/scripts/546348/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E5%A4%9A%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/546348/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E5%A4%9A%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

$(document).ready(function () {
    // 注入样式，新增 Goodreads 评分相关样式
    GM_addStyle(`
        #multi_book_search { margin: 10px 0; padding: 12px; background: #f0f7f7; border-radius: 6px; }
        .search_platforms { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .search_platform { padding: 8px; border-radius: 4px; background: white; display: flex; align-items: center; gap: 8px; }
        .platform_header { font-weight: bold; min-width: 80px; }
        .search_btn { padding: 3px 8px; border: 1px solid #ccc; background: #f0f7f7; color: #333; border-radius: 3px; text-decoration: none; font-size: 12px; }
        .search_btn:hover { background: #f2f2f2; color: #000; }
        .weread_rating, .goodreads_rating { font-size: 12px; color: #333; background: #f8f8f8; padding: 2px 6px; border-radius: 4px; }
        .weread_loading, .goodreads_loading { color: #666; font-size: 12px; }
        .weread_error, .goodreads_error { color: #e53935; font-size: 12px; }
        .debug_hint { font-size: 11px; color: #999; margin-top: 5px; }
    `);

    // 提取豆瓣图书信息
    function getDoubanBookInfo() {
        const title = $('#wrapper > h1 > span').first().text().replace(/[:\(].*$/, '').trim();
        const author = $('#info span.pl:contains("作者")').next().text().replace(/\s+/g, ' ').trim() || '';
        console.log("[多平台搜索] 提取到图书信息：", { title, author }); // 调试日志
        return { title, author };
    }

    const bookInfo = getDoubanBookInfo();
    if (!bookInfo.title) {
        console.log("[多平台搜索] 未提取到图书标题，终止执行");
        return;
    }

    // 获取微信读书推荐值（增强版，带详细日志）
    function getWeReadRating(title, author) {
        const encodedTitle = encodeURIComponent(title);
        const url = `https://weread.qq.com/web/search/books?keyword=${encodedTitle}`;
        console.log("[微信读书] 开始请求推荐值，URL：", url);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    console.log("[微信读书] 请求成功，状态码：", response.status);

                    // 状态码不是200，直接失败
                    if (response.status!== 200) {
                        reject(new Error(`请求失败，状态码：${response.status}`));
                        return;
                    }

                    try {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = response.responseText;

                        // 方案1：按类名查找（微信读书可能用的类名）
                        let rating = null;
                        const possibleSelectors = [
                            // 常见的推荐值元素选择器（多写几个备用）
                            '.wr_bookList_item_reading_percent',
                            '.rating-percent',
                            '.book-rating .percent',
                            '.reading-percent'
                        ];

                        // 逐个尝试选择器
                        for (const selector of possibleSelectors) {
                            const elem = tempDiv.querySelector(selector);
                            if (elem) {
                                rating = elem.textContent.trim();
                                console.log(`[微信读书] 用选择器 ${selector} 找到推荐值：`, rating);
                                break;
                            }
                        }

                        // 方案2：按文本内容查找（如果类名变了，但文本包含“推荐值”）
                        if (!rating) {
                            const allTextNodes = tempDiv.querySelectorAll('*');
                            for (const node of allTextNodes) {
                                const text = node.textContent || '';
                                if (text.includes('推荐值') && text.includes('%')) {
                                    // 提取类似“推荐值 93.1%”中的百分比
                                    const match = text.match(/推荐值\s*([\d.]+%)/);
                                    if (match && match[1]) {
                                        rating = match[1];
                                        console.log("[微信读书] 按文本匹配找到推荐值：", rating);
                                        break;
                                    }
                                }
                            }
                        }

                        // 方案3：如果有作者信息，尝试匹配更精准的结果
                        if (!rating && author) {
                            console.log("[微信读书] 尝试结合作者信息匹配...");
                            const bookItems = tempDiv.querySelectorAll('.wr_bookList_item, .book-item');
                            for (const item of bookItems) {
                                const authorText = item.textContent || '';
                                if (authorText.includes(author.replace(/\s+/g, ''))) {
                                    // 找到包含作者名的条目，再从中找推荐值
                                    const percentElem = item.querySelector(possibleSelectors.join(', '));
                                    if (percentElem) {
                                        rating = percentElem.textContent.trim();
                                        console.log("[微信读书] 结合作者匹配找到推荐值：", rating);
                                        break;
                                    }
                                }
                            }
                        }

                        if (rating) {
                            resolve(rating);
                        } else {
                            console.log("[微信读书] 所有方案都未找到推荐值，HTML片段：", response.responseText.substring(0, 500)); // 打印前500字符方便调试
                            resolve(null);
                        }
                    } catch (e) {
                        console.error("[微信读书] 解析HTML出错：", e);
                        reject(e);
                    }
                },
                onerror: function (error) {
                    console.error("[微信读书] 请求出错：", error);
                    reject(error);
                },
                onabort: function () {
                    reject(new Error("请求被中止"));
                },
                timeout: 15000 // 延长超时时间到15秒
            });
        });
    }

    // 获取 Goodreads 评分
    function getGoodreadsRating(title, author) {
        const encodedTitle = encodeURIComponent(title);
        const url = `https://www.goodreads.com/search?q=${encodedTitle}&search_type=books`;
        console.log("[Goodreads] 开始请求评分，URL：", url);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    console.log("[Goodreads] 请求成功，状态码：", response.status);

                    if (response.status!== 200) {
                        reject(new Error(`请求失败，状态码：${response.status}`));
                        return;
                    }

                    try {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = response.responseText;

                        // 定位第一本图书的评分元素，根据页面结构调整选择器
                        const firstBookRatingElem = tempDiv.querySelector('tr[itemtype="http://schema.org/Book"] .minirating');
                        if (firstBookRatingElem) {
                            const ratingText = firstBookRatingElem.textContent.trim();
                            // 提取评分数值，如从 "4.08 avg rating — 466,511 ratings" 中提取 4.08
                            const ratingMatch = ratingText.match(/(\d+\.\d+)\s+avg rating/);
                            if (ratingMatch && ratingMatch[1]) {
                                const rating = ratingMatch[1];
                                console.log("[Goodreads] 找到评分：", rating);
                                resolve(rating);
                            } else {
                                console.log("[Goodreads] 未匹配到有效评分格式，原始文本：", ratingText);
                                resolve(null);
                            }
                        } else {
                            console.log("[Goodreads] 未找到第一本图书的评分元素");
                            resolve(null);
                        }
                    } catch (e) {
                        console.error("[Goodreads] 解析HTML出错：", e);
                        reject(e);
                    }
                },
                onerror: function (error) {
                    console.error("[Goodreads] 请求出错：", error);
                    reject(error);
                },
                onabort: function () {
                    reject(new Error("请求被中止"));
                },
                timeout: 15000
            });
        });
    }

    // 配置多平台搜索
    const searchPlatforms = [
        {
            name: "微信读书",
            icon: "📖",
            searchUrl: `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(bookInfo.title)}`,
            hasRating: true
        },
        {
            name: "Goodreads",
            icon: "🔖",
            searchUrl: `https://www.goodreads.com/search?q=${encodeURIComponent(bookInfo.title)}&search_type=books`,
            hasRating: true
        },
        // 其他平台...
        { name: "Z站", icon: "📚", searchUrl: `https://z-library.ec/s/${encodeURIComponent(bookInfo.title)}?` },
        { name: "安娜读书", icon: "📚︎", searchUrl: `https://annas-archive.org/search?q=${encodeURIComponent(bookInfo.title)}` },
        { name: "SaltyLeo书架", icon: "🎒", searchUrl: `https://tstrs.me/search?search_type=default&q=${encodeURIComponent(bookInfo.title)}` },
        { name: "喜马拉雅", icon: "🎧", searchUrl: `https://www.ximalaya.com/so/${encodeURIComponent([bookInfo.title, bookInfo.author].filter(Boolean).join('+'))}` },
    ];

    // 生成搜索模块，区分不同平台的加载占位
    function createSearchModule() {
        let moduleHtml = `
            <div id="multi_book_search">
                <h3>多平台资源搜索</h3>
                <div class="search_platforms">
        `;

        searchPlatforms.forEach((platform, index) => {
            let ratingPlaceholder = '';
            if (platform.name === "微信读书") {
                ratingPlaceholder = '<span class="weread_loading">获取推荐值中...</span>';
            } else if (platform.name === "Goodreads") {
                ratingPlaceholder = '<span class="goodreads_loading">获取评分中...</span>';
            }

            moduleHtml += `
                <div class="search_platform" id="platform_${index}">
                    <div class="platform_header">${platform.icon} ${platform.name}</div>
                    <a href="${platform.searchUrl}" target="_blank" class="search_btn">直达搜索</a>
                    ${ratingPlaceholder}
                </div>
            `;
        });

        moduleHtml += `
                </div>
            </div>
        `;
        return moduleHtml;
    }

    // 插入到页面
    $("#content div.aside").prepend(createSearchModule());

    // 获取并显示微信读书推荐值
    const weReadIndex = searchPlatforms.findIndex(p => p.name === "微信读书");
    if (weReadIndex!== -1) {
        getWeReadRating(bookInfo.title, bookInfo.author)
           .then(rating => {
                const $platform = $(`#platform_${weReadIndex}`);
                if (rating) {
                    $platform.find('.weread_loading').replaceWith(`
                        <span class="weread_rating">推荐值 ${rating}</span>
                    `);
                } else {
                    $platform.find('.weread_loading').replaceWith(`
                        <span class="weread_error">未找到推荐值</span>
                    `);
                }
            })
           .catch(err => {
                console.error("[微信读书] 推荐值获取失败：", err);
                $(`#platform_${weReadIndex} .weread_loading`).replaceWith(`
                    <span class="weread_error">获取失败（${err.message}）</span>
                `);
            });
    }

    // 获取并显示 Goodreads 评分
    const goodreadsIndex = searchPlatforms.findIndex(p => p.name === "Goodreads");
    if (goodreadsIndex!== -1) {
        getGoodreadsRating(bookInfo.title, bookInfo.author)
           .then(rating => {
                const $platform = $(`#platform_${goodreadsIndex}`);
                if (rating) {
                    $platform.find('.goodreads_loading').replaceWith(`
                        <span class="goodreads_rating">评分 ${rating}</span>
                    `);
                } else {
                    $platform.find('.goodreads_loading').replaceWith(`
                        <span class="goodreads_error">未找到评分</span>
                    `);
                }
            })
           .catch(err => {
                console.error("[Goodreads] 评分获取失败：", err);
                $(`#platform_${goodreadsIndex} .goodreads_loading`).replaceWith(`
                    <span class="goodreads_error">获取失败（${err.message}）</span>
                `);
            });
    }
});