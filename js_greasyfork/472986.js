// ==UserScript==
// @name           Slash To Search
// @name:zh-CN     斜杠搜索 - Slash To Search
// @namespace      http://zhangmaimai.com/
// @version        0.2
// @description    Type Slash ('/') to focus on search input, customized for some websites only.
// @description:zh-CN 使用 斜杠 ('/')  聚焦输入框，仅针对部分网页定制。
// @author         Max
// @license        MIT
// @match          https://www.v2ex.com/*
// @match          https://stackoverflow.com/*
// @match          https://*.bilibili.com/*
// @exclude        https://message.bilibili.com/pages/nav/header_sync
// @match          https://www.douban.com/*
// @match          https://book.douban.com/*
// @match          https://*.wikipedia.org/*
// @match          https://greasyfork.org/*
// @exclude        https://greasyfork.org/*/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant          none
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/472986/Slash%20To%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/472986/Slash%20To%20Search.meta.js
// ==/UserScript==
// @ts-check

const { hostname } = window.location
const secondLevel = hostname.split('.').slice(1).join('.')

/** @typedef {Record<string, string>} StringMap */

/** 
 * Map series of URLs with same selector    
 * @param {string[]} urls
 * @param {string} selector 
 */
const urlToSameSelector = (urls, selector) => Object.fromEntries(urls.map(url => [url, selector]))

/** 
 * Second level domain to a function to get selector by hostname
 * @type {Record<string, ()=>StringMap>} 
 * */
const getSelectorMap = {
    "bilibili.com": () => Object.assign({ "manga.bilibili.com": ".search-input" },
        urlToSameSelector([
            'bilibili.com',
            'www.bilibili.com',
            't.bilibili.com',
            'space.bilibili.com',
        ], '.nav-search-input')
    ),
    "v2ex.com": () => ({ 'www.v2ex.com': '#search', }),
    "stackoverflow.com": () => ({ 'stackoverflow.com': '.s-input' }),
    "douban.com": () => ({
        'book.douban.com': '#inp-query',
        'www.douban.com': '.inp input'
    }),
    "wikipedia.org": () => (urlToSameSelector([
        'zh.wikipedia.org',
        'en.wikipedia.org'
    ], '.cdx-text-input__input',
    )),
    "greasyfork.org": () => ({
        "greasyfork.org": ".home-search input"
    })
}

/**
 * @param {string} selector 
 * @param {HTMLElement | Document | Element} root 
 * @param {number} timeout 
 * @returns {Promise<Element>}
 */
const isElementLoaded = async (selector, root = document, timeout = 1e4) => {
    const start = Date.now()
    while (root.querySelector(selector) === null) {
        if (Date.now() - start > timeout) throw new Error(`Timeout: ${timeout}ms exceeded`)
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return /** @type {HTMLElement} */(root.querySelector(selector))
}

/** @param {HTMLInputElement} search */
const addSlashEvent = (search) => {
    const exceptActiveElement = ['INPUT', 'TEXTAREA']
    /** @type {(event: KeyboardEvent) => void } */
    const listener = (e) => {
        if (e.key !== '/' || exceptActiveElement.includes(document?.activeElement?.tagName || "")) return
        e.preventDefault()
        search.focus()
    }
    document.addEventListener('keydown', listener)
}


const main = async () => {
    const getSelector = () => {
        if (hostname in getSelectorMap) return getSelectorMap[hostname]()[hostname]
        if (!(secondLevel in getSelectorMap)) return
        const selectorMap = getSelectorMap[secondLevel]()
        return hostname in selectorMap ? selectorMap[hostname] : selectorMap['*']
    }
    const selector = getSelector()
    if (!selector) console.error(`No selector was found for url origin, downgrading to match <input> element with class contains "search"`)
    const searchElement = /** @type {HTMLDivElement?} */ (selector
        ? await isElementLoaded(selector)
        : await isElementLoaded('input[class*="search"]')
    )
    if (!searchElement || !(searchElement instanceof HTMLInputElement)) {
        throw Error(`Cannot detect search input element with selector ${selector}`)
    }
    addSlashEvent(searchElement)
}

main()
