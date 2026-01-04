// ==UserScript==
// @name         table-sorter
// @namespace    https://greasyfork.org/
// @version      0.1.0
// @description  强制排序表格
// @author       HqLin
// @match        https://*/*
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/511646/table-sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/511646/table-sorter.meta.js
// ==/UserScript==
'use strict';

(function () {
  document.querySelectorAll('table').forEach((tbl) => {
    const trows = Array.from(tbl.querySelectorAll('tbody tr'))
    const theads = tbl.querySelectorAll('th')
    const thead = theads?.[0]?.parentElement
    const trueHeader = !!tbl.querySelector('thead')

    if (trows.length === 0 || theads.length === 0 || !thead) return
    if (!trueHeader) trows.shift()

    theads.forEach((head, idx) => head.dataset.index = idx)

    let sortingIdx = 0, reverse = false, triggering = false

    document.addEventListener('keydown', ev => triggering = ev.ctrlKey)
    document.addEventListener('keyup', _ => triggering = false)
    thead.addEventListener('click', (ev) => {
      if (!triggering) return
      const header = ev.target.closest('th')
      console.log('Sort by', triggering, sortingIdx, header.textContent)
      reverse = header.dataset.index === sortingIdx ? !reverse : false
      sortingIdx = header.dataset.index
      const tbody = tbl.querySelector('tbody')
      tbody.innerHTML = ''
      // 有的 table 把表头写在 tbody 里面
      if (!trueHeader) tbody.appendChild(thead)
      const trowsSorted = trows.sort((rowA, rowB) => {
        const cellA = rowA.querySelectorAll('td')[sortingIdx]?.textContent
        const cellB = rowB.querySelectorAll('td')[sortingIdx]?.textContent
        const delta = cellA - cellB
        return (reverse ? -1 : 1) * (Number.isNaN(delta) ? cellA.localeCompare(cellB) : delta)
      })

      trowsSorted.forEach(row => tbody.appendChild(row))
    })
  })
})()
