// ==UserScript==
// @name         Collection book from inventory
// @namespace    http://tampermonkey.net/
// @version      2025-05-05
// @description  Allow double clicking to store in collection book fast
// @author       Disk217
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535166/Collection%20book%20from%20inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/535166/Collection%20book%20from%20inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(id, callback) {
        const interval = setInterval(function() {
            const element = document.getElementById(id);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100); // Check every 100ms
    }

    function clickElementThenRemoveMenu(element, customMenu) {
        const localElement = element
        const localCustomMenu = customMenu
        return function() {
                    localElement.click()
                    document.body.removeChild(localCustomMenu); //remove the menu after click
                }
    }

    function isElementNode(node) {
        return node && node.nodeType === Node.ELEMENT_NODE;
    }

    const collectionBookElem = document.createElement("div")

    collectionBookElem.setAttribute("id", "collectionbook");

    const collectionBookCounterElem = document.createElement("div")

    collectionBookCounterElem.setAttribute("id", "collectionCounter")

    collectionBookElem.style.display = 'none'

    collectionBookCounterElem.style.display = 'none'

    document.body.appendChild(collectionBookElem)
    document.body.appendChild(collectionBookCounterElem)

    initiateCollectionBook()

    waitForElement("cbSwitcher", function(elem) { elem.style.display = 'none'; elem.childNodes[7].click() } )

    document.getElementById("inventoryholder").addEventListener('dblclick', function(event) {
        console.log("Double clicked " + event.target.getAttribute("id"))
        dragStart(event)
        const realElementFromPoint = document.elementFromPoint
        try {
            document.elementFromPoint = function(x,y) {return collectionBookElem}
            dragDropAction(event)
        } finally {
            document.elementFromPoint = realElementFromPoint
        }
    });

    document.getElementById("inventoryholder").addEventListener('contextmenu', function(event) {
        console.log("right clicked " + event.target.getAttribute("id"))
         event.preventDefault(); // Prevent the default context menu

        // Create your custom menu
        const customMenu = document.createElement('div');
        customMenu.id = 'custom-context-menu';
        customMenu.style.position = 'fixed';
        customMenu.style.left = event.clientX + 'px';
        customMenu.style.top = event.clientY + 'px';
        customMenu.style.backgroundColor = 'white';
        customMenu.style.border = '1px solid black';
        customMenu.style.padding = '5px';
        customMenu.style.height = "auto"
        customMenu.style.width = "auto"

        for(var child=collectionBookElem.firstChild; child!==null; child=child.nextSibling) {
            if(isElementNode(child) && child.getAttribute("data-quantity") == "1") {
                const menuItem1 = document.createElement('div');
                menuItem1.textContent = child.getAttribute("data-type")
                console.log(menuItem1.textContent)
                menuItem1.style.cursor = 'pointer';
                menuItem1.style.setProperty("font-size", "15px");
                menuItem1.style.setProperty("text-align", "left");
                menuItem1.style.setProperty("background-color", "black");
                menuItem1.addEventListener('click', clickElementThenRemoveMenu(child.getElementsByTagName("button")[0], customMenu))
                customMenu.appendChild(menuItem1);
            }
        }

        // Add the custom menu to the body
        document.body.appendChild(customMenu);

        // Close the menu when clicking elsewhere
        document.addEventListener('click', function closeMenu(event) {
            if (!customMenu.contains(event.target)) {
                document.body.removeChild(customMenu);
                document.removeEventListener('click', closeMenu); // Remove the listener after closing
            }
        });
    });
})();