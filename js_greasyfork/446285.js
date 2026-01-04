// ==UserScript==
// @name         MIRPriceHelperPlus
// @description  生产成本快速计算(改)
// @namespace    mirror
// @version      0.1.1.1
// @author       玛吉卡帕瓦 - 柔风海湾(原)/Toumei99改
// @match        https://5p.nbbjack.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446285/MIRPriceHelperPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/446285/MIRPriceHelperPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ext_getValue(key, default_value) {
        let val = window.localStorage.getItem(key);
        if (val === undefined || val === null) {
            return default_value;
        }
        try {
            val = JSON.parse(val);
            if (val == '[]') {
                val = []
            }
            return val;
        } catch (err) {
            console.trace(err);
            return val;
        }
    }

    function ext_setValue(key, val) {
        return window.localStorage.setItem(key, JSON.stringify(val));
    }

    const delay = (t) => {
        return new Promise((r) => {
            setTimeout(()=>{
            r();
            }, t*1000)
        })
    }

    let queryMap = {};
    async function queryJSON(url) {
        if (!queryMap[url]) {
            const req = new Promise(async (resolve, reject) => {
                console.log(url);
                let tryCount = 0;
                const maximumTryCount = 5;
                while (1) {
                    tryCount ++;
                    try {
                        let res = await (await fetch(url)).json()
                        resolve(res)
                        return;
                    } catch (err) {
                        if (tryCount >= maximumTryCount) {
                            delete queryMap[url];
                            reject(new Error());
                            return;
                        } else {
                            await delay(1);
                        }
                    }
                }
            });
            queryMap[url] = req;
        }
        return queryMap[url];
    }

    let itemNameMapItem = ext_getValue("mir.itemNameMapItem", {});
    let itemIdMapItem = ext_getValue("mir.itemIdMapItem", {});
    async function queryItemByName(itemName) {
        if (itemNameMapItem[itemName]) {
            console.log(itemNameMapItem[itemName]);
            return itemNameMapItem[itemName];
        }
        const api = `https://cafemaker.wakingsands.com/search?indexes=item&string=${itemName}`;
        const allList = (await queryJSON(api)).Results;
        let items = [];
        allList.forEach((item) => {
            let aItem = {
                'id': item.ID, 'name': item.Name, 'icon': `https://cafemaker.wakingsands.com${item.Icon}`
            };
            items.push(aItem);
            itemIdMapItem[item.ID] = aItem;
        });
        console.log(items);
        ext_setValue("mir.itemIdMapItem", itemIdMapItem);
        itemNameMapItem[itemName] = items;
        ext_setValue("mir.itemNameMapItem", itemNameMapItem);
        return items;
    }

    async function queryItemById(itemId) {
        if (itemIdMapItem[itemId]) {
            console.log(itemIdMapItem[itemId]);
            return itemIdMapItem[itemId];
        }
        const api = `https://cafemaker.wakingsands.com/item/${itemId}`;
        const dict = (await queryJSON(api));
        let item = {
            'id': itemId, 'name': dict.Name_chs, 'icon': `https://cafemaker.wakingsands.com${dict.Icon}`
        };
        console.log(item);
        itemIdMapItem[itemId] = item;
        ext_setValue("mir.itemIdMapItem", itemIdMapItem);
        itemNameMapItem[item.name] = item;
        ext_setValue("mir.itemNameMapItem", itemNameMapItem);
        return item;
    }

    let itemServerListingMapPrice = ext_getValue("mir.itemServerListingMapPrice", {});
    const cacheTime = 10*60*1000;   // 10min
    let worldName = ext_getValue('mir.worldName', '宇宙和音');
    let serverName = ext_getValue('mir.serverName', '陆行鸟');
    const listingCount = 1;
    async function queryPriceByItemId(itemId) {
        let key = `${itemId}-${worldName}-${serverName}-${listingCount}`;
        if (itemServerListingMapPrice[key]) {
            let cachePrice = itemServerListingMapPrice[key];
            if (new Date().getTime() - cachePrice.timestamp < cacheTime) {
                console.log('cache price', cachePrice);
                return cachePrice;
            }
        }
        // const api = `https://universalis.app/api/v2/${serverName}/${itemId}?noGst=true&listings=${listingCount}`;
        const api = `https://universalis.app/api/v2/${serverName}/${itemId}?noGst=true`;
        const allList = (await queryJSON(api));

        let listingItems = [];
        let historyItems = [];
        let lowestItem = null;
        console.log(allList);
        allList.listings.forEach((item) => {
            let aItem = {
                'worldName': item.worldName,
                'pricePerUnit': item.pricePerUnit,
                'timestamp': item.lastReviewTime
            };
            if (aItem.worldName === worldName) {
                listingItems.push(aItem);
            }
            if (!lowestItem || lowestItem.pricePerUnit > aItem.pricePerUnit) {
                lowestItem = aItem;
            }
        });
        allList.recentHistory.forEach((item) => {
            historyItems.push({
                'worldName': item.worldName,
                'pricePerUnit': item.pricePerUnit,
                'timestamp': item.timestamp
            });
        });
        listingItems = listingItems.sort((a, b) => {return a.pricePerUnit - b.pricePerUnit});
        historyItems = historyItems.sort((a, b) => {return a.pricePerUnit - b.pricePerUnit});
        const price =  {
            "timestamp": new Date().getTime(),
            "itemId": itemId,
            "itemName": itemIdMapItem[itemId].name,
            "listing": listingItems,
            "history": historyItems,
            "lowest": lowestItem
        };
        itemServerListingMapPrice[key] = price;
        ext_setValue("mir.itemServerListingMapPrice", itemServerListingMapPrice);
        return price;
    }

    async function queryPriceByItemName(itemName) {
        const items = await queryItemByName(itemName);
        if (!items || items.length == 0) {
            return null;
        }
        const item = items[0];
        const price = await queryPriceByItemId(item.id);
        return price;
    }

    $('body').prepend(`
        <style>
        .mir-nav {
            float: right;
        }

        .mir-wrapper {
            color: #DED7BE;
            text-shadow: -1px 0 2px #795516, 0 1px 2px #795516, 1px 0 2px #795516, 0 -1px 2px #795516;
            font-family: "Meiryo";
            white-space: nowrap;
            margin: 0 5px;
        }

        .mir-price-wrapper {
            float: right;
        }

        .mir-sum-wrapper {
            border: 1px solid #DED7BE;
            margin: 0 0 0 20px;
            padding: 1px 5px;
            text-align: center;
        }
        </style>
    `)

    let serverWorldMap = {
        '猫小胖': ['紫水栈桥', '延夏', '静语庄园', '摩杜纳', '海猫茶屋', '柔风海湾', '琥珀原'],
        '莫古力': ['白银乡', '白金幻象', '神拳痕', '潮风亭', '旅人栈桥', '拂晓之间', '龙巢神殿', '梦羽宝境'],
        '陆行鸟': ['红玉海', '神意之地', '拉诺西亚', '幻影群岛', '萌芽池', '宇宙和音', '沃仙曦染', '晨曦王座'],
        '豆豆柴': ['水晶塔', '银泪湖', '太阳海岸', '伊修加德', '红茶川'],
    };

    setInterval(() => {
        if ($('#top .mir-nav').length <= 0) {
            $('#top').append(`<div class='mir-nav'></div>`);
            const wrapper = $('#top .mir-nav');
            function serverSelect() {
                let html = `<select class="mir-server-select">`;
                Object.keys(serverWorldMap).forEach(name => {
                    html += `<option value="${name}" ${(name == serverName) ?'selected="selected"' :''}>${name}</option>`;
                });
                html += `</select>`;
                return html;
            }

            function worldSelect(serverName) {
                let html = `<select class="mir-world-select">`;
                serverWorldMap[serverName].forEach(name => {
                    html += `<option value="${name}" ${(name == worldName) ?'selected="selected"' :''}>${name}</option>`;
                });
                html += `</select>`;
                return html;
            }
            wrapper.append(serverSelect());
            wrapper.append(worldSelect(serverName));

            function onServerChange() {
                serverName = $('.mir-server-select').val();
                ext_setValue('mir.serverName', serverName);
                console.log(`${serverName}`);

                $(".mir-world-select").remove();
                wrapper.append(worldSelect(serverName));
                $(".mir-world-select").change(onWorldChange);
                onWorldChange();
            }

            function onWorldChange() {
                worldName = $(".mir-world-select").val();
                ext_setValue('mir.worldName', worldName);
                console.log(`${worldName}`);
            }

            $(".mir-server-select").change(onServerChange);
            $(".mir-world-select").change(onWorldChange);
        }

        $('.ivu-modal-body .copyname').each(async function(){
            const itemName = $(this).text();
            const parent = $(this).parents('li')[0];
            if ($(parent).find('.mir-price-wrapper').length <= 0) {
                $(parent).append(`<div class="mir-wrapper mir-price-wrapper"><span class="mir-world">...</span><span>|</span><span class="mir-server">...</span></div>`);
                const wrapper = $(parent).find('.mir-price-wrapper');
                queryPriceByItemName(itemName).then((price) => {
                    if (!price) {
                        return;
                    }
                    if (price.listing && price.listing.length > 0) {
                        wrapper.find('.mir-world').text(price.listing[0].pricePerUnit);
                    } else {
                        console.log(price);
                        wrapper.find('.mir-world').text('无记录');
                    }
                    if (price.lowest) {
                        wrapper.find('.mir-server').text(`${price.lowest.pricePerUnit}(${price.lowest.worldName.substr(0, 1)})`);
                    } else {
                        console.log(price);
                        wrapper.find('.mir-server').text('无记录');
                    }
                });
            };
            if (!$(parent).hasClass('mir-item')) {
                $(parent).addClass('mir-item');
            }
        });

        $('.ivu-modal-body .treeview').children('ul').each(function(){
            if ($(this).find('.mir-sum-wrapper').length <= 0) {
                $(this).append('<div class="mir-wrapper mir-sum-wrapper">总计: ......</div>');
            }
            const wrapper = $(this).find('.mir-sum-wrapper');

            let worldSum = 0;
            let worldNoCount = 0;
            let serverSum = 0;
            let serverNoCount = 0;
            let itemCount = 0;
            $(this).find('.mir-item').each(function(){
                itemCount++;
                let count = 1;
                const countText = $(this).find('.copyname').parent().next().text();
                if (countText.length > 0 && countText.indexOf('x') >= 0) {
                    count = parseInt(countText.substr(countText.indexOf('x') + 1));
                }
                $(this).find('.mir-world').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        worldNoCount ++; return;
                    }
                    worldSum += parseInt($(elem).text()) * count;
                });
                $(this).find('.mir-server').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        serverNoCount ++; return;
                    }
                    serverSum += parseInt($(elem).text()) * count;
                });
            });
            if (itemCount > 0) {
                wrapper.text(`总计: ${worldSum}${worldNoCount > 0 ?`(${worldNoCount}项无记录)` :''}  |  ${serverSum}${serverNoCount > 0 ?`(${serverNoCount}项无记录)` :''}`);
            } else {
                wrapper.text('');
            }
        });

        $('.ivu-row-flex .copyname').each(async function(){
            const itemName = $(this).text();
            const parent = $(this).parents('li')[0];
            if ($(parent).find('.mir-price-wrapper').length <= 0) {
                $(parent).append(`<div class="mir-wrapper mir-price-wrapper"><span class="mir-world">...</span><span>|</span><span class="mir-server">...</span></div>`);
                const wrapper = $(parent).find('.mir-price-wrapper');
                queryPriceByItemName(itemName).then((price) => {
                    if (!price) {
                        return;
                    }
                    if (price.listing && price.listing.length > 0) {
                        wrapper.find('.mir-world').text(price.listing[0].pricePerUnit);
                    } else {
                        console.log(price);
                        wrapper.find('.mir-world').text('无记录');
                    }
                    if (price.lowest) {
                        wrapper.find('.mir-server').text(`${price.lowest.pricePerUnit}(${price.lowest.worldName.substr(0, 1)})`);
                    } else {
                        console.log(price);
                        wrapper.find('.mir-server').text('无记录');
                    }
                });
            };
            if (!$(parent).hasClass('mir-item')) {
                $(parent).addClass('mir-item');
            }
        });

        $('.ivu-row-flex .treeview').children('ul').each(function(){
            if ($(this).find('.mir-sum-wrapper').length <= 0) {
                $(this).append('<div class="mir-wrapper mir-sum-wrapper">总计: ......</div>');
            }
            const wrapper = $(this).find('.mir-sum-wrapper');

            let worldSum = 0;
            let worldNoCount = 0;
            let serverSum = 0;
            let serverNoCount = 0;
            let itemCount = 0;
            $(this).find('.mir-item').each(function(){
                itemCount++;
                let count = 1;
                const countText = $(this).find('.copyname').parent().next().text();
                if (countText.length > 0 && countText.indexOf('x') >= 0) {
                    count = parseInt(countText.substr(countText.indexOf('x') + 1));
                }
                $(this).find('.mir-world').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        worldNoCount ++; return;
                    }
                    worldSum += parseInt($(elem).text()) * count;
                });
                $(this).find('.mir-server').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        serverNoCount ++; return;
                    }
                    serverSum += parseInt($(elem).text()) * count;
                });
            });
            if (itemCount > 0) {
                wrapper.text(`总计: ${worldSum}${worldNoCount > 0 ?`(${worldNoCount}项无记录)` :''}  |  ${serverSum}${serverNoCount > 0 ?`(${serverNoCount}项无记录)` :''}`);
            } else {
                wrapper.text('');
            }
        });

         $('.ivu-row-flex .item-list').each(function(){
            if ($(this).find('.mir-sum-wrapper').length <= 0) {
                $(this).append('<div class="mir-wrapper mir-sum-wrapper" style="margin-top:50px">总计: ......</div>');
            }
            const wrapper = $(this).find('.mir-sum-wrapper');

            let worldSum = 0;
            let worldNoCount = 0;
            let serverSum = 0;
            let serverNoCount = 0;
            let itemCount = 0;
            $(this).find('.mir-item').each(function(){
                itemCount++;
                let count = 1;
                const countText = $(this).find('.copyname').parent().next().text();
                if (countText.length > 0 && countText.indexOf('x') >= 0) {
                    count = parseInt(countText.substr(countText.indexOf('x') + 1));
                }
                $(this).find('.mir-world').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        worldNoCount ++; return;
                    }
                    worldSum += parseInt($(elem).text()) * count;
                });
                $(this).find('.mir-server').each((_, elem) => {
                    if ($(elem).text() === '无记录') {
                        serverNoCount ++; return;
                    }
                    serverSum += parseInt($(elem).text()) * count;
                });
            });
            if (itemCount > 0) {
                wrapper.text(`总计: ${worldSum}${worldNoCount > 0 ?`(${worldNoCount}项无记录)` :''}  |  ${serverSum}${serverNoCount > 0 ?`(${serverNoCount}项无记录)` :''}`);
            } else {
                wrapper.text('');
            }
        });
    }, 1000);
})();