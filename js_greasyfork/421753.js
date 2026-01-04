// ==UserScript==
// @name         [Idlescape] Item sets, and more.
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Create & equip item sets
// @author       Sytha
// @match        https://idlescape.com/game
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421753/%5BIdlescape%5D%20Item%20sets%2C%20and%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/421753/%5BIdlescape%5D%20Item%20sets%2C%20and%20more.meta.js
// ==/UserScript==

(function() {

    const NativeWebSocket = window.WebSocket
    window.WebSocket = function(...args) {
        const socket = new NativeWebSocket(args)
        window.allSockets.push(socket)
        return socket
    }
    window.reactDataKey = null
    window.allItems = {}
    window.allSockets = []

    const LocalStorageHelper = {
        get: (key, defaultValue) => {
            defaultValue = defaultValue || {}
            const localStorageItem = window.localStorage.getItem(key)
            if (null === localStorageItem) return defaultValue
            try { return JSON.parse(localStorageItem) }
            catch (exception) { return defaultValue }
        },
        set: (key, value) => {
            window.localStorage.setItem(key, JSON.stringify(value))
        }
    }
    window.LocalStorageHelper = LocalStorageHelper

    const Tools = {
        waitForSelector: (selector, callback) => {
            const target = document.querySelector(selector)
            if (null === target) {
                setTimeout(() => Tools.waitForSelector(selector, callback), 50)
                return
            }
            callback(target)
        },

        isArray: (something) => 'object' === typeof something && true === ('length' in something),

        logger: (type, ...messages) => {
            type = -1 !== ['log', 'warn', 'error'].indexOf(type) ? type : 'log'
            console[type](...messages)
        },
        log: (...message) => Tools.logger('log', ...message),
        warn: (...message) => Tools.logger('warn', ...message),
        error: (...message) => Tools.logger('error', ...message),
        getObjectComposedKey: (object, composedKey) => {
            const keys = composedKey.split('.')
            let lastElement = object
            let lastComposedKey = []
            for (const key of keys) {
                lastComposedKey.push(key)
                if (false === (key in lastElement)) throw `[Tools:getObjectComposedKey] Cannot get key ${composedKey} in object, no data found @${lastComposedKey.join('.')}`
                lastElement = lastElement[key]
            }
            return lastElement
        },
    }
    window.Tools = Tools

    const ItemsHelper = {
        retrieveIdlescapeItems: (forceRefresh) => {
            if ('undefined' === typeof forceRefresh) forceRefresh = false
            if (false === forceRefresh) {
                const cachedItems = LocalStorageHelper.get('idlescape-items', null)
                if (null !== cachedItems) {
                    const cachedDate = new Date(cachedItems.timestamp)
                    if ((new Date).toLocaleDateString() === cachedDate.toLocaleDateString()) {
                        Tools.log('%c[Idlescape][DEV] window.allItems is ready (cached: %s)', 'color: green; font-weight: bold; font-size: 1.2em;', cachedDate.toLocaleString())
                        window.allItems = cachedItems.items
                        return cachedItems.items
                    }
                }
            }

            // HIGHLY EXPERIMENTAL!!! Will most certainly break as soon as the main Idlescape script is updated
            Tools.waitForSelector('script[src*="static/js/main"]', (target) => {
                fetch(target.src + '?v=' + (new Date).getTime()).then(response => response.text()).then(text => {
                    const matches = text.match(/=({1:{id:1,name:"Gold".*?}}),[^O]/)
                    const itemsJSON = matches[1]
                        // remove functions
                        .replace(/function.*?},/g, 'null,')
                        .replace(/,getChance:.*?},/g, '},')
                        .replace(/\([\w]{2}=/g, '').replace(/Object\(W\.a\)\(.*\),/g, '')
                        // remove ":" in values (but only after some specific words, it WILL break if another string is before the ":")
                        .replace(/properties:/g, 'properties like')
                        .replace(/"power: /ig, '"Power - ')
                        .replace(/"magic: /ig, '"Magic - ')
                        // remove trailing ":" inside values
                        .replace(/:",/g, '",')
                        // replace "!0" with true (using the actual JS code)
                        .replace(/!0/g, !0)
                        // replace "!1" with false (using the actual JS code)
                        .replace(/!1/g, !1)
                        // replace math expressions like 1e3 with their numerical counterpart like 1000
                        .replace(/(\d+)e(\d+):/g, (w, m, n) => (parseInt(m) * Math.pow(10, parseInt(n))) + ':')
                        // quote numeric keys (1: becomes "1":)
                        .replace(/(\d+):/g, (w, m) => '"' + m + '":')
                        // quote alphabetic keys (name: becomes "name":)
                        .replace(/(\w+):/g, (w, m) => '"' + m + '":')
                        // replace mathematical division with a string representation (3/600 becomes "3/600")
                        .replace(/:(\d+)\/(\d+)/g, (w, m, n) => ': "' + m + '/' + n + '"')
                        // replace zero-less float representation with the same value with a leading zero (.01 becomes 0.01)
                        .replace(/:\./g, ':0.')
                    window.allItems = JSON.parse(itemsJSON)
                    LocalStorageHelper.set('idlescape-items', { items: window.allItems, timestamp: new Date() })
                    Tools.log('%c[Idlescape][DEV] window.allItems is ready', 'color: green; font-weight: bold; font-size: 1.2em;')
                    return window.allItems
                })
            })
        },

        getPlayerInventory: () => {
            const gameContainer = document.querySelector('.game-container')

            const inventory = { equipment: [] }

            let gameReactDataProps = null
            try {
                gameReactDataProps = Tools.getObjectComposedKey(gameContainer, `${window.reactDataKey}.child.child.memoizedProps.game.playerInformation`)
            } catch (err) { throw `[ItemsHelper:getPlayerInventory] Cannot parse gameContainer React data ${err.message}` }

            inventory.stockpile = gameReactDataProps.stockpile
            inventory.vault = gameReactDataProps.vault

            for (const itemIndex in gameReactDataProps.equipment) {
                const item = gameReactDataProps.equipment[itemIndex]
                if (null === item) continue
                inventory.equipment.push(item)
            }

            if (true === ('augmentingItemSlot' in gameReactDataProps) && null !== gameReactDataProps.augmentingItemSlot) {
                inventory.augmenting = [gameReactDataProps.augmentingItemSlot]
            }
            if (true === ('enchantingItemSlot' in gameReactDataProps) && null !== gameReactDataProps.enchantingItemSlot) {
                inventory.enchanting = [gameReactDataProps.enchantingItemSlot]
            }
            return inventory
        },

        getPlayerInventoryIds: () => {
            const inventory = ItemsHelper.getPlayerInventory()
            const ids = []
            for (const store in inventory) {
                for (const item of inventory[store]) {
                    try {
                        ids.push(item.id)
                    } catch (err) {
                        Tools.warn('CANNOT GET ITEM ID', item)
                    }
                }
            }
            return ids.sort()
        },

        getCompleteItem: (inventoryItem, store) => {
            if (undefined !== store) inventoryItem.store = store
            if (true === ('allItems' in window) && true === (inventoryItem.itemID in window.allItems)) {
                inventoryItem.item = window.allItems[inventoryItem.itemID]
            } else {
                throw `[ItemsHelper:getInventoryItem] Item ${inventoryItem.itemID} not found in allItems, or allItems is not defined?`
            }
            if (true === ('enchantmentID' in inventoryItem)) {
                const enchantment = window.enchantments[inventoryItem.enchantmentID]
                inventoryItem.enchantment = {...enchantment}
                inventoryItem.enchantment.tooltip = enchantment.getTooltip(inventoryItem.enchantmentStrength, enchantment.strengthPerLevel)
            }
            inventoryItem.title = inventoryItem.name
            if (true === ('augmentations' in inventoryItem)) {
                inventoryItem.title += ' +' + inventoryItem.augmentations
            }
            if (true === ('enchantment' in inventoryItem)) {
                inventoryItem.title += ' - ' + inventoryItem.enchantment.name + ' ' + inventoryItem.enchantmentStrength + ' (' + inventoryItem.enchantment.tooltip + ')'
            }
            return inventoryItem
        },

        getInventoryItem: (id) => {
            const inventory = ItemsHelper.getPlayerInventory()
            for (let store in inventory) {
                for (let item of inventory[store]) {
                    if (item.id === id) {
                        return ItemsHelper.getCompleteItem(item, store)
                    }
                }
            }
            return null
        },

        getInventoryItemByIdentifier: (identifier) => {
            const identifyingFields = ['itemID', 'enchantmentID']
            if ('enchantmentID' in identifier && '' === identifier.enchantmentID) identifier.enchantmentID = null
            for (const field of identifyingFields) {
                if (false === (field in identifier)) throw `[ItemsHelper:getInventoryItemByData] identifier is missing field ${field}`
            }
            const compareObjects = (identifier, item) => {
                for (const field in identifier) {
                    if (identifier[field] != item[field]) return false
                }
                return true
            }
            const inventory = ItemsHelper.getPlayerInventory()
            const matchingItems = []
            for (let store in inventory) {
                for (let item of inventory[store]) {
                    if (true === compareObjects(identifier, item)) {
                        const inventoryItem = ItemsHelper.getCompleteItem(item, store)
                        matchingItems.push(inventoryItem)
                    }
                }
            }
            return ItemsHelper.getBestItemFromStack(matchingItems, 'augmentations')
        },

        getBestItemFromStack: (itemsStack, prefer) => {
            if (null === itemsStack) return null
            if ('object' !== typeof itemsStack || false === ('length' in itemsStack)) return null

            prefer = prefer || 'augmentations'
            if ('augmentations' !== prefer && 'enchantmentStrength' !== prefer) throw 'ItemsHelper:[getBestItemFromStack] invalid "prefer" value (must be "augmentations" or "enchantmentStrength")'
            let bestItem = null
            for (const item of itemsStack) {
                if (null === bestItem) { bestItem = item; continue; }
                if ('augmentations' === prefer) {
                    if (true === ('augmentations' in item)) {
                        if (false === ('augmentations' in bestItem)) { bestItem = item; continue; }
                        if (bestItem.augmentations < item.augmentations) { bestItem = item; continue; }
                    }
                } else if (true === ('enchantment' in item)) {
                    if (true === ('enchantmentStrength' in item)) {
                        if (false === ('enchantmentStrength' in bestItem)) { bestItem = item; continue; }
                        if (bestItem.enchantmentStrength < item.enchantmentStrength) { bestItem = item; continue; }
                    }
                }
            }
            return bestItem
        },

        getItemIdentifier: (item, b64) => {
            if (false === ('itemID' in item)) throw '[ItemsHelper:getItemIdentifier] Cannot compute item identifier, missing itemID'
            b64 = b64 || false
            const identifier = {
                itemID: item.itemID,
                enchantmentID: 'enchantmentID' in item ? item.enchantmentID : null
            }
            return true === b64 ? btoa(identifier) : identifier
        }
    }
    window.ItemsHelper = ItemsHelper

    const SocketHelper = {
        decodeMessage: (message) => {
            if ('object' !== typeof message) { Tools.warn('[SocketHelper:decodeMessage] message is not an object but a', typeof message); return null; }
            if (false === ('data' in message)) { Tools.warn('[SocketHelper:decodeMessage] no data found in message'); return null; }
            const messageDataMatcher = message.data.match(/^\d+(.*)/)
            if (null === messageDataMatcher || 2 < messageDataMatcher.length) { Tools.warn('[SocketHelper:decodeMessage] cannot parse message data'); return null; }
            try {
                return JSON.parse(messageDataMatcher[1])
            } catch (err) {
                // Tools.warn(['[SocketHelper:decodeMessage] cannot parse message json data', err.message, message.data])
                return null
            }
        }
    }
    window.SocketHelper = SocketHelper

    class ItemSetManager {

        afterMutationTimeout = null
        gameInfo = null
        userID = null
        reactKey = null

        templates = {
            'item-set-manager-base': `
            <div id="item-set-manager">
                <strong>Item set manager</strong>
                <a class=item-set-manager-action id=item-set-manager-new-set>create empty set</a>
                <a class=item-set-manager-action id=item-set-manager-new-set-copy-equipped>create set with equipped items</a>
                <a class=item-set-manager-action id=item-set-manager-export>export</a>
                <a class=item-set-manager-action id=item-set-manager-import>import</a>
                <div id="item-set-manager-sets-container"></div>
            </div>
            `,
            'new-set': `<div class=item-set>
                            <input class=set-name placeholder=Name>
                            <ul class=set-items><li class="set-item-placeholder item equipment"></li></ul>
                            <div class=item-set-actions>
                                <div title=Equip class=item-set-equip>👕</div>
                                <div title=Delete class=item-set-delete>🗑️</div>
                            </div>
                        </div>`,
            'item-set': actualItem => {

                return `<li title="${actualItem.title.replace(/"/g, '\\"')}"
                             class="item equipment set-item${ 'equipped' in actualItem && true === actualItem.equipped ? ' equipped' : '' }"
                             data-slot="${actualItem.item.slot}"
                             data-item-id=${actualItem.itemID}
                             data-enchantment-id=${actualItem.enchantmentID || ''}
                         >
                         <img src="${actualItem.item.itemIcon || actualItem.item.itemImage}" class="item-icon" alt="">
                         ${ true === ('enchantment' in actualItem) ? `<div class="item-enchant"><img src="${actualItem.enchantment.buffIcon}"></div>` : '' }
                         ${ true === ('augmentations' in actualItem) ? `<div class="item-augment" style="color: rgb(144, 238, 144);">+${actualItem.augmentations}</div>` : '' }
                         <span style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"></span>
                         <div class=remover>&times;</div>
                         </li>`
            }
        }

        constructor() {
            const gameContainer = document.querySelector('.game-container')
            if (null === gameContainer) {
                alert('Game not loaded?')
                return
            }
            for (const key in gameContainer) {
                if (false === /^__reactInternalInstance/.test(key)) continue
                const reactData = gameContainer[key]
                window.reactDataKey = key
                if (false === ('child' in reactData) || false === ('child' in reactData.child) || false === ('memoizedProps' in reactData.child.child) || false === ('game' in reactData.child.child.memoizedProps)) continue
                this.gameInfo = reactData.child.child.memoizedProps.game
                this.userID = this.gameInfo.playerInformation.id
            }
            if (null === this.userID) {
                Tools.error('Cannot retrieve userID')
                return
            }
            window.itemSetEquipBuffer = []
            this.initInventoryObserver()
            this.injectCSS()
            Tools.waitForSelector('.inventory-container-all-items', this.injectItemSetManager.bind(this))
            document.body.addEventListener('click', event => {
                if (true === document.body.classList.contains('selecting-set-item') && null === event.target.closest('.set-item-placeholder') && null === event.target.closest('.vault-button')) {
                    document.body.classList.remove('selecting-set-item')
                    event.preventDefault()
                    event.stopPropagation()
                    const eventTarget = event.target.closest('.item')
                    const targetItemId = this.getElementItem(eventTarget)
                    const itemIdentifier = ItemsHelper.getItemIdentifier(targetItemId)
                    if (false !== itemIdentifier) {
                        this.addItemToSet(itemIdentifier, window.targetSet)
                        window.targetSet = null
                    }
                }
            })
            if (true === 'allSockets' in window && 'object' === typeof window.allSockets && true === ('length' in window.allSockets)) {
                window.allSockets.forEach(socket => {
                    socket.addEventListener('message', this.onSocketMessage.bind(this))
                })
            }
        }

        onSocketMessage(message) {
            const messageData = SocketHelper.decodeMessage(message)
            if (null === messageData || false === Tools.isArray(messageData)) return
            if ('update inventory' === messageData[0]) {
                if (0 !== window.itemSetEquipBuffer.length) {
                    Tools.warn(window.itemSetEquipBuffer.length + ' item(s) to equip remaining')
                    const itemId = window.itemSetEquipBuffer.pop()
                    if (undefined !== itemId) {
                        for (const socket of window.allSockets) {
                            socket.send(`42["equip item",${itemId}]`);
                        }
                    }
                }
                if (undefined !== window.itemSetsSocketMessageTimeout && null !== window.itemSetsSocketMessageTimeout) {
                    clearTimeout(window.itemSetsSocketMessageTimeout)
                }
                window.itemSetsSocketMessageTimeout = setTimeout(this.refreshItemSetManager.bind(this), 500)
            }
        }

        findItemIdInElement(element) {
            const elementItem = element.closest('.item')
            if (null === elementItem) return false

            // Search for an item id in target's React data
            if (false === (window.reactDataKey in elementItem)) throw '[ItemSetManager:findItemIdInElement] React data key not found in elementItem'
            const reactData = elementItem[window.reactDataKey]
            if (false === ('memoizedProps' in reactData) || false === ('children' in reactData.memoizedProps))  throw '[ItemSetManager:findItemIdInElement] Cannot parse element React data'
            for (let children of reactData.memoizedProps.children) {
                if ('' === children) continue
                if (false === ('props' in children) || false === ('item' in children.props) || false === ('id' in children.props.item)) continue;
                return children.props.item.id
            }

            // Search for an item id in target's classes
            if (null !== elementItem && true === elementItem.classList.contains('item') && true === elementItem.classList.contains('equipment')) {
                const itemInventoryIdMatch = elementItem.dataset.for.match(/^(\d+)/)
                if (false === (1 in itemInventoryIdMatch)) return
                return parseInt(itemInventoryIdMatch[1])
            }

            return false
        }

        getElementItem(element) {
            const elementItemId = this.findItemIdInElement(element)
            if (false === elementItemId) throw '[ItemSetManager:getElementItem] No item id found in element'
            return ItemsHelper.getInventoryItem(elementItemId)
        }

        initInventoryObserver() {
            // Observe .right-panel-content changes
            const observerTarget = document.querySelector('.right-panel-content')
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    clearTimeout(this.afterMutationTimeout)
                    this.afterMutationTimeout = setTimeout(this.injectItemSetManager.bind(this), 500)
                })
            })
            observer.observe(observerTarget, { subtree: true, childList: true })
        }

        injectItemSetManager() {
            if (null !== document.getElementById('item-set-manager')) return this.refreshItemSetManager()
            const container = document.querySelector('.inventory-container-all-items')
            if (null === container) return
            container.insertAdjacentHTML('beforebegin', this.templates['item-set-manager-base'])
            setTimeout(this.loadSets.bind(this), 500)

            document.getElementById('item-set-manager-new-set').addEventListener('click', event => {
                document.getElementById('item-set-manager-sets-container').insertAdjacentHTML('beforeend', this.templates['new-set'])
            })
            document.getElementById('item-set-manager-new-set-copy-equipped').addEventListener('click', event => {
                const setsContainer = document.getElementById('item-set-manager-sets-container')
                setsContainer.insertAdjacentHTML('beforeend', this.templates['new-set'])
                setsContainer.lastChild.querySelector('.set-name').value = 'Currently equipped items'
                const playerInventory = ItemsHelper.getPlayerInventory()
                if (false === ('equipment' in playerInventory)) return
                for (const equipment of playerInventory.equipment) {
                    this.addItemToSet(ItemsHelper.getItemIdentifier(equipment), setsContainer.lastChild, true)
                }
            })
            document.getElementById('item-set-manager-export').addEventListener('click', event => {
                const setsJSON = JSON.stringify(LocalStorageHelper.get('item-sets-' + this.userID))
                window.prompt('Copy this value:', setsJSON)
            })
            document.getElementById('item-set-manager-import').addEventListener('click', event => {
                const setsJSON = window.prompt('Paste an exported sets string here:')
                try {
                    const sets = JSON.parse(setsJSON)
                    let checkSetsError = false
                    for (let set of sets) {
                        if (false === ('name' in set)) { checkSetsError = 'missing name'; break; }
                        if (false === ('items' in set)) { checkSetsError = 'missing items'; break; }
                        if ('object' !== typeof set.items || false === ('length' in set.items)) { checkSetsError = 'wrong items'; break; }
                    }
                    if (false !== checkSetsError) {
                        alert('Invalid data, can\'t import sets: ' + checkSetsError)
                        return
                    }
                    const currentSets = LocalStorageHelper.get('item-sets-' + this.userID, [])
                    LocalStorageHelper.set('item-sets', [...currentSets, ...sets])
                    document.getElementById('item-set-manager-sets-container').innerHTML = ''
                    this.loadSets()
                } catch (err) {
                    Tools.error(err)
                    alert('Invalid data, can\'t import sets :(')
                }
            })
            document.getElementById('item-set-manager').addEventListener('keyup', event => {
                this.saveSets()
            })
            document.getElementById('item-set-manager').addEventListener('click', event => {
                if (true === event.target.classList.contains('item-set-delete')) {
                    const targetSet = event.target.closest('.item-set')
                    if (null === targetSet) return false
                    const setId = [...targetSet.parentNode.childNodes].indexOf(targetSet)
                    if (false === confirm(`Delete set #${setId + 1} ("${targetSet.querySelector('.set-name').value || 'unnamed'}")?`)) return false
                    targetSet.remove()
                    this.saveSets()
                    return false
                }
                if (true === event.target.classList.contains('item-set-equip')) {
                    const targetSet = event.target.closest('.item-set')
                    if (null === targetSet) return false
                    const setId = [...targetSet.parentNode.childNodes].indexOf(targetSet)
                    if (false === confirm(`Equip the items in set #${setId + 1} ("${targetSet.querySelector('.set-name').value}")?`)) return false
                    if (false === ('allSockets' in window) || 'object' !== typeof window.allSockets || false === ('length' in window.allSockets)) return false
                    targetSet.querySelectorAll('.set-item:not(.equipped)').forEach( (setItem, index) => {
                        const identifier = { itemID: setItem.dataset.itemId, enchantmentID: setItem.dataset.enchantmentId }
                        const actualItem = ItemsHelper.getInventoryItemByIdentifier(identifier)
                        if (null === actualItem) {
                            Tools.warn('no item found for identifier', identifier)
                            return
                        }
                        if (0 === index) {
                            for (const socket of window.allSockets) {
                                socket.send(`42["equip item",${actualItem.id}]`)
                            }
                        } else {
                            window.itemSetEquipBuffer.push(actualItem.id)
                        }
                    })
                }
                if (true === event.target.classList.contains('set-item-placeholder')) {
                    document.body.classList.add('selecting-set-item')
                    window.targetSet = event.target.closest('.item-set')
                    return false
                }
                if (true === event.target.classList.contains('remover') && null !== event.target.closest('.set-item')) {
                    const setItem = event.target.closest('.set-item')
                    if (null !== setItem) setItem.remove()
                    return false
                }
            })
        }

        addItemToSet(identifier, targetSet, skipSave, tries) {
            tries = tries || 0
            skipSave = skipSave || false
            if (null === identifier) return
            const playerInventory = ItemsHelper.getPlayerInventory().equipment
            const actualItem = ItemsHelper.getInventoryItemByIdentifier(identifier)
            if (null === actualItem) {
                Tools.warn(`[ItemSetManager:addItemToSet] Can't retrieve the actual item for identifier = ${JSON.stringify(identifier)}`)
                return
            }

            const sameSlotItem = targetSet.querySelector(`[data-slot="${actualItem.item.slot}"`)
            if (null !== sameSlotItem) {
                if (false === confirm(`There is already an item for the slot "${actualItem.item.slot}.\n\nDo you want to replace\n     - ${sameSlotItem.title}\nwith\n     - ${actualItem.title}\n?`)) {
                    return
                }
                sameSlotItem.remove()
            }
            actualItem.equipped = ItemsHelper.getPlayerInventory().equipment.some(item => item.id == actualItem.id)

            const placeholder = targetSet.querySelector('.set-item-placeholder')
            if (null === placeholder) return
            placeholder.insertAdjacentHTML('beforebegin', this.templates['item-set'](actualItem))

            false === skipSave && this.saveSets()
        }

        refreshItemSetManager() {
            if (0 !== window.itemSetEquipBuffer.length) {
                Tools.warn('still equipping items?')
                return
            }
            if (null === window.lastInventoryIds || window.lastInventoryIds === ItemsHelper.getPlayerInventoryIds().join(',')) {
                return
            }
            window.lastInventoryIds = ItemsHelper.getPlayerInventoryIds().join(',')
            if (null === document.getElementById('item-set-manager-sets-container')) return
            document.getElementById('item-set-manager-sets-container').innerHTML = ''
            this.loadSets()
        }

        saveSets() {
            const setsContainer = document.getElementById('item-set-manager-sets-container')
            if (null === setsContainer) return
            const sets = []
            setsContainer.querySelectorAll('.item-set').forEach(itemSet => {
                const set = {
                    'name': itemSet.querySelector('.set-name').value,
                    'items': []
                }
                itemSet.querySelectorAll('.set-item').forEach(setItem => {
                    set.items.push({itemID: setItem.dataset.itemId, enchantmentID: setItem.dataset.enchantmentId})
                })
                sets.push(set)
            })
            LocalStorageHelper.set('item-sets-' + this.userID, sets)
        }

        loadSets() {
            const setsContainer = document.getElementById('item-set-manager-sets-container')
            const savedSets = LocalStorageHelper.get('item-sets-' + this.userID, [])
            savedSets.forEach(set => {
                setsContainer.insertAdjacentHTML('beforeend', this.templates['new-set'])
                setsContainer.lastChild.querySelector('.set-name').value = set.name
                set.items.forEach(setItem => {
                    this.addItemToSet(setItem, setsContainer.lastChild, true)
                })
                this.saveSets()
            })
        }

        injectCSS() {
            document.head.insertAdjacentHTML('beforeend', `<style>
#item-set-manager { padding: 10px; }
#item-set-manager strong { border-bottom: 1px solid; font-size: 1.2em; }
#item-set-manager .item { width: 43px; height: 43px; }
#item-set-manager .item.equipped { box-shadow: 0 0 11px green; }
#item-set-manager-sets-container { max-height: 120px; overflow: auto; padding: 7px 0; }
.item-set-manager-action { user-select: none; display: inline-block; border: 1px solid #FFF; padding: 1px 6px; cursor: pointer; margin-left: 5px; }
.item-set { margin-top: 5px; }
.item-set input { width: auto; display: inline-block; color: #FFF; vertical-align: top; }
.item-set .set-name { margin: 0; vertical-align: baseline; }
.item-set .set-items { margin: 0; padding: 0; list-style: none; display: inline-block; vertical-align: middle; }
.item-set .set-items .set-item { margin: 0 5px 0 0; padding: 0; display: inline-block; vertical-align: middle; }
.item-set .set-items .set-item .remover { display: none; color: orange; cursor: pointer; position: absolute; bottom: 11px; right: 0; font-size: 1.7em; line-height: 0; }
.item-set .set-items .set-item:hover .remover { display: block; }
.item-set .set-items .set-item:hover .remover:hover { display: block; color: red; }
.item-set .set-items .set-item:nth-last-child(2) { margin-right: 15px; }
.item-set .item-set-actions { display: inline-block; vertical-align: middle; font-size: 1.8em; margin-left: 10px; }
.item-set .item-set-actions > div { cursor: pointer; display: inline; filter: grayscale(1); opacity: 0.5; transition: .1s all ease; }
.item-set .item-set-actions > div:hover { filter: none; opacity: 1; }
.item-set .set-item-placeholder { position: relative; }
.item-set .set-item-placeholder:before { content: '+'; position: absolute; font-size: 2.5em; opacity: 0.6; line-height: 0; top: 17px; left: 7px; }
body.selecting-set-item .all-items .item:not(.equipment),
body.selecting-set-item .nav-drawer-spacer,
body.selecting-set-item .nav-drawer,
body.selecting-set-item .play-area-chat-container,
body.selecting-set-item .combat-gear-inventory,
body.selecting-set-item .combat-zones,
body.selecting-set-item .combat-stats,
body.selecting-set-item .combat-gear > *:not(.combat-gear-item),
body.selecting-set-item .header-level-container,
body.selecting-set-item .nav-tab-container,
body.selecting-set-item .play-area.theme-mining,
body.selecting-set-item .play-area.theme-foraging,
body.selecting-set-item .play-area.theme-fishing,
body.selecting-set-item .play-area.theme-enchanting,
body.selecting-set-item .play-area.theme-runecrafting,
body.selecting-set-item .play-area.theme-smithing,
body.selecting-set-item .play-area.theme-default .crafting-contianer,
body.selecting-set-item .play-area.theme-cooking,
body.selecting-set-item .right-panel-currency
{ opacity: 0.4; filter: grayscale(0.7) blur(2px); cursor: not-allowed !important; }
#active-enchantments { margin: 0; padding: 0; list-style: none; }
#active-enchantments li { margin: 0; padding: 0; display: inline-block; width: 30px; height: 30px; position: relative }
#active-enchantments li img { height: 100%; width: 85%; object-fit: contain; filter: hue-rotate(120deg); }
</style>`)
        }
    }

    (function init() {
        Tools.waitForSelector('.right-panel-content', () => {
            window.itemSetManager = new ItemSetManager()
        })

        Tools.waitForSelector('.all-items', () => {
            ItemsHelper.retrieveIdlescapeItems()
        })
    })()

})()