// ==UserScript==
// @name        亚马逊中国Kindle下载所有内容(新版)
// @description 在亚马逊中国的“管理我的内容和设备”页面增加“下载本页所有内容”，便于下载你买过的 Kindle 书籍。建议搭配下载文件不弹出自动保存使用。
// @version 20240414
// @match       https://www.amazon.cn/hz/mycd/digital-console/contentlist/booksAll/dateDsc/*
// @license MIT
// @author       shxuai
// @namespace https://greasyfork.org/users/533430
// @downloadURL https://update.greasyfork.org/scripts/491467/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BDKindle%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491467/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BDKindle%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%86%85%E5%AE%B9%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms))

/**
 *
 * @returns {Promise<any>}
 */

async function download(/** @type {int} */ index) {
    document.querySelectorAll('span[id^=download_and_transfer_list_]')[index].click()
    document.querySelectorAll('div[id$=CONFIRM][id^=DOWNLOAD_AND_TRANSFER_ACTION]')[index].click()
}




async function waitGetElement(/** @type {ParentNode} */ root, /** @type {string} */ selector) {
  while (true) {
    const result = root.querySelector(selector)
    if (result) {
      return result
    }
    await sleep(1000)
  }
}

async function waitGetElementAll(/** @type {ParentNode} */ root, /** @type {string} */ selector) {
  while (true) {
    const result = root.querySelectorAll(selector)
    if (result) {
      return result
    }
    await sleep(1000)
  }
}

async function waitElementDisappear(/** @type {ParentNode} */ root, /** @type {string} */ selector) {
  while (true) {
    const result = root.querySelector(selector)
    if (result) {
      await sleep(2000)
      continue;
    }
    return
  }
}


/**
 *
 * @param {HTMLDivElement} div
 */



async function downloadAllBooksOnPage() {
    const /** @type {HTMLDivElement} */ downloadAllButton = await waitGetElement(document, '#downloadAllButton')
    downloadAllButton.innerText = '请等待15秒后开始下载'
    
    
    
    for (let index = 0; index < document.querySelectorAll('span[id^=download_and_transfer_list_]').length; index++) {
        await sleep(15000)
        await download(index)
        const /** @type {HTMLDivElement} */ notificationClose = await waitGetElement(document, '#notification-close')
        notificationClose.click()
        downloadAllButton.innerText = '自动下载中，请勿操作，已完成' + (index + 1) + '/' + document.querySelectorAll('span[id^=download_and_transfer_list_]').length
    }
    
    downloadAllButton.innerText = '已完成本页下载，点击重新开始下载'

}



async function addDownloadAllButton() {
   const /** @type {HTMLDivElement} */ buttonsDiv = await waitGetElement(document, '#CONTENT_TASK_BAR .view-filter')
 // const /** @type {HTMLDivElement} */ buttonsDiv = await document.querySelectorAll('.content-filter-item.view-filter')[document.querySelectorAll('.content-filter-item.view-filter').length - 1]
  const downloadAllButton = document.createElement('button')
  downloadAllButton.addEventListener('click', downloadAllBooksOnPage)
  downloadAllButton.className = 'action_button'
  downloadAllButton.id = 'downloadAllButton'
  downloadAllButton.style.marginLeft = '5px'
  downloadAllButton.style.paddingLeft = '5px'
  downloadAllButton.style.paddingRight = '5px'
  downloadAllButton.style.background = '-webkit-linear-gradient(top,#f7f8fa,#e7e9ec)'
  downloadAllButton.innerText = '下载本页所有内容'
  buttonsDiv.appendChild(downloadAllButton)

  await waitElementDisappear(document, '#CONTENT_LIST');
  reAddDownloadAllButton();
}

async function reAddDownloadAllButton() {
    await waitGetElement(document, '#CONTENT_LIST');
    addDownloadAllButton()
}



addDownloadAllButton()

