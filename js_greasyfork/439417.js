// ==UserScript==
// @name         Maximus buying items from bazaar (by monarch hq)
// @namespace    https://greasyfork.org/en/scripts/398361-max-buy/
// @version      1.1
// @description  Auto-maxes the items in TORN CITY GAEM
// @author       TheFerret
// @match        *www.torn.com/shops.php*
// @match        *www.torn.com/bazaar.php*
// @downloadURL https://update.greasyfork.org/scripts/439417/Maximus%20buying%20items%20from%20bazaar%20%28by%20monarch%20hq%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439417/Maximus%20buying%20items%20from%20bazaar%20%28by%20monarch%20hq%29.meta.js
// ==/UserScript==
 
// Max Torn Shops
document.querySelectorAll('.buy-act-wrap').forEach(item => item.querySelector('input[value="1"]').value = 100)
 
// Places an observer on the bazaar root, when it has loaded the bazaar contents it will call observeItem on each listing in the bazaar.
if (document.querySelector('#bazaarroot'))
    new MutationObserver((mutations) => {
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList && Array.from(node.classList).findIndex(element => element.includes("itemsContainner")) !== -1) {
                if (node.querySelector('button[class^="controlPanelButton"]')) // If full screen
                    node.querySelectorAll('div[class^="rowItems"] > [class^="item"]').forEach(observeItem);
                else // Smaller Screen
                    node.querySelectorAll('div[class^="rowItems"] > [class^="item"] input').forEach(setQuantity)
            }
        }))
    }).observe(document.querySelector('#bazaarroot'), { subtree: true, childList: true })
 
/**
 * Sets an observer on the item, to watch for when the user clicks on the shopping cart icon and set the quantity
 * @param {Node} item
 */
function observeItem(item) {
    new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].nodeType === Node.ELEMENT_NODE &&
                Array.from(mutation.addedNodes[0].classList).findIndex(element => element.includes("buyMenu")) !== -1) {
                setQuantity(mutation.addedNodes[0].querySelector('input'))
                observer.disconnect()
            }
        })
    }).observe(item, { subtree: true, childList: true })
}
 
/**
 * Sets the quantity of the item to the max value.
 * Uses horribly hacky work around since Torn's now using React.
 * @param {Element} item The input element to set the value of.
 */
function setQuantity(item) {
    let lastValue = item.value;
    item.value = item.getAttribute('max');
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = item._valueTracker;
    if (tracker)
        tracker.setValue(lastValue);
    item.dispatchEvent(event);
}