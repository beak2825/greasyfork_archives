// ==UserScript==
// @name         X No Ads
// @namespace    http://techiev2.in/
// @description  Remove infused ads on X
// @author       techiev2
// @match        https://x.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/537229/X%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/537229/X%20No%20Ads.meta.js
// ==/UserScript==

function removeAdElements() {
    const xpathResult = document.evaluate("//span[text()='Ad']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    Array.from({length: xpathResult.snapshotLength}, (_, i) => xpathResult.snapshotItem(i)).map((el) => {
        const root = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        root.parentElement.removeChild(root)
    })
}

(() => {
    removeAdElements()
    window.$$observer = new MutationObserver((mutationList, observer) => {
        removeAdElements()
    });
    window.$$observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    document.onbeforeunload = () => {
        window.$$observer.disconnect();
        return true;
    }
})()