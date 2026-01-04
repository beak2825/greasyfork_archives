// ==UserScript==
// @name         MEST Quick Filter
// @namespace    joyings.com.cn
// @version      0.4.1
// @description  click cell to search
// @author       zmz125000
// @match        http://*/mest/*
// @icon         http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/452603/MEST%20Quick%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/452603/MEST%20Quick%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    addClickActions();
    addObserverIfDesiredNodeAvailable();

    function unsecuredCopyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }

    function getElementsByXPath(xpath, parent) {
        let results = [];
        let query = document.evaluate(xpath, parent || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        }
        return results;
    }

    function addObserverIfDesiredNodeAvailable() {
        var composeBox = document.querySelectorAll('[class="el-tabs__item is-top is-active is-closable"]')[0];
        if (!composeBox) {
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable, 500);
            return;
        }
        var config = {
            attributes: true,
        };
        var composeObserver = new MutationObserver(function () {
            window.setTimeout(addClickActions, 500);
            composeObserver.disconnect();
            addObserverIfDesiredNodeAvailable();
        });
        composeObserver.observe(composeBox, config);
    }

    function addClickActions() {
        var tableCount = document.querySelectorAll('[class="has-gutter"]').length - 2;
        var tableIndex = tableCount >= 0 ? tableCount : 0;
        var tableElements = document.querySelectorAll("table.el-table__body");
        var headerElement = document.querySelectorAll('[class="has-gutter"]')[tableIndex];

        for (let table of tableElements) {
            table.lastChild.addEventListener('click', function (e) {
                const cell = e.target.closest('td');
                if (!cell) {
                    return;
                } // Quit, not clicked on a cell
                let sval = cell.childNodes[0].innerText;
                unsecuredCopyToClipboard(sval);
                let sbtn = null;
                if (getElementsByXPath("//span[.=' 查询 ']")[0]) {
                    sbtn = getElementsByXPath("//span[.=' 查询 ']")[0].parentElement;
                } else if (getElementsByXPath("//span[.='搜索']")[0]) {
                    sbtn = getElementsByXPath("//span[.='搜索']")[0].parentElement;
                } else if (getElementsByXPath("//span[.=' 搜 索 ']")[0]) {
                    sbtn = getElementsByXPath("//span[.=' 搜 索 ']")[0].parentElement;
                }
                let obox = null;

                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('生产单号')) {
                    obox = document.querySelector('[placeholder*="生产单号"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('工序名称')) {
                    obox = document.querySelector('[placeholder*="工序名称"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('最终成品')) {
                    obox = document.querySelector('[placeholder="成品名称"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('商品名称')) {
                    obox = document.querySelector('[placeholder="成品名称"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('商品别名')) {
                    obox = document.querySelector('[placeholder*="成品别名"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML.includes('订单号')) {
                    obox = document.querySelector('[placeholder*="订单号"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML == '存货名称') {
                    obox = document.querySelector('[placeholder*="存货名称"]');
                }
                if (headerElement.firstChild.childNodes[cell.cellIndex].firstChild.innerHTML == '别名') {
                    obox = document.querySelector('[placeholder*="存货别名"]');
                }
                if (!obox) {
                    return;
                }
                unsecuredCopyToClipboard(sval);
                obox.value = sval;
                obox.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                //sbtn.click();
            });
        }
    }
})();