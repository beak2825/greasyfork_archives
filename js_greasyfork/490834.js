// ==UserScript==
// @name         My Glove80 Layouts Improved
// @namespace    http://tampermonkey.net/
// @version      2024-03-27_2
// @description  Make easier to select and delete multiple Glove80 layouts
// @author       3coma3@gmail.com
// @match        https://addons.mozilla.org/es/firefox/addon/tampermonkey/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @match        https://my.glove80.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/490834/My%20Glove80%20Layouts%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/490834/My%20Glove80%20Layouts%20Improved.meta.js
// ==/UserScript==

/* eslint curly: off, no-unexpected-multiline: off, no-return-assign: off */

'use strict';

const selectCheckBox = (row) => row.querySelector(':scope .select-row')

const selectAll = (rows) => rows.map((row) => selectCheckBox(row).checked = true)
const selectNone = (rows) => rows.map((row) => selectCheckBox(row).checked = false)
const selectByStatusIcon = (rows, icon) => rows.map((row) => selectCheckBox(row).checked = row.querySelector(`:scope .icon.text-${icon}`))
const selectSearch = (rows, text, tags) => {
    const search = text
    ? (row) => {
        const rowTitle = row.querySelector(':scope .pb-2 a'),
              rowNotes = row.querySelector(':scope .listing-notes p'),
              rowDateTime = row.querySelector(':scope .pb-2 span');
        return [rowTitle, rowNotes, rowDateTime].some((field) => field.innerText.search(text) >= 0)
    }
    : (row) => {
        const rowTags = Array.from(row.querySelectorAll(':scope .tags .tag-name')).map((node) => node.innerText)
        return tags.split(',').every(tag => rowTags.includes(tag))
    }

    rows.map((row) => selectCheckBox(row).checked = search(row))
}

function fromHTML(html, trim = true) {
  html = trim ? html.trim() : html
  if (!html) return null

  const template = document.createElement('template')
  template.innerHTML = html
  const result = template.content.children

  return result.length === 1 ? result[0] : result
}

function searchDialog(rows) {
    const dialog = fromHTML(`
            <div class="modal fade show show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title">Search to select</h5>
                            <button type="button" class="btn btn-close" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Enter text to select matching entries</p>
                            <input type="text" id="text" name="text" style="width: 100%">
                            <input type="checkbox" id="tag-search" name="tag-search">
                            <label for="tag-search">tag search</label>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline-primary btn-search" type="button">Search</button>
                            <button class="btn btn-outline-primary btn-cancel" type="button">Cancel</button>
                        </div>
                  </div>
              </div>
           </div>`)

    const backdrop = fromHTML('<div class="modal-backdrop fade show"></div>')

    const closeButton = dialog.querySelector(':scope .btn-close')
    closeButton.onclick = () => {
        document.body.removeChild(dialog)
        document.body.removeChild(backdrop)
    }

    dialog.querySelector(':scope .btn-cancel').onclick = closeButton.onclick

    const searchButton = dialog.querySelector(':scope .btn-search')
    searchButton.onclick = () => {
        closeButton.click()
        let tagSearch = dialog.querySelector(':scope .modal-body #tag-search').checked
        selectSearch(rows,
                     tagSearch ? null : dialog.querySelector(':scope .modal-body #text').value,
                     tagSearch ? dialog.querySelector(':scope .modal-body #text').value : null)
    }

    const searchText = dialog.querySelector(':scope #text')
    searchText.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            searchButton.click()
        }
    });

    document.body.appendChild(dialog)
    document.body.appendChild(backdrop)
    searchText.focus()
}

function removeDialog(rows) {
    const selected = rows.filter((row) => selectCheckBox(row).checked)

    if (selected.length === 1) selected[0].querySelector(':scope .btn-ghost-danger ').click()
    if (selected.length < 2) return;

    const dialog = fromHTML(`
             <div class="modal fade show show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title">WARNING</h5>
                            <button type="button" class="btn btn-close" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You are about to <b>delete multiple layouts</b>. This operation is irreversible.</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline-primary btn-danger" type="button">I understand, proceed with deletion</button>
                            <button class="btn btn-outline-primary btn-cancel" type="button">Cancel</button>
                        </div>
                  </div>
              </div>
           </div>`)

    const backdrop = fromHTML('<div class="modal-backdrop fade show"></div>')

    const closeButton = dialog.querySelector(':scope .btn-close')
    closeButton.onclick = () => {
        document.body.removeChild(dialog)
        document.body.removeChild(backdrop)
    }

    dialog.querySelector(':scope .btn-cancel').onclick = closeButton.onclick

    const deleteButton = dialog.querySelector(':scope .btn-danger')
    deleteButton.onclick = () => {
        closeButton.click()
        selectNone(rows)
        removeSelected(selected)
    }

    document.body.appendChild(dialog)
    document.body.appendChild(backdrop)
}

let hideModalCSS

function removeSelected(rows) {
    if (!hideModalCSS) {
        hideModalCSS = document.createElement('style')
        hideModalCSS.id = 'hide-modal'
        hideModalCSS.innerText = 'body > div.modal, body > div.modal-backdrop { display: none !important; }'
        hideModalCSS.onload = () => setTimeout(removeSelected, 500, rows)
        document.head.appendChild(hideModalCSS)
        return
    }

    const waitForModal = (delay) => {
        let modal = document.body.querySelector('.modal')

        if (modal) {
            let button = modal.querySelector(':scope .btn-danger')
            button.click()
            setTimeout(removeSelected, 500, rows)
        }
        else setTimeout(waitForModal, delay, delay * 2)
    }

    if (rows.length) {
        layoutsObserver(rows.length === 1)
        rows.pop().querySelector(':scope .btn-ghost-danger').click()
        waitForModal(500)
    }
    else {
        document.head.removeChild(hideModalCSS)
        hideModalCSS = null
    }
}

function decorateHeader(rows) {
    const button = (text, cb) => {
        var b = document.createElement('button')
        b.type = 'button'
        b.innerText = text
        b.className = 'btn btn-outline-primary'
        b.style.float = 'right'
        b.style.marginLeft = '3px'
        b.onclick = cb
        return b
    }

    const toolBar = document.createElement('div')
    toolBar.style.outline = 'none'
    toolBar.style.minHeight = '0px'
    toolBar.style.overflowY = 'auto'
    toolBar.style.position = 'relative'
    toolBar.style.flexGrow = 1

    let sa = button('All', () => selectAll(rows)),
        sn = button('None', () => selectNone(rows)),
        si = button('Incomplete', () => selectByStatusIcon(rows, 'warning')),
        sc = button('Complete', () => selectByStatusIcon(rows, 'success')),
        sr = button('Search', () => searchDialog(rows)),
        rs = button('Remove Selected', () => removeDialog(rows))

    rs.className = 'btn btn-danger';
    rs.style.marginLeft = '10px';

    ([rs, sr, sc, si, sn, sa]).map((button) => toolBar.appendChild(button));
    toolBar.appendChild(fromHTML('<div style="float: right; margin-right: 5px; padding-top: 6px; font-weight: bold;"><p>Select</p></div>'))

    document.querySelector('.header').appendChild(toolBar)
}

function decorateRows(rows, cachedRows) {
    let newRows = false

    const decorate = (row, delay) => {
        if (!row.decorated) {
            let ct = row.querySelector(':scope .actions.tags .container')

            if (ct) {
                let i = row.getAttribute('data-index'),
                    hit = cachedRows[i],
                    cachedBox = hit && selectCheckBox(hit)

                ct.appendChild(fromHTML(`<input type="checkbox" class="select-row" ${cachedBox && cachedBox.checked ? 'checked' : ''}/>`))
                row.decorated = true

                cachedRows[i] = row
                if (!hit) newRows = true
            }
            else setTimeout(decorate, delay, row, delay * 2)
        }
    }

    rows.forEach((row) => decorate(row, 100))
    return newRows
}

let oldURI = null
const rowCache = []
const observers = {
    main: new MutationObserver(main),
    layouts: null
}

function layoutsObserver(start = true) {
    let layouts, cacheReady, tries = 3,
        scroller = document.querySelector('#app-root > .container > div:not(.header)')

    if (!observers.layouts)
        observers.layouts = new MutationObserver(() => {
            observers.layouts.takeRecords()
            if (decorateRows(layouts.childNodes, rowCache) || (tries-- > 0)) scroller.scrollTop += layouts.clientHeight * 2
            else cacheReady = true
        })

    function waitForCache(delay) {
        if (cacheReady) scroller.scrollTop = 0
        else setTimeout(waitForCache, delay, delay * 2)
    }

    if (start) {
        if (!layouts && (layouts = document.querySelector('.list-group'))) {
            observers.layouts.observe(layouts, { childList: true, subtree: true })
        waitForCache(1)
        }
    }
    else observers.layouts.disconnect()
}

function main() {
    if (document.baseURI !== oldURI) {
        if (!oldURI) observers.main.observe(document.querySelector('#app-root'),
                                   { attributes: false, childList: true, characterData: false })

        oldURI = document.baseURI
        if (oldURI === 'https://my.glove80.com/#/my_layouts') {
            decorateHeader(rowCache)
            layoutsObserver()
        }
        else layoutsObserver(false)
    }
}

main() // initial run