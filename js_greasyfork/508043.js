// ==UserScript==
// @name         Neopets: Inventory Pet Preference
// @namespace    Nyu@Clraik
// @version      1.0.0
// @description  Sets your preferred pet as the first option when available
// @author       Nyu
// @match        *://*.neopets.com/inventory.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508043/Neopets%3A%20Inventory%20Pet%20Preference.user.js
// @updateURL https://update.greasyfork.org/scripts/508043/Neopets%3A%20Inventory%20Pet%20Preference.meta.js
// ==/UserScript==

(async () => {
    const preferredPet = 'PETNAME' // YOUR PREFERED PET NAME HERE


    while (document.getElementById('invDesc').style.display === 'none') {
        await wait(1000)
    }
    await waitForLoadingToComplete()

    const items = Array.from(document.querySelectorAll('.grid-item'))
    for (const item of items) {
        item.addEventListener('click', async () => {
            await waitForLoadingToComplete()
            setPreferredPet()
        })
    }

    function setPreferredPet() {
        const select = document.querySelector('select[name="action"]')
        let petOption;
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value.includes(preferredPet)) {
                petOption = select.options[i]
                break
            }
        }

        if (petOption) {
            select.removeChild(petOption)
            select.insertBefore(petOption, select.options[1])
        }
    }

    async function waitForLoadingToComplete() {
        let isLoading = document.querySelector('.inv-loading-static')
        while (isLoading) {
            await wait(1000)
            isLoading = document.querySelector('.inv-loading-static')
        }
    }


    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})()