// ==UserScript==
// @name         qbittorrent 状态栏显示数量和大小
// @name:en      show counts and sizes of selected for qBittorrent
// @namespace    localhost
// @version      2024-01-31
// @description  在 webUI 状态栏显示选中种子信息
// @description:en  show counts and sizes of selected torrents.
// @author       flashlab
// @match        http://127.0.0.1:8080/
// @icon         https://www.qbittorrent.org/favicon.ico
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/484895/qbittorrent%20%E7%8A%B6%E6%80%81%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%95%B0%E9%87%8F%E5%92%8C%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484895/qbittorrent%20%E7%8A%B6%E6%80%81%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%95%B0%E9%87%8F%E5%92%8C%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

/* globals torrentsTable */

(function() {
    'use strict';

    window.addEventListener('load', function () {
        const states= ['size', 'total_size', 'unique_size', 'uploaded'];
        var statusKey = states[0];
        // update info
        function updateSelected() {
            const statusTd = document.getElementById("selectedStatus");
            if (!statusTd) return;
            const selectedRows = torrentsTable.selectedRowsIds();
            const rows = torrentsTable.getFilteredAndSortedRows();
            var counts = 0;
            var sizes;
            var readableSize;
            if (statusKey.startsWith("unique")) {
                const rawSizes = selectedRows.map(hash => rows[hash].full_data.size);
                sizes = [...new Set(rawSizes)].reduce((sum, size) => {
                    ++counts;
                    return (sum + size)
                }, 0)
            } else {
                counts = selectedRows.length;
                sizes = selectedRows.reduce(
                    (sum, hash) => rows[hash].full_data[statusKey] + sum, 0
                )
            }
            readableSize = unsafeWindow.qBittorrent.Misc.friendlyUnit(sizes);
            statusTd.textContent = `${readableSize} ${statusKey} of ${counts}`
            statusTd.title = `${sizes} bytes`
        }
        (function main() {
            let statusTd = document.getElementById("selectedStatus");
            if (statusTd) return;
            const footerow = document.querySelector("#desktopFooter > table > tbody > tr");
            const bar = document.createElement("td");
            bar.className = "statusBarSeparator";
            footerow.insertAdjacentElement("afterbegin", bar);
            const info = document.createElement("td");
            info.id = "selectedStatus";
            info.textContent = "点击切换显示方式"
            info.style.cursor = "pointer";
            statusTd = footerow.insertAdjacentElement("afterbegin", info);
            // switch event
            statusTd.onclick = (() => {
                let i = 0;
                return function(){
                    i = ++i%states.length;
                    statusKey = states[i];
                    updateSelected();
                };
            })();
            if (typeof torrentsTable == 'undefined' || !torrentsTable.onSelectedRowChanged || torrentsTable.customOnSelectedRowChanged) return
            torrentsTable.customOnSelectedRowChanged = torrentsTable.onSelectedRowChanged;
            torrentsTable.onSelectedRowChanged = () => {
                torrentsTable.customOnSelectedRowChanged();
                updateSelected()
            }
            torrentsTable.customSelectAll = torrentsTable.selectAll;
            torrentsTable.selectAll = () => {
                torrentsTable.customSelectAll();
                updateSelected()
            }
        })();
    })
})();