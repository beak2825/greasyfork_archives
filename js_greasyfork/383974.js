// ==UserScript==
// @name         Bazaar Item Market Link
// @namespace    https://github.com/sulsay/torn
// @version      2.0
// @description  Adds link "View in item market" on expanded items in bazaar
// @author       Sulsay [2173590]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383974/Bazaar%20Item%20Market%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/383974/Bazaar%20Item%20Market%20Link.meta.js
// ==/UserScript==

(async function () {
    const itemsContainer = await truthy(() => document.querySelector('div[class*=itemsContainner]')); // The double n is a typo on TORN's side
    new MutationObserver(insertMarketLinkOnItemPaneOpened.bind(null, itemsContainer)).observe(itemsContainer, {childList: true, subtree: true});
})();

function insertMarketLinkOnItemPaneOpened(itemsList, mutations) {
    for (let mutation of mutations) {
        for (let addedNode of mutation.addedNodes) {
            if (addedNode.classList.contains('items-list-wrap')) {
                insertMarketLink(addedNode);
                return;
            }

            // Was item already viewed at least once? Then the addedNode in the mutation is the react wrapper around `div.items-list-wrap`. The firstChild is the item pane we're looking for.
            if (addedNode.firstChild && addedNode.firstChild.nodeType === Node.ELEMENT_NODE && addedNode.firstChild.classList.contains('items-list-wrap')) {
                insertMarketLink(addedNode.firstChild);
                return;
            }
        }
    }
}

function insertMarketLink(itemPane) {
    const itemId = parseInt(itemPane.querySelector('[aria-labelledby^="armory-info-"]').getAttribute('aria-labelledby').replace('armory-info-', ''), 10);
    const marketLinkHtml = `<a href="/imarket.php#/p=shop&type=${itemId}" style="${getItemMarketLinkStyles().join(';')}">View in item market</a>`;

    const itemNameAndTypeDiv = itemPane.querySelector('.m-bottom10');
    itemNameAndTypeDiv.insertAdjacentHTML('beforeend', marketLinkHtml);
}

function getItemMarketLinkStyles() {
    return [
        'color: #B53471',
        'text-decoration: none',
    ];
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