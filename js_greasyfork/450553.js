// ==UserScript==
// @name         Weee Helper
// @author       jerryc05
// @namespace    https://github.com/jerryc05
// @supportURL   https://github.com/jerryc05/Weee-Helper
// @version      5
// @description  Some Weee helpers
// @match        https://sayweee.com/*
// @match        https://*.sayweee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sayweee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450553/Weee%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/450553/Weee%20Helper.meta.js
// ==/UserScript==


(() => {
  'use strict'
  let tIgn = false

  function throttle(f, t) {
    if (tIgn) return
    tIgn = true
    setTimeout(() => {
      f()
      tIgn = false
    }, t)
  }
  new MutationObserver(() => throttle(() => {
    function parsePrice(x) {
      const p = parseFloat(x.querySelector('[class*="producsPrice"]').lastChild.textContent)
      const b = x.querySelector('[class*="basePrice_"]')
      return [p, b ? parseFloat(b.lastChild.textContent) : null]
    }

    // show discount rate
    setTimeout(() => {
      for (let x of document.querySelectorAll('[class*="ProductCard_label_"]')) {
        if (!x.textContent.includes('Off') || x.textContent.includes('(')) continue
        while (x.tagName.toLowerCase() !== 'a') x = x.parentNode
        const [p, b] = parsePrice(x)
        if (!b) continue
        const l = x?.querySelector('[class*="label_"]')
        if (!l) continue
        l.textContent = `${parseFloat(((b - p) / b * 100).toFixed(2))}% ($${parseFloat((b - p).toFixed(2))}) Off`
        l.style.fontWeight = 'bold'
        l.style.backgroundColor = 'red'
      }
    }, 0)

    // show total amount in cart
    setTimeout(() => {
      const c = document.querySelector('[class*="miniCartInHeaderText_"]')
      if (!c || c.textContent.includes('  ')) return
      c.textContent += '  '
      fetch('https://api.sayweee.net/ec/so/porder/v3', {
        headers: { 'Authorization': `Bearer ${document.cookie.match(/auth_token=([^;]+)/)[1]}` }
      }).then(x => x.json())
        .then(x => {
          c.textContent += `$${x.object.total_price}`
        })
    }, 0)

    // remove refer text
    setTimeout(() => document.querySelector('[class*="referFriendText_"]')?.remove(), 0)

    // sort by discount rate/amount
    if (window.location.pathname.includes('category/')) setTimeout(() => {
      const ID = 'discount_sort'
      if (document.getElementById(ID)) return
      const h = document.querySelector('[class*="category_resultHeader_"]')
      if (!h) return
      const DEFAULT = 'Default'
      const s = document.createElement('select')
      s.id = ID
      for (const x of [DEFAULT, 'Discount %', 'Discount $']) {
        const l = document.createElement('option')
        l.text = x
        l.value = x
        if (x === DEFAULT) l.selected = true
        s.append(l)
      }
      s.onchange = () => {
        if (s.value === DEFAULT) return
        const items = document.querySelector('[class*="listContent_"]');
        [...items.children]
          .sort((a, b) => {
            const [p1, b1] = parsePrice(a)
            const [p2, b2] = parsePrice(b)
            if (!b2) return 0
            if (!b1) return 1
            return s.value.includes('%')
              ? ((p1 - b1) / p1) - ((p2 - b2) / p2)
              : (p1 - b1) - (p2 - b2)
          })
          .forEach(x => items.appendChild(x))
      }
      h.insertBefore(s, h.lastChild)
    }, 0)

  }, 1000)).observe(document.body, { childList: true, subtree: true })
})()
