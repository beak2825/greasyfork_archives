// ==UserScript==
// @name         Access storage on market screen
// @namespace    http://tampermonkey.net/
// @version      2025-05-04
// @description  Add storage inventory to market screen
// @author       Disk217
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @require      https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535165/Access%20storage%20on%20market%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/535165/Access%20storage%20on%20market%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openPage(url) {
        // Create an iframe element
        const iframe = document.createElement('iframe');

        // Append the iframe to the document body
        document.body.appendChild(iframe);

        // Load the URL into the iframe
        iframe.src = url;

        return iframe;
    }

    function isTextNode(node) {
        return node.nodeType === Node.TEXT_NODE;
    }

    function isElementNode(node) {
        return node && node.nodeType === Node.ELEMENT_NODE;
    }

    function hideExcept(doc, id){
        var el = doc.getElementById(id)
        var node, nodes = [];

        do {
            var parent = el.parentNode;

            // Collect element children
            for (var i=0; i<parent.childNodes.length; i++) {
                node = parent.childNodes[i];

                // Collect only sibling nodes and not the current element
                if (node != el) {
                    nodes.push(node);
                }
            }

            // Go up to parent
            el = parent;

            // Stop when processed the body's child nodes
        } while (el.tagName.toLowerCase() != 'body');

        // Hide the collected nodes
        nodes.forEach(function(node) {
            if (isTextNode(node)) {
                node.remove()
            }
            else if (isElementNode(node)) {
                node.style.display = 'none'
            }
        });
    }

    const storageWindow = openPage('https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50')

    storageWindow.style.width = "675px"

    storageWindow.style.height = "100px"

    storageWindow.style.position = 'absolute'

    storageWindow.style.top = '830px'

    storageWindow.style.right = '510px'

    storageWindow.addEventListener('load', function() {
        // Code to execute after the iframe has loaded
        console.log('iframe has loaded!');
        hideExcept(storageWindow.contentDocument, "inventoryholder")

        storageWindow.contentWindow.scrollTo(170,430)

        storageWindow.contentDocument.getElementById("inventoryholder").addEventListener('contextmenu', function(event) {
            event.preventDefault()
            storageWindow.contentWindow.reloadInventoryData()
        })
    });

    const UiUpdate = DeadFrontier.UiUpdate;

    const player_items = new DeadFrontier.PlayerItems();

    const inventory_holder = document.getElementById("inventoryholder");

    const refresh_button = makeRefreshButton();
    refresh_button.addEventListener("click", function(e) {
        refresh()
    });
    inventory_holder.appendChild(refresh_button);

    function refresh() {
        return reloadInventoryData()
    }

    function makeRefreshButton() {
		const button = document.createElement("button");
		button.innerHTML = "Refresh";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "right");
		button.style.setProperty("left", "450px");
		button.style.setProperty("top", "15px");
		return button;
	}

    document.getElementById("inventoryholder").addEventListener('contextmenu', function(event) {
        event.preventDefault()
        refresh()
    })




})();