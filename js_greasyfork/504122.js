// ==UserScript==
// @name         腾讯文档-表格-快捷操作命令
// @namespace    https://greasyfork.org/zh-CN/users/256892-fork
// @version      v0.0.2-beta
// @description  批量修改文档内容，统一行高
// @author       fpschen
// @match        https://doc.weixin.qq.com/sheet/*
// @match        https://docs.qq.com/sheet/*
// @icon         https://docs.gtimg.com/sheet/assets/file_sheet_16.c302c049fefc79588994.svg
// @license      MIT
// @grant        none
// @esversion    11
// @downloadURL https://update.greasyfork.org/scripts/504122/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3-%E8%A1%A8%E6%A0%BC-%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E5%91%BD%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504122/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3-%E8%A1%A8%E6%A0%BC-%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C%E5%91%BD%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function promisable(res) {
        if (res instanceof Promise) {
            return res
        }
        return new Promise((resolve, reject) => {
            try {
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    }

    const app = {
        get modifyCellBroker() {
            return SpreadsheetApp.view.canvas.modifyCellBroker
        },
        get modifyDimensionBroker() {
            return SpreadsheetApp.view.canvas.modifyDimensionBroker
        },
        get sheetId() {
            return SpreadsheetApp.workbook.activeSheetId
        },
        cellText(row, col) {
            const cellData = SpreadsheetApp.workbook.activeSheet.getCellDataAtPosition(row, col)
            return cellData?.formattedValue?.value || cellData?.value || ''
        },
        get areaData() {
            return SpreadsheetApp.view.canvas.areaData
        },
        rowHeight(row) {
            const getAreaTopByRow = this.areaData.getAreaTopByRow.bind(this.areaData)
            const rowIndex = Math.max(row, 0)
            return getAreaTopByRow(rowIndex + 1) - getAreaTopByRow(rowIndex)
        },
        get selectionRanges() {
            return SpreadsheetApp.view.getSelectionRanges()
        }
    }

    function takeRanges(ranges) {
        if (Array.isArray(ranges) && !ranges.every(Array.isArray)) {
            ranges = [ ranges ]
        }
        return ranges || app.selectionRanges
            .filter(i => i.sheetId === app.sheetId)
            .map(i => [[i.startRowIndex, i.startColIndex], [i.endRowIndex, i.endColIndex]])
    }

    function takeRowRanges(ranges) {
        if (Array.isArray(ranges) && !ranges.every(Array.isArray)) {
            ranges = [ ranges ]
        }
        return ranges || app.selectionRanges
            .filter(i => i.sheetId === app.sheetId)
            .map(i => [i.startRowIndex, i.endRowIndex])
    }

    async function rowRangesRunner(ranges, runner) {
        ranges = takeRowRanges(ranges)
        for (const range of ranges) {
            for (let i = range[0]; i <= range[1]; i++) {
                await promisable(runner(i))
            }
        }
    }

    async function rangesRunner(ranges, runner) {
        ranges = takeRanges(ranges)
        for (const range of ranges) {
            const startRowIndex = range[0][0]
            const startColIndex = range[0][1]
            const endRowIndex = range[1][0]
            const endColIndex = range[1][1]

            for (let row = startRowIndex; row <= endRowIndex; row++) {
                for (let col = startColIndex; col <= endColIndex; col++) {
                    await promisable(runner(row, col))
                }
            }
        }
    }

    window.modifyCell = async function modifyCell(row, col, modifier) {
        let text = modifier
        if (typeof modifier === 'function') {
            text = modifier(app.cellText(row, col))
        }
        if (!!!text) {
            return
        }
        await app.modifyCellBroker.setCellProperties({
            sheetId: app.sheetId,
            rowIndex: row,
            colIndex: col,
            text,
            isTextChanged: true
        })
    }

    window.batchModifyCell = async function batchModifyCell(ranges, modifier) {
        ranges = takeRanges(ranges)
        await rangesRunner(ranges, async (row, col) => {
            await modifyCell(row, col, modifier)
        })
    }

    async function rowHeightAutoFit(ranges) {
        ranges = takeRowRanges(ranges)
        await app.modifyDimensionBroker.setRowHeightAutoFit(ranges)
    }

    window.rowHeightAutoFit = rowHeightAutoFit

    window.rowSameMaxHeight = async function rowSameMaxHeight(ranges) {
        ranges = takeRowRanges(ranges)
        await rowHeightAutoFit(ranges)
        let maxHeight = 0
        await rowRangesRunner(ranges, (i) => {
            maxHeight = Math.max(app.rowHeight(i), maxHeight)
        })
        if (maxHeight > 0) {
            app.modifyDimensionBroker.setRowHeight(ranges, maxHeight)
        }
    }
})();