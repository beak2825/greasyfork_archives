// ==UserScript==
// @name         蜜柑计划批量复制磁链
// @namespace    nekomoyi.mikancopy
// @version      1.0
// @description  为番剧独立页面添加批量复制磁链的功能
// @match        https://mikanani.me/Home/Bangumi/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483001/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/483001/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function processTable(table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            var selectBox = document.createElement('td');
            selectBox.innerHTML = '<input type="checkbox" />';
            row.insertBefore(selectBox, row.firstChild);
        });

        var theadRow = table.querySelector('thead tr');
        var selectAllBox = document.createElement("input")
        selectAllBox.type = "checkbox";
        selectAllBox.onclick = function() {
            var rows = table.querySelectorAll('tbody tr');
            rows.forEach(function(row) {
                row.querySelector('input[type="checkbox"]').checked = selectAllBox.checked;
            });
        }
        var selectAllTh = document.createElement('th');
        selectAllTh.appendChild(selectAllBox);
        theadRow.insertBefore(selectAllTh, theadRow.firstChild);

        var controlBar = table.previousElementSibling;
        var subscribeButton = controlBar.querySelector('a.subgroup-subscribe');
        var copyButton = document.createElement('a');
        copyButton.classList.add('pull-right' ,'subgroup-subscribe');
        copyButton.textContent = '复制选中';
        copyButton.style.paddingLeft = '10px';
        copyButton.onclick = function() {
            var rows = table.querySelectorAll('tbody tr');
            var magnetLinks = [];
            rows.forEach(function(row) {
                var checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                    var magnetLink = row.querySelector('a.js-magnet').getAttribute('data-clipboard-text');
                    magnetLink = magnetLink
                    magnetLinks.push(magnetLink);
                }
            });
            var magnetLinksText = magnetLinks.join('\n');
            console.log(magnetLinksText)
            navigator.clipboard.writeText(magnetLinksText);
        }
        controlBar.insertBefore(copyButton, subscribeButton);
    }

    var tables = document.querySelectorAll('#sk-container > div.central-container > table.table-striped.tbl-border.fadeIn');
    tables.forEach(function(table) {
        processTable(table);
    });
})();