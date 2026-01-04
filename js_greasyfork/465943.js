// ==UserScript==
// @name         WebLEM Table Tools
// @version      0.1
// @description  WebLEM Table Exporter
// @author       GNS
// @license      MIT
// @match        https://www.weblem.org/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1076718
// @downloadURL https://update.greasyfork.org/scripts/465943/WebLEM%20Table%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/465943/WebLEM%20Table%20Tools.meta.js
// ==/UserScript==

GM_addStyle(`
DIV.container {
  max-width: 90%;
  width: max-content;
}

DIV.product-table {
  max-height: 90vh !important;
}

TR:hover {
  background-color: #eee !important;
}


.copy-highlight {
  background-color: #CFC;
}

td.copied {
  border-right: 1px solid #6D6;
  border-bottom: 1px solid #6D6;
  color: #0B0;
}
`)

let selected = {
  row: { start: null, end: null },
  cell: { start: null, end: null }
}

document.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return //FILTER FOR LEFT CLICK ONLY??
  if (e.target.nodeName !=='TD') return
  e.preventDefault()
  selected.row.start = e.target.parentElement.rowIndex
  selected.cell.start = e.target.cellIndex
  e.target.classList.add('copy-highlight')
  document.addEventListener('mousemove', mouse_move)
})

function mouse_move(e) {
  e.preventDefault()
  clearHighlights()
  const current_row_end = e.target.parentElement.rowIndex
  const current_cell_end = e.target.cellIndex
  const table = e.target.closest('TABLE')
  const rows = [selected.row.start, current_row_end].sort()
  const cells = [selected.cell.start, current_cell_end].sort()
  //console.log(rows, cells)
  for (let r = rows[0]; r <= rows[1]; r++) {
    for (let c = cells[0]; c <= cells[1]; c++) {
      table.rows[r].cells[c].classList.add('copy-highlight')
    }
  }
}

document.addEventListener('mouseup', (e) => {
  document.removeEventListener('mousemove', mouse_move)
  if (e.button !== 0) return //FILTER FOR LEFT CLICK ONLY??
  if (e.target.nodeName !=='TD') return
  e.preventDefault()
  clearHighlights()
  selected.row.end = e.target.parentElement.rowIndex
  selected.cell.end = e.target.cellIndex
  const table = e.target.closest('TABLE')
  const rows = [selected.row.start, selected.row.end].sort()
  const cells = [selected.cell.start, selected.cell.end].sort()
  let values = []
  for (let r = rows[0]; r <= rows[1]; r++) {
    let new_row = []
    for (let c = cells[0]; c <= cells[1]; c++) {
      table.rows[r].cells[c].classList.add('copied')
      new_row.push(table.rows[r].cells[c].innerText)
    }
    values.push(new_row)
  }
  const output = values.map(row => row.join('\t')).join('\n')
  GM_setClipboard(output, 'text')
  //navigator.clipboard.writeText(output)
})

function clearHighlights() {
  document.querySelectorAll('.copy-highlight').forEach(s => s.classList.remove('copy-highlight'))
  document.querySelectorAll('.copied').forEach(s => s.classList.remove('copied'))
}

