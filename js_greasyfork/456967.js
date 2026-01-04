// ==UserScript==
// @name         Export List of Seeding Torrents
// @namespace    dunno what to put here :|
// @version      1.0
// @description  Export list of your currently seeding torrents from TorrentBD.
// @author       K4K4SH1
// @match        https://*.torrentbd.com/seedbonus-breakdown.php
// @match        https://*.torrentbd.net/seedbonus-breakdown.php
// @match        https://*.torrentbd.me/seedbonus-breakdown.php
// @match        https://*.torrentbd.com/activities.php
// @match        https://*.torrentbd.net/activities.php
// @match        https://*.torrentbd.me/activities.php
// @icon         data:image/png;base64,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
// @run-at       document-end
// @license		 MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456967/Export%20List%20of%20Seeding%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/456967/Export%20List%20of%20Seeding%20Torrents.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const seedingList = document.querySelector('.simple-data-table tbody')

    // Classes
    class seedingListExporter {
        constructor (table, includeHeaders = true) {
            this.table = table
            this.rows = Array.from(table.querySelectorAll('tr'))

            if (!includeHeaders && this.rows[0].querySelectorAll('th').length) {
                this.rows.shift()
            }
        }

        convertToCSV() {
            const lines = []
            const numCols = this._findLongestRowLength()

            for (const row of this.rows) {
                let line = ''

                for (let i = 0; i < numCols; i++) {
                    if (row.children[i] !== undefined) {
                        line += seedingListExporter.parserCell(row.children[i])
                    }

                    line += (i !== (numCols - 1)) ? ',' : ''
                }

                lines.push(line)
            }
            
            return lines.join('\n')
        }

        _findLongestRowLength() { 
            return this.rows.reduce((l, row) => row.childElementCount > 1 ? row.childElementCount : l, 0)
        }

        static parserCell(tableCell) {
            let parsedValue = tableCell.textContent

            // Replace all the double quotes with dwo double quotes
            parsedValue = parsedValue.replace(/"/g, `""`)

            // If value contains comma, new-line or double-quotes, enclose in the doulbe quotes
            parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue
            
            parsedValue = parsedValue.replace(/\s+/g,' ').trim();
            // console.log(parsedValue)

            return parsedValue
        }
    }

    // Get day, month, year
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`


    // Create a download button
    const exportCSVButton = document.createElement('a')
    const exportCSVButtonText = document.createTextNode('Export List as CSV')
    exportCSVButton.classList.add('btn', 'waves-effect', 'waves-light', 'center-align')
    exportCSVButton.appendChild(exportCSVButtonText)
    exportCSVButton.style.margin = '10px 0px'

    seedingList.parentElement.insertBefore(exportCSVButton, seedingList)

    exportCSVButton.addEventListener('click', () => {
        const exporter = new seedingListExporter(seedingList)
        const csvOutput = exporter.convertToCSV()
        const csvBlob = new Blob([csvOutput], {type: 'text/csv'})
        const blobURL = URL.createObjectURL(csvBlob)
        
        exportCSVButton.href = blobURL
        exportCSVButton.download = `Seeding-List-${currentDate}`

        setTimeout(() => {
            URL.revokeObjectURL(blobURL)
        }, 500)
    })
})();