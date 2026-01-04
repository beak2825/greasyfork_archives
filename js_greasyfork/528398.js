// ==UserScript==
// @name Buyee link checker
// @description Displays already visited auction links in red in Buyee
// @namespace sammniisan
// @author samniisan
//
// @version 1.0.6
// @license ISC
//
// @match https://*.buyee.jp/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/528398/Buyee%20link%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/528398/Buyee%20link%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = true

    const log = (msg, cat) => {
        if (!debug) return
        console.log(`[${cat || 'debug'}]: ${msg}`)
    }

    log('Script initiated')

    const url = window.location.href

    const setMapping = () => {
        const urlMapping = {
            YA_LIST: ['YA', 'LIST'],
            YA_SEARCH: ['YA', 'SEARCH'],
            YA_SELLER: ['YA', 'SELLER'],
            YA_ITEM: ['YA', 'ITEM'],
            ME_LIST: ['ME', 'LIST'],
            ME_SEARCH: ['ME', 'SEARCH'],
            ME_SELLER: ['ME', 'SELLER'],
            ME_ITEM: ['ME', '_ITEM'],
            FM_SEARCH: ['FM', 'SEARCH'],
            FM_ITEM: ['FM', 'ITEM']
        }

        // YA

        if (url.startsWith('https://buyee.jp/item/search/category/')) {
            return urlMapping.YA_LIST
        }

        if (url.startsWith('https://buyee.jp/item/search/query/')) {
            return urlMapping.YA_SEARCH
        }

        if (url.startsWith('https://buyee.jp/item/search/seller/')) {
            return urlMapping.YA_SELLER
        }

        if (url.startsWith('https://buyee.jp/item/jdirectitems/auction/')) {
            return urlMapping.YA_ITEM
        }

        // Mercari

        if (url.startsWith('https://asf.buyee.jp/mercari?category_id')) {
            return urlMapping.ME_LIST
        }

        if (url.startsWith('https://asf.buyee.jp/mercari?keyword')) {
            return urlMapping.ME_SEARCH
        }

        if (url.startsWith('https://asf.buyee.jp/mercari?seller')) {
            return urlMapping.ME_SELLER
        }

        if (url.startsWith('https://buyee.jp/mercari/item/')) {
            return urlMapping.ME_ITEM
        }

        // Fleamarket

        if (url.startsWith('https://buyee.jp/paypayfleamarket/search')) {
            return urlMapping.FM_SEARCH
        }

        if (url.startsWith('https://buyee.jp/paypayfleamarket/item/')) {
            return urlMapping.FM_ITEM
        }

        return []
    }

    const [website, pageType] = setMapping()

    log(`Website: ${website}`)
    log(`Page type: ${pageType}`)

    if (!website) {
        return
    }

    const [lsKey, qs] = {
        YA: ['visitedAuctions', '.auctionSearchResult .itemCard__itemName a'],
        ME: ['visitedAuctionsMe', 'a[target="_top"]'],
        FM: ['visitedAuctionsFm', 'ul.item-lists li.list a']
    }[website]

    const getItemId = (urlToMatch = '') =>
        (urlToMatch || url).split('/').reverse()[0].split('?')[0].split('#')[0]

    const getLs = () => JSON.parse(localStorage.getItem(lsKey) || '[]')

    const getItemLinksWithQs = () => document.querySelectorAll(qs)

    const getEl = (linkEl, itemId) => {
        if (website === 'ME') {
            return document.querySelector(`a[href^="https://buyee.jp/mercari/item/${itemId}"]`).querySelector('span[class^="simple_name"]')
        }

        if (website === 'FM') {
            return document.querySelector(`a[href^="/paypayfleamarket/item/${itemId}"]`).querySelector('h2.name')
        }

        return linkEl
    }

    const pushToLs = (keyId) => {
        const lsItems = getLs()

        if (!lsItems.includes(keyId)) {
            lsItems.push(keyId)
            localStorage.setItem(lsKey, JSON.stringify(lsItems))
            log(`Item ${keyId} added to list`)
        }
    }

    if (['LIST', 'SEARCH', 'SELLER'].includes(pageType)) {
        const lsItems = getLs()
        const MAX_ATTEMPTS = 10
        let attempts = 0

        const processLinks = () => {
            const links = getItemLinksWithQs()

            if (links.length === 0 && attempts < MAX_ATTEMPTS) {
                attempts++
                setTimeout(processLinks, 1000)
                return
            }

            links.forEach(link => {
                const itemId = getItemId(link.href)

                if (!itemId) return

                if (lsItems.includes(itemId)) {
                    setTimeout(() => {
                        const el = getEl(link, itemId)

                        el.style.color = 'red'
                        el.style['font-weight'] = 'bold'
                    }, website === 'ME' ? 1000 : 0)
                } else {
                    setTimeout(() => {
                        if (website === 'ME') {
                            ['click', 'auxclick'].forEach(evt => {
                                document.querySelector(`a[href^="https://buyee.jp/mercari/item/${itemId}"]`).addEventListener(evt, () => pushToLs(itemId))
                            })
                        }
                    }, website === 'ME' ? 1000 : 0)
                }
            })
        }

        processLinks()
    }

    if (pageType === 'ITEM') {
        const itemId = getItemId()

        if (itemId) {
            pushToLs(itemId)
        }
    }
})();