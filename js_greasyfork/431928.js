// ==UserScript==
// @name         OKEX行情列表添加币种种类
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.3
// @description  币币的币种种类
// @author       windeng
// @match        https://www.okex.com/markets/spot-list
// @icon         https://www.google.com/s2/favicons?domain=okex.com
// @require      https://greasyfork.org/scripts/433586-simpletools/code/SimpleTools.js?version=977251
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/431928/OKEX%E8%A1%8C%E6%83%85%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E5%B8%81%E7%A7%8D%E7%A7%8D%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/431928/OKEX%E8%A1%8C%E6%83%85%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E5%B8%81%E7%A7%8D%E7%A7%8D%E7%B1%BB.meta.js
// ==/UserScript==

function showToast(msg, doNotFade) {
  let width = 300
  let left = document.body.clientWidth / 2 - width / 2
  let style = `position: fixed; left: ${left}px; top: 80px; width: ${width}px; text-align: center; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

  let span = document.createElement('span')
  span.setAttribute('style', style)
  span.innerText = msg
  document.body.appendChild(span)
  if (!doNotFade) {
    setTimeout(() => {
      document.body.removeChild(span)
    }, 5000)
  }
}

function Get(url, opt = {}) {
  Object.assign(opt, {
    method: 'GET'
  })
  return Request(url, opt)
}

function Post(url, opt = {}) {
  Object.assign(opt, {
    method: 'POST'
  })
  return Request(url, opt)
}

async function getFeeCurrencies() {
  const now = parseInt(new Date().getTime())
  const url = `https://www.okex.com/v2/spot/fee/fee-currencies?t=${now}`
  return Get(url)
}

async function main() {
  await WaitUntil(() => {
    return !!document.querySelector('div.market-table-container')
  })

  let data = await getFeeCurrencies()
  console.log('currencies', data)

  let getCurrencyType = (currency) => {
    if (data.data.feeClass[0].indexOf(currency) != -1) return ['1', '#bf2424']
    else if (data.data.feeClass[1].indexOf(currency) != -1) return ['2', '#00b179']
    else if (data.data.feeClass[2].indexOf(currency) != -1) return ['3', '#F5BD00']
    else return ['-', '#888']
  }

  let trList = document.querySelectorAll('tr[data-id]')
  for (let tr of trList) {
    const symbol = tr.getAttribute('data-id')
    const currency = symbol.split('-')[0]
    const [typeName, color] = getCurrencyType(currency)
    let div = tr.querySelector('td:first-of-type > div.coin-info')
    let span = document.createElement('span')
    span.innerText = typeName
    span.setAttribute('style', `font-size: 0.7em;color: ${color};margin-left: 5px;font-family: consola;border: 2px solid ${color};padding: 0 5px;border-radius: 100%;font-weight: bold;`)
    div.appendChild(span)
  }
}


(function () {
  'use strict';

  // Your code here...
  main()
})();