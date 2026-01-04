// ==UserScript==
// @name         Steam Inventory Items Table
// @namespace    https://github.com/Kostya12rus/steam_inventory_stack/
// @supportURL   https://github.com/Kostya12rus/steam_inventory_stack/issues
// @version      1.0.1
// @description  Shows you all your items in a cool way.
// @author       Kostya12rus
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/id/*/inventory*
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504328/Steam%20Inventory%20Items%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/504328/Steam%20Inventory%20Items%20Table.meta.js
// ==/UserScript==

class MarketDescription {
    constructor(descriptionDict = {}) {
        this.type = descriptionDict.type || '';
        this.value = descriptionDict.value || '';
    }
}
class MarketAssetDescription {
    constructor(assetDescriptionDict = {}) {
        this.appid = assetDescriptionDict.appid || 0;
        this.classid = assetDescriptionDict.classid || '';
        this.instanceid = assetDescriptionDict.instanceid || '';
        this.name = assetDescriptionDict.name || '';
        this.nameColor = assetDescriptionDict.name_color || '';
        this.marketName = assetDescriptionDict.market_name || '';
        this.marketHashName = assetDescriptionDict.market_hash_name || '';

        this.tradable = Boolean(assetDescriptionDict.tradable || false);
        this.marketable = Boolean(assetDescriptionDict.marketable || false);
        this.commodity = Boolean(assetDescriptionDict.commodity || false);

        this.marketTradableRestriction = assetDescriptionDict.market_tradable_restriction || -1;
        this.marketMarketableRestriction = assetDescriptionDict.market_marketable_restriction || -1;

        this.iconUrl = assetDescriptionDict.icon_url || '';
        this.iconUrlLarge = assetDescriptionDict.icon_url_large || '';

        this.currency = assetDescriptionDict.currency || 0;
        this.descriptions = (assetDescriptionDict.descriptions || []).map(d => new MarketDescription(d));
        this.type = assetDescriptionDict.type || '';
        this.backgroundColor = assetDescriptionDict.background_color || '';
    }
}
class MarketItem {
    constructor(itemDict = {}) {
        this.name = itemDict.name || ' ';
        this.hashName = itemDict.hash_name || '';

        this.sellListings = itemDict.sell_listings || 0;
        this.sellPrice = itemDict.sell_price || 0;
        this.sellPriceText = itemDict.sell_price_text || '';
        this.salePriceText = itemDict.sale_price_text || '';

        this.assetDescription = new MarketAssetDescription(itemDict.asset_description || {});

        this.appName = itemDict.app_name || '';
        this.appIcon = itemDict.app_icon || '';
    }

    loadSave(data) {
        this.name = data.name || ' ';
        this.hashName = data.hashName || '';

        this.sellListings = data.sellListings || 0;
        this.sellPrice = data.sellPrice || 0;
        this.sellPriceText = data.sellPriceText || '';
        this.salePriceText = data.salePriceText || '';

        this.assetDescription = new MarketAssetDescription(data.assetDescription || {});

        this.appName = data.appName || '';
        this.appName = data.appName || '';
        return this;
    }

    toString() {
        return `<${this.constructor.name}> name: ${this.name}, price: ${this.sellPriceText}, listings: ${this.sellPrice}`;
    }

    isBugItem() {
        return this.hashName !== this.assetDescription.marketHashName;
    }

    isEmpty() {
        return this.hashName === '';
    }

    iconUrl() {
        if (!this.assetDescription.iconUrl) return '';
        return `https://community.akamai.steamstatic.com/economy/image/${this.assetDescription.iconUrl}/330x192?allow_animated=1`;
    }

    marketUrl() {
        if (!this.assetDescription.appid || !this.assetDescription.marketHashName) return '';
        return `https://steamcommunity.com/market/listings/${this.assetDescription.appid}/${this.assetDescription.marketHashName}`;
    }

    marketHashName() {
        return this.assetDescription.marketHashName;
    }

    color() {
        return this.assetDescription.nameColor ? `#${this.assetDescription.nameColor}`.replace('##', '#') : '';
    }

    isCurrentGame(appId) {
        return String(this.assetDescription.appid) === String(appId);
    }

    replaceNumberInCurrency(newNumber) {
        return this.sellPriceText.replace(/\d{1,3}(?:\s?\d{3})*(?:[,.]\d+)?/, newNumber);
    }

    generateNumberInCurrency(newNumber) {
        return this.replaceNumberInCurrency((newNumber / 100).toFixed(2));
    }

    multiplyPriceInCurrency(count) {
        return this.generateNumberInCurrency(this.sellPrice * count);
    }

    calculateCommission(price = null) {
        return this.generateNumberInCurrency(this.calculateCommissionInteger(price));
    }

    calculateCommissionInteger(price = null) {
        if (!price) price = this.sellPrice;
        const commission = Math.abs(price - (price / 115 * 100));
        return price - commission;
    }
}

class InventoryDescription {
    constructor(descriptionDict = {}) {
        this.type = descriptionDict.type || '';
        this.value = descriptionDict.value || '';
    }
}
class InventoryTag {
    constructor(tagDict = {}) {
        this.category = tagDict.category || '';
        this.internalName = tagDict.internal_name || '';
        this.categoryName = tagDict.category_name || '';
        this.name = tagDict.name || '';
    }
}
class InventoryItem {
    constructor(itemDict = {}) {
        this.classid = itemDict.classid || '';
        this.instanceid = itemDict.instanceid || '';
        this.amount = itemDict.amount || '1';

        const rgDescriptions = itemDict.rgDescriptions || {};
        this.rgDescriptions = {
            appid: rgDescriptions.appid || '',
            classid: rgDescriptions.classid || '',
            instanceid: rgDescriptions.instanceid || '',
            iconUrl: rgDescriptions.icon_url || '',
            iconUrlLarge: rgDescriptions.icon_url_large || '',
            iconDragUrl: rgDescriptions.icon_drag_url || '',
            name: rgDescriptions.name || '',
            marketHashName: rgDescriptions.market_hash_name || '',
            marketName: rgDescriptions.market_name || '',
            nameColor: rgDescriptions.name_color || '',
            backgroundColor: rgDescriptions.background_color || '',
            type: rgDescriptions.type || '',
            tradable: Boolean(rgDescriptions.tradable || false),
            marketable: Boolean(rgDescriptions.marketable || false),
            commodity: Boolean(rgDescriptions.commodity || false),
            marketTradableRestriction: rgDescriptions.market_tradable_restriction || '-1',
            marketMarketableRestriction: rgDescriptions.market_marketable_restriction || '7',
            descriptions: (rgDescriptions.descriptions || []).map(desc => new InventoryDescription(desc)),
            tags: (rgDescriptions.tags || []).map(tag => new InventoryTag(tag))
        };
    }

    updateRgDescriptions(rgDescriptions) {
        this.rgDescriptions = {
            appid: rgDescriptions.appid || '',
            classid: rgDescriptions.classid || '',
            instanceid: rgDescriptions.instanceid || '',
            iconUrl: rgDescriptions.icon_url || '',
            iconUrlLarge: rgDescriptions.icon_url_large || '',
            iconDragUrl: rgDescriptions.icon_drag_url || '',
            name: rgDescriptions.name || '',
            marketHashName: rgDescriptions.market_hash_name || '',
            marketName: rgDescriptions.market_name || '',
            nameColor: rgDescriptions.name_color || '',
            backgroundColor: rgDescriptions.background_color || '',
            type: rgDescriptions.type || '',
            tradable: Boolean(rgDescriptions.tradable || false),
            marketable: Boolean(rgDescriptions.marketable || false),
            commodity: Boolean(rgDescriptions.commodity || false),
            marketTradableRestriction: rgDescriptions.market_tradable_restriction || '-1',
            marketMarketableRestriction: rgDescriptions.market_marketable_restriction || '7',
            descriptions: (rgDescriptions.descriptions || []).map(desc => new InventoryDescription(desc)),
            tags: (rgDescriptions.tags || []).map(tag => new InventoryTag(tag))
        };
    }

    name() {
        if (!this.rgDescriptions.name) return '';
        return this.rgDescriptions.name;
    }

    iconUrl() {
        if (!this.rgDescriptions.iconUrl) return '';
        return `https://community.akamai.steamstatic.com/economy/image/${this.rgDescriptions.iconUrl}/330x192?allow_animated=1`;
    }

    marketUrl() {
        if (!this.rgDescriptions.appid || !this.rgDescriptions.marketHashName) return '';
        return `https://steamcommunity.com/market/listings/${this.rgDescriptions.appid}/${this.rgDescriptions.marketHashName}`;
    }

    color() {
        return this.rgDescriptions.nameColor ? `#${this.rgDescriptions.nameColor}`.replace('##', '#') : '';
    }
}
class InventoryManager {
    constructor(items = {}) {
        this.rgDescriptions = items.descriptions || {};
        if (typeof this.rgDescriptions !== 'object') {
            this.rgDescriptions = {};
        }
        this.rgInventory = items.assets || [];
        if (typeof this.rgInventory !== 'object') {
            this.rgInventory = [];
        }
        this.success = Boolean(items.success || false);
        this.inventory = [];

        this.parseInventory();
    }

    loadSaveInventory(oldData) {
        this.rgDescriptions = oldData.rgDescriptions || {};
        this.rgInventory = oldData.rgInventory || [];
        this.inventory = oldData.inventory || [];
        this.parseInventory();
        return this;
    }

    addNextInvent(nextInventory) {
        if (!(nextInventory instanceof InventoryManager)) return;
        this.rgInventory.push(...nextInventory.rgInventory);
        for (const [key, value] of Object.entries(nextInventory.rgDescriptions)) {
            this.rgDescriptions[key] = value;
        }
        this.parseInventory();
    }

    parseInventory() {
        this.inventory = [];

        for (const [key, item] of Object.entries(this.rgInventory)) {
            const inventoryItem = new InventoryItem(item);
            this.inventory.push(inventoryItem);
        }

        for (const item of this.inventory) {
            const classid = item.classid || 0;
            if (classid === 0) continue;

            const instanceid = item.instanceid || 0;
            for (const [key, itemDescription] of Object.entries(this.rgDescriptions)) {
                const classidD = itemDescription.classid || 0;
                if (classid !== classidD) continue;

                const instanceidD = itemDescription.instanceid || 0;
                if (instanceid !== instanceidD) continue;

                item.updateRgDescriptions(itemDescription);
                break;
            }
        }
    }
}

class TotalItem {
    constructor(classid) {
        this.classid = classid;
        this.items = [];
        this.marketData = null
    }
    addItem(item) {
        this.items.push(item);
    }
    setMarketData(marketData) {
        this.marketData = marketData;
    }

    getCount() {
        return this.items.reduce((total, _item) => total + parseInt(_item.amount), 0);
    }
    getConsolePrice(){
        if (!this.marketData) return 0;
        return this.marketData.sellPrice * this.getCount();
    }
    getConsolePriceOne(){
        if (!this.marketData) return 0;
        return this.marketData.sellPrice;
    }
    getOtherPrice(price = 0){
        if (!this.marketData) return null;
        return this.marketData.generateNumberInCurrency(price);
    }
    getPrice() {
        if (!this.marketData) return '';
        return this.marketData.multiplyPriceInCurrency(this.getCount());
    }
    getOnePrice() {
        if (!this.marketData) return '';
        return this.marketData.multiplyPriceInCurrency(1);
    }
    getIconUrl() {
        if (this.marketData)
        {
            return this.marketData.iconUrl();
        }
        else
        {
            const item = this.items[0];
            if (item)
            {
                return item.iconUrl();
            }
        }
        return '';
    }
    getMarketUrl() {
        if (this.marketData)
        {
            return this.marketData.marketUrl();
        }
        else
        {
            const item = this.items[0];
            if (item)
            {
                return item.marketUrl();
            }
        }
        return '';
    }
    getName() {
        if (this.marketData)
        {
            return this.marketData.name;
        }
        else
        {
            const item = this.items[0];
            if (item)
            {
                return item.name();
            }
        }
        return '';
    }
    getColor() {
        if (this.marketData)
        {
            return this.marketData.color();
        }
        else
        {
            const item = this.items[0];
            if (item)
            {
                return item.color();
            }
        }
        return '';
    }
}
class TotalItemsManager {
    constructor() {
        this.items = {};
        this.inventoryManager = new InventoryManager();
        this.marketItems = [];
        this.cachedData = {};
    }
    async loadTotalItems() {
        const { m_appid, m_contextid, m_steamid } = g_ActiveInventory;

        this.appid = m_appid;
        this.contextid = m_contextid;
        this.steamid = m_steamid;

        if (!this.cachedData) { this.cachedData = {}; }

        const cacheKey = `inventory_${this.steamid}_${this.appid}`;
        const now = new Date().getTime();

        if (this.cachedData[cacheKey] && this.cachedData[cacheKey].expiry > now) {
            this.inventoryManager = this.cachedData[cacheKey].inventoryManager;
            this.marketItems = this.cachedData[cacheKey].marketItems;
            this.parseItems();
            return;
        }

        this.inventoryManager = await this.getFullInventory();
        this.marketItems = await this.getGameMarketList();
        this.parseItems();

        if (!this.cachedData[cacheKey]) { this.cachedData[cacheKey] = {}; }

        this.cachedData[cacheKey].inventoryManager = this.inventoryManager;
        this.cachedData[cacheKey].marketItems = this.marketItems;
        this.cachedData[cacheKey].expiry = now + 10 * 60 * 1000;
    }
    parseItems() {
        this.items = [];
        for (const item of this.inventoryManager.inventory) {
            const classid = item.classid || 0;
            if (!this.items[classid]) {
                this.items[classid] = new TotalItem(classid);
            }
            this.items[classid].addItem(item);
        }
        for (const item of this.marketItems) {
            const classid = item.assetDescription.classid || 0;
            if (!this.items[classid]) {
                continue;
            }
            this.items[classid].setMarketData(item);
        }
    }

    async getGameMarketList(start = 0, count = 100) {
        const searchParams = new URLSearchParams({
            start: start,
            count: count,
            search_descriptions: 0,
            sort_column: 'popular',
            sort_dir: 'desc',
            appid: this.appid,
            norender: 1
        });

        const searchUrl = `https://steamcommunity.com/market/search/render/?${searchParams.toString()}`;
        let _marketItems = [];

        try {
            const marketResponse = await fetch(searchUrl, { method: 'GET', timeout: 10000 });
            if (marketResponse.ok) {
                const responseData = await marketResponse.json();
                if (responseData.success) {
                    const items = responseData.results.map(itemData => new MarketItem(itemData));
                    _marketItems = _marketItems.concat(items);
                    const totalItemsAvailable = responseData.total_count || 0;
                    if (totalItemsAvailable > start + count && start + count < 1000) {
                        start += count;
                        const additionalItems = await this.getGameMarketList(start, count);
                        _marketItems = _marketItems.concat(additionalItems);
                    }
                    return _marketItems;
                }
            }
        } catch (e) {
            console.error(`getGameMarketList failed: ${e.message}`);
        }
        return _marketItems;
    }
    async  getFullInventory() {
        try {
            const inventoryManager = new InventoryManager();
            return await this.getInventoryItems(inventoryManager);
        } catch (error) {
            console.error("Ошибка при получении предметов инвентаря:", error);
        }
        return this.inventoryManager;
    }
    getInventoryItems(inventoryManager, start_assetid = null) {
        const searchParams = new URLSearchParams({
            count: 2000,
        });
        if (start_assetid) {
            searchParams.set('start_assetid', start_assetid);
        }
        const url = `https://steamcommunity.com/inventory/${this.steamid}/${this.appid}/${this.contextid}?${searchParams.toString()}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                throw new Error("Не удалось получить данные инвентаря.");
            }
            inventoryManager.addNextInvent(new InventoryManager(data));
            const more_items = data.more_items;
            if (Number.isInteger(more_items) && more_items > 0) {
                return this.getInventoryItems(inventoryManager, data.last_assetid);
            }
            return inventoryManager;
        })
        .catch(error => {
            console.error("Ошибка проверки инвентаря:", error);
            throw error;
        });
    }
}

class ModalWindow {
    constructor(userNickname, userAvatar) {
        this.userNickname = userNickname
        this.userAvatar = userAvatar
        this.items = [];

        this.overlay = document.createElement('div');
        this.modal = document.createElement('div');
        this.closeButton = document.createElement('button');

        this.settingModal();
    }

    settingModal() {
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.display = 'flex';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.opacity = '0';
        this.overlay.style.transition = 'opacity 0.3s ease-in-out';
        this.overlay.addEventListener('click', this.closeModal.bind(this));

        this.modal.style.padding = '30px';
        this.modal.style.backgroundColor = '#242424';
        this.modal.style.borderRadius = '12px';
        this.modal.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
        this.modal.style.color = '#e0e0e0';
        this.modal.style.width = '800px';
        this.modal.style.maxHeight = '90vh';
        this.modal.style.overflowY = 'auto';
        this.modal.style.position = 'relative';
        this.modal.style.transform = 'scale(0.9)';
        this.modal.style.opacity = '0';
        this.modal.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        this.modal.addEventListener('click', function(event) { event.stopPropagation(); });

        this.closeButton.innerText = '✖';
        this.closeButton.style.position = 'absolute';
        this.closeButton.style.top = '10px';
        this.closeButton.style.right = '10px';
        this.closeButton.style.background = 'none';
        this.closeButton.style.border = 'none';
        this.closeButton.style.color = '#fff';
        this.closeButton.style.fontSize = '20px';
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.addEventListener('click', this.closeModal.bind(this));

        this.modal.appendChild(this.closeButton);

        this.addProfileInfo();
        this.addInventoryTable();

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.modal.style.transform = 'scale(1)';
            this.modal.style.opacity = '1';
        });
    }
    addProfileInfo() {
        this.profileContainer = document.createElement('div');
        this.profileContainer.style.display = 'flex';
        this.profileContainer.style.alignItems = 'center';
        this.profileContainer.style.justifyContent = 'center';
        this.profileContainer.style.marginBottom = '10px';
        this.profileContainer.style.color = '#ffffff';

        this.avatar = document.createElement('img');
        this.avatar.src = this.userAvatar;
        this.avatar.alt = 'Profile Avatar';
        this.avatar.style.width = '60px';
        this.avatar.style.height = '60px';
        this.avatar.style.borderRadius = '50%';
        this.avatar.style.marginRight = '15px';

        this.infoContainer = document.createElement('div');
        this.infoContainer.style.display = 'flex';
        this.infoContainer.style.alignItems = 'center';

        this.nickname = document.createElement('h2');
        this.nickname.innerText = this.userNickname;
        this.nickname.style.margin = '0 20px 0 0';
        this.nickname.style.fontSize = '20px';
        this.nickname.style.fontWeight = 'bold';
        this.nickname.style.color = '#6a5acd';

        this.detailsContainer = document.createElement('div');
        this.detailsContainer.style.display = 'flex';
        this.detailsContainer.style.alignItems = 'center';

        const itemCountContainer = document.createElement('div');
        itemCountContainer.style.marginRight = '20px';
        const itemCountLabel = document.createElement('p');
        itemCountLabel.innerText = 'Количество вещей';
        itemCountLabel.style.fontSize = '14px';
        itemCountLabel.style.color = '#b0c4de';
        itemCountLabel.style.margin = '0';
        itemCountLabel.style.textAlign = 'center';
        this.itemCountValue = document.createElement('p');
        this.itemCountValue.innerText = `123`;
        this.itemCountValue.style.margin = '0';
        this.itemCountValue.style.fontSize = '16px';
        this.itemCountValue.style.fontWeight = 'bold';
        this.itemCountValue.style.textAlign = 'center';
        this.itemCountValue.style.color = '#ffffff';

        itemCountContainer.appendChild(itemCountLabel);
        itemCountContainer.appendChild(this.itemCountValue);

        const inventoryValueContainer = document.createElement('div');
        const inventoryValueLabel = document.createElement('p');
        inventoryValueLabel.innerText = 'Сумма инвентаря';
        inventoryValueLabel.style.fontSize = '14px';
        inventoryValueLabel.style.color = '#b0c4de';
        inventoryValueLabel.style.margin = '0';
        inventoryValueLabel.style.textAlign = 'center';
        this.inventoryValue = document.createElement('p');
        this.inventoryValue.innerText = ``;
        this.inventoryValue.style.margin = '0';
        this.inventoryValue.style.fontSize = '16px';
        this.inventoryValue.style.fontWeight = 'bold';
        this.inventoryValue.style.textAlign = 'center';
        this.inventoryValue.style.color = '#ffffff';

        inventoryValueContainer.appendChild(inventoryValueLabel);
        inventoryValueContainer.appendChild(this.inventoryValue);

        this.detailsContainer.appendChild(itemCountContainer);
        this.detailsContainer.appendChild(inventoryValueContainer);

        this.infoContainer.appendChild(this.nickname);
        this.infoContainer.appendChild(this.detailsContainer);

        this.profileContainer.appendChild(this.avatar);
        this.profileContainer.appendChild(this.infoContainer);

        this.modal.appendChild(this.profileContainer);
    }
    addInventoryTable() {
        this.table = document.createElement('table');
        this.table.style.width = '100%';
        this.table.style.borderCollapse = 'separate';
        this.table.style.borderSpacing = '0';
        this.table.style.borderRadius = '8px';
        this.table.style.overflow = 'hidden';
        this.table.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = [' ', 'Название предмета', 'Количество', 'Цена за штуку', 'Цена за все'];
        const textAligns = ['left', 'left', 'center', 'right', 'right'];

        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.innerText = headerText;
            th.style.borderBottom = '1px solid #ccc';
            th.style.textAlign = textAligns[index];
            th.style.cursor = 'pointer';
            th.setAttribute('data-order', 'asc');
            th.addEventListener('click', () => this.sortTableByColumn(index));
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        this.table.appendChild(thead);

        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);

        this.modal.appendChild(this.table);
    }
    sortTableByColumn(columnIndex) {
        const rows = Array.from(this.tbody.querySelectorAll('tr'));
        const isNumeric = columnIndex !== 1;
        const header = this.table.rows[0].cells[columnIndex];

        const order = header.getAttribute('data-order') === 'desc' ? 'asc' : 'desc';
        header.setAttribute('data-order', order);

        rows.sort((a, b) => {
            let aValue = a.cells[columnIndex].dataset.sort;
            let bValue = b.cells[columnIndex].dataset.sort;

            if (isNumeric) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }

            if (order === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });

        while (this.tbody.firstChild) {
            this.tbody.removeChild(this.tbody.firstChild);
        }

        rows.forEach(row => this.tbody.appendChild(row));
    }
    addItemToTable(item) {
        const row = document.createElement('tr');

        const imgCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.getIconUrl();
        img.alt = item.getName();
        img.style.height = '30px';
        img.style.width = 'auto';
        imgCell.appendChild(img);
        row.appendChild(imgCell);

        const nameCell = document.createElement('td');
        nameCell.style.color = item.getColor();
        nameCell.dataset.sort = item.getName();

        const nameLink = document.createElement('a');
        nameLink.href = item.getMarketUrl();
        nameLink.innerText = item.getName();
        nameLink.style.color = 'inherit';
        nameLink.style.textDecoration = 'none';
        nameLink.target = "_blank";
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.innerText = item.getCount();
        quantityCell.style.textAlign = 'center';
        quantityCell.dataset.sort = item.getCount();
        row.appendChild(quantityCell);

        const pricePerItemCell = document.createElement('td');
        pricePerItemCell.innerText = item.getOnePrice();
        pricePerItemCell.style.textAlign = 'right';
        pricePerItemCell.dataset.sort = item.getConsolePriceOne();
        row.appendChild(pricePerItemCell);

        const totalPriceCell = document.createElement('td');
        totalPriceCell.innerText = item.getPrice();
        totalPriceCell.style.textAlign = 'right';
        totalPriceCell.dataset.sort = item.getConsolePrice();
        row.appendChild(totalPriceCell);

        this.tbody.appendChild(row);
    }

    addItem(newItem) {
        if (!newItem || newItem.getName() === '') { return; }

        this.items.push(newItem);
        this.addItemToTable(newItem);

        const totalCount = this.items.reduce((total, item) => total + item.getCount(), 0);
        this.itemCountValue.innerText = `${totalCount}`;

        const totalPriceFloat = this.items.reduce((total, item) => total + item.getConsolePrice(), 0);
        const itemWithMarketData = this.items.find(_item => _item.marketData);
        if (itemWithMarketData) {
            this.inventoryValue.innerText = `${itemWithMarketData.getOtherPrice(totalPriceFloat)}`;
        }
    }

    closeModal() {
        this.overlay.style.opacity = '0';
        this.modal.style.transform = 'scale(0.9)';
        this.modal.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(this.overlay);
        }, 300);
    }
}

(function() {
    'use strict';
    const appInventoryManager = new TotalItemsManager();
    createButton();

    async function localAppData() {
        await appInventoryManager.loadTotalItems()
        if (Object.keys(appInventoryManager.items).length === 0) {
            alert('Не удалось получить список предметов. Пожалуйста, попробуйте позже');
            return;
        }

        const nickNameElement = document.querySelector('.profile_small_header_name > a');
        const avatarUrlElement = document.querySelector('.profile_small_header_avatar .playerAvatar > img');

        const nickName = nickNameElement ? nickNameElement.textContent.trim() : '';
        const avatarUrl = avatarUrlElement ? avatarUrlElement.src : '';

        const modalWindow = new ModalWindow(nickName, avatarUrl);
        const sortedItemsList = Object.entries(appInventoryManager.items)
            .sort(([keyA], [keyB]) => keyA - keyB)
            .map(([key, value]) => value);

        sortedItemsList.forEach(item => modalWindow.addItem(item));

    }

    function createButton() {
        const button = document.createElement("button");
        button.innerText = "All Items Table";
        button.classList.add("btn_darkblue_white_innerfade");
        button.style.width = "100%";
        button.style.height = "30px";
        button.style.lineHeight = "30px";
        button.style.fontSize = "15px";
        button.style.position = "relative";
        button.style.zIndex = "2";

        button.addEventListener("click", async function() {
            if (button.disabled) return;
            button.disabled = true;
            try { await localAppData(); }
            catch (error) { console.error(error); }
            button.disabled = false;
        });
        function updateButtonText() {
            const gameNameElement = document.querySelector('.name_game');
            if (gameNameElement) {
                button.disabled = true;
                let remainingTime = 5;
                const gameName = gameNameElement.textContent.trim();

                button.innerText = `All Items Table in ${gameName} (wait ${remainingTime} sec)`;
                const timer = setInterval(() => {
                    if (gameName !== gameNameElement.textContent.trim()) {
                        clearInterval(timer);
                        return;
                    }

                    remainingTime--;
                    button.innerText = `All Items Table in ${gameName} (wait ${remainingTime} sec)`;

                    if (remainingTime <= 0) {
                        clearInterval(timer);
                        button.innerText = `All Items Table in ${gameName}`;
                        button.disabled = false;
                    }
                }, 1000);
            }
        }
        function waitForElement(selector) {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutations, observer) => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    updateButtonText();
                }
            });
        });
        waitForElement('.name_game').then((target) => {
            observer.observe(target, { childList: true, subtree: true, characterData: true });
            updateButtonText();
        });
        const referenceElement = document.querySelector('#tabcontent_inventory');
        if (referenceElement) {
            referenceElement.parentNode.insertBefore(button, referenceElement);
            updateButtonText();
        }
    }
})();
