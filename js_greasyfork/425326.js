// ==UserScript==
// @name         sales-coinlist-purchase-script
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  可以自定义币种，默认为 USDC；可以开启 debug 模式，此时需要先修改 debug 为 true 后再手动将代码复制并粘贴到离线下单页面的控制台，并回车运行。
// @author       zz
// @match        https://queue.coinlist.co/*
// @match        https://sales.coinlist.co/*/purchase
// @match        https://sales.coinlist.co/*/payment/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425326/sales-coinlist-purchase-script.user.js
// @updateURL https://update.greasyfork.org/scripts/425326/sales-coinlist-purchase-script.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 币种：ETH | BTC | USDC | USDT 之中选一个
  var fund = 'USDC'
  // debug：true 则自动运行测试 purchase 页面的函数，正式使用记得修改回 false ，默认关闭
  // 另外，在 debug 为 true 的时候，可以直接全选脚本代码，粘贴到本地下单页面的控制台，回车测试运行
  var debug = false
  // 延迟页面自动下单时间（ms），以防被识别
  var deltaTime = 5e3

  // 下面的不用改
  const version = '1.1.4'
  function inform (msg) { console.log(`%c${msg}`, 'background-color: yellow; font-size: 16px;') } 
  function purchase () {
    inform('ready to run purchase')
    var committed_amount = document.getElementById('investment_committed_amount')
    var funds = document.querySelector('.investments-new-payment_options .c-input-group')
    var new_terms = document.querySelector('.simple_form>.investments-new-terms>.investments-new-agreements_form')
    var commit = document.querySelector('.simple_form>input[name=commit]')
    if (committed_amount && funds && new_terms && commit) {
      // amount
      var amount_block = document.querySelector('.s-grid .u-colorGray6')
      var amount = amount_block.innerText.match(/\$[\d,\.]+/g)[1].replace('$', '')
      committed_amount.setAttribute('value', amount)
      committed_amount.value = amount
      committed_amount.addEventListener('blur', () => {
        committed_amount.setAttribute('value', amount)
        committed_amount.value = amount
      })
      // fund
      var fund_labels = [...funds.children].filter(el => el.tagName === 'LABEL')
      fund_labels.find(el => el.querySelector('.u-displayBlock').innerText === fund).click()
      // label
      var labels = [...new_terms.children].filter(el => el.tagName === 'LABEL')
      labels.forEach(el => el.click())
      // button
      commit.removeAttribute('disabled')
      commit.setAttribute('value', `purchase $${amount}.00`)
      commit.value = ('value', `purchase $${amount}.00`)
      commit.click()
    }
  }
  function payment () {
    inform('ready to run payment')
    var txt = document.body.innerText
    if (txt.match(/Receiving funds/) || txt.match(/Your investment is complete/)) {
      alert('下单成功')
    } else {
      inform('purchase error')
    }
  }
  function lineup () {
    inform('ready to run lineup')
    var comfirmRedirectModal = document.getElementById('divConfirmRedirectModal')
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          if (comfirmRedirectModal.style.display !== "none") {
            var btn = comfirmRedirectModal.querySelector('button')
            btn.click()
          }
        }
      })
    })
    observer.observe(comfirmRedirectModal, {
      attributes: true,
      attributeFilter: ['style'],
    })
  }
  function match () {
    if (location.href.match(/sales\.coinlist\.co\/.+?\/purchase/)) {
      setTimeout(() => purchase(), deltaTime)
    } else if (location.href.match(/sales\.coinlist\.co\/.+?\/payment\/.+/)) {
      payment()
    } else if (location.href.match(/queue\.coinlist\.co\/.+/)) {
      var h2 = document.querySelector('#content #lbHeaderH2')
      if (h2 && h2.innerText.includes('You are in the')) {
        lineup()
      } else {
        inform('queue.coinlist.co page DOM structure does not meet the requirements')
      }
    } else {
      inform('no match url')
    }
  }
  inform(`sales-coinlist-purchase-script version ${version} activated`)
  var called = false
  window.onload = () => {
    if (!called) {
      called = true
      inform(`sales-coinlist-purchase-script version ${version} loaded`)
      match()
    }
  }
  if (debug) {
    if (!called) {
      called = true
      inform(`sales-coinlist-purchase-script version ${version} loaded (debug mode)`)
      purchase()
    }
  }
})();