// ==UserScript==
// @name ACM Online Judge 评测状态自动刷新
// @namespace https://ns.altk.org/userscript
// @description 在评测时监测，并在评测完成后自动刷新评测状态
// @include https://acm.sjtu.edu.cn/OnlineJudge/code*
// @version 0.1
// @grant none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/434299/ACM%20Online%20Judge%20%E8%AF%84%E6%B5%8B%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/434299/ACM%20Online%20Judge%20%E8%AF%84%E6%B5%8B%E7%8A%B6%E6%80%81%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

; {

const STATUS_SELECTOR = '#status_list tbody td:nth-child(4)'
const PENDING_REGEXP = /Running & Judging|Pending/i
const REFRESH_INTERVAL = 2000
const REFRESH_TIMEOUT = 5000

const isPending = (doc = document) => PENDING_REGEXP.test(doc.querySelector(STATUS_SELECTOR).innerText)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms, true))

const monitor = async () => {
  while (true) {
    await delay(REFRESH_INTERVAL)
    const xhr = new XMLHttpRequest()
    xhr.open('GET', location.href)
    xhr.responseType = 'document'
    const response = new Promise((resolve, reject) => {
      setTimeout(reject, REFRESH_TIMEOUT, 'Timeout exceeded.')
      xhr.onload = () => resolve(xhr.responseXML)
      xhr.onerror = reject
    })
    xhr.send()
    try {
      const doc = await response
      if (!isPending(doc)) {
        location.reload()
        return
      }
    } catch (e) {
      sweetAlert('ACMOJ Helper: Network Error', `${e}`, 'error')
    }
  }
}

if (isPending()) monitor()
else console.log('[ACMOJ Helper] Not pending, not monitoring.')

}
