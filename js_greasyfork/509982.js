// ==UserScript==
// @name         Xibaal QoL
// @namespace    http://tampermonkey.net/
// @version      2024-09-22
// @description  Xibaal plugins
// @author       Cafe137
// @match        https://xibaal.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509982/Xibaal%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/509982/Xibaal%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function make(type, content) {
        const element = document.createElement(type)
        element.textContent = content
        return element
    }

    function makeRow() {
        const element = document.createElement('div')
        element.style.display = 'flex'
        element.style.flexDirection = 'row'
        element.style.gap = '8px'
        return element
    }

    const slots = ['weapon', 'helmet', 'armor', 'shield', 'legs', 'boots', 'gloves', 'amulet']

    const extensionContainer = makeRow()
    const modal = document.createElement('div')
    const opener = make('button', 'Market Spy')
    const input1 = document.createElement('input')
    const input2 = document.createElement('input')
    const inputMinimum1 = document.createElement('input')
    const inputMinimum2 = document.createElement('input')
    const cancelButton = make('button', 'Cancel')
    const searchButton = make('button', 'Search')
    const results = document.createElement('table')
    const repairAllButton = make('button', 'Loading...')

    async function refreshRepairAllButton() {
        const response = await fetch('https://api.xibaal.com/api/items', {
            headers: { Authorization: localStorage.getItem('token') }
        })
        const items = await response.json()
        const equipments = items.filter(x => x.equipped)
        let sumCost = 0
        for (const equipment of equipments) {
            sumCost += equipment.repairCost
        }
        repairAllButton.textContent = `Repair all for ${sumCost}`
    }

    async function onRepairAll() {
        const response = await fetch('https://api.xibaal.com/api/items', {
            headers: { Authorization: localStorage.getItem('token') }
        })
        const items = await response.json()
        const equipments = items.filter(x => x.equipped)
        for (const equipment of equipments) {
            if (!equipment.repairCost) {
                continue
            }
            await fetch(`https://api.xibaal.com/api/repair/${equipment.id}`, {
                method: 'POST',
                headers: { Authorization: localStorage.getItem('token') }
            })
        }
        refreshRepairAllButton()
    }

    repairAllButton.addEventListener('click', onRepairAll)
    refreshRepairAllButton()
    setInterval(refreshRepairAllButton, 30_000)

    modal.style.position = 'fixed'
    modal.style.display = 'none'
    modal.style.width = '100vw'
    modal.style.height = '100vh'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.background = '#000000'
    modal.style.flexDirection = 'column'
    modal.style.boxSizing = 'border-box'
    modal.style.padding = '16px'
    modal.style.gap = '8px'
    modal.style.overflow = 'scroll'

    extensionContainer.style.position = 'fixed'
    extensionContainer.style.right = '8px'
    extensionContainer.style.top = '8px'
    extensionContainer.style.width = 'initial'

    input1.placeholder = 'Bonus #1'
    inputMinimum1.placeholder = 'Minimum of Bonus #1'
    input2.placeholder = 'Bonus #2 (Optional)'
    inputMinimum2.placeholder = 'Minimum of Bonus #2'

    const input1Row = makeRow()
    const input2Row = makeRow()
    const buttonRow = makeRow()

    input1Row.append(input1)
    input1Row.append(inputMinimum1)
    input2Row.append(input2)
    input2Row.append(inputMinimum2)
    modal.append(input1Row)
    modal.append(input2Row)
    modal.append(buttonRow)
    buttonRow.append(searchButton)
    buttonRow.append(cancelButton)
    modal.append(results)

    opener.addEventListener('click', () => {
        modal.style.display = 'flex'
    })

    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    searchButton.addEventListener('click', async () => {
        results.innerHTML = ''
        for (const slot of slots) {
            const response = await fetch(`https://api.xibaal.com/api/market/${slot}`, {
                headers: { Authorization: localStorage.getItem('token') }
            })
            const items = await response.json()
            for (const item of items) {
                if (!item.bonus) {
                    continue
                }
                const bonus = JSON.parse(item.bonus)
                if (!bonus[input1.value] || bonus[input1.value] < parseInt(inputMinimum1.value)) {
                    continue
                }
                if (input2.value) {
                    if (!bonus[input2.value] || bonus[input2.value] < parseInt(inputMinimum2.value)) {
                        continue
                    }
                }
                const row = document.createElement('tr')
                row.style.color = '#ffffff'
                row.append(make('td', item.slot))
                row.append(make('td', `+ ${item.damage} Damage`))
                row.append(make('td', `+ ${item.armor} Armor`))
                row.append(make('td', item.bonus))
                row.append(make('td', `${item.price} gold`))
                results.append(row)
            }
        }
    })

    extensionContainer.append(repairAllButton)
    extensionContainer.append(opener)
    document.body.append(extensionContainer)
    document.body.append(modal)
})();