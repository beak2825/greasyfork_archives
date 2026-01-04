// ==UserScript==
// @name         JavSS
// @namespace    javss
// @version      2.0.1
// @description  为 javdb、javbus 添加视频缩略图，菜单栏可直接按番号查找
// @author       anonymous
// @license      MIT
// @match        https://javdb.com/*
// @match        https://javdb459.com/*
// @match        https://www.javbus.com/*
// @match        https://www.javsee.ink/*
// @icon         http://javdb459.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      *
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541827/JavSS.user.js
// @updateURL https://update.greasyfork.org/scripts/541827/JavSS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TIMEOUT = 8000;

    const DEBUG_MODE = false;

    const SITE_CONFIGS = {
        'javdb.com': {
            idSelector: 'div.video-detail > h2 > strong',
            getId: (element) => element.textContent.trim().split(' ')[0],
            insertLink: ['javbus', 'avwiki', 'nyaa'],
            insertLinkSelector: 'div.panel-block.first-block',
            insertSearchSelector: '#navbar-menu-hero > .navbar-start',
            insertImageSelector: 'div.video-meta-panel',
            preCheck: {
                selector: 'section > div > div.movie-list',
                action: (movieList) => modifyMovieList(movieList)
            },
        },
        'www.javbus.com': {
            idSelector: 'div.info > p:nth-child(1) > span:nth-child(2)',
            getId: (element) => element.textContent,
            insertLink: ['javdb', 'avwiki', 'nyaa'],
            insertSearchSelector: '#navbar',
            insertImageSelector: 'div.row.movie',
        }
        // 其他网站添加在这里
    };

    const DOMAIN_MAPPING = {
        'javdb459.com': 'javdb.com',
        'www.dmmbus.ink': 'www.javbus.com',
        'www.seejav.ink': 'www.javbus.com',
        'www.javsee.ink': 'www.javbus.com'
    };

    const SITE_STYLES = {
        'javdb.com': `
            .ssc {
                text-align: center;
                padding: 2rem 0 3rem;
                border-top: 1px dashed #4a4a4a;
            }
            .ss {
                width: 95%;
                min-width: 9rem;
                min-height: 1rem;
                background-color: #4a4a4a;
            }
            #search-ss {
                color: inherit;
                font-size: inherit;
                background: none;
                border: none;
                cursor: pointer;
            }
        `,
        'www.javbus.com': `
            .ss {
                width: 100%;
                margin-top: 15px;
                min-width: 9rem;
                min-height: 1rem;
                background-color: #4a4a4a;
            }
            #search-ss {
                padding: 15px;
                background: none;
                border: none;
            }
        `
    };

    const SEARCH_ENGINE = {
        'javdb': 'https://javdb459.com/search?q=',
        'javbus': 'https://www.javbus.com/',
        'nyaa': 'https://sukebei.nyaa.si/?q=',
        'avwiki': 'https://av-wiki.net/?s='
    };

    //- 缩略图源配置
    const IMAGE_SOURCES = [
        {
            name: 'javbee',
            url: 'https://javbee.vip/search?keyword=',
            stages: [
                {
                    selector: 'div.images-description > ul > li:last-child > a',
                    getContent: (element) => element.innerHTML.trim()
                },
                {
                    selector: 'div.fileviewer-file > img',
                    getContent: (element) => element.src,
                },
            ],
        },
        {
            name: 'javstore',
            url: 'https://javstore.net/search/',
            buildUrl: (id) => `https://javstore.net/search/${id}-FHD.html`,
            stages: [
                {
                    selector: '#content_news > ul > li > a',
                    getContent: (element) => element.href,
                },
                {
                    selector: 'div.news > a',
                    getContent: (element) => element.href,
                },
            ],
        },
        // {
        //     name: '3xplanet',
        //     url: 'https://3xplanet.net/',
        //     stages: [
        //         {
        //             selector: 'div.td-post-content > div > p:nth-child(2) > a',
        //             isRelative: true,
        //             getContent: (element) => element.getAttribute('href'),
        //         },
        //         {
        //             selector: '#show_image',
        //             getContent: (element) => element.src,
        //         },
        //     ],
        // },
        // {
        //     name: 'javstore old',
        //     url: 'https://javstore.net/search/',
        //     buildUrl: (id) => `https://javstore.net/search/${id}.html`,
        //     stages: [
        //         {
        //             selector: '#content_news > ul > li:last-child > a',
        //             getContent: (element) => element.href,
        //         },
        //         {
        //             selector: 'div.news > a',
        //             getContent: (element) => element.href,
        //         },
        //         {
        //             isRedirect: true,
        //             selector: '#embed-code-2',
        //             getContent: (element) => element.getAttribute('value'),
        //         }
        //     ],
        // },
    ];

    const Swal = window.Swal;
    if (!Swal) console.error("SweetAlert 未加载");

    //==========================================================================

    const createLink = (title, href) => {
        const link = document.createElement('a');
        // link.target = '_blank';
        link.href = href;
        link.title = title;
        link.textContent = ' 🔗';
        link.style.color = 'inherit';
        return link;
    };

    const addLink = (target, engines, id) => {
        engines.forEach(engine => {
            const a = createLink(engine, SEARCH_ENGINE[engine] + id);
            target.append(a);
        });
    };

    const processItem = (item) => {
        const id = item.querySelector('div.video-title > strong').textContent;
        const tagsContainer = item.querySelector('div.tags');
        if (tagsContainer.children.length == 0) return;

        const newTag = document.createElement('span');
        newTag.classList.add('tag', 'is-info');
        newTag.textContent = '缩略图';

        newTag.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const { imgSrc, refUrl } = await getImage(id);
            if (imgSrc) {
                showImagePopup(id, imgSrc, refUrl);
            }
        });
        tagsContainer.append(newTag);
    };

    const modifyMovieList = (movieList) => {
        const container = document.querySelector('section > div');
        if (container) { container.style.maxWidth = '100%'; }

        const items = Array.from(movieList.querySelectorAll('.item'));
        if (items.length === 0) return;

        let currentIndex = 0;
        const itemsPerRow = 4; // 每行4个元素

        const scrollToCurrent = () => {
            if (items[currentIndex]) {
                items[currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        };

        const nextPage = () => {
            const nextPageLink = document.querySelector('a.pagination-next');
            nextPageLink?.click();
        };

        const prevPage = () => {
            const prevPageLink = document.querySelector('a.pagination-previous');
            prevPageLink?.click();
        };


        document.addEventListener('auxclick', (e) => {
            switch (e.button) {
                case 4: // 鼠标侧键前进
                    nextPage();
                    e.preventDefault();
                    break;
            }
        });

        document.addEventListener('keydown', function (e) {
            switch (e.key) {
                case 'ArrowRight':
                    nextPage();
                    break;
                case 'ArrowLeft':
                    prevPage();
                    break;
                case 'ArrowDown':
                    currentIndex = Math.min(currentIndex + itemsPerRow, items.length - 1);
                    scrollToCurrent();
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    currentIndex = Math.max(currentIndex - itemsPerRow, 0);
                    scrollToCurrent();
                    e.preventDefault();
                    break;
                case 'Home':
                    currentIndex = 0;
                    break;
                case 'End':
                    currentIndex = items.length - 1;
                    break;
            }
        });

        items.forEach(processItem);
    };

    const handleResponseError = (statusCode, url) => {
        const errorMessages = {
            400: '错误请求 - 客户端发送了无效的请求(可能是参数错误)',
            401: '未授权 - 需要身份验证',
            403: '禁止访问 - 服务器拒绝请求',
            404: '未找到 - 请求的资源不存在',
            500: '服务器内部错误 - 服务器端出现问题',
            502: '网关错误 - 上游服务器无效响应',
            503: '服务不可用 - 服务器暂时过载或维护',
            504: '网关超时 - 上游服务器未及时响应'
        };
        const errorType = statusCode >= 500
            ? '服务器端错误'
            : statusCode >= 400
                ? '客户端错误'
                : '未知错误';
        const message = errorMessages[statusCode] || errorType;
        console.warn(`请求失败: ${url} (状态码 ${statusCode}) - ${message}`);
    };

    const resolveUrl = (currentUrl, pathname) => {
        try {
            return pathname.startsWith('http')
                ? pathname
                : new URL(pathname, new URL(currentUrl).origin).href;
        } catch (error) {
            console.error(`URL resolution failed for currentUrl: ${currentUrl}, path: ${pathname}`);
            return null;
        }
    };

    const getImage = async (id, fromCache = true, timeout = TIMEOUT) => {
        if (!id || typeof id !== 'string') {
            throw new Error('番号无效');
        }

        // 默认启用尝试从缓存获取地址
        if (fromCache && !DEBUG_MODE) {
            const cachedResult = JSON.parse(localStorage.getItem('GM_' + id));
            if (cachedResult) {
                console.log('ℹ️ 从缓存获取到缩略图地址:', cachedResult.imgSrc, '@', cachedResult.refUrl);
                return cachedResult;
            }
        }

        /* eslint-disable no-await-in-loop */
        for (const source of IMAGE_SOURCES) {
            let duration = 0;
            const startTime = performance.now();

            const initialUrl = source.buildUrl?.(id) ?? `${source.url}${id}`;

            if (DEBUG_MODE) {
                console.groupCollapsed('Source', source.name);
            } else {
                console.group('Source', source.name);
            }

            try {
                let currentUrl = initialUrl;
                let currentContent = null;

                for (const [index, stage] of source.stages.entries()) {
                    console.group('Stage', index + 1);
                    console.log('请求地址:', currentUrl);

                    try {
                        const requestPromise = GM.xmlHttpRequest({
                            method: 'GET',
                            url: currentUrl,
                            ...(stage.isRedirect ? { redirect: 'follow' } : {})
                        });

                        const timeoutPromise = new Promise((_, reject) => {
                            setTimeout(() => {
                                reject(new Error(`请求超时（${timeout}ms）`));
                            }, timeout);
                        });

                        const response = await Promise.race([requestPromise, timeoutPromise]);

                        if (stage.isRedirect && response.finalUrl !== currentUrl) {
                            console.log(`↳ 重定向到: ${response.finalUrl}`);
                        }

                        if (response.status !== 200) {
                            handleResponseError(response.status, currentUrl);
                            break;
                        }

                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const element = doc.querySelector(stage.selector);

                        if (!element) {
                            console.warn(`未在响应找到元素: ${currentUrl} : ${stage.selector}`);
                            break;
                        }

                        currentContent = stage.getContent(element);

                        // 如果是最后阶段则直接返回
                        if (index === source.stages.length - 1) {
                            duration = performance.now() - startTime;
                            console.log(`✅ ${source.name} 获取到缩略图地址: ${currentContent} @ ${currentUrl}`);
                            if (!DEBUG_MODE) {
                                const result = {
                                    imgSrc: currentContent,
                                    refUrl: currentUrl
                                };
                                localStorage.setItem('GM_' + id, JSON.stringify(result));
                                return result;
                            }
                        }

                        // 处理下一阶段请求地址 URL
                        currentUrl = stage.isRelative
                            ? resolveUrl(currentUrl, currentContent)
                            : currentContent;

                        if (stage.isRedirect) {
                            currentUrl = response.finalUrl;
                        }

                        if (!currentUrl) break;
                    } catch (error) {
                        throw error;
                    } finally {
                        console.groupEnd();
                    }
                }
            } catch (error) {
                console.error('🚨 错误:', error.message);
            } finally {
                console.groupEnd();
                if (duration > 0) {
                    console.log(`%c⏳ 耗时: ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(1)}s)`, 'color: #bada55;');
                }
            }
        }
        /* eslint-enable no-await-in-loop */
        if (!DEBUG_MODE) {
            console.error('所有图源尝试获取失败');
        }
    };

    const addImage = async (id, selector) => {
        console.group(id);
        try {
            const { imgSrc, refUrl } = await getImage(id);
            if (!imgSrc) return;

            const container = document.createElement('div');
            container.classList.add('ssc');

            const a = document.createElement('a');
            a.href = imgSrc;
            a.title = '点击跳转到来源';

            const img = document.createElement('img');
            img.classList.add('ss');
            img.src = imgSrc;
            img.alt = '点击跳转到来源';

            const target = document.querySelector(selector);
            target.append(container);
            container.append(a);
            a.append(img);
        } catch { } finally {
            console.groupEnd();
        }
    };

    const showImagePopup = (id, imgSrc, refUrl) => {
        Swal.fire({
            theme: 'auto',
            width: '1224px',
            draggable: true,
            animation: false,
            showCancelButton: true,
            cancelButtonText: '关闭',
            imageUrl: imgSrc,
            imageAlt: '点击跳转到来源',
            imageWidth: '100%',
            confirmButtonText: '跳转到来源',
            preConfirm: () => {
                window.open(refUrl, '_blank');
                return false;
            },
            showDenyButton: true,
            denyButtonText: '清除缓存地址',
            preDeny: async () => {
                localStorage.removeItem('GM_' + id);
                await Swal.fire({
                    timer: 1500,
                    theme: 'auto',
                    icon: 'success',
                    title: '操作完成',
                    text: '缩略图缓存地址已清除',
                    showConfirmButton: false,
                });
                return true;
            }
        });
    };

    const showSearchDialog = async () => {
        const { value: response } = await Swal.fire({
            theme: 'auto',
            title: '查找',
            width: '20.5em',
            input: 'text',
            confirmButtonText: '查找',
            inputPlaceholder: '输入番号',
            showLoaderOnConfirm: true,
            preConfirm: async (id) => {
                try {
                    const response = await getImage(id);
                    response.id = id;
                    return (Swal.isVisible()) ? response : false;
                } catch (error) {
                    Swal.showValidationMessage(`请求失败: ${error.message}`);
                }
            },
            showDenyButton: true,
            denyButtonColor: '#3085d6',
            returnInputValueOnDeny: true,
            denyButtonText: '强制刷新',
            preDeny: async (id) => {
                try {
                    const response = await getImage(id, false);
                    response.id = id;
                    return (Swal.isVisible()) ? response : false;
                } catch (error) {
                    Swal.showValidationMessage(`请求失败: ${error.message}`);
                }
            },
            showCancelButton: true,
            cancelButtonText: '取消',
            // allowOutsideClick: () => !Swal.isLoading()
        });

        if (response) {
            showImagePopup(response.id, response.imgSrc, response.refUrl);
        }
    };

    const init = async () => {
        GM_registerMenuCommand('查找缩略图', showSearchDialog);
    };

    //==========================================================================
    const main = () => {
        init();

        const hostname = window.location.hostname;
        const host = DOMAIN_MAPPING?.[hostname] ?? hostname;
        const site = SITE_CONFIGS[host];

        if (!site) {
            console.log('需添加网站配置到 SITE_CONFIGS');
            return;
        }

        GM_addStyle(SITE_STYLES[host]);

        if (site.insertSearchSelector) {
            const target = document.querySelector(site.insertSearchSelector);
            if (target) {
                const button = document.createElement("button");
                button.textContent = "查找缩略图";
                button.id = 'search-ss';
                button.addEventListener("click", showSearchDialog);
                target.append(button);
            }
        }

        if (site.preCheck) {
            const target = document.querySelector(site.preCheck.selector);
            if (target) {
                site.preCheck.action(target);
            }
        }

        const idElement = document.querySelector(site.idSelector);
        if (!idElement) return;

        const id = site.getId(idElement);
        if (!id) return;

        addLink(site.insertLinkSelector ? document.querySelector(site.insertLinkSelector) : idElement, site.insertLink, id);
        addImage(id, site.insertImageSelector);
    };
    main();
})();