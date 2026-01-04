// ==UserScript==
// @name            Bundle Helper
// @version         2.0.4
// @author          Dillon Regimbal
// @namespace       https://dillonr.com
// @description     Highlights games you already own on Steam, on other sites. Modified from https://greasyfork.org/scripts/16105-bundle-helper/
// @match           *://cubicbundle.com/*
// @match           *://dailyindiegame.com/*
// @match           *://forums.steampowered.com/forums/showthread.php?*
// @match           *://www.gogobundle.com/latest/bundles/*
// @match           *://otakumaker.com/*
// @match           *://www.otakumaker.com/*
// @match           *://otakubundle.com/latest/bundles/*
// @match           *://steamcommunity.com/*/home*
// @match           *://steamcommunity.com/groups/*/announcements*
// @match           *://steamcompanion.com/gifts/*
// @match           *://steamground.com/*
// @match           *://store.steampowered.com/
// @match           *://store.steampowered.com/account/notinterested/*
// @match           *://store.steampowered.com/app/*
// @match           *://store.steampowered.com/widget/*
// @match           *://store.steampowered.com/search/*
// @match           *://whosgamingnow.net/*
// @match           *://www.bunchkeys.com/*
// @match           *://www.bundlekings.com/*
// @match           *://www.fanatical.com/*
// @match           *://www.dailyindiegame.com/*
// @match           *://www.gamebundle.com/*
// @match           *://www.hrkgame.com/*
// @match           *://www.humblebundle.com/*
// @match           *://www.indiegala.com/*
// @match           *://www.orlygift.com/*
// @match           *://www.reddit.com/r/*/comments/*
// @match           *://www.superduperbundle.com/*
// @match           *://www.sgtools.info/*
// @match           *://steamkeys.ovh/*
// @match           *://steamdb.info/*
// @match           *://itch.io/*
// @match           *://*.itch.io/*
// @run-at          document-start
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @connect         store.steampowered.com
// @connect         www.hrkgame.com
// @connect         www.fanatical.com
// @connect         www.steamgifts.com
// @icon            https://store.steampowered.com/favicon.ico
// @license         GPL-3.0-only
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437219/Bundle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/437219/Bundle%20Helper.meta.js
// ==/UserScript==

// Connect to store.steampowered.com to get owner info
// Connect to www.hrkgame.com and www.fanatical.com to get Steam ID of each products
// Connect to www.steamgifts.com to get bundle threads

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 2016-01-10
// https://greasyfork.org/scripts/16105-bundle-helper/

// Since 2020-05-21
// https://greasyfork.org/scripts/403878-bundle-helper
// https://github.com/dregimbal/UserScripts/blob/master/BundleHelper.user.js

(function () {
    'use strict'

    let write_console_messages = true

    let name_profile_json = 'bh_profile_json'
    let name_profile_time = 'bh_profile_time'
    let owned_item_class = 'bh_owned'
    let steam_profile = getSteamProfile()

    let default_steam_url_selector = 'a[href*=\'store.steampowered.com/\']'

    let divButton = document.createElement('div')

    function attachOnLoad(callback) {
        window.addEventListener('load', function (e) {
            callback()
        })
    }

    function attachOnReady(callback) {
        document.addEventListener('DOMContentLoaded', function (e) {
            callback()
        })
    }

    function writeConsoleMessage(message) {
        if (write_console_messages) {
            console.log(message)
        }
    }

    let timeoutList = []
    let intervalList = []

    function setTimeoutCustom(func, tm, params) {
        let id = setTimeout(func, tm, params)
        timeoutList.push(id)
        return id
    }

    function clearTimeoutAll() {
        for (let i = 0; i < timeoutList.length; i++) {
            clearTimeout(timeoutList[i])
        }
    }

    function clearIntervalAll() {
        for (let i = 0; i < intervalList.length; i++) {
            clearInterval(intervalList[i])
        }
    }

    function getUnixTimestamp() {
        return parseInt(Date.now() / 1000)
    }

    function isProfileCacheExpired() {
        let isExpired = false
        let timestampExpired = 15 * 60

        let profileTimestamp = GM_getValue(name_profile_time, 0)

        let profileTimestampDiff = getUnixTimestamp() - profileTimestamp
        if (profileTimestampDiff > timestampExpired) {
            isExpired = true
        }

        if (!isExpired) {
            writeConsoleMessage('Profile Cache Updated ' + profileTimestampDiff + 's ago')
        } else {
            writeConsoleMessage('Profile Cache Expired: ' + profileTimestampDiff)
        }

        return isExpired
    }

    function setProfileCache(json) {
        GM_setValue(name_profile_json, json)
        GM_setValue(name_profile_time, getUnixTimestamp())
    }

    function getSteamProfile() {
        if (isProfileCacheExpired()) {
            updateSteamProfileCache()
        }
        return GM_getValue(name_profile_json, 0)
    }

    function markOwned(query, getElementCallback, getProductIdCallback
        , classOwned, classNotInterested, classWished, getCountCallback) {
        if (!document.querySelector(query)) {
            // writeConsoleMessage("markOwned: empty");
            return
        }

        if (!getElementCallback) {
            getElementCallback = function (ele, type) {
                // type -> 1: Owned, 2: Ignored, 3: Wishlist
                return ele
            }
        }

        if (!getProductIdCallback) {
            getProductIdCallback = function (ele) {
                return ele.getAttribute('href')
            }
        }

        if (!getCountCallback) {
            getCountCallback = function (appCount, subCount, appOwned, subOwned) {
            }
        }

        if (!classOwned) {
            classOwned = ''
        }
        if (!classNotInterested) {
            classNotInterested = ''
        }
        if (!classWished) {
            classWished = ''
        }

        let rgxId = /[0-9]{3,}/g
        let rgxApp = /((:\/\/(store\.steampowered\.com|steamcommunity\.com|steamdb\.info)(\/agecheck)?\/app|\/steam\/apps)\/[0-9]+|^[0-9]{3,}$)/i
        let rgxSub = /(:\/\/(store\.steampowered\.com|steamdb\.info)\/sub|\/steam\/subs)\/[0-9]+/i

        let markFromJson = function (dataRes) {
            if (!dataRes) {
                writeConsoleMessage('markFromJson: empty')
                return
            }

            let countOwned = [0, 0]
            let countAll = [0, 0]

            let eleApps = document.querySelectorAll(query)
            writeConsoleMessage(eleApps)
            for (let i = 0; i < eleApps.length; i++) {
                let attrHref = getProductIdCallback(eleApps[i])
                let ids = attrHref.match(rgxId)
                if (ids) {
                    // writeConsoleMessage('Matched ID "' + ids[0] + '" from url: ' + attrHref)
                    let valId = parseInt(ids[0])
                    if (rgxApp.test(attrHref)) {
                        if (isAppOwned(valId)) {
                            let ele = getElementCallback(eleApps[i], 1)
                            if (ele && classOwned !== '') {
                                ele.classList.add(classOwned)
                            }
                            countOwned[0]++
                        } else if (isAppWishlisted(valId)) {
                            let ele = getElementCallback(eleApps[i], 3)
                            if (ele && classWished !== '') {
                                ele.classList.add(classWished)
                            }
                        } else if (isAppIgnored(valId)) {
                            let ele = getElementCallback(eleApps[i], 2)
                            if (ele && classNotInterested !== '') {
                                ele.classList.add(classNotInterested)
                            }
                        } else {
                            // writeConsoleMessage('App: Unowned - https://store.steampowered.com/app/' + valId + '/')
                        }

                        countAll[0]++
                    } else if (rgxSub.test(attrHref)) {
                        if (steam_profile.rgOwnedPackages.indexOf(valId) > -1) {
                            writeConsoleMessage('Sub: owned - https://store.steampowered.com/sub/' + valId + '/')
                            let ele = getElementCallback(eleApps[i], 1)
                            if (ele && classOwned !== '') {
                                ele.classList.add(classOwned)
                            }
                            countOwned[1]++
                        } else {
                            // writeConsoleMessage('Sub: not owned - https://store.steampowered.com/sub/' + valId + '/')
                        }
                        countAll[1]++
                    } else {
                        writeConsoleMessage('Cannot determine url type: ' + attrHref)
                    }
                } else {
                    writeConsoleMessage('Cannot match ID from url: ' + attrHref)
                }
            }

            writeConsoleMessage('App: Owned ' + countOwned[0] + '/' + countAll[0])
            writeConsoleMessage('Sub: Owned ' + countOwned[1] + '/' + countAll[1])

            getCountCallback(countAll[0], countAll[1], countOwned[0], countOwned[1])
        }

        markFromJson(steam_profile)
    }

    function updateSteamProfileCache() {
        GM_xmlhttpRequest(
            {
                method: 'GET',
                url: 'https://store.steampowered.com/dynamicstore/userdata/?t=' + getUnixTimestamp(),
                onload: function (response) {
                    writeConsoleMessage('Steam User Data: ' + response.responseText.length + ' bytes')

                    let dataRes = JSON.parse(response.responseText)

                    setProfileCache(dataRes)
                    steam_profile = dataRes
                }
            })
    }

    // eslint-disable-next-line no-unused-vars
    function createCacheResetButton() {
        let divCacheResetButton = document.createElement('div')
        divCacheResetButton.classList.add('bh_button')
        divCacheResetButton.id = 'bh_cacheReset'

        let cacheResetA = document.createElement('a')
        cacheResetA.setAttribute('onclick', 'return false;')
        cacheResetA.textContent = 'Reset Bundle Helper Cache'

        divCacheResetButton.appendChild(cacheResetA)
        document.body.appendChild(divCacheResetButton)

        divCacheResetButton.addEventListener('click',
            function () {
                updateSteamProfileCache()
            })
    }

    function addMarkBtnHandler(onClickFunction, argsArray) {
        if (!document.body.contains(divButton)) {
            document.body.appendChild(divButton)
        }

        divButton.addEventListener('click', () => {
            onClickFunction.apply(null, argsArray)
        })
    }

    function setElementOwned(element) {
        if (typeof element !== 'undefined' && element !== null) {
            element.classList.add(owned_item_class)
        }
    }

    /**
     * @description Checks the Steam game's ID against the owned apps
     * @param {number} steamID The ID to check
     * @returns {boolean} True when the game is owned
     */
    function isAppOwned(steamID) {
        if (steam_profile.rgOwnedApps.includes(parseInt(steamID))) {
            writeConsoleMessage('App: Owned - https://store.steampowered.com/app/' + steamID + '/')
            return true
        }
        // writeConsoleMessage('App: Unowned - https://store.steampowered.com/app/' + steamID + '/')
        return false
    }

    /**
     * @description Checks the Steam game's ID against the wishlisted apps
     * @param {number} steamID The ID to check
     * @returns {boolean} True when the game is wishlisted
     */
    function isAppWishlisted(steamID) {
        if (steam_profile.rgWishlist.includes(parseInt(steamID))) {
            writeConsoleMessage('App: Wishlisted - https://store.steampowered.com/app/' + steamID + '/')
            return true
        }
        return false
    }

    /**
     * @description Checks the Steam game's ID against the ignored apps
     * @param {number} steamID The ID to check
     * @returns {boolean} True when the game is ignored
     */
    function isAppIgnored(steamID) {
        if (typeof steam_profile.rgIgnoredApps[steamID] !== 'undefined') {
            writeConsoleMessage('App: Ignored - https://store.steampowered.com/app/' + steamID + '/')
            return true
        }
        return false
    }

    /**
     * @description Parses a string for a Steam game ID
     * @param {string} str The string/URL that contains the Steam game ID
     * @returns {number} Steam game ID
     */
    function getSteamIDFromString(str) {
        let rgxId = /[0-9]{3,}/g
        let matches = str.match(rgxId)
        if (matches) {
            return parseInt(matches[0])
        }
        return null
    }

    /**
     * Searches the document for Steam game ownership
     * @param {string|null} steamLinkSelector The CSS selector to match Steam links
     * @param {HTMLElement} elementToMark The element to mark as owned
     * @returns {undefined}
     */
    function markBySteamLinkSelector(steamLinkSelector, elementToMark) {
        let selectorQuery
        if (typeof steamLinkSelector === 'undefined' || steamLinkSelector === null) {
            selectorQuery = default_steam_url_selector
        } else {
            selectorQuery = steamLinkSelector
        }

        document.querySelectorAll(selectorQuery).forEach(steamStoreLink => {
            let steamID = getSteamIDFromString(steamStoreLink.href)
            if (steamID !== null) {
                if (isAppOwned(steamID)) {
                    if (typeof elementToMark === 'undefined' || elementToMark === null) {
                        // No element passed, mark the link element itself
                        setElementOwned(steamStoreLink)
                    } else if (typeof elementToMark === 'function') {
                        // Function passed, call the function passing in the link element
                        let element = elementToMark(steamStoreLink)
                        setElementOwned(element)
                    } else {
                        // Element passed, attempt to mark
                        setElementOwned(elementToMark)
                    }
                }
            }
        })
    }

    /**
     * Checks a page for Steam game ownership
     * @param {string} storePageUrl The store page that contains the Steam link
     * @param {string|null} steamLinkSelector The CSS selector to match Steam links
     * @param {HTMLElement} elementToMark The element to mark as owned
     * @returns {undefined}
     */
    function markByStorePageUrl(storePageUrl, steamLinkSelector, elementToMark) {
        let selector
        if (typeof steamLinkSelector === 'undefined' || steamLinkSelector === null) {
            selector = default_steam_url_selector
        } else {
            selector = steamLinkSelector
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: storePageUrl,
            onload: function (response) {
                let parser = new DOMParser()
                let storePage = parser.parseFromString(response.responseText, 'text/html')

                let steamLink = storePage.querySelector(selector)
                if (steamLink !== null) {
                    let steamID = getSteamIDFromString(steamLink.href)
                    if (steamID !== null) {
                        if (isAppOwned(steamID)) {
                            setElementOwned(elementToMark)
                        }
                    }
                } else {
                    writeConsoleMessage(`No steam links found on page "${storePageUrl}" with selector "${selector}"`)
                }
            }
        })
        return
    }

    /**
     * Checks all matching links for Steam game ownership
     * @param {string} storePageSelector The CSS selector to match store links
     * @param {string} steamLinkSelector The CSS selector to match Steam links
     * @param {HTMLElement} elementToMark The element to mark as owned
     * @returns {undefined}
     */
    function markByStorePageSelector(storePageSelector, steamLinkSelector, elementToMark) {
        let storePageLinkElements = document.querySelectorAll(storePageSelector)

        storePageLinkElements.forEach(storePageLinkElement => {
            if (typeof elementToMark === 'undefined' || elementToMark === null) {
                markByStorePageUrl(storePageLinkElement.href, steamLinkSelector, storePageLinkElement)
            } else if (typeof elementToMark === 'function') {
                // Function passed, call the function passing in the link element
                let element = elementToMark(storePageLinkElement)
                markByStorePageUrl(storePageLinkElement.href, steamLinkSelector, element)
            } else {
                writeConsoleMessage(storePageLinkElement)
                markByStorePageUrl(storePageLinkElement, steamLinkSelector, elementToMark)
            }
        })
        return
    }

    async function GetSteamAppList() {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.steampowered.com/ISteamApps/GetAppList/v2/',
                    onload: response => {
                        setTimeout(function () {
                            if (response.status !== 200) {
                                reject([
                                    response.status,
                                    response.statusText,
                                    response.readyState,
                                    response.responseHeaders,
                                    response.finalUrl
                                ].join(', '))
                            } else {
                                let appList = JSON.parse(response.responseText).applist.apps
                                appList.forEach(app => {
                                    app.name = app.name.toLowerCase().replace(/[^a-z0-9]/g, '')
                                })
                                resolve(appList)
                            }
                        }, 0)
                    }
                })
            }, 0)
        })
    }

    function main() {
        if (window !== window.parent) {
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/parent
            // Don't run inside of a frame
            return
        }

        if (!divButton) {
            divButton = document.createElement('div')
        }
        divButton.classList.add('bh_button')
        divButton.id = 'bh_markOwned'

        let eleA = document.createElement('a')
        eleA.setAttribute('onclick', 'return false;')
        eleA.textContent = 'Mark Owned'

        divButton.appendChild(eleA)

        // Create button to refresh profile details
        // createCacheResetButton()

        GM_addStyle(
            '   .bh_button { '
            + '	  border-radius: 2px; border: medium none; padding: 10px; display: inline-block; '
            + '   cursor: pointer; background: #67C1F5 none repeat scroll 0% 0%; '
            + '   width: 120px; text-align: center; } '
            + ' .bh_button a { '
            + '   text-decoration: none !important; color: #FFF !important; '
            + '   padding: 0px 2px; } '
            + ' .bh_button:hover a { '
            + '   color: #0079BF !important; } '
            + ' .bh_button, .bh_button a { '
            + '   font-family: Verdana; font-size: 12px; '
            + '   line-height: 16px; } '
            + ' .bh_owned { background-color: #7CA156 !important; '
            + '   transition: background 500ms ease 0s; } '
            + ' #bh_markOwned { '
            + '   position: fixed; right: 20px; bottom: 20px; z-index: 33; } '
            + ' #bh_cacheReset { '
            + '   position: fixed; right: 20px; bottom: 60px; z-index: 33; } '
            + ' #bh_OpenLib { '
            + '   position: fixed; right: 20px; bottom: 65px; z-index: 33; } '
        )

        let url = document.documentURI

        if (url.includes('hrkgame.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #2B823A !important;/* background-color: #97BA22 !important;*/ } '
                + ' #bh_markOwned { bottom: 40px !important; } '
                + ' #bh_cacheReset { bottom: 80px !important; } '
                + '.catalog.ui.items .item.bh_owned .content a, .catalog.ui.items .item.bh_owned .content .description {color: #333 !important;}'
                + '.hrktable_content a.browse_catalogues_items div.label.bh_owned { background-color: #2B823A!important }'
            )

            if (url.includes('/randomkeyshop/make-bundle')) {
                let onClickFunction = function () {
                    document.querySelectorAll('#result div.header[data-href*=\'/games/product/\']').forEach(link => {
                        markByStorePageUrl(link.getAttribute('data-href'), 'a.item[href*=\'store.steampowered.com/\']', element => element.parentElement.parentElement)
                    })
                }
                addMarkBtnHandler(onClickFunction)
            } else if (url.includes('/games/products/?search')) {
                addMarkBtnHandler(markByStorePageSelector, ['.item a.header[href*=\'/games/product/\']', 'a.item[href*=\'store.steampowered.com/\']', element => element.parentElement.parentElement])
            } else if (url.includes('/games/product/')) {
                addMarkBtnHandler(markBySteamLinkSelector, ['a.item[href*=\'store.steampowered.com/\']', document.querySelector('.ui.maincontainer')])
            } else {
                let onClickFunction = function () {
                    markByStorePageSelector('.offer_column a[href*=\'/games/product/\']', 'a.item[href*=\'store.steampowered.com/\']', element => element.parentElement)

                    document.querySelectorAll('a.browse_catalogues_items[href*=\'/games/product/\']').forEach(link => {
                        if (link.textContent.includes('Steam')) {
                            let elementToMark = link.querySelector('div.label')
                            markByStorePageUrl(link.href, 'a.item[href*=\'store.steampowered.com/\']', elementToMark)
                        }
                    })
                }
                addMarkBtnHandler(onClickFunction)
            }
        } else if (url.includes('itch.io')) {
            if (url.includes('/my-collections') || url.includes('/my-purchases') || url.includes('/games') || url.includes('/s/') || url.includes('/c/') || url.includes('/b/')) {
                GM_addStyle(
                    ' .grid_outer .game_grid_widget .game_cell.bh_owned span, .grid_outer .game_grid_widget .game_cell.bh_owned div, .grid_outer .game_grid_widget .game_cell.bh_owned a { color: #ffffff !important; } '
                )

                addMarkBtnHandler(() => {
                    let storePageLinkElements = document.querySelectorAll('.game_cell_data a.game_link')

                    storePageLinkElements.forEach(storePageLinkElement => {
                        if (!storePageLinkElement.href.includes('/b/')) {
                            // Don't search bundle pages for Steam links
                            markByStorePageUrl(storePageLinkElement.href, default_steam_url_selector, storePageLinkElement.parentElement.parentElement.parentElement)
                        }
                    })
                })
            } else if (url.includes('/recommendations')) {
                GM_addStyle(
                    ' .index_game_cell_widget.game_cell.bh_owned span, .index_game_cell_widget.game_cell.bh_owned div, .index_game_cell_widget.game_cell.bh_owned a.user_link { color: #ffffff; } '
                )
                addMarkBtnHandler(markByStorePageSelector, ['a.title', default_steam_url_selector, element => element.parentElement.parentElement])
            }
        } else if (url.includes('fanatical.com')) {
            GM_addStyle(
                ' .bh_owned { background-color: #0c6c22 !important; } '
                + ' .bh_owned .card-body div.card-body { background-color: #0c6c22 !important; } '
                + ' .bh_owned .card-body { background-color: #0c6c22; } '
            )

            if (url.includes('/game/')) {
                addMarkBtnHandler(markBySteamLinkSelector, [default_steam_url_selector, () => document.querySelector('.details-content-container')])
            } else if (url.includes('/bundle/')) {
                let obTarget_root = document.querySelector('#root')
                if (obTarget_root) {
                    let tmOb_root = -1
                    let obMu_root = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.type !== 'attributes'
                                || mutation.target.tagName === 'TR') {
                                clearTimeout(tmOb_root)
                                tmOb_root = setTimeoutCustom(function () {
                                    markBySteamLinkSelector(default_steam_url_selector, element => element.parentElement
                                        .parentElement.parentElement.parentElement)
                                }, 200)
                            }
                        })
                    })

                    let obConfig_root = { childList: true, subtree: true }
                    obMu_root.observe(obTarget_root, obConfig_root)
                }
            } else if (url.includes('/pick-and-mix/')) {
                let onClickFunction = function () {
                    let hook = __REACT_DEVTOOLS_GLOBAL_HOOK__
                    let rootFragmentFiber = Array.from(hook.getFiberRoots(1))[0].current
                    let rootCompFiber = rootFragmentFiber.child
                    let rootComp = rootCompFiber.stateNode
                    let state = rootComp.props.store.getState()
                    let bundles = [...state.pickAndMix.all]
                    bundles.forEach(bundle => {
                    let productsArr = bundle.products
                    let ownedGames = []
                    productsArr.forEach(product => {
                        let id = product._id
                        if (isAppOwned(id)) {
                            writeConsoleMessage('You own game ID: ' + id + ' - "' + product.name + '"')
                            ownedGames.push(product.name)
                        }
                    })
                    if (ownedGames.length > 0) {
                        document.querySelectorAll('.card-overlay p').forEach(p => {
                            if (ownedGames.includes(p.textContent)) {
                                setElementOwned(p.parentElement.parentElement.parentElement.parentElement)
                            }
                        })
                    }})
                    
                }
                addMarkBtnHandler(onClickFunction)
            }

            let onClickFunction = function () {
                let timeouts = []
                let gameUrls = []
                document.querySelectorAll('a[href*=\'/game/\']').forEach(game => {
                    if (gameUrls.includes(game.href)) {
                        return
                    }
                    gameUrls.push(game.href)
                    timeouts.push(function () {
                        let gamePage = game.href.replace('/en', '').replace('/game/', '/api/products/') + '/en'
                        GM_xmlhttpRequest({
                            method: 'GET',
                            headers: {
                                'Host': 'www.fanatical.com',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
                                'Accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Referer': game.href
                            },
                            url: gamePage,
                            onload: function (response) {
                                // writeConsoleMessage('status ' + response.status + ' ' + gamePage)
                                if (response.status === 200) {
                                    let apiResponse = JSON.parse(response.responseText)
                                    if (typeof apiResponse.steam.id !== 'undefined') {
                                        if (isAppOwned(apiResponse.steam.id)) {
                                            setElementOwned(game.parentElement.parentElement.parentElement.parentElement)
                                        }
                                    }
                                    if (timeouts.length > 0) {
                                        setTimeout(timeouts.pop(), 50)
                                    }
                                } else if (timeouts.length > 0) {
                                    setTimeout(timeouts.pop(), 400)
                                }
                            }
                        })
                    })
                })
                setTimeout(timeouts.pop(), 100)
            }
            addMarkBtnHandler(onClickFunction)
        } else if (url.includes('reddit.com')) {
            GM_addStyle(
                '   .bh_owned , .md .bh_owned code { background-color: #DFF0D8 !important; } '
                + ' li > .bh_owned, div > p > .bh_owned { padding: 0px 2px 0px 2px; } '
            )

            addMarkBtnHandler(markOwned, ['td > a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement
            }, null, 'bh_owned'])


            setTimeout(function () {
                markOwned('td > a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement.parentElement
                }, null, 'bh_owned')

                markOwned('li > a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement
                }, null, 'bh_owned')

                markOwned('li > p > a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement.parentElement
                }, null, 'bh_owned')

                markOwned('div > p > a[href*=\'store.steampowered.com/\']'
                    , null, null, 'bh_owned')
            }, 1000)
        } else if (url.includes('indiegala.com')) {
            GM_addStyle(
                '  #bh_markOwned {bottom: 70px !important;}'
                + ' .bh_owned, .bh_owned .bundle-item-trading { background-color: rgba(125, 174, 45, 0.9) !important; } '
                + ' .ig-bundle { padding-left: 3px; padding-right: 3px; margin-bottom: 3px; } '
                + ' .bh_owned.ig-bundle { background-color: rgba(125, 174, 45) !important; } '
                + ' .bh_owned.ig-bundle .bundle-item-trading { background-color: rgba(125, 174, 45, 0) !important; } '
                + ' .bh_owned .add-info-button-cont .left, .bh_owned .add-info-button-cont .palette-background-2 { '
                + '   background-color: #7DAE2D !important; } '
                + ' .bh_owned .add-info-button-cont .right .inner-info, .bh_owned .add-info-button-cont .right .palette-border-2 { '
                + '   border-color: #7DAE2D !important; } '
                + ' .bh_owned.medium-game .game-cover-medium { border: 3px solid #7DAE2D; background-color: rgba(125, 174, 45, 0.4); } '
                + ' .bh_owned.game-data-cont { background-color: #76AD1C !important; } '
                + ' .bundle-item-trading-cards-cont span { opacity: 0.7; } '
                + ' .span-title .title_game, .span-title .title_drm, .span-title .title_music { '
                + '   line-height: 43px !important; margin: 10px 0px 10px 15px !important; '
                + '   padding-left: 10px !important; border-radius: 3px !important; } '
                + ' .medium-game { min-height: 146px; } '
            )

            // Insert email to bundle section
            let countRetryEmail = 10
            let tmRetryEmail = setInterval(function () {
                let eleEmail = document.querySelector('.account-email')
                let eleInput = document.querySelector('.email-input')
                if (eleEmail && eleInput) {
                    let email = eleEmail.textContent.trim()
                    if (email !== '') {
                        eleInput.value = email
                        clearInterval(tmRetryEmail)
                    }
                }

                if (countRetryEmail < 0) {
                    clearInterval(tmRetryEmail)
                }
                countRetryEmail--
            }, 3000)

            // Change title
            let countRetryTitle = 10
            let tmRetryTitle = setInterval(function () {
                let elesPrice = document.querySelectorAll('.bundle-claim-phrase')
                for (let i = elesPrice.length - 1; i > -1; i--) {
                    let elePrice = elesPrice[i].querySelector('span')
                    if (elePrice) {
                        let price = elePrice.textContent.trim()
                        if (price.indexOf('$') === 0) {
                            document.title = price + ' ' + document.title
                            clearInterval(tmRetryTitle)
                            break
                        }
                    }
                }

                if (countRetryTitle < 0) {
                    clearInterval(tmRetryTitle)
                }
                countRetryTitle--
            }, 3000)

            if (url.includes('indiegala.com/store/') || url.includes('indiegala.com/games') || url === 'https://www.indiegala.com/') {
                let onClickFunction = function () {
                    let gameBrowserLinks = document.querySelectorAll('a.main-list-item-clicker')
                    for (let i = 0; i < gameBrowserLinks.length; i++) {
                        let steamID = getSteamIDFromString(gameBrowserLinks[i].href)
                        if (steamID !== null) {
                            if (isAppOwned(steamID)) {
                                setElementOwned(gameBrowserLinks[i].parentElement)
                            }
                        }
                    }

                    let smallListLinks = document.querySelectorAll('a.fit-click')
                    for (let i = 0; i < smallListLinks.length; i++) {
                        let steamID = getSteamIDFromString(smallListLinks[i].href)
                        if (steamID !== null) {
                            if (isAppOwned(steamID)) {
                                setElementOwned(smallListLinks[i].parentElement.querySelector('.item-inner'))
                            }
                        }
                    }
                }
                addMarkBtnHandler(onClickFunction)
            }
        } else if (url.includes('orlygift.com')) {
            addMarkBtnHandler(markByStorePageSelector, ['a[href*=\'/games/\']', default_steam_url_selector, element => element.parentElement])
        } else if (url.includes('cubicbundle.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #91BA07 !important; } '
            )
            addMarkBtnHandler(markOwned, ['.price a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement.parentElement.parentElement.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('dailyindiegame.com')) {
            GM_addStyle(
                '   .bh_owned, .bh_owned a, .bh_owned a:not(:visited) .DIG2content { color: #202020 !important; } '
            )

            let onClickFunction = function () {
                let markMap = [{
                    selector: '.DIG-content a[href*=\'store.steampowered.com/\']',
                    callback: function (ele) {
                        return ele.parentElement
                            .parentElement.parentElement
                            .parentElement.parentElement
                    }
                },
                {
                    selector: '.DIG2content a[href*=\'store.steampowered.com/\']',
                    callback: function (ele) {
                        return ele.parentElement.parentElement
                    }
                },
                {
                    selector: '.DIG3_14_Gray a[href*=\'store.steampowered.com/\']',
                    callback: function (ele) {
                        return ele.parentElement.parentElement.parentElement
                    }
                }]
                for (let i = 0; i < markMap.length; i++) {
                    if (document.querySelectorAll(markMap[i].selector).length > 0) {
                        markOwned(markMap[i].selector, markMap[i].callback, null, 'bh_owned')
                    }
                }
            }
            addMarkBtnHandler(onClickFunction)
        } else if (url.includes('bundlekings.com')) {
            addMarkBtnHandler(markOwned, ['.content-wrap a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('otakumaker.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #91BA07 !important; } '
            )
            addMarkBtnHandler(markOwned, ['.gantry-width-spacer a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('otakubundle.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #91BA07 !important; } '
            )
            addMarkBtnHandler(markOwned, ['#hikashop_product_left_part > .g-grid > .g-block > .g-block > a[href*=\'store.steampowered.com/\']',
                function (ele) {
                    return ele.parentElement.parentElement
                },
                null,
                'bh_owned'])
        } else if (url.includes('gogobundle.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #91BA07 !important; border: 1px solid white; } '
            )

            addMarkBtnHandler(markOwned, ['.g-block > .g-block > a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('superduperbundle.com')) {
            addMarkBtnHandler(markOwned, ['#gameslist a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('gamebundle.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #A0CC41 !important; border-bottom: 45px solid rgba(233, 233, 233, 0.5); } '
                + ' .bh_owned .activebundle_game_bundle_debut_title { background-color: #A0CC41 !important; } '
            )
            addMarkBtnHandler(markOwned, ['.activebundle_game_section_full a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('humblebundle.com')) {
            GM_addStyle(
                '   .game-box img { max-height: 180px !important; max-width: 130px !important; } '
                + ' .image-grid { animation: none !important; } ' +
                ' .bh_owned .entity-details, .bh_owned div.entity-meta, .bh_owned div.entity-meta span.entity-title { background: #7CA156 !important; color: #FFFFFF !important; } ' +
                ' div.slick-track .bh_owned div.entity-meta { background: transparent !important; } '
            )

            if (url.includes('/games/')) {
                GM_addStyle(
                    ' .bh-owned div.dd-image-box-caption-container { background: #7CA156 !important; } ' +
                    ' .bh-owned span.front-page-art-image-text { color: #FFFFFF !important; } '
                )
                let onClickFunction = function () {
                    GetSteamAppList()
                        .then(appList => {
                            let gameTitleElements = document.querySelectorAll('span.front-page-art-image-text')
                            for (let gameTitleElement of gameTitleElements) {
                                let gameName = gameTitleElement.textContent.toLowerCase().replace(/[^a-z0-9]/g, '')
                                let matches = appList.filter(app => app.name === gameName)
                                for (let match of matches) {
                                    if (isAppOwned(match.appid)) {
                                        setElementOwned(gameTitleElement.parentElement.parentElement.parentElement.parentElement)
                                        break
                                    }
                                }
                            }
                        })
                }
                addMarkBtnHandler(onClickFunction)
            } else if (url.includes('/store')) {
                let onClickFunction = function () {
                    GetSteamAppList()
                        .then(appList => {
                            let gameTitleElements = document.querySelectorAll('span.entity-title')
                            for (let gameTitleElement of gameTitleElements) {
                                let gameName = gameTitleElement.textContent.toLowerCase().replace(/[^a-z0-9]/g, '')
                                let matches = appList.filter(app => app.name === gameName)
                                for (let match of matches) {
                                    if (isAppOwned(match.appid)) {
                                        setElementOwned(gameTitleElement.parentElement.parentElement)
                                        break
                                    }
                                }
                            }
                        })
                }
                addMarkBtnHandler(onClickFunction)
            } else if (url.includes('/subscription')) {
                GM_addStyle(
                    ' .bh-owned div { background: #7CA156 !important; } ' +
                    ' .bh-owned .content-choice-title { color: #FFFFFF !important; } '
                )
                let onClickFunction = function () {
                    GetSteamAppList()
                        .then(appList => {
                            let gameTitleElements = document.querySelectorAll('span.content-choice-title')
                            for (let gameTitleElement of gameTitleElements) {
                                let gameName = gameTitleElement.textContent.toLowerCase().replace(/[^a-z0-9]/g, '')
                                let matches = appList.filter(app => app.name === gameName)
                                for (let match of matches) {
                                    if (isAppOwned(match.appid)) {
                                        setElementOwned(gameTitleElement.parentElement.parentElement)
                                        break
                                    }
                                }
                            }
                        })
                }
                addMarkBtnHandler(onClickFunction)
            }
        } else if (url.includes('steamcompanion.com')) {
            GM_addStyle(
                '   .bh_owned.banner { margin-bottom: 5px !important; margin-top: 35px !important; '
                + '   padding-bottom: 15px !important; padding-top: 15px !important; } '
                + ' .bh_owned.giveaway-links { opacity: 0.75; } '
            )

            markOwned('#hero a[href*=\'store.steampowered.com/\']'
                , null, null, 'bh_owned')

            // Mark
            {
                let query = '.giveaway-links img[src^=\'https://steamcdn-a.akamaihd.net/steam/apps/\']'
                let getLabelCallback = function (ele) {
                    return ele.parentElement.parentElement.parentElement
                }

                let apps = []

                let eleApps = document.querySelectorAll(query)

                for (let i = 0; i < eleApps.length; i++) {
                    let app = /[0-9]+/.exec(eleApps[i].getAttribute('src'))
                    if (app !== null) {
                        apps.push(app[0])
                    }
                }

                apps = apps.filter(function (elem, index, self) {
                    return index === self.indexOf(elem)
                })

                writeConsoleMessage('Apps: ' + apps.length)
                let appAll = apps.join(',')

                GM_xmlhttpRequest(
                    {
                        method: 'GET',
                        headers:
                        {
                            'Cache-Control': 'max-age=0'
                        },
                        url: 'https://store.steampowered.com/api/appuserdetails/?appids=' + appAll,
                        onload: function (response) {
                            let dataRes = JSON.parse(response.responseText)

                            let countOwned = 0

                            let elementApps = document.querySelectorAll(query)
                            for (let i = 0; i < elementApps.length; i++) {
                                let appUrl = elementApps[i].getAttribute('src')
                                if (appurl.includes('https://steamcdn-a.akamaihd.net/steam/apps/')) {
                                    let app = /[0-9]+/.exec(appUrl)
                                    if (app !== null) {
                                        if (typeof dataRes[app] !== 'undefined') {
                                            if (dataRes[app].success) {
                                                if (dataRes[app].data.is_owned) {
                                                    let eleLabel = getLabelCallback(elementApps[i])
                                                    eleLabel.classList.add('bh_owned')
                                                    countOwned++
                                                } else {
                                                    // writeConsoleMessage("App: not owned - http://store.steampowered.com/app/" + app + "/");
                                                }
                                            } else {
                                                // writeConsoleMessage("App: not success - https://steamdb.info/app/" + app + "/");
                                            }
                                        }
                                    }
                                }
                            }

                            writeConsoleMessage('Apps: owned - ' + countOwned)
                        }
                        // End onload
                    })
            }
        } else if (url.includes('store.steampowered.com')) {
            if (url.includes('/widget/')) {
                GM_addStyle(
                    '   .bh_owned { background-color: transparent !important; } '
                    + ' .bh_owned a { color: #71A034 !important; }'
                )

                markOwned('.main_text a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement
                }, null, 'bh_owned')
            } else if (url.includes('/app/')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   background-color: #6D8C1A !important; '
                    + '   padding: 0px 2px 0px 2px; '
                    + ' } '
                )

                markOwned(
                    '.glance_details p > a[href*=\'store.steampowered.com/\']'
                    + ', .game_area_dlc_bubble  a[href*=\'store.steampowered.com/\']'
                    ,
                    null,
                    null,
                    'bh_owned')
            } else if (url.includes('/notinterested/')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   background-color: #6D8C1A !important; '
                    + '   padding: 5px 100px 5px 5px !important; '
                    + '   margin-left: -5px; margin-right: 50px; '
                    + ' } '
                )

                markOwned('.ignoredapps > a[href*=\'store.steampowered.com/\']'
                    , null, null, 'bh_owned')
            } else if (url.includes('/search/')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   background-color: #6D8C1A66 !important; '
                    + ' } '
                )

                markOwned('.search_result_row[href*=\'store.steampowered.com/\']'
                    , null, null, 'bh_owned')
            }
        } else if (url.includes('steamcommunity.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #71A034 !important; '
                + '   padding: 0px 2px 0px 2px; } '
                + ' .bh_owned.blotter_userstatus_game { padding: 0px; border-color: #71A034; } '
            )

            if (url.includes('/home')) {
                let querySteamHome = '.blotter_gamepurchase_details a[href*=\'store.steampowered.com/\']:not(.bh_owned) '
                    + ', .blotter_author_block a[href*=\'store.steampowered.com/\']:not(.bh_owned) '
                    + ', .blotter_author_block a[href*=\'steamcommunity.com/app/\']:not(.bh_owned) '
                    + ', .blotter_daily_rollup_line a[href*=\'steamcommunity.com/app/\']:not(.bh_owned) '
                markOwned(querySteamHome, function (ele, type) {
                    if (type === 1) {
                        if (ele.classList.contains('blotter_userstats_game')) {
                            ele.parentElement.classList.add('bh_owned')
                        } else {
                            ele.classList.add('bh_owned')
                        }
                    }
                })

                let targetObMark = document.getElementById('blotter_content')
                if (targetObMark) {
                    let tmObMark = -1
                    let obMark = new MutationObserver(function (mutations) {
                        mutations.forEach(function () {
                            clearTimeout(tmObMark)
                            tmObMark = setTimeout(function (querySteamH) {
                                markOwned(querySteamH, function (ele, type) {
                                    if (type === 1 && !ele.classList.contains('blotter_userstats_game')) {
                                        ele.classList.add('bh_owned')
                                    }
                                })
                            }, 100, querySteamHome)
                        })
                    })

                    let configObMark = { childList: true }
                    obMark.observe(targetObMark, configObMark)
                }
            } else if (url.includes('/announcements')) {
                markOwned('.announcement_body a[href*=\'store.steampowered.com/\']'
                    , null, null, 'bh_owned')
            }
        } else if (url.includes('forums.steampowered.com')) {
            GM_addStyle(
                '   .bh_owned { background-color: #71A034 !important; '
                + '   padding: 0px 2px 0px 2px;'
                + ' } '
            )

            markOwned('div[id^=\'post_message\'] a[href*=\'store.steampowered.com/\']'
                , null, null, 'bh_owned')
        } else if (url.includes('whosgamingnow.net')) {
            if (url.includes('/discussion')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   padding: 0px 2px 0px 2px;'
                    + ' } '
                )

                markOwned('.MessageList a[href*=\'store.steampowered.com/\']'
                    , null, null, 'bh_owned')
            } else if (url.includes('/redeem')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   border: 1px solid #FFF;'
                    + ' } '
                    + ' .bh_owned .BoxArt { '
                    + '   border: 0px !important;'
                    + ' } '
                )

                markOwned('.GameInfo a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement.parentElement.parentElement
                })
            } else if (url.includes('/giveaway')) {
                GM_addStyle(
                    '   .bh_owned { '
                    + '   border: 5px solid #7CA156;'
                    + ' } '
                )

                markOwned('img[src*=\'://cdn.akamai.steamstatic.com/steam/\']'
                    , null, null, 'bh_owned')
            }
        } else if (url.includes('steamground.com') && url.includes('/wholesale')) {
            GM_addStyle(
                '   .bh_owned { background-color: #48B24B !important; } '
                + ' .bh_owned .wholesale-card_title { color: #373d41 !important; } '
                + ' .bh_steam { display: none; } '
            )

            let elesTitle = document.querySelectorAll('.wholesale-card_title')
            if (elesTitle.length > 0) {
                GM_xmlhttpRequest(
                    {
                        method: 'GET',
                        url: 'https://www.steamgifts.com/discussion/iy081/steamground-wholesale-build-a-bundle',
                        onload: function (response) {
                            let data = response.responseText
                            let eleContainer = document.createElement('div')
                            eleContainer.innerHTML = data

                            let eleComment = eleContainer.querySelector('.comment__description')
                            if (eleComment) {
                                let elesGame = eleComment.querySelectorAll('table td:nth-child(1) a[href*=\'store.steampowered.com/\']')
                                if (elesGame.length > 0) {
                                    let arrTitle = []
                                    for (let i = 0; i < elesTitle.length; i++) {
                                        arrTitle.push(elesTitle[i].textContent.trim())
                                    }

                                    for (let i = 0; i < elesGame.length; i++) {
                                        let isMatch = false
                                        let game = elesGame[i].textContent.trim().toLowerCase()
                                        for (let j = 0; j < elesTitle.length; j++) {
                                            let title = elesTitle[j].textContent.trim().toLowerCase()
                                            if (game === title
                                                || (title.indexOf('|') > -1 && game === title.replace('|', ':'))
                                                || (game === 'ball of light' && title === 'ball of light (journey)')
                                                || (game === 'its your last chance in new school' && title === 'it is yоur last chance in new schооl')
                                                || (game === 'shake your money simulator 2016' && title === 'shake your money simulator')
                                                || (game === 'spakoyno: back to the ussr 2.0' && title === 'spakoyno back to the ussr 2.0')
                                                || (game === 'or' && title === 'or!')) {
                                                isMatch = true

                                                arrTitle = arrTitle.filter(function (value) {
                                                    return value !== elesTitle[j].textContent.trim()
                                                })
                                            }

                                            if (isMatch) {
                                                let elemA = document.createElement('a')
                                                elemA.classList.add('bh_steam')
                                                elemA.href = elesGame[i].href
                                                elesTitle[j].parentElement.parentElement.appendChild(elemA)

                                                break
                                            }
                                        }
                                        if (!isMatch) {
                                            writeConsoleMessage('Not match: ' + elesGame[i].href + ' ' + elesGame[i].textContent)
                                        }
                                    }

                                    if (arrTitle.length > 0) {
                                        writeConsoleMessage('Not match: ' + arrTitle.length)
                                        for (let i = 0; i < arrTitle.length; i++) {
                                            writeConsoleMessage('Not match: ' + arrTitle[i])
                                        }
                                    }

                                    markOwned('.wholesale-card > a[href*=\'store.steampowered.com/\']', function (ele) {
                                        return ele.parentElement
                                    }, null, 'bh_owned')
                                }
                            }
                        }
                        // End onload
                    })
            }
        } else if (url.includes('bunchkeys.com')) {
            GM_addStyle(
                '   .bh_owned { border: #B5D12E 3px solid !important; '
                + '   margin-left: -3px; margin-top: -3px; } '
            )

            addMarkBtnHandler(markOwned, [default_steam_url_selector, function (ele) {
                return ele.parentElement
            }, null, 'bh_owned'])
        } else if (url.includes('sgtools.info')) {
            GM_addStyle(
                '   .bh_owned { background-color: #71A034 !important; } '
            )
            if (url.includes('/lastbundled')) {
                markOwned('#content > div > table > tbody > tr > td > a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement.parentElement
                }, null, 'bh_owned')
            } else if (url.includes('/deals')) {
                markOwned('.deal_game_image > img[src*=\'cdn.akamai.steamstatic.com/steam/\']', function (ele) {
                    return ele.parentElement
                }, null, 'bh_owned')
            } else if (url.includes('/whitelisted')) {
                markOwned('.cmGame > a[href*=\'store.steampowered.com/\']', function (ele) {
                    return ele.parentElement
                }, null, 'bh_owned')
            }
        } else if (url.includes('steamkeys.ovh')) {
            markOwned('td > a[href*=\'store.steampowered.com/\']', function (ele) {
                return ele.parentElement.parentElement
            }, null, 'bh_owned')
        } else if (url.includes('steamdb.info')) {
            if (window !== window.parent) {
                return
            }

            GM_addStyle(
                '   .bh_owned, tr.bh_owned td { background-color: #DDF7D3 !important; } '
                + ' .bh_owned_transparent { background-color: #bcf0a880 !important; } '
            )

            markOwned(' \
            #apps .app \
            , #dlc .app \
            , .container > .table .app \
            , .sales-section .app \
            , .page-search .app \
            ', null, function (ele) {
                return ele.getAttribute('data-appid')
            }, 'bh_owned')

            markOwned(' \
            #subs .package \
            , .sales-section .package \
            , .page-search .package \
            ', null, function (ele) {
                return '/steam/subs/' + ele.getAttribute('data-subid')
            }, 'bh_owned')

            markOwned('.table-products .app'
                , null, function (ele) {
                    return ele.getAttribute('data-appid')
                }, 'bh_owned_transparent')

            markOwned('.app-history .appid'
                , function (ele) {
                    return ele.parentElement
                }, function (ele) {
                    return ele.textContent.trim()
                }, 'bh_owned')
        }

        window.addEventListener('beforeunload', function () {
            clearTimeoutAll()
            clearIntervalAll()
        })
    }

    attachOnReady(main)
}())
