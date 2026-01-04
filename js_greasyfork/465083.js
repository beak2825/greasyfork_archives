// ==UserScript==
// @name         Paid for things
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  New pips!
// @author       tharglet
// @match        https://myfigurecollection.net/?*mode=view&*tab=collection&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfigurecollection.net
// @grant        GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/465083/Paid%20for%20things.user.js
// @updateURL https://update.greasyfork.org/scripts/465083/Paid%20for%20things.meta.js
// ==/UserScript==

//Polyfill for GM_addStyle for Greasemonkey...
if(typeof GM_addStyle == 'undefined') {
    GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

GM_addStyle(`
.item-custompip {
    display: block;
    position: absolute;
    right: 1px;
    bottom: 1px;
    height: 16px;
    padding: 1px 2px 2px 3px;
    line-height: 16px;
    color: white;
}

.item-is-paid {
    background-color: green;
}

.item-is-shipped {
    background-color: gold;
}

.item-is-stored {
    background-color: orangered;
}

.icon-dollar:before {
    font-family: serif !important;
    content: "$";
    font-weight: bolder !important;
}

.icon-plane:before {
    font-family: serif !important;
    content: "🛩️";
    font-weight: bolder !important;
}

.icon-stored:before {
    font-family: serif !important;
    content: "🏭";
    font-weight: bolder !important;
}
`);

(async function() {
    'use strict';

    const parser = new DOMParser();

    const appendPip = (itemClassName, pipClassName, itemElement) => {
        const shippedPipContainer = document.createElement('span');
        shippedPipContainer.classList.add('item-custompip', itemClassName);
        const shippedPip = document.createElement('span');
        shippedPip.classList.add('tiny-icon-only', pipClassName);
        shippedPipContainer.appendChild(shippedPip);
        itemElement.appendChild(shippedPipContainer);
    };

    const isUsersPreorderPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get("status");
        if(status == 1) {
            let loggedInUser = document.querySelector(".user-menu .handle");
            if(loggedInUser) {
                let userLink = loggedInUser.getAttribute("href");
                if(userLink === "/session/signup") {
                    return false;
                } else {
                    let userParam;
                    const windowLocation = window.location.href;
                    if(windowLocation.startsWith("https://myfigurecollection.net/profile/")) {
                        userParam = windowLocation.match(/https:\/\/myfigurecollection\.net\/profile\/([^\/]*)/)[1];
                    } else {
                        const urlParams = new URLSearchParams(window.location.search);
                        userParam = urlParams.get("username");
                    }
                    return userParam === userLink.substring("9");
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const processPage = (parsedHtml) => {
        const foundItems = [];
        const items = parsedHtml.querySelectorAll('.row.tbx-checkable-row .cell:nth-child(2) a');
        if(items) {
            items.forEach((item) => {
                foundItems.push(item.getAttribute('href'));
            });
        }
        return foundItems;
    };

    const processStoredPage = (parsedHtml) => {
        const foundItems = [];
        const isStoredCells = parsedHtml.querySelectorAll('.row.tbx-checkable-row .cell:nth-child(9)');
        if(isStoredCells) {
            isStoredCells.forEach((isStoredItem) => {
                if(isStoredItem.textContent.includes('Stored')) {
                    const itemLink = isStoredItem.parentElement.querySelector('.cell:nth-child(2) a');
                    foundItems.push(itemLink.getAttribute('href'));
                }
            });
        }
        return foundItems;
    };

    const getPageCount = (parsedHtml) => {
        const itemCount = parsedHtml.querySelector('.results-count-value');
        const pageCountMatch = itemCount.innerText.match(/^(\d+)/);
        return Math.floor(parseInt(pageCountMatch[0], 10) / 50) + 1;
    };

    const processItems = async (url, pageProcessor) => {
        const foundItems = [];
        let pageCount = 0;
        await fetch(url + '&page=1').then((response) => {
            return response.text();
        }).then((html) => {
            const parsedHtml = parser.parseFromString(html, 'text/html');
            Array.prototype.push.apply(foundItems, pageProcessor(parsedHtml));
            pageCount = getPageCount(parsedHtml);
        }).catch(function (err) {
            console.warn('Something went wrong.', err);
        });
        if (pageCount > 1) {
            for(let page = 2; page < pageCount + 1; page++) {
                await fetch(url + '&page=' + page).then((response) => {
                    return response.text();
                }).then((html) => {
                    const parsedHtml = parser.parseFromString(html, 'text/html');
                    Array.prototype.push.apply(foundItems, pageProcessor(parsedHtml));
                }).catch(function (err) {
                    console.warn('Something went wrong.', err);
                });
            }
        }
        return foundItems;
    };

    if(isUsersPreorderPage()) {
        const paidItems = await processItems('/?mode=collection&tab=ordered&current=keywords&output=sheet&isPaid=1&_tb=manager', processPage);
        const storedItems = await processItems('/?mode=collection&tab=ordered&output=sheet&_tb=manager', processStoredPage);
        const shippedItems = await processItems('/?mode=collection&tab=ordered&current=keywords&output=sheet&isShipped=1&_tb=manager', processPage);

        const itemIcons = document.querySelectorAll('.item-icon a');
        itemIcons.forEach((item) => {
            if(shippedItems.includes(item.getAttribute('href'))) {
                appendPip('item-is-shipped', 'icon-plane', item);
            } else if(storedItems.includes(item.getAttribute('href'))) {
                appendPip('item-is-stored', 'icon-stored', item);
            } else if(paidItems.includes(item.getAttribute('href'))) {
                appendPip('item-is-paid', 'icon-dollar', item);
            }
        });
    }
})();