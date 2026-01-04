// ==UserScript==
// @name        freshgo
// @namespace   Violentmonkey Scripts
// @match       https://freshgo-manage.newhopedairy.cn/orders
// @grant       none
// @version     1.7
// @license MIT
// @author Joey
// @description 2022/3/6 下午12:03:46
// https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/441070/freshgo.user.js
// @updateURL https://update.greasyfork.org/scripts/441070/freshgo.meta.js
// ==/UserScript==
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

var docCookies = {
  getItem: function (sKey) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
            encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'
          ),
          '$1'
        )
      ) || null
    )
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false
    }
    var sExpires = ''
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : '; max-age=' + vEnd
          break
        case String:
          sExpires = '; expires=' + vEnd
          break
        case Date:
          sExpires = '; expires=' + vEnd.toUTCString()
          break
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=' +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '') +
      (bSecure ? '; secure' : '')
    return true
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) {
      return false
    }
    document.cookie =
      encodeURIComponent(sKey) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (sDomain ? '; domain=' + sDomain : '') +
      (sPath ? '; path=' + sPath : '')
    return true
  },
  hasItem: function (sKey) {
    return new RegExp(
      '(?:^|;\\s*)' +
      encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
      '\\s*\\='
    ).test(document.cookie)
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      .split(/\s*(?:\=[^;]*)?;\s*/)
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
    }
    return aKeys
  },
}

console.log('use sc')
// @ts-check
// 计算总数
const headerEl = document.querySelector('.dialog-milk-plan .el-dialog__header')
const btn = document.createElement('button')
btn.classList.add('el-button', 'el-button--medium', 'el-button--primary')
btn.textContent = '总数'
btn.onclick = sum
headerEl.appendChild(btn)

function sum() {
  const rows = document.querySelectorAll(
    '.dialog-milk-plan .table-content tbody tr'
  )
  let sum = 0
  rows.forEach((node) => {
    const cols = node.querySelectorAll('td')
    const countEl = cols[4]
    const count = countEl.textContent
    sum += Number(count) || 0
  })
  btn.textContent = `(总数=${sum})`
}

// enter查询
// let planTimeEl = document.querySelectorAll('.dialog-milk-plan .plan-time input')

// const t = setInterval(() => {
//   console.log('setInterval', planTimeEl, planTimeEl.length)
//   if (planTimeEl.length > 0) {
//     clearInterval(t)
//     planTimeEl.forEach((el) => {
//       el.addEventListener('keydown', (e) => {
//         console.log(e)
//         if (e.code === 'Enter') {
//           const queryBtn = document.querySelector('.dialog-milk-plan .plan-btn')
//           queryBtn && queryBtn.click()
//         }
//       })
//     })
//   } else {
//     planTimeEl = document.querySelectorAll('.dialog-milk-plan .plan-time input')
//   }
// }, 10000)

// 获取token
// const tokenBtn = document.createElement('button')
// tokenBtn.classList.add('el-button', 'el-button--medium', 'el-button--primary')
// tokenBtn.style.cssText += 'position: absolute;top: 0;left: 50%;z-index:999;'
// tokenBtn.textContent = '复制TOKEN到剪切板'
// tokenBtn.onclick = getToken
// document.body.appendChild(tokenBtn)
// function getToken() {
//   // eslint-disable-next-line no-undef
//   let token = Cookies.get('_t')
//   token = 'Bearer ' + token
//   console.log('token:', token)
//   navigator.clipboard.writeText(token).then(() => {
//     if (token.length > 20) {
//       tokenBtn.textContent = '复制成功'
//     }
//   })
// }

// 点击复制

const copyBtn = document.createElement('button')
copyBtn.classList.add('el-button', 'el-button--medium', 'el-button--primary')
copyBtn.style.cssText += 'position: absolute;top: 0;left: 250px;z-index:999;'
copyBtn.textContent = '设置复制'
copyBtn.onclick = setCopy
document.body.appendChild(copyBtn)
function setCopy() {
  // eslint-disable-next-line no-undef
  const table = document.querySelector(
    '.common-table-wrap .el-table table tbody'
  )
  const cells = table.querySelectorAll('td')
  cells.forEach((cell) => {
    cell.addEventListener('click', function (e) {
      console.log(e.target.innerText)
      const text = e.target.innerText
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '设置复制<' + text + '>复制成功'
        })
      }
    })
  })
}

const getDeliveryCountBtn = document.createElement('button')
getDeliveryCountBtn.classList.add(
  'el-button',
  'el-button--medium',
  'el-button--primary'
)
getDeliveryCountBtn.style.cssText +=
  'position: absolute;top: 60px;left: 380px;z-index:999;'
getDeliveryCountBtn.textContent = '设置已配送'
getDeliveryCountBtn.onclick = getCount
document.body.appendChild(getDeliveryCountBtn)

let token = ''

/**
 *
 * @param {*} id
 * @param {HTMLButtonElement} btn
 */
function getDeliveryCount(id, btn) {
  //   console.log(id, btn, token)
  fetch(
    `https://freshgo-api.newhopedairy.cn/app-support/api/v1/backend/orders/v2/redis-detail/${id}?unique=${Date.now()}`,
    {
      headers: {
        authorization: 'Bearer ' + token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data, 'getDeliveryCount')
      const deliveryCount = data.data.mainOrderVo.deliveryCount
      btn.textContent = `已配送:${deliveryCount}`
      navigator.clipboard.writeText(deliveryCount)
    }).catch(error=>{
      console.error(error)
    })
}

function getToken() {
  token = docCookies.getItem('_t')
}

function getCount() {
  if (!token) {
    getToken()
  }
  const tableRows = document.querySelectorAll(
    '.common-table-wrap .el-table__fixed-right table tbody tr'
  )
  tableRows.forEach((row) => {
    const tds = Array.from(row.querySelectorAll('td'))
    const id = tds[2].textContent
    const lastTd = tds[tds.length - 1]
    const cell = lastTd.querySelector('.cell div')
    const spans = Array.from(cell.querySelectorAll('span'))
    const btns = Array.from(cell.querySelectorAll('button'))
    let btn = btns.find((b) => b.textContent.includes('已配送'))
    if (!btn) {
      btn = document.createElement('button')
      btn.classList.add(
        'el-button',
        'el-button--medium',
        'el-button--text',
        'operate-button'
      )
      if (spans.length > 0) {
        cell.insertBefore(btn, spans[0])
      } else {
        cell.appendChild(btn)
      }
    }
    btn.textContent = '已配送'
    btn.onclick = () => getDeliveryCount(id, btn)
  })
}
