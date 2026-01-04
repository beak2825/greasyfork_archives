// ==UserScript==
// @name         Needle grouper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Sort needles together to top of the temporary items list
// @author       Ziticca
// @license      MIT
// @match        https://www.torn.com/item.php
// @icon         https://www.torn.com/images/items/463/large.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470988/Needle%20grouper.user.js
// @updateURL https://update.greasyfork.org/scripts/470988/Needle%20grouper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sortTempsFunc = function(temp_list) {
        var temp_list_first = temp_list.firstChild
        var temp_list_items = document.querySelectorAll("li[data-category='Temporary']")
        var temp_nodes = []
        var temp_names = ["Epinephrine", "Melatonin", "Tyrosine", "Serotonin"]
        for (const item of temp_list_items.entries()) {
            const name = item[1].dataset.sort

            if (temp_names.includes(name)) {
                temp_nodes.push([name, item[1]])
            }
        }
        temp_nodes.sort((a,b) => {
            if (a[0] < b[0]) return -1
            if (a[0] > b[0]) return 1
            return 0
        })
        for (const node of temp_nodes) {
            temp_list.insertBefore(node[1], temp_list_first)
        }
    }

    var initFunc = function() {
        var temp_list = document.querySelector("ul#temporary-items")
        sortTempsFunc(temp_list)
        const observer = new MutationObserver((mutations) => {
            const mut = mutations[0]
            if (mut.target.attributes["aria-hidden"].value === "false") {
                sortTempsFunc(temp_list)
            }
        })

        observer.observe(temp_list, { attributeFilter: ["aria-hidden", "data-total"] })
    }

    document.readyState == "complete" ? initFunc() : window.addEventListener('load', initFunc)


})();