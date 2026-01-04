// ==UserScript==
// @name        亚马逊中国Kindle下载所有内容
// @description 在亚马逊中国的“管理我的内容和设备”页面增加“下载本页所有内容”和“更新本页所有书籍”按钮，便于备份和更新你买过的 Kindle 书籍。
// @version 20220806.0
// @match       https://www.amazon.cn/gp/digital/fiona/manage*
// @match       https://www.amazon.cn/mn/dcw/myx.html*
// @grant       none
// @run-at document-idle
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/445943/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BDKindle%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/445943/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BDKindle%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms))

/**
 *
 * @returns {Promise<any>}
 */
async function waitGetElement(/** @type {ParentNode} */ root, /** @type {string} */ selector) {
  while (true) {
    const result = root.querySelector(selector)
    if (result) {
      return result
    }
    await sleep(2000)
  }
}

async function waitElementDisappear(/** @type {ParentNode} */ root, /** @type {string} */ selector) {
  while (true) {
    const result = root.querySelector(selector)
    if (result) {
      await sleep(2000)
    }
    return
  }
}

/**
 *
 * @param {HTMLDivElement} div
 */
async function downloadBook(div) {
  const /** @type {HTMLButtonElement} */ actionButton = await waitGetElement(div, '[aria-label="actions"]')
  actionButton.click()
  console.debug('click action')

  const /** @type {HTMLDivElement} */ downloadLink = await waitGetElement(div, 'div#contentAction_download_myx')
  downloadLink.click()
  console.debug('click download')

  await waitGetElement(document, '#ui_dialog_myx_popover_section')
  console.debug('get popup')

  const /** @type {HTMLButtonElement} */ confirmDownload = await waitGetElement(
    document,
    '#ui_dialog_myx_popover_footer .myx-button-primary',
  )
  confirmDownload.click()
  console.debug('click confirm')

  await waitElementDisappear(document, '.dialogBackdrop_myx')
}

async function refreshBook(div) {
  div.click()
  console.debug('click refresh')
  document.getElementById('dialogButton_ok_myx ').click()
  console.debug('click confirm')
}

async function downloadAllBooksOnPage() {
  const /** @type {HTMLDivElement[]} */ books = Array.from(
    document.querySelectorAll('div.contentTableListRow_myx.ng-scope'),
  )
  for (const book of books) {
    await downloadBook(book)
    await sleep(15000)
  }
}

async function refreshAllBooksOnPage() {
  const /** @type {HTMLDivElement[]} */ books = Array.from(
    document.querySelectorAll('div.contentBadge_myx.updateAvailableBadge'),
  )
  for (const book of books) {
    await refreshBook(book)
    await sleep(2000)
  }
  console.debug('refresh click')
}

async function addDownloadAllButton() {
  const /** @type {HTMLDivElement} */ buttonsDiv = await waitGetElement(document, '.myx-spacing-top-mini')
  const downloadAllButton = document.createElement('button')
  downloadAllButton.addEventListener('click', downloadAllBooksOnPage)
  downloadAllButton.className = 'inline_myx button_myx myx-button'
  downloadAllButton.style.marginLeft = '5px'
  downloadAllButton.style.paddingLeft = '5px'
  downloadAllButton.style.paddingRight = '5px'
  downloadAllButton.style.background = '-webkit-linear-gradient(top,#f7f8fa,#e7e9ec)'
  downloadAllButton.innerText = '下载本页所有内容'
  buttonsDiv.appendChild(downloadAllButton)
}

async function addRefreshAllButton() {
  const /** @type {HTMLDivElement} */ buttonsDiv = await waitGetElement(document, '.myx-spacing-top-mini')
  const refreshAllButton = document.createElement('button')
  refreshAllButton.addEventListener('click', refreshAllBooksOnPage)
  refreshAllButton.className = 'inline_myx button_myx myx-button'
  refreshAllButton.style.marginLeft = '5px'
  refreshAllButton.style.paddingLeft = '5px'
  refreshAllButton.style.paddingRight = '5px'
  refreshAllButton.style.background = '-webkit-linear-gradient(top,#f7f8fa,#e7e9ec)'
  refreshAllButton.innerText = '更新本页所有内容'
  buttonsDiv.appendChild(refreshAllButton)
}

addDownloadAllButton()
addRefreshAllButton()
