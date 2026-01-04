// ==UserScript==
// @name         Weidian Right Click
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Makes items in Weidian shops "right-clickable" so you can open in new tab.
// @author       Arch-Storm
// @match        https://*.v.weidian.com/?userid=*
// @match        https://weidian.com/?userid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weidian.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461312/Weidian%20Right%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/461312/Weidian%20Right%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // wait for the 全部/"all items" tab to be selected
    const checkForTabList = setInterval(() => {
        const tabList = document.querySelector("ul.tab-list[data-v-aa193428]");
        if (tabList) {
            clearInterval(checkForTabList);
            const items = tabList.querySelectorAll("li");
            if (items[1].classList.contains("j-tab-item-active")) {
                main();
            } else {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        const nodes = mutation.addedNodes.length ? mutation.addedNodes : [mutation.target];
                        nodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("j-tab-item-active") && node.previousElementSibling === items[0]) {
                                observer.disconnect();
                                main();
                            }
                        });
                    });
                });
                observer.observe(tabList, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
            }
        }
    }, 100);

    // Main function after correct tab loaded
    function main() {
        let theAll;
        let activeTab;
        let itemList;
        let dataIndex;

        // Wait for items in the tab to load
        const checkForList = setInterval(() => {
            const listContainer = document.querySelector("div.ct[data-v-6e50b1b4][data-v-04092651]");
            const list = listContainer.querySelector("div.list[data-v-659182b8]");
            if (list) {
                clearInterval(checkForList);
                let children = document.getElementById('app').__vue__.$children;
                for(let i = 0; i < children.length; i++) {
                    if(children[i].$children.length >= 5 && children[i].$children.length <= 7) {
                        dataIndex = i;
                        break;
                    }
                }
                theAll = document.getElementById('app').__vue__.$children[dataIndex].$children[0];
                activeTab = theAll.activeTab + (theAll.activeTab === 'price' ? '-' + theAll.priceRankBy : '');
                itemList = theAll.lists[activeTab].items;
                updateLinks(list);
                observeList(listContainer);
            }
        }, 100);

        // Observe the list container
        const observeList = (listContainer) => {
            let itemObserver = null;
            const list = listContainer.querySelector("div.list[data-v-659182b8]");
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        activeTab = theAll.activeTab + (theAll.activeTab === 'price' ? '-' + theAll.priceRankBy : '');
                        itemList = theAll.lists[activeTab].items;
                        const list = listContainer.querySelector("div.list[data-v-659182b8]");
                        if (list) {
                            updateLinks(list);
                            if (itemObserver) {
                                itemObserver.disconnect();
                            }
                            observeItems(list);
                        }
                    }
                });
            });
            observer.observe(listContainer, { childList: true });

            // Observe the list items
            const observeItems = (list) => {
                itemObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === "childList") {
                            updateLinks(list);
                        }
                    });
                });
                itemObserver.observe(list, { childList: true });
            };
            observeItems(list);
        };



        // Update the links for all existing items
        const updateLinks = (list) => {
            const items = list.querySelectorAll(".item");
            for (let i = 0; i < items.length; i++) {
                const img = items[i].querySelector("img");
                if (img.parentNode.tagName !== "A") {
                    const link = document.createElement("a");
                    link.href = itemList[i].itemUrl;
                    img.parentNode.insertBefore(link, img);
                    link.appendChild(img);
                }
            }
        };
    };
})();