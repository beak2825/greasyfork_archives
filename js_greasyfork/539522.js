// ==UserScript==
// @name         Bilibili Magic Market Helper
// @namespace    https://yinr.cc/
// @version      0.3.1
// @description  哔哩哔哩市集小助手
// @author       Yinr
// @license      MIT
// @icon         https://mall.bilibili.com/favicon.ico
// @match        https://mall.bilibili.com/neul-next/index.html*
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @resource     css https://storage.lolicon.in/userscript/BilibiliMagicMarketHelper/style.css
// @run-at       ducment-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/539522/Bilibili%20Magic%20Market%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539522/Bilibili%20Magic%20Market%20Helper.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    const helperLog = {
        LOG_PREFIX: "[BMMH]",
        log(...msg) { console.log(helperLog.LOG_PREFIX, ...msg) },
        warn(...msg) { console.warn(helperLog.LOG_PREFIX, ...msg) },
        error(...msg) { console.error(helperLog.LOG_PREFIX, ...msg) },
    }

    const CFG_INFO = {
        'addStyle': { key: 'ADD_STYLE', default: false },
        'searchText': { key: 'SEARCH_TEXT', defalut: '' },
    }
    const cfg = new YinrLibs.Config(CFG_INFO)
    const addBasicStyle = () => {
        GM_addStyle(GM_getResourceText("css"));
        helperLog.log('Style Added.')
    }
    if (cfg.getValue(CFG_INFO.addStyle.key)) {
        addBasicStyle()
    }

    // MAIN

    const currentUrl = new URL(document.location.href)

    if (currentUrl.searchParams.get('page') == 'magic-market_index') {
        const HEADER_SELECTOR = 'body > div.page-index div.scroll-view-header div.bili-header > div.bili-header-middle > div'
        YinrLibs.launchObserver({
            parentNode: document,
            selector: HEADER_SELECTOR,
            successCallback: () => {
                const headerEl = document.querySelector(HEADER_SELECTOR)
                const searchIcon = document.createElement('div')
                searchIcon.innerText = "🔍"
                searchIcon.style.position = 'fixed'
                searchIcon.style.right = 0
                searchIcon.style.left = 0
                headerEl.append(searchIcon)
            },
        })
    }

    const GOODS_ITEM_SELECTOR = 'section.goods-list div.bili-waterfall-item'
    const SEARCH_HIDE_SELECTOR = 'BMMH-search-hide'
    GM_addStyle(`.${SEARCH_HIDE_SELECTOR} { display: none !important; }`)

    const filterReset = () => {
        const items = document.querySelectorAll(GOODS_ITEM_SELECTOR)
        items.forEach(el => el.classList.remove(SEARCH_HIDE_SELECTOR))
    }

    /** @param {string} searchText */
    const filterByTitle = (searchText = cfg.getValue(CFG_INFO.searchText.key)) => {
        if (!searchText) {
            filterReset()
            return
        }

        GM_setValue('searchText', searchText)
        const items = document.querySelectorAll(GOODS_ITEM_SELECTOR)
        Array.from(items).filter(el => {
            const name = el.querySelector('.goods-name').textContent
            return !(name.includes(searchText) || false)
        }).forEach(el => {
            el.classList.add(SEARCH_HIDE_SELECTOR)
        });
    }

    GM_registerMenuCommand('搜索商品名称', () => {
        const searchText = prompt('请输入要搜索的文字，留空则清空搜索', GM_getValue('searchText', ''))
        filterByTitle(searchText)
    })

    const openWaterfallItem = (itemId) => {
        /** 商品物品详情
         * @typedef {object} GoodsItemDetail
         * @prop {number} blindBoxId
         * @prop {number} itemsId
         * @prop {number} skuId
         * @prop {string} name
         * @prop {string} img //i0.hdslb.com/bfs/mall/mall/c9/a6/c9a617102c26536125dbf1bd3d1967e9.png
         * @prop {number} marketPrice
         * @prop {number} type 1
         * @prop {boolean} isHidden false
         */
        /** 商品信息
         * @typedef {object} Goods
         * @prop {number} c2cItemsId 商品 ID，用于链接
         * @prop {number} type 1
         * @prop {string} c2cItemsName 商品名称
         * @prop {GoodsItemDetail[]} detailDtoList 包含物品详情
         * @prop {number} totalItemsCount 包含物品个数
         * @prop {number} price 卖家定价，单位：分
         * @prop {string} showPrice 卖家定价，文本
         * @prop {string} showMarketPrice 市场价，文本
         * @prop {string} uid 卖家 uid，中间打码
         * @prop {number} paymentTime
         * @prop {boolean} isMyPublish 是否本人发布
         * @prop {string} uname 卖家用户名，中间打码
         * @prop {string|null} uspaceJumpUrl 卖家空间地址？ null
         * @prop {string} uface 卖家头像链接
         */
        /** 商品网页参数
         * @typedef {object} GoodsProps
         * @prop {Goods} goods
         * @prop {number} role 1
         * @prop {boolean} shouldMarkFudaiItem 福袋？
         * @prop {string} from
         * @prop {string} logClickEventId
         * @prop {string} logShowEventId
         * @prop {string} logGoodsType
         */
        /** @type {HTMLDivElement} */
        const el = document.querySelector(`#bili-waterfall-item-${itemId} .goods`)
        /** @type {GoodsProps} */
        const props = el.__vue__.$props
        const c2cItemId = props.goods.c2cItemsId
        openGoods(c2cItemId)
    }
    /** @param {string|number} c2cItemsId */
    const openGoods = (c2cItemsId) => {
        const url = new URL('https://mall.bilibili.com/neul-next/index.html')
        url.searchParams.append('page', 'magic-market_detail')
        url.searchParams.append('noTitleBar', '1')
        url.searchParams.append('itemsId', `${c2cItemsId}`)
        url.searchParams.append('from', 'market_index')
        window.open(url, '_blank')
    }
    document.addEventListener('mousedown', (e) => {
        if (e.button === 1) {
            /** @type {HTMLDivElement} */
            const itemEl = e.target.closest('[id^=bili-waterfall-item-]')
            if (itemEl) {
                e.preventDefault()
                const itemId = itemEl.id.replace('bili-waterfall-item-', '')
                openWaterfallItem(itemId)
            }
        }
    })

    GM_registerMenuCommand('打开集市主页', () => {
        window.open('https://mall.bilibili.com/neul-next/index.html?page=magic-market_index')
    })

    const getInfo = () => {
        const search = new URLSearchParams(document.location.search)
        if (search.get("page") === "magic-market_detail") {
            const goodsName = document.querySelector(".goods-name")?.textContent.trim()
            const id = search.get('itemsId')
            const countdown = document.querySelector(".countdown")?.textContent.trim()
            const sellPrice = document.querySelector(".sell-price")?.textContent.trim()
            const originPrice = document.querySelector(".origin-price")?.textContent.trim()
            const imgSrc = document.querySelector(".goods-images img")?.src
            const preSell = !!document.querySelector('.sku-type').textContent.match(/预售/)
            return { goodsName, id, countdown, sellPrice, originPrice, imgSrc, preSell }
        } else return null
    }
    const copyInfo = () => {
        const fetchItemInfo = async (c2cItemsId) => 
            await fetch(`https://mall.bilibili.com/mall-magic-c/internet/c2c/items/queryC2cItemsDetail?c2cItemsId=${c2cItemsId}`, {
                // "headers": { "accept": "application/json, text/plain, */*", },
                "referrer": `https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&noTitleBar=1&itemsId=${c2cItemsId}&from=market_index`,
            }).then(res => res.json()).then(res => res.data);
        
        const url = document.location.href
        let md = ""
        const itemInfo = getInfo()
        if (itemInfo) {
            md = [
                '---',
                `**${itemInfo.goodsName}**`,
                itemInfo.id ? `[${itemInfo.id}](${itemInfo.url})` : `<${itemInfo.url}>`,
                `${itemInfo.sellPrice}（~~${itemInfo.originPrice}~~）${itemInfo.preSell ? ' 预售' : ''}`,
                `![${itemInfo.goodsName}](${itemInfo.imgSrc})`,
                '',
            ].join('\n')
        } else {
            md = `<${url}>`
        }
        GM_setClipboard(md, 'text', () => helperLog.log('\n' + md))
    }
    GM_registerMenuCommand('复制页面信息', () => {
        copyInfo()
    })
    const addCopyInfoIcon = () => {
        const page = document.querySelector('.page-detail')
        const icon = document.createElement('div')
        icon.classList.add('copy-info')
        icon.style.position = 'relative'
        icon.style.left = '530px'
        icon.style.bottom = '65px'
        icon.style.width = '40px'
        icon.style.height = '40px'
        icon.style.zIndex = '100px'
        icon.style.cursor = 'pointer'
        const img = document.createElement('img')
        img.src = 'https://img.icons8.com/?size=40&id=79020&format=png&color=00000099'
        icon.append(img)
        icon.addEventListener('click', copyInfo)
        page.append(icon)
    }
    const updateTitle = () => {
        if (document.title) return
        const search = new URLSearchParams(document.location.search)
        switch (search.get("page")) {
            case "magic-market_index":
                document.title = "哔哩哔哩市集"
                break
            case "magic-market_detail":
                const itemInfo = getInfo()
                if (itemInfo) {
                    document.title = `${itemInfo.preSell ? '[预售] ' : ''}${itemInfo.goodsName} ${itemInfo.sellPrice} (${itemInfo.originPrice})`
                    console.log('Title Updated!')
                }
                break
        }

    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: '.page-index',
        successCallback() {
            updateTitle()
        },
        stopWhenSuccess: true,
    })
    YinrLibs.launchObserver({
        parentNode: document,
        selector: '.page-detail .sku-type',
        successCallback() {
            const icon = document.querySelector('.copy-info')
            if (!icon) {
                const search = new URLSearchParams(document.location.search)
                if (search.get('page') === 'magic-market_detail') {
                    addCopyInfoIcon()
                    updateTitle()
                }
            }
        },
        stopWhenSuccess: false,
    })

    const getMyInfo = async () => {
        const referrer = 'https://mall.bilibili.com/neul-next/index.html?page=magic-market_mine&noTitleBar=1&tab=2&from=market_index'
        const userInfo = await fetch(
            "https://mall.bilibili.com/mall-magic-c/internet/c2c/items/queryUserInfo",
            { referrer }
        ).then(res => res.json())
        const purchased = await fetch(
            "https://mall.bilibili.com/mall-magic-c/internet/c2c/items/pageQueryMyPurchasedItems?pageSize=20&pageNo=1",
            { referrer }
        ).then(res => res.json())
        const myInfo = { userInfo: userInfo.data, purchased: purchased.data }

        const jsonString = JSON.stringify(myInfo, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        GM_download({
            url,
            name: 'bilibiliMallInfo.json',
            onload() {
                URL.revokeObjectURL(url)
                console.log('使用 GM_download 下载完成');
            },
            onerror(error) {
                console.error('GM_download 失败:', error);
            }
        });
    }
    GM_registerMenuCommand('下载个人信息', () => {
        getMyInfo()
    })
    const addMyInfoIcon = () => {
        const page = document.querySelector('.page-mine')
        const icon = document.createElement('div')
        icon.classList.add('get-my-info')
        icon.style.position = 'relative'
        icon.style.left = '530px'
        icon.style.bottom = '51px'
        icon.style.width = '40px'
        icon.style.height = '40px'
        icon.style.zIndex = '100px'
        icon.style.cursor = 'pointer'
        const img = document.createElement('img')
        img.src = 'https://img.icons8.com/?size=40&id=79020&format=png&color=00000099'
        icon.append(img)
        icon.addEventListener('click', getMyInfo)
        page.append(icon)
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: '.page-mine',
        successCallback() {
            const icon = document.querySelector('.get-my-info')
            if (!icon) {
                const search = new URLSearchParams(document.location.search)
                if (search.get('page') === 'magic-market_mine') {
                    addMyInfoIcon()
                }
            }
        },
        stopWhenSuccess: false,
    })


    unsafeWindow.BMMH = {
        addBasicStyle,
        filterByTitle,
        filterReset,
        openWaterfallItem,
        openGoods,
        copyInfo,
        getMyInfo,
    }
})();