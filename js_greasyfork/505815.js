// ==UserScript==
// @name         Civitai - Order collections
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  This script will order the "My Collections" list in ascending alphanumeric order.
// @author       gberesford
// @match        https://civitai.com/collections/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505815/Civitai%20-%20Order%20collections.user.js
// @updateURL https://update.greasyfork.org/scripts/505815/Civitai%20-%20Order%20collections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CivitAi {

        orderCollections() {

            const listHeading = this.findElement(document.getElementsByClassName("mantine-Text-root"), element => element.innerText === "My Collections");
            const listWrapper = this.getParent(listHeading, parent => parent.classList.contains("mantine-Card-root"));

            // List isn't present at first but the wrapper is. Watch the wrapper until the actual list exists
            const mutationObserver = new MutationObserver(() => {

                const list = listWrapper.getElementsByClassName("mantine-ScrollArea-viewport")[0];
                if (typeof(list) === "undefined") { return; }

                // Debouncer
                if (list.getAttribute("data-sorted") === "data-sorted") { return; }
                list.setAttribute("data-sorted", "data-sorted");

                const listItems = list.getElementsByClassName("mantine-NavLink-root");
                const listItemMap = this.mapElements(listItems, item => item);
                const orderedItems = listItemMap.sort((previous, next) => {

                    const order = previous.innerText.localeCompare(next.innerText, 'en-GB', { numeric: true });

                    if (order < 0) return -1;
                    if (order > 0) return 1;
                    return 0;
                });

                console.debug(orderedItems.map(item => item.innerText))

                for (let index = 0; index < orderedItems.length; index++) {

                    const item = orderedItems[index];
                    const parent = item.parentNode;

                    parent.removeChild(item);
                    parent.appendChild(item);
                }
            });

            mutationObserver.observe(listWrapper, { childList: true, subtree: true });
        }

        mapElements(elementCollection, output) {

            const map = [];
            for (let index = 0; index < elementCollection.length; index++) {

                const element = elementCollection[index];
                map[index] = output(element);
            }

            return map;
        }

        findElement(elementCollection, predicate) {

            for (let index = 0; index < elementCollection.length; index++) {

                const element = elementCollection[index];
                if (predicate(element)) {

                    return element;
                }
            }

            return null;
        }

        getParent(element, predicate) {

            if (element.parentNode === null) { return null; }
            if (predicate(element.parentNode) === false) { return this.getParent(element.parentNode, predicate); }

            return element.parentNode;
        }
    }

    const civitAi = new CivitAi();
    civitAi.orderCollections();
})();