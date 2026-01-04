// ==UserScript==
// @name         Neopets: Inventory Rarity Display
// @namespace    Nyu@Clraik
// @version      1.0.1
// @description  Displays rarity on inventory items
// @author       Nyu
// @match        *://*.neopets.com/inventory.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @downloadURL https://update.greasyfork.org/scripts/505758/Neopets%3A%20Inventory%20Rarity%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/505758/Neopets%3A%20Inventory%20Rarity%20Display.meta.js
// ==/UserScript==


(async () => {
    await addRarities()

    const toggleButton = document.querySelector('.nptoggle')
    toggleButton.addEventListener('click', async () => {
        await addRarities()
    })

    async function addRarities(){
        await waitForInventoryLoaded()
        const items = Array.from(document.querySelectorAll(`[class*="item-img"]`))

        for (const item of items) {
            const rarity = item.dataset.rarity
            const div = document.createElement('div')
            div.style.position = 'absolute'
            div.style.top = '0px'
            div.style.width = 'fit-content'
            div.style.color = 'white'
            div.style.fontFamily = 'MuseoSansRounded500'
            div.style.backgroundColor = getBackgroundColor(rarity)
            div.classList = 'inv-menulinks'
            div.innerText = 'r'+rarity
            item.append(div)

        }
    }

    async function waitForInventoryLoaded() {
        await sleep(100)
        while (document.querySelector('.inv-loading-static')) {
            await sleep(1000)
        }
    }

    function getBackgroundColor(rarity) {
        return rarity == 99 ? 'green' : rarity == 500 ? 'gold' : rarity == 180 ? '#666666' : rarity < 75 ? '#dda713' : rarity >= 75 && rarity < 101 ? '#7ba515' : rarity >= 101 && rarity <= 104 ? '#aa4455' : rarity <= 105 && rarity < 111 ? 'orange' : rarity >= 111 ? 'red' : '#000'
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();