// ==UserScript==
// @name         Send Super Bill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this will allow you to have a button to automatically send SuperBills
// @author       🛠️ with ❤ by @rocketdv
// @match        *://*.theranest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492797/Send%20Super%20Bill.user.js
// @updateURL https://update.greasyfork.org/scripts/492797/Send%20Super%20Bill.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let tableObserver

  let previousUrl = ''
  const urlObserver = new MutationObserver(mutations => {
    if (location.href !== previousUrl) {
      // always disconnect the previous observer on page change
      if (tableObserver) {
        tableObserver.disconnect()
        tableObserver = null
      }

      previousUrl = location.href;
      if (/fully-paid-invoices/.test(location.href)) {
        handleTable()
      }
    }
  });
  urlObserver.observe(document, { subtree: true, childList: true })

  const handleTable = () => {
    if (tableObserver) return
    tableObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        // console.log(mutation)
        // console.log(mutation.target.classList.contains('k-master-row'))
        const nodes = [mutation.target, ...mutation.addedNodes]
        for (const node of nodes) {
          if (node.nodeName !== 'TR') continue
          if (!node.querySelector('[data-aqa="invoiceDate"]')) continue

          const actionCol = node.querySelector('td[data-aqa="actions"]')
          if (!actionCol || actionCol.querySelector('.superbill-btn')) continue

          const innerButton = actionCol.querySelector('[data-aqa="linkPrintSuperbill"]')
          const invoiceId = innerButton.href.match(/invoiceId=(\w+)/)[1]
          const button = document.createElement('button')
          button.innerText = 'Send Superbill'
          button.setAttribute('class', 'ui small button h6_q au6_avc superbill-btn')
          button.setAttribute('data-invoice-id', invoiceId)
          actionCol.appendChild(button)
        }
      }
    })
    tableObserver.observe(document.body, { subtree: true, childList: true })
  }

  document.body.addEventListener('click', evt => {
    const btn = evt.target
    if (!btn.classList.contains('superbill-btn')) return
    const invoiceId = btn.getAttribute('data-invoice-id')

    fetch("/api/ledger/sendInvoice", {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId,
        sendCopyToStaff: true,
        isSuperbill: true
      }),
      method: 'POST'
    })
      .then(resp => resp.json())
      .then(data => {
        if (!data) {
          evt.target.style.backgroundColor = '#73CF65'
          return setTimeout(() => { evt.target.style.backgroundColor = 'transparent' }, 5_000)
        }
        if (data.Message && /Errors/.test(data.Message)) {
          evt.target.style.backgroundColor = '#DE4E55'
          return setTimeout(() => { evt.target.style.backgroundColor = 'transparent' }, 5_000)
        }
      })
  })
})();