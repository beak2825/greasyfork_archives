// ==UserScript==
// @name         番茄小说阅读助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动滚动页面 + 快捷键翻页
// @author       return null;
// @match        https://fanqienovel.com/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanqienovel.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472045/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472045/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const utils = {
        /**
         * toast，默认 1.5s 后关闭，若传入 duration，则按照 duration 的值关闭，若 duration 为 0，则不关闭，返回一个对象，其中有一个 close 方法，可以手动关闭
         * @param {*} msg
         * @param {*} duration
         */
        toast: (msg, duration = 1500) => {
            // 优先把之前的 toast 关闭
            const lastToast = document.querySelector('.fanqie-zhushou-toast');
            if (lastToast) {
                lastToast.remove();
            }

            const toast = document.createElement('div');
            toast.className = 'fanqie-zhushou-toast';
            toast.innerHTML = msg;
            document.body.appendChild(toast);

            if (duration) {
                setTimeout(() => {
                    toast.remove();
                }, duration);
            }

            return {
                close: () => {
                    toast.remove();
                }
            }
        },
        initConfig: () => {
            const defaultConfig = {
                version: '20230730002',
                /**
                 * 阅读器宽度，支持百分比和 px
                 */
                width: '80%',
                /**
                 * 快捷键
                 */
                hotKeys: {
                    /**
                     * 上一章快捷键
                     */
                    lastChapter: 'ArrowLeft',
                    /**
                     * 下一章快捷键
                     */
                    nextChapter: 'ArrowRight',
                    /**
                     * 关闭自动滚动快捷键
                     */
                    closeAutoScroll: 'Escape'
                },
                /**
                 * 自动滚动速度，单位毫秒
                 */
                autoScrollSpeed: 50
            }

            // 优先从 localStorage 中获取配置，没有就用默认配置，判断版本号是否一致，不一致就用默认配置
            const config = JSON.parse(localStorage.getItem('fanqie-zhushou-config')) || defaultConfig;
            if (config.version !== defaultConfig.version) {
                localStorage.setItem('fanqie-zhushou-config', JSON.stringify(defaultConfig));
                return defaultConfig;
            }

            localStorage.setItem('fanqie-zhushou-config', JSON.stringify(config));
            return config;
        },
        refreshConfig: (config) => {
            localStorage.setItem('fanqie-zhushou-config', JSON.stringify(config));
        },
        addToolbarBtn: ({
            title,
            svg,
            onclick
        }) => {
            const toolbar = document.querySelector('#app .reader-toolbar > div')
            const autoScrollBtn = document.createElement('div');
            autoScrollBtn.className = 'reader-toolbar-item';
            autoScrollBtn.title = title;
            autoScrollBtn.innerHTML = `
                ${svg || ''}
                <div>${title}</div>
            `

            if (onclick) {
                autoScrollBtn.onclick = onclick
            }

            toolbar.appendChild(autoScrollBtn);
        }
    }

    // 优先从 localStorage 中获取配置，没有就用默认配置
    const config = utils.initConfig()
    const titleNavWidth = '300px'

    const style = document.createElement('style');

    const pageWidthStyle = `
        #app div.muye-reader div.muye-reader-inner {
            width: calc(${config.width} - ${titleNavWidth});
            max-width: calc(${config.width} - ${titleNavWidth});
        }

        .muye-reader-nav {
            width: calc(${config.width} - 15px - ${titleNavWidth});
            max-width: calc(${config.width} - 15px - ${titleNavWidth});
        }
    `;

    style.innerHTML = `
        ${config.width ? pageWidthStyle : ''}

        .reader-toolbar {
            left: 85%;
        }

        .reader-toolbar > div > div {
            cursor: pointer;
        }

        .reader-toolbar-item.reader-toolbar-item-download {
            display: none;
        }

        .fanqie-zhushou-toast {
            position: fixed;
            top: 35px;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            border-radius: 5px;
            z-index: 999;
        }

        .line-space {
            height: 52px;
            width: 100%;
        }
        
        .auto-header-title {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            font-size: 16px;
            width: 295px;
            left: 5px;
            font-weight: bold;
        }

        .auto-header-title h1 {
            font-size: unset;
            font-weight: unset;
            margin: unset;
            padding-bottom: 5px;
        }
    `;
    document.head.appendChild(style);

    const lastChapter = () => {
        const btn = document.querySelector('#app .chapter-btn.last');
        if (btn) {
            btn.click();
        }
    }

    const nextChapter = () => {
        const btn = document.querySelector('#app .chapter-btn.next');
        if (btn) {
            btn.click();
        }
    }

    const autoScroll = () => {
        const autoScrollBtn = document.querySelector('#app .reader-toolbar-item[title="滚动"]');
        if (autoScrollBtn) {
            autoScrollBtn.setAttribute('status', 'on');
            clearInterval(window.autoScrollTimer);
            window.autoScrollTimer = setInterval(() => {
                const reader = document.querySelector('#app .muye-reader');

                reader.scrollBy(0, 1)
                // 根据页面高度计算进度，保留两位小数
                const progress = (reader.scrollTop / (reader.scrollHeight - reader.offsetHeight) * 100).toFixed(1);
                utils.toast(`已开启自动滚动，按 Esc 可退出，当前进度：${progress}%，当前速度：${config.autoScrollSpeed}`, 0);
            }, config.autoScrollSpeed);
        }
    }

    // 监听键盘方向键
    document.addEventListener('keydown', (e) => {
        console.log('keydown', e);
        if (e.key === config.hotKeys.lastChapter) {
            lastChapter();
        } else if (e.key === config.hotKeys.nextChapter) {
            nextChapter();
        }

        const autoScrollBtn = document.querySelector('#app .reader-toolbar-item[title="滚动"]');
        if (autoScrollBtn) {

            // esc 主动关闭自动滚动
            if (e.key === config.hotKeys.closeAutoScroll) {
                const autoScrollBtn = document.querySelector('#app .reader-toolbar-item[title="滚动"]');
                autoScrollBtn.setAttribute('status', 'off');
                clearInterval(window.autoScrollTimer);
                utils.toast('已关闭自动滚动');
            }

            // 如果当前在自动滚动时，按下 + 或者 - 可以调整滚动速度
            if (e.key === '+' || e.key === '=') {
                const status = autoScrollBtn.getAttribute('status');
                if (status === 'on') {
                    config.autoScrollSpeed -= 5;
                    autoScroll()
                    utils.refreshConfig(config);
                }
            } else if (e.key === '-') {
                const status = autoScrollBtn.getAttribute('status');
                if (status === 'on') {
                    config.autoScrollSpeed += 5;
                    autoScroll()
                    utils.refreshConfig(config);
                }
            }
        }
    });

    utils.addToolbarBtn({
        title: '滚动',
        svg: `
                <svg t="1690709388609" class="muyeicon-icon muyeicon-icon-scan reader-toolbar-item-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2017" width="200" height="200">
                    <path d="M256.2 736.4h320c88.2 0 160-71.8 160-160v-320c0-88.2-71.8-160-160-160h-320c-88.2 0-160 71.8-160 160v320c0 88.2 71.8 160 160 160z m-96-480c0-52.9 43.1-96 96-96h320c52.9 0 96 43.1 96 96v320c0 52.9-43.1 96-96 96h-320c-52.9 0-96-43.1-96-96v-320zM768.2 815.6H521.5c-12.3-28.3-40.5-48-73.3-48s-61 19.8-73.3 48H128.2c-17.7 0-32 14.3-32 32s14.3 32 32 32h246.7c12.3 28.2 40.5 48 73.3 48s61-19.7 73.3-48h246.7c17.7 0 32-14.3 32-32s-14.3-32-32-32zM879.8 375.1V128.4c0-17.7-14.3-32-32-32s-32 14.3-32 32v246.7c-28.2 12.3-48 40.5-48 73.3s19.7 61 48 73.3v246.7c0 17.7 14.3 32 32 32s32-14.3 32-32V521.7c28.3-12.3 48-40.5 48-73.3s-19.8-61-48-73.3z" p-id="2018">
                    </path>
                </svg>
        `,
        onclick: (event) => {
            const autoScrollBtn = document.querySelector('#app .reader-toolbar-item[title="滚动"]');
            const status = autoScrollBtn.getAttribute('status');
            if (status === 'on') {
                autoScrollBtn.setAttribute('status', 'off');
                clearInterval(window.autoScrollTimer);
                utils.toast('已关闭自动滚动');
            } else {
                autoScroll()
            }
        }
    })

    const analysisChapterData = (html) => {
        if (!html || html.indexOf('window.__INITIAL_STATE__=') === -1) {
            return null;
        }

        const startIndex = html.indexOf('window.__INITIAL_STATE__=')
        const endIndex = html.indexOf('</script>', startIndex)
        let jsonStr = html.substring(startIndex + 25, endIndex - 1)
        // 找到结尾的 ;
        const lastSemicolonIndex = jsonStr.lastIndexOf(';')
        jsonStr = jsonStr.substring(0, lastSemicolonIndex)
        const data = JSON.parse(jsonStr)
        console.log('analysisChapterData', data)
        const result = data.reader.chapterData;

        const contentHtmlStartIndex = html.indexOf('<div class="muye-reader-box-header">');
        const contentHtmlEndIndex = html.indexOf('<div class="muye-reader-btns">', contentHtmlStartIndex);
        const $content_html = html.substring(contentHtmlStartIndex, contentHtmlEndIndex);

        result.$content_html = $content_html

        return result
    };

    window.$fna = {
        next_item_id: null,
        item_loading: false,
        item_content_caches: {}
    }

    window.onload = () => {
        window.$fna.next_item_id = window.__INITIAL_STATE__.reader.chapterData.nextItemId;
        window.$fna.item_loading = false
        console.log('window.$fna.next_item_id', window.$fna.next_item_id)
    }

    const preloadNextChapter = async ({ itemId, skipCache }) => {
        if (window.$fna.item_content_caches[itemId] && skipCache !== true) {
            return window.$fna.item_content_caches[itemId]
        }

        const response = await fetch(`https://fanqienovel.com/reader/${itemId}?enter_from=reader`, {
            "method": "GET",
        });
        const html = await response.text()

        const chapterData = analysisChapterData(html);
        window.$fna.item_loading = false
        window.$fna.item_content_caches[itemId] = chapterData

        return chapterData
    }

    const loadNextChapter = async ({ itemId, skipCache }) => {
        if (window.$fna.item_loading === true) {
            return
        }

        if (window.$fna.item_content_caches[itemId] && skipCache !== true) {
            return window.$fna.item_content_caches[itemId]
        }

        window.$fna.item_loading = true

        const chapterData = await preloadNextChapter({ itemId, skipCache })
        preloadNextChapter({ itemId: chapterData.nextItemId, skipCache: true })

        window.$fna.item_loading = false

        return chapterData
    }

    const reader = document.querySelector('#app .muye-reader');
    reader.addEventListener('scroll', (event) => {
        console.log('scroll', event);

        document.querySelector('.muye-reader-btns').style.display = 'none';

        const scrollTop = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        const offsetHeight = event.target.offsetHeight;
        const progress = (scrollTop / (scrollHeight - offsetHeight) * 100).toFixed(4);
        console.log('progress', progress)
        if (progress >= 90) {
            loadNextChapter({ itemId: window.$fna.next_item_id })
                .then(({ $content_html, nextItemId }) => {
                    const readerBoxElement = document.querySelector('#app .muye-reader .muye-reader-inner .muye-reader-box');
                    readerBoxElement.innerHTML = readerBoxElement.innerHTML + '<div class="line-space"></div>' + $content_html;
                    window.$fna.next_item_id = nextItemId;

                    const titles = document.querySelectorAll('h1.muye-reader-title')
                    // 获取所有标题，赋值到要给字符串数组中
                    const titleArr = []
                    titles.forEach((title) => {
                        titleArr.push(`<h1>${title.innerText}</h1>`)
                    })

                    // 在 #app div 中插入一个 auto-header-title 的 div，用于存放标题
                    // 如果存在就先删掉
                    let autoHeaderTitleElement = document.querySelector('#app div.auto-header-title')
                    autoHeaderTitleElement && autoHeaderTitleElement.remove()

                    autoHeaderTitleElement = document.createElement('div')
                    autoHeaderTitleElement.className = 'auto-header-title'
                    autoHeaderTitleElement.innerHTML = titleArr.join('')

                    document.querySelector('#app div').appendChild(autoHeaderTitleElement)

                    document.querySelectorAll('#app div.auto-header-title h1').forEach((item, index) => {
                        item.onclick = () => {
                            console.log('click', index)
                            // 滚动到对应的标题，稍微往上偏移一点，平滑滚动
                            const titles = document.querySelectorAll('h1.muye-reader-title')
                            titles[index].scrollIntoView({
                                behavior: 'smooth'
                            })
                        }
                    })
                })
        }
    })

})();
