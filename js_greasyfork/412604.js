// ==UserScript==
// @name         SimpleMMO Market
// @namespace    simple-mmo.com
// @version      1.003
// @description  SimpleMMO Clicker
// @author       Anton
// @match        https://web.simple-mmo.com/market/*
// @match        https://web.simple-mmo.com/inventory*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412604/SimpleMMO%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/412604/SimpleMMO%20Market.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, SimpleMmoHelper */

(function() {
    'use strict';

    const maxFastPrice = 200;
    const isWorthPercent = 0.60;
    const minPriceDifference = 100;

    const collectableMaxPrice = 9500;
    const materialMaxPrice = 3800;
    const small_Staff_price = 2500;
    const big_Staff_price = 4000;

    const safeModeMinMoney = 200000;
    const safeModeMaxPrice = maxFastPrice + 100;

    // id: price
    const isStandard = {
        // Jacks Starter Shop
        2: 70, // Simple Dagger
        6: 200, // Bootleg T-Shirt
        74: 400, // Some Geezers Bow
        241: 600, // Generic Shirt
        281: 700, // Leather Armour
        // Ronwarus Fruit and Veg Shop
        56: 400, // Special Carrot
        180: 200, // Cheese
        182: 300, // Pie
        611: 12000, // Mushroom of Energy +1
        946: 800, // Delicious Pie
        // Johns Locksmith Shop
        18: 21000, // Bronze Key
        571: 55000, // Silver Key
        // Sojas Pet Shop
        741: 2000, // Rat
        730: 15000, // Boar
        734: 100000, // Golem
        // Mysterious Shop
        171: 50000, // The Hamburger
        720: 150000, // The Great Wall of China
        723: 130000, // The Nokia
        145: 35000, // Scalpel of Death
        // Toms Tools
        12289: 500, // Rusty Axe
        12290: 10000, // Weak Axe
        12296: 500, // Rusty Fishing Rod
        12297: 10000, // Weak Fishing Rod
        12303: 500, // Rusty Shovel
        12304: 10000, // Weak Shovel
        12309: 500, // Rusty Pickaxe
        12310: 10000, // Weak Pickaxe
    };

    const tools = [
        12289, // Rusty Axe
        12290, // Weak Axe
        12296, // Rusty Fishing Rod
        12297, // Weak Fishing Rod
        12303, // Rusty Shovel
        12304, // Weak Shovel
        12309, // Rusty Pickaxe
        12310, // Weak Pickaxe
    ];

    // maximal buy price, maximal sell price
    const maxPrices = {
        // staff corrercted to be more than 2000 (with 60% worth)
        1: [999, 1500], // Wooden Stick
        2: 480, // Simple Dagger
        8: 1200, // Horrible Dagger
        16: [small_Staff_price, 3000], // Staff of Fire
        19: 2000, // Massacre
        23: 990, // The Last Thing You'll Ever See
        26: 990, // Endbringer
        62: [1500, 2000], // T-Shirt for the Homeless
        63: [800, 1000], // Barbarians T-Shirt
        64: 900, // Light Dagger
        65: 1000, // Simple Dagger Mk II
        68: 1200, // Upgraded Dagger
        71: 990, // Budget Sword
        73: 1000, // Bow for Bandits
        75: 1000, // Bow of Saint Nicholas
        76: 890, // Broad Sword
        79: 990, // Suprise Mothertrucker
        81: [small_Staff_price, 3000], // Staff of Leeroy
        82: [small_Staff_price, 3000], // Staff of Destiny
        83: [small_Staff_price, 3000], // Staff of Everything Ever
        86: 1000, // Smart Price Mace
        87: 1900, // Silence
        90: 1300, // Slapling
        91: [700, 1000], // The Devils Right Hand -> https://web.simple-mmo.com/user/view/189343
        93: [4000, 5000], // Sword of Doughnuts -> https://web.simple-mmo.com/user/view/366753
        103: [99000, 125000], // Panty Dropper -> https://web.simple-mmo.com/user/view/287999 (100k), https://web.simple-mmo.com/user/view/192548 (125k)
        115: [big_Staff_price, 5000], // Staff of Savages
        182: [180, 200], // Pie ->https://web.simple-mmo.com/user/view/85012
        183: 4000, // Orange
        632: [4000, 5000], // Darkheart -> https://web.simple-mmo.com/user/view/366753
        638: [4000, 5000], // Heartbreaker -> https://web.simple-mmo.com/user/view/366753
        727: 9000, // Dino with Jeans
        728: [7000, 9800], // Brown Horse
        729: [7000, 9800], // White Horse
        730: 13500, // Boar
        731: 250000, // Mr. Cactus
        740: [10000, 13000], // Black Horse
        741: 1400, // Rat
        756: 900, // Strong Amulet of Defence
        775: 1700, // Peasents Shield
        805: 8500, // A Legendary Dagger
        882: 600, // Poor Mans Boots
        905: 600, // Vindicator Padded Footsteps
        912: 690, // Conqueror's Walkers of the King
        942: 1050, // Raw Fish
        943: 2000, // Raw Meat
        945: 9000, // Pineapple
        946: 500, // Delicious Pie -> https://web.simple-mmo.com/user/view/85012
        949: 1850, // Black Hat
        954: 690, // Mr Floppy
        956: 690, // Unholy
        958: 2000, // Headcover
        1185: [12500, 15000], // Iron ball -> https://web.simple-mmo.com/user/view/62342
        1272: 100000, // Candy Cane -> https://web.simple-mmo.com/user/view/85012
        2089: [2000, 3000], // Bread -> https://web.simple-mmo.com/user/view/85012
        4096: 200000, // Magical Candy Cane -> https://web.simple-mmo.com/user/view/85012
        5037: [40000, 50000], // Birthday Cake -> https://web.simple-mmo.com/user/view/85012
        5040: [750000, 1000000], // Cookie -> https://web.simple-mmo.com/user/view/85012
        8484: 600, // Ebon Kilt of Damned Voices II
        8495: 600, // Skirt of Damned Worlds I
        9220: 140000, // Balthazars Runestone
        // Materials
        11575: [6500, 7000], // Common Wood -> https://web.simple-mmo.com/user/view/413327 and 80831
        11582: [1900, 2000], // Copper Ore -> https://web.simple-mmo.com/user/view/80831
        11589: [6500, 7000], // Goldfish -> https://web.simple-mmo.com/user/view/413327
        11590: [8000, 9000], // Shrimp -> https://web.simple-mmo.com/user/view/80831
        11591: [6500, 7000], // Sardine -> https://web.simple-mmo.com/user/view/80831
        11594: [6500, 7000], // Tuna -> https://web.simple-mmo.com/user/view/80831
        11602: [16000, 17000], // Jewel -> https://web.simple-mmo.com/user/view/80831, https://web.simple-mmo.com/user/view/413327
        11603: [6500, 7000], // Dinosaur Skull -> https://web.simple-mmo.com/user/view/413327 and 80831
        12629: 100000, // Magical Sweet -> https://web.simple-mmo.com/user/view/85012
        15436: [35000, 40000], // Yellow Fire In Jar -> https://web.simple-mmo.com/user/view/385801
        15437: [13000, 14000], // Green Fire In Jar -> https://web.simple-mmo.com/user/view/385801
        15450: [50000, 69000], // Love Letter -> https://web.simple-mmo.com/user/view/370954
    };

    for (let itemId in isStandard) {
        if (isStandard.hasOwnProperty(itemId)) {
            let mp = maxPrices[itemId];
            if (mp) {
                if (typeof mp !== 'number') mp = mp[1];
                if (isStandard[itemId] < mp) {
                    console.log('[Price correction] item', itemId, 'from', mp, 'to', isStandard[itemId]);
                    maxPrices[itemId] = isStandard[itemId];
                }
            }
        }
    }

    function num(n) { return parseInt(n.replaceAll(',', '')); }

    const helper = {
        getDialog() {
            return $('.swal2-container.swal2-center.swal2-shown');
        },
        setColorForLine(oneLine, price, storedPrice, isWorthBuying) {
            if (storedPrice) {
                if (isWorthBuying) {
                    oneLine.css('background-color', 'yellowgreen');
                } else if (helper.isGoodPrice(price, storedPrice)) {
                    oneLine.css('background-color', 'darkseagreen');
                } else if (price <= maxFastPrice) {
                    oneLine.css('background-color', 'palegreen');
                } else {
                    oneLine.css('background-color', '');
                }
            } else {
                oneLine.css('background-color', 'beige');
            }
        },
        updateItemLinePrice(id, storedPrice) {
            const lineDiv = $('div[data-item-id=' + id + ']');
            for (let i = 0; i < lineDiv.length; i++) {
                const oneLine = $(lineDiv[i]);
                const price = oneLine.attr('data-item-price');
                helper.setColorForLine(oneLine, price, storedPrice);
                oneLine.find('.storage-price-42').text(storedPrice);
            }
        },
        isAutoStarted() {
            return localStorage.getItem('smmoAuto') == 'started';
        },
        isGoodPrice(price, storedPrice) {
            return (price > 5000 && price <= storedPrice) || (storedPrice - price >= Math.max(storedPrice * 0.05, minPriceDifference));
        },
        getCurrentGold() {
            return num($('#current_gold').text().trim());
        },
    };

    const storage = {
        prices: undefined,
        maxPrices: undefined,
        collectables: undefined,
        materials: undefined,
        updatePrices() {
            if (this.prices === undefined) {
                const pricesObj = localStorage.getItem('smmoPrices');
                if (pricesObj) {
                    this.prices = JSON.parse(pricesObj);
                }
                if (!this.prices) {
                    this.prices = {};
                }
            }
        },
        updateMaxPrices() {
            if (this.maxPrices === undefined) {
                const pricesObj = localStorage.getItem('smmoMaxPrices');
                if (pricesObj) {
                    this.maxPrices = JSON.parse(pricesObj);
                }
                if (!this.maxPrices) {
                    this.maxPrices = {};
                }
            }
        },
        updateMaterials() {
            if (this.materials === undefined) {
                const materialsObj = localStorage.getItem('smmoMaterials');
                if (materialsObj) {
                    this.materials = JSON.parse(materialsObj);
                }
                if (!this.materials) {
                    this.materials = {};
                }
            }
        },
        updateCollectables() {
            if (this.collectables === undefined) {
                const collectablesObj = localStorage.getItem('smmoCollectables');
                if (collectablesObj) {
                    this.collectables = JSON.parse(collectablesObj);
                }
                if (!this.collectables) {
                    this.collectables = {};
                }
            }
        },
        setPrice(id, price) {
            console.log('Storing price for ID', id, 'price', price);
            this.updatePrices();
            this.prices[id] = price;
            const data = JSON.stringify(this.prices);
            localStorage.setItem('smmoPrices', data);
        },
        getPrice(id) {
            this.updatePrices();
            return this.prices[id];
        },
        getMaxPrice(id) {
            //this.updateMaxPrices();
            //return this.maxPrices[id];
            const storedPrice = maxPrices[id];
            if (storedPrice) {
                if (typeof storedPrice === 'number') return [storedPrice * isWorthPercent, storedPrice];
            }
            return storedPrice;
        },
        setCollectable(id) {
            console.log('Setting ID', id, 'as COLLECTABLE');
            this.updateCollectables();
            this.collectables[id] = 1;
            const data = JSON.stringify(this.collectables);
            localStorage.setItem('smmoCollectables', data);
        },
        getCollectable(id) {
            this.updateCollectables();
            return this.collectables[id];
        },
        setMaterial(id) {
            if (tools.indexOf(id) > 0) return this.removeMaterial(id);
            console.log('Setting ID', id, 'as MATERIAL');
            this.updateMaterials();
            this.materials[id] = 1;
            const data = JSON.stringify(this.materials);
            localStorage.setItem('smmoMaterials', data);
        },
        removeMaterial(id) {
            this.updateMaterials();
            if (this.materials[id]) {
                console.log('Removing ID', id, 'from MATERIAL');
                delete this.materials[id];
                const data = JSON.stringify(this.materials);
                localStorage.setItem('smmoMaterials', data);
            }
        },
        getMaterial(id) {
            this.updateMaterials();
            return this.materials[id];
        }
    };

    const init = {
        showItemName() {
            const m = location.search.match(/itemid=(\d+)/);
            if (m && m.length > 1) {
                const id = num(m[1]);
                const titles = $('.kt-subheader__title');
                for (let i = 0; i < titles.length; i++) {
                    const title = $(titles[i]);
                    if (title.text().trim().toLowerCase() == 'market listings') {
                        const container = title.closest('.kt-container');
                        const name = $('span[id^=item-id-]:eq(0)').text();
                        container.append('<div style="width:40%"><input value="' + id + '"/><br/><input value="' + name + '" style="width:100%"/></div>');
                        return;
                    }
                }
                console.log('[WARN] no market title');
            }
        },
        addSuggestedPrice() {
            const amountBlocks = $('.swal2-content strong');
            for (let i = 0; i < amountBlocks.length; i++) {
                const txt = $(amountBlocks[i]).text().toLowerCase().trim();
                if (txt.indexOf('amount') > -1) {
                    if (txt.indexOf('recommend') == -1) {
                        const priceSpan = $('span[id^=average-price-');
                        const m = priceSpan.attr('id').match(/average-price-(\d+)/);
                        if (m && m.length > 1) {
                            const id = num(m[1]);
                            const maxPrice = storage.getMaxPrice(id);
                            if (maxPrice) {
                                $(amountBlocks[i]).append('<span style="margin-left:20px;">Recommend:&nbsp;' + maxPrice[1] + '</span>');
                                return;
                            }
                        }
                    }
                }
            }

            const valueBlocks = $('#swal2-content > div:nth-child(3) > div.row > div:nth-child(1)');
            if (valueBlocks.length == 1 && valueBlocks.find('span:eq(0)').text().toLowerCase() == 'value') {
                if (valueBlocks.find('#recomment-price-42').length == 0) {
                    const itemLink = $('.swal2-footer a[href*=market]').attr('href');
                    const m = itemLink.match(/itemid=(\d+)/);
                    if (m && m.length > 1) {
                        const itemId = num(m[1]);
                        const prices = storage.getMaxPrice(itemId);
                        if (prices) {
                            valueBlocks.append('<div id="recomment-price-42" style="font-size:15px">R: <img src="/img/icons/I_GoldCoin.png" width="20px"> ' + prices[1] + '</div>');
                        }
                    }
                }
            }
        },
        run() {
            SimpleMmoHelper.addToolButton(205, "SimpleMmoTools.buy100();", `Buy ${maxFastPrice}`, 'market-button-42');
            this.showItemName();
            setInterval(this.addSuggestedPrice, 500);
        }
    };

    const sniffer = {
        timerId: undefined,
        run() {
            this.timerId = setInterval(this.do, 500);
        },
        stop() {
            clearInterval(this.timerId);
            this.timerId = undefined;
        },
        do() {
            const dialog = helper.getDialog();
            if (dialog.length > 0) {
                const links = $(".swal2-footer a[href]");
                let id;
                for (let i = 0; i < links.length; i++) {
                    const linkHref = $(links[i]).attr('href');
                    const m = linkHref.match(/itemid=(\d+)/);
                    if (m && m.length > 1) {
                        id = parseInt(m[1]);
                        break;
                    }
                }

                if (!id) {
                    console.log('[Sniffer] failed to parse ID');
                    return;
                }

                const sellLink = dialog.find('.swal2-footer a[onclick^=quickSell]');
                const m = sellLink.text().match(/([\d,]+)/);
                if (m && m.length > 1) {
                    const sellPrice = num(m[1]);
                    if (!storage.getPrice(id)) {
                        storage.setPrice(id, sellPrice);
                        helper.updateItemLinePrice(id, sellPrice);
                    }
                }

                const content = $('.swal2-content').text().toLowerCase().trim();
                if (content.indexOf('collectable') > -1 && content.indexOf('+0') > -1) {
                    if (!storage.getCollectable(id)) {
                        storage.setCollectable(id);
                    }
                }
                if (content.indexOf('material') > -1 && content.indexOf('+0') > -1) {
                    if (tools.indexOf(id) > -1) {
                        storage.removeMaterial(id);
                    } else if (!storage.getMaterial(id)) {
                        storage.setMaterial(id);
                    };
                }
            }
        }
    };

    const autobuy = {
        currentGold: 0,
        errorsCount: 0,
        isWorking: false,
        tobuy: { low: [], medium: [], high: [] },
        reset() {
            this.tobuy = { low: [], medium: [], high: [] };
            this.errorsCount = 0;
        },
        low(item) {
            console.log('[CART LOW]', item);
            this.tobuy.low.push(item);
        },
        medium(item) {
            console.log('[CART MEDIUM]', item);
            this.tobuy.medium.push(item);
        },
        high(item) {
            console.log('[CART HIGH]', item);
            this.tobuy.high.push(item);
        },
        getTotalCount() {
            return this.tobuy.low.length + this.tobuy.medium.length + this.tobuy.high.length;
        },
        isEmpty() {
            return this.getTotalCount() == 0;
        },
        getNextItem() {
            if (this.tobuy.high.length > 0) {
                return this.tobuy.high.shift();
            } else if (this.tobuy.medium.length > 0) {
                return this.tobuy.medium.shift();
            } else if (this.tobuy.low.length > 0) {
                return this.tobuy.low.shift();
            }
        },
        buyItem(item) {
            console.log('[LOG] processing item', item);
            console.log('[MARKET] ITEMS:', this.getTotalCount() + 1);
            if (item.price <= this.currentGold) {
                $('a[id=' + item.marketId + ']').trigger('click');
                this.pressOk(item);
            } else {
                console.log('[NO MONEY]');
            }
        },
        pressOk(item) {
            if (!this.isWorking) return;
            this.updateTitle('- ITEM');
            const okButton = $('.swal2-actions button.swal2-confirm');
            const buttonText = okButton.text().toLowerCase();
            if (!okButton || (buttonText.indexOf('buy') == -1 && buttonText.indexOf('remove') == -1)) {
                setTimeout(() => this.pressOk(item), 250); // wait more
            } else {
                console.log('[LOG] pressing OK');
                this.updateTitle('- BUY');
                const isRemoveButton = buttonText.indexOf('remove') > -1;
                setTimeout(() => {
                    if (!this.isWorking) return;
                    if (isRemoveButton) {
                        okButton.trigger('click');
                        this.pressConfirm(item);
                    } else {
                        const m = buttonText.match(/[\d,]+/);
                        if (m.length > 0) {
                            const priceOnButton = num(m[0]);
                            if (priceOnButton != item.price) {
                                console.log('price incorrect', item.price, priceOnButton);
                                this.updateTitle('PRICE WRONG');
                            } else {
                                okButton.trigger('click');
                                this.pressConfirm(item);
                            }
                        } else {
                            console.log('[FAIL] to parse price from OK button');
                        }
                    }
                }, SimpleMmoHelper.randomTimeout(500));
            }
        },
        pressConfirm(item) {
            if (!this.isWorking) return;
            this.updateTitle('- CONFIRM');
            const okButton = $('.swal2-actions button.swal2-confirm');
            const buttonText = okButton.text().toLowerCase();
            if (!okButton || buttonText.indexOf('yes') == -1) {
                setTimeout(() => this.pressConfirm(item), 250); // wait more
            } else {
                console.log('[LOG] pressing Confirm');
                setTimeout(() => {
                    const messageText = $('.swal2-content').text().toLowerCase();
                    const requestError = messageText.indexOf('request failed') > -1;
                    if (requestError) {
                        this.updateTitle('FAIL REQUEST');
                        this.errorsCount++;
                        console.log('[REQUEST ERROR] item', item);
                        $('a[id=' + item.marketId + ']').hide();
                        setTimeout(() => {
                            $('.swal2-cancel').trigger('click');
                            //this.isWorking = false;
                        }, SimpleMmoHelper.randomTimeout(300));
                        return;
                    }

                    if (!this.isWorking) return;
                    okButton.trigger('click');
                    setTimeout(() => {
                        this.pressOkInAlert(item);
                    }, SimpleMmoHelper.randomTimeout(150));
                }, SimpleMmoHelper.randomTimeout(300));
            }
        },
        pressOkInAlert(item) {
            if (!this.isWorking) return;
            this.updateTitle('- OK ALERT');
            const okButton = $('.swal2-actions button.swal2-confirm');
            const buttonText = okButton.text().toLowerCase();
            if (!okButton || buttonText.indexOf('ok') == -1) {
                if (okButton && buttonText.indexOf("yes, do it") != -1) {
                    console.log('[LOG] pressing "Yes, do it" in alert');
                    this.pressConfirm(item);
                    return;
                } else {
                    setTimeout(() => this.pressOkInAlert(item), 250); // wait more
                }
            } else {
                console.log('[LOG] pressing OK in alert. Button text', buttonText);
                setTimeout(() => {
                    if (!this.isWorking) return;
                    if (!okButton.is(':visible')) {
                        console.log('[pressOkInAlert] button OK not found');
                        this.updateTitle('NO BUTTON OK');
                        setTimeout(() => {
                            if (!this.isWorking) return;
                            this.isWorking = false;
                            this.startBuyProcess();
                        }, SimpleMmoHelper.randomTimeout(400));
                        return;
                    }
                    okButton.trigger('click');
                    const messageText = $('.swal2-content').text().toLowerCase();
                    const notExists = messageText.indexOf('no longer exists') > -1;
                    const requestError = messageText.indexOf('request failed') > -1;
                    if (notExists || requestError) {
                        this.errorsCount++;
                        if (notExists) console.log('[NOT EXISTS] item', item);
                        if (requestError) console.log('[REQUEST ERROR] item', item);
                        $('a[id=' + item.marketId + ']').hide();
                    } else {
                        this.currentGold -= item.price;
                    }
                    if (this.errorsCount < 5) {
                        this.updateTitle();
                        setTimeout(() => {
                            if (!this.isWorking) return;
                            this.isWorking = false;
                            this.startBuyProcess();
                        }, SimpleMmoHelper.randomTimeout(400))
                    } else {
                        console.log('[TOO MUCH ERRORS] need reload');
                    }
                }, SimpleMmoHelper.randomTimeout(300));
            }
        },
        updateTitle(caption) {
            SimpleMmoHelper.setTitle('CART ' + this.getTotalCount() + (this.errorsCount > 0 ? ' E ' + this.errorsCount : '') + (caption ? ' ' + caption : ''));
        },
        sortArrays() {
            const sortFuncPriceAsc = (a,b) => a.price - b.price;
            const sortPriceDifferenceDesc = (a,b) => (b.storedPrice - b.price) - (a.storedPrice - a.price);
            const sortCanGetMoneyDesc = (a,b) => ((b.maxPrice ? b.maxPrice : b.storedPrice) - b.price) - ((a.maxPrice ? a.maxPrice : a.storedPrice) - a.price);
            this.tobuy.low.sort(sortFuncPriceAsc);
            this.tobuy.medium.sort(sortPriceDifferenceDesc);
            this.tobuy.high.sort(sortCanGetMoneyDesc);
        },
        startBuyProcess() {
            this.currentGold = helper.getCurrentGold();
            autobuy.sortArrays();
            if (!this.isEmpty()) {
                if (!this.isWorking) {
                    this.isWorking = true;
                    this.updateTitle('START');
                    const nextItem = this.getNextItem();
                    if (nextItem) {
                        this.buyItem(nextItem);
                    } else {
                        this.isWorking = false;
                    }
                }
            } else {
                console.log('[BUY] finished');
                SimpleMmoHelper.setTitle('READY');
                this.isWorking = false;
            }
        },
        isWorthBuying(id, price) {
            const maxPrice = storage.getMaxPrice(id);
            if (maxPrice && price) {
                return price <= maxPrice[0];
            }
            const isCollectable = storage.getCollectable(id);
            if (isCollectable && price <= collectableMaxPrice) {
                return true;
            }
            const isMaterial = storage.getMaterial(id);
            if (isMaterial && price <= materialMaxPrice) {
                return true;
            }
            return false;
        }
    };

    const SimpleMmoTools = {
        coloredMarket() {
            const items = $('.infinite-scroll a');
            for (let i = 0; i < items.length; i++) {
                const item = $(items[i]);
                const onclick = item.attr('onclick');
                const m = onclick.match(/retrieveMarketItem\((\d+),[^,]+,\s?'?([\d,]+)/);
                if (m.length > 2) {
                    const id = parseInt(m[1]);
                    const price = num(m[2]);
                    if (!isNaN(id) && !isNaN(price)) {
                        //console.log('ITEM', id, 'PRICE', price, 'STORE', storage.getPrice(id));
                    } else {
                        console.log('[ERROR] line', i);
                        continue;
                    }

                    const storedPrice = storage.getPrice(id);
                    const itemStoragePrice = item.find('.storage-price-42');
                    const isWorthBuying = autobuy.isWorthBuying(id, price);
                    if (itemStoragePrice.length == 0) {
                        const rightPart = item.find('.col-xs-4');
                        rightPart.append('<span class="storage-price-42">' + (storedPrice ? storedPrice : '?') + '</span>');
                    } else {
                        itemStoragePrice.text(storedPrice ? storedPrice : '?');
                    }

                    const isCollectable = storage.getCollectable(id);
                    if (isCollectable) {
                        const itemCollectableLabel = item.find('.is-collectable-42');
                        if (itemCollectableLabel.length == 0) {
                            const rightPart = item.find('.col-xs-8');
                            rightPart.append('<span class="is-collectable-42" style="color:darkcyan;">Collectable</span>');
                        }
                    }

                    const isMaterial = storage.getMaterial(id);
                    if (isMaterial) {
                        const itemMaterialLabel = item.find('.is-material-42');
                        if (itemMaterialLabel.length == 0) {
                            const rightPart = item.find('.col-xs-8');
                            rightPart.append('<span class="is-material-42" style="color:chocolate;">Material</span>');
                        }
                    }

                    const lineDiv = item.find('div').first();
                    helper.setColorForLine(lineDiv, price, storedPrice, isWorthBuying);

                    if (id && !lineDiv.attr('data-item-id')) {
                        lineDiv.attr('data-item-id', id);
                        lineDiv.attr('data-item-price', price);
                    }
                }
            }
        },
        buy100() {
            if (helper.isAutoStarted()) {
                console.log('[Stop first!]');
                return;
            }

            autobuy.reset();
            const items = $('.infinite-scroll a:visible');
            const gold = helper.getCurrentGold();
            if (gold < safeModeMinMoney) console.log('[SAFE MODE!]');
            for (let i = 0; i < items.length; i++) {
                const item = $(items[i]);
                const div = item.find('div[data-item-id]');
                const price = num(div.attr('data-item-price'));
                if (gold >= safeModeMinMoney || price <= safeModeMaxPrice) {
                    const id = num(div.attr('data-item-id'));
                    const storedPrice = storage.getPrice(id);
                    if (!isStandard[id] || (price == 100 && id != 2) || (storedPrice && price <= storedPrice * 0.1)) {
                        const marketId = item.attr('id');
                        const maxPrice = storage.getMaxPrice(id);
                        const itemObj = { id, price, marketId, storedPrice, maxPrice: maxPrice ? maxPrice[1] : undefined };
                        if (autobuy.isWorthBuying(id, price)) {
                            autobuy.high(itemObj)
                        } else if (storedPrice && helper.isGoodPrice(price, storedPrice)) {
                            autobuy.medium(itemObj)
                        } else if (price <= maxFastPrice || (storedPrice && price == storedPrice)) {
                            autobuy.low(itemObj)
                        }
                    } else {
                        console.log('[IGNORE] Item id', id, 'is standard');
                    }
                }
            }
            autobuy.startBuyProcess();
        },
        runMarket() {
            sniffer.run();
            this.coloredMarket();
            console.log('[AUTO]', helper.isAutoStarted());
        }
    };

    const localInit = () => {
        init.run();
        SimpleMmoTools.runMarket();
    };

    const starter = () => {
        if (typeof unsafeWindow !== 'undefined') {
            if (typeof unsafeWindow.SimpleMmoHelper === 'object') {
                localInit();

                if (unsafeWindow.SimpleMmoTools === undefined) {
                    unsafeWindow.SimpleMmoTools = SimpleMmoTools;
                } else {
                    unsafeWindow.SimpleMmoTools = { ...unsafeWindow.SimpleMmoTools, ...SimpleMmoTools };
                }
            } else {
                setTimeout(starter, 100);
            }
        } else {
            console.log('[ERROR] unsafewindow not found');
        }
    };
    starter();
})();