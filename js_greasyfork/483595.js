// ==UserScript==
// @name         GGn Row Numbers in User Log
// @namespace    none
// @version      2
// @description  Add row numbers to the user log
// @author       ingts
// @match        https://gazellegames.net/user.php?*action=userlog*
// @downloadURL https://update.greasyfork.org/scripts/483595/GGn%20Row%20Numbers%20in%20User%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/483595/GGn%20Row%20Numbers%20in%20User%20Log.meta.js
// ==/UserScript==
const table = document.querySelector('#content > div > table')
const tbody = table.querySelector('tbody')
const page = new URL(location.href).searchParams.get('page')
const startIndex = page ? (page - 1) * 50 : 0
tbody.firstElementChild.insertAdjacentHTML('afterbegin', `<td style="width: 1px;"><strong>#</strong></td>`)

function number(tr) {
    tr.insertAdjacentHTML('afterbegin', `<td class="nobr"><span>${tr.rowIndex + startIndex}</span></td>`)
}

tbody.querySelectorAll('tr:not(.colhead)').forEach(tr => {
    number(tr)
})

new MutationObserver(mutations => {
    mutations.forEach(m => {
        number(m.addedNodes[0])
    })
}).observe(table, {childList: true})