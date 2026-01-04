// ==UserScript==
// @name         Display complete Google News title in tooltip
// @namespace    https://greasyfork.org/users/1117297-pizzahut
// @version      1
// @description  Some news titles are cut off. This script shows the whole title in a tooltip.
// @author       pizzahut
// @match        https://news.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=news.google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541768/Display%20complete%20Google%20News%20title%20in%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/541768/Display%20complete%20Google%20News%20title%20in%20tooltip.meta.js
// ==/UserScript==

function delayedLoad()
{
    var items, item1, item2, i;
    items = document.evaluate("//a[contains(@href,'./read/')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (i = 0; i <= items.snapshotLength - 2; i += 2)
    {
        item1 = items.snapshotItem(i);
        item2 = items.snapshotItem(i+1);
        if ((item1.href == item2.href) && item2.innerHTML) // This is currently always true.
        { item1.title = item2.innerHTML; }
    }
}

// Content is dynamically added by Google. Maybe just check every second using two lines of code, or ...

//delayedLoad();
//setInterval(delayedLoad, 1000); // t = 1s

// Set up an observer which checks for changes to elements.

const targetNode = document.body;
const config = { attributes: false, childList: true, subtree: true } // Attribute changes probably don't matter.
const callback = (mutationList, observer) =>
{
    for (const mutation of mutationList)
    {
        if (mutation.type === "childList")
        {
            console.log("A child node has been added or removed.");
            delayedLoad();
        }
        //else if (mutation.type === "attributes")
        //{ console.log(`The ${mutation.attributeName} attribute was modified.`); }
    }
}
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
// Should the observer be stopped after some time?
setTimeout(() => { observer.disconnect(); }, 10000); // t = 10s
