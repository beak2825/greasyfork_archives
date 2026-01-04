// ==UserScript==
// @name         NMPA Gather
// @namespace    https://yinr.cc/
// @version      0.19.1
// @description  下载国家药品监督管理局数据
// @author       Yinr
// @license      MIT
// @icon         https://www.nmpa.gov.cn/wbppimages/favicon.ico
// @match        https://www.nmpa.gov.cn/datasearch/search-result.html*
// @match        https://www.nmpa.gov.cn/datasearch/search-info.html*
// @require      https://greasyfork.org/scripts/458769-yinr-libs/code/Yinr-libs.js?version=1147575
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459468/NMPA%20Gather.user.js
// @updateURL https://update.greasyfork.org/scripts/459468/NMPA%20Gather.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEFAULT_CONFIG = {
        enableInjection: { key: 'ENABLE_INJECTION', default: true },
        autoDownload: { key: 'AUTO_DOWNLOAD', default: true },
        autoCloseAfterDownload: { key: 'AUTO_CLOSE_AFTER_DOWNLOAD', default: true },
        verboseNotification: { key: 'VERBOSE_NOTIFICATION', default: false },
        finishNotification: { key: 'FINISH_NOTIFICATION', default: true },
        defaultTimeout: { key: 'DEFAULT_TIMEOUT', default: 10 * 1000 },
        maxOpenedDetailTabs: { key: 'MAX_OPENED_DETAIL_TABS', default: 5 },
    }

    const SHORT_WAIT = 500 // time(ms) for short wait. eg page wait.

    const cfg = new YinrLibs.Config(DEFAULT_CONFIG)

    const pathname = document.location.pathname

    const showConfig = () => {
        let cfgUi = document.querySelector('div.nmpa-gather-cfg')
        if (cfgUi) {
            cfgUi.style.display = ''
        } else {
            cfgUi = document.createElement('div')
            cfgUi.classList.add('nmpa-gather-cfg')
            cfgUi.style.position = 'fixed'
            cfgUi.style.left = '0'
            cfgUi.style.top = '0'
            cfgUi.style.width = '100%'
            cfgUi.style.height = '100%'
            cfgUi.style.zIndex = 100
            cfgUi.style.backgroundColor = '#666a'
            cfgUi.style.textAlign = 'center'
            cfgUi.innerHTML = '<p>test</p>'
            document.body.appendChild(cfgUi)
            cfgUi.addEventListener('click', () => {cfgUi.style.display = 'none'})
        }
    }

    GM_registerMenuCommand('显示设置(WIP)', showConfig)

    /** Main */
    if (pathname.startsWith('/datasearch/search-result.html')) {
        let isInjected = false
        let openedDetailTabs = 0
        const injectGoInfoPage = () => {
            if (isInjected || !cfg.getValue(DEFAULT_CONFIG.enableInjection.key)) return
            const oldGoInfoPage = unsafeWindow.pajax.goInfoPage
            const newGoInfoPage = (a, b, c, d, e) => {
                if (a && b && !c && !d && !e) {
                    const nmpaId = Base64.encode('id=' + a + '&itemId=' + b)
                    const url = new URL('search-info.html?nmpa=' + nmpaId, document.location.href)
                    const tab = GM_openInTab(url.href, {
                        active: false,
                        loadInBackground: true,
                    })
                    tab.onclose = () => {
                        openedDetailTabs--
                        console.log(`tab of id '${a}' closed.`)
                    }
                } else {
                    oldGoInfoPage(a, b, c, d, e)
                }
            }
            unsafeWindow.pajax.goInfoPage = newGoInfoPage
            isInjected = true
            console.log('NMPA-Gather:: goInfoPage function has been injected.')
        }

        /** @param {HTMLTableRowElement} rowEl 结果列表行元素 */
        const openRow = (rowEl) => {
            const idx = rowEl.querySelector('td:nth-child(1)').textContent
            const name = rowEl.querySelector('td:nth-child(2)').textContent
            const btnEl = rowEl.querySelector('td:nth-child(5) > div > button')
            if (cfg.getValue(DEFAULT_CONFIG.verboseNotification.key)) {
                GM_notification({
                    text: `Open #${idx} - ${name}`,
                    title: 'NMPA Gather Open Detail',
                    silent: false,
                    timeout: cfg.getValue(DEFAULT_CONFIG.defaultTimeout.key),
                })
            }
            if (isInjected) {
                openedDetailTabs++
            }
            btnEl.click()
        }
        const openCurrentPageAndNext = async () => {
            const maxTabs = cfg.getValue(DEFAULT_CONFIG.maxOpenedDetailTabs.key)
            const nextBtn = document.querySelector('#home div.page.pc-max button.btn-next')
            const hasNext = !nextBtn.disabled
            const rowEls = document.querySelectorAll('#home div.search-result-table table tr.el-table__row')
            for (let i = 0; i < rowEls.length; i++) {
                if (isInjected) {
                    while (openedDetailTabs >= maxTabs) {
                        await YinrLibs.sleep(SHORT_WAIT)
                    }
                }
                openRow(rowEls[i])
                await YinrLibs.sleep(cfg.getValue(DEFAULT_CONFIG.defaultTimeout.key))
            }
            if (hasNext) {
                nextBtn.click()
            } else {
                if (isInjected) {
                    while (openedDetailTabs > 0) {
                        YinrLibs.sleep(SHORT_WAIT)
                    }
                }
                if (cfg.getValue(DEFAULT_CONFIG.finishNotification.key)) {
                    GM_notification({
                        text: 'Data gather finished.',
                        title: 'NMPA Gather Finished',
                        silent: false,
                    })
                }
            }
            return hasNext
        }
        const autoDetail = async () => {
            injectGoInfoPage()
            const firstIndexEl = document.querySelector('#home div.search-result-table tbody tr:nth-child(1) td:nth-child(1)')
            let lastPageFirstIndex = '0'
            let hasNext = true
            do {
                const currentPageFirstIndex = firstIndexEl.textContent
                if (currentPageFirstIndex !== lastPageFirstIndex) {
                    lastPageFirstIndex = currentPageFirstIndex
                    hasNext = await openCurrentPageAndNext()
                } else {
                    await YinrLibs.sleep(SHORT_WAIT)
                }
            } while (hasNext)
        }

        YinrLibs.launchObserver({
            parentNode: document.querySelector('#home div.search-result-table tbody'),
            selector: '#home div.search-result-table tbody tr td',
            successCallback() {
                GM_registerMenuCommand('开始自动下载', autoDetail)
                if (window.confirm('是否开始遍历下载当前列表')) {
                    autoDetail()
                }
            }
        })
    } else if (pathname.startsWith('/datasearch/search-info.html')) {
        let isAutoDownloadStarted = false

        const autodownload = async () => {
            const data = {
                url: document.location.href,
                nmpaId: new URLSearchParams(document.location.search).get('nmpa') || '',
                id: '',
                itemId: '',
                name: '',
            }

            try {
                /** @type {string[]} */
                const decodeData = Base64.decode(data.nmpaId).split('&')
                data.id = decodeData[0].split('=').pop()
                data.itemId = decodeData[1].split('=').pop()
            } catch (e) { console.warn(e) }

            const trEl = document.querySelectorAll('table tr')
            trEl.forEach((el, idx) => {
                const tdEl = el.getElementsByTagName('td')
                if (idx === 0) {
                    data.name = tdEl[1].textContent
                }
                data[tdEl[0].textContent] = tdEl[1].textContent
            })

            if (cfg.getValue(DEFAULT_CONFIG.autoDownload.key)) {
                const jsonUrl = YinrLibs.generateTextFile(JSON.stringify(data), 'application/json')
                if (cfg.getValue(DEFAULT_CONFIG.verboseNotification.key)) {
                    GM_notification({
                        text: `开始下载：${data.name}`,
                        title: 'NMPA Gather Download',
                        silent: false,
                        timeout: cfg.getValue(DEFAULT_CONFIG.defaultTimeout.key),
                    })
                }
                GM_download(jsonUrl, `nmpa-${data.name}-${data.id}-${data.itemId}.txt`)
                if (cfg.getValue(DEFAULT_CONFIG.autoCloseAfterDownload.key)) {
                    await YinrLibs.sleep(cfg.getValue(DEFAULT_CONFIG.defaultTimeout.key) / 2)
                    window.close()
                }
            } else {
                // TODO show data in popup box
                alert(JSON.stringify(data, null, 2))
            }
        }

        YinrLibs.launchObserver({
            parentNode: document,
            selector: 'table td:nth-child(2) > div > div > div > a',
            successCallback: () => {
                isAutoDownloadStarted = true
                autodownload()
            },
            stopWhenSuccess: true,
        })

        if (cfg.getValue(DEFAULT_CONFIG.autoDownload.key)) {
            await YinrLibs.sleep(cfg.getValue(DEFAULT_CONFIG.defaultTimeout.key) * 3)
            if (!isAutoDownloadStarted) {
                location.reload()
            }
        }
    }
})();