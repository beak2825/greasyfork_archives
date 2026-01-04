// ==UserScript==
// @name         为宝专门制作的脚本
// @namespace    none
// @version      0.1.1
// @description  try to take over the world!
// @author       74sharlock
// @match        http://123.59.58.221:2000/Forwarder/Freight/ReceivableInvoiceAudit/F_ReceivableInvoiceAuditPage.aspx?modulecode=ReceivableInvoiceSH&modulename=%e5%ba%94%e6%94%b6%e5%8f%91%e7%a5%a8%e5%8f%b0%e8%b4%a6
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387400/%E4%B8%BA%E5%AE%9D%E4%B8%93%E9%97%A8%E5%88%B6%E4%BD%9C%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/387400/%E4%B8%BA%E5%AE%9D%E4%B8%93%E9%97%A8%E5%88%B6%E4%BD%9C%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    document.addEventListener(
      'DOMContentLoaded',
      function() {
        let observerOptions = {
          characterData: true,
          childList: true,
          subtree: true
        };
        let observe = new MutationObserver(() => {
          let targetInput = document.querySelector('input[name="YJDATE"]');
          let relationInput = document.querySelector('input[name="INVOICECODE"]');
          if (targetInput && !targetInput.bindAutoCompleted) {
            targetInput.onfocus = () => {
              if (
                relationInput.value.trim() !== '' &&
                targetInput.value.trim() === ''
              ) {
                let d = new Date();
                let year = d.getFullYear();
                let month = d.getMonth() + 1;
                let day = d.getDate();
                month = month < 10 ? `0${month}` : month;
                day = day < 10 ? `0${day}` : day;
                targetInput.value = `${year}-${month}-${day}`;
              }
            };
            targetInput.bindAutoCompleted = true;
          }
        });
    
        observe.observe(document.body, observerOptions);
      },
      false
    );
})();