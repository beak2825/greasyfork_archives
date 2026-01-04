// ==UserScript==
// @name        Strapi Collapser
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       http*://*/*
// @grant       none
// @version     1.2.3
// @author      Hoax017
// @description Collapse all items in Strapi
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478255/Strapi%20Collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/478255/Strapi%20Collapser.meta.js
// ==/UserScript==
var nodes

let it = setInterval(_ => {
    let openNodes = document.querySelectorAll('li > div > div[data-strapi-expanded="true"] > div > div > span[data-strapi-dropdown]')
    let allNodes = document.querySelectorAll('li > div > div[data-strapi-expanded] > div > div > span[data-strapi-dropdown]')
    if (openNodes.length === allNodes.length && allNodes.length > 3) {
        for (var node of [...openNodes]) {
            node.click()
        }
        console.info(`Collapsed ${openNodes.length} nodes`)
    }
},1000)
