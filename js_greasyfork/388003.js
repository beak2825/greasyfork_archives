// ==UserScript==
// @name         Bazaar Scam Warning
// @namespace    https://www.torn.com/forums.php#/p=threads&f=67&t=16110432
// @version      2.1
// @description  Puts a big red warning on items that are priced way above their market value
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388003/Bazaar%20Scam%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/388003/Bazaar%20Scam%20Warning.meta.js
// ==/UserScript==

const settings = {
    priceThresholdRelativeToMarketValue: 1.5,
};

const apiDataByItemId = new Map();
const equipmentItemTypes = ['Primary', 'Secondary', 'Melee', 'Defensive'];

(async function() {
    const itemsList = await truthy(() => document.querySelector('.bazaar-main-wrap .items-list'));
    const itemListItems = Array.from(itemsList.children).filter(li => ! li.classList.contains('empty'));
    insertWarningsForItemListItemsIfPriceIsTooHigh(itemListItems);

    new MutationObserver(handleChangedItemsListChildren).observe(itemsList, {childList: true});
})();

async function insertWarningsForItemListItemsIfPriceIsTooHigh(itemListItems) {
    if (itemListItems.length === 0) {
        return;
    }

    const itemIds = itemListItems
        .map(li => parseInt(li.querySelector('.img-wrap').getAttribute('itemid'), 10))
        .filter(unique);

    try {
        await ensureApiDataIsLoadedForItems(itemIds);
    } catch (error) {
        alert('The user script "Bazaar Scam Warning" could not load items data. This might be a temporary hiccup, but if it continues to fail, please contact the author (Sulsay [2173590]) so the problem can be dealt with. Thanks for your patience!');
    }

    itemListItems
        .filter(isNotEquipment)
        .filter(isPriceTooHigh)
        .forEach(insertWarning);
}

function handleChangedItemsListChildren(mutations) {
    let newItemListItems = [];
    for (let mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            newItemListItems = Array.from(mutation.addedNodes).filter(li => ! li.classList.contains('empty'));
            break;
        }
    }
    insertWarningsForItemListItemsIfPriceIsTooHigh(newItemListItems);
}

function isNotEquipment(itemListItem) {
    return ! equipmentItemTypes.includes(getItemApiDataForItemListItem(itemListItem).type);
}

function isPriceTooHigh(itemListItem) {
    const listedPrice = parseInt(itemListItem.querySelector('.price').innerText.replace('$', '').replace(/,/g, ''));
    return listedPrice > getItemApiDataForItemListItem(itemListItem).market_value * settings.priceThresholdRelativeToMarketValue;
}

function getItemApiDataForItemListItem(itemListItem) {
    const itemId = parseInt(itemListItem.querySelector('.img-wrap').getAttribute('itemid'), 10);
    return apiDataByItemId.get(itemId);
}

function insertWarning(itemListItem) {
    const descriptionSpan = itemListItem.querySelector('.desc');
    descriptionSpan.style.color = 'red';
    descriptionSpan.style.fontWeight = 'bold';

    const priceSpan = descriptionSpan.querySelector('.price');
    priceSpan.innerText = `!! ${priceSpan.innerText} !!`;
}

async function ensureApiDataIsLoadedForItems(itemIds) {
    const itemIdsToFetch = itemIds.filter(itemId => ! apiDataByItemId.has(itemId));
    if (itemIdsToFetch.length === 0) {
        return Promise.resolve();
    }

    const items = await fetchItems(itemIds);
    for (let item of items) {
        apiDataByItemId.set(item.id, item);
    }
}

function fetchItems(itemIds) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://arsonwarehouse.com/api/v1/items?id=' + itemIds.join(','),
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                if (response.status !== 200) {
                    return reject(new Error('HTTP status code ' + response.status));
                }
                try {
                    const responseJson = JSON.parse(response.responseText);
                    if (responseJson.error) {
                        return reject(new Error(responseJson.error.error || 'Unknown error'));
                    }
                    resolve(responseJson);
                } catch (error) {
                    reject(error)
                }
            },
            onerror: (error) => {
                reject(error)
            }
        });
    });
}

function unique(item, index, array) {
    return array.indexOf(item) === index;
}

function truthy(handler) {
    return new Promise(resolve => {
        const resolveIfHandlerReturnsTruthy = () => {
            let result = handler();
            if (result) {
                resolve(result);
            } else {
                setTimeout(resolveIfHandlerReturnsTruthy, 100);
            }
        };
        resolveIfHandlerReturnsTruthy();
    });
}