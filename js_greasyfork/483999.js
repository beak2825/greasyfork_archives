// ==UserScript==
// @name               Pixiv novel to Epub
// @name:zh-CN         Pixiv小说Epub合成器
// @name:en            Pixiv novel to Epub
// @namespace          PY-DNG userscripts
// @version            0.2.1
// @description        Download pixiv novels in Epub format
// @description:zh-CN  以Epub格式下载Pixiv小说
// @description:en     Download pixiv novels in Epub format
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              *://www.pixiv.net/*
// @match              *://pixiv.net/*
// @connect            pximg.net
// @require            https://update.greasyfork.org/scripts/456034/1651347/Basic%20Functions%20%28For%20userscripts%29.js
// @require            data:application/javascript,window.setImmediate%20%3D%20window.setImmediate%20%7C%7C%20((f%2C%20...args)%20%3D%3E%20window.setTimeout(()%20%3D%3E%20f(args)%2C%200))%3B
// @require            https://fastly.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require            https://fastly.jsdelivr.net/npm/ejs@3.1.9/ejs.min.js
// @require            https://fastly.jsdelivr.net/npm/jepub@2.1.4/dist/jepub.min.js
// @icon               data:image/png;base64,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
// @grant              GM_xmlhttpRequest
// @grant              GM_registerMenuCommand
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/483999/Pixiv%20novel%20to%20Epub.user.js
// @updateURL https://update.greasyfork.org/scripts/483999/Pixiv%20novel%20to%20Epub.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// @require            https://fastly.jsdelivr.net/npm/setimmediate@1.0.5/setImmediate.min.js
// @require            https://fastly.jsdelivr.net/npm/jepub@2.1.4/dist/jepub.min.js
// @require            https://fastly.jsdelivr.net/npm/ejs@3.1.9/ejs.min.js
// @require            https://fastly.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js

/* global LogLevel DoLog Err Assert $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */
/* global jEpub, JSZip, ejs */

let PixivAPI = (function() {
    // 网络请求队列配置
    queueTask.PixivApiGet = {
        sleep: 200,
        max: 10
    };

    // 全局请求缓存
    const requestCache = new Map();

    // 自定义网络请求错误类
    class APIRequestError extends Error {
        constructor(message, originalError) {
            super(message);
            this.name = 'APIRequestError';
            this.originalError = originalError;
        }
    }

    return {
        APIRequestError, requestCache,

        get, safeGet, utils: { toAbsURL, toSearch, queueTask },

        // https://www.pixiv.net/ajax/novel/18673574
        novel: id => safeGet(`/ajax/novel/${id}`),

        // https://www.pixiv.net/ajax/novel/7522350/insert_illusts?id%5B%5D=60139778-1&lang=zh&version=1efff679631a40a674235820806f7431d67065d9
        insert_illusts: (novel_id, illust_ids, lang='zh') => {
            const url = `/ajax/novel/${novel_id}/insert_illusts`;
            const query = { lang };
            if (Array.isArray(illust_ids)) {
                for (let i = 0; i < illust_ids.length; i++) {
                    const id = illust_ids[i];
                    query[`id[${i}]`] = id;
                }
            } else {
                query[`id[]`] = illust_ids;
            }
            return safeGet(url, query);
        },

        // https://www.pixiv.net/ajax/novel/series/9649276?lang=zh&version=a48f2f681629909b885608393916b81989accf5b
        // 'version' removed due to unspecified meaning
        series: (id, lang='zh') => safeGet(`/ajax/novel/series/${id}`, { id, lang }),

        // https://www.pixiv.net/ajax/novel/series_content/9649276?limit=30&last_order=0&order_by=asc
        series_content: (id, limit=30, last_order=0, order_by='asc') => safeGet(`/ajax/novel/series_content/${id}`, { limit, last_order, order_by }),
    };

    function safeGet() {
        return queueTask(() => get.call(this, ...arguments), 'PixivApiGet');
    }

    /* 旧版get，仅有网络访问和内部重试，无法外部手动调用重试
    function get(url, params, responseType='json', retry=2) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', responseType,
                headers: {
                    Referer: /^(www\.)?pixiv\.net$/.test(location.host) ? location.href : 'https://www.pixiv.net/'
                },
                url: toAbsURL(url, params),
                onload: async res => res.status === 200 && (responseType !== 'json' || res.response?.error === false) ? resolve(res.response) : checkRetry(res),
                onerror: checkRetry
            });

            async function checkRetry(err) {
                retry-- > 0 ? get(url, params, responseType, retry).then(resolve).catch(reject) : reject(err);
            }
        });
    }
    */

    function get(url, params, responseType = 'json', maxRetries = 2, noCache = false) {
        let retryCount = 0;
        let currentRequest = null;
        let isCancelled = false;
        let currentResolve, currentReject;
        
        // 生成缓存键
        const cacheKey = generateCacheKey(url, params, responseType);
        
        // 检查缓存
        if (!noCache && requestCache.has(cacheKey)) {
            return createCachedResponse(requestCache.get(cacheKey), true);
        }
        
        // 创建 thenable 对象
        const controller = {
            then(onFulfilled, onRejected) {
                return this.promise.then(onFulfilled, onRejected);
            },
            catch(onRejected) {
                return this.promise.catch(onRejected);
            },
            finally(onFinally) {
                return this.promise.finally(onFinally);
            },
            cancel,
            get isCancelled() { return isCancelled; },
            fromCache: false
        };
        
        // 创建单一Promise
        controller.promise = new Promise((resolve, reject) => {
            currentResolve = resolve;
            currentReject = reject;
            executeRequest();
        });
        
        return controller;
        
        function executeRequest() {
            if (isCancelled) {
                currentReject(new Error('Request was cancelled'));
                return;
            }
            
            currentRequest = GM_xmlhttpRequest({
                method: 'GET',
                responseType,
                headers: {
                    Referer: /^(www\.)?pixiv\.net$/.test(location.host) ? location.href : 'https://www.pixiv.net/'
                },
                url: toAbsURL(url, params),
                timeout: 20 * 1000,
                
                onload: (res) => {
                    if (res.status === 200 && (responseType !== 'json' || res.response?.error === false)) {
                        requestCache.set(cacheKey, res.response);
                        currentResolve(res.response);
                    } else {
                        handleError(res);
                    }
                },
                
                onerror: (err) => {
                    handleError(err);
                },
                
                ontimeout: (err) => {
                    handleError(new APIRequestError('Request timeout after 20 seconds'));
                },
                
                onabort: () => {
                    currentReject(new APIRequestError('Request was aborted'));
                }
            });
        }
        
        function handleError(err) {
            if (isCancelled) {
                currentReject(new APIRequestError('Request was cancelled', err));
                return;
            }
            
            if (retryCount < maxRetries) {
                retryCount++;
                executeRequest();
            } else {
                currentReject(new APIRequestError('Request failed after retries', err));
            }
        }
        
        function cancel() {
            isCancelled = true;
            if (currentRequest) {
                currentRequest.abort();
                currentRequest = null;
            }
        }
        
        function generateCacheKey(url, params, responseType) {
            const sortedParams = params ? Object.keys(params)
                .sort()
                .map(key => `${key}=${params[key]}`)
                .join('&') : '';
            return `${url}?${sortedParams}&responseType=${responseType}`;
        }
        
        function createCachedResponse(data, fromCache) {
            return {
                then(onFulfilled) {
                    return Promise.resolve(data).then(onFulfilled);
                },
                catch() {
                    return this;
                },
                finally(onFinally) {
                    return Promise.resolve(data).finally(onFinally);
                },
                cancel: () => {},
                isCancelled: false,
                fromCache: fromCache
            };
        }
    }

    function toAbsURL(pathname, searchOptions) {
        return new URL(pathname, `https://www.pixiv.net/`).href + (searchOptions ? `?${toSearch(searchOptions)}` : '');
    }

    function toSearch(options) {
        return new URLSearchParams(options).toString()
    }
}) ();

(async function __MAIN__() {
    'use strict';

    const CONST = {
        TextAllLang: {
            DEFAULT: 'zh-CN',
            'zh-CN': {
                DownloadEpub: '下载当前小说Epub',
                DownloadEpub_Short: '下载Epub',
                DownloadEpub_Progress: 'Epub (C/A)',
                DownloadComplete: 'Epub下载完成',
                DownloadError: 'Epub下载错误，点击重试',
                DownloadMultiple: '合并下载多篇小说',
                InputNovelIds: '请输入需要下载的多篇小说的id，用空格或逗号分隔',
                ClearCache: '清理缓存',
                RestrictData: {"0":"Enable","1":"NotFound","2":"Mypixiv","3":"R18","4":"R18G","Enable":0,"NotFound":1,"Mypixiv":2,"R18":3,"R18G":4},
                RestrictInfo: {
                    NotFound: "#%(order)は非公開作品です", // No translation provided by pixiv yet
                    Mypixiv: '#%(order)是好P友限定作品',
                    R18: '#%(order)是R-18作品',
                    R18G: '#%(order)是R-18G作品'
                },
                UnvieableTitle: '该章节无法查看', // unused constance, deletable
                UnvieableContent: '此章节Pixiv并未开放查看，请到Pixiv网站或app检查该章节是否设置了阅读限制\n如果是R18/R18G阅读限制，可到Pixiv网站打开R18/R18G开关（并重新下载Epub）'
            }
        },
        /** @returns {typeof CONST.TextAllLang['zh-CN']} */
        get Text() {
            const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
            return CONST.TextAllLang[i18n];
        },
        GFURL: 'https://greasyfork.org/scripts/483999',
        GFAuthorURL: 'https://greasyfork.org/users/667968',
        Symbol: {
            CHAPTER_NOT_VIEWABLE: Symbol('CHAPTER_NOT_VIEWABLE')
        }
    };

    // @require fallbacks
    await Promise.all([
        { missing: typeof setImmediate === 'undefined', src: 'https://fastly.jsdelivr.net/npm/setimmediate@1.0.5/setImmediate.min.js' },
        { missing: typeof JSZip === 'undefined', src: 'https://fastly.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js' },
        { missing: typeof ejs === 'undefined', src: 'https://fastly.jsdelivr.net/npm/ejs@3.1.9/ejs.min.js' },
        { missing: typeof jEpub === 'undefined', src: 'https://fastly.jsdelivr.net/npm/jepub@2.1.4/dist/jepub.min.js' }
    ].filter(script => script.missing).map(src => new Promise((resolve, reject) => document.head.appendChild($$CrE({
        tagName: 'script',
        props: { src },
        listeners: [
            ['load', resolve],
            ['error', reject]
        ]
    })))));

    // Progress
    const progress = {
        /** @typedef {'loading' | 'finished' | 'error'} ProgressStatus */
        /** @type {ProgressStatus} Total status for all tasks */
        __status: 'finished',
        /** @type {number} currently finished tasks count */
        __finished: 0,
        /** @type {number} all tasks count */
        __all: 0,
        /** @typedef {(finished: number, all: number, status: ProgressStatus) => any} ProgressListener */
        /** @type {Record<number, ProgressListener>} all progress update listeners */
        __listeners: {},
        /** @type {number} next listener id */
        __id: 0,

        __broadcast() {
            Object.values(this.__listeners).forEach(l => l(this.__finished, this.__all, this.__status));
        },

        /**
         * Reset progress to (0, 0, 'loading') and broadcast event
         */
        start() {
            this.__status = 'loading';
            this.__finished = 0;
            this.__all = 0;
            this.__broadcast();
        },

        /**
         * Set progress status to 'finished' and broadcast event
         */
        finish() {
            this.__status = 'finished';
            this.__broadcast();
        },

        /**
         * Set progress status to 'error' and broadcast event
         */
        error() {
            this.__status = 'error';
            this.__broadcast();
        },

        /**
         * Update progress
         * @param {number} finished 
         * @param {number} [all] 
         * @param {ProgressStatus} [status] 
         */
        update(finished, all=null, status=null) {
            this.__finished = finished;
            all !== null && (this.__all = all);
            status !== null && (this.__status = status);
            Object.values(this.__listeners).forEach(l => l(this.__finished, this.__all, this.__status));
        },

        /**
         * Add a progress update listener
         * @param {ProgressListener} l 
         * @returns {number} listener id
         */
        listen(l) {
            const id = this.__id++;
            this.__listeners[id] = l;
            return id;
        },

        /**
         * Remove a progress update listener
         * @param {number} id - listener id
         */
        remove(id) {
            delete this.__listeners[id]
        },

        get status() {
            return this.__status;
        },
        get finished() {
            return this.__finished;
        },
        get all() {
            return this.__all;
        },
        get listeners() {
            return this.__listeners;
        }
    };

    // User Interface
    GM_registerMenuCommand(CONST.Text.DownloadEpub, downloadEpub);
    GM_registerMenuCommand(CONST.Text.DownloadMultiple, downloadCustom);
    GM_registerMenuCommand(CONST.Text.ClearCache, clearCache);

    loadFuncs([{
        id: 'main',
        func() {
            detectDom({
                selector: 'main>section section',
                callback: section => {
                    if (!FunctionLoader.testCheckers([{
                        type: 'regpath',
                        value: /^\/novel\/series\/\d+$/
                    }, {
                        type: 'path',
                        value: '/novel/show.php'
                    }])) { return; }

                    const toolbar = section;
                    const dlDiv = makeDownloadButton();
                    toolbar.appendChild(dlDiv);
                }
            });

            function makeDownloadButton() {
                const DOWNLOAD = '<svg class="epub-download-svg" viewBox="0 0 32 32" width="32" height="32">\n            <mask id="mask">\n                <rect x="0" y="0" width="32" height="32" fill="white"></rect>\n                <path d="M21.358 6.7v6.39H27L16 25.7 5 13.09h5.642V6.7z"></path>\n            </mask>\n            <path d="M10.64 5.1c-1.104 0-2 .716-2 1.6v4.8H5c-.745 0-1.428.332-1.773.86s-.294 1.167.133 1.656l11 12.61c.374.43.987.685 1.64.685s1.266-.256 1.64-.685l11-12.61c.426-.49.477-1.127.133-1.656S27.745 11.5 27 11.5h-3.644V6.7c-.001-.883-.895-1.6-2-1.6z" mask="url(#mask)"></path>\n        </svg>';
                const CANCEL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>'
                const STYLE = '.epub-download { margin-right: 20px; line-height: 32px; font-weight: 700; cursor: pointer; padding: 0px; background: none; border: none; } .epub-download-button { display: inline-block; padding: 0; color: inherit; background: none; height: 32px; line-height: 32px; border: none; font-weight: 700; cursor: pointer; } .epub-download-svg { vertical-align: middle; overflow: visible !important; margin-right: 4px; width: 12px; font-size: 0; -webkit-transition: fill .2s; transition: fill .2s; fill: currentColor; } .epub-download-span { vertical-align: middle; }';
                addStyle(STYLE, 'novel-epub-download');

                const div = $$CrE({
                    tagName: 'div',
                    classes: 'epub-download',
                    //listeners: [['click', e => download]]
                });
                const button = $$CrE({
                    tagName: 'button',
                    classes: 'epub-download-button',
                    props: { innerHTML: DOWNLOAD }
                });
                const span = $$CrE({
                    tagName: 'span',
                    classes: 'epub-download-span',
                    props: { innerText: CONST.Text.DownloadEpub_Short }
                });
                $AEL(div, 'click', download);
                button.appendChild(span);
                div.appendChild(button);
                return div;

                function download() {
                    if (progress.status === 'finished') {
                        startDownload();
                    } else if (progress.status === 'error') {
                        errorRetry();
                    }
                }

                function startDownload() {
                    const listernerID = progress.listen((cur, all, status) => {
                        switch (status) {
                            case 'finished': {
                                span.innerText = CONST.Text.DownloadComplete;
                                progress.remove(listernerID);
                                break;
                            }
                            case 'loading': {
                                const text = replaceText(CONST.Text.DownloadEpub_Progress, { C: cur, A: all });
                                span.innerText = text;
                                break;
                            }
                            case 'error': {
                                span.innerText = CONST.Text.DownloadError;
                            }
                        }
                    })
                    downloadEpub();
                }

                function errorRetry() {
                    // 错误重试逻辑
                    // 我们采用了缓存api结果的方案，因此错误重试只需要重新开始下载即可，缓存会自动应用
                    downloadEpub();
                }
            }
        }
    }])

    function clearCache() {
        PixivAPI.requestCache.clear();
        DoLog('已清理缓存');
    }

    function downloadEpub() {
        const pathname = location.pathname;

        // Novel series
        // https://www.pixiv.net/novel/series/9649276
        /^\/novel\/series\/\d+$/.test(pathname) && downloadSeries();

        // Novel
        // https://www.pixiv.net/novel/show.php?id=18673574
        /^\/novel\/show\.php$/.test(pathname) && downloadNovel();
    }

    function downloadCustom() {
        const input = prompt(CONST.Text.InputNovelIds);
        if (!input) return;
        const ids = input.split(/[ ,，]+/g).map(str => parseInt(str, 10));
        downloadMultiple(ids);
    }

    async function downloadSeries() {
        try {
            DoLog('Start downloading series');
            progress.start();

            progress.update(1, 5);
            const id = location.pathname.split('/').pop();
            const epub = new jEpub();

            // Get series data
            const series = (await PixivAPI.series(id)).body;
            await initEpub(epub, series);

            // List all novels
            progress.update(2, 5);
            const promises = [];
            for (let index = 0; index < series.total; index += 30) {
                const promise = PixivAPI.series_content(id, 30, index);
                promises.push(promise);
            }
            const list = (await Promise.all(promises)).reduce((l, json) => ((l.push(...json.body.page.seriesContents), l)), []);
            DoLog(list);

            progress.update(3, 5);
            const novel_datas = await Promise.all(list.map(
                async novel => (
                    novel.series.viewableType == 0 ? 
                        (await PixivAPI.novel(novel.id)).body : 
                        /** @type {UnviewableData} */
                        ({
                            unviewable: CONST.Symbol.CHAPTER_NOT_VIEWABLE,
                            texthint: replaceText(CONST.Text.RestrictInfo[CONST.Text.RestrictData[novel.series.viewableType]], { '%(order)': novel.series.contentOrder }),
                        })
                )
            ));
            DoLog(novel_datas);

            /* Now loading chapter and adding loaded chapter has been separated, use Promise.all to speed up the process
            // Add chapters one by one
            // Do not use promise.all, because that will break the order
            for (const data of novel_datas) {
                await addChapter(epub, data);
            }
            //await Promise.all(novel_datas.map(async data => await addChapter(epub, data)));
            */
            // Load all chapters asynchronously and Add them to epub at once
            progress.update(4, 5);
            const chapters = await Promise.all(novel_datas.map(data => loadChapter(epub, data)));
            chapters.forEach(chapter => addLoaded(epub, chapter));
            DoLog(chapters);
            DoLog('Saving Epub');

            progress.update(5, 5);
            saveEpub(epub, series.title + '.epub', () => progress.finish());
        } catch (error) {
            // 错误处理
            if (error instanceof PixivAPI.APIRequestError) {
                // API错误
                DoLog(LogLevel.Warning, ['API request failed:', error]);
                progress.error();
            } else {
                // 非API错误
                DoLog(LogLevel.Error, ['Unexpected error:', error]);
                progress.error();
            }
            
            throw error; // 仍然抛出以便外部知道失败
        }
    }

    /**
     * 下载多篇小说并像系列小说一样合成为一个Epub
     * @param {number[]} novel_ids 小说id列表
     * @param {string} filename 文件名（不含".epub"），省略则使用第一篇小说的标题
     */
    async function downloadMultiple(novel_ids, filename) {
        DoLog('Start downloading multiple novels');
        progress.start();

        const epub = new jEpub();
        const initdata = (await PixivAPI.novel(novel_ids[0])).body;
        await initEpub(epub, initdata);

        progress.update(1, 3);
        const novel_datas = await Promise.all(novel_ids.map(
            async novel_id => (await PixivAPI.novel(novel_id)).body
        ));
        DoLog(novel_datas);

        // Load all chapters asynchronously and Add them to epub at once
        progress.update(2, 3);
        const chapters = await Promise.all(novel_datas.map(data => loadChapter(epub, data)));
        chapters.forEach(chapter => addLoaded(epub, chapter));
        DoLog(chapters);
        DoLog('Saving Epub');

        progress.update(3, 3);
        filename = (filename ?? novel_datas[0].title) + '.epub';
        saveEpub(epub, filename, () => progress.finish());
    }

    async function downloadNovel() {
        try {
            DoLog('Start downloading novel');
            progress.start();
            progress.update(1, 2);

            const id = getUrlArgv('id');
            const json = await PixivAPI.novel(id);
            const data = json.body;

            const epub = new jEpub();
            await Promise.all([initEpub(epub, data), addChapter(epub, data)]);
            progress.update(2, 2);

            saveEpub(epub, data.title + '.epub', () => progress.finish());
        } catch (error) {
            // 错误处理
            if (error instanceof APIRequestError) {
                // API错误
                DoLog('API request failed:', error);
                progress.error();
            } else {
                // 非API错误
                DoLog('Unexpected error:', error);
                progress.error();
            }
            
            throw error; // 仍然抛出以便外部知道失败
        }
    }

    // Compatible with PixivAPI.novel / PixivAPI.series
    async function initEpub(epub, data) {
        const html_link = `<a href="${htmlEncode(location.href)}" title="${htmlEncode(data.extraData.meta.title)}">${htmlEncode(location.href)}</a>`;
        const html_desc = `<div content-role="source">Pixiv link: ${html_link}</div><div content-role="description">${data.description || data.caption || ''}</div>`;
        const html_note = `EPUB generated from: ${html_link}</br>By <a href="${htmlEncode(CONST.GFURL)}">${htmlEncode(GM_info.script.name)}</a> author <a href="${htmlEncode(CONST.GFAuthorURL)}">${htmlEncode(GM_info.script.author)}</a></br></br>Copyright belongs to the article author. Please comply with relevant legal requirements while reading and distributing this file.`;
        epub.init({
            i18n: 'en',
            title: data.title,
            author: data.userName,
            publisher: '',
            description: html_desc,
            tags: Array.isArray(data.tags) ? data.tags : data.tags.tags.map(tag => tag.tag)
        });
        epub.date(new Date(data.uploadDate || data.lastPublishedContentTimestamp));
        epub.notes(html_note);

        const coverUrl = data.coverUrl || data.cover.urls.original;
        const cover = await PixivAPI.safeGet(coverUrl, null, 'blob');
        epub.cover(cover);

        return epub;
    }

    /**
     * @typedef {{ unviewable: typeof CONST.Symbol.CHAPTER_NOT_VIEWABLE, texthint: string }} UnviewableData
     */
    /**
     * Load chapter assets and generate { title, content } (that ready to epub.add) which is called a 'chapter'
     * @param {jEpub} epub jEpub实例
     * @param {{} | UnviewableData} data novel api数据，或者该章节无法阅读的提示信息
     * @returns {{ title: string, content: string }}
     */
    async function loadChapter(epub, data) {
        if (data?.unviewable === CONST.Symbol.CHAPTER_NOT_VIEWABLE) {
            const texthint = replaceText(CONST.Text.RestrictInfo[CONST.Text.RestrictData[data.series.viewableType]], { '%(order)': data.series.contentOrder });
            return {
                title: texthint,
                content: `<p>${htmlEncode(CONST.Text.UnvieableContent).replace('\n', '<br>')}</p>`
            };
        }

        let content = data.content;

        // Load images
        const imagePromises = [];
        content = content.replace(/\[uploadedimage:([\d\-]+)\]/g, (match_str, id) => {
            const url = data.textEmbeddedImages[id].urls.original;
            const promise = PixivAPI.safeGet(url, null, 'blob').then(blob => epub.image(blob, id));//.catch(err => );
            imagePromises.push(promise);
            return `\n<%= image[${id}] %>\n`;
        });
        const illusts = Array.from(new Set( [...content.matchAll(/\[pixivimage:([\d\-]+)\]/g)] ));
        if (illusts.length) {
            const illustsJson = await PixivAPI.insert_illusts(data.id, illusts.map(match => match[1]));
            illusts.forEach(illust => {
                const id = illust[1];
                if (illustsJson.body[id].visible) {
                    const url = illustsJson.body[id].illust.images.original;
                    const promise = PixivAPI.safeGet(url, null, 'blob').then(blob => epub.image(blob, id));//.catch(err => );
                    imagePromises.push(promise);
                    content = content.replaceAll(illust[0], `\n<%= image[${escJsStr(id)}] %>\n`);
                }
            });
        }
        await Promise.all(imagePromises);

        // Parse '[[rb:久世彩葉 > くぜ いろは]]' // 10618179
        content = content.replace(/\[\[rb:([^\[\]]+) *> *([^\[\]]+)\]\]/g, (match_str, main, desc) => {
            return `<ruby>${htmlEncode(main)}<rp>(</rp><rt>${htmlEncode(desc)}</rt><rp>)</rp></ruby>`;
        });

        // Parse '[chapter:【プロローグ】]' // 21893883
        content = content.replace(/\[chapter: *([^\]]+)\]/g, (match_str, chapterName) => {
            return `<h2>${chapterName}</h2>`;
        });

        // Parse '[[jumpuri:捕虜の待遇に関する千九百四十九年八月十二日のジュネーヴ条約（第三条約)【日本国防衛省ホームページより】 > https://www.mod.go.jp/j/presiding/treaty/geneva/geneva3.html]]' // 19912145#12
        content = content.replace(/\[\[jumpuri:([^\[\]]+) *> *([^\[\]]+)\]\]/g, (match_str, text, url) => {
            return `<a href=${escJsStr(url)}>${htmlEncode(text)}</a>`;
        });

        // Parse '[jump:2]' // 22003928
        content = content.replace(/\[jump:(\d+)\]/g, (match_str, page) => {
            return `<a href=${escJsStr(`#ChapterPage-${page}`)}>Jump to page ${htmlEncode(page)}</a>`;
        });

        // Check undealed markers
        let markers = Array.from(content.matchAll(/\[+[^\[\]]+\]+/g));
        markers = markers.filter(match => {
            // remove dealed images
            const pattern = match.input.substring(match.index-9, match.index + match[0].length+3);
            const isImagePattern = pattern.startsWith('<%= image[') && pattern.endsWith('] %>');

            // remove [newpage]s
            const isNewpagePattern = match[0].includes('[newpage]'); // Why .include: for matches like '[xxx[[newpage]]]blabla]]'
            return !isImagePattern && !isNewpagePattern;
        });
        markers.length && DoLog(LogLevel.Warning, {
            message: 'Undealed markers found',
            chapter: data,
            markers
        });

        // Up to 4 connected newlines (3 empty lines between paragraphs) at once
        content = content.replaceAll(/\n{4,}/g, '\n'.repeat(4));

        // Parse '[newpage]' & Covert into html
        const pageCounter = (start => {
            let num = start;
            return () => start++;
        }) (1);

        content = content.split('[newpage]').map(subContent => {
            // Split content into pages and wrap each page's lines into <p>s
            return subContent.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '<br>').join('\n');
        }).map(pageHTML => {
            const page = pageCounter();
            const page_id = `ChapterPage-${page}`;

            // Remove <br>s at beggining and ending of each page
            pageHTML = pageHTML.replaceAll(/^(<br>|\s)+/g, '').replaceAll(/(<br>|\s)+$/g, '');

            // Add page number to start and end of each page
            const pageNum = `<div class="ChapterBlockMarker">Page ${page}</div>`;
            pageHTML = `${pageNum}\n${pageHTML}\n${pageNum}`;

            // Wrap each page's html in <div id=pageID>
            return `<div id=${escJsStr(page_id)} class="ChapterContentBlock">\n${pageHTML}\n</div>`;
        }).join('\n');

        // Add description to chapter beginning
        let description = data.description;
        description = description
            .replace(/(<br \/>)+/g, '<br>').split('<br>')
            .filter(line => line.trim().length)
            .map(line => `<p>${line}</p>`)
            .join('\n');
        description = `<div id="ChapterDescription" class="ChapterContentBlock">${description}</div>\n`;
        content = description + content;

        // Add cover image to chapter beginning
        const cover = await PixivAPI.safeGet(data.coverUrl, null, 'blob');
        const coverId = `ChapterCover-${data.id}`;
        epub.image(cover, coverId);
        content = `\n<%= image[${escJsStr(coverId)}] %>\n` + content;

        // Add style
        content = '<style>.ChapterContentBlock { border-bottom: solid; padding: 1em 0; } .ChapterBlockMarker { font-size: 1em; text-align: right; }</style>' + content;

        return {
            title: data.title,
            content
        };
    }

    function addLoaded(epub, chapter) {
        epub.add(chapter.title, chapter.content);
    }

    async function addChapter(epub, data) {
        const chapter = await loadChapter(epub, data);
        addLoaded(epub, chapter);
    }

    /**
     * Hook epub generation and existing files to modify epub files
     * @param {jEpub} epub - this jEpub instance should been already inited
     */
    async function epubHooks(epub) {
        Assert(epub._Zip, 'Provided jEpub instance haven\'t been initialized yet');

        /** @type {Record<string, (string) => string>} */
        const modifiers = {
            'OEBPS/title-page.html': title_page,
        };
        const zip = epub._Zip;
        const add_file = zip.file.bind(zip);

        // Modify existing files
        for (const [path, modifier] of Object.entries(modifiers)) {
            const file = zip.file(path);
            if (file) {
                const html = modifier(await file.async('string'));
                add_file(path, html);
            }
        }

        // Hook file adding
        zip.file = function(path, content) {
            return arguments.length > 1 && modifiers.hasOwnProperty(path) ?
                add_file(path, modifiers[path]()) :
                add_file(...arguments);
        };

        /**
         * modifies title page:
         * - wrap description in <p> for auto-novel translator
         */
        function title_page(content) {
            // Parse and modify
            const doc = new DOMParser().parseFromString(content, 'text/html');
            const desc = $(doc, '.ugc [content-role="description"]');
            desc.innerHTML = desc.innerHTML.replaceAll(/<[ \/]*br[ \/]*>/g, '\n').split(/[\r\n]+/).map(line => `<p>${line}</p>`).join('');

            // Add to zip
            const new_html_code = new XMLSerializer().serializeToString(doc);
            return new_html_code;
        }
    }

    async function saveEpub(epub, filename, callback=function() {}) {
        await epubHooks(epub);
        const blob = await epub.generate('blob');
        const url = URL.createObjectURL(blob);
        dl_browser(url, filename);
        setTimeout(() => {
            URL.revokeObjectURL(url);
            callback();
        });
    }

    function htmlEncode(text, encodes = '<>\'";&#') {
        return Array.from(text).map(char => !encodes || encodes.includes(char) ? `&#${char.charCodeAt(0)};` : char).join('');
    }

    // Pixiv's js hooked original EventTarget.prototype.addEventListener, using this function to bypass
    function $AEL(elm, ...args) {
        if (!$AEL.addEventListener) {
            const ifr = $$CrE({
                tagName: 'iframe',
                styles: {
                    border: 'none',
                    padding: 'none',
                    width: '0',
                    height: '0',
                    'z-index': '-9999999',
                },
                props: {
                    'srcdoc': '<html></html>'
                }
            });
            document.body.appendChild(ifr);
            $AEL.addEventListener = ifr.contentWindow.EventTarget.prototype.addEventListener;
        }
        return $AEL.addEventListener.apply(elm, args);
    }
})();