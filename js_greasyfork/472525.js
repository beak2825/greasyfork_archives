// ==UserScript==
// @name         【zPortal】CRM发票功能扩展
// @namespace    http://hndx.fcsys.eu.org/
// @version      2025.0414
// @description  为 ZTE zPortal 启用 CRM 发票重打以及作废功能
// @author       xRetia
// @license      MIT
// @match        *://crm.zcm.cloudns.ch:*/portal-web/*
// @match        *://crm.hnx.ctc.com:*/portal-web/*
// @match        *://web.portal.crm.bss.it.hnx.ctc.com:*/portal-web/*
// @icon         http://hn.189.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/472525/%E3%80%90zPortal%E3%80%91CRM%E5%8F%91%E7%A5%A8%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/472525/%E3%80%90zPortal%E3%80%91CRM%E5%8F%91%E7%A5%A8%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(()=> {
        var invoicePrintView = document.querySelector('div[menuurl="accounting/modules/percash/invoice/views/invoicePrintView"]');
        var invoiceRecBtn = window.invoiceRec;
        // 如果发票作废是隐藏的，则表示未修改
        if (invoicePrintView && invoiceRecBtn && invoiceRecBtn.style.display === "none") {
            var $invoiceBtns = document.querySelectorAll('.acct-invoice-heading .text-left button');
            for (var i=0; i<$invoiceBtns.length; i++) {
				$invoiceBtns[i].style.display = "initial";
            }
        }
    }, 1000);
})();