// ==UserScript==
// @name            shopify-checkout-test
// @namespace       https://github.com/pansong291/
// @version         0.0.3
// @description     Automatically fill in test data on Shopify's checkout page.
// @description:zh  在 Shopify 的结账页面上自动填充测试数据。
// @author          paso
// @license         Apache-2.0
// @match           *://*.myshopify.com/checkouts/*
// @match           *://checkout.shopifycs.com/*
// @icon            data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20109.5%20124.5%22%3E%3Cpath%20fill%3D%22%2395BF47%22%20d%3D%22M74.7%2C14.8c0%2C0-1.4%2C0.4-3.7%2C1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0%2C0%2C0%2C0%2C0%2C0c-0.3%2C0-0.6%2C0-1%2C0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6%2C0.2-12%2C4.5-16.8%2C12.2c-3.4%2C5.4-6%2C12.2-6.7%2C17.5c-6.9%2C2.1-11.7%2C3.6-11.8%2C3.7c-3.5%2C1.1-3.6%2C1.2-4%2C4.5C9.1%2C40.7%2C0%2C111.2%2C0%2C111.2l75.6%2C13.1V14.6C75.2%2C14.7%2C74.9%2C14.7%2C74.7%2C14.8zM57.2%2C20.2c-4%2C1.2-8.4%2C2.6-12.7%2C3.9c1.2-4.7%2C3.6-9.4%2C6.4-12.5c1.1-1.1%2C2.6-2.4%2C4.3-3.2C56.9%2C12%2C57.3%2C16.9%2C57.2%2C20.2zM49.1%2C4.3c1.4%2C0%2C2.6%2C0.3%2C3.6%2C0.9c-1.6%2C0.8-3.2%2C2.1-4.7%2C3.6c-3.8%2C4.1-6.7%2C10.5-7.9%2C16.6c-3.6%2C1.1-7.2%2C2.2-10.5%2C3.2C31.7%2C19.1%2C39.8%2C4.6%2C49.1%2C4.3zM37.4%2C59.3c0.4%2C6.4%2C17.3%2C7.8%2C18.3%2C22.9c0.7%2C11.9-6.3%2C20-16.4%2C20.6c-12.2%2C0.8-18.9-6.4-18.9-6.4l2.6-11c0%2C0%2C6.7%2C5.1%2C12.1%2C4.7c3.5-0.2%2C4.8-3.1%2C4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.8%2C51.8%2C31.4%2C40.1%2C48.2%2C39c6.5-0.4%2C9.8%2C1.2%2C9.8%2C1.2l-3.8%2C14.4c0%2C0-4.3-2-9.4-1.6C37.4%2C53.5%2C37.3%2C58.2%2C37.4%2C59.3zM61.2%2C19c0-3-0.4-7.3-1.8-10.9c4.6%2C0.9%2C6.8%2C6%2C7.8%2C9.1C65.4%2C17.7%2C63.4%2C18.3%2C61.2%2C19z%22%2F%3E%3Cpath%20fill%3D%22%235E8E3E%22%20d%3D%22M78.1%2C123.9l31.4-7.8c0%2C0-13.5-91.3-13.6-91.9c-0.1-0.6-0.6-1-1.1-1c-0.5%2C0-9.3-0.2-9.3-0.2s-5.4-5.2-7.4-7.2V123.9z%22%2F%3E%3C%2Fsvg%3E
// @grant           GM_setValue
// @grant           GM_getValue
// @run-at          document-start
// @require         https://update.greasyfork.org/scripts/473443/1374764/popup-inject.js
// @downloadURL https://update.greasyfork.org/scripts/496317/shopify-checkout-test.user.js
// @updateURL https://update.greasyfork.org/scripts/496317/shopify-checkout-test.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const namespace = 'paso-shopify-checkout-test'
  const qs = document.querySelector.bind(document)
  const defData = {
    email: '1234567890@qq.com',
    countryCode: 'CN',
    firstName: '叙乐',
    lastName: '欧阳',
    address1: '南边大街15号',
    address2: 'A幢5楼',
    city: '东城区',
    zone: 'BJ',
    postalCode: '111000',
    billingAddress: true,
    number: '1',
    expiry: '12 / 2099',
    verification_value: '123',
    name: 'Bogus Gateway',
    '居民身份证编号': '110101200012011238'
  }
  const dataFields = Object.keys(defData)

  if (window.location.host === 'checkout.shopifycs.com') {
    if (window.parent) hookIframe(window.location.pathname.substring(1))
  } else {
    hookMain()
  }

  function hookIframe(field) {
    waitSelector(`#${field}[name=${field}],[name=${field}]`).then((iptElm) => {
      setTimeout((elm) => {
        const data = getStorageData()
        elm.value = data[field] || ''
        dispatchEvent(elm, 'input')
        dispatchEvent(elm, 'change')
      }, 500, iptElm)
    })
  }

  function hookMain() {
    const injectHtml = `
    <div class="table monospace" id="div-table"></div>
    <div class="flex aj-c">
      <button type="button" class="button" id="btn-save">保存</button>
    </div>`
    const injectStyle = `
    <style>
      .popup {
        gap: 4px;
      }
      .aj-c {
        align-items: center;
        justify-content: center;
      }
      .table {
        display: table;
        border-spacing: 8px 4px;
      }
      .table-row {
        display: table-row;
      }
      .table-cell {
        display: table-cell;
      }
      .align-right {
        text-align: right;
      }
      .input[readonly] {
        color: #888;
      }
    </style>`
    document.addEventListener('DOMContentLoaded', () => {
      window.paso.injectPopup({
        namespace,
        actionName: 'Checkout Test',
        collapse: '80%',
        content: injectHtml,
        style: injectStyle
      }).then((result) => {
        const { container, popup } = result.elem
        const { createElement } = result.func
        const element = {
          div_table: popup.querySelector('#div-table'),
          btn_save: popup.querySelector('#btn-save')
        }
        const data = getStorageData()
        const inputs = []
        for (const field of dataFields) {
          const ipt = createElement('input', { class: 'input', name: field })
          if (field === 'billingAddress') ipt.setAttribute('readonly', 'readonly')
          ipt.value = data[field]
          element.div_table.append(createElement('div', { class: 'table-row' }, [
            createElement('div', { class: 'table-cell align-right' }, [field]),
            createElement('div', { class: 'table-cell' }, [ipt])
          ]))
          inputs.push(ipt)
        }
        element.btn_save.addEventListener('click', () => {
          const d = {}
          inputs.forEach((ipt) => d[ipt.name] = ipt.value)
          GM_setValue(namespace, d)
          container.classList.remove('open')
        })
      })
    })
    waitSelector('#shippingAddressForm > div > div:first-child, #billingAddressForm > div > div:first-child').then((div) => {
      const fillData = createDebounce(() => {
        const data = getStorageData()
        for (const field of dataFields) {
          const iptElm = qs(`[name=${field}]`)
          if (!iptElm) continue
          if (iptElm.tagName.toLowerCase() === 'select') {
            iptElm.value = data[field]
            dispatchEvent(iptElm, 'change')
          } else if (iptElm.type === 'checkbox') {
            iptElm.checked = !!data[field]
            dispatchEvent(iptElm, 'change')
          } else {
            iptElm.value = data[field]
            dispatchEvent(iptElm, 'input')
            dispatchEvent(iptElm, 'change')
          }
        }
        let elm = qs('#basic')
        while (elm) {
          if (elm.tagName.toLowerCase() === 'section') break
          elm = elm.parentElement
        }
        if (elm) {
          const idCardObr = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
              m.addedNodes?.forEach((n) => {
                if (n.tagName.toLowerCase() === 'section') {
                  const ipt = n.querySelector('[name=居民身份证编号]')
                  if (ipt) {
                    ipt.value = data['居民身份证编号']
                    dispatchEvent(ipt, 'input')
                    dispatchEvent(ipt, 'change')
                  }
                }
              })
            })
          })
          idCardObr.observe(elm, { childList: true })
        }
      })
      const divObr = new MutationObserver(() => {
        divObr.disconnect()
        fillData()
      })
      divObr.observe(div, { childList: true })
      fillData()
    })
  }

  function dispatchEvent(elm, type) {
    elm.dispatchEvent(new InputEvent(type, { bubbles: true }))
  }

  function createDebounce(func, ms = 500) {
    let delayId
    return function (...args) {
      clearTimeout(delayId)
      delayId = setTimeout(() => {
        func.apply(this, args)
      }, ms)
    }
  }

  function getStorageData() {
    return GM_getValue(namespace, defData)
  }

  function waitSelector(selector) {
    return new Promise((resolve) => {
      const loopId = setInterval(() => {
        const elm = qs(selector)
        if (elm) {
          clearInterval(loopId)
          resolve(elm)
        }
      }, 500)
    })
  }
})()
