// ==UserScript==
// @name         Jav跳转到Emby播放（多服务器版），支持 JavBus/Javdb/Javlibrary/Javmunu/XXXClub/FreeJavBt
// @namespace    http://tampermonkey.net/
// @version      2025.11.9
// @description  高亮Emby存在的视频，并提供一键跳转功能（支持多服务器）
// @match        *://www.javbus.com/*
// @include      /^.*(jav|bus|dmm|see|cdn|fan){2}\..*$/
// @match        *://javdb.com/*
// @include      /^https:\/\/(\w*\.)?javdb(\d)*\.com.*$/
// @include      *://*.javlibrary.com/*
// @include      *://*.javlib.com/*
// @match        *://javmenu.com/*
// @match        *://freejavbt.com/*
// @include      *://*.javmenu.com/*
// @match        *://xxxclub.to/*
// @include      *://*/cn/*v=jav*
// @include      *://*/en/*v=jav*
// @include      *://*/tw/*v=jav*
// @include      *://*/ja/*v=jav*
// @include      /^.*(avmoo|avsox)\..*$/
// @include      *://avmoo.*/*/movie/*
// @include      *://avsox.*/*/movie/*
// @match        https://www.sehuatang.net/thread-*
// @match        https://www.sehuatang.net/forum.php?mod=viewthread&tid=*
// @match        https://.*/thread-*
// @match        https://.*/forum.php?mod=viewthread&tid=*
// @match        https://www.tanhuazu.com/threads/*
// @match       *://javbooks.com/content*censored/*.htm
// @match       *://jmvbt.com/content*censored/*.htm
// @match       *://*.com/content*censored/*.htm
// @include     *://*.cc/content_censored/*.htm
// @include     /^https:\/\/jbk008\.com\/serchinfo\_(censored|uncensored)\/topicsbt/
// @match       *://db.msin.jp/jp.page/movie?id=*
// @match       *://db.msin.jp/page/movie?id=*
// @include      *://*/works/detail/*
// @match        *://xslist.org/search?query=*
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525753/Jav%E8%B7%B3%E8%BD%AC%E5%88%B0Emby%E6%92%AD%E6%94%BE%EF%BC%88%E5%A4%9A%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%89%88%EF%BC%89%EF%BC%8C%E6%94%AF%E6%8C%81%20JavBusJavdbJavlibraryJavmunuXXXClubFreeJavBt.user.js
// @updateURL https://update.greasyfork.org/scripts/525753/Jav%E8%B7%B3%E8%BD%AC%E5%88%B0Emby%E6%92%AD%E6%94%BE%EF%BC%88%E5%A4%9A%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%89%88%EF%BC%89%EF%BC%8C%E6%94%AF%E6%8C%81%20JavBusJavdbJavlibraryJavmunuXXXClubFreeJavBt.meta.js
// ==/UserScript==

// ============ 多服务器配置 ============
const embyServers = [
    {
        name: "Emby-1",  // 服务器名称
        apiKey: "x",
        baseUrl: "http://192.168.x.x:x/",
        color: "#52b54b",  // 绿色
        enabled: true      // 是否启用
    },
    {
        name: "Emby-2",
        apiKey: "x",  // 如果API Key不同请修改
        baseUrl: "http://192.168.x.x:x/",
        color: "#ff6b6b",  // 红色
        enabled: true
    }
];

// 默认颜色（当资源在多个服务器都存在时使用）
const defaultColor = "#52b54b";

(function () {
    'use strict';

    // Cloudflare 检测函数
    function checkCloudflareChallenge() {
        const cloudflareSelectors = [
            '#challenge-form',
            '.cf-browser-verification',
            'div.ray-id',
            'div.cf-spinner-rotator',
            'trk-page[data-title^="Just a moment"]'
        ];
        return cloudflareSelectors.some(selector => document.querySelector(selector)) ||
            document.title.includes('Just a moment') ||
            document.body.textContent.includes('Cloudflare');
    }

    function waitForCloudflare(callback, maxAttempts = 30, interval = 1000) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            if (!checkCloudflareChallenge()) {
                clearInterval(checkInterval);
                callback();
            } else if (attempts++ >= maxAttempts) {
                clearInterval(checkInterval);
                console.log('Cloudflare验证等待超时');
                callback();
            }
        }, interval);
    }

    class Base {
        // ============ 核心修改：支持多服务器并行查询 ============
        fetchEmbyDataFromAllServers(code, callback) {
            if (!code) {
                console.warn("番号为空，跳过请求");
                return;
            }

            console.log('从多个服务器查询:', code);

            const searchLower = code.toLowerCase();

            const enabledServers = embyServers.filter(s => s.enabled);
            let completedRequests = 0;
            const results = [];

            enabledServers.forEach(server => {
                // const url = `${server.baseUrl}emby/Users/${server.apiKey}/Items?api_key=${server.apiKey}&Recursive=true&IncludeItemTypes=Movie&SearchTerm=${code}`;
                // const url = `${server.baseUrl}emby/Users/${server.apiKey}/Items?api_key=${server.apiKey}&Recursive=true&IncludeItemTypes=Movie&SearchTerm=${encodeURIComponent(code)}`;
                const url = `${server.baseUrl}emby/Users/${server.apiKey}/Items?api_key=${server.apiKey}&Recursive=true&IncludeItemTypes=Movie&NameStartsWith=${encodeURIComponent(code)}`;
                console.log(`请求: ${url}`);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { accept: "application/json" },
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.Items && data.Items.length > 0) {
                                // 🔍 客户端过滤：只保留包含搜索词的结果
                                const filteredItems = data.Items.filter(item => {
                                    const name = (item.Name || '').toLowerCase();
                                    console.log(`🔍 ${name} 是否包含: ${searchLower}`);

                                    return name.includes(searchLower);
                                });

                                if (filteredItems.length > 0) {
                                    results.push({
                                        server: server,
                                        data: { ...data, Items: filteredItems, TotalRecordCount: filteredItems.length }
                                    });
                                    console.log(`✓ ${server.name} 找到资源: ${code} (过滤后: ${filteredItems.length}/${data.Items.length})`);
                                }
                            }
                        } catch (error) {
                            console.error(`${server.name} 解析失败:`, error);
                        }

                        completedRequests++;
                        if (completedRequests === enabledServers.length) {
                            callback(results);
                        }
                    },
                    onerror: (e) => {
                        console.error(`${server.name} 请求失败:`, e);
                        completedRequests++;
                        if (completedRequests === enabledServers.length) {
                            callback(results);
                        }
                    },
                    ontimeout: () => {
                        console.error(`${server.name} 请求超时`);
                        completedRequests++;
                        if (completedRequests === enabledServers.length) {
                            callback(results);
                        }
                    }
                });
            });
        }

        // ============ 修改：支持显示多个服务器的链接 ============
        insertEmbyLinks(targetElement, results) {
            const maxLinksPerServer = 3; // 每个服务器最多显示3个链接
            const domElement = targetElement instanceof jQuery ? targetElement[0] : targetElement;
            const parentElement = domElement.parentElement || domElement;

            // 检查是否已经插入过链接（避免重复）
            if (parentElement.querySelector('.emby-links-container')) {
                console.log('Emby链接已存在，跳过插入');
                return;
            }

            // 创建容器
            const containerDiv = document.createElement('div');
            containerDiv.className = 'emby-links-container';
            containerDiv.style.cssText = 'margin-top: 5px; display: flex; flex-direction: column; gap: 5px;';

            results.forEach(result => {
                const { server, data } = result;
                let insertedLinks = 0;

                data.Items.forEach(item => {
                    if (insertedLinks >= maxLinksPerServer) return;

                    const embyUrl = `${server.baseUrl}web/index.html#!/item?id=${item.Id}&serverId=${item.ServerId}`;

                    const linkDiv = document.createElement('div');
                    linkDiv.style.cssText = `
                        background: ${server.color};
                        border-radius: 3px;
                        padding: 3px 6px;
                        display: inline-block;
                    `;

                    const link = document.createElement('a');
                    link.href = embyUrl;
                    link.target = '_blank';
                    link.style.cssText = 'color: white; text-decoration: none;';
                    link.innerHTML = `<b>跳转到${server.name}👉</b>`;

                    linkDiv.appendChild(link);
                    containerDiv.appendChild(linkDiv);
                    insertedLinks++;
                });
            });

            if (containerDiv.children.length > 0) {
                $(domElement).after(containerDiv);
            }
        }

        // ============ 修改：高亮逻辑支持多服务器 ============
        highlightAndInsertEmbyLink(videos, extractFanhaoFunction, insertAfterSelector) {
            const videoArray = Array.from(videos);

            videoArray.forEach(videoElement => {
                const fanhaos = extractFanhaoFunction(videoElement);

                if (!fanhaos || fanhaos.length === 0) {
                    console.warn("未提取到番号，跳过该视频");
                    return;
                }

                const searchNextFanhao = (fanhaoIndex) => {
                    if (fanhaoIndex >= fanhaos.length) return;

                    let fanhao = fanhaos[fanhaoIndex];
                    this.fetchEmbyDataFromAllServers(fanhao, (results) => {
                        if (results.length > 0) {
                            const targetElement = insertAfterSelector
                                ? videoElement.querySelector(insertAfterSelector)
                                : videoElement;

                            if (targetElement) {
                                this.insertEmbyLinks(targetElement, results);

                                // 高亮处理：如果多个服务器都有，使用默认色，否则使用服务器色
                                const highlightColor = results.length > 1
                                    ? defaultColor
                                    : results[0].server.color;

                                videoElement.style.borderWidth = "3px";
                                videoElement.style.borderStyle = "solid";
                                videoElement.style.borderColor = highlightColor;
                                videoElement.style.backgroundColor = highlightColor + '20'; // 添加透明度
                            }
                        } else {
                            searchNextFanhao(fanhaoIndex + 1);
                        }
                    });
                };

                searchNextFanhao(0);
            });
        }
    }

    // 站点处理类（保持不变）
    class JavBus extends Base { }
    class JavLibrary extends Base { }
    class Javdb extends Base { }
    class Javbooks extends Base { }
    class Avmoo extends Base { }
    class Sehuatang extends Base { }
    class Msin extends Base { }
    class Javmenu extends Base { }
    class XXXClub extends Base { }
    class FreeJavBt extends Base { }

    class Main {
        constructor() {
            console.log('Jav跳转Emby启动（多服务器版）...');
            console.log('已配置服务器:', embyServers.filter(s => s.enabled).map(s => s.name).join(', '));

            this.sites = {
                'javBus': {
                    selector: "footer:contains('JavBus')",
                    class: JavBus,
                    listPageSelector: "#waterfall .item.masonry-brick, #waterfall_h .item",
                    listPageInsertAfter: ".item date",
                    listPageExtract: (el) => {
                        const fanhaoElement = el.querySelector('.item date');
                        return fanhaoElement ? [fanhaoElement.textContent.trim()] : [];
                    },
                    detailPageSelector: '.col-md-3.info p span:nth-child(2)',
                    detailPageContainer: ".col-md-3.info p span:nth-child(2):first",
                    detailPageExtract: () => {
                        const code = $('.col-md-3.info p').eq(0).find('span').eq(1).html();
                        return code ? [code] : [];
                    }
                },
                'freejavdb': {
                    selector: "#app:contains('Free JAV BT')",
                    class: FreeJavBt,
                    listPageSelector: ".row .category-page",
                    listPageInsertAfter: ".card-title",
                    listPageExtract: (el) => {
                        const fanhaoElement = el.querySelector('.card-title');
                        return fanhaoElement ? [fanhaoElement.textContent.trim()] : [];
                    },
                    detailPageSelector: '.single-video-info',
                    detailPageContainer: ".single-video-meta",
                    detailPageExtract: () => {
                        const prefix = $('.single-video-meta.code a.text-danger').text().trim();
                        const suffix = $('.single-video-meta.code span').last().text().trim();
                        const code = prefix + suffix;
                        return code ? [code] : [];
                    }
                },
                'javmenu': {
                    selector: "footer:contains('JAVMENU V3')",
                    class: Javmenu,
                    listPageSelector: ".page-content .category-page.video-list-item",
                    listPageInsertAfter: ".card-title.text-dark",
                    listPageExtract: (el) => {
                        const fanhaoElement = el.querySelector('.card-title.text-dark');
                        return fanhaoElement ? [fanhaoElement.textContent.trim()] : [];
                    },
                    detailPageSelector: '.page-content .container-fluid .tab-content h1 strong',
                    detailPageContainer: ".page-content",
                    detailPageExtract: () => {
                        const code = $('.page-content .container-fluid .tab-content h1 strong').text().trim().split(' ')[0];
                        return code ? [code] : [];
                    }
                },
                'xxxclub': {
                    selector: ".page-footer:contains('XXXClub')",
                    class: XXXClub,
                    listPageSelector: ".main-content ul li",
                    listPageInsertAfter: "span:nth-of-type(2) > a:nth-of-type(2)",  // nth-of-type 表示第几个 a 元素，2 表示第二个
                    listPageExtract: (el) => {
                        const aElement = el.querySelector('span:nth-of-type(2) > a:nth-of-type(2)');
                        if (!aElement) return [];
                        const title = aElement.textContent.trim();

                        const case1Match = title.match(/^(\S+)\s+(\d{2})\s+(\d{2})\s+(\d{2})/);
                        if (case1Match) {
                            return [`${case1Match[1]}.${case1Match[2]}.${case1Match[3]}.${case1Match[4]}`];
                        }

                        const case2Match = title.match(/^(\S+?) - .*?\((\d{2})\.(\d{2})\.(\d{4})\)$/);
                        if (case2Match) {
                            const [, brand, dd, mm, yyyy] = case2Match;
                            const yy = yyyy.slice(-2);
                            return [`${brand}.${yy}.${mm}.${dd}`];
                        }

                        const case3Match = title.match(/^(\S+) - .+? - (?!.*-)(.+)$/);
                        if (case3Match) {
                            return [`${case3Match[1]} ${case3Match[2]}`];
                        }

                        let currentIndex = -1;
                        let found = true;
                        for (let i = 0; i < 5; i++) {
                            currentIndex = title.indexOf(' ', currentIndex + 1);
                            if (currentIndex === -1) {
                                found = false;
                                break;
                            }
                        }
                        return found ? [title.substring(0, currentIndex)] : [];
                    },
                },
                'javLibrary': {
                    selector: "#bottomcopyright:contains('JAVLibrary')",
                    class: JavLibrary,
                    listPageSelector: ".video",
                    listPageInsertAfter: "a",
                    detailPageSelector: '#content #video_title #video_jacket_info #video_info .item .text',
                    detailPageContainer: "#video_info",
                    commentPageSelector: "#video_comments .comment",
                    commentPageInsertAfter: "strong",
                    listPageExtract: (el) => {
                        const fanhao = el.children[0]?.title.split(" ")[0] || el.children[1]?.title.split(" ")[0];
                        return fanhao ? [fanhao] : [];
                    },
                    detailPageExtract: () => {
                        const code = $('#video_info .item').eq(0).find('.text').html();
                        return code ? [code] : [];
                    },
                    commentPageExtract: (el) => {
                        const anchorElement = el.querySelector('a[href^="videoreviews.php?v="]');
                        return anchorElement ? [anchorElement.textContent.split(" ")[0]] : [];
                    }
                },
                'javdb': {
                    selector: "#footer:contains('javdb')",
                    class: Javdb,
                    listPageSelector: ".movie-list .item",
                    listPageInsertAfter: ".video-title strong",
                    detailPageSelector: 'body > section > div > div.video-detail > h2 > strong',
                    detailPageContainer: ".panel.movie-panel-info .value:first",
                    listPageExtract: (el) => {
                        const result = [];
                        const videoTitleElement = el.querySelector('.video-title strong');
                        if (videoTitleElement) {
                            const strongText = videoTitleElement.textContent.trim();
                            const hasThreeDigits = (strongText.match(/\d/g) || []).length >= 3;
                            if (hasThreeDigits) {
                                const processed = strongText.replace(/ /g, '');
                                result.push(processed);
                            } else {
                                const videoTitle = el.querySelector('.video-title');
                                const clonedTitle = videoTitle.cloneNode(true);
                                const clonedStrong = clonedTitle.querySelector('strong');
                                if (clonedStrong) {
                                    clonedStrong.textContent = clonedStrong.textContent
                                        .trim()
                                        .replace(/ /g, '');
                                }
                                const fullTitle = clonedTitle.textContent
                                    .trim()
                                    .replace(/[^a-zA-Z0-9]+/g, ' ')
                                    .trim();
                                result.push(fullTitle);
                            }
                        }
                        return result;
                    },
                    detailPageExtract: () => {
                        const code = $('body > section > div > div.video-detail > h2 > strong').text().trim().split(' ')[0];
                        return code ? [code] : [];
                    }
                },
                'javbooks': {
                    selector: "#Declare_box:contains('javbooks')",
                    class: Javbooks,
                    detailPageSelector: '#info > div:nth-child(2) > font',
                    detailPageContainer: "#info",
                    detailPageExtract: () => {
                        const code = $('#info > div:nth-child(2) > font').text().trim().split(' ')[0];
                        return code ? [code] : [];
                    }
                },
                'avmoo': {
                    selector: "footer:contains('AVMOO')",
                    class: Avmoo,
                    listPageSelector: "#waterfall .item",
                    listPageInsertAfter: ".item date",
                    listPageExtract: (el) => {
                        const fanhaoElement = el.querySelector('.item date');
                        return fanhaoElement ? [fanhaoElement.textContent.trim()] : [];
                    },
                    detailPageSelector: '.col-md-3.info p span:nth-child(2)',
                    detailPageContainer: ".col-md-3.info",
                    detailPageExtract: () => {
                        const code = $('.col-md-3.info p').eq(0).find('span').eq(1).html();
                        return code ? [code] : [];
                    }
                },
                'sehuatang': {
                    selector: "#flk:contains('色花堂')",
                    class: Sehuatang,
                    detailPageCodeRegex: /([a-zA-Z]{2,15}[-\s]?\d{2,15}|FC2PPV-[^\d]{0,5}\d{6,7})/i,
                    detailPageContainer: "#pgt",
                    detailPageExtract: () => {
                        const str = document.title.split(" ")[0];
                        return str.match(this.detailPageCodeRegex) || [];
                    }
                },
                'msin': {
                    selector: "#footer:contains('db.msin.jp')",
                    class: Msin,
                    detailPageSelector: 'div.mv_pn',
                    detailPageContainer: "#top_content",
                    detailPageExtract: () => {
                        const code = $('div.mv_pn').text().trim().split(' ')[0];
                        return code ? [code] : [];
                    }
                }
            };

            this.site = Object.keys(this.sites).find(key => $(this.sites[key].selector).length) || null;
            console.log('Matched site:', this.site);
            this.siteClass = this.site ? this.sites[this.site].class : null;
        }

        make() {
            if (!this.siteClass) return;

            const siteConfig = this.sites[this.site];
            const instance = new siteConfig.class();

            // 处理列表页
            if ($(siteConfig.listPageSelector).length > 0) {
                console.log('处理列表页');
                instance.highlightAndInsertEmbyLink(
                    $(siteConfig.listPageSelector),
                    (el) => siteConfig.listPageExtract ? siteConfig.listPageExtract(el) : [],
                    siteConfig.listPageInsertAfter ? siteConfig.listPageInsertAfter : null
                );
            }
            // 处理详情页
            else if ($(siteConfig.detailPageSelector).length > 0) {
                console.log('处理详情页');
                const codes = siteConfig.detailPageExtract ? siteConfig.detailPageExtract() : [];
                codes.forEach(code => {
                    instance.fetchEmbyDataFromAllServers(code, (results) => {
                        if (results.length > 0) {
                            const detailContainer = $(siteConfig.detailPageContainer);
                            if (detailContainer.length > 0) {
                                instance.insertEmbyLinks(detailContainer[0], results);
                            }
                        }
                    });
                });
            }
            // 处理评论页
            else if ($(siteConfig.commentPageSelector).length > 0) {
                console.log('处理评论页');
                instance.highlightAndInsertEmbyLink(
                    $(siteConfig.commentPageSelector),
                    (el) => siteConfig.commentPageExtract ? siteConfig.commentPageExtract(el) : [],
                    siteConfig.commentPageInsertAfter
                );
            }
        }
    }

    // 添加浮动按钮
    function addFloatingButton() {
        const button = document.createElement('div');
        button.textContent = '运行脚本';
        button.style.cssText = `
            position: fixed;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #52b54b;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        button.addEventListener('click', () => {
            console.log('运行脚本按钮被点击');
            new Main().make();
        });

        document.body.appendChild(button);
    }

    // 初始化
    setTimeout(() => {
        addFloatingButton();
        waitForCloudflare(() => {
            console.log('Cloudflare验证完成，启动主逻辑');
            new Main().make();
        });
    }, 1000);

})();
